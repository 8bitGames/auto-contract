import { Template } from '@/types/template';

export const loanAgreement: Template = {
    id: 'loan_agreement',
    title: '금전소비대차계약서 (차용증)',
    description: '돈을 빌려주고 갚기로 하는 계약입니다.',
    sections: [
        {
            id: 'parties',
            title: '당사자 정보',
            fields: [
                { id: 'lender_name', label: '대주 (빌려주는 사람)', type: 'text', placeholder: '김철수', required: true },
                { id: 'borrower_name', label: '차주 (빌리는 사람)', type: 'text', placeholder: '이영희', required: true },
            ],
        },
        {
            id: 'loan_details',
            title: '대여 조건',
            fields: [
                { id: 'amount', label: '대여금액 (원)', type: 'currency', placeholder: '10000000', required: true },
                { id: 'interest_rate', label: '이자율 (연 %)', type: 'number', placeholder: '5', required: true },
                { id: 'repayment_date', label: '변제기일', type: 'date', required: true },
            ],
        },
    ],
    htmlContent: (data) => `
    <h1 class="text-2xl font-bold text-center mb-8">금전소비대차계약서</h1>
    <div class="mb-6">
      <p class="mb-2">
        <span class="font-bold">${data.lender_name || '(대주)'}</span> (이하 "갑"이라 함)과(와) 
        <span class="font-bold"> ${data.borrower_name || '(차주)'}</span> (이하 "을"이라 함)은(는) 다음과 같이 금전소비대차계약을 체결한다.
      </p>
    </div>
    <ol class="list-decimal list-outside pl-5 space-y-4">
      <li>
        <span class="font-bold">대여금액</span>: 
        일금 ${data.amount ? parseInt(data.amount).toLocaleString() : '_________'} 원정
      </li>
      <li>
        <span class="font-bold">이자</span>: 
        연 ${data.interest_rate || '__'} % 로 한다.
      </li>
      <li>
        <span class="font-bold">변제기일 및 방법</span>: 
        "을"은 ${data.repayment_date || '____. __. __'} 까지 원리금 전액을 "갑"에게 변제하여야 한다.
      </li>
    </ol>
    <div class="mt-12 flex justify-between items-end">
      <div class="text-center">
        <p class="mb-4 font-bold">(대주)</p>
        <p>성명: ${data.lender_name || '__________'} (인)</p>
      </div>
      <div class="text-center">
        <p class="mb-4 font-bold">(차주)</p>
        <p>성명: ${data.borrower_name || '__________'} (인)</p>
      </div>
    </div>
  `,
};
