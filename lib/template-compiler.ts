import DOMPurify from 'isomorphic-dompurify';

/**
 * HTML 템플릿을 컴파일하여 데이터를 주입하는 함수를 반환
 * {{field_id}} 형태의 플레이스홀더를 실제 값으로 치환
 */
export function compileHtmlTemplate(htmlTemplate: string): (data: Record<string, any>) => string {
    return (data: Record<string, any>) => {
        let result = htmlTemplate;

        // {{field_id}} 패턴을 찾아서 data[field_id]로 치환
        result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            const value = data[key];
            if (value === undefined || value === null || value === '') {
                return `<span class="text-gray-400">____</span>`;
            }
            return String(value);
        });

        return result;
    };
}

/**
 * HTML 템플릿에서 사용된 모든 변수 추출
 */
export function extractTemplateVariables(htmlTemplate: string): string[] {
    const matches = htmlTemplate.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];

    const variables = matches.map(match => match.replace(/\{\{|\}\}/g, ''));
    return [...new Set(variables)]; // 중복 제거
}

/**
 * 사용자 입력 HTML을 안전하게 정제 (XSS 방지)
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr',
            'ul', 'ol', 'li',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'span',
            'strong', 'b', 'em', 'i', 'u',
            'a', 'img',
        ],
        ALLOWED_ATTR: [
            'class', 'style', 'href', 'src', 'alt', 'width', 'height',
            'colspan', 'rowspan',
        ],
    });
}

/**
 * 기본 계약서 HTML 템플릿 생성
 */
export function generateDefaultTemplate(title: string, sections: { id: string; title: string; fields: { id: string; label: string }[] }[]): string {
    let html = `<h1 class="text-2xl font-bold text-center mb-8">${title}</h1>\n\n`;

    // 당사자 정보 섹션 찾기
    const partiesSection = sections.find(s =>
        s.title.includes('당사자') || s.title.includes('계약자') || s.id === 'parties'
    );

    if (partiesSection) {
        const partyFields = partiesSection.fields;
        if (partyFields.length >= 2) {
            html += `<div class="mb-6">
  <p class="mb-2">
    <span class="font-bold">{{${partyFields[0].id}}}</span> (이하 "갑"이라 함)과(와)
    <span class="font-bold">{{${partyFields[1].id}}}</span> (이하 "을"이라 함)은(는) 다음과 같이 계약을 체결한다.
  </p>
</div>\n\n`;
        }
    }

    // 조항 목록
    html += `<ol class="list-decimal list-outside pl-5 space-y-4">\n`;

    sections.forEach((section, index) => {
        if (section.id === 'parties' || section.title.includes('당사자')) return;

        html += `  <li>\n`;
        html += `    <span class="font-bold">${section.title}</span>\n`;

        section.fields.forEach(field => {
            html += `    <p class="ml-2">- ${field.label}: {{${field.id}}}</p>\n`;
        });

        html += `  </li>\n`;
    });

    html += `</ol>\n\n`;

    // 서명란
    html += `<div class="mt-12 pt-8 border-t">
  <p class="text-center mb-8">위 계약 내용을 확인하고, 계약 당사자가 서명 또는 날인한다.</p>

  <p class="text-center mb-8">계약일: {{contract_date}}</p>

  <div class="grid grid-cols-2 gap-8 mt-8">
    <div class="text-center">
      <p class="font-bold mb-4">(갑)</p>
      <p>상호/성명: {{party_a_name}}</p>
      <p>주소: {{party_a_address}}</p>
      <p class="mt-4">서명: ________________</p>
    </div>
    <div class="text-center">
      <p class="font-bold mb-4">(을)</p>
      <p>상호/성명: {{party_b_name}}</p>
      <p>주소: {{party_b_address}}</p>
      <p class="mt-4">서명: ________________</p>
    </div>
  </div>
</div>`;

    return html;
}

/**
 * 샘플 데이터 생성 (미리보기용)
 */
export function generateSampleData(fields: { id: string; type: string; label: string }[]): Record<string, string> {
    const data: Record<string, string> = {};

    fields.forEach(field => {
        switch (field.type) {
            case 'text':
                data[field.id] = `[${field.label}]`;
                break;
            case 'date':
                data[field.id] = new Date().toLocaleDateString('ko-KR');
                break;
            case 'number':
                data[field.id] = '0';
                break;
            case 'currency':
                data[field.id] = '₩0';
                break;
            case 'textarea':
                data[field.id] = `[${field.label} 내용]`;
                break;
            default:
                data[field.id] = `[${field.label}]`;
        }
    });

    // 기본 서명란 데이터
    data.contract_date = new Date().toLocaleDateString('ko-KR');
    data.party_a_name = '[갑 이름]';
    data.party_a_address = '[갑 주소]';
    data.party_b_name = '[을 이름]';
    data.party_b_address = '[을 주소]';

    return data;
}
