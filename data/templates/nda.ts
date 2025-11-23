import { Template } from '@/types/template';

export const nda: Template = {
    id: 'nda',
    title: '비밀유지서약서 (NDA)',
    description: '기업의 기밀 정보 보호를 위한 서약서입니다.',
    sections: [
        {
            id: 'parties',
            title: '당사자 정보',
            fields: [
                { id: 'company_name', label: '회사명 (갑)', type: 'text', placeholder: '주식회사 컴퍼니', required: true },
                { id: 'recipient_name', label: '정보수령자 (을)', type: 'text', placeholder: '홍길동', required: true },
            ],
        },
        {
            id: 'details',
            title: '계약 상세',
            fields: [
                { id: 'effective_date', label: '발효일', type: 'date', required: true },
                { id: 'purpose', label: '정보 제공 목적', type: 'textarea', placeholder: '신규 프로젝트 개발 논의', required: true },
            ],
        },
    ],
    htmlContent: (data) => `
    <h1 class="text-2xl font-bold text-center mb-8">비밀유지서약서</h1>
    <div class="mb-6">
      <p class="mb-2">
        <span class="font-bold">${data.company_name || '(회사명)'}</span> (이하 "갑"이라 함)과(와) 
        <span class="font-bold"> ${data.recipient_name || '(정보수령자)'}</span> (이하 "을"이라 함)은(는) 다음과 같이 비밀유지계약을 체결한다.
      </p>
    </div>
    <ol class="list-decimal list-outside pl-5 space-y-4">
      <li>
        <span class="font-bold">목적</span>: 
        본 계약은 "을"이 "갑"의 비밀정보를 취득함에 있어, 이를 보호하고 
        <span class="underline">${data.purpose || '____________________'}</span> 목적으로만 사용하도록 함을 목적으로 한다.
      </li>
      <li>
        <span class="font-bold">비밀정보의 정의</span>: 
        "비밀정보"라 함은 "갑"이 "을"에게 제공하는 일체의 기술적, 경영적 정보를 말한다.
      </li>
      <li>
        <span class="font-bold">비밀유지의무</span>: 
        "을"은 "갑"의 사전 서면 동의 없이 비밀정보를 제3자에게 누설하거나 공개하여서는 아니 된다.
      </li>
      <li>
        <span class="font-bold">계약의 발효</span>: 
        본 계약은 ${data.effective_date || '____. __. __'} 부터 발효된다.
      </li>
    </ol>
    <div class="mt-12 flex justify-between items-end">
      <div class="text-center">
        <p class="mb-4 font-bold">(갑)</p>
        <p>회사명: ${data.company_name || '__________'}</p>
        <p>대표자: (인)</p>
      </div>
      <div class="text-center">
        <p class="mb-4 font-bold">(을)</p>
        <p>성명: ${data.recipient_name || '__________'} (서명)</p>
      </div>
    </div>
  `,
};
