'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Section } from '@/types/template';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTemplateGenerated: (data: {
        title: string;
        description: string;
        sections: Section[];
        htmlTemplate: string;
    }) => void;
}

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';

export default function DocumentUploadModal({
    isOpen,
    onClose,
    onTemplateGenerated,
}: DocumentUploadModalProps) {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // 파일 타입 검증
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('PDF 파일만 지원됩니다.');
            setUploadState('error');
            return;
        }

        // 파일 크기 검증 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage('파일 크기는 10MB 이하여야 합니다.');
            setUploadState('error');
            return;
        }

        setSelectedFile(file);
        setErrorMessage('');
        setUploadState('idle');
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploadState('uploading');
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            setUploadState('analyzing');

            const response = await fetch('/api/ai/parse-document', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '문서 분석 실패');
            }

            setUploadState('success');

            // 약간의 딜레이 후 콜백 호출
            setTimeout(() => {
                onTemplateGenerated({
                    title: result.template.title,
                    description: result.template.description,
                    sections: result.template.sections,
                    htmlTemplate: result.template.htmlTemplate,
                });
                handleClose();
            }, 1000);
        } catch (error: any) {
            console.error('Upload error:', error);
            setErrorMessage(error.message || '문서 분석 중 오류가 발생했습니다.');
            setUploadState('error');
        }
    };

    const handleClose = () => {
        setUploadState('idle');
        setSelectedFile(null);
        setErrorMessage('');
        onClose();
    };

    const getStateContent = () => {
        switch (uploadState) {
            case 'uploading':
                return (
                    <div className="text-center py-8">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium">파일 업로드 중...</p>
                    </div>
                );
            case 'analyzing':
                return (
                    <div className="text-center py-8">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium">AI가 문서를 분석 중입니다...</p>
                        <p className="text-sm text-gray-500 mt-2">
                            계약서 구조와 필드를 추출하고 있습니다.
                            <br />
                            이 작업은 최대 1분 정도 소요될 수 있습니다.
                        </p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <p className="text-lg font-medium text-green-600">분석 완료!</p>
                        <p className="text-sm text-gray-500 mt-2">
                            템플릿이 생성되었습니다.
                        </p>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <p className="text-lg font-medium text-red-600">오류 발생</p>
                        <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
                        <button
                            onClick={() => setUploadState('idle')}
                            className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            다시 시도
                        </button>
                    </div>
                );
            default:
                return (
                    <>
                        {/* 드래그 앤 드롭 영역 */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : selectedFile
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileInput}
                                className="hidden"
                            />

                            {selectedFile ? (
                                <div>
                                    <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                    <p className="font-medium text-green-600">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                        className="mt-3 text-sm text-red-600 hover:underline"
                                    >
                                        파일 변경
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="font-medium">
                                        PDF 파일을 드래그하거나 클릭하여 업로드
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        최대 10MB, PDF 형식 지원
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 설명 */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-sm mb-2">AI가 분석하는 내용:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• 계약서 구조 및 조항</li>
                                <li>• 입력 필드 (이름, 날짜, 금액 등)</li>
                                <li>• 테이블 레이아웃</li>
                                <li>• 서명란 구조</li>
                            </ul>
                        </div>

                        {/* 버튼 */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile}
                                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                분석 시작
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={uploadState === 'idle' || uploadState === 'error' ? handleClose : undefined}
            />

            {/* 모달 */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">문서로 템플릿 만들기</h3>
                    {(uploadState === 'idle' || uploadState === 'error') && (
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* 컨텐츠 */}
                <div className="p-4">{getStateContent()}</div>
            </div>
        </div>
    );
}
