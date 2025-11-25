'use client';

import React from 'react';
import { AnyTemplate, isCustomTemplate } from '@/types/template';
import { useContractStore } from '@/store/useContractStore';
import { compileHtmlTemplate } from '@/lib/template-compiler';

interface DynamicPreviewProps {
    template: AnyTemplate;
    data: Record<string, any>;
}

export const DynamicPreview = ({ template, data }: DynamicPreviewProps) => {
    const modifiedHtml = useContractStore((state) => state.modifiedHtml);

    // 템플릿 타입에 따라 HTML 생성
    const originalHtml = isCustomTemplate(template)
        ? compileHtmlTemplate(template.htmlTemplate)(data)
        : template.htmlContent(data);

    // AI 수정된 HTML이 있으면 그것을 사용, 없으면 원본 사용
    const htmlContent = modifiedHtml || originalHtml;

    return (
        <div className="p-8 bg-white text-black shadow-lg max-w-[210mm] min-h-[297mm] mx-auto text-sm leading-relaxed">
            <div className="contract-preview-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />

            <div className="mt-8 text-center text-xs text-gray-400">
                * 본 계약서는 Contract Auto-Bot에 의해 자동 생성되었습니다.
            </div>

        </div>
    );
};
