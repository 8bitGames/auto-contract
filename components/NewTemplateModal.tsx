'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, FileUp, FileText, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContractStore } from '@/store/useContractStore';
import { CustomTemplate, Section } from '@/types/template';
import { v4 as uuidv4 } from 'uuid';
import DocumentUploadModal from './DocumentUploadModal';

interface NewTemplateModalProps {
    onClose: () => void;
}

type ModalView = 'select' | 'ai' | 'document';

const examplePrompts = [
    '프리랜서 용역 계약서 템플릿',
    '부동산 임대차 계약서 템플릿',
    '소프트웨어 라이선스 계약서 템플릿',
    '컨설팅 서비스 계약서 템플릿',
];

export function NewTemplateModal({ onClose }: NewTemplateModalProps) {
    const [view, setView] = useState<ModalView>('select');
    const [userRequest, setUserRequest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { setEditingTemplate } = useContractStore();

    const handleSubmit = async () => {
        if (!userRequest.trim()) {
            setError('어떤 템플릿을 만들지 설명해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/create-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userRequest }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '템플릿 생성 실패');
            }

            const templateData = await response.json();

            // CustomTemplate 형식으로 변환
            const newTemplate: CustomTemplate = {
                id: uuidv4(),
                userId: 'temp-user', // TODO: 실제 사용자 ID
                title: templateData.title,
                description: templateData.description || '',
                sections: templateData.sections,
                htmlTemplate: templateData.htmlTemplate,
                isCustom: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // 편집 상태로 설정
            setEditingTemplate(newTemplate);

            // 템플릿 빌더로 이동
            onClose();
            router.push('/template-builder');
        } catch (err: any) {
            setError(err.message || '템플릿 생성 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlankTemplate = () => {
        // 빈 템플릿으로 시작
        const newTemplate: CustomTemplate = {
            id: uuidv4(),
            userId: 'temp-user',
            title: '새 템플릿',
            description: '',
            sections: [],
            htmlTemplate: '',
            isCustom: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setEditingTemplate(newTemplate);
        onClose();
        router.push('/template-builder');
    };

    const handleDocumentTemplateGenerated = (data: {
        title: string;
        description: string;
        sections: Section[];
        htmlTemplate: string;
    }) => {
        const newTemplate: CustomTemplate = {
            id: uuidv4(),
            userId: 'temp-user',
            title: data.title,
            description: data.description,
            sections: data.sections,
            htmlTemplate: data.htmlTemplate,
            isCustom: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setEditingTemplate(newTemplate);
        onClose();
        router.push('/template-builder');
    };

    // 선택 화면
    if (view === 'select') {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">새 템플릿 만들기</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-600 mb-4">
                            템플릿을 어떻게 만들까요?
                        </p>

                        {/* 빈 템플릿 */}
                        <button
                            onClick={handleBlankTemplate}
                            className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-start gap-3 text-left transition-colors"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">빈 템플릿으로 시작</h3>
                                <p className="text-sm text-gray-500">
                                    직접 섹션과 필드를 추가하여 템플릿을 만듭니다
                                </p>
                            </div>
                        </button>

                        {/* AI로 생성 */}
                        <button
                            onClick={() => setView('ai')}
                            className="w-full p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 flex items-start gap-3 text-left transition-colors"
                        >
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">AI로 템플릿 생성</h3>
                                <p className="text-sm text-gray-500">
                                    원하는 계약서를 설명하면 AI가 자동으로 생성합니다
                                </p>
                            </div>
                        </button>

                        {/* 문서로 만들기 */}
                        <button
                            onClick={() => setView('document')}
                            className="w-full p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 flex items-start gap-3 text-left transition-colors"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">문서로 템플릿 만들기</h3>
                                <p className="text-sm text-gray-500">
                                    기존 PDF 계약서를 업로드하여 템플릿으로 변환합니다
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 문서 업로드 화면
    if (view === 'document') {
        return (
            <DocumentUploadModal
                isOpen={true}
                onClose={() => setView('select')}
                onTemplateGenerated={handleDocumentTemplateGenerated}
            />
        );
    }

    // AI 생성 화면
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setView('select')}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="text-purple-600" size={20} />
                            AI로 템플릿 만들기
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                        어떤 계약서 템플릿을 만들고 싶으신가요? AI가 폼 필드와 문서 구조를 자동으로 생성합니다.
                    </p>

                    <textarea
                        value={userRequest}
                        onChange={(e) => setUserRequest(e.target.value)}
                        placeholder="예: 프리랜서 디자인 용역 계약서, 월 정산 방식"
                        className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        disabled={isLoading}
                    />

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">예시:</p>
                        <div className="flex flex-wrap gap-2">
                            {examplePrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setUserRequest(prompt)}
                                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
                                    disabled={isLoading}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                        disabled={isLoading}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !userRequest.trim()}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                생성 중...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                템플릿 생성
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
