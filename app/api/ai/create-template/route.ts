import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { userRequest } = await req.json();

        if (!userRequest) {
            return NextResponse.json({ error: '요청 내용이 필요합니다.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `당신은 계약서 템플릿 생성 전문가입니다. 사용자의 요청에 맞는 계약서 템플릿을 생성해주세요.

사용자 요청: "${userRequest}"

다음 JSON 형식으로 템플릿을 생성해주세요:

{
  "title": "템플릿 제목",
  "description": "템플릿 설명 (한 줄)",
  "sections": [
    {
      "id": "고유ID (영문_숫자)",
      "title": "섹션 제목",
      "fields": [
        {
          "id": "필드ID (영문_숫자)",
          "label": "필드 라벨",
          "type": "text|date|number|currency|textarea",
          "placeholder": "입력 힌트",
          "required": true|false
        }
      ]
    }
  ],
  "htmlTemplate": "HTML 템플릿 문자열"
}

중요 규칙:
1. sections는 사용자가 입력할 폼 필드들을 정의합니다
2. htmlTemplate은 {{필드ID}} 형식으로 변수를 사용합니다
3. htmlTemplate에는 Tailwind CSS 클래스를 사용하세요
4. 계약서 기본 구조: 제목, 당사자 정보, 조항들, 서명란
5. 필드 타입: text(짧은 텍스트), textarea(긴 텍스트), date(날짜), number(숫자), currency(금액)
6. 한국어로 작성하되, ID는 영문으로 작성
7. 반드시 유효한 JSON만 출력하세요 (마크다운 코드블록 없이)

예시 섹션:
- parties: 당사자 정보 (갑, 을 이름/주소/연락처)
- period: 계약 기간
- payment: 대금/보수
- terms: 계약 조건
- signature: 서명 정보

htmlTemplate 예시:
<h1 class="text-2xl font-bold text-center mb-8">{{title}}</h1>
<p>{{party_a_name}} (이하 "갑")과 {{party_b_name}} (이하 "을")은...</p>`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 8192,
            },
        });

        const responseText = result.response.text();

        // JSON 파싱
        let templateData;
        try {
            // 마크다운 코드블록 제거
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            templateData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response Text:', responseText);
            return NextResponse.json(
                { error: 'AI 응답 파싱 실패. 다시 시도해주세요.' },
                { status: 500 }
            );
        }

        // 필수 필드 검증
        if (!templateData.title || !templateData.sections || !templateData.htmlTemplate) {
            return NextResponse.json(
                { error: '템플릿 구조가 올바르지 않습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json(templateData);
    } catch (error: any) {
        console.error('Template Generation Error:', error);
        return NextResponse.json(
            { error: error.message || '템플릿 생성 실패' },
            { status: 500 }
        );
    }
}
