'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useContractStore } from '@/store/useContractStore';
import { useEffect } from 'react';

const formSchema = z.object({
    employer_name: z.string().min(1, '사업주명을 입력해주세요'),
    employee_name: z.string().min(1, '근로자명을 입력해주세요'),
    start_date: z.string().min(1, '시작일을 입력해주세요'),
    end_date: z.string().optional(),
    job_description: z.string().min(1, '업무내용을 입력해주세요'),
    salary: z.string().min(1, '급여를 입력해주세요'),
    payment_date: z.string().min(1, '지급일을 입력해주세요'),
});

type FormData = z.infer<typeof formSchema>;

export const ContractForm = () => {
    const setContractData = useContractStore((state) => state.setContractData);

    const { register, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: useContractStore.getState().contractData,
        mode: 'onChange',
    });

    const watchedData = watch();

    useEffect(() => {
        setContractData(watchedData);
    }, [JSON.stringify(watchedData), setContractData]);

    return (
        <form className="space-y-4 p-6 bg-gray-50 h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">계약 정보 입력</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">사업주명 (갑)</label>
                    <input
                        {...register('employer_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="주식회사 컴퍼니"
                    />
                    {errors.employer_name && <p className="text-red-500 text-xs mt-1">{errors.employer_name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">근로자명 (을)</label>
                    <input
                        {...register('employee_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="홍길동"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">계약 시작일</label>
                    <input
                        type="date"
                        {...register('start_date')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">계약 종료일 (선택)</label>
                    <input
                        type="date"
                        {...register('end_date')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">업무 내용</label>
                <input
                    {...register('job_description')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="소프트웨어 개발 및 유지보수"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">월 급여 (원)</label>
                    <input
                        type="number"
                        {...register('salary')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="3000000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">급여 지급일</label>
                    <input
                        type="number"
                        {...register('payment_date')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="25"
                        min="1"
                        max="31"
                    />
                </div>
            </div>
        </form>
    );
};
