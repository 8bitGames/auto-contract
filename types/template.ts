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
