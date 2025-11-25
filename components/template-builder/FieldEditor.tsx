'use client';

import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Section, Field, FieldType } from '@/types/template';

interface FieldEditorProps {
    section: Section;
    onAddField: () => void;
    onUpdateField: (fieldId: string, updates: Partial<Field>) => void;
    onDeleteField: (fieldId: string) => void;
}

const fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'text', label: '텍스트' },
    { value: 'textarea', label: '긴 텍스트' },
    { value: 'date', label: '날짜' },
    { value: 'number', label: '숫자' },
    { value: 'currency', label: '금액' },
];

export default function FieldEditor({
    section,
    onAddField,
    onUpdateField,
    onDeleteField,
}: FieldEditorProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">{section.title}</h3>
                <button
                    onClick={onAddField}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" />
                    필드 추가
                </button>
            </div>

            {section.fields.length === 0 ? (
                <p className="text-center py-6 text-gray-500 text-sm">
                    필드가 없습니다. 필드를 추가하세요.
                </p>
            ) : (
                <div className="space-y-3">
                    {section.fields.map((field) => (
                        <div
                            key={field.id}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                        >
                            <div className="flex items-start gap-2 mb-3">
                                <GripVertical className="w-4 h-4 text-gray-400 mt-2 cursor-grab" />

                                <div className="flex-1 space-y-2">
                                    {/* 필드 라벨 */}
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="필드 라벨"
                                    />

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* 필드 타입 */}
                                        <select
                                            value={field.type}
                                            onChange={(e) => onUpdateField(field.id, { type: e.target.value as FieldType })}
                                            className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            {fieldTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Placeholder */}
                                        <input
                                            type="text"
                                            value={field.placeholder || ''}
                                            onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
                                            className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="힌트 텍스트"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* 필수 여부 */}
                                        <label className="flex items-center gap-1.5 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={field.required || false}
                                                onChange={(e) => onUpdateField(field.id, { required: e.target.checked })}
                                                className="rounded border-gray-300"
                                            />
                                            필수
                                        </label>

                                        {/* 필드 ID (읽기 전용) */}
                                        <span className="text-xs text-gray-400">
                                            ID: {field.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (confirm('이 필드를 삭제하시겠습니까?')) {
                                            onDeleteField(field.id);
                                        }
                                    }}
                                    className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 변수 힌트 */}
                            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                                HTML에서 사용: <code className="bg-gray-100 px-1 rounded">{`{{${field.id}}}`}</code>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
