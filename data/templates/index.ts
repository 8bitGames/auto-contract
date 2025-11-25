import { laborContract } from './labor-contract';
import { nda } from './nda';
import { loanAgreement } from './loan-agreement';
import { serviceDevelopmentAgreement } from './service-development-agreement';
import { outsourcingStandardAgreement } from './outsourcing-standard-agreement';
import { Template } from '@/types/template';

export const templates: Template[] = [
    laborContract,
    nda,
    loanAgreement,
    serviceDevelopmentAgreement,
    outsourcingStandardAgreement,
];

export const getTemplateById = (id: string): Template | undefined => {
    return templates.find((t) => t.id === id);
};
