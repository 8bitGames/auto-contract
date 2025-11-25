'use client';

import React from 'react';
import { GripVertical, Trash2, ChevronRight } from 'lucide-react';
import { Section } from '@/types/template';

interface SectionManagerProps {
    sections: Section[];
    selectedSectionId: string | null;
    onSelectSection: (id: string) => void;
    onUpdateSection: (id: string, updates: Partial<Section>) => void;
    onDeleteSection: (id: string) => void;
    onReorder: (sections: Section[]) => void;
}

export default function SectionManager({
    sections,
    selectedSectionId,
    onSelectSection,
    onUpdateSection,
    onDeleteSection,
    onReorder,
}: SectionManagerProps) {
    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (dragIndex === dropIndex) return;

        const newSections = [...sections];
        const [removed] = newSections.splice(dragIndex, 1);
        newSections.splice(dropIndex, 0, removed);

        onReorder(newSections);
    };

    if (sections.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>섹션이 없습니다.</p>
                <p className="text-sm mt-1">위의 &quot;섹션 추가&quot; 버튼을 클릭하세요.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {sections.map((section, index) => (
                <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => onSelectSection(section.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSectionId === section.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />

                    <div className="flex-1 min-w-0">
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                                e.stopPropagation();
                                onUpdateSection(section.id, { title: e.target.value });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 text-sm font-medium"
                            placeholder="섹션 제목"
                        />
                        <p className="text-xs text-gray-500 mt-0.5 px-1">
                            {section.fields.length}개 필드
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('이 섹션을 삭제하시겠습니까?')) {
                                onDeleteSection(section.id);
                            }
                        }}
                        className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
            ))}
        </div>
    );
}
