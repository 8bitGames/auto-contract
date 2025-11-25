import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getTemplateById } from '@/data/templates';
import { ContractData } from '@/types/template';
import { compileHtmlTemplate } from '@/lib/template-compiler';

function generateAiContractHtml(contract: ContractData): string {
  // 변수를 실제 값으로 치환하는 함수
  const substituteVariables = (content: string): string => {
    if (!contract.variables) return content;
    let result = content;
    Object.entries(contract.variables).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      const displayValue = value || placeholder;
      result = result.split(placeholder).join(displayValue);
    });
    return result;
  };

  const sectionsHtml = contract.sections
    .map(
      (section) => `
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: bold; margin-bottom: 8px;">${section.title}</h3>
        <div style="white-space: pre-wrap;">${substituteVariables(section.content)}</div>
      </div>
    `
    )
    .join('');

  return `
    <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px;">${contract.title}</h1>
    ${sectionsHtml}
    <div style="margin-top: 50px; display: flex; justify-content: space-between;">
      <div style="text-align: center;">
        <p style="font-weight: bold; margin-bottom: 16px;">(갑)</p>
        <p>상호: ${contract.variables?.['갑_명칭'] || '________________'}</p>
        <p>주소: ${contract.variables?.['갑_주소'] || '________________'}</p>
        <p>대표자: ${contract.variables?.['갑_대표자'] || '__________'} (서명)</p>
      </div>
      <div style="text-align: center;">
        <p style="font-weight: bold; margin-bottom: 16px;">(을)</p>
        <p>상호/성명: ${contract.variables?.['을_명칭'] || '________________'}</p>
        <p>주소: ${contract.variables?.['을_주소'] || '________________'}</p>
        <p>연락처: ${contract.variables?.['을_연락처'] || '________________'}</p>
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { templateId, data, isAiMode, htmlTemplate, title } = await req.json();

    let contentHtml: string;
    let filename: string;

    if (isAiMode && data) {
      const aiContract = data as ContractData;
      contentHtml = generateAiContractHtml(aiContract);
      filename = aiContract.title || 'ai_contract';
    } else if (htmlTemplate) {
      // 커스텀 템플릿인 경우
      const compile = compileHtmlTemplate(htmlTemplate);
      contentHtml = compile(data);
      filename = title || 'custom_contract';
    } else {
      const template = getTemplateById(templateId);
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
      contentHtml = template.htmlContent(data);
      filename = template.id;
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

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

    // 한글 파일명을 위한 인코딩
    const encodedFilename = encodeURIComponent(`${filename}.pdf`);

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 });
  }
}
