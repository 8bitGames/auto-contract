import React from 'react';
import { Template } from '@/types/template';

interface DynamicPreviewProps {
    template: Template;
    data: Record<string, any>;
}

export const DynamicPreview = ({ template, data }: DynamicPreviewProps) => {
    const htmlContent = template.htmlContent(data);

    return (
        <div className="p-8 bg-white text-black shadow-lg max-w-[210mm] min-h-[297mm] mx-auto text-sm leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

            <div className="mt-8 text-center text-xs text-gray-400">
                * 본 계약서는 Contract Auto-Bot에 의해 자동 생성되었습니다.
            </div>
        </div>
    );
};
