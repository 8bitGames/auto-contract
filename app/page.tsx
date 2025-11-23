'use client';

import { DynamicForm } from '@/components/DynamicForm';
import { DynamicPreview } from '@/components/DynamicPreview';
import { useContractStore } from '@/store/useContractStore';
import { templates, getTemplateById } from '@/data/templates';
import { Download, FileText, Save, LogIn, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const { selectedTemplateId, setSelectedTemplateId, contractData, setContractData } = useContractStore();
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractId = searchParams.get('id');

  const selectedTemplate = getTemplateById(selectedTemplateId) || templates[0];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const loadContract = async () => {
      if (contractId) {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contractId)
          .single();

        if (data && !error) {
          setSelectedTemplateId(data.template_id);
          setContractData(data.data);
        }
      }
    };
    loadContract();
  }, [contractId, setSelectedTemplateId, setContractData, supabase]);

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          data: contractData,
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.title}.pdf`;
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
      const contractPayload = {
        user_id: user.id,
        template_id: selectedTemplate.id,
        title: `${selectedTemplate.title} - ${new Date().toLocaleDateString()}`,
        data: contractData,
        updated_at: new Date().toISOString(),
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
      alert('계약서가 저장되었습니다.');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving contract:', error);
      alert(`저장 실패: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Contract Auto-Bot
            </h1>
          </Link>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-gray-50"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
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
        {/* Left Pane: Dynamic Form */}
        <div className="w-1/3 min-w-[400px] border-r bg-white overflow-hidden flex flex-col shadow-md z-0">
          <DynamicForm template={selectedTemplate} />
        </div>

        {/* Right Pane: Dynamic Preview */}
        <div className="flex-1 overflow-auto p-8 bg-gray-200 flex justify-center">
          <div className="transform scale-100 origin-top">
            <DynamicPreview template={selectedTemplate} data={contractData} />
          </div>
        </div>
      </div>
    </main>
  );
}
