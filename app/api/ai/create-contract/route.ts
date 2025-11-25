import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const { userRequest } = await request.json();

        if (!userRequest) {
            return NextResponse.json(
                { error: '계약서 요구사항을 입력해주세요.' },
                { status: 400 }
            );
        }

        const prompt = `당신은 대한민국 법률에 정통한 전문 변호사 AI입니다.
사용자의 요구사항을 바탕으로 법적 효력이 있는 계약서 초안을 작성해야 합니다.

[지시사항]
1. 사용자의 요청을 분석하여 적절한 계약서 제목을 정하세요.
2. 계약서에 반드시 포함되어야 할 필수 조항들을 구성하세요.
3. 각 조항은 'title'(조항 제목)과 'content'(조항 내용)으로 분리하세요.
4. 내용은 명확하고 전문적인 법률 용어를 사용하되, 이해하기 쉬워야 합니다.
5. **중요**: 계약 당사자 정보, 날짜, 금액 등 사용자가 입력해야 하는 부분은 [대괄호] 형태의 플레이스홀더를 사용하세요.
   예시 플레이스홀더:
   - [갑_명칭], [갑_주소], [갑_대표자]
   - [을_명칭], [을_주소], [을_연락처]
   - [계약일], [계약종료일], [계약기간]
   - [금액], [지급방법], [지급일]
6. variables 객체에 모든 플레이스홀더와 기본값을 정의하세요.
7. 결과는 반드시 아래의 JSON 포맷으로만 출력하세요. (Markdown 코드 블럭 없이 순수 JSON만 반환)

[JSON 포맷]
{
  "title": "계약서 제목 (예: 프리랜서 용역 계약서)",
  "sections": [
    {
      "id": "section_1",
      "title": "제1조 (목적)",
      "content": "본 계약은 [갑_명칭] (이하 '갑'이라 한다)과 [을_명칭] (이하 '을'이라 한다) 간에..."
    },
    {
      "id": "section_2",
      "title": "제2조 (계약기간)",
      "content": "본 계약의 기간은 [계약일]부터 [계약종료일]까지로 한다."
    }
  ],
  "variables": {
    "갑_명칭": "",
    "갑_주소": "",
    "갑_대표자": "",
    "을_명칭": "",
    "을_주소": "",
    "을_연락처": "",
    "계약일": "",
    "계약종료일": "",
    "금액": ""
  }
}

[사용자 요청]
${userRequest}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 8192,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API 호출 실패');
        }

        const data = await response.json();
        let content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!content) {
            throw new Error('AI 응답이 비어있습니다.');
        }

        // Remove markdown code blocks if present
        content = content.replace(/^```json\s*\n?/i, '').replace(/\n?```$/i, '');

        // Parse JSON
        const contractData = JSON.parse(content);

        // Validate structure
        if (!contractData.title || !Array.isArray(contractData.sections)) {
            throw new Error('잘못된 계약서 형식입니다.');
        }

        return NextResponse.json(contractData);
    } catch (error: any) {
        console.error('Contract creation error:', error);
        
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error.message || '계약서 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
