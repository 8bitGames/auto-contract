import { Template } from '@/types/template';

export const laborContract: Template = {
    id: 'labor_contract',
    title: '표준 근로계약서',
    description: '일반적인 근로 계약을 위한 표준 양식입니다.',
    sections: [
        {
            id: 'parties',
            title: '당사자 정보',
            fields: [
                { id: 'employer_name', label: '사업주명 (갑)', type: 'text', placeholder: '주식회사 컴퍼니', required: true },
                { id: 'employee_name', label: '근로자명 (을)', type: 'text', placeholder: '홍길동', required: true },
            ],
        },
        {
            id: 'period',
            title: '계약 기간',
            fields: [
                { id: 'start_date', label: '시작일', type: 'date', required: true },
                { id: 'end_date', label: '종료일 (선택)', type: 'date' },
            ],
        },
        {
            id: 'work',
            title: '업무 및 급여',
            fields: [
                { id: 'job_description', label: '업무 내용', type: 'text', placeholder: '소프트웨어 개발', required: true },
                { id: 'salary', label: '월 급여 (원)', type: 'currency', placeholder: '3000000', required: true },
                { id: 'payment_date', label: '급여 지급일', type: 'number', placeholder: '25', required: true },
            ],
        },
    ],
    htmlContent: (data) => `
    <h1 class="text-2xl font-bold text-center mb-8">표준 근로계약서</h1>
    <div class="mb-6">
      <p class="mb-2">
        <span class="font-bold">${data.employer_name || '(사업주)'}</span> (이하 "갑"이라 함)과(와) 
        <span class="font-bold"> ${data.employee_name || '(근로자)'}</span> (이하 "을"이라 함)은(는) 다음과 같이 근로계약을 체결한다.
      </p>
    </div>
    <ol class="list-decimal list-outside pl-5 space-y-4">
      <li>
        <span class="font-bold">근로계약기간</span>: 
        ${data.start_date || '____. __. __'} 부터 ${data.end_date || '____. __. __'} 까지
      </li>
      <li>
        <span class="font-bold">근무장소 및 업무내용</span>: 
        <p class="pl-2">- 업무내용: ${data.job_description || '____________________'}</p>
      </li>
      <li>
        <span class="font-bold">근로시간 및 휴게시간</span>: 
        <p class="pl-2">- 근로시간: 09:00 부터 18:00 까지</p>
        <p class="pl-2">- 휴게시간: 12:00 부터 13:00 까지</p>
      </li>
      <li>
        <span class="font-bold">임금</span>:
        <p class="pl-2">- 월급: ${data.salary ? parseInt(data.salary).toLocaleString() : '_________'} 원</p>
        <p class="pl-2">- 지급일: 매월 ${data.payment_date || '__'} 일</p>
      </li>
      <li>
        <span class="font-bold">기타</span>:
        <p class="pl-2">- 이 계약에 정함이 없는 사항은 근로기준법 등 노동관계법령에 따른다.
      </li>
    </ol>
    <div class="mt-12 flex justify-between items-end">
      <div class="text-center">
        <p class="mb-4 font-bold">(사업주)</p>
        <p>상호: ________________</p>
        <p>주소: ________________</p>
        <p>대표자: ${data.employer_name || '__________'} (서명)</p>
      </div>
      <div class="text-center">
        <p class="mb-4 font-bold">(근로자)</p>
        <p>주소: ________________</p>
        <p>연락처: ________________</p>
        <p>성명: ${data.employee_name || '__________'} (서명)</p>
      </div>
    </div>
  `,
};
