import React from 'react';

interface ContractData {
    employer_name: string;
    employee_name: string;
    start_date: string;
    end_date: string;
    job_description: string;
    salary: string;
    payment_date: string;
}

export const LaborContract = ({ data }: { data: ContractData }) => {
    return (
        <div className="p-8 bg-white text-black shadow-lg max-w-[210mm] min-h-[297mm] mx-auto text-sm leading-relaxed">
            <h1 className="text-2xl font-bold text-center mb-8">표준 근로계약서</h1>

            <div className="mb-6">
                <p className="mb-2">
                    <span className="font-bold">{data.employer_name || '(사업주)'}</span> (이하 "갑"이라 함)과(와)
                    <span className="font-bold"> {data.employee_name || '(근로자)'}</span> (이하 "을"이라 함)은(는) 다음과 같이 근로계약을 체결한다.
                </p>
            </div>

            <ol className="list-decimal list-outside pl-5 space-y-4">
                <li>
                    <span className="font-bold">근로계약기간</span>:
                    {data.start_date || '____. __. __'} 부터 {data.end_date || '____. __. __'} 까지
                </li>
                <li>
                    <span className="font-bold">근무장소 및 업무내용</span>:
                    <p className="pl-2">
                        - 업무내용: {data.job_description || '____________________'}
                    </p>
                </li>
                <li>
                    <span className="font-bold">근로시간 및 휴게시간</span>:
                    <p className="pl-2">
                        - 근로시간: 09:00 부터 18:00 까지
                    </p>
                    <p className="pl-2">
                        - 휴게시간: 12:00 부터 13:00 까지
                    </p>
                </li>
                <li>
                    <span className="font-bold">임금</span>:
                    <p className="pl-2">
                        - 월급: {data.salary || '_________'} 원
                    </p>
                    <p className="pl-2">
                        - 지급일: 매월 {data.payment_date || '__'} 일
                    </p>
                </li>
                <li>
                    <span className="font-bold">기타</span>:
                    <p className="pl-2">
                        - 이 계약에 정함이 없는 사항은 근로기준법 등 노동관계법령에 따른다.
                    </p>
                </li>
            </ol>

            <div className="mt-12 flex justify-between items-end">
                <div className="text-center">
                    <p className="mb-4 font-bold">(사업주)</p>
                    <p>상호: ________________</p>
                    <p>주소: ________________</p>
                    <p>대표자: {data.employer_name || '__________'} (서명)</p>
                </div>
                <div className="text-center">
                    <p className="mb-4 font-bold">(근로자)</p>
                    <p>주소: ________________</p>
                    <p>연락처: ________________</p>
                    <p>성명: {data.employee_name || '__________'} (서명)</p>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                * 본 계약서는 Contract Auto-Bot에 의해 자동 생성되었습니다.
            </div>
        </div>
    );
};
