'use client';

import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor, Position } from 'monaco-editor';
import { Info, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface HtmlEditorProps {
    htmlTemplate: string;
    onChange: (html: string) => void;
    variables: string[];
}

export default function HtmlEditor({ htmlTemplate, onChange, variables }: HtmlEditorProps) {
    const editorRef = useRef<any>(null);
    const [copied, setCopied] = useState(false);

    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // 자동완성 제공자 등록
        monaco.languages.registerCompletionItemProvider('html', {
            triggerCharacters: ['{'],
            provideCompletionItems: (model: editor.ITextModel, position: Position) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                // {{ 다음에 변수 자동완성
                if (textUntilPosition.endsWith('{{') || textUntilPosition.endsWith('{')) {
                    const suggestions = variables.map((variable) => ({
                        label: variable,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: textUntilPosition.endsWith('{{') ? `${variable}}}` : `{${variable}}}`,
                        documentation: `필드 변수: ${variable}`,
                    }));

                    return { suggestions };
                }

                return { suggestions: [] };
            },
        });
    };

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(`{{${variable}}}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const insertSnippet = (snippet: string) => {
        if (editorRef.current) {
            const selection = editorRef.current.getSelection();
            const id = { major: 1, minor: 1 };
            const op = {
                identifier: id,
                range: selection,
                text: snippet,
                forceMoveMarkers: true,
            };
            editorRef.current.executeEdits('snippet', [op]);
            editorRef.current.focus();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 에디터 */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b px-4 py-2 bg-gray-50">
                    <h3 className="font-medium text-sm">HTML 템플릿</h3>
                </div>
                <Editor
                    height="600px"
                    defaultLanguage="html"
                    value={htmlTemplate}
                    onChange={(value) => onChange(value || '')}
                    onMount={handleEditorMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        tabSize: 2,
                        automaticLayout: true,
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                    theme="vs-light"
                />
            </div>

            {/* 사이드바 */}
            <div className="space-y-4">
                {/* 변수 목록 */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-medium text-sm mb-3">사용 가능한 변수</h3>
                    {variables.length === 0 ? (
                        <p className="text-xs text-gray-500">
                            섹션에 필드를 추가하면 여기에 표시됩니다.
                        </p>
                    ) : (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                            {variables.map((variable) => (
                                <button
                                    key={variable}
                                    onClick={() => handleCopyVariable(variable)}
                                    className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between group"
                                >
                                    <code>{`{{${variable}}}`}</code>
                                    {copied ? (
                                        <Check className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <Copy className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 스니펫 */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-medium text-sm mb-3">빠른 삽입</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => insertSnippet(`<h1 class="text-2xl font-bold text-center mb-8">제목</h1>`)}
                            className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded"
                        >
                            제목 (h1)
                        </button>
                        <button
                            onClick={() => insertSnippet(`<p class="mb-2">내용</p>`)}
                            className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded"
                        >
                            문단 (p)
                        </button>
                        <button
                            onClick={() => insertSnippet(`<ol class="list-decimal list-outside pl-5 space-y-4">
  <li><span class="font-bold">조항 제목</span>: 내용</li>
</ol>`)}
                            className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded"
                        >
                            번호 목록 (ol)
                        </button>
                        <button
                            onClick={() => insertSnippet(`<div class="mt-12 pt-8 border-t">
  <p class="text-center mb-8">계약일: {{contract_date}}</p>
  <div class="grid grid-cols-2 gap-8 mt-8">
    <div class="text-center">
      <p class="font-bold mb-4">(갑)</p>
      <p>성명: {{party_a_name}}</p>
      <p class="mt-4">서명: ________________</p>
    </div>
    <div class="text-center">
      <p class="font-bold mb-4">(을)</p>
      <p>성명: {{party_b_name}}</p>
      <p class="mt-4">서명: ________________</p>
    </div>
  </div>
</div>`)}
                            className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded"
                        >
                            서명란
                        </button>
                        <button
                            onClick={() => insertSnippet(`<table class="w-full border-collapse">
  <thead>
    <tr class="bg-gray-100">
      <th class="border px-3 py-2 text-left">항목</th>
      <th class="border px-3 py-2 text-left">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border px-3 py-2">항목명</td>
      <td class="border px-3 py-2">{{변수}}</td>
    </tr>
  </tbody>
</table>`)}
                            className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded"
                        >
                            테이블
                        </button>
                    </div>
                </div>

                {/* 도움말 */}
                <div className="bg-blue-50 rounded-lg p-4 text-xs text-blue-700">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium mb-1">변수 사용법</p>
                            <p>
                                {`{{필드ID}}`} 형태로 입력하면 폼에서 입력한 값으로 자동 치환됩니다.
                            </p>
                            <p className="mt-2">
                                Tailwind CSS 클래스를 사용할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
