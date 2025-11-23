import { Template } from '@/types/template';

export const serviceDevelopmentAgreement: Template = {
    id: 'service_development_agreement',
    title: '용역계약서 (일반)',
    description: '일반적인 서비스 개발 및 용역 제공을 위한 계약서 양식입니다.',
    sections: [
        {
            id: 'client_info',
            title: '발주사 (갑) 정보',
            fields: [
                { id: 'client_name', label: '발주사 (회사명)', type: 'text', placeholder: '에스케이플래닛 주식회사', required: true },
                { id: 'client_address', label: '주소', type: 'text', placeholder: '경기도 성남시 분당구 판교로 264', required: true },
                { id: 'client_representative', label: '대표이사', type: 'text', placeholder: '유 재 욱', required: true },
            ],
        },
        {
            id: 'contractor_info',
            title: '계약자 (을) 정보',
            fields: [
                { id: 'contractor_name', label: '계약자 (회사명)', type: 'text', placeholder: '이온스튜디오 주식회사', required: true },
                { id: 'contractor_address', label: '주소', type: 'text', placeholder: '주소 입력', required: true },
                { id: 'contractor_representative', label: '대표이사', type: 'text', placeholder: '대표이사 성명', required: true },
            ],
        },
        {
            id: 'project_details',
            title: '계약 내용',
            fields: [
                { id: 'project_name', label: '용역명 (프로젝트명)', type: 'text', placeholder: '롯데GRS Web AR 서비스 개발', required: true },
                { id: 'scope_of_work', label: '용역 범위 (줄바꿈으로 구분)', type: 'textarea', placeholder: '- 서비스 전체 개발 및 유지보수\n- 기획 및 설계\n- UI/UX 디자인\n- 서버 구축 및 데이터 처리', required: true },
            ],
        },
        {
            id: 'contract_details',
            title: '계약 상세',
            fields: [
                { id: 'contract_start_date', label: '용역 시작일', type: 'date', required: true },
                { id: 'contract_end_date', label: '용역 종료일', type: 'date', required: true },
                { id: 'contract_amount', label: '용역 대금 (원)', type: 'currency', placeholder: '35000000', required: true },
                { id: 'contract_date', label: '계약 체결일', type: 'date', required: true },
            ],
        },
        {
            id: 'payment_info',
            title: '지급 계좌 정보',
            fields: [
                { id: 'bank_name', label: '은행명', type: 'text', placeholder: '은행명 입력', required: true },
                { id: 'account_number', label: '계좌번호', type: 'text', placeholder: '계좌번호 입력', required: true },
                { id: 'account_holder', label: '예금주', type: 'text', placeholder: '예금주 입력', required: true },
            ],
        },
        {
            id: 'privacy_agreement',
            title: '개인정보보호 약정 상세',
            fields: [
                { id: 'privacy_purpose', label: '위탁업무 목적', type: 'text', placeholder: '롯데GRS Web AR 서비스 마케팅 이벤트 운영', required: true },
                { id: 'privacy_scope', label: '위탁업무 내용', type: 'text', placeholder: '서비스 참여 고객 대상 쿠폰 발송', required: true },
                { id: 'privacy_items', label: '위탁하는 개인(신용)정보 항목', type: 'text', placeholder: '이름, 전화번호', required: true },
            ],
        },
    ],
    htmlContent: (data) => {
        const formatDate = (dateString: string) => {
            if (!dateString) return '____. __. __';
            const date = new Date(dateString);
            return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
        };

        const formatCurrency = (amount: string) => {
            if (!amount) return '_________';
            return parseInt(amount).toLocaleString();
        };

        const formatScope = (scope: string) => {
            if (!scope) return '<li>(용역 범위 입력 필요)</li>';
            return scope.split('\n').map(line => `<li>${line}</li>`).join('');
        };

        const clientName = data.client_name || '________';
        const contractorName = data.contractor_name || '________';
        const projectName = data.project_name || '________';

        return `
        <h1 class="text-2xl font-bold text-center mb-8">${projectName} 용역계약 특수조건</h1>
        
        <div class="mb-6">
            <p class="mb-2">
                <span class="font-bold">${clientName}</span>（이하 “갑”이라 칭한다）와 
                <span class="font-bold">${contractorName}</span>(이하 “을”이라 칭한다）은 
                “${projectName} 용역계약”에 관하여 다음과 같이 특수조건을 정한다.
            </p>
        </div>

        <div class="space-y-6">
            <section>
                <h2 class="text-lg font-bold mb-2">제1조［용역 내용］</h2>
                <p>① “을”이 본 계약에 따라 수행할 용역은 아래 각 호와 같다. 단, 양당사자의 별도 서면 합의에 따라 용역을 추가 또는 변경할 수 있다.</p>
                <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
                    ${formatScope(data.scope_of_work)}
                    <li>기타 양당사자가 합의한 관련 연계업무</li>
                </ul>
                <p class="mt-2">양사 협의 하에 광고주의 서비스 일정에 따라 용역 수행 기간은 조정 할 수 있다. (계약 기간 기준 최대 6개월)</p>
                <p class="mt-2">② 제1항 내용에 명시되지 않은 사항이라 하더라도 본 계약에 따른 “을”의 수행 업무의 성격상 당연히 포함되거나 합리적인 범위 내에서 필요한 것이라고 판단되는 사항 등은 제1항의 용역 내용에 포함된다.</p>
                <p class="mt-2">③ “을”은 “갑”의 지침과 정책을 반영하여 선량한 관리자의 주의의무를 다하여 업무를 수행하여야 한다.</p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제2조 [용역수행기간]</h2>
                <p>
                    “을”은 <span class="font-bold">${formatDate(data.contract_start_date)}</span>부터 
                    <span class="font-bold">${formatDate(data.contract_end_date)}</span>까지 용역 수행을 완료하고 
                    일체의 용역수행 결과물을 “갑”에게 제출한다. 단, 부득이한 사유로 일정의 조정이 필요한 경우 “을”은 용역수행기간 만료 15일전까지 “갑”에게 사전 통보를 해야 하며, 납득할 만한 합리적인 사유가 있는 경우 “갑”은 “을”과 협의하여 용역수행기간을 조정할 수 있다.
                </p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제3조 [용역수행 결과물의 수정 및 보완 등]</h2>
                <p>“갑”은 필요한 경우 “을”에게 용역수행 업무 현황 및 이슈 등 보고를 요청할 수 있으며 “을”은 정당한 사유가 없는 한 “갑”의 요청에 응하여야 한다. 제2조에 따라 “을”이 “갑”에게 용역수행 결과물을 제출한 경우, “갑”은 해당 용역수행 결과물을 수령한 날로부터 2 영업일 이내에 제출된 결과물에 대한 검수를 시행한다.</p>
                <p class="mt-2">“갑”이 전 항에 따른 검수를 통하여 “을”에게 최종 합격 통지를 한 경우 용역수행이 완료된 것으로 본다.</p>
                <p class="mt-2">“을”이 제출한 용역수행 결과물이 제2항의 검수를 통과하지 못하여 “을”이 “갑”으로부터 불합격 통지를 받은 경우, “을”은 불합격 통지일로부터 7일 이내에 해당 결과물을 보완하여 “갑”에게 재검수를 요청한다. 재검수 절차는 본 조 제2항 내지 제4항의 규정을 준용한다.</p>
                <p class="mt-2">“갑”은 “을”의 용역수행 결과물에 대하여 해당 결과물의 제출 이전 또는 제출 이후를 불문하고, 내용의 수정 및 보완 등을 요구할 수 있으며, “을”은 정당한 사유가 없는 한 이를 용역수행 결과물 등에 반영하여야 한다. 이 경우 “을”은 별도의 대가를 요구할 수 없다. 단, “갑”의 추가적인 사양 요구 등의 사유로 용역 내용 및 수행기간에 중대한 변경이 발생하고 이로 인하여 추가비용이 발생될 경우 그에 따른 추가대금은 양 당사자가 별도 서면 합의하여 정한다.</p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제4조 [용역수행 결과물의 귀속]</h2>
                <p>본 계약에 따라 “을”이 수행한 용역수행에 대한 일체의 결과물에 대한 저작권, 지적재산권, 소유권 등 일체의 모든 권리는 “갑”에게 귀속되며, “을”은 아래의 사항을 제외하고 “갑”의 사전 서면 동의 없이 대외적으로 이를 발표/공표하거나 본 계약 목적 외로 사용 또는 제3자에게 제공, 사용 허락 등 일체의 행위를 할 수 없다.</p>
                <p class="mt-2">“을”은 본 계약을 수행하며 결과물을 계약자의 비영리적 목적(아카이빙, 포트폴리오)로 활용할 수 있다.</p>
                <p class="mt-2">“을”은 1조에서 정의된 최종 산출물이 아닌 산출물을 제작하기위해 활용했던 중간저작물(범위: 메인 인트로 페이지, AR 게임 제작에 활용한 디자인 에셋)에 대해서는 계약자가 저작권, 지적재산권, 소유권을 가지나 “갑”이 본 개발건의 홍보 및 광고주(롯데GRS) 요청으로 중간저작물 사용이 필요한 경우 사용을 허용하고 이를 제공한다. “갑”은 본 개발건의 홍보 또는 광고주의 비영리적 홍보 목적으로 필요한 범위 내에서 해당 중간 저작물을 사용할 수 있으며, 이 경우 “을”은 필요 최소한의 범위에서 해당 자료를 제공한다. 다만, 본 개발건의 홍보 목적을 넘어 “갑” 또는 광고주의 영리 활동(예: 별도 캠페인, 프로모션, 상업적 활용 등) 목적으로 해당 중간저작물을 사용하는 경우 “갑”은 “을”과 사전에 기간, 용처 등을 기준으로 라이선스 비용을 협의 및 산정하여 지급한다.</p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제5조［용역대금 및 대금의 지급］</h2>
                <p>① “갑”은 다음의 단가를 적용하여 산정한 금액을 지정한 단위로 “을”에게 지급한다.</p>
                <ul class="list-disc list-inside pl-4 mt-2">
                    <li>용역대금 : <span class="font-bold">${formatCurrency(data.contract_amount)}</span>원/ (VAT별도)</li>
                    <li>용역수행기간 : <span class="font-bold">${formatDate(data.contract_start_date)}</span> ~ <span class="font-bold">${formatDate(data.contract_end_date)}</span></li>
                </ul>
                <p class="mt-2">② “갑”은 “을”의 본 계약에 따른 용역 수행과 그의 결과로서 “갑”에게 제출한 결과물에 대한 대가로 결과물이 최종 합격 통지된 날(용역수행 완료일)로부터 5영업일 이내에 전체금액을 아래 계좌로 이체하기로 한다.</p>
                <p class="pl-4 mt-1">예금주 : ${data.account_holder || '________'} 계좌번호 : ${data.account_number || '__________________'} (${data.bank_name || '____'})</p>
                <p class="mt-2">③ “을”이 본 계약상 협의된 용역 업무를 불이행 또는 불성실하게 수행하거나, “갑”과 “을”간 협의된 용역수행 결과물에 심각한 문제(서비스 불가 또는 “갑”의 지침/정책에 맞지 않거나 “갑”와의 협의에 맞지 않는 수준 등)가 발생시, “갑”은 용역 대금을 지급하지 않거나 “갑”이 인수하기로 한 용역수행 결과물의 완성도 등에 비춰 용역대금을 재조정할 수 있다. 만약 “갑”이 이미 지급한 용역대금이 “갑”이 지급해야 할 용역대금을 초과하는 경우, “을”은 즉시 “갑”에게 초과부분에 대한 용역대금을 반환하여야 한다.</p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제6조 [보증 및 지식재산권 침해금지 등]</h2>
                <p>“을”은 본 계약의 용역을 수행하는 과정이나 그 과정에서 얻게 되는 일체의 결과물 등이 제3자의 지식재산권을 비롯한 제반 권리를 침해하지 않음을 보장한다.</p>
                <p class="mt-2">전 항의 위반으로 인하여 제3자가 “갑”에 대하여 분쟁을 제기하는 경우 “을”은 “갑”을 면책하고 관련 책임을 부담하며, “갑”이 입은 일체의 손해를 배상하여야 한다.</p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제7조［계약의　해지］</h2>
                <p>용역계약 일반조건 제15조에 규정된 계약해제 또는 해지 이외에, “갑”의 경영상 정책 변경 등으로 인해 더 이상 본 계약을 유지하기 어려운 경우 또는 “을”의 불가피한 사정으로 인해 “을”의 책임 없는 사유로 “을”이 본 계약상 용역 업무를 더 이상 수행하기 어려운 경우, “갑” 또는 “을”은 본 계약만료 전에 상대방에게 서면으로 계약 해지(또는 해제) 의사표시를 통지할 수 있다.</p>
                <p class="mt-2">전 항에 의한 계약 해지(해제)의 경우 손해배상 및 위약금은 지급하지 않기로 한다. “갑”의 사정으로 “갑”이 본 조 제1항에 의한 계약 해지(해제)를 한 경우에는 “갑”은 계약 해지(해제) 시까지 수행한 용역수행 결과물을 인도 받음과 동시에 “을”에게 계약 해지(해제) 시까지 용역수행 결과물의 완성도 등에 비춰 재산정한 용역대금을 지급하기로 한다. 만약 “갑”이 이미 지급한 용역대금이 “갑”이 지급해야 할 용역대금을 초과하는 경우, “을”은 즉시 “갑”에게 초과부분에 대한 용역대금을 반환하여야 한다.</p>
                <p class="mt-2">“을”의 사정으로 “을”이 본 조 제1항에 의한 계약 해지(해제)를 한 경우, “갑”이 계약 해지(해제) 시까지 “을”이 수행한 용역수행 결과물을 인수하기로 한 경우에는 용역수행 결과물의 완성도 등에 비춰 재산정한 용역대금을 용역수행 결과물을 인도 받음과 동시에 지급하기로 하고, 만약 “갑”이 합리적인 사유(용역수행 결과물이 미미하거나 가치가 없는 경우 등)로 용역수행 결과물을 인수하지 않기로 한 경우에는 용역대금을 지급할 의무가 없다. 만약 “갑”이 이미 지급한 용역대금이 “갑”이 지급해야 할 용역대금을 초과하거나 “갑”에게 용역대금 지급 의무가 없는 경우, “을”은 즉시 “갑”에게 초과부분의 용역대금 또는 지급 받은 용역대금을 반환하여야 한다.</p>
            </section>

            <section>
                <h2 class="text-lg font-bold mb-2">제8조［계약 종료 시 필요조치］</h2>
                <p>사유를 불문하고 본 계약이 종료되거나 해지되는 경우, “을”은 “갑”으로부터 받아 보관 중인 문서 또는 데이터 등 일체의 정보(형태 불문)를 “갑”의 지침에 따라 즉시 이전 또는 파기하여야 하며, 파기한 경우 파기확인서를 제출하여야 한다.</p>
            </section>
        </div>

        <div class="mt-8 mb-12">
            <p class="font-bold">별첨.1. 용역계약 일반 조건 1부</p>
        </div>

        <div class="mt-12">
            <p class="mb-4">본 계약을 증명하기 위하여 본 계약서를 2통 작성하여 서명 또는 날인한 후 당사자가 각각 1통씩 보관한다.</p>
            <p class="text-center font-bold text-lg my-6">${formatDate(data.contract_date)}</p>
            
            <div class="flex justify-between items-start mt-8">
                <div class="w-1/2 pr-4">
                    <p class="font-bold mb-2">“갑”</p>
                    <p>${data.client_name || '_________'}</p>
                    <p>${data.client_address || '_________'}</p>
                    <p>대표이사 ${data.client_representative || '_________'} (인)</p>
                </div>
                <div class="w-1/2 pl-4">
                    <p class="font-bold mb-2">“을”</p>
                    <p>${data.contractor_name || '_________'}</p>
                    <p>${data.contractor_address || '_________'}</p>
                    <p>대표이사 ${data.contractor_representative || '_________'} (인)</p>
                </div>
            </div>
        </div>

        <div style="page-break-before: always;"></div>

        <h1 class="text-2xl font-bold text-center mb-8">개인(신용)정보보호 약정서</h1>
        
        <div class="mb-6">
            <p class="mb-2">
                <span class="font-bold">${clientName}</span>(이하 “갑”이라 한다)와 
                <span class="font-bold">${contractorName}</span>(이하 “수탁사”라 한다)는 
                양 당사자간에 체결된 각종 개인(신용)정보 처리업무를 위탁한 일체의 계약(이하 “본계약”이라 한다)과 관련하여 개인(신용)정보보호를 위한 약정서를 다음과 같이 약정한다.
            </p>
        </div>

        <table class="w-full border-collapse border border-gray-400 mb-6 text-sm">
            <tr>
                <td class="border border-gray-400 p-2 bg-gray-100 font-bold w-1/4">계 약 명</td>
                <td class="border border-gray-400 p-2">${projectName} 운영 계약</td>
            </tr>
            <tr>
                <td class="border border-gray-400 p-2 bg-gray-100 font-bold">위탁업무 목적</td>
                <td class="border border-gray-400 p-2">${data.privacy_purpose || '_________'}</td>
            </tr>
            <tr>
                <td class="border border-gray-400 p-2 bg-gray-100 font-bold">위탁업무 내용(범위)</td>
                <td class="border border-gray-400 p-2">${data.privacy_scope || '_________'}</td>
            </tr>
            <tr>
                <td class="border border-gray-400 p-2 bg-gray-100 font-bold">위탁하는 개인(신용)정보 항목</td>
                <td class="border border-gray-400 p-2">${data.privacy_items || '_________'}</td>
            </tr>
        </table>

        <div class="space-y-4 text-sm">
            <section>
                <h2 class="font-bold mb-1">(용어의 정의)</h2>
                <p>본 약정에서 사용하는 용어의 정의는 다음 각 호와 같다.</p>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>“개인(신용)정보”란 개인정보, 위치정보, 신용정보 등 관련 법령에 따라 보호되고 있는 고객과 관련된 일체의 정보를 말한다.</li>
                    <li>“수탁사”란 “갑”와 “개인(신용)정보” 처리위탁 계약을 체결하고 “갑”를 대신하여 신규고객 유치 및 고객 관리 등을 포함한 고객 관련 업무를 수행하는 개인 또는 법인을 말한다.</li>
                    <li>“수탁업무”란 “본계약”과 “본계약”에 부수되는 약정서(명칭에 상관없이 “갑”와 “수탁사” 사이에 체결된 서면을 의미한다)에 따라 ”수탁사”가 “갑”로부터 수탁하여 처리하는 “개인(신용)정보” 관련 일체의 업무를 말한다.</li>
                    <li>“개인(신용)정보처리시스템”이란 ”수탁사”가 ”갑”로부터 수탁한 업무를 수행하기 위해서 사용하게 되는 “개인(신용)정보” 저장, 조회 및 처리 기능을 지원하는 시스템을 말한다.</li>
                    <li>“개인(신용)정보 사고”란 “개인(신용)정보”가 “수탁사”(“수탁사”로부터 “개인(신용)정보”를 재위탁받은 업체 포함)에 의해 “본계약”에 따른 “수탁업무” 수행 이외의 목적으로 사용되거나 유출, 도난, 훼손, 변조, 침해된 경우를 말한다.</li>
                    <li>제1항에서 정의한 용어의 적용 범위는 본 약정에 한하며, 제1항에서 정의하지 않은 용어의 의미는 “본계약” 및 관련 법령, 일반 관례에 따른다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(목적 외 개인(신용)정보의 처리 금지 등)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”는 “개인(신용)정보”를 “수탁업무” 상 알게 된 “개인(신용)정보”를 업무 목적 외로 이용하거나 제3자에게 제공 또는 누설하지 않으며 기타 “개인(신용)정보”를 침해하는 행위를 하여서는 아니 된다.</li>
                    <li>”수탁사”는 “수탁업무”를 수행하면서 알게 된 “개인(신용)정보”를 “갑”와 사전 합의한 시스템에서 안전하게 관리하여야 하며, 그 외의 장소나 저장매체에 별도 보관하여서는 아니 된다.</li>
                    <li>”수탁사”는 “갑”의 사전 동의 없이 “갑”의 “개인(신용)정보”를 “수탁업무” 외의 목적으로 사용하거나 “수탁사” 이외의 제3자가 “개인(신용)정보”에 접근할 수 있도록 하여서는 아니 된다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(개인(신용)정보취급자의 지정 및 업무처리 감독 등)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”는 “수탁업무”를 수행하면서 알게 된 일체의 “개인(신용)정보”를 보호할 의무를 부담한다.</li>
                    <li>”수탁사”는 자신의 직원(대리인, 사용인, 그 외 종업원 등 ”수탁사”가 “수탁업무” 수행을 위하여 사용하는 자를 포괄하여 말한다. 이하 같다)이 관련 법령, “본계약” 및 본 약정의 규정을 준수하도록 관리·감독하여야 하며, 직원의 본 약정 위반은 “수탁사”의 위반으로 본다.</li>
                    <li>“수탁사”는 “개인(신용)정보”를 처리하는 업무를 담당하는 자로서 직접 “개인(신용)정보”에 관한 업무를 담당하는 자와 그 밖에 업무상 필요에 의하여 “개인(신용)정보”에 접근하여 처리하는 자(이하 “개인(신용)정보취급자”라 한다) 및 개인(신용)정보취급자에게 허용되는 “개인(신용)정보”의 열람 및 처리의 범위를 업무상 필요한 한도 내에서 최소한으로 제한하여야 한다.</li>
                    <li>“수탁사”는 ”개인(신용)정보처리시스템”에 대한 접근권한을 업무의 성격에 따라 당해 업무수행에 필요한 최소한의 범위로 각 개인(신용)정보취급자에게 차등 부여하고, 접근권한을 관리하기 위한 조치를 취하여야 한다.</li>
                    <li>“수탁사”는 개인(신용)정보취급자로 하여금 보안서약서를 제출하도록 하는 등 적절한 관리·감독을 하여야 하며, 인사이동 등에 따라 개인(신용)정보취급자의 업무가 변경되는 경우에는 “개인(신용)정보”에 대한 접근권한을 변경 또는 말소하여야 한다.</li>
                    <li>“수탁사”는 “개인(신용)정보처리시스템”에 접속할 수 있는 사용자 계정을 발급하는 경우, 개인(신용)정보취급자별로 한 개의 사용자계정을 발급하여야 하며, 사용자계정의 ID 및 패스워드의 공유·누설을 금지하며, 각 개인(신용)정보취급자가 이를 준수하도록 관리·감독하여야 한다.</li>
                    <li>“수탁사”는 제4항 및 제5항에 의한 권한 부여, 변경 또는 말소에 대한 내역을 기록하고, 그 기록을 최소 3년간 보관하여야 한다.</li>
                    <li>“수탁사”는 개인(신용)정보취급자가 “개인(신용)정보처리시스템”에 접속한 기록을 최소 1년 이상 저장하여야 한다.</li>
                    <li>”수탁사”는 “수탁업무” 수행을 위해서만 “개인(신용)정보”를 수집하거나 “갑”로부터 제공받을 수 있으며, “개인(신용)정보” 수집 시 관련 법규 및 “갑”의 개인정보처리방침에 따른 동의 및 고지 등의 절차를 준수하여야 한다. “갑”의 고객이 “수탁사”에게 “갑”가 위탁한 해당 고객의 “개인(신용)정보”의 열람, 정정 등을 요구하는 경우에는 ”수탁사”가 해당 고객이 요청한 업무를 처리한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(개인(신용)정보의 암호화)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>“수탁사”는 “개인(신용)정보” 중 고유식별정보를 정보통신망을 통하여 송·수신하거나 보조저장매체 등을 통하여 전달하는 경우 이를 암호화하여야 한다.</li>
                    <li>“수탁사”는 인터넷 구간 및 인터넷 구간과 내부망의 중간 지점에 고유식별정보를 저장하는 경우 이를 암호화하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(물리적 접근 방지)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>“수탁사”는 전산실, 자료보관실 등 “개인(신용)정보”를 보관하고 있는 물리적 보관 장소를 별도로 두고 있는 경우에는 이에 대한 출입통제 절차를 수립·운영하여야 한다.</li>
                    <li>“수탁사”는 “개인(신용)정보”가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(기타 안전성 확보조치)</h2>
                <p>“수탁사”는 본 약정에서 명시적으로 정하지 아니하는 경우에도 “개인(신용)정보”를 보호하기 위하여 「개인정보의 안전성 확보조치 기준」에 따른 기술적·물리적·관리적 조치 및 「신용정보업감독규정」 별표 3에 따른 기술적·물리적·관리적 보안대책을 마련하여야 한다.</p>
            </section>

            <section>
                <h2 class="font-bold mb-1">(개인(신용)정보 보호책임자의 지정)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”는 “갑”로부터 수탁한 일체의 “개인(신용)정보” 처리업무를 총괄하여 책임질 개인(신용)정보 보호책임자를 지정하여 “갑”에게 통지하고, 개인(신용)정보 보호책임자에 의하여 “수탁업무”의 현황 관리 및 변경사항 보고, 교육 및 점검 협조 등이 원활히 이루어질 수 있도록 하여야 한다.</li>
                    <li>“수탁사”는 개인(신용)정보 보호책임자의 변경이 있을 경우 지체 없이 변경된 사항을 “갑”에게 통지하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(개인(신용)정보의 파기 및 반납)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”는 서비스 해지, 이벤트 종료 등으로 수집 시 고객으로부터 동의를 받은 이용목적이 달성된 고객의 “개인(신용)정보”를 관련 법규 및 “갑”의 개인정보처리방침에 따라 즉시 “갑”에게 반환하거나 “갑”가 정하는 안전한 방법으로 파기하여야 한다. “갑”은 “개인(신용)정보”의 반환 또는 파기를 확인할 수 있는 자료 또는 문서를 “수탁사”에게 요구할 수 있고 ”수탁사”는 이에 응해야 한다.</li>
                    <li>제1항의 기간에도 불구하고 동의철회권을 행사하는 고객의 요청에 따라 “갑”가 “수탁사”에게 “개인(신용)정보”의 파기 및 처리 중단을 요청하는 경우 “수탁사”는 지체 없이 이를 파기하고 그 처리를 중단하여야 한다.</li>
                    <li>“수탁사”는 제1항 및 제2항에 따라 “개인(신용)정보”를 파기할 때에는 복구 또는 재생되지 아니하도록 조치하여야 한다.</li>
                    <li>제1항 및 제2항에 따라 고객의 “개인(신용)정보”를 파기한 경우 “수탁사”는 “갑”에게 고객의 “개인(신용)정보” 파기 및 처리 중단 요청일로부터 [1개월 이내]에 그 결과를 서면으로 통보하여야 한다.</li>
                    <li>“갑”은 “개인(신용)정보”의 파기 여부 및 파기 상태를 확인하기 위하여 “수탁사”에게 필요한 자료의 제공을 요구하거나 “수탁사”의 사무실 등을 점검할 수 있으며, “수탁사”는 이에 적극 협조하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(재위탁 제한)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”는 “수탁업무”를 타 업체에 재위탁 해서는 아니 된다. 다만, 업무상 불가피하게 재위탁이 필요한 경우에는 반드시 해당 업체의 “개인(신용)정보” 관리방안을 “갑”에게 알리고 ‘개인(신용)정보 처리업무 재위탁 동의서’를 작성하여 “갑”의 사전 동의를 받아야 하며, 해당 업체의 행위가 본 약정에 위반되는 경우, “갑”와 “수탁사” 사이에서는 ”수탁사”가 본 약정에 위반되는 행위를 한 것으로 본다.</li>
                    <li>“수탁사”가 제1항 단서에 의하여 “갑”로부터 “수탁업무” 재위탁에 대한 승인을 받은 경우에는 재위탁 계약서와 별도로 「신용정보업감독규정」 별표 4를 포함한 보안관리약정서를 재위탁받은 업체와 체결하여야 하며, 체결 직후 동 약정서 체결 여부를 “갑”에게 서면으로 통보하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(서약서 제출 및 교육)</h2>
                <p>“수탁사”는 “갑”가 위탁한 “개인(신용)정보”를 처리하는 “수탁사”(“수탁사”로부터 “개인(신용)정보”를 재위탁받은 업체 포함)의 직원은 “갑”가 지정하는 방법으로 “개인(신용)정보” 보호 준수에 대해 서약하고, “개인(신용)정보” 보호에 대한 교육을 정기적으로 연 1회 이상 이수해야 하며, 이를 교육 확인서 등의 문서로 남기고 관리해야 한다.</p>
            </section>

            <section>
                <h2 class="font-bold mb-1">(개인(신용)정보 연동 관리)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”는 “수탁업무”를 위하여 “개인(신용)정보”를 연동받는 경우, 아래의 내용을 포함한 “갑”가 정한 연동관리절차에 따라 연동 현황을 관리하여야 한다.
                        <ul class="list-disc list-inside pl-4 mt-1">
                            <li>“개인(신용)정보” 연동 신청 절차에 따른 신청 및 “갑”의 “개인(신용)정보” 사전검토 수행</li>
                            <li>연동 중 변경사항(서비스 종료, “갑” 또는 “수탁사”의 담당자 변경 등) 발생 시 “개인(신용)정보” 연동시스템 담당자에게 즉시 통지</li>
                            <li>연동 종료 사유(서비스 종료, “본계약” 종료 등) 발생 시 즉각적인 연동 중단 통지</li>
                            <li>기타 연동 관리를 위하여 “갑”가 수시로 공지하는 사항의 준수</li>
                        </ul>
                    </li>
                    <li>”수탁사”는 제8조에 따른 개인(신용)정보 보호책임자가 “수탁사”의 모든 연동 건에 대하여 전 항의 “개인(신용)정보” 연동 관리에 필요한 신청, 통지 등의 업무를 수행하고, 개별 연동 건들을 총괄하여 관리할 수 있도록 하여야 한다.</li>
                    <li>“갑”은 “본계약”이 종료되거나 제15조 제1항의 사유가 발생하면 즉시 해당 “개인(신용)정보”의 연동을 중단할 수 있다.</li>
                    <li>“갑”은 제1항에 따라 연동되는 “개인(신용)정보”에 대한 기술적·물리적·관리적 보호조치의 현황확인에 필요한 자료 및 필요 시 직접 점검을 “수탁사”에게 요청할 수 있으며, ”수탁사”는 “갑”의 요청에 협조하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(보안점검)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>“갑”은 “수탁사”의 “개인(신용)정보”에 대한 기술적·물리적·관리적 보호조치 실태 및 “개인(신용)정보” 보호를 위한 관리체계를 점검하기 위하여 보안점검을 언제라도 수행할 수 있으며, “수탁사”는 “갑”의 관련 자료 요청 및 실태조사에 성실하게 응하여야 한다.</li>
                    <li>“수탁사”는 “갑”가 정한 주기에 따라 “개인(신용)정보” 처리 현황 관련 자체점검을 실시하여야 하며 해당 실시 결과에 대한 ‘자체점검보고서’를 “갑”에 보고 또는 등록(예: 시스템에 등록)하여야 한다.</li>
                    <li>“갑”에 위탁받은 업무와 관련하여 감독당국 또는 외부 감사인의 조사 및 접근(허가 실시조사, 현장방문 포함)이 필요할 경우 “수탁사”는 이에 성실하게 응하여야 한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(약정 위반에 따른 책임)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>”수탁사”가 본 약정을 위반한 경우, “갑”은 위반사항의 시정을 요구할 수 있으며 시정조치가 완료될 때까지 해당 위탁업무의 대가 지급을 전부 또는 일부 보류할 수 있다.</li>
                    <li>”수탁사”가 자신의 고의 또는 과실로 본 약정을 위반하여 “개인(신용)정보 사고”가 발생한 경우, ”수탁사”는 자신의 책임과 비용으로 “갑”를 면책시켜야 하며, 본 약정을 위반하여 “갑” 또는 고객(제3자 포함)에게 발생한 일체의 손해를 배상하여야 한다.</li>
                    <li>제15조에 의한 계약의 해지는 본 조의 손해배상에 영향을 미치지 아니한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(본계약의 해지)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>“갑”은 아래와 같은 사유가 발생한 경우, 해당 사유가 발생한 “본계약” 또는 “수탁사”에게 “개인(신용)정보” 처리를 위탁한 일체의 계약을 해지할 수 있으며, ”수탁사”는 이에 이의를 제기하지 아니한다.
                        <ul class="list-disc list-inside pl-4 mt-1">
                            <li>”수탁사”가 제14조 제1항에 따른 시정조치를 즉시 수행하지 않거나, 수행할 수 없을 경우</li>
                            <li>제14조 제2항에 따른 “개인(신용)정보 사고”가 발생한 경우</li>
                        </ul>
                    </li>
                    <li>전 항에 따른 계약의 해지는 별도의 최고 없이 서면통보로서 가능하며 해지의 효력은 문서가 “수탁사”에 도달한 시점에 발생한다.</li>
                </ol>
            </section>

            <section>
                <h2 class="font-bold mb-1">(기타)</h2>
                <ol class="list-decimal list-inside pl-2 space-y-1">
                    <li>본 약정은 “본계약”의 일부를 구성하되, 본 약정과 “본계약” 간에 상충되는 경우에는 본 약정을 우선 적용하기로 한다.</li>
                    <li>본 약정에 정하지 아니한 사항은 “본계약”에서 정한 바에 따른다.</li>
                    <li>본 약정의 체결을 증명하기 위해 본 약정서 2부를 작성하여 ”갑”와 ”수탁사”가 서명 또는 기명날인 후 각 1부씩 보관한다.</li>
                </ol>
            </section>
        </div>

        <div class="mt-12">
            <p class="text-center font-bold text-lg my-6">${formatDate(data.contract_date)}</p>
            
            <div class="flex justify-between items-start mt-8">
                <div class="w-1/2 pr-4">
                    <p class="font-bold mb-2">“갑”</p>
                    <p>${data.client_name || '_________'}</p>
                    <p>주소: ${data.client_address || '_________'}</p>
                    <p>대표이사: ${data.client_representative || '_________'} (인)</p>
                </div>
                <div class="w-1/2 pl-4">
                    <p class="font-bold mb-2">“수탁사”</p>
                    <p>${data.contractor_name || '_________'}</p>
                    <p>주소: ${data.contractor_address || '_________'}</p>
                    <p>대표이사: ${data.contractor_representative || '_________'} (인)</p>
                </div>
            </div>
        </div>
        `;
    },
};
