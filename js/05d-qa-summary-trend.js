  // 05d-qa-summary-trend.js — 요약 텍스트 포맷, 상담사별 트렌드 SVG
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaFormatSummaryHtml(text) {
    return esc(text || "")
      .split("\n")
      .map((line) => {
        // 혹시 남아있는 마크다운 강조 기호(**)가 있어도 화면엔 남지 않게 제거한다.
        const clean = line.replace(/\*\*/g, "");
        const trimmed = clean.trim();
        // "[가이드라인명]" 같은 대괄호 제목 줄은 굵게 표시한다.
        if (/^\[[^\[\]]+\]$/.test(trimmed)) return `<strong>${trimmed}</strong>`;
        return clean;
      })
      .join("<br>");
  }

  // 엑셀에서 뽑아온 감점/코멘트 원문(items)을 그대로 읽기 좋게 줄바꿈해서 나열한다.
  // 항목마다 "[가이드라인]" 제목 줄 + 코멘트 원문 줄로 나열하고, 가이드라인이 없는
  // 항목은 번호만 붙여 구분한다. "원문 전체 보기"에 쓰인다.
  function qaOrganizeItemsText(items) {
    return items
      .map((it, i) => {
        const label = it.guideline ? `[${it.guideline}]` : `[${i + 1}번째 항목]`;
        return `${label}\n${it.feedback}`;
      })
      .join("\n\n");
  }

  function qaRoundSummaryLine(round) {
    const scoreText = (round.score === null || round.score === undefined) ? "-" : round.score;
    const dateText = round.date ? ` · ${esc(round.date)}` : "";
    const idText = round.consultId ? ` · 상담ID ${esc(round.consultId)}` : "";
    return `${esc(round.label)}${dateText}${idText} · 총점 ${esc(String(scoreText))}`;
  }

  /* ---- QA 상세 카드 상단: 최근 6개월 점수 추이 그래프 ----
     이미 있는 getQAScore()로 최근 N개월치 점수를 모아서, 데이터 없이 순수 SVG로
     간단한 라인 차트를 그린다(차트 라이브러리 없이 아이콘들과 같은 방식). 점수가
     없는 달은 그 지점만 건너뛰고 선을 잇지 않는다(중간에 끊긴 구간으로 표시).
     이번 달 라벨은 강조 색으로 표시해서 지금이 어디인지 바로 알 수 있게 한다. */
  const QA_TREND_MONTHS = 6;
  function qaComputeAgentTrend(agentId, year, monthIndex, count) {
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      let m = monthIndex - i;
      let y = year;
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m, score: getQAScore(agentId, y, m) });
    }
    return months;
  }
  function qaTrendSvgHtml(agentId, year, monthIndex) {
    const months = qaComputeAgentTrend(agentId, year, monthIndex, QA_TREND_MONTHS);
    const validScores = months.map((m) => m.score).filter((s) => s !== null);
    if (validScores.length === 0) {
      return `<div class="qa-trend-empty">최근 ${QA_TREND_MONTHS}개월간 입력된 점수가 없어요.</div>`;
    }
    const W = 560, H = 148, padL = 10, padR = 10, padT = 22, padB = 24;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const n = months.length;
    const xAt = (i) => padL + (n === 1 ? plotW / 2 : (plotW * i) / (n - 1));
    let min = Math.min(...validScores);
    let max = Math.max(...validScores);
    if (min === max) { min -= 5; max += 5; } else { const pad = (max - min) * 0.2; min -= pad; max += pad; }
    min = Math.max(0, min);
    max = Math.min(100, max);
    if (max - min < 1) max = min + 1;
    const yAt = (score) => padT + plotH - ((score - min) / (max - min)) * plotH;

    // 점수가 있는 달들끼리만 이어서 선을 그린다. 중간에 값이 없는 달이 끼어 있으면
    // 그 구간만 끊기고, 앞뒤 구간은 각각 따로 이어진다.
    const segments = [];
    let cur = [];
    months.forEach((m, i) => {
      if (m.score === null) { if (cur.length) segments.push(cur); cur = []; }
      else cur.push({ x: xAt(i), y: yAt(m.score) });
    });
    if (cur.length) segments.push(cur);
    const pathHtml = segments.map((seg) => {
      const d = seg.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join("");

    const dotHtml = months.map((m, i) => {
      if (m.score === null) return "";
      const x = xAt(i), y = yAt(m.score);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="var(--accent)"/><text x="${x.toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle" class="qa-trend-value">${m.score.toFixed(1)}</text>`;
    }).join("");

    const labelHtml = months.map((m, i) => {
      const x = xAt(i);
      const isCurrent = m.year === year && m.monthIndex === monthIndex;
      return `<text x="${x.toFixed(1)}" y="${H - 6}" text-anchor="middle" class="qa-trend-month${isCurrent ? " current" : ""}">${m.monthIndex + 1}월</text>`;
    }).join("");

    return `
      <div class="qa-trend-block">
        <div class="qa-trend-title">최근 ${QA_TREND_MONTHS}개월 추이</div>
        <svg viewBox="0 0 ${W} ${H}" class="qa-trend-svg" preserveAspectRatio="xMidYMid meet">
          ${pathHtml}
          ${dotHtml}
          ${labelHtml}
        </svg>
      </div>
    `;
  }

