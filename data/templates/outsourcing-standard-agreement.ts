import { Template } from '@/types/template';

export const outsourcingStandardAgreement: Template = {
    id: 'outsourcing_standard_agreement',
    title: '외주용역 표준 계약서',
    description: '멀티미디어디자인 개발 용역을 위한 표준 계약서 양식입니다. 프로그램 기획, 개발, UI/UX 디자인 등의 용역에 적합합니다.',
    sections: [
        {
            id: 'contract_basic',
            title: '계약 기본 정보',
            fields: [
                { id: 'contract_name', label: '계약명', type: 'text', placeholder: '크리에이티브 멋 Proto 촬영 자동화 프로그램 개발', required: true },
                { id: 'contract_start_date', label: '계약 시작일', type: 'date', required: true },
                { id: 'contract_end_date', label: '계약 종료일', type: 'date', required: true },
                { id: 'contract_date', label: '계약 체결일', type: 'date', required: true },
            ],
        },
        {
            id: 'contract_amount',
            title: '계약 금액',
            fields: [
                { id: 'total_amount', label: '계약금액 (부가세 포함)', type: 'currency', placeholder: '27500000', required: true },
                { id: 'supply_amount', label: '공급가액', type: 'currency', placeholder: '25000000', required: true },
                { id: 'vat_amount', label: '부가가치세', type: 'currency', placeholder: '2500000', required: true },
            ],
        },
        {
            id: 'payment_info',
            title: '지급 정보',
            fields: [
                { id: 'payment_type', label: '지급 구분', type: 'text', placeholder: '전액', required: true },
                { id: 'payment_amount', label: '지급 금액 (VAT별도)', type: 'currency', placeholder: '25000000', required: true },
                { id: 'invoice_date', label: '세금계산서 발행일', type: 'date', required: true },
                { id: 'payment_due_date', label: '지급기일', type: 'date', required: true },
                { id: 'payment_method', label: '지급방법', type: 'text', placeholder: '현금', required: true },
            ],
        },
        {
            id: 'deliverables',
            title: '용역의 결과물',
            fields: [
                { id: 'planning_scope', label: '프로그램기획 범위', type: 'text', placeholder: '프로그램 1식에 대한 컨설팅 및 기획', required: true },
                { id: 'development_scope', label: '개발 범위 (줄바꿈으로 구분)', type: 'textarea', placeholder: '프로그램 1식에 대한 UI/UX 디자인\n프로그램 1식에 대한 개발 전체', required: true },
                { id: 'other_scope', label: '기타사항 (줄바꿈으로 구분)', type: 'textarea', placeholder: '현장 테스트 및 검수\n운영 중 문제 발생시 보수 작업', required: true },
            ],
        },
        {
            id: 'ip_rights',
            title: '결과물의 지식 재산권',
            fields: [
                { id: 'final_ip', label: '최종결과물 지식재산권', type: 'text', placeholder: '인도된 최종결과물의 지식재산권은 수요자에게 있다.', required: true },
                { id: 'interim_ip', label: '중간결과물 지식재산권', type: 'text', placeholder: '중간결과물의 지식재산권은 공급자에게 있다.', required: true },
                { id: 'third_party_ip', label: '제3자창작물', type: 'text', placeholder: '제3자창작물 사용은 별도의 사용고지와 사용비용을 청구한다.', required: true },
            ],
        },
        {
            id: 'client_info',
            title: '수요자 (발주기업) 정보',
            fields: [
                { id: 'client_company', label: '상호 또는 명칭', type: 'text', placeholder: '크리에이티브멋', required: true },
                { id: 'client_business_number', label: '사업자등록 번호', type: 'text', placeholder: '000-00-00000', required: true },
                { id: 'client_address', label: '주소', type: 'text', placeholder: '주소 입력', required: true },
                { id: 'client_representative', label: '대표자 성명', type: 'text', placeholder: '대표자명', required: true },
            ],
        },
        {
            id: 'contractor_info',
            title: '공급자 정보',
            fields: [
                { id: 'contractor_company', label: '상호 또는 명칭', type: 'text', placeholder: '이온스튜디오 주식회사', required: true },
                { id: 'contractor_business_number', label: '사업자등록 번호', type: 'text', placeholder: '440-81-02170', required: true },
                { id: 'contractor_address', label: '주소', type: 'text', placeholder: '서울시 강남구 봉은사로 22길45-9, 44호', required: true },
                { id: 'contractor_representative', label: '대표자 성명', type: 'text', placeholder: '강지원', required: true },
            ],
        },
        {
            id: 'additional_terms',
            title: '추가 조건',
            fields: [
                { id: 'warranty_period', label: '무상하자보증기간 (개월)', type: 'number', placeholder: '1', required: true },
                { id: 'maintenance_fee', label: '월 운영관리 비용 (원)', type: 'currency', placeholder: '1000000', required: true },
                { id: 'delay_interest_rate', label: '지연 이자율 (%)', type: 'number', placeholder: '5', required: true },
            ],
        },
    ],
    htmlContent: (data) => {
        const formatDate = (dateString: string) => {
            if (!dateString) return '____년 __월 __일';
            const date = new Date(dateString);
            return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
        };

        const formatDateShort = (dateString: string) => {
            if (!dateString) return '____.__.__';
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        };

        const formatCurrency = (amount: string) => {
            if (!amount) return '_________';
            return parseInt(amount).toLocaleString();
        };

        const numberToKorean = (num: number): string => {
            const units = ['', '만', '억', '조'];
            const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
            const subUnits = ['', '십', '백', '천'];

            if (num === 0) return '영';

            let result = '';
            let unitIndex = 0;

            while (num > 0) {
                const chunk = num % 10000;
                if (chunk > 0) {
                    let chunkStr = '';
                    let tempChunk = chunk;
                    let subUnitIndex = 0;

                    while (tempChunk > 0) {
                        const digit = tempChunk % 10;
                        if (digit > 0) {
                            if (subUnitIndex === 0) {
                                chunkStr = digits[digit] + chunkStr;
                            } else {
                                chunkStr = (digit === 1 ? '' : digits[digit]) + subUnits[subUnitIndex] + chunkStr;
                            }
                        }
                        tempChunk = Math.floor(tempChunk / 10);
                        subUnitIndex++;
                    }
                    result = chunkStr + units[unitIndex] + ' ' + result;
                }
                num = Math.floor(num / 10000);
                unitIndex++;
            }

            return result.trim();
        };

        const formatKoreanCurrency = (amount: string) => {
            if (!amount) return '________';
            const num = parseInt(amount);
            return `금 ${numberToKorean(num)} 원`;
        };

        const formatMultiline = (text: string) => {
            if (!text) return '';
            return text.split('\n').map(line => line.trim()).filter(line => line).join('<br>');
        };

        return `
        <style>
            .contract-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 12px;
            }
            .contract-table th,
            .contract-table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                vertical-align: top;
            }
            .contract-table th {
                background-color: #f5f5f5;
                font-weight: bold;
                width: 120px;
            }
            .contract-table .sub-th {
                background-color: #fafafa;
                width: 100px;
            }
            .nested-table {
                width: 100%;
                border-collapse: collapse;
            }
            .nested-table td {
                border: 1px solid #000;
                padding: 6px;
            }
            .article {
                margin-bottom: 16px;
            }
            .article-title {
                font-weight: bold;
                margin-bottom: 8px;
            }
            .article-content {
                margin-left: 0;
            }
            .article-content p {
                margin: 4px 0;
                text-indent: 0;
            }
            .article-content ol {
                margin: 4px 0 4px 20px;
                padding: 0;
            }
            .article-content li {
                margin: 4px 0;
            }
            .signature-section {
                margin-top: 40px;
            }
            .signature-table {
                width: 100%;
                border-collapse: collapse;
            }
            .signature-table th,
            .signature-table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            .signature-table th {
                background-color: #f5f5f5;
                width: 120px;
            }
        </style>

        <h1 class="text-2xl font-bold text-center mb-8">외주용역 표준 계약서 전문</h1>

        <!-- 계약 내용 테이블 -->
        <h2 class="text-lg font-bold mb-4">계약 내용</h2>
        <table class="contract-table">
            <tr>
                <th>계약명</th>
                <td colspan="3">${data.contract_name || '________'}</td>
            </tr>
            <tr>
                <th>계약기간</th>
                <td colspan="3">${formatDateShort(data.contract_start_date)}부터 ${formatDateShort(data.contract_end_date)}까지</td>
            </tr>
            <tr>
                <th rowspan="3">계약금액</th>
                <td colspan="3">${formatKoreanCurrency(data.total_amount)} (₩ ${formatCurrency(data.total_amount)})</td>
            </tr>
            <tr>
                <td class="sub-th">공급가액</td>
                <td colspan="2">${formatKoreanCurrency(data.supply_amount)} (₩ ${formatCurrency(data.supply_amount)})</td>
            </tr>
            <tr>
                <td class="sub-th">부가가치세</td>
                <td colspan="2">${formatKoreanCurrency(data.vat_amount)} (₩ ${formatCurrency(data.vat_amount)})</td>
            </tr>
            <tr>
                <th rowspan="2">지급방법</th>
                <td colspan="3">
                    <table class="nested-table">
                        <tr>
                            <td style="width: 60px;">구분</td>
                            <td style="width: 120px;">금액(VAT별도)</td>
                            <td>지급기일/조건</td>
                            <td style="width: 60px;">지급방법</td>
                        </tr>
                        <tr>
                            <td>${data.payment_type || '전액'}</td>
                            <td>₩ ${formatCurrency(data.payment_amount)}</td>
                            <td>
                                ${formatDateShort(data.invoice_date)}_세금계산서 발행일<br>
                                ${formatDateShort(data.payment_due_date)}_지급기일
                            </td>
                            <td>${data.payment_method || '현금'}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="3"></td>
            </tr>
            <tr>
                <th rowspan="3">용역의 결과물</th>
                <td class="sub-th">프로그램기획</td>
                <td colspan="2">${data.planning_scope || '________'}</td>
            </tr>
            <tr>
                <td class="sub-th">개발</td>
                <td colspan="2">${formatMultiline(data.development_scope)}</td>
            </tr>
            <tr>
                <td class="sub-th">기타사항</td>
                <td colspan="2">${formatMultiline(data.other_scope)}</td>
            </tr>
            <tr>
                <th rowspan="3">결과물의<br>지식 재산권</th>
                <td class="sub-th">최종결과물</td>
                <td colspan="2">${data.final_ip || '인도된 최종결과물의 지식재산권은 수요자에게 있다.'}</td>
            </tr>
            <tr>
                <td class="sub-th">중간결과물</td>
                <td colspan="2">${data.interim_ip || '중간결과물의 지식재산권은 공급자에게 있다.'}</td>
            </tr>
            <tr>
                <td class="sub-th">제3자창작물</td>
                <td colspan="2">${data.third_party_ip || '제3자창작물 사용은 별도의 사용고지와 사용비용을 청구한다.'}</td>
            </tr>
        </table>

        <p class="text-sm mb-8">
            위 계약 내용에 대하여 아래의 계약주체는 본 계약문서에 의하여 계약을 체결하고
            신의에 따라 성실히 계약상의 의무를 이행할 것을 확약하며, 본 계약의 증거로서
            계약서를 작성하여 당사자가 기명 날인한 후 각각 1통씩 보관한다.
        </p>

        <p class="text-center font-bold text-lg mb-8">${formatDate(data.contract_date)}</p>

        <!-- 계약 주체 테이블 -->
        <h2 class="text-lg font-bold mb-4">계약 주체</h2>
        <table class="signature-table mb-8">
            <tr>
                <th rowspan="4">수요자<br>(발주기업)</th>
                <td style="width: 120px;">상호 또는 명칭</td>
                <td>${data.client_company || '________'}</td>
            </tr>
            <tr>
                <td>사업자등록 번호</td>
                <td>${data.client_business_number || '________'}</td>
            </tr>
            <tr>
                <td>주소</td>
                <td>${data.client_address || '________'}</td>
            </tr>
            <tr>
                <td>대표자 성명</td>
                <td>대표 ${data.client_representative || '________'} (인)</td>
            </tr>
            <tr>
                <th rowspan="4">공급자</th>
                <td>상호 또는 명칭</td>
                <td>${data.contractor_company || '________'}</td>
            </tr>
            <tr>
                <td>사업자등록 번호</td>
                <td>${data.contractor_business_number || '________'}</td>
            </tr>
            <tr>
                <td>주소</td>
                <td>${data.contractor_address || '________'}</td>
            </tr>
            <tr>
                <td>대표자 성명</td>
                <td>대표 ${data.contractor_representative || '________'} (인)</td>
            </tr>
        </table>

        <div style="page-break-before: always;"></div>

        <!-- 본문 -->
        <h1 class="text-2xl font-bold text-center mb-8">멀티미디어디자인 개발 용역 표준계약서(본문)</h1>

        <div class="article">
            <div class="article-title">제1조(계약의 목적)</div>
            <div class="article-content">
                <p>본 계약은 ${data.client_company || '________'}(이하'수요자')가 ${data.contractor_company || '________'}(이하'공급자')에게 발주한 "${data.contract_name || '________'}"의 결과물을 완성하여 인도함에 있어서 계약당사자 상호간의 권리와 의무 등을 규정하는데 그 목적이 있다.</p>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제2조(용어의 정의)</div>
            <div class="article-content">
                <p>본 계약서에 사용되는 용어의 정의는 아래 관련법을 따른다.</p>
                <ol>
                    <li>관련용어 : 「산업디자인진흥법」에서 규정하는 용어를 우선 적용하고, 그 외에는 「디자인보호법」, 「저작권법」, 「상표법」등을 적용한다.</li>
                    <li>기타 용어 : 상법 및 민법 등 관련 법령에 따른다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제3조(계약금액)</div>
            <div class="article-content">
                <ol>
                    <li>본 계약에 의하여 수요자가 공급자에게 지급하는 계약금액은 일금 ${numberToKorean(parseInt(data.supply_amount || '0'))}원정 (₩ ${formatCurrency(data.supply_amount)}, 부가세 별도)으로 한다.</li>
                    <li>수요자는 아래와 같이 공급자에게 계약금액을 지급한다.<br>
                        ${data.payment_type || '전액'} : ${formatDateShort(data.payment_due_date)}까지 금 ${numberToKorean(parseInt(data.payment_amount || '0'))}원 (₩ ${formatCurrency(data.payment_amount)}, 부가세별도)을 ${data.payment_method || '현금'}으로 지급한다.</li>
                </ol>
                <p style="font-size: 11px; color: #666;">※ 최종 결과물 : 기획안으로 협의한 프로그램을 특정하며, 잔금 지급, 완료 검사 및 인수, 지식재산권 귀속, 실적증명 목적으로의 사용 등의 기준이 됨.</p>
                <ol start="3">
                    <li>수요자가 정당한 이유 없이 공급자에게 제②항의 지급기한을 초과한 경우에는 그 초과기간에 대하여 상법 제 54 조가 정한 지연이자를 가산하여 지급한다.<br>
                        - 지연의 기준 : 영업일 기준 30일 이후<br>
                        - 지연 이자 : 연 이율 ${data.delay_interest_rate || '5'}%</li>
                    <li>본 계약금액은 산업통상자원부장관이 고시하는 「산업디자인 개발의 대가기준」을 참고하여 정한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제4조(계약금액)</div>
            <div class="article-content">
                <p>제3조의 규정에 의한 계약금액 이외에 공급자의 용역 수행과 관련하여 발생하는 비용은 별도로 청구할 수 있다.</p>
                <p>단, 이 경우 발생하는 비용과 관련하여 사전에 협의하여야하며, 공급자는 합당한 비용 산출내역을 제시하고 실비 정산하여 청구한다.</p>
                <p>- 추가 운영 및 개발건에 대한 별도 협의</p>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제5조(용역의 범위 및 결과물)</div>
            <div class="article-content">
                <ol>
                    <li>용역의 내용 및 범위는 첨부한 '견적서'를 기준으로 한다.</li>
                    <li>공급자가 본 계약에 따라 수요자에게 제출해야 할 용역의 결과물은 다음과 같다.</li>
                </ol>
                <table class="contract-table" style="margin: 10px 0;">
                    <tr>
                        <th rowspan="3">용역의<br>결과물</th>
                        <td class="sub-th">프로그램기획</td>
                        <td>${data.planning_scope || '________'}</td>
                    </tr>
                    <tr>
                        <td class="sub-th">개발</td>
                        <td>${formatMultiline(data.development_scope)}</td>
                    </tr>
                    <tr>
                        <td class="sub-th">기타사항</td>
                        <td>${formatMultiline(data.other_scope)}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제6조(계약 내용의 변경ㆍ추가)</div>
            <div class="article-content">
                <ol>
                    <li>수요자와 공급자는 합리적이고 객관적인 사유가 발생하여 부득이하게 계약변경이 필요하거나 수요자의 요청에 의하여 계약내용을 변경ㆍ추가하고자 하는 경우에는 계약의 내용과 범위를 기명날인한 서면에 의해 변경할 수 있다.</li>
                    <li>수요자의 요청에 의하여 업무내용, 일정 등이 변경되어 공급자의 투입시간 등이 증가한 경우에는 공급자는 추가 비용을 양사간에 합의하여 결정한다. 이 경우 공급자는 수요자에게 산출내역서를 제출하여야 하며 사전에 해당 내용에 대한 공지 및 협의가 필요하다. 수요자는 협의된 비용을 잔금과 함께 공급자에게 지급한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제7조(용역의 완료검사 및 인수)</div>
            <div class="article-content">
                <ol>
                    <li>공급자는 용역을 완료한 후 최종결과물에 대해 완료검사를 요청하여야 한다.</li>
                    <li>수요자는 특별한 사정이 없는 한 최종결과물을 수령한 날로부터 3일 이내에 검사결과를 공급자에게 서면으로 통지하여야 하며, 이 기간 내에 통지하지 않은 경우에는 검사에 합격한 것으로 본다.</li>
                    <li>수요자는 검사 결과 최종결과물에 수정 및 보완의 필요성이 있는 경우 이를 서면으로 요구할 수 있으며, 다음과 같이 진행한다.
                        <ol style="list-style-type: decimal; margin-left: 20px;">
                            <li>공급자의 귀책사유에 의한 경우 공급자의 비용으로 이를 지체 없이 수행하고 수요자에게 결과물을 납품하여 다시 수요자의 검사를 받는다.</li>
                            <li>수요자의 귀책사유 및 기획 변경 등의 사유로 사전에 합의된 수정 횟수 이상으로 발생하는 추가 작업에 대해서는 공급자가 제시한 비용을 청구할 수 있다.</li>
                        </ol>
                    </li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제8조(지식재산권 귀속 등)</div>
            <div class="article-content">
                <ol>
                    <li>최종결과물을 구성하는 수요자의 콘텐츠 중 수요자가 제공하는 것은 수요자의 소유이며, 공급자는 본 계약이 종료된 이후 수요자의 승인 없이 이를 사용할 수 없다.</li>
                    <li>본 계약에 따라 수요자에게 인도된 최종결과물에 대한 지식재산권은 계약금액 지급이 완료된 후 수요자에게 양도되며, 지식재산권의 등록에 소요되는 비용은 수요자가 부담한다.<br>
                        단, 사용에 제한에 있는 음원 소스 등 제 3자에게 귀속되는 지식재산권은 공급자에게 양도되는 지식재산권에 포함되지 않는다.</li>
                    <li>수요자가 선택하지 아니한 중간결과물(본 계약 제5조에 따라 공급자가 수요자에게 제출한 최종결과물을 제외한 스케치, 렌더링 등)에 대한 권리는 공급자에게 있으며, 수요자가 디자인 시안을 본 계약서가 규정한 내역 외의 콘텐츠를 위해 추가로 사용하거나 또는 중간결과물에 대한 권리를 갖고자 할 때는 비용 지급을 포함하여 별도 협의를 하여야 한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제9조(손해배상)</div>
            <div class="article-content">
                <ol>
                    <li>수요자와 공급자는 자신의 귀책사유로 인하여 제3자 또는 계약상대방에게 손해가 발생할 경우 그 손해를 배상하여야 한다.</li>
                    <li>제7조에 의한 완료검사 후 최종결과물에 대한 손해는 수요자가 부담하여야 한다.</li>
                    <li>본 계약에 따른 손해배상을 청구할 경우 손해의 발생 및 손해액을 증명하는 자료를 상대방에게 제출하여야 한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제10조(권리·의무의 양도 금지)</div>
            <div class="article-content">
                <p>수요자와 공급자는 본 계약으로부터 발생하는 권리 및 의무의 전부 또는 일부를 상대방의 사전 서면동의 없이 제3자에게 양도 또는 승계 시킬 수 없다.</p>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제11조(비밀의 유지)</div>
            <div class="article-content">
                <ol>
                    <li>수요자와 공급자는 본 계약의 이행과정에서 알게 된 상대방의 업무상 및 기술상 비밀을 상대방의 승인이 없는 한 부당하게 이를 이용하거나 제3자에게 누설하여서는 아니 된다.</li>
                    <li>전항에도 불구하고 공급자는 수요자가 최종결과물을 외부에 공표한 날 직후부터 최종결과물을 실적 증명의 목적 범위 내에서 공개할 수 있다.</li>
                    <li>수요자와 공급자는 계약기간 중, 계약기간의 만료 또는 계약의 해제 및 해지 후에도 제1항의 이행 의무가 있으며, 이에 위반하여 상대방에게 손해를 입힌 경우에는 이를 배상한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제12조(자료의 제공 및 반환)</div>
            <div class="article-content">
                <ol>
                    <li>수요자는 공급자가 용역 수행을 위해 필요로 하는 제반 자료를 제공해 주어야 하며, 공급자는 본 계약의 이행과 관련하여 수요자가 제공한 서류, 정보, 기타 모든 자료를 선량한 관리자의 주의 의무로 관리하고, 수요자의 사전 서면 승인 없이 복제, 유출하거나 본 계약 이외에 다른 목적으로 이용하여서는 아니 된다.</li>
                    <li>공급자는 본 계약이 종료 또는 중도에 해지, 해제된 경우, 수요자로부터 제공받은 제1항의 모든 자료를 수요자에게 즉시 반환하여야 한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제13조(계약의 해제 또는 해지)</div>
            <div class="article-content">
                <ol>
                    <li>수요자와 공급자는 계약기간 중 다음 각 호에 해당하는 경우에는 본 계약을 해제 또는 해지할 수 있다.
                        <ol style="list-style-type: decimal; margin-left: 20px;">
                            <li>양 당사자가 서면으로 합의한 경우</li>
                            <li>당사자 일방이 부도, 파산 또는 회생절차 신청 등 영업상의 중대한 사유가 발생하여 계약을 이행할 수 없다고 인정되는 경우</li>
                            <li>재해 기타 사유로 인하여 본 계약을 이행하기 곤란하다고 쌍방이 인정한 경우</li>
                            <li>기타 공급자의 책임 있는 사유로 본 계약을 이행할 수 없다고 인정되는 경우</li>
                        </ol>
                    </li>
                    <li>수요자와 공급자는 다음 각 호의 1에 해당하는 사유가 발생하는 경우에는 상대방에게 그 이행을 최고하고, 14일 이내에 이를 이행하지 아니한 때에는 본 계약의 전부 또는 일부를 해제 및 해지할 수 있다.
                        <ol style="list-style-type: decimal; margin-left: 20px;">
                            <li>상대방이 본 계약의 중요한 내용을 위반한 경우</li>
                            <li>수요자가 정당한 사유 없이 공급자의 용역 수행에 필요한 사항의 이행을 지연하여 공급자의 계약 이행에 지장을 초래한 경우</li>
                            <li>공급자가 정당한 사유 없이 용역 수행을 거부하거나 용역 착수를 지연하여 계약 기간 내에 완성이 곤란하다고 인정되는 경우</li>
                        </ol>
                    </li>
                    <li>수요자와 공급자는 자신의 귀책사유로 인하여 본 계약 또는 개별 계약의 전부 또는 일부가 해제 및 해지됨으로써 발생한 상대방의 손해를 배상하여야 한다.</li>
                    <li>수요자는 필요한 경우 본 계약의 전부 또는 일부를 해제 또는 변경할 수 있고, 이로 인하여 용역 업무가 중지되었을 경우 수요자는 공급자에게 중지로 인하여 공급자가 부담하지 않게 되는 비용을 제외하고 계약금액 전액을 지급하는 것으로 한다. 다만, 부득이한 사유로 인한 중지의 경우 중지 시점까지 수행한 업무 수행량에 비례하여 지급한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제14조(지체상금)</div>
            <div class="article-content">
                <ol>
                    <li>공급자가 계약기간 내에 용역을 완료하지 못한 경우, 수요자는 지체일수에 계약금액의 (1.25)/1000을 곱한 금액(이하'지체상금'이라 한다)을 계약금액에서 공제한다. 단, 수요자가 성질상 분할할 수 있는 용역 업무에 대한 완성분으로서 기성부분을 인수하였을 경우 이를 계약금액에서 공제하며, 지체상금은 계약금액의 10%를 초과할 수 없다.</li>
                    <li>수요자는 다음 각 호의 1에 해당되어 용역이 지체되었다고 인정할 때에는 그 해당일수를 동조 제1항의 지체일수에 산입하지 아니한다.
                        <ol style="list-style-type: decimal; margin-left: 20px;">
                            <li>천재지변 등 불가항력의 사유에 의한 경우</li>
                            <li>수요자의 책임으로 용역의 착수가 지연되거나 위탁수행이 중단된 경우</li>
                            <li>기타 공급자의 책임에 속하지 않는 사유로 인하여 지체된 경우</li>
                        </ol>
                    </li>
                    <li>지체일수의 산정기준은 다음 각 호의 1과 같다.
                        <ol style="list-style-type: decimal; margin-left: 20px;">
                            <li>계약기간 내에 용역을 완료한 경우 : 검사에 소요된 기간은 지체일수에 산입하지 아니한다. 다만, 계약기간 이후에 검사 시 공급자의 용역 이행 내용의 전부 또는 일부가 계약에 위반되거나 부당함에 따라 검사에 따른 수정요구를 공급자에게 한 경우에는 수정요구를 한 날로부터 최종검사에 합격한 날까지의 기간을 지체일수에 산입한다.</li>
                            <li>계약기간을 경과하여 용역을 완료한 경우 : 계약기간 익일부터 검사(수정요구를 한 경우에는 최종검사)에 합격한 날까지의 기간을 지체일수에 산입한다.</li>
                        </ol>
                    </li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제15조(불가항력)</div>
            <div class="article-content">
                <p>수요자와 공급자는 천재지변이나 국가비상사태 등 불가항력의 사유로 상대방에게 발생한 손해에 대하여는 책임을 지지 아니한다.</p>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제16조(보증기간)</div>
            <div class="article-content">
                <ol>
                    <li>무상하자보증기간은 최종결과물의 완료검사 합격 후 ${data.warranty_period || '1'}개월 이내로 한다.</li>
                    <li>무상하자보증기간 동안 최종결과물의 규격 또는 개발범위를 초과한 성능의 개선 또는 수요자의 요청에 의한 개발은 상호합의하에 추가적인 비용을 청구한다.</li>
                    <li>무상하자보증기간이 종료된 경우 수요자와 공급자는 운영관리(유상 유지보수 계약)을 체결할 수 있다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제17조(운영관리)</div>
            <div class="article-content">
                <ol>
                    <li>수요자는 공급자에게 수요자 소유의 최종결과물의 운영관리를 공급일 기준으로 ${data.warranty_period || '1'}개월까지 위탁한다.</li>
                    <li>위 기간 이후 운영 관리에 대한 공급자의 비용은 일금 ${numberToKorean(parseInt(data.maintenance_fee || '1000000'))}원정 (₩${formatCurrency(data.maintenance_fee)}/월, 부가세별도)으로 한다.</li>
                    <li>위탁운영관리 범위는 최종결과물의 업로드 및 검수 결과 모니터링에 제한하며, 필요 시 별도로 위탁운영 업무표를 작성하여 이를 기준으로 한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제18조(분쟁의 해결)</div>
            <div class="article-content">
                <ol>
                    <li>본 계약과 관련한 분쟁은 산업디자인진흥법 제10조의3에 의해 설치된 '디자인분쟁조정위원회'의 조정절차를 거칠 수 있다.</li>
                    <li>전항에도 불구하고 분쟁이 해결되지 않을 경우 소 제기는 당사자의 주소지를 관할하는 법원에 할 수 있다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제19조(통지)</div>
            <div class="article-content">
                <ol>
                    <li>수요자와 공급자는 본 계약의 이행과 관련된 변동사항이 발생하였을 경우에는 상대방에게 이를 즉시 통지하여야 한다.</li>
                    <li>본 계약 당사자의 타방 당사자에 대한 일체의 통지, 통고 등은 계약서에 기재된 당사자의 주소로 우편 등 서면으로 하여야 하며, 양 당사자는 주소가 변경되는 경우 지체 없이 상대방에게 통지하여야 한다.</li>
                    <li>통지의 효력은 통지의 서면이 상대방 주소지에 도달한 날부터 발생한다. 단, 주소 변경을 통지하지 않아 계약서에 기재된 구 주소로 통지한 경우 통지의 효력은 통지의 서면을 발송할 때 발생한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제20조(상호합의)</div>
            <div class="article-content">
                <ol>
                    <li>본 계약에 명시되지 아니한 사항은 상호합의에 의하여 정하기로 한다.</li>
                    <li>본 계약의 일부 조항이 구속력이 없거나 무효인 것으로 판단될 경우에도 나머지 조항은 그대로 유효하며, 무효인 조항도 법의 한도 내에서 최대한 효력을 가질 수 있도록 해석한다.</li>
                </ol>
            </div>
        </div>

        <div class="article">
            <div class="article-title">제21조(기타)</div>
            <div class="article-content">
                <ol>
                    <li>본 계약의 성립을 입증하기 위하여 계약서 2통을 작성하고 수요자와 공급자가 각기 기명(또는 서명) 날인하여 각각 1통씩 보관한다.</li>
                    <li>본 계약에 수반한 합의서, 문서 등 모든 첨부 서류는 본 계약의 일부로 간주하며 별도의 합의서는 본 계약에 우선한다.</li>
                </ol>
            </div>
        </div>
        `;
    },
};
