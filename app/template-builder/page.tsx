'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Eye, Code, List, Plus, FileUp } from 'lucide-react';
import { useContractStore } from '@/store/useContractStore';
import { CustomTemplate, Section, Field } from '@/types/template';
import { generateDefaultTemplate, generateSampleData } from '@/lib/template-compiler';
import SectionManager from '@/components/template-builder/SectionManager';
import FieldEditor from '@/components/template-builder/FieldEditor';
import HtmlEditor from '@/components/template-builder/HtmlEditor';
import TemplatePreview from '@/components/template-builder/TemplatePreview';
import DocumentUploadModal from '@/components/DocumentUploadModal';

type EditorTab = 'sections' | 'html' | 'preview';

export default function TemplateBuilderPage() {
    const router = useRouter();
    const {
        editingTemplate,
        setEditingTemplate,
        addCustomTemplate,
        updateCustomTemplate,
        addSectionToEditing,
        updateSectionInEditing,
        deleteSectionFromEditing,
        reorderSectionsInEditing,
        updateEditingTemplate,
    } = useContractStore();

    const [activeTab, setActiveTab] = useState<EditorTab>('sections');
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // 새 템플릿 초기화
    useEffect(() => {
        if (!editingTemplate) {
            const newTemplate: CustomTemplate = {
                id: uuidv4(),
                userId: 'temp-user', // TODO: 실제 사용자 ID
                title: '새 템플릿',
                description: '',
                sections: [],
                htmlTemplate: '',
                isCustom: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setEditingTemplate(newTemplate);
        }
    }, [editingTemplate, setEditingTemplate]);

    if (!editingTemplate) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleAddSection = () => {
        const newSection: Section = {
            id: uuidv4(),
            title: `섹션 ${editingTemplate.sections.length + 1}`,
            fields: [],
        };
        addSectionToEditing(newSection);
        setSelectedSectionId(newSection.id);
    };

    const handleAddField = (sectionId: string) => {
        const section = editingTemplate.sections.find(s => s.id === sectionId);
        if (!section) return;

        const newField: Field = {
            id: uuidv4(),
            label: `필드 ${section.fields.length + 1}`,
            type: 'text',
            placeholder: '',
            required: false,
        };

        updateSectionInEditing(sectionId, {
            fields: [...section.fields, newField],
        });
    };

    const handleUpdateField = (sectionId: string, fieldId: string, updates: Partial<Field>) => {
        const section = editingTemplate.sections.find(s => s.id === sectionId);
        if (!section) return;

        updateSectionInEditing(sectionId, {
            fields: section.fields.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
            ),
        });
    };

    const handleDeleteField = (sectionId: string, fieldId: string) => {
        const section = editingTemplate.sections.find(s => s.id === sectionId);
        if (!section) return;

        updateSectionInEditing(sectionId, {
            fields: section.fields.filter(f => f.id !== fieldId),
        });
    };

    const handleGenerateHtml = () => {
        const html = generateDefaultTemplate(
            editingTemplate.title,
            editingTemplate.sections.map(s => ({
                id: s.id,
                title: s.title,
                fields: s.fields.map(f => ({ id: f.id, label: f.label })),
            }))
        );
        updateEditingTemplate({ htmlTemplate: html });
        setActiveTab('html');
    };

    const handleDocumentTemplateGenerated = (data: {
        title: string;
        description: string;
        sections: Section[];
        htmlTemplate: string;
    }) => {
        // 생성된 템플릿 데이터로 업데이트
        updateEditingTemplate({
            title: data.title,
            description: data.description,
            sections: data.sections,
            htmlTemplate: data.htmlTemplate,
        });

        // 첫 번째 섹션 선택
        if (data.sections.length > 0) {
            setSelectedSectionId(data.sections[0].id);
        }
    };

    const handleSave = async () => {
        if (!editingTemplate.title.trim()) {
            alert('템플릿 제목을 입력해주세요.');
            return;
        }

        if (editingTemplate.sections.length === 0) {
            alert('최소 하나의 섹션을 추가해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            // TODO: Supabase에 저장
            const updatedTemplate = {
                ...editingTemplate,
                updatedAt: new Date().toISOString(),
            };

            // 기존 템플릿 업데이트 또는 새 템플릿 추가
            const existingIndex = useContractStore.getState().customTemplates.findIndex(
                t => t.id === editingTemplate.id
            );

            if (existingIndex >= 0) {
                updateCustomTemplate(editingTemplate.id, updatedTemplate);
            } else {
                addCustomTemplate(updatedTemplate);
            }

            alert('템플릿이 저장되었습니다.');
            router.push('/');
        } catch (error) {
            console.error('Failed to save template:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    // 미리보기용 샘플 데이터
    const allFields = editingTemplate.sections.flatMap(s =>
        s.fields.map(f => ({ id: f.id, type: f.type, label: f.label }))
    );
    const sampleData = generateSampleData(allFields);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white border-b px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (confirm('저장하지 않은 변경사항이 있을 수 있습니다. 나가시겠습니까?')) {
                                    setEditingTemplate(null);
                                    router.push('/');
                                }
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <input
                                type="text"
                                value={editingTemplate.title}
                                onChange={(e) => updateEditingTemplate({ title: e.target.value })}
                                className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2"
                                placeholder="템플릿 제목"
                            />
                            <input
                                type="text"
                                value={editingTemplate.description}
                                onChange={(e) => updateEditingTemplate({ description: e.target.value })}
                                className="block text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2 w-full"
                                placeholder="템플릿 설명 (선택사항)"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="px-4 py-2 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg flex items-center gap-2"
                        >
                            <FileUp className="w-4 h-4" />
                            문서로 만들기
                        </button>
                        <button
                            onClick={handleGenerateHtml}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                        >
                            <Code className="w-4 h-4" />
                            HTML 자동 생성
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </div>
            </header>

            {/* 탭 */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('sections')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'sections'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <List className="w-4 h-4 inline-block mr-2" />
                            섹션 & 필드
                        </button>
                        <button
                            onClick={() => setActiveTab('html')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'html'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Code className="w-4 h-4 inline-block mr-2" />
                            HTML 편집
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'preview'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Eye className="w-4 h-4 inline-block mr-2" />
                            미리보기
                        </button>
                    </div>
                </div>
            </div>

            {/* 컨텐츠 */}
            <main className="max-w-7xl mx-auto p-6">
                {activeTab === 'sections' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 섹션 목록 */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold">섹션 목록</h2>
                                <button
                                    onClick={handleAddSection}
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    섹션 추가
                                </button>
                            </div>
                            <SectionManager
                                sections={editingTemplate.sections}
                                selectedSectionId={selectedSectionId}
                                onSelectSection={setSelectedSectionId}
                                onUpdateSection={(id, updates) => updateSectionInEditing(id, updates)}
                                onDeleteSection={deleteSectionFromEditing}
                                onReorder={reorderSectionsInEditing}
                            />
                        </div>

                        {/* 필드 편집 */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="font-semibold mb-4">필드 편집</h2>
                            {selectedSectionId ? (
                                <FieldEditor
                                    section={editingTemplate.sections.find(s => s.id === selectedSectionId)!}
                                    onAddField={() => handleAddField(selectedSectionId)}
                                    onUpdateField={(fieldId, updates) => handleUpdateField(selectedSectionId, fieldId, updates)}
                                    onDeleteField={(fieldId) => handleDeleteField(selectedSectionId, fieldId)}
                                />
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    섹션을 선택하여 필드를 편집하세요
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'html' && (
                    <HtmlEditor
                        htmlTemplate={editingTemplate.htmlTemplate}
                        onChange={(html) => updateEditingTemplate({ htmlTemplate: html })}
                        variables={allFields.map(f => f.id)}
                    />
                )}

                {activeTab === 'preview' && (
                    <TemplatePreview
                        htmlTemplate={editingTemplate.htmlTemplate}
                        sampleData={sampleData}
                    />
                )}
            </main>

            {/* 문서 업로드 모달 */}
            <DocumentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onTemplateGenerated={handleDocumentTemplateGenerated}
            />
        </div>
    );
}
