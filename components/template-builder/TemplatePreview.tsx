'use client';

import React from 'react';
import { compileHtmlTemplate } from '@/lib/template-compiler';
import { AlertCircle } from 'lucide-react';

interface TemplatePreviewProps {
    htmlTemplate: string;
    sampleData: Record<string, string>;
}

export default function TemplatePreview({ htmlTemplate, sampleData }: TemplatePreviewProps) {
    if (!htmlTemplate) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">HTML 템플릿이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">
                    &quot;섹션 & 필드&quot; 탭에서 섹션을 추가한 후<br />
                    &quot;HTML 자동 생성&quot; 버튼을 클릭하거나<br />
                    &quot;HTML 편집&quot; 탭에서 직접 작성하세요.
                </p>
            </div>
        );
    }

    let renderedHtml = '';
    let error = '';

    try {
        const compile = compileHtmlTemplate(htmlTemplate);
        renderedHtml = compile(sampleData);
    } catch (e) {
        error = e instanceof Error ? e.message : '템플릿 컴파일 오류';
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-lg shadow p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 font-medium">템플릿 오류</p>
                <p className="text-sm text-red-500 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 rounded-lg shadow p-8 flex justify-center">
            <div
                className="bg-white shadow-lg"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '20mm',
                }}
            >
                <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
            </div>
        </div>
    );
}
