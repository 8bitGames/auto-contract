import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 계약서 컨텍스트 캐시 (메모리 기반)
interface CacheEntry {
    context: string;
    createdAt: number;
}

const contractCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30분

// 캐시 정리 함수
function cleanupCache() {
    const now = Date.now();
    for (const [key, entry] of contractCache.entries()) {
        if (now - entry.createdAt > CACHE_TTL) {
            contractCache.delete(key);
        }
    }
}

// 계약서 해시 생성
function generateContractHash(contract: any): string {
    const content = JSON.stringify(contract);
    return crypto.createHash('md5').update(content).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const {
            sectionTitle,
            currentContent,
            userRequest,
            // CAG 관련 파라미터
            fullContract,  // 전체 계약서 (첫 요청 시)
            cacheKey       // 캐시 키 (후속 요청 시)
        } = await request.json();

        if (!sectionTitle || !currentContent || !userRequest) {
            return NextResponse.json(
                { error: '필수 파라미터가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 주기적 캐시 정리
        cleanupCache();

        let contractContext = '';
        let responseCacheKey = cacheKey;

        // 전체 계약서 컨텍스트 처리
        if (fullContract) {
            // 새 계약서 컨텍스트 캐싱
            responseCacheKey = generateContractHash(fullContract);

            // 계약서 요약 컨텍스트 생성
            contractContext = `[전체 계약서 컨텍스트]
계약서 제목: ${fullContract.title}

전체 조항 목록:
${fullContract.sections.map((s: any, i: number) =>
    `${i + 1}. ${s.title}\n${s.content}`
).join('\n\n')}

${fullContract.variables ? `계약 변수:\n${Object.entries(fullContract.variables).map(([k, v]) => `- ${k}: ${v}`).join('\n')}` : ''}
`;

            // 캐시에 저장
            contractCache.set(responseCacheKey, {
                context: contractContext,
                createdAt: Date.now()
            });
        } else if (cacheKey && contractCache.has(cacheKey)) {
            // 캐시된 컨텍스트 사용
            const cached = contractCache.get(cacheKey)!;
            contractContext = cached.context;
            // 캐시 갱신 (LRU 방식)
            cached.createdAt = Date.now();
        }

        const prompt = `당신은 대한민국 법률에 정통한 전문 변호사 AI입니다.
사용자가 계약서의 특정 조항 수정을 요청했습니다.

[지시사항]
1. 현재 조항 내용을 기반으로 사용자의 요청사항을 반영하여 수정하세요.
2. 법적 효력이 유지되도록 전문적인 법률 용어를 사용하세요.
3. 수정된 조항 내용만 출력하세요. 다른 설명이나 코멘트는 제외합니다.
4. 조항 제목은 그대로 유지하고, 내용만 수정하세요.
${contractContext ? '5. 전체 계약서의 맥락과 다른 조항들과의 일관성을 유지하세요.\n6. 용어와 문체를 기존 계약서와 통일하세요.' : ''}

${contractContext}

[수정할 조항]
조항 제목: ${sectionTitle}

현재 내용:
${currentContent}

[수정 요청]
${userRequest}

위 조항을 수정 요청에 맞게 수정해주세요. 전체 계약서의 맥락을 고려하여 일관성 있게 수정하세요. 수정된 내용만 출력하세요.`;

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
        const modifiedContent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!modifiedContent) {
            throw new Error('AI 응답이 비어있습니다.');
        }

        return NextResponse.json({
            content: modifiedContent,
            cacheKey: responseCacheKey // 클라이언트에 캐시 키 반환
        });
    } catch (error: any) {
        console.error('Section edit error:', error);
        return NextResponse.json(
            { error: error.message || '조항 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
