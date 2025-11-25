'use client';

import React, { useState } from 'react';
import { ContractData, ContractSection } from '@/types/template';
import { useContractStore } from '@/store/useContractStore';
import { Sparkles } from 'lucide-react';
import { SectionEditModal } from './SectionEditModal';

interface DynamicContractProps {
    contract: ContractData;
}

export const DynamicContract = ({ contract }: DynamicContractProps) => {
    const [editingSection, setEditingSection] = useState<ContractSection | null>(null);
    const updateSection = useContractStore((state) => state.updateSection);

    const handleEditComplete = (sectionId: string, newContent: string) => {
        updateSection(sectionId, newContent);
        setEditingSection(null);
    };

    // 변수를 실제 값으로 치환하는 함수
    const substituteVariables = (content: string): string => {
        if (!contract.variables) return content;

        let result = content;
        Object.entries(contract.variables).forEach(([key, value]) => {
            const placeholder = `[${key}]`;
            const displayValue = value || placeholder; // 값이 없으면 플레이스홀더 그대로 표시
            result = result.split(placeholder).join(displayValue);
        });
        return result;
    };

    return (
        <div className="p-8 shadow-lg max-w-[210mm] min-h-[297mm] mx-auto text-sm leading-relaxed" style={{ backgroundColor: 'white', color: 'black' }} spellCheck={false}>
            <h1 className="text-2xl font-bold text-center mb-8" style={{ color: 'black' }}>{contract.title}</h1>

            <div className="space-y-6">
                {contract.sections.map((section) => (
                    <div key={section.id} className="group relative">
                        <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingSection(section)}
                                className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
                                title="AI로 수정하기"
                            >
                                <Sparkles size={16} />
                            </button>
                        </div>
                        <div className="border-l-2 border-transparent group-hover:border-indigo-300 pl-4 -ml-4 transition-colors">
                            <h2 className="font-bold mb-2" style={{ color: 'black' }}>{section.title}</h2>
                            <div className="whitespace-pre-wrap" style={{ color: 'black' }}>{substituteVariables(section.content)}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-between items-end" style={{ color: 'black' }}>
                <div className="text-center">
                    <p className="mb-4 font-bold">(갑)</p>
                    <p>상호: {contract.variables?.['갑_명칭'] || '________________'}</p>
                    <p>주소: {contract.variables?.['갑_주소'] || '________________'}</p>
                    <p>대표자: {contract.variables?.['갑_대표자'] || '__________'} (서명)</p>
                </div>
                <div className="text-center">
                    <p className="mb-4 font-bold">(을)</p>
                    <p>상호/성명: {contract.variables?.['을_명칭'] || '________________'}</p>
                    <p>주소: {contract.variables?.['을_주소'] || '________________'}</p>
                    <p>연락처: {contract.variables?.['을_연락처'] || '________________'}</p>
                </div>
            </div>

            <div className="mt-8 text-center text-xs" style={{ color: '#9ca3af' }}>
                * 본 계약서는 Contract Auto-Bot AI에 의해 자동 생성되었습니다.
            </div>


            {editingSection && (
                <SectionEditModal
                    section={editingSection}
                    fullContract={contract}
                    onClose={() => setEditingSection(null)}
                    onComplete={handleEditComplete}
                />
            )}
        </div>
    );
};
