'use client';

import React, { useState } from 'react';
import { useContractStore } from '@/store/useContractStore';
import { X, Sparkles, Loader2, FileText } from 'lucide-react';

interface NewContractModalProps {
    onClose: () => void;
}

export const NewContractModal = ({ onClose }: NewContractModalProps) => {
    const [userRequest, setUserRequest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const setAiContract = useContractStore((state) => state.setAiContract);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userRequest.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/create-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userRequest: userRequest.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '계약서 생성 실패');
            }

            setAiContract(data);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const examples = [
        '프리랜서 디자인 용역 계약서, 건당 50만원, 수정 2회',
        '유튜브 영상 편집 계약서, 월 정액 100만원',
        '소프트웨어 개발 외주 계약서, 3개월 프로젝트',
        '비밀유지 계약서 (NDA), 2년 유효',
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden text-gray-900">
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="text-indigo-600" size={20} />
                        AI로 새 계약서 만들기
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <p className="text-sm text-indigo-800">
                            <strong>사용법:</strong> 어떤 계약서가 필요한지 자유롭게 설명해주세요.
                            계약 종류, 금액, 기간, 특별 조건 등을 포함하면 더 정확한 계약서를 생성합니다.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            계약서 요구사항
                        </label>
                        <textarea
                            value={userRequest}
                            onChange={(e) => setUserRequest(e.target.value)}
                            placeholder="예: 유튜브 편집자 계약서이고, 건당 10만원, 수정은 2회 제한으로 해줘"
                            className="w-full p-4 border border-gray-300 rounded-lg text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
                            disabled={isLoading}
                        />

                        <div className="mt-3">
                            <p className="text-xs text-gray-600 mb-2">예시 (클릭하여 입력):</p>
                            <div className="flex flex-wrap gap-2">
                                {examples.map((example, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setUserRequest(example)}
                                        className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mt-3">{error}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                disabled={isLoading}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !userRequest.trim()}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        생성 중...
                                    </>
                                ) : (
                                    <>
                                        <FileText size={18} />
                                        계약서 생성
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
