'use client';

import { useForm } from 'react-hook-form';
import { useContractStore } from '@/store/useContractStore';
import { useEffect } from 'react';
import { Template } from '@/types/template';

interface DynamicFormProps {
    template: Template;
}

export const DynamicForm = ({ template }: DynamicFormProps) => {
    const setContractData = useContractStore((state) => state.setContractData);
    const contractData = useContractStore((state) => state.contractData);

    const { register, watch, reset, formState: { errors } } = useForm({
        defaultValues: contractData,
        mode: 'onChange',
    });

    const watchedData = watch();

    // Reset form when template changes
    useEffect(() => {
        reset(contractData);
    }, [template.id, reset]);

    // Update store when form data changes
    useEffect(() => {
        setContractData(watchedData);
    }, [JSON.stringify(watchedData), setContractData]);

    return (
        <form className="space-y-6 p-6 bg-gray-50 h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{template.title} 작성</h2>

            {template.sections.map((section) => (
                <div key={section.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{section.title}</h3>
                    <div className="space-y-4">
                        {section.fields.map((field) => (
                            <div key={field.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        {...register(field.id, { required: field.required })}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border min-h-[100px]"
                                        placeholder={field.placeholder}
                                    />
                                ) : (
                                    <input
                                        type={field.type === 'currency' ? 'number' : field.type}
                                        {...register(field.id, { required: field.required })}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </form>
    );
};
