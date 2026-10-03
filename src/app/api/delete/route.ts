import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export const runtime = "edge";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        }

        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;
        const branch = process.env.GITHUB_BRANCH || 'main';

        let path = '';
        if (url.includes('raw.githubusercontent.com')) {
            const parts = url.split('/');
            // https://raw.githubusercontent.com/owner/repo/main/uploads/filename.ext
            // parts[5] is branch, parts[6] onwards is the path
            const branchIndex = parts.indexOf(branch);
            if (branchIndex !== -1 && branchIndex >= 5) {
                path = parts.slice(branchIndex + 1).join('/');
            }
        } else if (url.includes('cdn.jsdelivr.net/gh/')) {
            const parts = url.split('@' + branch + '/');
            if (parts.length > 1) {
                path = parts[1];
            }
        }

        if (!path) {
            // Try to extract from github.com/.../blob/main/path
            if (url.includes('github.com') && url.includes('/blob/')) {
                const parts = url.split(`/blob/${branch}/`);
                if (parts.length > 1) {
                    path = parts[1];
                }
            }
        }

        if (!path) {
            console.error("Could not extract path from:", url);
            return NextResponse.json({ error: 'Could not extract path from URL' }, { status: 400 });
        }

        let fileSha = '';
        try {
            const { data } = await octokit.repos.getContent({
                owner,
                repo,
                path,
                ref: branch
            });
            if (!Array.isArray(data) && 'sha' in data) {
                fileSha = data.sha;
            }
        } catch (e) {
            console.error("File not found on GitHub, might be already deleted", e);
            return NextResponse.json({ success: true, message: 'File not found on GitHub, ignored' });
        }

        if (fileSha) {
            await octokit.repos.deleteFile({
                owner,
                repo,
                path,
                message: `Delete file via SMART LOCKER dashboard: ${path}`,
                sha: fileSha,
                branch
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed', details: error?.message || String(error) }, { status: 500 });
    }
}
