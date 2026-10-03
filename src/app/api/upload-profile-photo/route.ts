import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();
    const file = incomingFormData.get("profile_image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Prepare the payload for Picser
    const picserFormData = new FormData();
    picserFormData.append("file", file);
    
    // We get these from our secure environment variables
    picserFormData.append("github_token", process.env.GITHUB_TOKEN || '');
    picserFormData.append("github_owner", process.env.GITHUB_OWNER || '');
    picserFormData.append("github_repo", process.env.GITHUB_REPO || '');

    // 2. Send the image to the Picser Hosted API
    const response = await fetch("https://picser.pages.dev/api/public-upload", {
      method: "POST",
      body: picserFormData,
    });

    const data = await response.json();

    if (data.success) {
      // Use the raw commit URL for instant display (jsDelivr can take a minute to cache)
      const permanentCdnUrl = data.data.urls.raw_commit; 

      // 4. Return the new URL back to the frontend
      return NextResponse.json({ success: true, url: permanentCdnUrl });
    } else {
      return NextResponse.json({ error: "Picser upload failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
