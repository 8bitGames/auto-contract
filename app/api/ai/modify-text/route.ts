import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const { selectedText, userRequest, context } = await request.json();

        if (!selectedText || !userRequest) {
            return NextResponse.json(
                { error: '필수 파라미터가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const contextPart = context ? '[주변 맥락]\n' + context + '\n' : '';

        const prompt = '당신은 대한민국 법률에 정통한 전문 변호사 AI입니다.\n' +
'사용자가 계약서의 특정 텍스트를 선택하고 수정을 요청했습니다.\n\n' +
'[지시사항]\n' +
'1. 선택된 텍스트를 사용자의 요청에 맞게 수정하세요.\n' +
'2. 법적 효력이 유지되도록 전문적인 법률 용어를 사용하세요.\n' +
'3. 수정된 텍스트만 출력하세요. 다른 설명이나 코멘트는 제외합니다.\n' +
'4. 원본 텍스트의 맥락과 스타일을 유지하세요.\n\n' +
contextPart +
'[선택된 텍스트]\n' + selectedText + '\n\n' +
'[수정 요청]\n' + userRequest + '\n\n' +
'위 텍스트를 수정 요청에 맞게 수정해주세요. 수정된 텍스트만 출력하세요.';

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
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
                        temperature: 0.3,
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
        console.log('Gemini API response:', JSON.stringify(data, null, 2));

        const modifiedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!modifiedText) {
            throw new Error('AI 응답이 비어있습니다. Response: ' + JSON.stringify(data));
        }

        return NextResponse.json({ text: modifiedText });
    } catch (error: any) {
        console.error('Text modification error:', error);
        return NextResponse.json(
            { error: error.message || '텍스트 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
