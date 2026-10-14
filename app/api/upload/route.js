import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const alt = formData.get('alt') || '';
    const rawFilename = formData.get('filename') || (file && file.name) || 'image.jpg';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(rawFilename) || '.jpg';
    const cleanBase = path.basename(rawFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFilename = `${cleanBase}_${Date.now()}${ext}`;

    const wpUrl = process.env.WORDPRESS_URL?.trim();
    const wpUser = process.env.WORDPRESS_USER?.trim();
    const wpPassword = process.env.WORDPRESS_APP_PASSWORD?.trim();

    // 1. If WordPress credentials are configured, upload to WordPress Media Library
    if (wpUrl && wpUser && wpPassword) {
      try {
        const cleanWpUrl = wpUrl.replace(/\/+$/, '');
        const authHeader = Buffer.from(`${wpUser}:${wpPassword}`).toString('base64');

        const wpUploadRes = await fetch(`${cleanWpUrl}/wp-json/wp/v2/media`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Disposition': `attachment; filename="${uniqueFilename}"`,
            'Content-Type': file.type || 'image/jpeg'
          },
          body: buffer
        });

        if (wpUploadRes.ok) {
          const wpData = await wpUploadRes.json();

          // Optionally update attachment alt text in WordPress
          if (alt && wpData.id) {
            try {
              await fetch(`${cleanWpUrl}/wp-json/wp/v2/media/${wpData.id}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Basic ${authHeader}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alt_text: alt })
              });
            } catch (altErr) {
              console.warn('Could not update alt text in WordPress:', altErr);
            }
          }

          return NextResponse.json({
            success: true,
            provider: 'wordpress',
            url: wpData.source_url,
            id: wpData.id,
            filename: uniqueFilename,
            alt: alt
          });
        } else {
          const errText = await wpUploadRes.text();
          console.warn('WordPress upload returned error, using local fallback:', errText);
        }
      } catch (wpErr) {
        console.warn('WordPress connection failed, using local fallback:', wpErr);
      }
    }

    // 2. Fallback: Save locally in /public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      provider: 'local',
      url: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename,
      alt: alt
    });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
