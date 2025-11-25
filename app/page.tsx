'use client';

import { DynamicForm } from '@/components/DynamicForm';
import { DynamicPreview } from '@/components/DynamicPreview';
import { DynamicContract } from '@/components/DynamicContract';
import { NewContractModal } from '@/components/NewContractModal';
import { NewTemplateModal } from '@/components/NewTemplateModal';
import { AiContractForm } from '@/components/AiContractForm';
import { useContractStore } from '@/store/useContractStore';
import { templates, getTemplateById } from '@/data/templates';
import { AnyTemplate, isCustomTemplate } from '@/types/template';
import { Download, FileText, Save, LogIn, User, Sparkles, ArrowLeft, Plus } from 'lucide-react';
import { TextSelectionPopup } from '@/components/TextSelectionPopup';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const DRAFT_KEY = 'contract_draft';
const AUTOSAVE_DELAY = 2000; // 2초

function HomeContent() {
  const {
    selectedTemplateId,
    setSelectedTemplateId,
    contractData,
    setContractData,
    modifiedHtml,
    setModifiedHtml,
    aiContract,
    isAiMode,
    resetAiContract,
    customTemplates,
  } = useContractStore();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractId = searchParams.get('id');
  const isNewContract = searchParams.get('new') === 'true';
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // 기본 템플릿 또는 커스텀 템플릿 선택
  const selectedTemplate: AnyTemplate = (() => {
    // 먼저 기본 템플릿에서 찾기
    const builtIn = getTemplateById(selectedTemplateId);
    if (builtIn) return builtIn;

    // 커스텀 템플릿에서 찾기
    const custom = customTemplates.find(t => t.id === selectedTemplateId);
    if (custom) return custom;

    // 기본값
    return templates[0];
  })();

  // 드래프트 저장
  const saveDraft = useCallback(() => {
    const draft = {
      selectedTemplateId,
      contractData,
      aiContract,
      isAiMode,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [selectedTemplateId, contractData, aiContract, isAiMode]);

  // 드래프트 불러오기
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        // 1시간 이내의 드래프트만 복구
        const savedTime = new Date(draft.savedAt).getTime();
        const now = new Date().getTime();
        if (now - savedTime < 60 * 60 * 1000) {
          return draft;
        }
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
    return null;
  }, []);

  // 드래프트 삭제
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  // 템플릿 변경 시 새로 시작
  const handleTemplateChange = useCallback((newTemplateId: string) => {
    clearDraft();
    setModifiedHtml(null);
    setSelectedTemplateId(newTemplateId);
  }, [clearDraft, setModifiedHtml, setSelectedTemplateId]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push('/login');
      }
    };
    getUser();
  }, [supabase.auth, router]);

  // 페이지 로드 시 드래프트 복구 또는 새 계약서 시작
  useEffect(() => {
    if (isNewContract) {
      // 새 계약서 작성: 모든 데이터 초기화
      clearDraft();
      resetAiContract();
      setContractData({});
      setModifiedHtml(null);
      setSelectedTemplateId(templates[0].id);
    } else if (!contractId) {
      // 기존 드래프트 복구
      const draft = loadDraft();
      if (draft) {
        setSelectedTemplateId(draft.selectedTemplateId);
        setContractData(draft.contractData);
        if (draft.aiContract && draft.isAiMode) {
          useContractStore.getState().setAiContract(draft.aiContract);
        }
        setDraftRestored(true);
        setTimeout(() => setDraftRestored(false), 3000);
      }
    }
  }, [contractId, isNewContract, loadDraft, clearDraft, resetAiContract, setContractData, setModifiedHtml, setSelectedTemplateId]);

  // 자동 저장 (데이터 변경 시)
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    autoSaveTimer.current = setTimeout(() => {
      saveDraft();
    }, AUTOSAVE_DELAY);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [contractData, aiContract, selectedTemplateId, isAiMode, saveDraft]);

  useEffect(() => {
    const loadContract = async () => {
      if (contractId) {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contractId)
          .single();

        if (data && !error) {
          if (data.template_id === 'ai_generated') {
            // AI 계약서인 경우
            useContractStore.getState().setAiContract(data.data);
          } else {
            // 일반 템플릿인 경우
            resetAiContract();
            setSelectedTemplateId(data.template_id);
            // modifiedHtml 복원
            const { _modifiedHtml, ...restData } = data.data || {};
            setContractData(restData);
            if (_modifiedHtml) {
              setModifiedHtml(_modifiedHtml);
            }
          }
        }
      }
    };
    loadContract();
  }, [contractId, setSelectedTemplateId, setContractData, supabase]);

  const handleDownloadPdf = async () => {
    try {
      const isCustom = isCustomTemplate(selectedTemplate);

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: isAiMode ? 'ai_generated' : selectedTemplate.id,
          data: isAiMode ? aiContract : contractData,
          isAiMode,
          // 커스텀 템플릿인 경우 htmlTemplate도 전송
          ...(isCustom && !isAiMode && {
            htmlTemplate: selectedTemplate.htmlTemplate,
            title: selectedTemplate.title,
          }),
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = isAiMode && aiContract ? aiContract.title : selectedTemplate.title;
      a.download = filename + '.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setSaving(true);
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const titleBase = isAiMode && aiContract ? aiContract.title : selectedTemplate.title;

      const contractPayload = {
        user_id: user.id,
        template_id: isAiMode ? 'ai_generated' : selectedTemplate.id,
        title: titleBase + ' - ' + dateStr,
        data: isAiMode ? aiContract : { ...contractData, _modifiedHtml: modifiedHtml },
        updated_at: now.toISOString(),
      };

      let error;
      if (contractId) {
        const { error: updateError } = await supabase
          .from('contracts')
          .update(contractPayload)
          .eq('id', contractId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('contracts')
          .insert([contractPayload]);
        error = insertError;
      }

      if (error) throw error;
      clearDraft();
      alert('계약서가 저장되었습니다.');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving contract:', error);
      alert('저장 실패: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBackToTemplate = () => {
    resetAiContract();
  };

  // 로딩 중이거나 로그인 안 된 경우
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-100">
      {/* 드래프트 복구 알림 */}
      {draftRestored && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          ✓ 이전 작업 내용을 복구했습니다
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Contract Auto-Bot
            </h1>
          </Link>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {isAiMode ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToTemplate}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <ArrowLeft size={16} />
                템플릿 모드로
              </button>
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Sparkles size={14} />
                AI 생성 모드
              </span>
            </div>
          ) : (
            <>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-gray-50 text-gray-900"
              >
                <optgroup label="기본 템플릿">
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </optgroup>
                {customTemplates.length > 0 && (
                  <optgroup label="내 템플릿">
                    {customTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <button
                onClick={() => setShowNewTemplateModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                <Plus size={16} />
                템플릿 만들기
              </button>

              <button
                onClick={() => setShowNewContractModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm shadow-md"
              >
                <Sparkles size={16} />
                AI로 새로 만들기
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
              >
                <User size={16} />
                내 보관함
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? '저장 중...' : '저장'}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium shadow-sm"
            >
              <LogIn size={18} />
              로그인
            </Link>
          )}

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Download size={18} />
            PDF 다운로드
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 min-w-[400px] border-r bg-white overflow-hidden flex flex-col shadow-md z-0">
          {isAiMode ? (
            <AiContractForm />
          ) : (
            <DynamicForm template={selectedTemplate} />
          )}
        </div>

        <div className="flex-1 overflow-auto p-8 bg-gray-200 flex justify-center">
          <div className="transform scale-100 origin-top">
            {isAiMode && aiContract ? (
              <DynamicContract contract={aiContract} />
            ) : (
              <DynamicPreview template={selectedTemplate} data={contractData} />
            )}
          </div>
        </div>
      </div>

      {showNewContractModal && (
        <NewContractModal onClose={() => setShowNewContractModal(false)} />
      )}

      {showNewTemplateModal && (
        <NewTemplateModal onClose={() => setShowNewTemplateModal(false)} />
      )}

      <TextSelectionPopup />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
