import { create } from 'zustand';

interface ContractStore {
    selectedTemplateId: string;
    contractData: Record<string, any>;
    setSelectedTemplateId: (id: string) => void;
    setContractData: (data: Record<string, any>) => void;
    resetContractData: () => void;
}

export const useContractStore = create<ContractStore>((set) => ({
    selectedTemplateId: 'labor_contract',
    contractData: {},
    setSelectedTemplateId: (id) => set({ selectedTemplateId: id, contractData: {} }),
    setContractData: (data) =>
        set((state) => ({
            contractData: { ...state.contractData, ...data },
        })),
    resetContractData: () => set({ contractData: {} }),
}));
