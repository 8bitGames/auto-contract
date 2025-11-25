'use client';

import React, { useState, useRef } from 'react';
import { ContractSection, ContractData } from '@/types/template';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface SectionEditModalProps {
    section: ContractSection;
    fullContract: ContractData;  // 전체 계약서 컨텍스트
    onClose: () => void;
    onComplete: (sectionId: string, newContent: string) => void;
}

export const SectionEditModal = ({ section, fullContract, onClose, onComplete }: SectionEditModalProps) => {
    const [userRequest, setUserRequest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const cacheKeyRef = useRef<string | null>(null);  // 캐시 키 저장

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userRequest.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            // CAG 방식: 첫 요청에는 전체 계약서, 이후에는 캐시키만 전송
            const requestBody: any = {
                sectionTitle: section.title,
                currentContent: section.content,
                userRequest: userRequest.trim(),
            };

            if (cacheKeyRef.current) {
                // 캐시 키가 있으면 캐시 사용
                requestBody.cacheKey = cacheKeyRef.current;
            } else {
                // 첫 요청: 전체 계약서 컨텍스트 전송
                requestBody.fullContract = fullContract;
            }

            const response = await fetch('/api/ai/edit-section', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '수정 요청 실패');
            }

            // 캐시 키 저장 (다음 요청에 재사용)
            if (data.cacheKey) {
                cacheKeyRef.current = data.cacheKey;
            }

            onComplete(section.id, data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="text-indigo-600" size={20} />
                        AI 조항 수정
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            현재 조항
                        </label>
                        <div className="bg-gray-50 p-3 rounded-md border text-sm">
                            <p className="font-semibold mb-2">{section.title}</p>
                            <p className="text-gray-600 whitespace-pre-wrap">{section.content}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            수정 요청 사항
                        </label>
                        <textarea
                            value={userRequest}
                            onChange={(e) => setUserRequest(e.target.value)}
                            placeholder="예: 위약금 조항을 10%에서 20%로 올려줘"
                            className="w-full p-3 border rounded-md text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                            disabled={isLoading}
                        />

                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        수정 중...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        AI 수정
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
