import { create, StoreApi, UseBoundStore } from 'zustand';
import { ContractSection, ContractData, CustomTemplate, Section } from '@/types/template';

interface ContractStore {
    // 기존 템플릿 모드
    selectedTemplateId: string;
    contractData: Record<string, any>;
    modifiedHtml: string | null; // AI 수정된 HTML (템플릿 모드용)
    setSelectedTemplateId: (id: string) => void;
    setContractData: (data: Record<string, any>) => void;
    setModifiedHtml: (html: string | null) => void;
    resetContractData: () => void;

    // AI 생성 계약서 모드
    aiContract: ContractData | null;
    isAiMode: boolean;
    setAiContract: (contract: ContractData) => void;
    updateSection: (sectionId: string, content: string) => void;
    updateVariable: (key: string, value: string) => void;
    setIsAiMode: (isAi: boolean) => void;
    resetAiContract: () => void;

    // 커스텀 템플릿 관리
    customTemplates: CustomTemplate[];
    editingTemplate: CustomTemplate | null;
    setCustomTemplates: (templates: CustomTemplate[]) => void;
    addCustomTemplate: (template: CustomTemplate) => void;
    updateCustomTemplate: (id: string, template: Partial<CustomTemplate>) => void;
    deleteCustomTemplate: (id: string) => void;
    setEditingTemplate: (template: CustomTemplate | null) => void;
    updateEditingTemplate: (updates: Partial<CustomTemplate>) => void;
    addSectionToEditing: (section: Section) => void;
    updateSectionInEditing: (sectionId: string, section: Partial<Section>) => void;
    deleteSectionFromEditing: (sectionId: string) => void;
    reorderSectionsInEditing: (sections: Section[]) => void;
}

// 전역 싱글톤 보장 (Next.js HMR 및 모듈 중복 로드 방지)
type ContractStoreType = UseBoundStore<StoreApi<ContractStore>>;

const globalForStore = globalThis as typeof globalThis & {
    __contractStore?: ContractStoreType;
};

const createContractStore = (): ContractStoreType => create<ContractStore>((set) => ({
    // 기존 템플릿 모드
    selectedTemplateId: 'labor_contract',
    contractData: {},
    modifiedHtml: null,
    setSelectedTemplateId: (id) => set({ selectedTemplateId: id, contractData: {}, modifiedHtml: null }),
    setContractData: (data) =>
        set((state) => ({
            contractData: { ...state.contractData, ...data },
        })),
    setModifiedHtml: (html) => set({ modifiedHtml: html }),
    resetContractData: () => set({ contractData: {}, modifiedHtml: null }),

    // AI 생성 계약서 모드
    aiContract: null,
    isAiMode: false,
    setAiContract: (contract) => set({ aiContract: contract, isAiMode: true }),
    updateSection: (sectionId, content) =>
        set((state) => {
            if (!state.aiContract) return state;
            return {
                aiContract: {
                    ...state.aiContract,
                    sections: state.aiContract.sections.map((section) =>
                        section.id === sectionId
                            ? { ...section, content }
                            : section
                    ),
                },
            };
        }),
    updateVariable: (key, value) =>
        set((state) => {
            if (!state.aiContract) return state;
            return {
                aiContract: {
                    ...state.aiContract,
                    variables: {
                        ...state.aiContract.variables,
                        [key]: value,
                    },
                },
            };
        }),
    setIsAiMode: (isAi) => set({ isAiMode: isAi }),
    resetAiContract: () => set({ aiContract: null, isAiMode: false }),

    // 커스텀 템플릿 관리
    customTemplates: [],
    editingTemplate: null,
    setCustomTemplates: (templates) => set({ customTemplates: templates }),
    addCustomTemplate: (template) =>
        set((state) => ({
            customTemplates: [...state.customTemplates, template],
        })),
    updateCustomTemplate: (id, updates) =>
        set((state) => ({
            customTemplates: state.customTemplates.map((t) =>
                t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
            ),
        })),
    deleteCustomTemplate: (id) =>
        set((state) => ({
            customTemplates: state.customTemplates.filter((t) => t.id !== id),
        })),
    setEditingTemplate: (template) => set({ editingTemplate: template }),
    updateEditingTemplate: (updates) =>
        set((state) => ({
            editingTemplate: state.editingTemplate
                ? { ...state.editingTemplate, ...updates }
                : null,
        })),
    addSectionToEditing: (section) =>
        set((state) => ({
            editingTemplate: state.editingTemplate
                ? {
                    ...state.editingTemplate,
                    sections: [...state.editingTemplate.sections, section],
                }
                : null,
        })),
    updateSectionInEditing: (sectionId, updates) =>
        set((state) => ({
            editingTemplate: state.editingTemplate
                ? {
                    ...state.editingTemplate,
                    sections: state.editingTemplate.sections.map((s) =>
                        s.id === sectionId ? { ...s, ...updates } : s
                    ),
                }
                : null,
        })),
    deleteSectionFromEditing: (sectionId) =>
        set((state) => ({
            editingTemplate: state.editingTemplate
                ? {
                    ...state.editingTemplate,
                    sections: state.editingTemplate.sections.filter((s) => s.id !== sectionId),
                }
                : null,
        })),
    reorderSectionsInEditing: (sections) =>
        set((state) => ({
            editingTemplate: state.editingTemplate
                ? { ...state.editingTemplate, sections }
                : null,
        })),
}));

// 싱글톤 인스턴스 사용
export const useContractStore: ContractStoreType = globalForStore.__contractStore ?? createContractStore();

// 개발 환경에서 HMR 시에도 같은 인스턴스 유지
if (process.env.NODE_ENV !== 'production') {
    globalForStore.__contractStore = useContractStore;
}
