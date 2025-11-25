'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Loader2, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { useContractStore } from '@/store/useContractStore';

export const TextSelectionPopup = () => {
    // 직접 store 구독 (클로저 문제 완전 해결)
    const isAiMode = useContractStore((state) => state.isAiMode);
    const aiContract = useContractStore((state) => state.aiContract);
    const updateSection = useContractStore((state) => state.updateSection);
    const modifiedHtml = useContractStore((state) => state.modifiedHtml);
    const setModifiedHtml = useContractStore((state) => state.setModifiedHtml);
    const [selectedText, setSelectedText] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userRequest, setUserRequest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [modifiedText, setModifiedText] = useState('');
    const [showComparison, setShowComparison] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();

            if (text && text.length > 0) {
                const range = selection?.getRangeAt(0);
                const rect = range?.getBoundingClientRect();

                if (rect) {
                    setSelectedText(text);
                    // Use viewport coordinates for fixed positioning
                    const x = rect.left + rect.width / 2;
                    const y = rect.top;

                    setPosition({ x, y });
                    setShowPopup(true);
                }
            } else {
                setShowPopup(false);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            // Check if selection is within the document
            setTimeout(handleSelectionChange, 10);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                const selection = window.getSelection();
                if (!selection?.toString().trim()) {
                    setShowPopup(false);
                }
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOpenModal = () => {
        setShowModal(true);
        setShowPopup(false);
        setUserRequest('');
        setError('');
        setModifiedText('');
        setShowComparison(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userRequest.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/modify-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedText,
                    userRequest: userRequest.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '수정 요청 실패');
            }

            setModifiedText(data.text);
            setShowComparison(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        console.log('=== handleApply called ===');
        console.log('isAiMode (direct subscription):', isAiMode);
        console.log('aiContract exists (direct subscription):', !!aiContract);
        console.log('selectedText:', selectedText);
        console.log('modifiedText:', modifiedText);

        if (isAiMode && aiContract) {
            // AI 모드: sections에서 텍스트 찾아 교체
            let found = false;

            // 변수 치환 함수
            const substituteVariables = (content: string): string => {
                if (!aiContract.variables) return content;
                let result = content;
                Object.entries(aiContract.variables).forEach(([key, value]) => {
                    const placeholder = `[${key}]`;
                    const displayValue = value || placeholder;
                    result = result.split(placeholder).join(displayValue);
                });
                return result;
            };

            aiContract.sections.forEach((section) => {
                if (section.content.includes(selectedText)) {
                    console.log('Found in original content, section:', section.id);
                    const updatedContent = section.content.replace(selectedText, modifiedText);
                    updateSection(section.id, updatedContent);
                    found = true;
                } else {
                    const substitutedContent = substituteVariables(section.content);
                    if (substitutedContent.includes(selectedText)) {
                        console.log('Found in substituted content, section:', section.id);
                        const updatedContent = substitutedContent.replace(selectedText, modifiedText);
                        updateSection(section.id, updatedContent);
                        found = true;
                    }
                }
            });

            if (!found) {
                console.log('ERROR: Text not found in any section!');
                console.log('Sections:', aiContract.sections.map(s => s.id));
            }
        } else {
            // 템플릿 모드: HTML에서 직접 텍스트 교체
            console.log('Template mode - modifying HTML directly');

            // 현재 표시된 HTML 가져오기
            const previewElement = document.querySelector('.contract-preview-content');
            if (previewElement) {
                const currentHtml = modifiedHtml || previewElement.innerHTML;
                const newHtml = currentHtml.split(selectedText).join(modifiedText);
                setModifiedHtml(newHtml);
                console.log('HTML updated successfully');
            } else {
                console.log('ERROR: Preview element not found');
            }
        }

        setShowModal(false);
        setSelectedText('');
        setModifiedText('');
        setShowComparison(false);
        window.getSelection()?.removeAllRanges();
    };

    const handleRetry = () => {
        setShowComparison(false);
        setModifiedText('');
        setError('');
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <>
            {showPopup && (
                <div
                    ref={popupRef}
                    className="fixed z-[9999]"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-8px'
                    }}
                >
                    <button
                        onClick={handleOpenModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg shadow-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                        <Sparkles size={14} />
                        AI 수정
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-indigo-600" />
                </div>
            )}

            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full text-gray-900">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                <Sparkles className="text-indigo-600" size={20} />
                                선택 텍스트 AI 수정
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {!showComparison ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            선택된 텍스트
                                        </label>
                                        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm max-h-32 overflow-y-auto text-gray-800">
                                            {selectedText}
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            어떻게 수정할까요?
                                        </label>
                                        <textarea
                                            value={userRequest}
                                            onChange={(e) => setUserRequest(e.target.value)}
                                            placeholder="예: 금액을 100만원에서 200만원으로 변경해줘"
                                            className="w-full p-3 border border-gray-300 rounded-md text-sm min-h-[80px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white"
                                            disabled={isLoading}
                                            autoFocus
                                        />

                                        {error && (
                                            <p className="text-red-500 text-sm mt-2">{error}</p>
                                        )}

                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                                disabled={isLoading}
                                            >
                                                취소
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading || !userRequest.trim()}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={16} />
                                                        수정 중...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={16} />
                                                        수정하기
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded"></span>
                                                수정 전
                                            </label>
                                            <div className="bg-red-50 p-3 rounded-md border border-red-200 text-sm max-h-40 overflow-y-auto text-gray-800 line-through decoration-red-400">
                                                {selectedText}
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <ArrowRight className="text-gray-400" size={20} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded"></span>
                                                수정 후
                                            </label>
                                            <div className="bg-green-50 p-3 rounded-md border border-green-200 text-sm max-h-40 overflow-y-auto text-gray-800">
                                                {modifiedText}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRetry}
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium flex items-center gap-2 text-gray-700"
                                        >
                                            <RotateCcw size={16} />
                                            다시 수정
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleApply}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center gap-2"
                                        >
                                            <Check size={16} />
                                            적용하기
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
};
