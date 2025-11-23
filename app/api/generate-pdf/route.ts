import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getTemplateById } from '@/data/templates';

export async function POST(req: NextRequest) {
  try {
    const { templateId, data } = await req.json();
    const template = getTemplateById(templateId);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Generate HTML content using the template's renderer
    const contentHtml = template.htmlContent(data);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Noto Sans KR', sans-serif; padding: 40px; font-size: 14px; line-height: 1.6; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #888; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Noto Sans KR', 'sans-serif'],
                  },
                },
              },
            }
          </script>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          ${contentHtml}
          
          <div class="footer">
            * 본 계약서는 Contract Auto-Bot에 의해 자동 생성되었습니다.
          </div>
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
