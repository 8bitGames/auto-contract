export type FieldType = 'text' | 'date' | 'number' | 'currency' | 'textarea';

export interface Field {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
}

export interface Section {
    id: string;
    title: string;
    fields: Field[];
}

export interface Template {
    id: string;
    title: string;
    description: string;
    sections: Section[];
    htmlContent: (data: Record<string, any>) => string; // Function to generate HTML for preview/PDF
}

// AI 생성 계약서용 새 데이터 구조
export interface ContractSection {
    id: string;
    title: string;    // 예: "제1조 (목적)"
    content: string;  // 예: "본 계약은 '갑'이 '을'에게..."
}

export interface ContractData {
    title: string;                      // 계약서 제목
    sections: ContractSection[];        // 모든 조항은 섹션 리스트로 관리
    variables?: Record<string, string>; // (선택사항) 템플릿 변수들
}

// 사용자 커스텀 템플릿
export interface CustomTemplate {
    id: string;
    userId: string;
    title: string;
    description: string;
    sections: Section[];
    htmlTemplate: string;  // 문자열 템플릿 ({{field_id}} 형태)
    isCustom: true;
    createdAt: string;
    updatedAt: string;
}

// 템플릿 타입 유니온 (기본 + 커스텀)
export type AnyTemplate = Template | CustomTemplate;

// 커스텀 템플릿 타입 가드
export function isCustomTemplate(template: AnyTemplate): template is CustomTemplate {
    return 'isCustom' in template && template.isCustom === true;
}
