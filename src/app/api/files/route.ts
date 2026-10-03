import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export const runtime = "edge";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export async function GET() {
    try {
        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;
        const branch = process.env.GITHUB_BRANCH || 'main';

        const response = await octokit.repos.getContent({
            owner,
            repo,
            path: 'uploads',
            ref: branch
        });

        const files = Array.isArray(response.data) ? response.data : [response.data];
        
        // Filter out non-files (like directories)
        const uploadedFiles = files
            .filter((f: any) => f.type === 'file')
            .map((f: any) => ({
                name: f.name.replace(/^[0-9T:.-]+-/, ''), // Clean up timestamp from name if possible
                rawName: f.name,
                size: f.size,
                url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${f.path}`,
                urls: {
                    github: f.html_url,
                    raw: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${f.path}`,
                    jsdelivr: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${f.path}`
                },
                download_url: f.download_url
            }))
            .sort((a, b) => b.rawName.localeCompare(a.rawName)); // Newest first based on timestamp prefix

        return NextResponse.json({ success: true, files: uploadedFiles });
    } catch (error) {
        console.error('Fetch files error:', error);
        if ((error as any).status === 404) {
            return NextResponse.json({ success: true, files: [] }); // No uploads folder yet
        }
        return NextResponse.json(
            { error: 'Failed to fetch files' },
            { status: 500 }
        );
    }
}
