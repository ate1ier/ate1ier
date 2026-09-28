  // 01t-capture-color-fix.js — 이미지 저장(html2canvas) 전에 최신 CSS 색 표기를 rgba로 바꿔주는 도우미
  // html2canvas 1.4.1은 color-mix()/color()/oklch() 같은 최신 색 표기를 읽지 못해서, 그런 색이 캡처 대상 안에
  // 하나라도 있으면(예: QA 통계 카드 배경) 캡처 전체가 "캡처 실패"로 끝난다. 브라우저가 계산해 둔 색(computed)을
  // 1픽셀 캔버스로 그려 실제 rgba 값으로 바꾼 뒤 인라인 스타일로 덮어쓰면 화면 모양은 그대로 두고 캡처만 통과한다.
  const CAPTURE_MODERN_COLOR_RE = /(?:color|oklch|oklab|lab|lch|hwb)\([^()]*\)/g;
  const CAPTURE_COLOR_PROPS = [
    "background-color", "background-image", "color", "border-top-color", "border-right-color",
    "border-bottom-color", "border-left-color", "outline-color", "box-shadow", "text-shadow",
    "text-decoration-color", "fill", "stroke",
  ];
  let captureColorCtx = null;
  function captureColorToRgba(value) {
    try {
      if (!captureColorCtx) {
        const cv = document.createElement("canvas");
        cv.width = 1; cv.height = 1;
        captureColorCtx = cv.getContext("2d", { willReadFrequently: true });
      }
      const ctx = captureColorCtx;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      // 캔버스는 알파가 곱해진 값을 돌려주므로, 반투명 색은 알파를 따로 다시 계산해서 돌려준다.
      const a = d[3] / 255;
      if (a === 0) return "rgba(0, 0, 0, 0)";
      return `rgba(${Math.round(d[0] / a)}, ${Math.round(d[1] / a)}, ${Math.round(d[2] / a)}, ${Math.round(a * 1000) / 1000})`;
    } catch (e) {
      return null;
    }
  }
  function flattenModernColorsForCapture(root) {
    if (!root || typeof getComputedStyle !== "function") return 0;
    let fixed = 0;
    const els = [root, ...root.querySelectorAll("*")];
    els.forEach((el) => {
      const cs = getComputedStyle(el);
      CAPTURE_COLOR_PROPS.forEach((prop) => {
        const v = cs.getPropertyValue(prop);
        if (!v || !CAPTURE_MODERN_COLOR_RE.test(v)) { CAPTURE_MODERN_COLOR_RE.lastIndex = 0; return; }
        CAPTURE_MODERN_COLOR_RE.lastIndex = 0;
        const next = v.replace(CAPTURE_MODERN_COLOR_RE, (m) => captureColorToRgba(m) || "rgba(0, 0, 0, 0)");
        el.style.setProperty(prop, next, "important");
        fixed++;
      });
    });
    return fixed;
  }
