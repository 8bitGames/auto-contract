import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
        }

        // 파일 타입 확인
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'PDF 파일만 지원됩니다.' },
                { status: 400 }
            );
        }

        // 파일을 base64로 변환
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');

        // AI로 문서 분석 및 템플릿 생성
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `당신은 계약서 분석 및 템플릿 생성 전문가입니다.
이 PDF 계약서 문서를 분석하여 재사용 가능한 템플릿을 생성해주세요.

## 중요: 원본 문서의 구조와 서식을 정확히 보존하세요!

## 작업 지침:

1. **필드 추출**: 문서에서 변경 가능한 부분을 찾아 필드로 정의하세요:
   - 당사자 이름, 주소, 사업자번호
   - 날짜 (계약일, 시작일, 종료일 등)
   - 금액 (계약금액, 부가세 등)
   - 프로젝트/계약 내용
   - 기타 변경 가능한 정보

2. **구조 분석**:
   - 테이블이 있으면 구조를 보존하세요
   - 조항 번호와 제목을 식별하세요
   - 서명란 구조를 파악하세요

3. **템플릿 생성**: 추출한 필드를 {{필드ID}} 형식으로 대체한 HTML 템플릿을 만드세요

## 출력 형식 (JSON):
{
  "title": "템플릿 제목",
  "description": "템플릿 설명 (한 줄)",
  "sections": [
    {
      "id": "섹션ID (영문_숫자)",
      "title": "섹션 제목 (한글)",
      "fields": [
        {
          "id": "필드ID (영문_숫자)",
          "label": "필드 라벨 (한글)",
          "type": "text|date|number|currency|textarea",
          "placeholder": "예시 값 또는 힌트",
          "required": true|false,
          "defaultValue": "기본값 (선택사항)"
        }
      ]
    }
  ],
  "htmlTemplate": "HTML 템플릿 문자열"
}

## 중요 규칙:
1. 필드 타입 선택:
   - text: 짧은 텍스트 (이름, 주소 등)
   - textarea: 긴 텍스트 (용역 범위, 조항 내용 등)
   - date: 날짜
   - number: 숫자
   - currency: 금액 (원)

2. 섹션 구성 예시:
   - contract_basic: 계약 기본 정보
   - parties: 당사자 정보
   - payment: 지급 정보
   - deliverables: 결과물/용역 범위
   - terms: 추가 조건

3. htmlTemplate 규칙:
   - Tailwind CSS 클래스 사용
   - 테이블은 <table class="..."> 형식 유지
   - 변수는 {{필드ID}} 형식
   - 페이지 나누기: <div style="page-break-before: always;"></div>

4. 반드시 유효한 JSON만 출력 (마크다운 코드블록 없이)

5. 원본 문서의 서식과 구조를 최대한 보존하세요
6. 테이블이 있으면 HTML table 태그로 정확히 재현하세요
7. 모든 조항과 내용을 빠짐없이 포함하세요`;

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: 'application/pdf',
                            data: base64Data,
                        },
                    },
                    { text: prompt },
                ],
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 32768,
            },
        });

        const responseText = result.response.text();

        // JSON 파싱
        let templateData;
        try {
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            templateData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response Text:', responseText.substring(0, 500));
            return NextResponse.json(
                { error: 'AI 응답 파싱 실패. 다시 시도해주세요.' },
                { status: 500 }
            );
        }

        // 필수 필드 검증
        if (!templateData.title || !templateData.sections || !templateData.htmlTemplate) {
            return NextResponse.json(
                { error: '템플릿 구조가 올바르지 않습니다. 다시 시도해주세요.' },
                { status: 500 }
            );
        }

        // 각 섹션과 필드에 필수 속성 확인 및 기본값 설정
        templateData.sections = templateData.sections.map((section: any, sIndex: number) => ({
            id: section.id || `section_${sIndex}`,
            title: section.title || `섹션 ${sIndex + 1}`,
            fields: (section.fields || []).map((field: any, fIndex: number) => ({
                id: field.id || `field_${sIndex}_${fIndex}`,
                label: field.label || `필드 ${fIndex + 1}`,
                type: field.type || 'text',
                placeholder: field.placeholder || '',
                required: field.required ?? false,
                defaultValue: field.defaultValue || '',
            })),
        }));

        return NextResponse.json({
            success: true,
            template: templateData,
        });
    } catch (error: any) {
        console.error('Document Parsing Error:', error);
        return NextResponse.json(
            { error: error.message || '문서 분석 실패' },
            { status: 500 }
        );
    }
}
