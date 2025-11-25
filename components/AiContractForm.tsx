'use client';

import React from 'react';
import { useContractStore } from '@/store/useContractStore';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

export const AiContractForm = () => {
    const aiContract = useContractStore((state) => state.aiContract);
    const updateSection = useContractStore((state) => state.updateSection);
    const updateVariable = useContractStore((state) => state.updateVariable);

    if (!aiContract) return null;

    const handleTitleChange = (value: string) => {
        useContractStore.getState().setAiContract({
            ...aiContract,
            title: value
        });
    };

    const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
        const updatedSections = aiContract.sections.map((section) =>
            section.id === sectionId
                ? { ...section, title: newTitle }
                : section
        );
        useContractStore.getState().setAiContract({
            ...aiContract,
            sections: updatedSections
        });
    };

    const handleAddSection = () => {
        const newSection = {
            id: `section_${Date.now()}`,
            title: '새 조항',
            content: '내용을 입력하세요.'
        };
        useContractStore.getState().setAiContract({
            ...aiContract,
            sections: [...aiContract.sections, newSection]
        });
    };

    const handleDeleteSection = (sectionId: string) => {
        if (aiContract.sections.length <= 1) {
            alert('최소 1개의 조항이 필요합니다.');
            return;
        }
        const updatedSections = aiContract.sections.filter((s) => s.id !== sectionId);
        useContractStore.getState().setAiContract({
            ...aiContract,
            sections: updatedSections
        });
    };

    return (
        <form className="space-y-6 p-6 bg-gray-50 h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Sparkles className="text-indigo-600" size={20} />
                AI 생성 계약서 편집
            </h2>

            {/* 제목 편집 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">계약서 제목</h3>
                <input
                    type="text"
                    value={aiContract.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                    placeholder="계약서 제목을 입력하세요"
                />
            </div>

            {/* 변수 편집 (계약 당사자 정보) */}
            {aiContract.variables && Object.keys(aiContract.variables).length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">계약 당사자 정보</h3>
                    <div className="space-y-3">
                        {Object.entries(aiContract.variables).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {key.replace(/_/g, ' ')}
                                </label>
                                <input
                                    type={key.includes('일') || key.includes('날짜') ? 'date' : key.includes('금액') ? 'number' : 'text'}
                                    value={value}
                                    onChange={(e) => updateVariable(key, e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 placeholder-gray-500"
                                    placeholder={`${key.replace(/_/g, ' ')}을(를) 입력하세요`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 섹션별 편집 */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">계약 조항</h3>
                    <button
                        type="button"
                        onClick={handleAddSection}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={14} />
                        조항 추가
                    </button>
                </div>

                {aiContract.sections.map((section, index) => (
                    <div key={section.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <input
                                type="text"
                                value={section.title}
                                onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                className="text-lg font-semibold text-gray-800 border-none focus:ring-0 p-0 bg-transparent flex-1"
                                placeholder="조항 제목"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                title="조항 삭제"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border min-h-[120px] text-gray-900 placeholder-gray-500"
                            placeholder="조항 내용을 입력하세요"
                        />
                    </div>
                ))}
            </div>

            {/* 안내 메시지 */}
            <div className="text-sm text-gray-500 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium text-blue-700 mb-1">💡 편집 팁</p>
                <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>각 조항의 제목과 내용을 직접 수정할 수 있습니다</li>
                    <li>미리보기에서 섹션을 선택하면 AI로 수정할 수 있습니다</li>
                    <li>[변수명] 형태로 입력하면 상단에서 값을 입력할 수 있습니다</li>
                </ul>
            </div>
        </form>
    );
};
