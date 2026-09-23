(async function () {
  // ==================== 아이콘 세트 (이모티콘 대체 + 내비게이션 독 아이콘) ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ---- 심플한 라인 아이콘 세트 (이모티콘 대체) ---- */
  const ICON_HOME = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.3 8.2 8 3.2l5.7 5"/><path d="M3.6 6.8V13h3.1v-4h2.6v4h3.1V6.8"/></svg>`;
  const ICON_CALENDAR = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="3.4" width="11" height="10.2" rx="1.6"/><path d="M2.5 6.6h11M5.6 2v2.4M10.4 2v2.4"/></svg>`;
  const ICON_NOTE = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.3 2.6h5l2.4 2.4v8.4h-7.4z"/><path d="M9.3 2.6V5h2.4"/><path d="M6 8.4h4M6 10.8h4"/></svg>`;
  const ICON_EDIT = `<svg class="icon-emo" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 2.4 13.6 5.4 5.4 13.6 2.2 13.8 2.4 10.6z"/><path d="M9.2 3.8 12.2 6.8"/></svg>`;
  const ICON_USERS = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.1"/><path d="M2.4 13c0-2.1 1.6-3.6 3.6-3.6s3.6 1.5 3.6 3.6"/><circle cx="11.3" cy="6.4" r="1.7"/><path d="M9.9 9.6c1.7.2 3 1.5 3 3.4"/></svg>`;
  const ICON_CLIPBOARD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="3" width="8.8" height="11.2" rx="1.4"/><path d="M6.2 3V2.4a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1V3"/><path d="M5.8 7.4h4.4M5.8 10h4.4"/></svg>`;
  const ICON_CHART = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.4 13.6h11.2"/><rect x="3.8" y="8.4" width="2.1" height="4.3"/><rect x="7" y="5.6" width="2.1" height="7.1"/><rect x="10.2" y="9.8" width="2.1" height="2.9"/></svg>`;
  const ICON_BOOK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 3.4c1.6-.7 3.4-.7 5 0v9.2c-1.6-.7-3.4-.7-5 0V3.4Z"/><path d="M13.4 3.4c-1.6-.7-3.4-.7-5 0v9.2c1.6-.7 3.4-.7 5 0V3.4Z"/></svg>`;
  const ICON_LOGOUT = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 13.2H4.4A1.4 1.4 0 0 1 3 11.8V4.2A1.4 1.4 0 0 1 4.4 2.8h2.4"/><path d="M9.6 5.4 13 8l-3.4 2.6"/><path d="M13 8H6.4"/></svg>`;
  const ICON_USER = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="5.6" r="2.6"/><path d="M3 13.2c0-2.6 2.2-4.4 5-4.4s5 1.8 5 4.4"/></svg>`;
  const ICON_SHIELD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.2 12.8 4v3.9c0 3.4-2.1 5.7-4.8 6.5-2.7-.8-4.8-3.1-4.8-6.5V4z"/></svg>`;
  const ICON_MOON = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 9.9A5.1 5.1 0 1 1 6.1 3.2a4.1 4.1 0 0 0 6.7 6.7z"/></svg>`;
  const ICON_SUN = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.7"/><path d="M8 1.8v1.5M8 12.7v1.5M14.2 8h-1.5M3.3 8H1.8M12.3 3.7l-1.1 1.1M4.8 11.2l-1.1 1.1M12.3 12.3l-1.1-1.1M4.8 4.8l-1.1-1.1"/></svg>`;
  const ICON_QA = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.6l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z"/></svg>`;
  const ICON_PIN = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.4 12 6l-1.9 1.9v3.5L8 13.6l-2.1-2.2V7.9L4 6z"/></svg>`;
  const ICON_DRAG_HANDLE = `<svg class="icon-emo" viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><circle cx="5.3" cy="3.6" r="1.15"/><circle cx="10.7" cy="3.6" r="1.15"/><circle cx="5.3" cy="8" r="1.15"/><circle cx="10.7" cy="8" r="1.15"/><circle cx="5.3" cy="12.4" r="1.15"/><circle cx="10.7" cy="12.4" r="1.15"/></svg>`;
  // 월별 스케줄 "AI 자동 배치" 버튼용 반짝임(스파클) 아이콘.
  const ICON_SPARK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.6c.3 2.1 1 3.3 3.4 3.6-2.4.3-3.1 1.5-3.4 3.6-.3-2.1-1-3.3-3.4-3.6 2.4-.3 3.1-1.5 3.4-3.6Z"/><path d="M12.6 9.4c.2 1.2.6 1.9 1.8 2.1-1.2.2-1.6.9-1.8 2.1-.2-1.2-.6-1.9-1.8-2.1 1.2-.2 1.6-.9 1.8-2.1Z"/></svg>`;

  /* ---- 내비게이션 독 아이콘: macOS 스타일 스퀄클 플랫 아이콘 (메인 좌측 메뉴 전용) ---- */
  const NAV_ICON_HOME = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="nih"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#c1683f"/><g clip-path="url(#nih)"><path d="M130 260L256 160L382 260" fill="none" stroke="#fdf3e5" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M162 236V366H350V236" fill="#fdf3e5"/><rect x="240" y="292" width="32" height="74" fill="#c1683f"/></g></svg>`;
  const NAV_ICON_CALENDAR = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="nic"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#33363d"/><g clip-path="url(#nic)"><rect x="126" y="118" width="260" height="288" fill="#f2ead9"/><rect x="126" y="118" width="260" height="56" fill="#c1683f"/><rect x="168" y="90" width="18" height="46" rx="9" fill="#f2ead9"/><rect x="326" y="90" width="18" height="46" rx="9" fill="#f2ead9"/><text x="256" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="170" font-weight="700" fill="#33363d" text-anchor="middle">6</text></g></svg>`;
  const NAV_ICON_AGENTS = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="nia"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#5f6fae"/><g clip-path="url(#nia)"><circle cx="200" cy="200" r="62" fill="#f2ead9"/><path d="M104 396Q104 300 200 300Q296 300 296 396Z" fill="#f2ead9"/><circle cx="342" cy="222" r="46" fill="#e3d9be"/><path d="M282 400Q282 322 342 310Q402 322 402 400" fill="#e3d9be"/></g></svg>`;
  const NAV_ICON_NOTES = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="nin"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#d3a03f"/><g clip-path="url(#nin)"><rect x="128" y="96" width="256" height="320" fill="#fdf6e7"/><rect x="164" y="164" width="184" height="16" fill="#d3a03f"/><rect x="164" y="212" width="184" height="16" fill="#d3a03f"/><rect x="164" y="260" width="120" height="16" fill="#d3a03f"/><g transform="translate(300,320) rotate(45)"><rect x="-14" y="-84" width="28" height="140" fill="#33363d"/><polygon points="-14,56 14,56 0,90" fill="#d3a03f"/></g></g></svg>`;
  const NAV_ICON_INTERVIEWS = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="nii"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#3f8f86"/><g clip-path="url(#nii)"><rect x="146" y="100" width="220" height="312" fill="#f2ead9"/><rect x="198" y="80" width="116" height="42" fill="#e3d9be"/><rect x="178" y="192" width="160" height="14" fill="#3f8f86"/><rect x="178" y="234" width="160" height="14" fill="#3f8f86"/><rect x="178" y="276" width="104" height="14" fill="#3f8f86"/><circle cx="330" cy="352" r="42" fill="#33363d"/><path d="M312 352L324 366L350 336" fill="none" stroke="#f2ead9" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
  const NAV_ICON_QA = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="niq"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#c26a86"/><g clip-path="url(#niq)"><path d="M256 114L294 219L406 227L320 297L347 405L256 344L165 405L192 297L106 227L218 219Z" fill="#fdf6e7"/><circle cx="256" cy="246" r="48" fill="#c26a86"/><path d="M236 246L250 260L278 228" fill="none" stroke="#fdf6e7" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
  const NAV_ICON_SCHEDULE = `<svg class="nav-dock-icon" viewBox="0 0 512 512" aria-hidden="true"><defs><clipPath id="nis"><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z"/></clipPath></defs><path d="M512 256L511 369L508 405L504 430L498 450L489 466L479 479L466 489L450 498L430 504L405 508L369 511L256 512L143 511L107 508L82 504L62 498L46 489L33 479L23 466L14 450L8 430L4 405L1 369L0 256L1 143L4 107L8 82L14 62L23 46L33 33L46 23L62 14L82 8L107 4L143 1L256 0L369 1L405 4L430 8L450 14L466 23L479 33L489 46L498 62L504 82L508 107L511 143L512 256Z" fill="#6fa07a"/><g clip-path="url(#nis)"><rect x="120" y="398" width="272" height="14" fill="#f2ead9"/><rect x="146" y="322" width="52" height="76" fill="#f2ead9"/><rect x="230" y="240" width="52" height="158" fill="#f2ead9"/><rect x="314" y="280" width="52" height="118" fill="#f2ead9"/></g></svg>`;
  const ICON_CHECK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="2.4"/><path d="M5 8.2 7 10.1 11 5.9"/></svg>`;
  const ICON_LOCK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="7.2" width="8.8" height="6.4" rx="1.4"/><path d="M5.4 7.2V5.2a2.6 2.6 0 0 1 5.2 0v2"/></svg>`;
  const ICON_UNLOCK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="7.2" width="8.8" height="6.4" rx="1.4"/><path d="M5.4 7.2V5.2a2.6 2.6 0 0 1 4.8-1.9"/></svg>`;
  const ICON_TRASH = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 5h9.2"/><path d="M6.4 5V3.7c0-.4.3-.7.7-.7h1.8c.4 0 .7.3.7.7V5"/><path d="M4.8 5l.6 7.9c0 .5.5.9 1 .9h3.2c.5 0 .9-.4 1-.9L11.2 5"/><path d="M6.8 7.3v3.9M9.2 7.3v3.9"/></svg>`;
  const ICON_CAMERA = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6h2.1l1-1.5h4.8l1 1.5h2.1v6.6H2.5z"/><circle cx="8" cy="9.5" r="2.1"/></svg>`;
  const ICON_DOWNLOAD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5v7.2"/><path d="M5.2 7.1 8 9.9l2.8-2.8"/><path d="M3.2 13h9.6"/></svg>`;
  const ICON_BELL = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.2V7.4a4 4 0 0 1 8 0v3.8l1.1 1.5H2.9z"/><path d="M6.6 13.4a1.5 1.5 0 0 0 2.8 0"/></svg>`;
  const ICON_CLOCK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="5.6"/><path d="M8 4.8V8l2.4 1.4"/></svg>`;
  const ICON_CLOSE_SM = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`;
  const ICON_CHEVRON_RIGHT = `<svg class="icon-emo" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.4 10.6 8 6 12.6"/></svg>`;
  const ICON_UNDO = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.6v3.4h3.4"/><path d="M4.6 8A5 5 0 1 1 6 11.7"/></svg>`;
  const ICON_UPLOAD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9.7V2.5"/><path d="M5.2 5.3 8 2.5l2.8 2.8"/><path d="M3.2 13h9.6"/></svg>`;
  const ICON_PAPERCLIP = `<svg class="icon-emo" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.3 4.6 6.6 9.3a1.9 1.9 0 1 0 2.7 2.7l4.4-4.4a3.3 3.3 0 1 0-4.7-4.7L4.4 7.5a4.6 4.6 0 0 0 6.5 6.5"/></svg>`;
  const ICON_BACKUP = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 4.4c0-1 2.4-1.8 5.4-1.8s5.4.8 5.4 1.8-2.4 1.8-5.4 1.8-5.4-.8-5.4-1.8Z"/><path d="M2.6 4.4V8c0 1 2.4 1.8 5.4 1.8s5.4-.8 5.4-1.8V4.4"/><path d="M2.6 8v3.6c0 1 2.4 1.8 5.4 1.8s5.4-.8 5.4-1.8V8"/></svg>`;
  const ICON_REFRESH = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8A5 5 0 1 1 11.4 4.3"/><path d="M13 2.6V6h-3.4"/></svg>`;
  const ICON_SETTINGS = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.1"/><path d="M8 2.4v1.5M8 12.1v1.5M13.6 8h-1.5M3.9 8H2.4M11.9 4.1l-1.05 1.05M5.15 10.85 4.1 11.9M11.9 11.9l-1.05-1.05M5.15 5.15 4.1 4.1"/></svg>`;
  const ICON_DISCORD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 3.6C6 3.1 7 3 8 3s2 .1 3.2.6c1 1.4 1.6 3 1.7 4.9-1 .8-2.3 1.3-3.6 1.5l-.4-.8c.6-.2 1.1-.4 1.6-.7-.1-.1-.3-.2-.4-.3-2 1-4.4 1-6.4 0-.1.1-.3.2-.4.3.5.3 1 .5 1.6.7l-.4.8c-1.3-.2-2.6-.7-3.6-1.5.1-1.9.7-3.5 1.7-4.9Z"/><circle cx="6.1" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="9.9" cy="8" r=".8" fill="currentColor" stroke="none"/></svg>`;
  // 하단 독의 "이름 통합 검색"과 같은 모양의 작은 검색 아이콘. 다른 검색창들(상담사 검색,
  // 면담일지 검색, 면담 대상/관리자 검색)에서도 오른쪽에 똑같이 붙여서 통일감을 준다.
  const ICON_SEARCH_MINI = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.2"/><path d="M13 13l-2.9-2.9"/></svg>`;

  // ==================== 클라우드 동기화 핵심: Supabase 클라이언트/인증 이메일 매핑, 동기화 상태 토스트, 3-way 자동 병합, 부분 업데이트(patch) 최적화 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ===================== ☁️ 클라우드 동기화 (Supabase) =====================
     계정 목록과 각 계정의 데이터(할일/메모/상담사/면담일지/스케줄/캘린더)를
     Supabase의 kv_store 테이블에도 함께 저장해서, 다른 기기·다른 사람도
     같은 데이터를 볼 수 있게 한다. 화면 테마, 내비게이션 접기 상태, 로그인
     세션처럼 "이 브라우저에서만 의미 있는" 값은 그대로 로컬(localStorage)에만
     남겨둔다.
     ---- Supabase Auth 전환 (2026-09) ----
     예전에는 RLS를 anon에게 전면 개방해뒀었다(anon key만 있으면 누구나 이
     테이블을 읽고 쓸 수 있었다). 지금은 실제로 로그인(=Supabase Auth로 인증)한
     사용자만 kv_store를 읽고 쓸 수 있도록 서버(Supabase 대시보드)의 RLS
     정책을 바꿔뒀다 — 이 파일 옆의 supabase/auth-rls-migration.sql 참고.
     로그인 화면에서 "아이디"만으로 계정 종류(팀용/개인용)를 미리 보여주고
     비밀번호를 로컬에서 대조하는 지금의 로그인 방식 자체는 그대로 두되(그
     아이디/비밀번호 대조 로직 강화는 다음 작업으로 별도 진행 예정), 아래
     사항이 새로 추가됐다:
       - 아이디(username)를 Supabase Auth가 요구하는 이메일 형식으로 바꿔주는
         가짜 이메일(예: "abc" → "abc@ate1ier.local")을 매핑에 쓴다. 실제
         이메일이 아니라서 발송되는 메일은 없다 — Supabase 프로젝트의
         Authentication 설정에서 "Confirm email"을 꺼둬야 가입 즉시 로그인이
         된다(auth-rls-migration.sql 상단 안내 참고).
       - Supabase Auth의 "비밀번호"로는 사람이 입력하는 로그인 비밀번호를 그대로
         쓰지 않고, 계정마다 한 번 정해지면 바뀌지 않는 별도의 무작위 값
         (cloudAuthSecret)을 쓴다. 사람용 비밀번호 확인(로컬 salt+해시 대조)은
         지금 로직 그대로 두고, 그 확인을 통과하면 이 무작위 값으로 Supabase
         Auth에 로그인(없으면 자동 가입)해서 kv_store 접근 권한을 얻는다. 이렇게
         분리해두면 마스터가 나중에 사람용 비밀번호를 초기화해도 Supabase Auth
         쪽 인증은 안 바뀌므로 로그인이 막히는 일이 없다.
       - Supabase Auth 자체의 세션 토큰은 supabase-js가 알아서
         localStorage의 "sb-...-auth-token" 키에 저장하는데, 이 키가
         (원래는 앱 데이터에만 쓰던) 아래 클라우드 동기화 대상에 함께
         휩쓸려 들어가면 로그인 토큰이 고스란히 kv_store에 저장되는
         사고가 나므로, isCloudSynced()에서 "sb-"로 시작하는 키는
         항상 제외한다. */
  const SUPABASE_URL = "https://zsjnuueknhfrnnfunxad.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam51dWVrbmhmcm5uZnVueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDY0NjYsImV4cCI6MjEwMzMyMjQ2Nn0.4bCMYyOcfFID71v4milpoJ8mbAHpH12lPkN72Es_Zd4";
  const cloud = (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  // 로그인 화면(아직 _account가 없는 상태)에서는 renderApp()이 참조하는 state·
  // CURRENT_ACCOUNT_* 같은 값들이 아직 만들어지지 않은 상태다. 그런데 실시간
  // 구독(postgres_changes)이나 탭 전환 감지(visibilitychange/focus) 리스너는
  // 로그인 여부와 상관없이 파일 로딩 시점에 바로 등록되기 때문에, 로그인 화면을
  // 보고 있는 동안에도(예: 다른 관리자가 그 사이에 뭔가 저장했을 때, 또는 탭을
  // 잠깐 다른 곳에 갔다 왔을 때) 이 리스너들이 그대로 실행되면서 아직 없는
  // 값을 참조해 예외를 던지는 문제가 있었다. 이 플래그가 true로 바뀌기 전까지는
  // (=로그인 검사를 통과해서 실제 앱 코드가 초기화되기 전까지는) 그런 리스너들이
  // 안전하게 아무 일도 하지 않고 지나가도록 한다.
  let _appBooted = false;
  // 로그인 아이디를 Supabase Auth용 이메일로 바꿀 때 쓰는 가짜 도메인.
  // 실제로 존재하는 도메인일 필요는 없지만(메일이 발송되지 않으니까), 한 번
  // 정하면 이후 바꾸지 말 것 — 바꾸면 기존 계정들이 전부 새 이메일로 다시
  // 가입해야 하는 것처럼 보이게 된다.
  const AUTH_EMAIL_DOMAIN = "ate1ier.local";
  // 아이디를 이메일 앞부분에 그대로 넣으면 한글・공백・특수문자가 섞인 아이디일 때
  // "invalid format" 오류가 난다(이메일 로컬파트는 그런 문자를 허용하지 않음).
  // 그래서 아이디를 그대로 쓰지 않고, 아이디를 해시(SHA-256)한 값 — 항상 영문
  // 소문자・숫자로만 이뤄진 고정 길이 문자열 — 을 이메일 앞부분으로 쓴다. 같은
  // 아이디는 항상 같은 값으로 바뀌므로 매핑은 그대로 유지된다.
  async function toAuthEmail(username) {
    const normalized = String(username || "").trim().toLowerCase();
    const hashHex = HAS_SUBTLE_CRYPTO ? await sha256Hex(normalized) : legacyHash(normalized).replace(/^-/, "n");
    return `u${hashHex}@${AUTH_EMAIL_DOMAIN}`;
  }
  // ---- 2026-09 보안 업데이트: cloudAuthSecret 폐지 ----
  // 예전에는 Supabase Auth 비밀번호로 사람이 입력하는 로그인 비밀번호 대신
  // 계정마다 따로 저장해둔 무작위 값(cloudAuthSecret)을 썼다. 그런데 로그인
  // 화면에서 "아이디만으로 계정 종류를 미리 보여주기" 위해 로그인 전(anon)에도
  // 계정 목록 한 줄을 읽을 수 있게 열어뒀던 탓에, 그 안에 함께 있던
  // cloudAuthSecret까지 로그인 없이 읽을 수 있는 구조적인 문제가 있었다(RLS는
  // "행" 단위로만 막을 수 있어 같은 행 안의 값은 가릴 수 없었음). 지금은 사람이
  // 입력하는 비밀번호 자체가 곧 Supabase Auth 비밀번호이고, 검증도(예전
  // 계정을 이 방식으로 처음 전환할 때는 물론) 전부 서버 쪽 Edge Function
  // (supabase/functions/auth-admin)에서만 처리해서, 비밀번호 해시나
  // cloudAuthSecret이 브라우저로 전혀 나가지 않는다. 자세한 배경은
  // supabase/auth-lockdown-migration.sql 상단 설명 참고.
  function _hasSession(result) {
    return !!(result && result.data && result.data.session);
  }
  // 새 계정을 만들 때: 사람이 정한 비밀번호로 곧장 Supabase Auth에 가입한다.
  async function cloudAuthSignUpDirect(username, password) {
    if (!cloud) return { ok: true }; // 클라우드 연결이 아예 없는 환경(오프라인 전용)이면 그냥 통과
    const email = await toAuthEmail(username);
    const result = await cloud.auth.signUp({ email, password });
    if (result.error) return { ok: false, reason: result.error.message || "클라우드 인증에 실패했어요." };
    if (!_hasSession(result)) {
      return { ok: false, reason: "가입은 됐지만 세션이 생성되지 않았어요. Supabase 프로젝트의 Authentication 설정에서 \"Confirm email\"이 꺼져 있는지 확인해주세요." };
    }
    return { ok: true };
  }
  // 로그인할 때(이미 새 방식으로 전환된 계정): 사람이 입력한 비밀번호로 그대로 로그인한다.
  async function cloudAuthSignInDirect(username, password) {
    if (!cloud) return { ok: true };
    const email = await toAuthEmail(username);
    const signIn = await cloud.auth.signInWithPassword({ email, password });
    if (signIn.error || !_hasSession(signIn)) {
      return { ok: false, reason: (signIn.error && signIn.error.message) || "로그인에 실패했어요." };
    }
    return { ok: true };
  }
  // 아직 예전 방식(로컬 해시 비교 + cloudAuthSecret)으로 남아있는 계정을 이번
  // 로그인에서 한 번만 서버 쪽에서 검증·전환한다 — 비밀번호는 여기서 함수
  // 호출로만 서버에 전달되고, 성공하면 그 즉시 cloudAuthSignInDirect로 진짜
  // 세션을 받는다(마이그레이션 자체는 세션을 만들어주지 않음).
  async function cloudMigrateLegacyLogin(username, password) {
    if (!cloud) return { ok: true };
    try {
      const { data, error } = await cloud.functions.invoke("auth-admin", {
        body: { action: "migrate-login", username, password },
      });
      if (error) return { ok: false, reason: error.message || "로그인 전환에 실패했어요." };
      if (!data || !data.ok) return { ok: false, reason: (data && data.reason) || "로그인 전환에 실패했어요." };
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: (e && e.message) || "로그인 전환 중 문제가 발생했어요." };
    }
  }


  // 마스터가 다른 계정의 비밀번호를 초기화할 때: 실제 검증·변경은 전부 서버(Edge
  // Function)에서 하고, 그 함수가 호출자(나)가 진짜 로그인된 마스터인지까지
  // 자기가 직접 다시 확인한다(클라이언트가 "나는 마스터"라고 보내는 값은 안 믿음).
  async function cloudAdminResetPassword(targetAccountId, newPassword) {
    if (!cloud) return { ok: true };
    try {
      const { data, error } = await cloud.functions.invoke("auth-admin", {
        body: { action: "reset-password", targetAccountId, newPassword },
      });
      if (error) return { ok: false, reason: error.message || "비밀번호 초기화에 실패했어요." };
      if (!data || !data.ok) return { ok: false, reason: (data && data.reason) || "비밀번호 초기화에 실패했어요." };
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: (e && e.message) || "비밀번호 초기화 중 문제가 발생했어요." };
    }
  }

  const CLOUD_EXCLUDED_KEYS = new Set([
    "app-theme-mode",
    "personal-app:session",
    "personal-app:master-origin",
    "personal-app:last-active", // 로그인 유지용 하트비트. 이 브라우저(탭)에서만 의미 있는
    // 값인데 빠져 있어서, 15초마다 모든 사람의 탭에서 클라우드에 저장을 시도하고 있었다.
    // 그 하트비트는 계정 구분 없이 하나의 키를 공유해서, 다른 사람이 그냥 탭을 열어두기만
    // 해도 계속 클라우드 쓰기가 발생하는 원인 중 하나였다.
  ]);
  function isCloudSynced(key) {
    if (!cloud) return false;
    if (CLOUD_EXCLUDED_KEYS.has(key)) return false;
    if (key.indexOf("personal-app:page") !== -1) return false; // 마지막으로 보던 페이지도 기기별로 달라도 됨
    if (key.indexOf("sb-") === 0) return false; // Supabase Auth 세션 토큰(이 브라우저 전용, 절대 kv_store로 보내면 안 됨)
    return true;
  }
  // 진행 중인 클라우드 저장 요청들을 추적한다. location.reload() 같이 페이지를
  // 새로고침/이동시키는 동작 직전에는 반드시 flushCloudWrites()로 이 목록이
  // 비워질 때까지 기다려야, 저장 요청이 끝나기 전에 페이지가 새로고침되면서
  // 네트워크 요청이 그대로 끊겨버리는 문제(= Supabase에 데이터가 저장 안 되는
  // 것처럼 보이는 문제)를 막을 수 있다.
  const _pendingCloudWrites = new Set();
  function _trackCloudWrite(promise) {
    _pendingCloudWrites.add(promise);
    const clear = () => _pendingCloudWrites.delete(promise);
    promise.then(clear, clear);
    return promise;
  }
  async function flushCloudWrites() {
    if (!_pendingCloudWrites.size) return;
    await Promise.allSettled(Array.from(_pendingCloudWrites));
  }

  /* ---- 동기화 상태 토스트: 오른쪽 상단에 "동기화 중… / 저장됨 / 동기화 실패"를
     잠깐 띄웠다가 자동으로 사라지게 한다. 저장이 연속으로 여러 번 일어나도
     토스트가 여러 개 쌓이지 않도록 하나의 요소를 재사용한다. */
  let _syncToastHideTimer = null;
  let _syncToastSettleTimer = null;
  let _syncHadError = false;
  function _syncToastEl() {
    let el = document.getElementById("cloud-sync-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-sync-toast";
      el.className = "cloud-sync-toast";
      document.body.appendChild(el);
    }
    return el;
  }
  function _showSyncToast(status) {
    clearTimeout(_syncToastHideTimer);
    const el = _syncToastEl();
    el.classList.remove("syncing", "saved", "error");
    el.classList.add(status, "visible");
    const iconHtml = status === "syncing"
      ? `<span class="cloud-sync-spinner"></span>`
      : status === "saved"
        ? ICON_CHECK
        : `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="5.6"/><path d="M8 5.2v3.4"/><path d="M8 11v.1"/></svg>`;
    const label = status === "syncing" ? "동기화 중…" : status === "saved" ? "저장됨" : "동기화 실패";
    el.innerHTML = `${iconHtml}<span>${label}</span>`;
    if (status !== "syncing") {
      _syncToastHideTimer = setTimeout(() => { el.classList.remove("visible"); }, status === "error" ? 4000 : 1800);
    }
  }
  // 클라우드 저장 요청이 시작될 때 호출: 즉시 "동기화 중…" 표시
  function notifyCloudSyncStart() {
    if (!cloud) return;
    clearTimeout(_syncToastSettleTimer);
    _showSyncToast("syncing");
  }
  // 클라우드 저장 요청이 끝날 때 호출: 다른 요청이 이어서 들어올 수 있으니 짧게
  // 기다렸다가, 더 진행 중인 요청이 없으면 최종 결과(저장됨/실패)를 보여준다.
  function notifyCloudSyncSettle(ok) {
    if (!cloud) return;
    if (!ok) _syncHadError = true;
    clearTimeout(_syncToastSettleTimer);
    _syncToastSettleTimer = setTimeout(() => {
      if (_pendingCloudWrites.size > 0) return;
      _showSyncToast(_syncHadError ? "error" : "saved");
      _syncHadError = false;
    }, 300);
  }

  /* ---- 동시 편집 충돌 감지 ----
     _knownServerUpdatedAt: 이 브라우저가 마지막으로 확인한 "서버에 있는" 버전의 updated_at.
       내가 저장에 성공하거나, 실시간으로 남의 변경을 확인할 때마다 갱신된다.
     _knownServerValue: 위 시점의 실제 내용(JSON 문자열). 나중에 충돌이 나면 "그때는
       이랬는데, 나는 이렇게 바꿨고, 지금 서버는 이렇게 바뀌어 있다"를 비교해서 자동으로
       합칠 수 있는 기준(base)으로 쓴다.
     _ourWriteTimestamps: 내가 방금 보낸 저장 요청의 updated_at을 key별로 기억해둔다.
       실시간 이벤트가 돌아왔을 때 "방금 내가 쓴 걸 그대로 되돌려받은 것"인지
       "남이 새로 고친 것"인지 구분하는 용도.
     _pushChains: 같은 key에 대한 저장 요청을 한 번에 하나씩만 순서대로 보내서,
       내가 연달아 두 번 저장했을 뿐인데 스스로와 충돌났다고 오판하는 걸 막는다. */
  const _knownServerUpdatedAt = {};
  const _knownServerValue = {};
  const _ourWriteTimestamps = {};
  const _pushChains = {};
  const _conflictedKeys = new Set(); // 자동 병합도 실패해서 정말로 물어봐야 하는 키
  const _fieldConflictNotices = new Map(); // key -> 자동 병합은 됐지만 "이 부분은 겹쳤어요"라고 알려줄 경로들

  /* ---- 저장 충돌 자동 병합 ----
     지금까지는 같은 key(예: 면담일지 전체, 스케줄 전체처럼 카테고리 하나를 통째로 담은
     덩어리)를 다른 사람이 "거의 동시에" 저장하면 무조건 "저장 충돌" 팝업을 띄우고
     사용자가 직접 "새로 불러오기 / 내 걸로 덮어쓰기" 중 하나를 고르게 했다. 문제는
     같은 카테고리 안에서 서로 완전히 다른 항목(예: A 상담사 면담 기록 vs B 상담사 면담
     기록)을 고친 경우에도 "같은 key"라는 이유만으로 매번 충돌로 잡혔다는 점이다.
     아래 3-way 병합은 "마지막으로 서버와 같았던 상태(base)"를 기준으로 "내가 바꾼 부분"과
     "남이 바꾼 부분"을 항목 단위(id가 있는 배열)나 키 단위(객체)로 비교해서, 서로 겹치지
     않으면 조용히 합쳐서 다시 저장한다.
     예전에는 이 병합 도중 어느 한 군데(예: 스케줄의 특정 날짜·특정 칸 하나)만 정말로
     서로 다른 값으로 동시에 고쳐져도, 그 즉시 객체 전체 병합을 MERGE_CONFLICT로 실패
     처리해서 무관한 나머지 변경사항까지 통째로 막고 팝업을 띄웠다. 지금은 그렇게 하지
     않는다 — 진짜로 겹친 "그 한 군데"만 지금 저장하려던 값으로 우선 적용(그 경로를
     conflicts 목록에 기록)하고, 나머지는 정상적으로 병합해서 저장을 계속 진행한다.
     겹친 부분이 있었다는 사실은 저장을 막는 팝업이 아니라, 확인만 하면 사라지는
     가벼운 알림 배너로 알려준다(_renderFieldConflictBanner). 병합 자체가 시작조차
     안 되는 경우(최상위 값이 애초에 id 없는 배열이나 문자열/숫자 같은 단일 값이라
     항목 단위로 쪼갤 방법이 없는 경우, 또는 서버 재조회/JSON 파싱 자체가 실패한 경우)
     에만 예전처럼 진짜 "저장 충돌" 팝업을 띄운다. */
  const MERGE_CONFLICT = Symbol("merge-conflict");
  function _deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!_deepEqual(a[i], b[i])) return false;
      return true;
    }
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && _deepEqual(a[k], b[k]));
  }
  // "id를 가진 객체들의 배열"인지 판단한다 (면담 기록, 상담사, 할 일처럼 각 항목을
  // 하나씩 구분해서 합칠 수 있는 목록). 순서만 있는 배열(즐겨찾기 순서 등)은 해당 없음.
  function _isIdArray(arr) {
    return Array.isArray(arr) && arr.length > 0 && arr.every((it) => it && typeof it === "object" && !Array.isArray(it) && (typeof it.id === "string" || typeof it.id === "number"));
  }
  // path: 지금 비교 중인 위치를 사람이 읽을 수 있는 경로 문자열로 나타낸 것
  //   (예: "records[2026-05-01].agentId", "monthLocks[2026-05]"). 최상위 호출에서는
  //   빈 문자열("")이고, 객체 키로 들어갈 때는 ".key"를, id 배열의 항목으로 들어갈
  //   때는 "[id]"를 이어붙인다. 진짜로 자동 병합이 안 되는 지점을 만나면 이 경로를
  //   conflicts 배열에 기록해두고, 그 지점만 "지금 저장하려는 값(local)"으로 정해서
  //   계속 진행한다 — 그래야 무관한 나머지 변경들이 그 한 지점 때문에 통째로 막히지 않는다.
  // conflicts: 위에서 기록해두는 경로들을 담을 배열(호출부에서 []로 넘겨서 결과를 받아본다).
  function _merge3(base, local, remote, path, conflicts) {
    path = path || "";
    conflicts = conflicts || [];
    if (_deepEqual(local, remote)) return local;
    if (_deepEqual(local, base)) return remote; // 나는 이 부분을 안 바꿨음 → 남의 변경을 그대로 받음
    if (_deepEqual(remote, base)) return local; // 남은 이 부분을 안 바꿨음 → 내 변경을 그대로 유지
    // 여기부터는 둘 다 바뀐 경우. 구조를 보고 항목 단위로 합칠 수 있는지 시도한다.
    if (_isIdArray(local) && _isIdArray(remote)) {
      const baseArr = Array.isArray(base) ? base : [];
      const baseById = {}; baseArr.forEach((it) => { if (it && it.id != null) baseById[it.id] = it; });
      const localById = {}; local.forEach((it) => { localById[it.id] = it; });
      const remoteById = {}; remote.forEach((it) => { remoteById[it.id] = it; });
      const ids = []; const seen = new Set();
      local.forEach((it) => { if (!seen.has(it.id)) { seen.add(it.id); ids.push(it.id); } });
      remote.forEach((it) => { if (!seen.has(it.id)) { seen.add(it.id); ids.push(it.id); } });
      const result = [];
      for (const id of ids) {
        const inBase = Object.prototype.hasOwnProperty.call(baseById, id);
        const inLocal = Object.prototype.hasOwnProperty.call(localById, id);
        const inRemote = Object.prototype.hasOwnProperty.call(remoteById, id);
        if (inLocal && inRemote) {
          const merged = _merge3(inBase ? baseById[id] : undefined, localById[id], remoteById[id], path + "[" + id + "]", conflicts);
          result.push(merged);
        } else if (inLocal && !inRemote) {
          // 남에게 없는 항목: 내가 새로 추가했거나, 남이 지운 뒤에도 나는 그대로 갖고 있음 → 유지
          result.push(localById[id]);
        } else if (!inLocal && inRemote) {
          // 나에게 없는 항목: base와 비교해서 남이 그 사이에 손대지 않은 채 나만 지웠다면
          // 삭제를 존중하고, 남이 그 사이 고치거나 새로 추가했다면 잃어버리지 않게 살려둔다.
          if (inBase && _deepEqual(baseById[id], remoteById[id])) { /* 삭제 유지 */ }
          else result.push(remoteById[id]);
        }
      }
      return result;
    }
    if (local && remote && typeof local === "object" && typeof remote === "object" && !Array.isArray(local) && !Array.isArray(remote)) {
      const baseObj = (base && typeof base === "object" && !Array.isArray(base)) ? base : {};
      const keys = new Set([...Object.keys(baseObj), ...Object.keys(local), ...Object.keys(remote)]);
      const result = {};
      for (const k of keys) {
        const inBase = Object.prototype.hasOwnProperty.call(baseObj, k);
        const inLocal = Object.prototype.hasOwnProperty.call(local, k);
        const inRemote = Object.prototype.hasOwnProperty.call(remote, k);
        if (inLocal && inRemote) {
          const merged = _merge3(inBase ? baseObj[k] : undefined, local[k], remote[k], path ? path + "." + k : k, conflicts);
          result[k] = merged;
        } else if (inLocal && !inRemote) {
          if (inBase && _deepEqual(baseObj[k], local[k])) { /* 내가 안 바꿨고 남이 지움 → 삭제 유지 */ }
          else result[k] = local[k];
        } else if (!inLocal && inRemote) {
          if (inBase && _deepEqual(baseObj[k], remote[k])) { /* 남이 안 바꿨고 내가 지움 → 삭제 유지 */ }
          else result[k] = remote[k];
        }
      }
      return result;
    }
    // 순서만 있는 배열이나 값 하나(문자열/숫자 등)를 서로 다르게 고친 경우는 자동으로
    // 합칠 방법이 없다. 이 지점이 애초에 최상위(path === "")라면 — 즉 카테고리 전체가
    // 통째로 이런 값이라 항목 단위로 쪼갤 여지가 아예 없다면 — 예전처럼 진짜 충돌로
    // 취급해서 팝업을 띄운다. 하지만 객체나 목록 "안"의 한 지점에서 이런 일이 생긴
    // 거라면, 그 지점만 지금 저장하려던 값을 우선 적용하고 기록만 남긴 뒤 나머지
    // 병합은 그대로 계속한다 — 한 군데의 진짜 충돌이 전체 저장을 막지 않도록.
    if (!path) return MERGE_CONFLICT;
    conflicts.push(path);
    return local;
  }
  // 충돌이 났을 때 자동 병합을 시도한다. 성공하면 합쳐진 JSON 문자열을, 실패하면
  // null을 돌려준다. 병합에 성공하면 이 브라우저의 화면(메모리)에도 즉시 반영해서,
  // 다시 저장을 시도하는 동안 화면이 최신 내용을 보여주게 한다.
  async function _tryAutoMergeConflict(key, localValue) {
    try {
      const { data, error } = await cloud.from("kv_store").select("value,updated_at").eq("key", key).maybeSingle();
      if (error || !data) return null;
      _knownServerUpdatedAt[key] = data.updated_at;
      let baseParsed, localParsed, remoteParsed;
      try {
        baseParsed = _knownServerValue[key] !== undefined ? JSON.parse(_knownServerValue[key]) : undefined;
        localParsed = JSON.parse(localValue);
        remoteParsed = JSON.parse(data.value);
      } catch (e) { return null; } // JSON이 아니면 자동 병합을 시도하지 않음
      const conflicts = [];
      const merged = _merge3(baseParsed, localParsed, remoteParsed, "", conflicts);
      if (merged === MERGE_CONFLICT) return null;
      const mergedStr = JSON.stringify(merged);
      _origSetItem(key, mergedStr);
      let affectedPages = [];
      try { affectedPages = _applyRemoteChangeToMemory(key); } catch (e) {}
      if (affectedPages.indexOf(state.page) !== -1 && !_hasActiveEditableFocus()) renderApp();
      // 진짜로 겹친 지점이 일부 있었다면(그래도 저장 자체는 계속 진행됐다) 팝업으로
      // 막지 않고, 확인하면 사라지는 가벼운 알림 배너로만 알려준다.
      if (conflicts.length) _noteFieldConflicts(key, conflicts);
      return mergedStr;
    } catch (e) { return null; }
  }
  function _noteFieldConflicts(key, paths) {
    let set = _fieldConflictNotices.get(key);
    if (!set) { set = new Set(); _fieldConflictNotices.set(key, set); }
    paths.forEach((p) => set.add(p));
    _renderFieldConflictBanner();
  }

  /* ---- 부분 업데이트(patch) 최적화 ----
     지금까지는 카테고리 하나(예: QA 전체, 면담일지 전체, 월별 스케줄 전체)를 조금만
     고쳐도 그 카테고리의 JSON 전체를 매번 다시 서버로 보냈다. 항목이 수백 개인
     데이터에서 체크박스 하나만 바꿔도 전체를 다시 보내는 건 낭비이므로, "이전에
     서버와 같았던 값"(_knownServerValue)과 "지금 저장하려는 값"을 비교해서 바뀐
     자리만 뽑아 서버의 kv_apply_patch 함수(supabase/kv-patch-function.sql)로 그
     자리만 patch한다.
     구조상 못 쪼개거나(예: id 없는 배열의 순서 변경, 최상위 값 자체가 문자열・숫자),
     바뀐 자리가 너무 많거나(사실상 전체 교체나 다름없음), 값 자체가 작아서 나눌
     실익이 없거나, 서버에 kv_apply_patch 함수가 아직 없으면(SQL을 안 올린 경우)
     조용히 예전처럼 "전체를 통째로 저장하는 방식"으로 넘어간다 — 이 최적화는
     실패해도 항상 안전하게 폴백하므로, SQL을 안 올려도 앱은 그대로 정상 동작한다. */
  const KV_PATCH_MIN_SIZE = 3000; // 이보다 작은 값은 그냥 통째로 보내는 게 더 간단하고 충분히 빠르다
  const KV_PATCH_MAX_OPS = 30; // 바뀐 자리가 너무 많으면 사실상 전체 교체이므로 그냥 전체로 보낸다
  // id를 가진 배열은 항목 순서가 유지될 때만 "항목 하나 = 배열 인덱스 하나"로
  // patch할 수 있다(항목 추가·삭제·순서 변경까지 patch로 표현하려면 훨씬 복잡해지므로
  // 지금은 다루지 않고 전체 교체로 넘긴다). oldVal/newVal이 완전히 같은 자리는
  // 그냥 건너뛰고, 다른 자리만 ops에 쌓는다. 분해할 수 없는 지점을 만나면 false를
  // 돌려줘서 호출부가 "이번 저장은 patch로 못 한다"는 걸 알게 한다.
  function _diffToOps(oldVal, newVal, path, ops) {
    if (_deepEqual(oldVal, newVal)) return true;
    if (_isIdArray(oldVal) && _isIdArray(newVal)) {
      const oldIds = oldVal.map((it) => it.id);
      const newIds = newVal.map((it) => it.id);
      const idsUnchanged = oldIds.length === newIds.length && oldIds.every((id, i) => id === newIds[i]);
      if (!idsUnchanged) return false;
      const oldById = {};
      oldVal.forEach((it) => { oldById[it.id] = it; });
      for (let i = 0; i < newVal.length; i++) {
        if (!_diffToOps(oldById[newVal[i].id], newVal[i], path.concat([i]), ops)) return false;
        if (ops.length > KV_PATCH_MAX_OPS) return false;
      }
      return true;
    }
    if (oldVal && newVal && typeof oldVal === "object" && typeof newVal === "object" && !Array.isArray(oldVal) && !Array.isArray(newVal)) {
      const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
      for (const k of keys) {
        const inOld = Object.prototype.hasOwnProperty.call(oldVal, k);
        const inNew = Object.prototype.hasOwnProperty.call(newVal, k);
        if (inOld && inNew) {
          if (!_diffToOps(oldVal[k], newVal[k], path.concat([k]), ops)) return false;
        } else if (!inOld && inNew) {
          ops.push({ path: path.concat([k]), value: newVal[k] });
        } else {
          ops.push({ path: path.concat([k]), remove: true });
        }
        if (ops.length > KV_PATCH_MAX_OPS) return false;
      }
      return true;
    }
    // 여기 왔다는 건 순서만 있는 배열이거나 문자열/숫자 같은 원시값이 서로 다르다는
    // 뜻 — 더는 쪼갤 수 없다. 이 지점 전체를 하나의 patch로 기록한다. 단, 이 지점이
    // 애초에 최상위(path가 빈 배열)라면 patch할 "안쪽"이 없으므로 분해 자체가 불가능.
    if (!path.length) return false;
    ops.push({ path, value: newVal });
    return true;
  }
  // 서버에 kv_apply_patch 함수가 없으면(아직 SQL을 안 올린 프로젝트) 매번 헛되이
  // 시도하지 않도록, 한 번 "없다"고 확인되면 그 이후로는 시도 자체를 건너뛴다.
  let _kvPatchRpcAvailable = true;
  async function _tryPatchPush(key, value, expected, newTs) {
    if (!cloud || !_kvPatchRpcAvailable || !expected) return null;
    if (value.length < KV_PATCH_MIN_SIZE) return null;
    if (typeof _knownServerValue[key] !== "string") return null;
    let oldParsed, newParsed;
    try {
      oldParsed = JSON.parse(_knownServerValue[key]);
      newParsed = JSON.parse(value);
    } catch (e) { return null; } // JSON이 아니면 patch를 시도하지 않고 통째로 저장
    const ops = [];
    if (!_diffToOps(oldParsed, newParsed, [], ops) || !ops.length) return null;
    try {
      const { data, error } = await cloud.rpc("kv_apply_patch", {
        p_key: key, p_ops: ops, p_new_updated_at: newTs, p_expected_updated_at: expected,
      });
      if (error) {
        // 42883 = "함수가 없음"(undefined_function) — 아직 SQL을 안 올린 경우이므로
        // 이후엔 더 시도하지 않고 곧장 기존 방식으로만 동작한다.
        if (error.code === "42883" || /function .* does not exist/i.test(error.message || "")) _kvPatchRpcAvailable = false;
        return null;
      }
      const row = Array.isArray(data) ? data[0] : data;
      return row ? { applied: !!row.applied } : null;
    } catch (e) { return null; }
  }

  // ==================== 클라우드 동기화 런타임: 실시간 변경 반영, 충돌 배너 UI, 실제 push/pull(cloudPush/cloudHydrate), 실시간 구독 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

  const CLOUD_KEY_LABELS = [
    ["personal-schedule:data", "월별 스케줄"],
    ["personal-qa:data", "품질 관리(QA)"],
    ["personal-interviews:data", "면담일지"],
    ["personal-agents:data", "상담사 관리"],
    ["personal-notes:data", "업무 정리(메모)"],
    ["personal-calendar:todos", "캘린더/할일"],
    ["personal-monthclose:data", "월마감 확인"],
    ["personal-app:accounts", "계정 목록"],
    ["personal-app:discord-notify-settings", "디스코드 알림 설정"],
  ];
  function cloudKeyLabel(key) {
    const found = CLOUD_KEY_LABELS.find(([frag]) => key.indexOf(frag) !== -1);
    return found ? found[1] : "데이터";
  }

  /* ---- 실시간 변경 사항을 "지금 이 화면이 들고 있는 메모리"에 곧바로 반영하기.
     각 화면(모듈)은 localStorage에서 한 번 읽어들인 값을 자바스크립트 변수(interviewsData,
     notesData 등)에 담아두고 그걸로 화면을 그린다. 그래서 남이 저장한 내용이 localStorage에만
     반영되고 이 변수들을 다시 안 읽어오면, 다른 화면 갔다가 돌아와도 여전히 예전 내용이 보인다.
     아래 함수는 바뀐 key에 맞는 모듈 변수를 즉시 다시 읽어들이고, 그 데이터를 사용하는
     화면 이름들을 돌려준다 — "지금 보고 있는 화면"이 그 목록에 있을 때만 그 자리에서
     다시 그려줄지 말지를 판단하는 데 쓴다. */
  function _monthDataKeyMatch(key) {
    const m = key.match(/personal-calendar:(\d{4})-(\d{2})$/);
    if (!m) return null;
    return { year: Number(m[1]), monthIndex: Number(m[2]) - 1 };
  }
  function _applyRemoteChangeToMemory(key) {
    if (key.indexOf("personal-calendar:todos") !== -1) {
      todos = loadTodos();
      return ["calendar", "home"];
    }
    const monthMatch = _monthDataKeyMatch(key);
    if (monthMatch) {
      // 지금 화면에 열려 있는 달과 같을 때만 그 자리에서 다시 읽어들인다(다른 달 데이터는
      // 어차피 화면에 안 보이니 나중에 그 달로 이동할 때 자연스럽게 새로 읽힌다).
      if (cal.year === monthMatch.year && cal.monthIndex === monthMatch.monthIndex) loadMonth(cal.year, cal.monthIndex);
      return ["calendar", "home"];
    }
    if (key.indexOf("personal-notes:data") !== -1) {
      undoRestoreObjectInPlace(notesData, loadNotesData());
      return ["notes", "home"];
    }
    if (key.indexOf("personal-agents:data") !== -1) {
      agentsData = loadAgentsData();
      return ["agents", "home", "interviews", "schedule", "qa"];
    }
    if (key.indexOf("personal-qa:data") !== -1) {
      qaData = loadQAData();
      return ["qa"];
    }
    if (key.indexOf("personal-interviews:data") !== -1) {
      interviewsData = loadInterviewsData();
      return ["interviews", "home"];
    }
    if (key.indexOf("personal-schedule:data") !== -1) {
      reloadScheduleData();
      return ["schedule", "home"];
    }
    if (key.indexOf("personal-monthclose:data") !== -1) {
      monthCloseData = loadMonthCloseData();
      return ["home"];
    }
    return [];
  }
  // 지금 어딘가에 글자를 입력 중인지(텍스트칸에 커서가 가 있는지) 확인한다. 입력 중일 때
  // 화면을 억지로 다시 그리면 커서 위치나 아직 저장 안 된 입력 내용이 날아갈 수 있어서,
  // 그럴 때는 그 자리에서 바로 반영하지 않고 예전처럼 "새로고침" 배너로만 알린다.
  // 예외: 하단 내비게이션의 "이름 통합 검색"(#global-search-root 안, #gs-input)은
  // renderApp()이 다시 그리는 #page-inner 밖에 따로 떠 있고, 그 자체 로직도 renderApp()과
  // 무관하게 매번 자기 결과 패널만 갱신하도록 만들어져 있어서(13-global-search.js 상단 주석
  // 참고) — renderApp()이 실행돼도 이 입력창의 값이나 커서는 전혀 건드리지 않는다. 그런데도
  // 이 검사에 포함시키면, 검색창에 커서만 가 있어도(실제로는 아무 데이터도 편집 중이 아닌데)
  // 다른 사람이 전혀 무관한 걸 저장할 때마다 "다른 관리자가 방금 수정했어요" 배너가 매번
  // 떠서, 마치 같은 항목을 동시에 고친 것처럼 잘못 보이는 문제가 있었다. 그래서 이 검색창은
  // "편집 중"으로 치지 않는다.
  function _hasActiveEditableFocus() {
    const el = document.activeElement;
    if (!el) return false;
    if (el.id === "gs-input") return false;
    // 목록 화면의 검색/필터 입력칸(면담일지 "상담사 이름 또는 LDAP 검색", 상담사 관리
    // 검색 등)도 위 gs-input과 똑같은 이유로 예외 처리한다: 이 칸에 값이 있어도 그건
    // interviewsUi.searchQuery 같은 상태값에 그대로 남아있고 다시 그릴 때도 그 값 그대로
    // 복원되므로, 화면을 다시 그린다고 해서 "입력 중이던 내용"이 사라지지 않는다. 이런
    // 칸에 커서만 가 있어도 무관한 저장 때마다 마치 편집 중인 것처럼 취급되는 걸 막는다.
    if (el.classList && el.classList.contains("agent-search-input-field")) return false;
    return el.tagName === "TEXTAREA" || el.tagName === "INPUT" || !!el.isContentEditable;
  }
  // 지금 이 브라우저 탭이 실제로 화면에 보이고 있는지. 탭을 다른 곳으로 전환해도
  // document.activeElement는 그대로 남아있어서(포커스가 자동으로 풀리지 않음),
  // 백그라운드 탭에 있는 동안 들어온 변경까지 "지금 입력 중"으로 오판해 팝업을
  // 만들어버리는 문제가 있었다. 화면이 실제로 보이는 상태인지까지 함께 확인해서,
  // 안 보이는 동안 생긴 변경은 조용히 메모리에만 반영하고 팝업 없이 넘어가게 한다.
  function _isTabVisible() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  /* ---- 배너 UI: "남이 방금 고쳤어요" / "저장 충돌" 을 화면 위쪽에 띄운다.
     화면을 그 자리에서 억지로 다시 그리면 입력 중이던 내용이 튈 수 있어서,
     실제 반영은 사용자가 버튼을 눌러 새로고침할 때만 이뤄지게 한다. */
  function _liveBannerWrap() {
    let el = document.getElementById("cloud-live-banner-wrap");
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-live-banner-wrap";
      el.className = "cloud-live-banner-wrap";
      document.body.appendChild(el);
    }
    return el;
  }
  function _renderConflictBanner() {
    let el = document.getElementById("cloud-conflict-banner");
    if (!_conflictedKeys.size) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-conflict-banner";
      el.className = "cloud-live-banner conflict";
      _liveBannerWrap().prepend(el);
    }
    const labels = Array.from(_conflictedKeys).map(cloudKeyLabel).join(", ");
    el.innerHTML = `
      ${ICON_BELL}
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">저장 충돌</div>
        <div class="cloud-live-banner-desc"><b>${esc(labels)}</b>의 같은 항목을 다른 관리자(또는 다른 탭)가 거의 같은 순간에 고쳐서, 자동으로 합칠 수 없었어요.<br>내가 방금 한 변경이 아직 저장되지 못했어요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="ghost-btn" id="cloud-conflict-reload">최신 내용 불러오기</button>
          <button type="button" class="primary-btn" id="cloud-conflict-force">내 변경으로 덮어쓰기</button>
        </div>
      </div>
    `;
    document.getElementById("cloud-conflict-reload").onclick = () => location.reload();
    document.getElementById("cloud-conflict-force").onclick = async () => {
      const keys = Array.from(_conflictedKeys);
      _conflictedKeys.clear();
      _renderConflictBanner();
      for (const k of keys) {
        try { await cloudPush(k, localStorage.getItem(k), { force: true }); } catch (e) {}
      }
    };
  }
  // 예전에는 여기에 "다른 관리자가 방금 수정했어요"라는 배너가 하나 더 있었다. 그런데
  // 이 배너는 "지금 이 화면과 관련된 데이터가 바뀌었고, 마침 내가 뭔가 입력 중이었다"는
  // 것만 볼 뿐 실제로 내가 지금 만지고 있는 항목·필드와 겹쳤는지는 전혀 확인하지
  // 않았다. 그래서 완전히 무관한 항목이 추가/수정돼도(예: 다른 상담사의 면담 기록을
  // 새로 추가) 화면 아무 입력칸에 커서만 가 있으면(심지어 검색창이거나, 다른 브라우저
  // 탭으로 넘어가기 전에 마지막으로 커서를 뒀던 칸이어도) 마치 뭔가 겹친 것처럼
  // 떠버렸다. 진짜로 같은 항목의 같은 필드를 동시에 고쳤는지는 저장 시점의 3-way
  // 병합(_merge3)이 훨씬 정확하게 판단할 수 있으므로, 이 추측성 배너는 없앴다.
  // 대신 원격 변경은 아래 실시간 구독 핸들러에서 메모리(및 로컬 저장소)에는 항상
  // 즉시 반영해두고, 화면을 다시 그리는 것만 "지금 입력 중이 아닐 때"로 미룬다 —
  // 편집을 마치고 저장하면 그 시점에 자동 병합/충돌 감지가 실제로 겹친 부분만
  // 정확히 짚어서 알려준다(_renderFieldConflictBanner, _renderConflictBanner).
  // "저장은 정상적으로 진행됐지만, 그중 일부 지점만 다른 관리자와 겹쳐서 내가 방금
  // 저장한 값으로 정했어요"를 알려주는 가벼운 배너. _renderConflictBanner(저장 충돌)와
  // 달리 저장을 막지 않으며, 확인 버튼을 누르면 그냥 사라진다.
  function _renderFieldConflictBanner() {
    let el = document.getElementById("cloud-field-conflict-banner");
    if (!_fieldConflictNotices.size) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-field-conflict-banner";
      el.className = "cloud-live-banner";
      _liveBannerWrap().appendChild(el);
    }
    const labels = Array.from(new Set(Array.from(_fieldConflictNotices.keys()).map(cloudKeyLabel))).join(", ");
    const spotCount = Array.from(_fieldConflictNotices.values()).reduce((sum, s) => sum + s.size, 0);
    el.innerHTML = `
      ${ICON_BELL}
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">일부 항목이 거의 동시에 수정됐어요</div>
        <div class="cloud-live-banner-desc"><b>${esc(labels)}</b>에서 ${spotCount}곳을 다른 관리자(또는 다른 탭)와 겹쳐서 고쳤어요.<br>겹치지 않은 나머지 변경은 자동으로 함께 합쳐 저장했고, 겹친 부분만 방금 내가 저장한 값으로 반영됐어요.<br>혹시 다른 관리자가 그 부분을 다르게 고치려던 거였다면 다시 확인해 주세요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="primary-btn" id="cloud-field-conflict-dismiss">확인</button>
        </div>
      </div>
      <button type="button" class="cloud-live-banner-close" id="cloud-field-conflict-close" aria-label="닫기">✕</button>
    `;
    const dismiss = () => { _fieldConflictNotices.clear(); _renderFieldConflictBanner(); };
    document.getElementById("cloud-field-conflict-dismiss").onclick = dismiss;
    document.getElementById("cloud-field-conflict-close").onclick = dismiss;
  }

  async function _doCloudPush(key, value, opts) {
    const force = !!(opts && opts.force);
    const attempt = (opts && opts.attempt) || 0;
    try {
      const newTs = new Date().toISOString();
      const expected = _knownServerUpdatedAt[key];
      let wroteOk = true;
      let handledByPatch = false;
      if (expected && !force) {
        const patched = await _tryPatchPush(key, value, expected, newTs);
        if (patched) { wroteOk = patched.applied; handledByPatch = true; }
      }
      if (!handledByPatch) {
        if (expected && !force) {
          // 낙관적 동시성 제어: 마지막으로 확인한 서버 버전이 그대로일 때만 저장한다.
          // 그 사이 다른 사람이 먼저 저장해서 updated_at이 바뀌었으면 이 update는
          // 아무 행도 바꾸지 못하고 0건으로 끝난다 → 그걸로 충돌을 감지한다.
          const { data, error } = await cloud
            .from("kv_store")
            .update({ value, updated_at: newTs })
            .eq("key", key)
            .eq("updated_at", expected)
            .select("key");
          if (error) throw error;
          wroteOk = !!(data && data.length);
        } else {
          await cloud.from("kv_store").upsert({ key, value, updated_at: newTs });
        }
      }
      if (!wroteOk) {
        // 곧바로 팝업을 띄우지 않고, 먼저 자동으로 합쳐볼 수 있는지 시도한다. 서로 다른
        // 항목을 고친 경우가 대부분이라 여기서 대부분 조용히 해결된다(최대 3번 재시도).
        if (attempt < 3) {
          const merged = await _tryAutoMergeConflict(key, value);
          if (merged !== null) return _doCloudPush(key, merged, { force: false, attempt: attempt + 1 });
        }
        _conflictedKeys.add(key);
        _renderConflictBanner();
        notifyCloudSyncSettle(false);
        return;
      }
      _conflictedKeys.delete(key);
      _renderConflictBanner();
      _knownServerUpdatedAt[key] = newTs;
      _knownServerValue[key] = value;
      _ourWriteTimestamps[key] = newTs;
      notifyCloudSyncSettle(true);
    } catch (e) {
      /* 네트워크 문제로 실패해도 로컬 저장은 이미 되어 있어 화면은 그대로 동작 */
      notifyCloudSyncSettle(false);
    }
  }
  function cloudPush(key, value, opts) {
    if (!isCloudSynced(key)) return Promise.resolve();
    notifyCloudSyncStart();
    const force = !!(opts && opts.force);
    const prev = _pushChains[key] || Promise.resolve();
    const run = prev.then(
      () => _doCloudPush(key, value, { force }),
      () => _doCloudPush(key, value, { force })
    );
    _pushChains[key] = run.catch(() => {});
    return _trackCloudWrite(run);
  }
  async function _doCloudDelete(key) {
    try {
      await cloud.from("kv_store").delete().eq("key", key);
      delete _knownServerUpdatedAt[key];
      delete _knownServerValue[key];
      _conflictedKeys.delete(key);
      _renderConflictBanner();
      notifyCloudSyncSettle(true);
    } catch (e) { notifyCloudSyncSettle(false); }
  }
  function cloudDelete(key) {
    if (!isCloudSynced(key)) return Promise.resolve();
    notifyCloudSyncStart();
    const prev = _pushChains[key] || Promise.resolve();
    const run = prev.then(() => _doCloudDelete(key), () => _doCloudDelete(key));
    _pushChains[key] = run.catch(() => {});
    return _trackCloudWrite(run);
  }
  // localStorage.setItem / removeItem을 감싸기 전에 먼저 원본 함수를 바인딩해둔다.
  // cloudHydrate()가 클라우드에서 값을 끌어올 때 이 "원본" 함수로 직접 저장해야,
  // 방금 받아온 값을 다시 클라우드로 그대로 되쏘는(불필요한 업서트 + 페이지를 열 때마다
  // "동기화 중…" 토스트가 잠깐 뜨는) 낭비를 막을 수 있다.
  const _origSetItem = localStorage.setItem.bind(localStorage);
  const _origRemoveItem = localStorage.removeItem.bind(localStorage);
  async function cloudHydrate() {
    if (!cloud) return;
    try {
      const { data, error } = await cloud.from("kv_store").select("key,value,updated_at");
      if (error || !data) return;
      data.forEach((row) => {
        try { _origSetItem(row.key, row.value); } catch (e) {}
        _knownServerUpdatedAt[row.key] = row.updated_at;
        _knownServerValue[row.key] = row.value;
      });
    } catch (e) { /* 오프라인 등으로 실패하면 이전에 이 브라우저에 남아있던 값으로 동작 */ }
  }
  // localStorage.setItem / removeItem을 감싸서, 로컬 저장은 그대로 즉시 처리하고
  // 필요한 키만 조용히 Supabase에도 함께 저장/삭제한다 (실패해도 화면엔 영향 없음).
  localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    cloudPush(key, value);
  };
  localStorage.removeItem = function (key) {
    _origRemoveItem(key);
    cloudDelete(key);
  };
  // 이 업데이트(Supabase Auth 전환) 이전부터 로그인 상태가 유지되던 브라우저는
  // 이 앱 자체의 로그인 세션(SESSION_KEY)은 남아있어도 Supabase Auth 세션은
  // 아직 없다. 그 상태로 두면 화면은 "로그인됨"으로 보이는데 kv_store 읽기/
  // 쓰기는 전부 막혀서(RLS가 authenticated만 허용) 데이터가 안 보이거나 저장이
  // 계속 실패하는 것처럼 보이므로, 이 경우엔 로그인 화면으로 돌려보내
  // 한 번 더 로그인하게 한다(그 로그인 과정에서 Supabase Auth 세션도 함께
  // 만들어진다).
  if (cloud && getSession()) {
    try {
      const { data } = await cloud.auth.getSession();
      if (!data || !data.session) {
        clearSession();
        clearMasterOrigin();
        clearTeamLoginMember();
      }
    } catch (e) {}
  }
  await cloudHydrate();
  // 이 자동 백업은 실제로 데이터를 저장(쓰기)하는 작업이라 로그인 전(anon)에는
  // 애초에 성공할 수 없다. 예전엔 로그인 여부와 상관없이 여기서 바로 시도해서,
  // 로그인 화면 단계에서도 매번 조용히(화면엔 안 보이지만 콘솔에는 401로) 실패하고
  // 있었다 — 실제 로그인한 뒤(js/01j-session-boot.js)로 옮겨서 그 낭비를 없앤다.

  /* ---- 실시간 구독: 다른 사람(또는 다른 탭)이 저장하면 곧바로 반영한다.
     - 우선 로컬 저장소(localStorage)에도 최신 값을 바로 써둔다. 이렇게 해야 지금 다른
       화면을 보고 있다가 나중에 그 화면으로 돌아왔을 때(또는 그 모듈이 새로 데이터를
       읽어들일 때) 새로고침 없이도 최신 내용이 보인다.
     - 그 다음 해당 데이터를 들고 있는 모듈의 메모리 변수도 즉시 다시 읽어들인다.
     - "지금 보고 있는 화면"이 바로 그 데이터를 쓰는 화면이라면: 입력 중인 칸이 없을 때는
       그 자리에서 곧장 다시 그려서 보여주고, 입력 중인 칸이 있을 때는(화면을 억지로 다시
       그리면 커서/미저장 입력이 튈 수 있으므로) 예전처럼 "바뀌었어요 + 새로고침" 배너로만
       알린다. 지금 보고 있는 화면과 무관한 데이터라면 이미 메모리에 반영해뒀으니 배너 없이
       조용히 넘어간다. 내가 방금 보낸 저장이 그대로 돌아온 경우(에코)는 제외한다. */
  if (cloud) {
    cloud
      .channel("kv_store_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kv_store" },
        (payload) => {
          if (!_appBooted) return; // 로그인 화면 등 앱이 아직 초기화되기 전에는 안전하게 무시
          const row = payload.new && payload.new.key ? payload.new : payload.old;
          if (!row || !row.key || !isCloudSynced(row.key)) return;
          if (payload.eventType === "DELETE") {
            delete _knownServerUpdatedAt[row.key];
            delete _knownServerValue[row.key];
            return;
          }
          if (_ourWriteTimestamps[row.key] === row.updated_at) return; // 내가 방금 쓴 것의 에코
          _knownServerUpdatedAt[row.key] = row.updated_at;
          _knownServerValue[row.key] = row.value;
          if (localStorage.getItem(row.key) === row.value) return; // 이미 같은 내용이면 반영할 필요 없음
          _origSetItem(row.key, row.value); // 로컬 저장소에는 언제나 즉시 최신 내용 반영 (탭이 안 보이는 동안에도 마찬가지)
          let affectedPages = [];
          try { affectedPages = _applyRemoteChangeToMemory(row.key); } catch (e) {}
          const isCurrentPageAffected = affectedPages.indexOf(state.page) !== -1;
          // 화면(그림)을 다시 그리는 것만 "지금 이 탭이 실제로 보이고 있고 + 뭔가
          // 입력 중인 칸에 커서가 가 있지 않을 때"로 미룬다. 데이터 자체(메모리·로컬
          // 저장소)는 위에서 이미 최신 상태로 반영해뒀으니, 지금 당장 다시 그리지
          // 않아도 잃어버리는 내용은 없다 — 나중에 화면이 다시 그려질 때(탭으로
          // 돌아오거나, 입력을 마치거나, 다른 조작으로 renderApp이 호출될 때) 자동으로
          // 최신 내용이 보인다. 겹쳤는지 여부를 추측해서 알리는 배너는 띄우지 않는다:
          // 진짜로 같은 항목·같은 필드가 겹친 경우는 저장 시점의 3-way 병합이 정확하게
          // 잡아내서 _renderFieldConflictBanner / _renderConflictBanner로 알려준다.
          if (isCurrentPageAffected && !_hasActiveEditableFocus() && _isTabVisible()) {
            renderApp();
          }
        }
      )
      .subscribe();
  }
  // 탭이 백그라운드에 있는 동안에도 데이터(메모리·로컬 저장소)는 이미 최신으로
  // 반영해뒀지만, 화면을 다시 그리는 것만 미뤄뒀을 수 있다. 탭이 다시 보이게 되거나
  // 입력 중이던 칸에서 포커스가 빠지면, 지금 화면이 안전하게 다시 그릴 수 있는
  // 상태인지 확인해서 최신 내용으로 갱신한다 — 그래야 "다른 탭 보고 오니 화면이
  // 예전 내용"인 채로 남아있는 일이 없다. 배너 없이 조용히 갱신만 한다.
  function _catchUpRenderIfSafe() {
    if (!_appBooted) return; // 로그인 화면에서는 아직 renderApp()이 참조하는 값들이 없으므로 건너뜀
    if (!_isTabVisible() || _hasActiveEditableFocus()) return;
    try { renderApp(); } catch (e) {}
  }
  document.addEventListener("visibilitychange", _catchUpRenderIfSafe);
  window.addEventListener("focus", _catchUpRenderIfSafe);

  // ==================== 되돌리기(Undo), 테마, 좌측 내비게이션 독 열고 닫기, 설정 토글 버튼 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

  /* ===================== ↩️ 실행 취소(Undo) =====================
     스케줄 셀 상태 변경 · 일괄 적용 · 일괄 붙여넣기 · 일괄 삭제, 그리고 메모·폴더·
     상담사·면담일지·할일·캘린더 일정의 "삭제"처럼 되돌리기 어려운 조작을 하기 직전에
     관련 localStorage 값을 스냅샷으로 남겨두고, Ctrl+Z(맥은 Cmd+Z) 또는 화면 오른쪽
     아래 "되돌리기" 버튼으로 바로 직전 동작 하나를 되돌릴 수 있게 한다. 최근 30개까지
     기억한다. 메모 본문·셀 메모처럼 계속 타이핑하는 값은 스냅샷을 남기지 않는다 —
     글자 하나하나가 되돌리기 대상이 되면 오히려 불편하기 때문이다. */
  const UNDO_STACK_LIMIT = 30;
  const undoStack = [];
  // const로 선언된 state 객체(notesData 등)는 재할당할 수 없으니, 내용을 비우고
  // 새로 불러온 값으로 다시 채워 넣는 방식으로 복원한다.
  function undoRestoreObjectInPlace(obj, fresh) {
    Object.keys(obj).forEach((k) => delete obj[k]);
    Object.assign(obj, fresh);
  }
  function undoSnapshotKeys(keys) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) => {
      let value = null;
      try { value = localStorage.getItem(key); } catch (e) {}
      return { key, value };
    });
  }
  // label: 되돌리기 버튼/토스트에 보여줄 동작 이름.
  // keys: 이 동작으로 바뀌는 localStorage 키(문자열 하나 또는 배열).
  // reloadFn: 스냅샷을 localStorage에 되돌려놓은 뒤, 화면이 참조하는 메모리상의
  //           state 변수(scheduleData, notesData 등)를 다시 읽어들이는 함수.
  function recordUndo(label, keys, reloadFn) {
    undoStack.push({ label, snaps: undoSnapshotKeys(keys), reloadFn });
    if (undoStack.length > UNDO_STACK_LIMIT) undoStack.shift();
    renderUndoToggle();
  }
  function performUndo() {
    const entry = undoStack.pop();
    if (!entry) { renderUndoToggle(); flashUndoToast("되돌릴 작업이 없어요", true); return; }
    entry.snaps.forEach(({ key, value }) => {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch (e) {}
    });
    entry.reloadFn();
    renderApp();
    flashUndoToast(`"${entry.label}" 되돌림`);
  }
  let undoToastHideTimer = null;
  function flashUndoToast(msg, isEmpty) {
    const el = document.getElementById("undo-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("undo-toast--empty", !!isEmpty);
    el.classList.add("visible");
    clearTimeout(undoToastHideTimer);
    undoToastHideTimer = setTimeout(() => el.classList.remove("visible"), 2200);
  }
  // 입력창에 포커스가 있을 때는 브라우저 기본 Ctrl+Z(텍스트 입력 취소)를 그대로 두고,
  // 그 외의 경우에만 앱의 되돌리기를 실행한다.
  document.addEventListener("keydown", (e) => {
    const k = e.key ? e.key.toLowerCase() : "";
    if (k !== "z" || !(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
    const active = document.activeElement;
    const tag = (active && active.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable)) return;
    e.preventDefault();
    performUndo();
  });
  // 되돌리기 버튼: 테마·사용설명서 버튼과 같은 자리, 그 위에 항상 떠 있다.
  function renderUndoToggle() {
    const root = document.getElementById("undo-toggle-root");
    if (!root) return;
    const has = undoStack.length > 0;
    const lastLabel = has ? undoStack[undoStack.length - 1].label : "";
    root.innerHTML = `
      <div class="undo-toggle-wrap">
        <button class="theme-picker-btn" id="nav-undo-toggle" type="button" ${has ? "" : "disabled"}
          aria-label="되돌리기" title="${has ? `되돌리기 — ${esc(lastLabel)} (Ctrl+Z)` : "되돌릴 작업이 없어요"}">
          ${ICON_UNDO}<span class="theme-picker-label">되돌리기</span>
        </button>
      </div>
      <div class="undo-toast" id="undo-toast"></div>
    `;
    const btn = document.getElementById("nav-undo-toggle");
    if (btn) btn.onclick = () => performUndo();
  }

  /* ===================== 테마(다크/라이트/그레이/파스텔) ===================== */
  const THEME_KEY = "app-theme-mode";
  // 각 테마의 미리보기용 색(배경/포인트색)과 라벨. CSS의 실제 변수값과 맞춰서 관리한다.
  const THEME_LIST = [
    { id: "dark", label: "다크", bg: "#232327", accent: "#ec6fae" },
    { id: "light", label: "라이트", bg: "#fcfcfd", accent: "#7c5cd1" },
  ];
  function themeMeta(id) { return THEME_LIST.find((t) => t.id === id) || THEME_LIST[0]; }
  function isValidTheme(id) { return THEME_LIST.some((t) => t.id === id); }
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(mode) {
    if (!mode || mode === "dark") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
  }
  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  function setTheme(mode) {
    applyTheme(mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) { /* 저장 실패해도 화면 전환은 그대로 동작 */ }
    renderNav();
  }
  applyTheme(isValidTheme(getStoredTheme()) ? getStoredTheme() : "dark");

  /* ===================== 데스크톱 독(Dock) 펼치기/닫기 =====================
     독 안에는 메뉴 카테고리(#nav) 말고도 전역 검색 바(#global-search-root)가
     카테고리 바로 위에 함께 들어있으므로, 펼치기/접기 대상은 그 둘을 함께
     감싸는 #nav-dock 전체다. */
  function isDockOpen() {
    const navDock = document.getElementById("nav-dock");
    return !!(navDock && navDock.classList.contains("dock-open"));
  }
  function dockOutsideHandler(e) {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock && !navDock.contains(e.target) && !(btn && btn.contains(e.target))) closeDock();
  }
  function openDock() {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock) navDock.classList.add("dock-open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); btn.title = "메뉴 닫기"; btn.setAttribute("aria-label", "메뉴 닫기"); }
    setTimeout(() => document.addEventListener("mousedown", dockOutsideHandler, true), 0);
  }
  function closeDock() {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock) navDock.classList.remove("dock-open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.title = "메뉴 열기"; btn.setAttribute("aria-label", "메뉴 열기"); }
    document.removeEventListener("mousedown", dockOutsideHandler, true);
    // 독 안에는 전역 검색창도 함께 들어있으므로, 독을 닫을 때 검색했던 내용도
    // 남아있지 않고 초기화되게 한다.
    if (typeof resetGlobalSearchQuery === "function") resetGlobalSearchQuery();
  }
  function toggleDock() {
    if (isDockOpen()) closeDock(); else openDock();
  }
  const dockToggleBtn = document.getElementById("dock-toggle-btn");
  if (dockToggleBtn) {
    dockToggleBtn.onclick = (e) => { e.stopPropagation(); toggleDock(); };
  }

  /* ===================== 오른쪽 하단 유틸리티 독(다크·사용설명서·백업·되돌리기·새로고침) 접기/펼치기 =====================
     평소엔 펼치기 버튼만 보이고, 눌러야 5개 항목이 위로 펼쳐진다.
     다른 곳을 클릭하면 자동으로 다시 접힌다. */
  function isUtilityDockOpen() {
    const root = document.getElementById("utility-dock-root");
    return !!(root && root.classList.contains("open"));
  }
  function utilityDockOutsideHandler(e) {
    const root = document.getElementById("utility-dock-root");
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu && settingsMenu.contains(e.target)) return; // 설정 목록 팝업 클릭은 독을 접지 않는다
    if (root && !root.contains(e.target)) closeUtilityDock();
  }
  function openUtilityDock() {
    const root = document.getElementById("utility-dock-root");
    const btn = document.getElementById("utility-dock-toggle-btn");
    if (root) root.classList.add("open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); btn.title = "바로가기 메뉴 닫기"; btn.setAttribute("aria-label", "바로가기 메뉴 닫기"); }
    setTimeout(() => document.addEventListener("mousedown", utilityDockOutsideHandler, true), 0);
  }
  function closeUtilityDock() {
    const root = document.getElementById("utility-dock-root");
    const btn = document.getElementById("utility-dock-toggle-btn");
    if (root) root.classList.remove("open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.title = "바로가기 메뉴 열기"; btn.setAttribute("aria-label", "바로가기 메뉴 열기"); }
    document.removeEventListener("mousedown", utilityDockOutsideHandler, true);
  }
  function toggleUtilityDock() {
    if (isUtilityDockOpen()) closeUtilityDock(); else openUtilityDock();
  }
  const utilityDockToggleBtn = document.getElementById("utility-dock-toggle-btn");
  if (utilityDockToggleBtn) {
    utilityDockToggleBtn.onclick = (e) => { e.stopPropagation(); toggleUtilityDock(); };
  }

  // 일정/할일 알림을 공지하는 디스코드 서버 초대 링크. 만료되지 않는 링크로 만들어두면 됨.
  // (실제 알림 발송은 이 사이트가 아니라 Supabase Edge Function + pg_cron이 처리하고,
  //  여기서는 그 알림이 올라오는 서버로 바로 이동할 수 있는 버튼만 설정 메뉴 안에 보여준다.)
  const DISCORD_INVITE_URL = "https://discord.gg/QFpBnYMp4";

  // 설정 버튼: 예전에는 테마·사용설명서·데이터 백업이 각각 독립된 버튼으로 오른쪽 아래에
  // 따로따로 쌓여 있었는데, 항목이 많아질수록 화면이 복잡해 보여서(특히 모바일) 이 세 가지를
  // "설정" 버튼 하나로 묶고, 그 안에서 목록으로 고르게 했다. 새로고침·되돌리기는 사용 빈도가
  // 높아 그대로 독립 버튼으로 남겨둔다.
  function renderSettingsToggle() {
    const root = document.getElementById("settings-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-settings-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="설정 메뉴 열기" title="설정 (테마 · 사용설명서 · 데이터 백업)">
          ${ICON_SETTINGS}
          <span class="theme-picker-label">설정</span>
        </button>
      </div>
    `;
    const settingsBtn = document.getElementById("nav-settings-toggle");
    if (settingsBtn) {
      settingsBtn.onclick = (e) => {
        e.stopPropagation();
        if (document.getElementById("settings-menu")) { closeSettingsMenu(); return; }
        openSettingsMenu(settingsBtn);
      };
    }
  }

  /* ===================== 데이터 백업/복원 =====================
     상담사 정보 · 스케줄 · 면담일지 · QA 점수 · 메모 · 캘린더처럼
     "acct:{계정id}:" 접두어가 붙어 저장되는 이 계정 소유의 데이터를
     JSON 파일로 내보내고 다시 불러올 수 있게 한다.
     가져오기는 파일 안에 어떤 계정 이름이 적혀 있었든 상관없이 항상
     "지금 로그인한 계정"의 접두어로 다시 저장한다 — 그래야 다른 계정에서
     내보낸 백업이라도 가져오는 즉시 지금 계정 소유가 되고, 다른 계정의
     데이터에는 절대 영향을 주지 않는다. */

  // ==================== 데이터 백업/복원(수동 다운로드·업로드), 일별 자동 백업 및 정리 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  const BACKUP_CATEGORIES = [
    { key: "calendar", label: "캘린더 · 할 일", icon: ICON_CALENDAR, keyPrefixes: ["personal-calendar:"] },
    { key: "notes", label: "업무 정리(메모)", icon: ICON_NOTE, keyPrefixes: ["personal-notes:"] },
    { key: "agents", label: "상담사 관리", icon: ICON_USERS, keyPrefixes: ["personal-agents:"] },
    { key: "interviews", label: "면담일지", icon: ICON_CLIPBOARD, keyPrefixes: ["personal-interviews:"] },
    { key: "qa", label: "품질 관리(QA)", icon: ICON_QA, keyPrefixes: ["personal-qa:"] },
    { key: "schedule", label: "월별 스케줄", icon: ICON_CHART, keyPrefixes: ["personal-schedule:"] },
  ];
  function backupAllPrefixes() {
    return BACKUP_CATEGORIES.reduce((acc, c) => acc.concat(c.keyPrefixes), []);
  }
  // 지금 로그인한 계정 소유의 키만 모아서, "acct:{id}:" 접두어를 뗀 상대 키 기준으로 돌려준다.
  function collectAccountStorageEntries(prefixFilter) {
    const acctPrefix = `acct:${CURRENT_ACCOUNT_ID}:`;
    const entries = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(acctPrefix) !== 0) continue;
        const rel = k.slice(acctPrefix.length);
        if (prefixFilter && !prefixFilter.some((p) => rel.indexOf(p) === 0)) continue;
        const v = localStorage.getItem(k);
        if (v !== null) entries[rel] = v;
      }
    } catch (e) { /* localStorage 접근 실패 시 빈 결과로 진행 */ }
    return entries;
  }
  function buildBackupPayload(categoryKey) {
    const cat = categoryKey === "all" ? null : BACKUP_CATEGORIES.find((c) => c.key === categoryKey);
    const entries = collectAccountStorageEntries(cat ? cat.keyPrefixes : backupAllPrefixes());
    return {
      app: "업무 종합 관리",
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      accountName: CURRENT_ACCOUNT_NAME,
      category: categoryKey,
      categoryLabel: cat ? cat.label : "전체 데이터",
      data: entries,
    };
  }
  function backupFilenameStamp() {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}`;
  }
  function sanitizeFilenamePart(s) {
    return String(s).replace(/[\\/:*?"<>|]/g, "_");
  }
  function downloadBackup(categoryKey) {
    const payload = buildBackupPayload(categoryKey);
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `백업_${sanitizeFilenamePart(CURRENT_ACCOUNT_NAME)}_${sanitizeFilenamePart(payload.categoryLabel)}_${backupFilenameStamp()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashBackupStatus(`"${payload.categoryLabel}" 백업 파일을 내려받았어요.`);
  }
  function readBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(JSON.parse(reader.result)); }
        catch (e) { reject(e); }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, "utf-8");
    });
  }
  // restrictCategory가 있으면 그 카테고리에 속한 키만 반영하고(다른 카테고리 값은
  // 파일 안에 섞여 있어도 무시), 없으면(=전체 가져오기) 알려진 모든 카테고리의
  // 키를 반영한다. 백업 파일에 적힌 계정 이름 등은 참고용일 뿐 저장에는 쓰지
  // 않고, 항상 "지금 로그인한 계정" 접두어로만 써서 다른 계정에는 영향이 없다.
  async function applyBackupPayload(payload, restrictCategory) {
    if (!payload || typeof payload !== "object" || !payload.data || typeof payload.data !== "object") {
      return { ok: false, reason: "올바른 백업 파일이 아니에요." };
    }
    const allowedPrefixes = restrictCategory
      ? ((BACKUP_CATEGORIES.find((c) => c.key === restrictCategory) || {}).keyPrefixes || [])
      : backupAllPrefixes();
    const acctPrefix = `acct:${CURRENT_ACCOUNT_ID}:`;
    let count = 0;
    Object.keys(payload.data).forEach((relKey) => {
      if (!allowedPrefixes.some((p) => relKey.indexOf(p) === 0)) return;
      const value = payload.data[relKey];
      if (typeof value !== "string") return;
      try { localStorage.setItem(acctPrefix + relKey, value); count += 1; } catch (e) {}
    });
    if (count === 0) return { ok: false, reason: "이 백업 파일에서 가져올 수 있는 데이터를 찾지 못했어요." };
    await flushCloudWrites();
    return { ok: true, count };
  }

  /* ===================== 🗄️ 자동 일일 백업 =====================
     서버에 진짜 "정확히 자정 0시"에 실행되는 스케줄러가 있는 게 아니라, 자정이 지난
     뒤 누군가(어떤 계정이든) 앱을 맨 처음 열 때 "어제 하루치" 백업이 아직 없으면
     그 시점에 만든다. 그래서 실제로 만들어지는 시각은 자정보다 조금 늦어질 수 있지만
     (예: 새벽엔 아무도 안 열고 오전 9시에 첫 출근자가 열면 그때 만들어짐), 내용 자체는
     "그 날짜가 끝난 시점의 데이터" 그대로를 담는다. 같은 날짜는 marker 키로 한 번만
     만들어지게 막는다. 별도 DB 테이블 없이 기존 kv_store에 다음 키들로 함께 저장한다.
       - backup:all:{yyyy-mm-dd}                모든 계정의 전체 데이터 스냅샷 (그날 변경 여부와 무관하게 매일)
       - backup:acct:{accountId}:{yyyy-mm-dd}    그 계정이 그날 바꾼 카테고리 목록(메타데이터)
       - backup:cat:{accountId}:{category}:{yyyy-mm-dd}  그 계정의 그 카테고리만 담은 개별 스냅샷(바뀐 것만)
       - backup:marker:{yyyy-mm-dd}              중복 생성 방지용 표시 */
  const BACKUP_RETENTION_DAYS = 30;
  function _localDateStr(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }
  function _prevLocalDateStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return _localDateStr(d);
  }
  function _dateStrMinusOne(dateStr) {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() - 1);
    return _localDateStr(d);
  }
  // 특정 계정(대상 계정 아무나)의, 주어진 접두어들에 해당하는 상대 키만 모아 온다.
  // (기존 buildBackupPayload는 "지금 로그인한 계정"만 다뤘는데, 여기서는 모든 계정을 다뤄야 해서 별도로 둔다.)
  function _accountCategoryEntries(accountId, prefixes) {
    const acctPrefix = `acct:${accountId}:`;
    const entries = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(acctPrefix) !== 0) continue;
        const rel = k.slice(acctPrefix.length);
        if (!prefixes.some((p) => rel.indexOf(p) === 0)) continue;
        const v = localStorage.getItem(k);
        if (v !== null) entries[rel] = v;
      }
    } catch (e) { /* 접근 실패 시 빈 결과로 진행 */ }
    return entries;
  }
  async function runDailyAutoBackupIfNeeded() {
    if (!cloud) return;
    const targetDate = _prevLocalDateStr(); // "어제"를 기준으로 하루치를 남긴다
    const markerKey = `backup:marker:${targetDate}`;
    try {
      const { data } = await cloud.from("kv_store").select("key").eq("key", markerKey).maybeSingle();
      if (data) return; // 이미 다른 사람이 만들어둔 날짜
    } catch (e) { return; } // 확인 자체가 안 되면(오프라인 등) 시도하지 않고, 다음에 여는 사람에게 맡긴다
    try {
      const accounts = loadAccounts();
      // 1) 계정 무관 전체 스냅샷 — 바뀐 게 있든 없든 매일 남긴다.
      const allSnapshot = { createdAt: new Date().toISOString(), date: targetDate, accounts: {} };
      accounts.forEach((acc) => {
        const entries = _accountCategoryEntries(acc.id, backupAllPrefixes());
        if (Object.keys(entries).length) allSnapshot.accounts[acc.id] = { accountName: acc.username, data: entries };
      });
      await cloud.from("kv_store").upsert({ key: `backup:all:${targetDate}`, value: JSON.stringify(allSnapshot), updated_at: new Date().toISOString() });

      // 2) 전날 스냅샷과 비교해서, 계정별로 실제 바뀐 카테고리만 개별 저장한다.
      let prevAllSnapshot = null;
      try {
        const { data } = await cloud.from("kv_store").select("value").eq("key", `backup:all:${_dateStrMinusOne(targetDate)}`).maybeSingle();
        if (data && data.value) prevAllSnapshot = JSON.parse(data.value);
      } catch (e) { /* 전날 스냅샷이 없으면(첫 백업 등) 전부 "새로 생김" 취급 */ }
      for (const acc of accounts) {
        const changedCats = [];
        const prevAcctData = (prevAllSnapshot && prevAllSnapshot.accounts[acc.id] && prevAllSnapshot.accounts[acc.id].data) || {};
        for (const cat of BACKUP_CATEGORIES) {
          const curEntries = _accountCategoryEntries(acc.id, cat.keyPrefixes);
          if (!Object.keys(curEntries).length) continue;
          const prevForCat = {};
          Object.keys(prevAcctData).forEach((k) => { if (cat.keyPrefixes.some((p) => k.indexOf(p) === 0)) prevForCat[k] = prevAcctData[k]; });
          if (JSON.stringify(curEntries) === JSON.stringify(prevForCat)) continue; // 안 바뀐 카테고리는 건너뜀
          changedCats.push({ key: cat.key, label: cat.label });
          await cloud.from("kv_store").upsert({
            key: `backup:cat:${acc.id}:${cat.key}:${targetDate}`,
            value: JSON.stringify({ createdAt: new Date().toISOString(), date: targetDate, accountId: acc.id, accountName: acc.username, category: cat.key, categoryLabel: cat.label, data: curEntries }),
            updated_at: new Date().toISOString(),
          });
        }
        if (changedCats.length) {
          await cloud.from("kv_store").upsert({
            key: `backup:acct:${acc.id}:${targetDate}`,
            value: JSON.stringify({ createdAt: new Date().toISOString(), date: targetDate, accountId: acc.id, accountName: acc.username, categories: changedCats }),
            updated_at: new Date().toISOString(),
          });
        }
      }
      await cloud.from("kv_store").upsert({ key: markerKey, value: "1", updated_at: new Date().toISOString() });
      await _pruneOldBackups();
    } catch (e) { /* 실패해도 평소 앱 사용에는 영향 없음 — 다음에 여는 사람이 다시 시도하게 된다 */ }
  }
  async function _pruneOldBackups() {
    if (!cloud) return;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - BACKUP_RETENTION_DAYS);
    const cutoffStr = _localDateStr(cutoff);
    try {
      const { data } = await cloud.from("kv_store").select("key").like("key", "backup:%");
      if (!data) return;
      const toDelete = data.filter((r) => {
        const m = /:(\d{4}-\d{2}-\d{2})$/.exec(r.key);
        return m && m[1] < cutoffStr;
      }).map((r) => r.key);
      for (const k of toDelete) { try { await cloud.from("kv_store").delete().eq("key", k); } catch (e) {} }
    } catch (e) {}
  }
  // 마스터 화면의 "자동 백업" 탭에서 쓸 목록: 날짜별로 묶어서 최신순으로 돌려준다.
  async function fetchBackupList() {
    if (!cloud) return [];
    const { data, error } = await cloud.from("kv_store").select("key,value").like("key", "backup:%");
    if (error || !data) return [];
    const byDate = {};
    data.forEach((row) => {
      if (/^backup:marker:/.test(row.key)) return;
      let m;
      if ((m = /^backup:all:(\d{4}-\d{2}-\d{2})$/.exec(row.key))) {
        const date = m[1];
        byDate[date] = byDate[date] || { date, all: null, accounts: {} };
        try { byDate[date].all = JSON.parse(row.value); } catch (e) {}
      } else if ((m = /^backup:acct:([^:]+):(\d{4}-\d{2}-\d{2})$/.exec(row.key))) {
        const [, accountId, date] = m;
        byDate[date] = byDate[date] || { date, all: null, accounts: {} };
        try { byDate[date].accounts[accountId] = Object.assign({ categories: [] }, JSON.parse(row.value), { catData: (byDate[date].accounts[accountId] || {}).catData || {} }); } catch (e) {}
      } else if ((m = /^backup:cat:([^:]+):([^:]+):(\d{4}-\d{2}-\d{2})$/.exec(row.key))) {
        const [, accountId, catKey, date] = m;
        byDate[date] = byDate[date] || { date, all: null, accounts: {} };
        byDate[date].accounts[accountId] = byDate[date].accounts[accountId] || { categories: [], catData: {} };
        if (!byDate[date].accounts[accountId].catData) byDate[date].accounts[accountId].catData = {};
        try { byDate[date].accounts[accountId].catData[catKey] = JSON.parse(row.value); } catch (e) {}
      }
    });
    return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
  }

  // 새로고침 버튼: 백업 버튼이 있던 오른쪽 아래 자리에 항상 떠 있는 고정 버튼으로 표시.
  // 다른 사람이 다른 기기/탭에서 저장한 내용을 서버에서 다시 받아오기 위한 용도로,
  // 누른 시점에 보고 있던 페이지(홈/상담사 관리 등)는 그대로 유지된다.
  function renderRefreshToggle() {
    const root = document.getElementById("refresh-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-refresh-toggle" type="button" aria-label="최신 내용으로 새로고침" title="최신 내용으로 새로고침">
          ${ICON_REFRESH}
          <span class="theme-picker-label">새로고침</span>
        </button>
      </div>
    `;
    const refreshBtn = document.getElementById("nav-refresh-toggle");
    if (refreshBtn) refreshBtn.onclick = () => performServerRefresh();
  }
  function closeBackupModal() {
    const existing = document.getElementById("backup-modal-overlay");
    if (existing) existing.remove();
  }
  function flashBackupStatus(msg, isError) {
    const el = document.getElementById("backup-modal-status");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
  }
  function backupCategoryRowHtml(cat) {
    return `
      <div class="backup-cat-row">
        <div class="backup-cat-label">${cat.icon} ${esc(cat.label)}</div>
        <div class="backup-cat-actions">
          <button type="button" class="ghost-btn" data-backup-export="${cat.key}">${ICON_DOWNLOAD} 내보내기</button>
          <button type="button" class="ghost-btn" data-backup-import="${cat.key}">${ICON_UPLOAD} 가져오기</button>
        </div>
      </div>
    `;
  }
  // 파일 선택창을 열기 직전에 "이번 가져오기가 어느 카테고리 대상인지"를 여기에
  // 담아두고, 파일이 선택되면 이 값을 기준으로 어떤 키만 반영할지 정한다.
  let backupImportRestrict = null;
  function openBackupModal() {
    closeBackupModal();
    const overlay = document.createElement("div");
    overlay.id = "backup-modal-overlay";
    overlay.className = "manual-modal-overlay";
    overlay.innerHTML = `
      <div class="manual-modal-box backup-modal-box" role="dialog" aria-modal="true" aria-label="데이터 백업/복원">
        <div class="manual-modal-head">
          <span>${ICON_BACKUP} 데이터 백업/복원</span>
          <button type="button" class="manual-modal-close" id="backup-modal-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body">
          <p class="backup-modal-desc">
            상담사 정보 · 월별 스케줄 · 면담일지 · QA 점수 · 업무 정리(메모) · 캘린더 등
            <b>"${esc(CURRENT_ACCOUNT_NAME)}"</b> 계정의 데이터를 JSON 파일로 내려받거나 다시 불러올 수 있어요.
            가져오기는 파일이 원래 어느 계정에서 만들어졌든 상관없이 항상 <b>지금 로그인한 이 계정에만</b>
            적용되고, 다른 계정의 데이터에는 전혀 영향을 주지 않아요.
          </p>
          <div class="backup-section">
            <div class="backup-section-title">전체 데이터</div>
            <div class="backup-all-actions">
              <button type="button" class="primary-btn" id="backup-export-all">${ICON_DOWNLOAD} 전체 백업 다운로드</button>
              <button type="button" class="ghost-btn" id="backup-import-all">${ICON_UPLOAD} 전체 백업 가져오기</button>
            </div>
          </div>
          <div class="backup-section">
            <div class="backup-section-title">카테고리별 백업</div>
            <div class="backup-cat-list">${BACKUP_CATEGORIES.map(backupCategoryRowHtml).join("")}</div>
          </div>
          <div class="status backup-modal-status" id="backup-modal-status"></div>
          <input type="file" accept="application/json" id="backup-file-input" style="display:none;">
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeBackupModal(); };
    document.getElementById("backup-modal-close-x").onclick = () => closeBackupModal();

    const fileInput = document.getElementById("backup-file-input");
    fileInput.onchange = async () => {
      const file = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!file) return;
      const restrict = backupImportRestrict;
      const restrictLabel = restrict
        ? ((BACKUP_CATEGORIES.find((c) => c.key === restrict) || {}).label || restrict)
        : "전체 데이터";
      let payload;
      try { payload = await readBackupFile(file); }
      catch (e) { flashBackupStatus("파일을 읽을 수 없어요. 올바른 백업 JSON 파일인지 확인해주세요.", true); return; }
      const proceed = window.confirm(
        `"${restrictLabel}" 데이터를 이 백업 파일 내용으로 덮어쓸까요?\n(지금 로그인한 계정 "${CURRENT_ACCOUNT_NAME}"에만 적용되고, 다른 계정에는 영향이 없어요)`
      );
      if (!proceed) return;
      flashBackupStatus("가져오는 중…");
      const result = await applyBackupPayload(payload, restrict);
      if (!result.ok) { flashBackupStatus(result.reason, true); return; }
      flashBackupStatus(`${result.count}개 항목을 가져왔어요. 화면을 새로고침할게요…`);
      setTimeout(() => location.reload(), 700);
    };

    document.getElementById("backup-export-all").onclick = () => downloadBackup("all");
    document.getElementById("backup-import-all").onclick = () => {
      backupImportRestrict = null;
      fileInput.click();
    };
    overlay.querySelectorAll("[data-backup-export]").forEach((btn) => {
      btn.onclick = () => downloadBackup(btn.getAttribute("data-backup-export"));
    });
    overlay.querySelectorAll("[data-backup-import]").forEach((btn) => {
      btn.onclick = () => {
        backupImportRestrict = btn.getAttribute("data-backup-import");
        fileInput.click();
      };
    });
  }

  // ==================== 설정 메뉴 팝오버, 공통 유틸(esc/pad2/genId), 공용 페이지네이션 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  // 설정 메뉴 팝오버("설정" 버튼을 누르면 뜨는 목록) — 테마 선택 · 사용설명서 · 데이터 백업을
  // 한 목록 안에 모아둔다. 항목이 3개뿐이라 테마도 별도 팝업으로 한 번 더 들어가지 않고
  // 이 목록에서 바로 다크/라이트를 고를 수 있게 했다.
  function closeSettingsMenu() {
    const existing = document.getElementById("settings-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", settingsMenuOutsideHandler, true);
    const btn = document.getElementById("nav-settings-toggle");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  function settingsMenuOutsideHandler(e) {
    const menu = document.getElementById("settings-menu");
    const btn = document.getElementById("nav-settings-toggle");
    if (menu && !menu.contains(e.target) && !(btn && btn.contains(e.target))) closeSettingsMenu();
  }
  function openSettingsMenu(anchorEl) {
    closeSettingsMenu();
    anchorEl.classList.add("open");
    anchorEl.setAttribute("aria-expanded", "true");
    const rect = anchorEl.getBoundingClientRect();
    const current = getCurrentTheme();
    const menu = document.createElement("div");
    menu.id = "settings-menu";
    menu.className = "theme-menu settings-menu";
    menu.innerHTML = `
      <div class="settings-menu-label">테마</div>
      ${THEME_LIST.map((t) => `
        <button type="button" class="theme-menu-item ${t.id === current ? "active" : ""}" data-theme-id="${t.id}">
          <span class="theme-menu-dot" style="background:${t.bg};"></span>
          <span class="theme-menu-name">${t.label}</span>
          ${t.id === current ? '<span class="theme-menu-check">✓</span>' : ""}
        </button>
      `).join("")}
      <div class="settings-menu-divider"></div>
      <button type="button" class="theme-menu-item" id="settings-manual-btn">
        ${ICON_BOOK}<span class="theme-menu-name">사용설명서</span>
      </button>
      <button type="button" class="theme-menu-item" id="settings-backup-btn">
        ${ICON_BACKUP}<span class="theme-menu-name">데이터 백업</span>
      </button>
      <button type="button" class="theme-menu-item" id="settings-worktypes-btn">
        ${ICON_SETTINGS}<span class="theme-menu-name">업무 구분 관리</span>
      </button>
      <button type="button" class="theme-menu-item" id="settings-discord-btn">
        ${ICON_DISCORD}<span class="theme-menu-name">디스코드 채널</span>
      </button>
    `;
    document.body.appendChild(menu);
    const menuRect = menu.getBoundingClientRect();
    let top = rect.top - menuRect.height - 8;
    if (top < 8) top = rect.bottom + 8;
    let left = rect.left;
    if (left + menuRect.width > window.innerWidth - 8) left = window.innerWidth - menuRect.width - 8;
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("[data-theme-id]").forEach((btn) => {
      btn.onclick = () => {
        setTheme(btn.getAttribute("data-theme-id"));
        closeSettingsMenu();
      };
    });
    const manualBtn = document.getElementById("settings-manual-btn");
    if (manualBtn) manualBtn.onclick = () => { closeSettingsMenu(); openManualModal(); };
    const worktypesBtn = document.getElementById("settings-worktypes-btn");
    if (worktypesBtn) worktypesBtn.onclick = () => { closeSettingsMenu(); openWorkTypesModal(() => renderApp()); };
    const backupBtn = document.getElementById("settings-backup-btn");
    if (backupBtn) backupBtn.onclick = () => { closeSettingsMenu(); openBackupModal(); };
    const discordBtn = document.getElementById("settings-discord-btn");
    if (discordBtn) discordBtn.onclick = () => { closeSettingsMenu(); window.open(DISCORD_INVITE_URL, "_blank", "noopener"); };
    setTimeout(() => document.addEventListener("mousedown", settingsMenuOutsideHandler, true), 0);
  }

  /* ===================== 공통 유틸 ===================== */
  function pad2(n) { return String(n).padStart(2, "0"); }
  // HTML에 끼워 넣을 문자열을 안전하게 만든다.
  // 예전에는 document.createElement("div")에 textContent를 넣고 innerHTML을
  // 읽는 방식이었는데, 그 방식은 브라우저 규칙상 &, <, > 세 글자만 바꾸고
  // 따옴표는 그대로 둔다. 그런데 이 앱은 esc()를 태그 사이뿐 아니라
  // value="${esc(...)}" · title="${esc(...)}" 처럼 "속성값 안"에서도 많이 쓰기
  // 때문에, 일정 제목이나 셀 메모에 큰따옴표가 하나만 들어가도 속성이 거기서
  // 끊겨 마크업이 깨졌다. 그래서 따옴표까지 포함해 직접 치환한다
  // (DOM을 안 쓰므로 더 빠르고, 로그인 전처럼 document가 준비되지 않은
  //  시점에 호출돼도 안전하다).
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

  /* ===================== 공용 페이지네이션 ===================== */
  // 목록이 길어질 때 10개 단위로 잘라서 보여주기 위한 공용 헬퍼.
  const PAGE_SIZE = 12; // 상담사 관리 / 면담일지 목록 페이지당 표시 개수
  // list 전체와 원하는 page(1부터 시작)를 넣으면, 범위를 벗어난 page는 알아서
  // 안쪽으로 보정해서 { items, page, totalPages }를 돌려준다.
  function paginateList(list, page) {
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page || 1), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return { items: list.slice(start, start + PAGE_SIZE), page: safePage, totalPages };
  }
  // actionName은 클릭 시 data-page-action 값으로 붙어서, 각 화면에서 이 값으로
  // 자기 목록의 페이지 상태를 구분해 처리한다.
  function renderPaginationHtml(page, totalPages, actionName) {
    if (totalPages <= 1) return "";
    return `
      <div class="page-nav" data-page-action="${actionName}">
        <button type="button" class="page-nav-btn" data-page-nav="prev" ${page <= 1 ? "disabled" : ""}>이전</button>
        <span class="page-nav-info">${page} / ${totalPages}페이지</span>
        <button type="button" class="page-nav-btn" data-page-nav="next" ${page >= totalPages ? "disabled" : ""}>다음</button>
      </div>
    `;
  }
  // renderPaginationHtml로 그려진 이전/다음 버튼에 동작을 붙인다.
  // 버튼은 이미 범위를 벗어나면 disabled 처리되어 있으므로, 여기서는 그냥
  // -1(이전)/+1(다음)만큼 페이지를 옮겨달라고 onDelta(delta)를 호출해주면 된다.
  function attachPaginationHandlers(root, actionName, onDelta) {
    const nav = root.querySelector(`.page-nav[data-page-action="${actionName}"]`);
    if (!nav) return;
    const prevBtn = nav.querySelector('[data-page-nav="prev"]');
    const nextBtn = nav.querySelector('[data-page-nav="next"]');
    if (prevBtn) prevBtn.onclick = () => onDelta(-1);
    if (nextBtn) nextBtn.onclick = () => onDelta(1);
  }

  // ==================== 비밀번호 해시(PBKDF2), 계정 CRUD, 디스코드 알림 허용 설정, 세션/마스터 모드/팀원, 로그아웃 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

  /* ===================== 로그인(로컬 전용) 모듈 =====================
     지금은 서버 없이 이 브라우저의 localStorage에만 계정 정보를 저장하는
     "로컬 프로토타입" 로그인입니다. 서버가 없는 한 브라우저 안의 어떤 값도
     완전히 안전할 수는 없으므로, 진짜 보안이 필요해지면 반드시 서버 기반
     인증(암호화된 비밀번호 저장, 세션/토큰 검증 등)으로 교체해야 합니다.
     비밀번호는 브라우저 내장 SubtleCrypto의 PBKDF2(HMAC-SHA256, 30만 회 반복)로
     계정마다 다른 salt를 붙여 해시해 저장한다(2026-09 강화, 아래 makeNewPasswordRecord
     참고). 예전에 만든 계정(2세대: SHA-256 1회, 1세대: salt 없음)도 다음 로그인
     때 자동으로 이 방식으로 업그레이드된다(verifyAndMaybeUpgradePassword 참고).
     계정별 데이터는 저장 키 앞에 "acct:{계정ID}:" 접두어를 붙여 브라우저 안에서만
     서로 분리해둡니다. */
  const ACCOUNTS_KEY = "personal-app:accounts";
  // 로그인 세션(누가 로그인해 있는지)은 localStorage에 저장해서, 탭을 닫았다 새로
  // 열어도(같은 브라우저인 한) 로그인이 그대로 유지되게 한다. 대신 아래 LAST_ACTIVE_KEY
  // 하트비트로 "너무 오래(=컴퓨터를 껐다 켤 정도로) 닫혀 있었는지"를 따로 판단해서,
  // 그 경우에만 자동으로 로그아웃시킨다.
  const SESSION_KEY = "personal-app:session";
  // 마스터 계정이 다른 계정을 "들어가서 보기" 했을 때, 원래(마스터) 계정으로
  // 돌아올 수 있도록 원래 세션을 잠깐 보관해두는 키.
  const MASTER_ORIGIN_KEY = "personal-app:master-origin";
  // 이 앱이 마지막으로 화면에 떠 있었던 시각(하트비트). 탭이 열려 있는 동안 주기적으로
  // 갱신되고, 탭/브라우저가 닫히면 더 이상 갱신되지 않는다. 다음에 열었을 때 이 시각과
  // 지금 시각의 차이가 SESSION_GAP_LIMIT_MS보다 크면 "그동안 컴퓨터를 껐다 켰거나
  // 오래 자리를 비운 것"으로 보고 자동 로그아웃시킨다. 그보다 짧으면(탭만 잠깐 닫았다
  // 연 경우 등) 로그인 상태를 그대로 유지한다. 기준 시간을 바꾸고 싶으면 이 숫자만
  // 고치면 된다.
  const LAST_ACTIVE_KEY = "personal-app:last-active";
  const SESSION_GAP_LIMIT_MS = 5 * 60 * 1000; // 5분

  const HAS_SUBTLE_CRYPTO = !!(window.crypto && window.crypto.subtle);
  // 예전(salt 없는 단순 해시) 방식 — 신규 계정에는 쓰지 않고, 예전에 만든
  // 계정을 로그인할 때 한 번 확인해서 새 방식으로 자동 업그레이드하는 용도로만 남겨둔다.
  function legacyHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  }
  function genSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function hexToBytes(hex) {
    const bytes = new Uint8Array(Math.floor(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    return bytes;
  }
  async function sha256Hex(str) {
    const bytes = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // 예전(2세대) 방식 — salt를 붙여 SHA-256으로 "딱 1번" 해시한다. 그래프카드(GPU)로
  // 초당 수십억 번씩 계산할 수 있어서, 유출되면 흔한 비밀번호는 금방 뚫린다.
  // 새 계정에는 쓰지 않고, 예전에 만든 계정을 아래 PBKDF2 방식으로 자동
  // 업그레이드하기 위한 "확인용"으로만 남겨둔다.
  async function hashPasswordSha256(password, salt) {
    if (!HAS_SUBTLE_CRYPTO) return legacyHash(`${salt}:${password}`);
    return sha256Hex(`${salt}:${password}`);
  }
  // 지금(3세대) 비밀번호 저장 방식: PBKDF2(HMAC-SHA256, 30만 회 반복). 같은 계산을
  // 30만 번 반복시켜서, 유출된 해시로 비밀번호를 무차별 대입하려는 시도를 앞의
  // SHA-256 1회 방식보다 훨씬 느리고 비싸게 만든다(GPU로 돌려도 초당 계산 가능
  // 횟수가 수천~수만 배 줄어듦). 브라우저 내장 SubtleCrypto의 PBKDF2 구현만
  // 쓰고, 외부 라이브러리는 쓰지 않는다.
  const PBKDF2_ITERATIONS = 300000;
  async function hashPasswordPBKDF2(password, saltHex, iterations) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
    const derivedBits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: iterations || PBKDF2_ITERATIONS, hash: "SHA-256" },
      keyMaterial,
      256
    );
    return Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // 새 비밀번호를 정할 때(가입, 마스터의 비밀번호 초기화) 쓰는 함수. SubtleCrypto를
  // 못 쓰는 예외적인 환경에서는(PBKDF2 자체를 돌릴 수 없으므로) 어쩔 수 없이 예전
  // SHA-256 salted 방식으로 대신하고, 나중에 SubtleCrypto를 쓸 수 있는 환경에서
  // 로그인하면 그때 자동으로 PBKDF2로 업그레이드된다.
  async function makeNewPasswordRecord(password) {
    const salt = genSalt();
    if (!HAS_SUBTLE_CRYPTO) {
      return { salt, passwordHash: await hashPasswordSha256(password, salt), hashAlgo: "sha256" };
    }
    return { salt, passwordHash: await hashPasswordPBKDF2(password, salt, PBKDF2_ITERATIONS), hashAlgo: "pbkdf2", iterations: PBKDF2_ITERATIONS };
  }
  // 계정에 저장된 방식이 무엇이든(1세대: salt 없음 / 2세대: salt+SHA-256 1회 /
  // 3세대: salt+PBKDF2) 알맞게 확인하고, 맞으면 { ok: true, upgrade: <새 레코드 또는 null> }
  // 를 돌려준다. upgrade가 있으면(구버전 확인 통과) 로그인 쪽에서 그 즉시 계정에
  // 저장해 다음 로그인부터는 최신 방식으로 확인하게 한다.
  async function verifyAndMaybeUpgradePassword(account, password) {
    if (account.hashAlgo === "pbkdf2") {
      const ok = account.passwordHash === (await hashPasswordPBKDF2(password, account.salt, account.iterations || PBKDF2_ITERATIONS));
      return { ok, upgrade: null }; // 이미 최신 방식이라 업그레이드할 게 없음
    }
    if (account.salt) {
      // 2세대(salt+SHA-256 1회) 계정: 이 방식으로 확인하고, 맞으면 PBKDF2로 업그레이드
      const ok = account.passwordHash === (await hashPasswordSha256(password, account.salt));
      if (!ok) return { ok: false, upgrade: null };
      return { ok: true, upgrade: HAS_SUBTLE_CRYPTO ? await makeNewPasswordRecord(password) : null };
    }
    // 1세대(salt 없음) 계정: 예전 단순 해시로 확인하고, 맞으면 곧장 PBKDF2로 업그레이드
    const ok = account.passwordHash === legacyHash(password);
    if (!ok) return { ok: false, upgrade: null };
    return { ok: true, upgrade: HAS_SUBTLE_CRYPTO ? await makeNewPasswordRecord(password) : null };
  }
  function loadAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveAccounts(list) {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  /* ---- 디스코드 알림 허용 계정 설정 ----
     어떤 계정의 일정/할일을 디스코드로 보낼지를 계정 단위 토글로 관리한다.
     { [accountId]: true } 형태로 "허용"된 계정만 담아두고, 여기 없는 계정은
     전부 기본값인 "제한"으로 취급한다(허용 목록 방식이라 새 계정도 자동으로
     제한 상태로 시작한다). 이 키도 다른 설정들처럼 클라우드(kv_store)에
     함께 저장돼서 discord-notify 서버 함수가 그대로 읽어갈 수 있다. */
  const DISCORD_NOTIFY_SETTINGS_KEY = "personal-app:discord-notify-settings";
  function loadDiscordNotifySettings() {
    try {
      const raw = localStorage.getItem(DISCORD_NOTIFY_SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
    } catch (e) { return {}; }
  }
  function saveDiscordNotifySettings(obj) {
    try { localStorage.setItem(DISCORD_NOTIFY_SETTINGS_KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function isDiscordNotifyAllowed(accountId) {
    return loadDiscordNotifySettings()[accountId] === true;
  }
  function setDiscordNotifyAllowed(accountId, allowed) {
    const settings = loadDiscordNotifySettings();
    if (allowed) settings[accountId] = true;
    else delete settings[accountId];
    saveDiscordNotifySettings(settings);
  }
  function getSession() {
    try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; }
  }
  function setSession(accountId) {
    try { localStorage.setItem(SESSION_KEY, accountId); } catch (e) {}
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }
  function getMasterOrigin() {
    try { return localStorage.getItem(MASTER_ORIGIN_KEY); } catch (e) { return null; }
  }
  function setMasterOrigin(accountId) {
    try { localStorage.setItem(MASTER_ORIGIN_KEY, accountId); } catch (e) {}
  }
  function clearMasterOrigin() {
    try { localStorage.removeItem(MASTER_ORIGIN_KEY); } catch (e) {}
  }
  function getLastActive() {
    try { return Number(localStorage.getItem(LAST_ACTIVE_KEY)) || 0; } catch (e) { return 0; }
  }
  // 하트비트를 지금 시각으로 갱신한다. 로그인 직후, 그리고 탭이 열려 있는 동안
  // 주기적으로 호출된다.
  function touchLastActive() {
    try { localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now())); } catch (e) {}
  }
  function clearLastActive() {
    try { localStorage.removeItem(LAST_ACTIVE_KEY); } catch (e) {}
  }
  // 마스터 계정이 다른 계정으로 들어가서 볼 때 쓰는 함수.
  // 지금 세션(마스터)을 origin으로 저장해두고, 세션을 대상 계정으로 바꾼다.
  async function masterEnterAccount(targetAccountId) {
    const origin = getMasterOrigin() || getSession();
    if (origin) setMasterOrigin(origin);
    setSession(targetAccountId);
    clearTeamLoginMember();
    await flushCloudWrites();
    location.reload();
  }
  // 마스터가 다른 계정을 보다가 원래 마스터 계정으로 돌아간다.
  async function masterReturnToOrigin() {
    const origin = getMasterOrigin();
    if (!origin) return;
    clearMasterOrigin();
    setSession(origin);
    clearTeamLoginMember();
    await flushCloudWrites();
    location.reload();
  }
  // 계정을 삭제한다. 현재 로그인 중인 계정이거나, 남은 계정이 1개뿐이면 삭제하지 않는다.
  // 계정을 지울 때 그 계정의 개인 데이터(acct:{id}: 로 시작하는 저장 값)도 함께 정리한다.
  function deleteAccount(accountId) {
    const list = loadAccounts();
    if (list.length <= 1) return { ok: false, reason: "마지막 남은 계정은 삭제할 수 없어요." };
    if (accountId === CURRENT_ACCOUNT_ID) return { ok: false, reason: "현재 로그인 중인 계정은 삭제할 수 없어요." };
    const target = list.find((a) => a.id === accountId);
    const next = list.filter((a) => a.id !== accountId);
    saveAccounts(next);
    setDiscordNotifyAllowed(accountId, false);
    try {
      const prefix = `acct:${accountId}:`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* 데이터 정리 실패해도 계정 삭제 자체는 유지 */ }
    appendActivityLog({
      accountId,
      accountName: target ? target.username : accountId,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: ["계정이 삭제됐어요."],
    });
    return { ok: true };
  }
  // 마스터가 다른 계정의 비밀번호를 새 비밀번호로 초기화한다. 실제 검증·변경은
  // Edge Function(auth-admin)이 서버에서 처리한다 — 클라이언트는 결과만 받는다.
  async function resetAccountPassword(accountId, newPassword) {
    if (!newPassword || newPassword.length < 6) return { ok: false, reason: "비밀번호는 6자 이상으로 만들어주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const result = await cloudAdminResetPassword(accountId, newPassword);
    if (!result.ok) return result;
    // 서버가 kv_store의 비밀번호 관련 필드를 이미 지워서 authMigrated:true로
    // 저장해뒀으니, 이 브라우저의 로컬 캐시도 같은 모양으로 맞춰준다(다음
    // cloudHydrate 때 서버 값으로 다시 덮어써지긴 하지만, 그 전에 화면이
    // 예전 필드를 참조하다 혼동되는 걸 막기 위함).
    const { passwordHash, salt, hashAlgo, iterations, cloudAuthSecret, ...rest } = list[idx];
    list[idx] = { ...rest, authMigrated: true };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: ["비밀번호가 초기화됐어요."],
    });
    return { ok: true };
  }
  // 마스터가 다른 계정의 이름(아이디)을 바꾼다. 이미 쓰이고 있는 이름으로는 바꿀 수 없다.
  function renameAccount(accountId, newUsername) {
    const trimmed = (newUsername || "").trim();
    if (!trimmed) return { ok: false, reason: "계정 이름을 입력해주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const norm = trimmed.toLowerCase();
    const dup = list.find((a) => a.id !== accountId && a.username.toLowerCase() === norm);
    if (dup) return { ok: false, reason: "이미 사용 중인 계정 이름이에요." };
    const oldUsername = list[idx].username;
    list[idx] = { ...list[idx], username: trimmed };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: trimmed,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: [`계정 이름: ${oldUsername} → ${trimmed}`],
    });
    return { ok: true };
  }
  function findAccountByUsername(username) {
    const norm = username.trim().toLowerCase();
    return loadAccounts().find((a) => a.username.toLowerCase() === norm) || null;
  }
  function findAccountById(id) {
    return loadAccounts().find((a) => a.id === id) || null;
  }
  /* ---- 팀용 계정의 "로그인 인원" ----
     팀용 계정은 비밀번호 하나를 여러 명이 함께 쓰되, 로그인할 때 누가 접속했는지
     이름표만 골라서 들어간다. 이 목록(teamMembers)은 마스터 계정에서만 추가/삭제할
     수 있고, 실제 인증(비밀번호 검증)에는 관여하지 않는다 — 활동 로그 등에서
     "누가"를 조금 더 구체적으로 보여주기 위한 용도. */
  function addTeamMember(accountId, name) {
    const trimmed = (name || "").trim();
    if (!trimmed) return { ok: false, reason: "이름을 입력해주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    if (list[idx].accountType !== "team") return { ok: false, reason: "팀용 계정이 아니에요." };
    const members = Array.isArray(list[idx].teamMembers) ? list[idx].teamMembers.slice() : [];
    if (members.some((m) => m.name === trimmed)) return { ok: false, reason: "이미 있는 이름이에요." };
    members.push({ id: genId(), name: trimmed });
    list[idx] = { ...list[idx], teamMembers: members };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "로그인 인원",
      diff: [`로그인 인원 추가: ${trimmed}`],
    });
    return { ok: true };
  }
  function removeTeamMember(accountId, memberId) {
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const members = Array.isArray(list[idx].teamMembers) ? list[idx].teamMembers : [];
    const target = members.find((m) => m.id === memberId);
    if (!target) return { ok: false, reason: "인원을 찾을 수 없어요." };
    list[idx] = { ...list[idx], teamMembers: members.filter((m) => m.id !== memberId) };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "로그인 인원",
      diff: [`로그인 인원 삭제: ${target.name}`],
    });
    return { ok: true };
  }
  // 마스터가 이미 만들어진 계정의 유형(개인용/팀용)을 바꾼다. 팀용으로 바꿀 때 로그인
  // 인원 목록이 없으면 빈 목록으로 시작하고, 개인용으로 바꿔도 이미 등록해둔 인원
  // 목록 자체는 지우지 않는다(나중에 다시 팀용으로 바꾸면 그대로 남아있게).
  function setAccountType(accountId, newType) {
    const type = newType === "team" ? "team" : "personal";
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const prevType = list[idx].accountType === "team" ? "team" : "personal";
    if (prevType === type) return { ok: true };
    const updated = { ...list[idx], accountType: type };
    if (type === "team" && !Array.isArray(updated.teamMembers)) updated.teamMembers = [];
    list[idx] = updated;
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: [`계정 유형: ${prevType === "team" ? "팀용" : "개인용"} → ${type === "team" ? "팀용" : "개인용"}`],
    });
    // 지금 로그인해 있는 계정 자신의 유형이 팀용이 아니게 바뀌면, 남아있던 "로그인 인원"
    // 선택도 더는 의미가 없으니 같이 지운다.
    if (accountId === CURRENT_ACCOUNT_ID && type !== "team") clearTeamLoginMember();
    return { ok: true };
  }
  // 지금 선택된 "로그인 인원"(팀용 계정에서만 의미 있음)을 브라우저에 잠깐 저장해서,
  // 새로고침 후에도(같은 세션이 유지되는 동안) 계속 같은 인원으로 표시되게 한다.
  const TEAM_MEMBER_KEY = "personal-app:team-login-member";
  function getTeamLoginMember() {
    try {
      const raw = localStorage.getItem(TEAM_MEMBER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function setTeamLoginMember(member) {
    try {
      if (member) localStorage.setItem(TEAM_MEMBER_KEY, JSON.stringify(member));
      else localStorage.removeItem(TEAM_MEMBER_KEY);
    } catch (e) {}
  }
  function clearTeamLoginMember() {
    try { localStorage.removeItem(TEAM_MEMBER_KEY); } catch (e) {}
  }
  async function logout() {
    clearSession();
    clearMasterOrigin();
    clearLastActive();
    clearTeamLoginMember();
    await flushCloudWrites();
    if (cloud) { try { await cloud.auth.signOut(); } catch (e) {} }
    location.reload();
  }

  // ==================== 커스텀 드롭다운/날짜/시간 선택 위젯 (모든 select·date·time input 공통 적용), 앱 공용 플로팅 메뉴 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ---- 커스텀 드롭다운/날짜선택(모든 <select>·<input type="date">에 공통 적용) ----
     기본 <select>와 <input type="date">는 목록/달력 부분이 브라우저 기본 스타일로
     떠서 앱 디자인과 어울리지 않아서, 월별 스케줄 화면의 떠있는 메뉴(.sch-menu)와
     같은 느낌으로 직접 그리는 드롭다운/달력으로 감싸준다. 원본 엘리먼트는 화면에서만
     숨기고 DOM에 그대로 둬서, 각 화면에서 쓰던 select.value / input.value /
     .onchange / addEventListener("change", ...) 같은 기존 코드는 손댈 필요가 없다.
     렌더링마다 매번 새로 그려지는 이 앱 구조상 각 화면은 자기 select/date input을
     그린 뒤 enhanceSelect(...) / enhanceDateInput(...)만 호출해주면 된다. */
  function closeAllAppFloatingMenus() {
    document.querySelectorAll(".app-select-menu").forEach((m) => m.remove());
    document.querySelectorAll(".app-select-trigger.open").forEach((t) => t.classList.remove("open"));
    document.querySelectorAll(".app-date-menu").forEach((m) => m.remove());
    document.querySelectorAll(".app-date-trigger.open").forEach((t) => t.classList.remove("open"));
    document.querySelectorAll(".app-time-menu").forEach((m) => m.remove());
    document.querySelectorAll(".app-time-trigger.open").forEach((t) => t.classList.remove("open"));
    document.removeEventListener("mousedown", appFloatingOutsideHandler, true);
  }
  // 이전 이름으로 부르는 코드가 있어도 그대로 동작하도록 별칭을 남겨둔다.
  const closeAllAppSelectMenus = closeAllAppFloatingMenus;
  function appFloatingOutsideHandler(e) {
    // 드롭다운/날짜/시간 팝업(.app-select-menu, .app-date-menu, .app-time-menu)은 위치 계산 때문에
    // document.body에 바로 붙기 때문에 .app-select / .app-date / .app-time의 자손이 아니다.
    // 이 셋도 함께 확인하지 않으면, 팝업 안의 항목을 누르는 순간(mousedown)
    // "바깥을 눌렀다"고 오판해서 클릭이 완료되기 전에 팝업을 지워버려
    // 선택이 반영되지 않는 문제가 생긴다.
    if (
      !e.target.closest(".app-select") && !e.target.closest(".app-date") && !e.target.closest(".app-time") &&
      !e.target.closest(".app-select-menu") && !e.target.closest(".app-date-menu") && !e.target.closest(".app-time-menu")
    ) {
      closeAllAppFloatingMenus();
    }
  }
  function enhanceSelect(selectEl) {
    if (!selectEl || selectEl.tagName !== "SELECT") return;
    if (selectEl.classList.contains("app-select-native")) return; // 이미 적용됨 (중복 방지)
    const wrap = document.createElement("div");
    wrap.className = "app-select";
    selectEl.parentNode.insertBefore(wrap, selectEl);
    wrap.appendChild(selectEl);
    selectEl.classList.add("app-select-native");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${selectEl.getAttribute("data-trigger-class") || "add-input"} app-select-trigger`;
    if (selectEl.id) trigger.id = `${selectEl.id}-trigger`;
    trigger.disabled = selectEl.disabled;
    const textSpan = document.createElement("span");
    textSpan.className = "app-select-trigger-text";
    const caretSpan = document.createElement("span");
    caretSpan.className = "app-select-caret";
    caretSpan.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 6 8 10.4 12.4 6"/></svg>`;
    trigger.appendChild(textSpan);
    trigger.appendChild(caretSpan);
    wrap.appendChild(trigger);

    const syncLabel = () => {
      const opt = selectEl.options[selectEl.selectedIndex];
      textSpan.textContent = opt ? opt.textContent : "";
    };
    syncLabel();

    trigger.onclick = () => {
      if (trigger.disabled) return;
      const wasOpen = trigger.classList.contains("open");
      closeAllAppFloatingMenus();
      if (wasOpen) return; // 토글: 열려 있었으면 닫기만 하고 끝
      trigger.classList.add("open");
      const menu = document.createElement("div");
      menu.className = "app-select-menu";
      Array.from(selectEl.options).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt.textContent;
        if (opt.disabled) btn.disabled = true;
        if (opt.value === selectEl.value) btn.classList.add("selected");
        btn.onclick = () => {
          selectEl.value = opt.value;
          syncLabel();
          closeAllAppFloatingMenus();
          selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        };
        menu.appendChild(btn);
      });
      document.body.appendChild(menu);
      const rect = trigger.getBoundingClientRect();
      menu.style.minWidth = `${rect.width}px`;
      const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.top = `${Math.max(8, top)}px`;
      menu.style.left = `${Math.max(8, left)}px`;
      setTimeout(() => document.addEventListener("mousedown", appFloatingOutsideHandler, true), 0);
    };
  }

  /* ---- 커스텀 날짜선택(모든 <input type="date">에 공통 적용) ----
     드롭다운과 같은 방식: 실제 <input type="date">는 화면에서만 숨기고
     DOM/값은 그대로 유지한 채, 버튼(트리거) + 미니 달력 팝업으로 대신 그려준다.
     기존 코드의 input.value 읽기, .min 속성, onchange 핸들러는 그대로 동작한다. */
  function enhanceDateInput(inputEl) {
    if (!inputEl || inputEl.tagName !== "INPUT" || inputEl.type !== "date") return;
    if (inputEl.classList.contains("app-date-native")) return; // 이미 적용됨 (중복 방지)
    const wrap = document.createElement("div");
    wrap.className = "app-date";
    inputEl.parentNode.insertBefore(wrap, inputEl);
    wrap.appendChild(inputEl);
    const triggerClass = inputEl.className;
    inputEl.classList.add("app-date-native");
    // 값을 지울 수 있는 선택 항목인지(할 일 마감일/입사일/면접일처럼 비워둘 수 있는 칸인지)는
    // "date-input" 클래스(캘린더 일정의 기간·반복 종료일처럼 반드시 값이 있어야 하는 칸)
    // 유무로 구분한다.
    const clearable = !inputEl.classList.contains("date-input");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${triggerClass} app-date-trigger`;
    if (inputEl.id) trigger.id = `${inputEl.id}-trigger`;
    trigger.disabled = inputEl.disabled;
    const textSpan = document.createElement("span");
    textSpan.className = "app-date-trigger-text";
    const iconSpan = document.createElement("span");
    iconSpan.className = "app-date-icon";
    iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.2" width="12" height="10.8" rx="2"/><path d="M2 6.4h12M5.2 1.6v2.4M10.8 1.6v2.4"/></svg>`;
    trigger.appendChild(textSpan);
    trigger.appendChild(iconSpan);
    wrap.appendChild(trigger);

    const fmt = (iso) => {
      const [y, m, d] = iso.split("-").map(Number);
      return `${y}. ${m}. ${d}.`;
    };
    const syncLabel = () => {
      const hasVal = !!inputEl.value;
      textSpan.textContent = hasVal ? fmt(inputEl.value) : (inputEl.placeholder || "날짜 선택");
      textSpan.classList.toggle("app-date-placeholder", !hasVal);
    };
    syncLabel();

    trigger.onclick = () => {
      if (trigger.disabled) return;
      const wasOpen = trigger.classList.contains("open");
      closeAllAppFloatingMenus();
      if (wasOpen) return; // 토글: 열려 있었으면 닫기만 하고 끝
      trigger.classList.add("open");

      const parseLocalISO = (iso) => {
        const [y, m, d] = iso.split("-").map(Number);
        return new Date(y, m - 1, d);
      };
      const base = inputEl.value ? parseLocalISO(inputEl.value) : new Date();
      let viewY = base.getFullYear();
      let viewM = base.getMonth();

      const menu = document.createElement("div");
      menu.className = "app-date-menu";

      const renderPanel = () => {
        const minISO = inputEl.min || "";
        const maxISO = inputEl.max || "";
        const firstOfMonth = new Date(viewY, viewM, 1);
        const startOffset = firstOfMonth.getDay(); // 0=일요일
        const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewY, viewM, 0).getDate();
        const now = new Date();
        const todayISOStr = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;

        let cellsHtml = "";
        for (let i = 0; i < startOffset; i++) {
          const d = daysInPrevMonth - startOffset + 1 + i;
          cellsHtml += `<span class="app-date-day other-month">${d}</span>`;
        }
        for (let d = 1; d <= daysInMonth; d++) {
          const iso = `${viewY}-${pad2(viewM + 1)}-${pad2(d)}`;
          const disabled = (minISO && iso < minISO) || (maxISO && iso > maxISO);
          const isSelected = inputEl.value === iso;
          const isToday = iso === todayISOStr;
          const cls = ["app-date-day"];
          if (isSelected) cls.push("selected");
          else if (isToday) cls.push("today");
          if (disabled) cls.push("disabled");
          cellsHtml += `<button type="button" class="${cls.join(" ")}" ${disabled ? "disabled" : ""} data-iso="${iso}">${d}</button>`;
        }
        const totalCells = startOffset + daysInMonth;
        const trailing = (7 - (totalCells % 7)) % 7;
        for (let d = 1; d <= trailing; d++) {
          cellsHtml += `<span class="app-date-day other-month">${d}</span>`;
        }

        menu.innerHTML = `
          <div class="app-date-panel-header">
            <button type="button" class="app-date-nav-btn" data-nav="-1" aria-label="이전 달">‹</button>
            <span class="app-date-panel-month">${viewY}년 ${MONTH_NAMES[viewM]}</span>
            <button type="button" class="app-date-nav-btn" data-nav="1" aria-label="다음 달">›</button>
          </div>
          <div class="app-date-weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div>
          <div class="app-date-days">${cellsHtml}</div>
          <div class="app-date-panel-footer">
            <button type="button" class="app-date-footer-btn" data-action="today">오늘</button>
            ${clearable ? `<button type="button" class="app-date-footer-btn" data-action="clear">지우기</button>` : ""}
          </div>
        `;

        menu.querySelector('[data-nav="-1"]').onclick = () => { viewM -= 1; if (viewM < 0) { viewM = 11; viewY -= 1; } renderPanel(); };
        menu.querySelector('[data-nav="1"]').onclick = () => { viewM += 1; if (viewM > 11) { viewM = 0; viewY += 1; } renderPanel(); };
        menu.querySelectorAll(".app-date-day[data-iso]").forEach((btn) => {
          btn.onclick = () => {
            inputEl.value = btn.getAttribute("data-iso");
            syncLabel();
            closeAllAppFloatingMenus();
            inputEl.dispatchEvent(new Event("change", { bubbles: true }));
          };
        });
        const todayBtn = menu.querySelector('[data-action="today"]');
        if (todayBtn) todayBtn.onclick = () => {
          inputEl.value = todayISOStr;
          syncLabel();
          closeAllAppFloatingMenus();
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
        };
        const clearBtn = menu.querySelector('[data-action="clear"]');
        if (clearBtn) clearBtn.onclick = () => {
          inputEl.value = "";
          syncLabel();
          closeAllAppFloatingMenus();
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
        };
      };
      renderPanel();

      document.body.appendChild(menu);
      const rect = trigger.getBoundingClientRect();
      const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.top = `${Math.max(8, top)}px`;
      menu.style.left = `${Math.max(8, left)}px`;
      setTimeout(() => document.addEventListener("mousedown", appFloatingOutsideHandler, true), 0);
    };
  }

  /* ---- 커스텀 시간선택(모든 <input type="time">에 공통 적용) ----
     날짜선택과 같은 방식: 실제 <input type="time">는 화면에서만 숨기고
     DOM/값은 그대로 유지한 채, 버튼(트리거) + 시/분 목록 팝업으로 대신 그려준다. */
  function enhanceTimeInput(inputEl) {
    if (!inputEl || inputEl.tagName !== "INPUT" || inputEl.type !== "time") return;
    if (inputEl.classList.contains("app-time-native")) return; // 이미 적용됨 (중복 방지)
    const wrap = document.createElement("div");
    wrap.className = "app-time";
    inputEl.parentNode.insertBefore(wrap, inputEl);
    wrap.appendChild(inputEl);
    const triggerClass = inputEl.className;
    inputEl.classList.add("app-time-native");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${triggerClass} app-time-trigger`;
    if (inputEl.id) trigger.id = `${inputEl.id}-trigger`;
    trigger.disabled = inputEl.disabled;
    const textSpan = document.createElement("span");
    textSpan.className = "app-time-trigger-text";
    const iconSpan = document.createElement("span");
    iconSpan.className = "app-time-icon";
    iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.4"/><path d="M8 4.8V8l2.4 1.4"/></svg>`;
    trigger.appendChild(textSpan);
    trigger.appendChild(iconSpan);
    wrap.appendChild(trigger);

    const syncLabel = () => {
      const hasVal = !!inputEl.value;
      textSpan.textContent = hasVal ? inputEl.value : (inputEl.placeholder || "시간 선택");
      textSpan.classList.toggle("app-time-placeholder", !hasVal);
    };
    syncLabel();

    trigger.onclick = () => {
      if (trigger.disabled) return;
      const wasOpen = trigger.classList.contains("open");
      closeAllAppFloatingMenus();
      if (wasOpen) return; // 토글: 열려 있었으면 닫기만 하고 끝
      trigger.classList.add("open");

      const parts = (inputEl.value || "").split(":");
      let curHour = parts[0] !== undefined && parts[0] !== "" ? parseInt(parts[0], 10) : null;
      let curMinute = parts[1] !== undefined && parts[1] !== "" ? parseInt(parts[1], 10) : null;

      const menu = document.createElement("div");
      menu.className = "app-time-menu";

      const commit = () => {
        const h = curHour === null ? 0 : curHour;
        const m = curMinute === null ? 0 : curMinute;
        inputEl.value = `${pad2(h)}:${pad2(m)}`;
        syncLabel();
        inputEl.dispatchEvent(new Event("change", { bubbles: true }));
      };

      const renderPanel = () => {
        const hourItems = Array.from({ length: 24 }, (_, h) => h)
          .map((h) => `<button type="button" class="app-time-item ${h === curHour ? "selected" : ""}" data-hour="${h}">${pad2(h)}</button>`)
          .join("");
        const minuteItems = Array.from({ length: 12 }, (_, i) => i * 5)
          .map((m) => `<button type="button" class="app-time-item ${m === curMinute ? "selected" : ""}" data-minute="${m}">${pad2(m)}</button>`)
          .join("");

        menu.innerHTML = `
          <div class="app-time-columns">
            <div class="app-time-col">
              <div class="app-time-col-label">시</div>
              <div class="app-time-col-list" data-col="hour">${hourItems}</div>
            </div>
            <div class="app-time-col">
              <div class="app-time-col-label">분</div>
              <div class="app-time-col-list" data-col="minute">${minuteItems}</div>
            </div>
          </div>
          <div class="app-date-panel-footer">
            <button type="button" class="app-date-footer-btn" data-action="now">지금</button>
            <button type="button" class="app-date-footer-btn" data-action="clear">지우기</button>
            <button type="button" class="app-date-footer-btn app-time-done" data-action="done">확인</button>
          </div>
        `;

        menu.querySelectorAll(".app-time-item[data-hour]").forEach((btn) => {
          btn.onclick = () => { curHour = parseInt(btn.getAttribute("data-hour"), 10); commit(); renderPanel(); };
        });
        menu.querySelectorAll(".app-time-item[data-minute]").forEach((btn) => {
          btn.onclick = () => { curMinute = parseInt(btn.getAttribute("data-minute"), 10); commit(); renderPanel(); };
        });
        menu.querySelector('[data-action="now"]').onclick = () => {
          const now = new Date();
          curHour = now.getHours();
          curMinute = now.getMinutes();
          commit();
          closeAllAppFloatingMenus();
        };
        menu.querySelector('[data-action="clear"]').onclick = () => {
          curHour = null; curMinute = null;
          inputEl.value = "";
          syncLabel();
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
          closeAllAppFloatingMenus();
        };
        menu.querySelector('[data-action="done"]').onclick = () => { closeAllAppFloatingMenus(); };

        // 스크롤 목록에서 지금 고른 항목이 보이도록 가운데쯤에 위치시킨다.
        menu.querySelectorAll(".app-time-col-list").forEach((list) => {
          const sel = list.querySelector(".selected");
          if (sel) list.scrollTop = sel.offsetTop - list.clientHeight / 2 + sel.clientHeight / 2;
        });
      };
      renderPanel();

      document.body.appendChild(menu);
      const rect = trigger.getBoundingClientRect();
      const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.top = `${Math.max(8, top)}px`;
      menu.style.left = `${Math.max(8, left)}px`;
      setTimeout(() => document.addEventListener("mousedown", appFloatingOutsideHandler, true), 0);
    };
  }

  // ==================== 로그인 화면 렌더링 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  async function renderLoginScreen() {
    // 안전장치: 혹시라도(예: 브라우저의 뒤로가기/앞으로가기 캐시 복원처럼 스크립트가
    // 다시 실행되지 않는 특수한 경우) 이전 화면에서 뜨던 팝업류(드롭다운/날짜·시간
    // 선택 팝업, 설정 메뉴, 동기화 배너)가 화면 위에 그대로 남아있으면, 그 투명한
    // 영역이 로그인 폼 위를 덮어서 클릭·입력이 먹히지 않는 것처럼 보일 수 있다.
    // 로그인 화면을 그리기 전에 이런 잔재를 먼저 확실히 치운다.
    if (typeof closeAllAppFloatingMenus === "function") { try { closeAllAppFloatingMenus(); } catch (e) {} }
    const staleOverlayIds = ["settings-menu", "cloud-live-banner-wrap"];
    staleOverlayIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    const nav = document.getElementById("nav");
    if (nav) nav.innerHTML = "";
    document.body.classList.add("login-screen");
    const root = document.getElementById("page-inner");
    root.classList.remove("wide");

    // 2026-09 보안 업데이트: 로그인 화면은 더 이상 계정 목록을 직접 읽지 않고
    // (비밀번호 관련 값이 전혀 없는) 안전한 서버 함수로 필요한 정보만 물어본다.
    // 자세한 배경은 supabase/auth-lockdown-migration.sql 참고.
    root.innerHTML = `<div class="login-shell"><div class="login-card login-loading">${ICON_LOCK}<div class="login-loading-text">불러오는 중…</div></div></div>`;
    let bootstrap = { hasAnyAccount: false, hasMaster: false };
    if (cloud) {
      try {
        const { data } = await cloud.rpc("get_login_bootstrap");
        if (data) bootstrap = data;
      } catch (e) { /* 오프라인 등으로 실패하면 기본값(계정 없음)으로 "계정 만들기" 탭을 먼저 보여줌 */ }
    }

    // uiState.loginStep: "id"(아이디만 입력) → "auth"(팀용이면 인원 선택+비밀번호, 개인용이면 비밀번호만)
    const uiState = {
      tab: bootstrap.hasAnyAccount ? "login" : "signup", error: "",
      loginStep: "id", loginAccount: null, signupType: "personal",
      hasMaster: !!bootstrap.hasMaster, checkingId: false,
    };

    function resetLoginStep() { uiState.loginStep = "id"; uiState.loginAccount = null; }

    // 아이디 단계 ↔ 인원선택·비밀번호 단계 전환을 "정적으로 툭 바뀌는" 대신
    // 자연스럽게 펼쳐지는/접히는 애니메이션으로 보여준다.
    // 방식: 바뀌기 전 #login-step-area의 실제 높이를 재둔 뒤 상태를 바꾸고
    // draw()로 다시 그린다. 새로 그려진 영역은 이미 최종 크기로 렌더돼 있으므로,
    // 그 높이를 목표값으로 잡고 잠깐 이전 높이로 되돌린 뒤(+살짝 투명하게) 다음
    // 프레임에서 목표 높이·불투명도로 되돌리면, 브라우저가 그 변화를 transition으로
    // 인식해서 부드럽게 이어준다(흔히 쓰는 FLIP 기법의 축약형).
    function animateLoginStepTransition(mutate) {
      const prevWrap = document.getElementById("login-step-area");
      const prevHeight = prevWrap ? prevWrap.getBoundingClientRect().height : null;
      mutate();
      draw();
      if (prevHeight == null) return; // 로그인 탭에 처음 들어온 경우 등: 애니메이션 없이 그대로 표시
      const nextWrap = document.getElementById("login-step-area");
      if (!nextWrap) return;
      const targetHeight = nextWrap.getBoundingClientRect().height;
      if (Math.abs(targetHeight - prevHeight) < 1) return; // 높이 차이가 거의 없으면 굳이 애니메이션하지 않음
      nextWrap.style.height = `${prevHeight}px`;
      nextWrap.style.opacity = "0";
      nextWrap.style.transform = "translateY(4px)";
      nextWrap.classList.add("step-animating");
      // 위에서 넣은 "시작 값"을 브라우저가 실제로 한 번 반영하게(리플로우) 강제로
      // 읽어들인 뒤에 "끝 값"을 넣어야, 두 값의 차이를 transition으로 인식해서
      // 부드럽게 이어준다. 그냥 연달아 대입하면 중간 과정 없이 바로 끝 값으로 점프한다.
      void nextWrap.offsetHeight;
      nextWrap.style.height = `${targetHeight}px`;
      nextWrap.style.opacity = "1";
      nextWrap.style.transform = "translateY(0)";
      const cleanup = () => {
        // 애니메이션이 끝나면 인라인 스타일을 지워서, 이후 이 단계 안에서 에러
        // 메시지가 뜨는 등 내용이 다시 바뀔 때 높이가 auto로 자연스럽게 따라가게 한다.
        nextWrap.classList.remove("step-animating");
        nextWrap.style.height = "";
        nextWrap.style.opacity = "";
        nextWrap.style.transform = "";
        nextWrap.removeEventListener("transitionend", cleanup);
      };
      nextWrap.addEventListener("transitionend", cleanup);
    }

    function draw() {
      const hasMaster = uiState.hasMaster;
      const loginAcc = uiState.loginAccount;
      const isTeamLogin = !!loginAcc && loginAcc.accountType === "team";
      const teamMembers = isTeamLogin && Array.isArray(loginAcc.teamMembers) ? loginAcc.teamMembers : [];
      root.innerHTML = `
        <div class="login-shell">
          <div class="login-card">
            <div class="login-badge">${ICON_LOCK}</div>
            <div class="login-title">업무 종합 관리</div>
            <div class="login-tabs">
              <button class="login-tab ${uiState.tab === "login" ? "active" : ""}" data-tab="login">로그인</button>
              <button class="login-tab ${uiState.tab === "signup" ? "active" : ""}" data-tab="signup">계정 만들기</button>
            </div>
            ${uiState.error ? `<div class="login-error">${esc(uiState.error)}</div>` : ""}
            ${uiState.tab === "login" ? `
              <div class="login-step-area" id="login-step-area">
                ${uiState.loginStep === "id" ? `
                  <form class="login-form" id="login-id-form">
                    <label class="login-field"><span>아이디</span>
                      <input class="add-input" id="login-username" autocomplete="username" placeholder="아이디">
                    </label>
                    <button type="submit" class="primary-btn login-submit" ${uiState.checkingId ? "disabled" : ""}>${uiState.checkingId ? "확인 중…" : "로그인"}</button>
                  </form>
                ` : `
                  <button type="button" class="login-back-link" id="login-back-btn">← 다른 계정으로</button>
                  <div class="login-selected-account">
                    <b>${esc(loginAcc.username)}</b>${isTeamLogin ? ' <span class="badge sm type">팀용</span>' : ""}
                  </div>
                  <form class="login-form" id="login-auth-form">
                    ${isTeamLogin ? `
                      <label class="login-field"><span>로그인 인원</span>
                        <select class="add-input" id="login-member" ${!teamMembers.length ? "disabled" : ""}>
                          <option value="">${teamMembers.length ? "선택해주세요" : "등록된 인원이 없어요"}</option>
                          ${teamMembers.map((m) => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join("")}
                        </select>
                      </label>
                      ${!teamMembers.length ? `<div class="login-accounts-hint">아직 등록된 로그인 인원이 없어요. 마스터 계정에서 먼저 추가해달라고 해주세요.</div>` : ""}
                    ` : ""}
                    <label class="login-field"><span>비밀번호</span>
                      <input class="add-input" id="login-password" type="password" autocomplete="current-password" placeholder="비밀번호">
                    </label>
                    <button type="submit" class="primary-btn login-submit" ${isTeamLogin && !teamMembers.length ? "disabled" : ""}>로그인</button>
                  </form>
                `}
              </div>
            ` : `
              <form class="login-form" id="signup-form">
                <label class="login-field"><span>아이디</span>
                  <input class="add-input" id="signup-username" autocomplete="username" placeholder="아이디">
                </label>
                <label class="login-field"><span>계정 유형</span>
                  <div class="login-type-radios">
                    <label class="login-type-radio"><input type="radio" name="signup-type" value="personal" ${uiState.signupType === "team" ? "" : "checked"}> 개인용</label>
                    <label class="login-type-radio"><input type="radio" name="signup-type" value="team" ${uiState.signupType === "team" ? "checked" : ""}> 팀용</label>
                  </div>
                  ${uiState.signupType === "team" ? `<span class="login-master-hint">팀용은 여러 명이 비밀번호 하나를 같이 쓰고, 로그인할 때 인원만 골라요. 로그인 인원은 나중에 마스터 계정에서 추가할 수 있어요.</span>` : ""}
                </label>
                <label class="login-field"><span>비밀번호</span>
                  <input class="add-input" id="signup-password" type="password" autocomplete="new-password" placeholder="비밀번호 (6자 이상)">
                </label>
                <label class="login-field"><span>비밀번호 확인</span>
                  <input class="add-input" id="signup-password2" type="password" autocomplete="new-password" placeholder="비밀번호 확인">
                </label>
                ${!hasMaster ? `
                  <label class="login-master-check">
                    <input type="checkbox" id="signup-master">
                    <span>이 계정을 마스터 계정으로 만들기 <span class="login-master-hint">(마스터 계정은 다른 모든 계정을 선택해서 들어가보고, 삭제할 수 있어요. 아직 마스터 계정이 없어서 지금만 선택할 수 있어요.)</span></span>
                  </label>
                ` : ""}
                <button type="submit" class="primary-btn login-submit">계정 만들고 시작하기</button>
              </form>
            `}
          </div>
        </div>
      `;

      root.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.onclick = () => { uiState.tab = btn.getAttribute("data-tab"); uiState.error = ""; resetLoginStep(); draw(); };
      });

      const backBtn = document.getElementById("login-back-btn");
      if (backBtn) {
        backBtn.onclick = () => { animateLoginStepTransition(() => { uiState.error = ""; resetLoginStep(); }); };
      }

      // 단계가 바뀔 때마다(아이디 입력→인증 단계) 커서를 직접 옮길 필요 없이 바로
      // 입력할 수 있게, 지금 단계에 맞는 입력칸에 자동으로 포커스를 준다.
      if (uiState.tab === "login") {
        if (uiState.loginStep === "id") {
          const usernameField = document.getElementById("login-username");
          if (usernameField) usernameField.focus();
        } else {
          const memberSelect = document.getElementById("login-member");
          if (memberSelect) enhanceSelect(memberSelect);
          const memberTrigger = document.getElementById("login-member-trigger");
          const passwordField = document.getElementById("login-password");
          if (isTeamLogin && memberSelect && !memberSelect.value) {
            // 팀용 계정: 인원을 먼저 골라야 하니 인원 선택 버튼에 포커스해두고,
            // 인원을 고르는 순간 바로 비밀번호 칸으로 넘어가게 한다.
            if (memberTrigger) memberTrigger.focus();
          } else if (passwordField) {
            passwordField.focus();
          }
          if (memberSelect) {
            memberSelect.addEventListener("change", () => {
              if (memberSelect.value && passwordField) passwordField.focus();
            });
          }
        }
      }

      const loginIdForm = document.getElementById("login-id-form");
      if (loginIdForm) {
        loginIdForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("login-username").value.trim();
          if (!username) { uiState.error = "아이디를 입력해주세요."; draw(); return; }
          if (!cloud) { uiState.error = "클라우드 연결이 필요해요. 인터넷 연결을 확인한 뒤 다시 시도해주세요."; draw(); return; }
          uiState.error = "";
          uiState.checkingId = true;
          draw();
          let info = null;
          try {
            const { data } = await cloud.rpc("get_login_account_info", { p_username: username });
            info = data || null;
          } catch (err) { /* 아래에서 "계정 없음"으로 처리 */ }
          uiState.checkingId = false;
          if (!info) { uiState.error = "등록된 계정이 없어요."; draw(); return; }
          animateLoginStepTransition(() => {
            uiState.loginAccount = info;
            uiState.loginStep = "auth";
            uiState.error = "";
          });
        };
      }

      const loginAuthForm = document.getElementById("login-auth-form");
      if (loginAuthForm) {
        loginAuthForm.onsubmit = async (e) => {
          e.preventDefault();
          const account = uiState.loginAccount;
          if (!account) { resetLoginStep(); draw(); return; }
          let member = null;
          if (account.accountType === "team") {
            const memberSelect = document.getElementById("login-member");
            const memberId = memberSelect ? memberSelect.value : "";
            if (!memberId) { uiState.error = "로그인 인원을 선택해주세요."; draw(); return; }
            member = (Array.isArray(account.teamMembers) ? account.teamMembers : []).find((m) => m.id === memberId) || null;
            if (!member) { uiState.error = "로그인 인원을 다시 선택해주세요."; draw(); return; }
          }
          const password = document.getElementById("login-password").value;
          if (!password) { uiState.error = "비밀번호를 입력해주세요."; draw(); return; }

          // 아직 예전 방식으로 남아있는 계정이면, 이번 로그인에서 서버(Edge Function)가
          // 비밀번호를 한 번 확인하고 그 즉시 새 방식(사람 비밀번호 = 실제 로그인 비밀번호)으로
          // 전환해준다 — 비밀번호 해시는 이 과정에서 한 번도 브라우저 메모리 밖으로 나가지 않는다.
          if (!account.authMigrated) {
            const migrate = await cloudMigrateLegacyLogin(account.username, password);
            if (!migrate.ok) {
              uiState.error = /올바르지/.test(migrate.reason || "") ? "아이디 또는 비밀번호가 올바르지 않아요." : (migrate.reason || "로그인에 실패했어요.");
              draw();
              return;
            }
          }
          const cloudAuth = await cloudAuthSignInDirect(account.username, password);
          if (!cloudAuth.ok) {
            uiState.error = "아이디 또는 비밀번호가 올바르지 않아요.";
            draw();
            return;
          }
          setSession(account.id);
          setTeamLoginMember(member ? { id: member.id, name: member.name } : null);
          touchLastActive();
          try { sessionStorage.setItem("app:just-logged-in", "1"); } catch (e) {}
          await flushCloudWrites();
          location.reload();
        };
      }
      const signupForm = document.getElementById("signup-form");
      if (signupForm) {
        root.querySelectorAll('input[name="signup-type"]').forEach((radio) => {
          radio.onchange = () => { uiState.signupType = radio.value; draw(); };
        });
        signupForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("signup-username").value.trim();
          const password = document.getElementById("signup-password").value;
          const password2 = document.getElementById("signup-password2").value;
          if (!username || !password) { uiState.error = "아이디와 비밀번호를 입력해주세요."; draw(); return; }
          if (password.length < 6) { uiState.error = "비밀번호는 6자 이상으로 만들어주세요."; draw(); return; }
          if (password !== password2) { uiState.error = "비밀번호 확인이 일치하지 않아요."; draw(); return; }
          if (!cloud) { uiState.error = "클라우드 연결이 필요해요. 인터넷 연결을 확인한 뒤 다시 시도해주세요."; draw(); return; }
          try {
            const { data } = await cloud.rpc("get_login_account_info", { p_username: username });
            if (data) { uiState.error = "이미 사용 중인 아이디예요."; draw(); return; }
          } catch (err) { /* 확인 실패해도 가입 자체는 시도(가입 단계에서 중복이면 다시 걸러짐) */ }
          // 사람이 정한 비밀번호로 곧장 Supabase Auth에 가입한다(아래 계정을 만들기 전에
          // 먼저 해서, 여기서 실패하면 로컬 계정도 만들지 않는다 — 둘이 어긋나면 다음
          // 로그인부터 곤란해지기 때문).
          const cloudAuth = await cloudAuthSignUpDirect(username, password);
          if (!cloudAuth.ok) {
            uiState.error = `클라우드 연결에 실패해서 계정을 만들지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해주세요. (${cloudAuth.reason})`;
            draw();
            return;
          }
          // 이제 막 로그인 세션이 생겼으니, 다른 팀원들이 이미 만들어둔 계정 목록을 먼저
          // 서버에서 새로 받아온 뒤에(이 브라우저에 예전에 캐시된 게 없을 수 있으므로)
          // 내 계정을 추가해야, 저장할 때 다른 사람 계정을 실수로 지워버리지 않는다.
          if (typeof cloudHydrate === "function") { try { await cloudHydrate(); } catch (e) {} }
          const accountsList = loadAccounts();
          const wantsMaster = !uiState.hasMaster && !!document.getElementById("signup-master") && document.getElementById("signup-master").checked;
          const typeInput = document.querySelector('input[name="signup-type"]:checked');
          const accountType = typeInput && typeInput.value === "team" ? "team" : "personal";
          const newAccount = {
            id: genId(), username, createdAt: new Date().toISOString(), isMaster: wantsMaster,
            accountType, teamMembers: accountType === "team" ? [] : undefined,
            authMigrated: true,
          };
          accountsList.push(newAccount);
          saveAccounts(accountsList);
          setSession(newAccount.id);
          clearTeamLoginMember();
          touchLastActive();
          try { sessionStorage.setItem("app:just-logged-in", "1"); } catch (e) {}
          await flushCloudWrites();
          location.reload();
        };
      }
    }

    draw();
  }

  // ==================== 현재 계정 컨텍스트 부트스트랩, KST 시간 헬퍼, 활동 로그, 앱 상태(state)·페이지 이동 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  // 세션 확인: 로그인 상태가 아니면 로그인 화면만 그리고 나머지 앱 코드는 실행하지 않는다.
  const _session = getSession();
  let _account = _session ? findAccountById(_session) : null;
  // 하트비트 확인: 마지막으로 이 앱이 열려 있었던 시각으로부터 너무 오래(컴퓨터를
  // 껐다 켤 정도로) 지났으면 자동으로 로그아웃 처리한다. 탭만 잠깐 닫았다 연 경우처럼
  // 그 안에 다시 열렸다면 로그인 상태를 그대로 유지한다.
  if (_account) {
    const lastActive = getLastActive();
    if (!lastActive || Date.now() - lastActive >= SESSION_GAP_LIMIT_MS) {
      clearSession();
      clearMasterOrigin();
      clearLastActive();
      clearTeamLoginMember();
      _account = null;
    }
  }
  if (!_account) {
    renderLoginScreen();
    return;
  }
  _appBooted = true; // 이 시점부터는 renderApp()이 쓰는 값들이 전부 준비됨 — 실시간/탭전환 리스너가 다시 정상 동작해도 안전하다.
  // 자정 자동 백업은 이제 여기서(클라이언트) 만들지 않고, 서버 쪽 Discord 백업
  // 엣지펑션(discord-backup-upload, pg_cron 매일 00:05 KST)이 전담합니다.
  // runDailyAutoBackupIfNeeded().catch(() => {});
  document.body.classList.remove("login-screen");
  const CURRENT_ACCOUNT_ID = _account.id;
  const CURRENT_ACCOUNT_NAME = _account.username;
  const CURRENT_ACCOUNT_IS_MASTER = !!_account.isMaster;
  // 팀용 계정은 여러 명이 하나의 계정(비밀번호)을 같이 쓰되, 로그인할 때 고른 "인원"
  // 이름표를 함께 들고 있는다. 개인용 계정이거나, 옛날에 만들어져 accountType이 아예
  // 없는 계정은 전부 "personal"로 취급한다.
  const CURRENT_ACCOUNT_TYPE = _account.accountType === "team" ? "team" : "personal";
  const CURRENT_TEAM_MEMBER = CURRENT_ACCOUNT_TYPE === "team" ? getTeamLoginMember() : null;
  const CURRENT_ACCOUNT_DISPLAY_NAME = CURRENT_TEAM_MEMBER ? `${CURRENT_ACCOUNT_NAME} (${CURRENT_TEAM_MEMBER.name})` : CURRENT_ACCOUNT_NAME;
  // 마스터 계정이 다른 계정으로 들어와서 보고 있는 중인지 확인 (원래 마스터 계정 정보가 남아있는지로 판단)
  const _masterOriginId = getMasterOrigin();
  const MASTER_ORIGIN_ACCOUNT = _masterOriginId && _masterOriginId !== CURRENT_ACCOUNT_ID ? findAccountById(_masterOriginId) : null;
  if (_masterOriginId && !MASTER_ORIGIN_ACCOUNT) clearMasterOrigin();
  // 계정별로 데이터를 분리하기 위해 저장 키 앞에 이 접두어를 붙인다.
  function acctKey(key) { return `acct:${CURRENT_ACCOUNT_ID}:${key}`; }

  /* ===================== 📋 계정 활동 로그 (마스터 전용) =====================
     각 계정에서 실제 데이터(할일/메모/상담사/면담일지/QA/스케줄 등)가 저장될 때마다
     "언제 · 누가 · 어디서(어떤 메뉴) · 무엇이 어떻게 바뀌었는지"를 간단히 기록해서
     쌓아둔다. 이 로그 자체도 클라우드(kv_store)에 함께 저장되므로, 다른 관리자의
     브라우저에서 생긴 활동도 마스터 계정이라면 새로고침 후 같이 볼 수 있다.
     계정 목록 자체를 다루는 동작(비밀번호 초기화·이름 변경·삭제)은 acct: 접두어를
     쓰지 않으므로, 해당 함수(resetAccountPassword 등) 안에서 직접 기록한다. */
  /* ---- 시각 표시는 항상 한국 표준시(KST, UTC+9)로 ----
     저장은 new Date().toISOString()(UTC)로 하고, 화면에 보여줄 때 이 함수들을 거쳐
     KST로 변환한다. 이렇게 해야 보고 있는 사람의 브라우저 시간대 설정과 무관하게
     항상 한국 시간 기준으로 보인다. (한국은 서머타임이 없어서 항상 UTC+9 고정이면 된다.) */
  function _toKSTParts(iso) {
    if (!iso) return null;
    const t = Date.parse(iso);
    if (isNaN(t)) return null;
    const kst = new Date(t + 9 * 60 * 60 * 1000);
    return {
      y: kst.getUTCFullYear(), mo: pad2(kst.getUTCMonth() + 1), da: pad2(kst.getUTCDate()),
      h: pad2(kst.getUTCHours()), mi: pad2(kst.getUTCMinutes()),
    };
  }
  function formatKSTDateTime(iso) {
    const p = _toKSTParts(iso);
    return p ? `${p.y}-${p.mo}-${p.da} ${p.h}:${p.mi}` : "-";
  }
  function formatKSTTime(iso) {
    const p = _toKSTParts(iso);
    return p ? `${p.h}:${p.mi}` : "";
  }

  const ACTIVITY_LOG_KEY = "activity-log:entries";
  const ACTIVITY_LOG_MAX = 500; // 너무 오래 쌓이지 않도록 최신 N건만 유지
  const ACTIVITY_LOG_RETENTION_DAYS = 30; // 이보다 오래된 로그는 자동으로 정리
  function _pruneOldActivityEntries(list) {
    const cutoff = Date.now() - ACTIVITY_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    return list.filter((e) => {
      const ts = Date.parse(e.endedAt || e.at || "");
      return isNaN(ts) ? true : ts >= cutoff; // 날짜를 못 읽으면 안전하게 남겨둔다
    });
  }
  function loadActivityLog() {
    try {
      const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function appendActivityLog(entry) {
    try {
      let list = loadActivityLog();
      list.unshift(Object.assign({ id: genId(), at: new Date().toISOString() }, entry));
      list = _pruneOldActivityEntries(list);
      if (list.length > ACTIVITY_LOG_MAX) list.length = ACTIVITY_LOG_MAX;
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(list));
    } catch (e) { /* 로그 저장 실패가 실제 데이터 저장에 영향을 주면 안 된다 */ }
  }
  // 새 활동이 한동안 없어도(=appendActivityLog가 한동안 안 불려도) 30일 지난
  // 로그는 앱을 열 때마다 한 번씩 조용히 정리한다.
  function pruneActivityLogIfStale() {
    try {
      const list = loadActivityLog();
      const pruned = _pruneOldActivityEntries(list);
      if (pruned.length !== list.length) localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(pruned));
    } catch (e) {}
  }
  function clearActivityLog() {
    try { localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify([])); } catch (e) {}
  }
  // acct:{id}:personal-xxx:... 형태의 저장 키에서 "어디서 바뀌었는지" 카테고리를 찾아낸다.
  // (BACKUP_CATEGORIES를 그대로 재사용해 백업 화면의 분류와 일관성을 맞춘다.)
  function activityCategoryForRelKey(relKey) {
    const cat = BACKUP_CATEGORIES.find((c) => c.keyPrefixes.some((p) => relKey.indexOf(p) === 0));
    if (cat) return { key: cat.key, label: cat.label };
    return { key: "etc", label: "기타" };
  }
  // 캘린더처럼 한 카테고리 안에 저장 키가 여러 개(월별 일정 / 할 일 목록)로 나뉜 경우,
  // 리스트에서 조금 더 구체적으로 어디가 바뀌었는지 보여주기 위한 부가 설명.
  function activitySubLabel(relKey) {
    if (relKey === "personal-calendar:todos") return "할 일 목록";
    const m = /^personal-calendar:(\d{4}-\d{2})$/.exec(relKey);
    if (m) return `${m[1]} 캘린더 일정`;
    return "";
  }
  function _activityItemLabel(item) {
    if (item === null || item === undefined) return "(없음)";
    if (typeof item !== "object") return String(item);
    const v = item.name || item.title || item.content || item.username || item.label || item.date;
    if (v) return String(v).slice(0, 40);
    return item.id ? `#${item.id}` : "항목";
  }
  function _activityScalar(v) {
    if (v === undefined) return "(없음)";
    if (v === null) return "(비어있음)";
    if (typeof v === "object") { try { return JSON.stringify(v).slice(0, 60); } catch (e) { return "(객체)"; } }
    const s = String(v);
    if (s === "") return "(빈 값)";
    return s.length > 60 ? `${s.slice(0, 60)}…` : s;
  }
  // 저장 전/후 값을 비교해 사람이 읽을 수 있는 변경 내역 줄들을 만든다. 배열은 id 기준으로
  // 추가/삭제/수정을 구분하고, 객체는 키 기준으로(최대 2단계까지) 비교한다. 완벽한 diff는
  // 아니지만 "대략 뭐가 바뀌었는지" 파악하기엔 충분한 수준을 목표로 한다.
  function diffActivityValues(oldVal, newVal, depth) {
    const lines = [];
    if (oldVal === undefined && newVal !== undefined) return ["새로 만들어졌어요."];
    if (oldVal !== undefined && newVal === undefined) return ["삭제됐어요."];
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      const idBased = (oldVal.length && oldVal.every((x) => x && typeof x === "object" && x.id != null))
        || (newVal.length && newVal.every((x) => x && typeof x === "object" && x.id != null));
      if (idBased) {
        const oldMap = {}; oldVal.forEach((x) => { if (x && x.id != null) oldMap[x.id] = x; });
        const newMap = {}; newVal.forEach((x) => { if (x && x.id != null) newMap[x.id] = x; });
        Object.keys(newMap).forEach((id) => {
          if (!(id in oldMap)) { lines.push(`+ 추가됨: ${_activityItemLabel(newMap[id])}`); return; }
          const fieldLines = diffActivityValues(oldMap[id], newMap[id], (depth || 0) + 1);
          if (fieldLines.length) lines.push(`✎ 수정됨: ${_activityItemLabel(newMap[id])} — ${fieldLines.join(" / ")}`);
        });
        Object.keys(oldMap).forEach((id) => {
          if (!(id in newMap)) lines.push(`- 삭제됨: ${_activityItemLabel(oldMap[id])}`);
        });
      } else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        lines.push(oldVal.length === newVal.length ? "목록 내용이 바뀌었어요." : `목록 항목 수: ${oldVal.length}개 → ${newVal.length}개`);
      }
      return lines;
    }
    if (oldVal && newVal && typeof oldVal === "object" && typeof newVal === "object") {
      if ((depth || 0) >= 3) {
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) lines.push("내용이 바뀌었어요.");
        return lines;
      }
      const keys = Array.from(new Set(Object.keys(oldVal).concat(Object.keys(newVal))));
      keys.forEach((k) => {
        const ov = oldVal[k];
        const nv = newVal[k];
        if (JSON.stringify(ov) === JSON.stringify(nv)) return;
        if (ov && nv && typeof ov === "object" && typeof nv === "object") {
          const sub = diffActivityValues(ov, nv, (depth || 0) + 1);
          if (sub.length) sub.forEach((s) => lines.push(`${k}.${s}`));
          else lines.push(`${k}: 내용이 바뀌었어요.`);
        } else {
          lines.push(`${k}: ${_activityScalar(ov)} → ${_activityScalar(nv)}`);
        }
      });
      return lines;
    }
    if (oldVal !== newVal) lines.push(`${_activityScalar(oldVal)} → ${_activityScalar(newVal)}`);
    return lines;
  }
  function buildActivityDiffLines(oldRaw, newRaw) {
    if (oldRaw === newRaw) return [];
    let oldVal, newVal;
    try { oldVal = oldRaw != null ? JSON.parse(oldRaw) : undefined; } catch (e) { oldVal = oldRaw; }
    try { newVal = newRaw != null ? JSON.parse(newRaw) : undefined; } catch (e) { newVal = newRaw; }
    const lines = diffActivityValues(oldVal, newVal, 0);
    if (lines.length > 40) return lines.slice(0, 40).concat([`...외 ${lines.length - 40}건 더`]);
    return lines.length ? lines : ["내용이 바뀌었어요."];
  }

  /* ---- 활동 로그는 즉시 기록한다 ----
     예전에는 한 계정에서 짧은 시간(3분) 안에 생긴 변경들을 클라우드의 임시 저장소
     (activity-log:pending)에 모아뒀다가, 3분이 지나야 실제 목록(activity-log:entries)
     으로 확정하는 방식이었다. 이 "3분 묶음"은 마스터 계정의 활동 로그 화면을 깔끔하게
     보여주기 위한 것이었는데, 문제는 이 지연이 스케줄 셀 "수정 이력 보기"에도 그대로
     적용돼서 — 방금 고친 셀이 최대 3분 동안 이력에 전혀 안 보이는 부작용이 있었다.
     그래서 저장(기록) 자체는 항상 즉시 하나의 로그 항목으로 남기고, "여러 변경을 하나로
     묶어 보여주는 것"은 마스터 계정의 활동 로그 화면(10-master.js)에서 화면에 그릴 때만
     (표시 전용으로) 묶어서 보여주도록 바꿨다. 그래야 실제 데이터(activity-log:entries)는
     항상 최신 상태이고, 셀 수정 이력도 곧바로 반영된다. */
  // 마스터 활동 로그 화면에서 "짧은 시간 안의 여러 변경"을 한 줄로 묶어 보여줄 때
  // 쓰는 창(표시 전용). 실제 저장 시점과는 무관하다.
  const ACTIVITY_DISPLAY_GROUP_MS = 3 * 60 * 1000;
  function recordActivityChange(change) {
    const timeLabel = formatKSTTime(new Date().toISOString());
    const where = change.subLabel ? `${change.categoryLabel} · ${change.subLabel}` : change.categoryLabel;
    const diffLines = (change.diff && change.diff.length ? change.diff : ["내용이 바뀌었어요."])
      .map((line) => `[${timeLabel}] ${where} — ${line}`);
    appendActivityLog({
      accountId: change.accountId,
      accountName: change.accountName,
      viaMasterName: change.viaMasterName,
      categoryKey: change.categoryKey,
      categoryLabel: change.categoryLabel,
      subLabel: change.subLabel,
      diff: diffLines,
    });
  }
  pruneActivityLogIfStale();

  // acct:{계정id}:{나머지 키} 형태의 저장에만 반응해서 활동 로그를 남긴다. 계정 목록
  // (비밀번호/이름/삭제)처럼 이 접두어를 쓰지 않는 값은 여기서 잡히지 않고, 해당
  // 동작을 하는 함수(renameAccount 등) 안에서 직접 appendActivityLog를 호출한다.
  const _preActivityLogSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    const m = typeof key === "string" ? /^acct:([^:]+):(.+)$/.exec(key) : null;
    let oldRaw = null;
    if (m) { try { oldRaw = localStorage.getItem(key); } catch (e) {} }
    _preActivityLogSetItem(key, value);
    if (!m || oldRaw === value) return; // 실제로 값이 바뀐 경우에만 기록
    try {
      const accountId = m[1];
      const relKey = m[2];
      const acc = accountId === CURRENT_ACCOUNT_ID ? { username: CURRENT_ACCOUNT_DISPLAY_NAME } : (findAccountById(accountId) || {});
      const cat = activityCategoryForRelKey(relKey);
      recordActivityChange({
        accountId,
        accountName: acc.username || "(삭제된 계정)",
        viaMasterName: MASTER_ORIGIN_ACCOUNT ? MASTER_ORIGIN_ACCOUNT.username : null,
        categoryKey: cat.key,
        categoryLabel: cat.label,
        subLabel: activitySubLabel(relKey),
        diff: buildActivityDiffLines(oldRaw, value),
      });
    } catch (e) { /* 로그 기록 실패가 실제 저장에 영향을 주면 안 된다 */ }
  };


  // 화면 오른쪽 아래 "새로고침" 버튼을 누르면, 다른 사람/다른 기기에서 바뀐 내용을
  // 서버에서 다시 받아오기 위해 페이지를 실제로 다시 불러온다(location.reload()).
  // 다만 이 경우에는 평소처럼 "홈"으로 돌아가지 않고, 누르기 직전에 보고 있던
  // 페이지를 그대로 유지해야 하므로, 새로고침 직전에 sessionStorage에 현재 페이지를
  // 잠깐 남겨두고 새로 불러온 뒤 한 번만 복원하고 지운다.
  // 방금 로그인/계정 생성으로 들어온 경우에만(=이 새로고침이 로그인 직후인 경우에만)
  // "오늘의 브리핑" 히어로 팝업을 한 번 띄운다. 세션 유지 중 브라우저를 새로 열거나
  // "새로고침" 버튼을 눌렀을 때는 뜨지 않는다.
  let _justLoggedIn = false;
  try {
    if (sessionStorage.getItem("app:just-logged-in") === "1") {
      _justLoggedIn = true;
      sessionStorage.removeItem("app:just-logged-in");
    }
  } catch (e) {}

  const REFRESH_RESTORE_PAGE_KEY = "app:refresh-restore-page";
  const VALID_PAGES = ["home", "calendar", "agents", "notes", "interviews", "qa", "schedule"];
  let _refreshRestorePage = null;
  try {
    const saved = sessionStorage.getItem(REFRESH_RESTORE_PAGE_KEY);
    sessionStorage.removeItem(REFRESH_RESTORE_PAGE_KEY);
    if (saved && VALID_PAGES.indexOf(saved) !== -1) _refreshRestorePage = saved;
  } catch (e) {}

  const state = {
    // 마스터 계정은 다른 페이지를 볼 필요가 없으므로 항상 "계정 관리" 페이지만 보여준다.
    // 마스터가 아닌 계정은 (로그인 직후든, 세션이 유지된 채 브라우저를 껐다 켰든)
    // 앱을 새로 열 때마다 항상 "홈" 화면을 메인으로 보여준다. 이전에 보던
    // 페이지를 기억해서 복원하지 않는다. 예외적으로, "새로고침" 버튼을 눌러서
    // 다시 불러온 경우에는 누르기 직전 페이지를 그대로 복원한다.
    page: CURRENT_ACCOUNT_IS_MASTER ? "master" : (_refreshRestorePage || "home"),
  };

  // "새로고침" 버튼 클릭 핸들러: 지금 보던 페이지를 기억해두고 나서 새로 불러온다.
  // cloudHydrate()가 페이지를 새로 불러올 때 다시 실행되므로, 서버에 가장 최근에
  // 저장된 내용으로 자연스럽게 갱신된다.
  function performServerRefresh() {
    try { sessionStorage.setItem(REFRESH_RESTORE_PAGE_KEY, state.page); } catch (e) {}
    location.reload();
  }

  // 목록에서 눌러서 펼쳐본 상태(면담일지 펼침, 캘린더/할일 상세 펼침, 메모 펼침, "더보기" 등)는
  // 그 화면을 잠깐 보다가 떠나면 초기화해서, 나중에 다시 들어올 때는 항상 접힌 채로 깔끔하게
  // 보이게 한다. 전역 검색 결과를 눌러 다른 화면의 특정 항목을 펼쳐서 보여주는 기능은 "이동할
  // 목적지" 화면의 상태를 미리 켜둔 뒤 setPage를 호출하는 방식이라, 여기서는 "떠나는 화면"의
  // 상태만 초기화해야 서로 부딪히지 않는다.
  function _resetExpandedStateForPage(p) {
    if (p === "home") {
      if (typeof homeUi !== "undefined") homeUi.interviewAlertExpanded = false;
    } else if (p === "calendar") {
      if (typeof cal !== "undefined") { cal.expandedEntries = {}; cal.upcomingExpanded = false; }
      if (typeof todoUi !== "undefined") { todoUi.expanded = {}; todoUi.doneExpanded = false; }
    } else if (p === "notes") {
      if (typeof notesUi !== "undefined") notesUi.expanded = {};
    } else if (p === "interviews") {
      if (typeof interviewsUi !== "undefined") interviewsUi.expandedIds = new Set();
    }
  }

  // opts.year / opts.monthIndex를 넘기면 "월별 스케줄"·"품질 관리" 페이지를 그 달로 열어준다
  // (예: 월마감 확인 팝업에서 지난달 항목을 눌렀을 때). 넘기지 않으면 기존과 동일하게
  // 항상 실시간 기준 당월을 보여준다.
  function setPage(p, opts) {
    // 마스터 계정은 계정 관리 페이지 외에는 이동하지 않는다.
    if (CURRENT_ACCOUNT_IS_MASTER) { state.page = "master"; renderApp(); return; }
    if (p !== state.page) _resetExpandedStateForPage(state.page); // 떠나는 화면의 펼침 상태 초기화
    const hasTargetMonth = !!(opts && typeof opts.year === "number" && typeof opts.monthIndex === "number");
    // "월별 스케줄" 카테고리를 누르면 기본적으로 실시간 기준 당월 스케줄을 보여준다.
    if (p === "schedule" && typeof scheduleUi !== "undefined") {
      scheduleUi.year = hasTargetMonth ? opts.year : today.getFullYear();
      scheduleUi.monthIndex = hasTargetMonth ? opts.monthIndex : today.getMonth();
    }
    // "품질 관리" 카테고리를 누르면 기본적으로 실시간 기준 당월 QA 점수를 보여준다.
    if (p === "qa" && typeof qaUi !== "undefined") {
      qaUi.year = hasTargetMonth ? opts.year : today.getFullYear();
      qaUi.monthIndex = hasTargetMonth ? opts.monthIndex : today.getMonth();
    }
    // 이제 마지막으로 보던 페이지를 저장/복원하지 않으므로(항상 홈에서 시작),
    // localStorage에 따로 기록하지 않는다.
    state.page = p;
    renderApp();
  }

  // ==================== 요일/월 이름, 대한민국 공휴일 데이터 (여러 화면에서 공유해서 씀) ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ===================== 캘린더 모듈 ===================== */
  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  // 테스트에서는 날짜를 고정할 수 있고, 실제 앱에서는 항상 현재 날짜를 사용한다.
  const today = new Date(typeof __CALENDAR_TEST_TODAY__ !== "undefined" ? __CALENDAR_TEST_TODAY__ : Date.now());

  // 대한민국 공휴일 (2026년~2030년, 대체공휴일 포함). 설날/추석/부처님오신날은 음력 기준이라
  // 해마다 날짜가 달라지므로 연도별로 직접 지정한다. 출처: 인사혁신처 고시 기준 공휴일 안내.
  const KR_HOLIDAYS = {
    // 2026년
    "2026-01-01": "신정",
    "2026-02-16": "설날연휴",
    "2026-02-17": "설날",
    "2026-02-18": "설날연휴",
    "2026-03-01": "삼일절",
    "2026-03-02": "대체공휴일",
    "2026-05-01": "노동절",
    "2026-05-05": "어린이날",
    "2026-05-24": "부처님오신날",
    "2026-05-25": "대체공휴일",
    "2026-06-03": "지방선거일",
    "2026-06-06": "현충일",
    "2026-07-17": "제헌절",
    "2026-08-15": "광복절",
    "2026-08-17": "대체공휴일",
    "2026-09-24": "추석연휴",
    "2026-09-25": "추석",
    "2026-09-26": "추석연휴",
    "2026-10-03": "개천절",
    "2026-10-05": "대체공휴일",
    "2026-10-09": "한글날",
    "2026-12-25": "기독탄신일",
    // 2027년
    "2027-01-01": "신정",
    "2027-02-06": "설날연휴",
    "2027-02-07": "설날",
    "2027-02-08": "설날연휴",
    "2027-02-09": "대체공휴일",
    "2027-03-01": "삼일절",
    "2027-05-01": "노동절",
    "2027-05-03": "대체공휴일",
    "2027-05-05": "어린이날",
    "2027-05-13": "부처님오신날",
    "2027-06-06": "현충일",
    "2027-07-17": "제헌절",
    "2027-07-19": "대체공휴일",
    "2027-08-15": "광복절",
    "2027-08-16": "대체공휴일",
    "2027-09-14": "추석연휴",
    "2027-09-15": "추석",
    "2027-09-16": "추석연휴",
    "2027-10-03": "개천절",
    "2027-10-04": "대체공휴일",
    "2027-10-09": "한글날",
    "2027-10-11": "대체공휴일",
    "2027-12-25": "기독탄신일",
    "2027-12-27": "대체공휴일",
    // 2028년
    "2028-01-01": "신정",
    "2028-01-26": "설날연휴",
    "2028-01-27": "설날",
    "2028-01-28": "설날연휴",
    "2028-03-01": "삼일절",
    "2028-04-12": "국회의원선거일",
    "2028-05-01": "노동절",
    "2028-05-02": "부처님오신날",
    "2028-05-05": "어린이날",
    "2028-06-06": "현충일",
    "2028-07-17": "제헌절",
    "2028-08-15": "광복절",
    "2028-10-02": "추석연휴",
    "2028-10-03": "개천절·추석",
    "2028-10-04": "추석연휴",
    "2028-10-05": "대체공휴일",
    "2028-10-09": "한글날",
    "2028-12-25": "기독탄신일",
    // 2029년
    "2029-01-01": "신정",
    "2029-02-12": "설날연휴",
    "2029-02-13": "설날",
    "2029-02-14": "설날연휴",
    "2029-03-01": "삼일절",
    "2029-05-01": "노동절",
    "2029-05-05": "어린이날",
    "2029-05-07": "대체공휴일",
    "2029-05-20": "부처님오신날",
    "2029-05-21": "대체공휴일",
    "2029-06-06": "현충일",
    "2029-07-17": "제헌절",
    "2029-08-15": "광복절",
    "2029-09-21": "추석연휴",
    "2029-09-22": "추석",
    "2029-09-23": "추석연휴",
    "2029-09-24": "대체공휴일",
    "2029-10-03": "개천절",
    "2029-10-09": "한글날",
    "2029-12-25": "기독탄신일",
    // 2030년
    "2030-01-01": "신정",
    "2030-02-02": "설날연휴",
    "2030-02-03": "설날",
    "2030-02-04": "설날연휴",
    "2030-02-05": "대체공휴일",
    "2030-03-01": "삼일절",
    "2030-05-01": "노동절",
    "2030-05-05": "어린이날",
    "2030-05-06": "대체공휴일",
    "2030-05-09": "부처님오신날",
    "2030-06-06": "현충일",
    "2030-07-17": "제헌절",
    "2030-08-15": "광복절",
    "2030-09-11": "추석연휴",
    "2030-09-12": "추석",
    "2030-09-13": "추석연휴",
    "2030-10-03": "개천절",
    "2030-10-09": "한글날",
    "2030-12-25": "기독탄신일",
  };

  // ==================== 업무 구분(유선/채팅 + 사용자 추가 항목) 공용 설정 ====================
  // 예전에는 "유선"/"채팅" 두 가지가 코드 곳곳에 글자 그대로 박혀 있었다. 스케줄의
  // "필요인력" 자동 계산·자동 채움 로직(07c-schedule-auto-fill.js)은 이 두 가지를
  // 기준으로 짜여 있는 정산 로직이라 그대로 두고, 그 외에 상담사 관리 · 면담일지 ·
  // QA · 홈 화면처럼 "이 사람이 어떤 업무를 하는지 보여주는 용도"로 쓰이는 곳에서는
  // 사용자가 새 구분을 자유롭게 추가할 수 있게 한다.
  const WORK_TYPES_BUILTIN = ["유선", "채팅"];
  const WORK_TYPES_KEY = acctKey("work-types:custom-list");
  const WORK_TYPES_MAX_CUSTOM = 12;
  const WORK_TYPES_MAX_LEN = 8;

  function loadCustomWorkTypes() {
    try {
      const raw = localStorage.getItem(WORK_TYPES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string" && t.trim()) : [];
    } catch (e) { return []; }
  }
  let customWorkTypes = loadCustomWorkTypes();
  function saveCustomWorkTypes() {
    try { localStorage.setItem(WORK_TYPES_KEY, JSON.stringify(customWorkTypes)); }
    catch (e) {}
  }
  // 업무 구분 전체(기본 + 사용자 추가) 목록. 순서는 항상 "유선/채팅"이 먼저 오고,
  // 그 뒤에 추가한 순서대로 붙는다 — 배지 색상도 이 순서를 기준으로 고정된다.
  function getAllWorkTypes() { return WORK_TYPES_BUILTIN.concat(customWorkTypes); }
  function isBuiltinWorkType(t) { return WORK_TYPES_BUILTIN.indexOf(t) !== -1; }

  function addCustomWorkType(nameRaw) {
    const name = String(nameRaw || "").trim();
    if (!name) return { ok: false, reason: "이름을 입력해 주세요." };
    if (name.length > WORK_TYPES_MAX_LEN) return { ok: false, reason: `${WORK_TYPES_MAX_LEN}자 이내로 입력해 주세요.` };
    const dup = getAllWorkTypes().some((t) => t.toLowerCase() === name.toLowerCase());
    if (dup) return { ok: false, reason: "이미 있는 업무 구분이에요." };
    if (customWorkTypes.length >= WORK_TYPES_MAX_CUSTOM) return { ok: false, reason: `업무 구분은 최대 ${WORK_TYPES_MAX_CUSTOM}개까지 추가할 수 있어요.` };
    customWorkTypes.push(name);
    saveCustomWorkTypes();
    return { ok: true };
  }
  // 커스텀 업무 구분을 지우면서, 이미 그 구분이 붙어 있던 상담사들에게서도 함께 지운다
  // (상담사 기록에만 이름이 남아 배지가 "떠돌게" 되는 것을 막기 위해).
  function removeCustomWorkType(name) {
    if (isBuiltinWorkType(name)) return { ok: false, reason: "유선/채팅은 기본 항목이라 삭제할 수 없어요." };
    const idx = customWorkTypes.indexOf(name);
    if (idx === -1) return { ok: false, reason: "이미 삭제된 업무 구분이에요." };
    customWorkTypes.splice(idx, 1);
    saveCustomWorkTypes();
    if (typeof agentsData !== "undefined" && Array.isArray(agentsData)) {
      let touched = false;
      agentsData.forEach((a) => {
        if (a.workTypes && a.workTypes.indexOf(name) !== -1) {
          a.workTypes = a.workTypes.filter((t) => t !== name);
          touched = true;
        }
      });
      if (touched && typeof saveAgentsData === "function") saveAgentsData();
    }
    return { ok: true };
  }

  // 배지 색상 클래스. 유선/채팅은 기존 색을 그대로 쓰고, 추가한 항목들은 등록
  // 순서에 따라 teal → purple → pink 세 가지 색을 돌려가며 씀(css/06-agents.css 참고).
  const WORK_TYPE_CUSTOM_PALETTE = ["custom-1", "custom-2", "custom-3"];
  function workTypeBadgeClass(t) {
    if (t === "유선") return "voice";
    if (t === "채팅") return "chat";
    const idx = customWorkTypes.indexOf(t);
    if (idx === -1) return "custom-1"; // 삭제된 구분이 남아있던 옛 기록 등, 안전망
    return WORK_TYPE_CUSTOM_PALETTE[idx % WORK_TYPE_CUSTOM_PALETTE.length];
  }
  // 상담사 관리/QA/면담일지/홈에서 공통으로 쓰는 업무 구분 배지 렌더러.
  // sizeClass에 "sm"을 넣으면 작은 배지(.badge.sm)로 그려진다.
  function renderWorkTypeBadges(types, sizeClass) {
    return (types || [])
      .map((t) => `<span class="badge ${sizeClass ? "sm" : ""} ${workTypeBadgeClass(t)}">${esc(t)}</span>`)
      .join(" ");
  }

  /* ===================== 업무 구분 관리 모달 ===================== */
  // (다른 모달들과 같은 manual-modal-overlay/box 뼈대를 그대로 사용)
  function closeWorkTypesModal() {
    const el = document.getElementById("work-types-modal-overlay");
    if (el) el.remove();
  }
  // onChange: 추가/삭제가 실제로 일어났을 때 호출되는 콜백(각 화면에서 다시 그리는 용도).
  function openWorkTypesModal(onChange) {
    closeWorkTypesModal();
    const overlay = document.createElement("div");
    overlay.id = "work-types-modal-overlay";
    overlay.className = "manual-modal-overlay";
    function renderList() {
      return customWorkTypes.length
        ? customWorkTypes.map((t) => `
            <div class="work-type-row">
              <span class="badge ${workTypeBadgeClass(t)}">${esc(t)}</span>
              <button type="button" class="ghost-btn danger" data-remove-type="${esc(t)}" title="삭제">삭제</button>
            </div>
          `).join("")
        : `<div class="work-type-empty">아직 추가한 업무 구분이 없어요.</div>`;
    }
    overlay.innerHTML = `
      <div class="manual-modal-box work-types-modal-box" role="dialog" aria-modal="true" aria-label="업무 구분 관리">
        <div class="manual-modal-head">
          <span>업무 구분 관리</span>
          <button type="button" class="manual-modal-close" id="work-types-modal-close" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body">
          <div class="work-type-builtin-note">
            <span class="badge voice">유선</span><span class="badge chat">채팅</span>
            <span class="work-type-builtin-label">은 기본 항목이라 삭제할 수 없어요.</span>
          </div>
          <div id="work-types-list">${renderList()}</div>
          <div class="work-type-add-row">
            <input type="text" id="work-type-new-input" placeholder="예: 대면, 이메일" maxlength="${WORK_TYPES_MAX_LEN}">
            <button type="button" class="primary-btn" id="work-type-add-btn">추가</button>
          </div>
          <div class="work-type-add-error" id="work-type-add-error"></div>
          <p class="work-type-hint">여기서 추가한 업무 구분은 상담사 관리·면담일지·QA·홈 화면의 배지와 검색에 바로 반영돼요. (월별 스케줄의 필요인력 자동계산은 유선/채팅 기준을 그대로 사용해요.)</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    function refresh() {
      const list = document.getElementById("work-types-list");
      if (list) list.innerHTML = renderList();
      attachRemoveHandlers();
      if (typeof onChange === "function") onChange();
    }
    function attachRemoveHandlers() {
      overlay.querySelectorAll("[data-remove-type]").forEach((btn) => {
        btn.onclick = () => {
          const name = btn.getAttribute("data-remove-type");
          if (!confirm(`"${name}" 업무 구분을 삭제할까요? 이 구분이 붙어 있던 상담사에게서도 함께 지워져요.`)) return;
          removeCustomWorkType(name);
          refresh();
        };
      });
    }
    attachRemoveHandlers();
    overlay.querySelector("#work-types-modal-close").onclick = () => closeWorkTypesModal();
    overlay.onclick = (e) => { if (e.target === overlay) closeWorkTypesModal(); };
    const input = overlay.querySelector("#work-type-new-input");
    const errEl = overlay.querySelector("#work-type-add-error");
    function doAdd() {
      const res = addCustomWorkType(input.value);
      if (!res.ok) { errEl.textContent = res.reason; return; }
      errEl.textContent = "";
      input.value = "";
      refresh();
      input.focus();
    }
    overlay.querySelector("#work-type-add-btn").onclick = doAdd;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doAdd(); } });
    setTimeout(() => input.focus(), 0);
  }

  function getHoliday(iso) { return KR_HOLIDAYS[iso] || null; }

  const cal = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(),
    selectedDay: today.getDate(),
    monthData: {},
    hideDone: false,
    formType: "event",
    formPriority: false,
    rangeMode: false,
    repeatMode: false, // 추가 폼에서 "반복" 설정이 켜져 있는지
    repeatFreq: "weekly", // "weekly"(매주) | "monthly"(매월)
    repeatWeekday: null, // 반복 폼에서 사용자가 고른 요일(0~6, 일~토). null이면 선택된 날짜의 요일을 기본값으로 보여줌
    repeatMonthDay: null, // 반복 폼에서 사용자가 고른 날짜(1~31). null이면 선택된 날짜를 기본값으로 보여줌
    formDetailMode: false, // 추가 폼에서 "상세 내용" 입력칸을 펼쳐서 보고 있는지
    expandedEntries: {}, // 일정/메모 목록에서 상세 내용을 펼쳐서 보고 있는 항목의 id 모음
    upcomingExpanded: false, // "다가오는 일정"을 5개 넘게 펼쳐서 보고 있는지
    editingEntryId: null, // 현재 인라인으로 수정 중인 일정/메모의 id (없으면 null)
    editRangeMode: false, // 수정 폼에서 "기간 설정"이 켜져 있는지
    editPriority: false, // 수정 폼의 중요 표시 상태
    editType: "memo", // 수정 폼의 메모/일정 선택 상태
    editDetailMode: false, // 수정 폼에서 상세 내용 입력칸을 펼쳐서 보고 있는지
  };

  function monthKey(y, m) { return acctKey(`personal-calendar:${y}-${pad2(m + 1)}`); }
  function toISODate(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }
  function parseISODate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function addDaysISO(iso, delta) {
    const dt = parseISODate(iso);
    dt.setDate(dt.getDate() + delta);
    return toISODate(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }
  function readMonthRaw(y, m) {
    try {
      const raw = localStorage.getItem(monthKey(y, m));
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function writeMonthRaw(y, m, data) {
    try { localStorage.setItem(monthKey(y, m), JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }
  function loadMonth(y, m) { cal.monthData = readMonthRaw(y, m); }

  let calStatusTimer = null;
  function flashCalStatus(msg) {
    const el = document.getElementById("cal-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(calStatusTimer);
    calStatusTimer = setTimeout(() => { el.textContent = ""; }, 1500);
  }
  function saveCurrentMonth() {
    const ok = writeMonthRaw(cal.year, cal.monthIndex, cal.monthData);
    flashCalStatus(ok ? "저장됨" : "저장 실패");
  }

  function sortEntries(list) {
    return [...list].sort((a, b) => {
      if (!!a.done !== !!b.done) return a.done ? 1 : -1;
      if (!!a.priority !== !!b.priority) return a.priority ? -1 : 1;
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  }
  function dateRangeDays(startISO, endISO) {
    let start = parseISODate(startISO);
    let end = parseISODate(endISO);
    if (start > end) { const t = start; start = end; end = t; }
    const days = [];
    const cur = new Date(start);
    let guard = 0;
    while (cur <= end && guard < 366) {
      days.push({ y: cur.getFullYear(), m: cur.getMonth(), d: cur.getDate(), iso: toISODate(cur.getFullYear(), cur.getMonth(), cur.getDate()) });
      cur.setDate(cur.getDate() + 1);
      guard++;
    }
    return days;
  }
  const REPEAT_MAX_OCCURRENCES = 104; // 한 번에 만들 수 있는 반복 일정의 최대 개수(무한 생성 방지용 안전장치)
  // 월 단위로 날짜를 더하되, 대상 월에 그 날짜가 없으면(예: 31일 -> 2월) 그 달의 마지막 날로 맞춘다.
  function addMonthsClamped(date, n) {
    const day = date.getDate();
    const targetFirst = new Date(date.getFullYear(), date.getMonth() + n, 1);
    const lastDayOfTarget = new Date(targetFirst.getFullYear(), targetFirst.getMonth() + 1, 0).getDate();
    targetFirst.setDate(Math.min(day, lastDayOfTarget));
    return targetFirst;
  }
  // 특정 연/월에 day가 그 달에 없으면(예: 2월 31일) 그 달의 마지막 날로 맞춘 Date를 반환.
  function clampedMonthDate(y, m, day) {
    const lastDay = new Date(y, m + 1, 0).getDate();
    return new Date(y, m, Math.min(day, lastDay));
  }
  // startISO부터 untilISO까지 매주/매월 반복되는 날짜(ISO)들을 계산한다. 안전장치로 최대 개수를 넘지 않는다.
  // 매월 반복은 항상 원래 사용자가 고른 날짜(monthDay)를 기준으로 매달 다시 계산해서, 예를 들어
  // 2월엔 28일로 클램프되더라도 3월엔 다시 31일로 돌아오게 한다(28일로 계속 밀리지 않도록).
  function computeRepeatDates(startISO, freq, untilISO, monthDay) {
    const dates = [];
    const start = parseISODate(startISO);
    const until = parseISODate(untilISO);
    let guard = 0;
    while (guard < REPEAT_MAX_OCCURRENCES) {
      const cur = freq === "monthly"
        ? clampedMonthDate(start.getFullYear(), start.getMonth() + guard, monthDay)
        : new Date(start.getFullYear(), start.getMonth(), start.getDate() + guard * 7);
      if (cur > until) break;
      dates.push(toISODate(cur.getFullYear(), cur.getMonth(), cur.getDate()));
      guard++;
    }
    return dates;
  }
  // 반복 규칙을 사람이 읽을 수 있는 짧은 라벨로 바꾼다. (예: "매주 월요일", "매월 15일")
  function repeatRuleLabel(freq, weekday, monthDay) {
    if (freq === "monthly") return `매월 ${monthDay}일`;
    return `매주 ${WEEKDAYS[weekday]}요일`;
  }
  // fromISO(선택한 시작일) 이후 첫 번째로 규칙(요일 또는 날짜)에 맞는 날짜를 찾는다.
  // 예: 오늘이 화요일인데 "매주 수요일"을 골랐으면 다음 수요일부터 반복이 시작된다.
  function firstRuleMatchOnOrAfter(fromISO, freq, weekday, monthDay) {
    const from = parseISODate(fromISO);
    if (freq === "weekly") {
      const diff = (weekday - from.getDay() + 7) % 7;
      const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + diff);
      return toISODate(d.getFullYear(), d.getMonth(), d.getDate());
    }
    let cand = clampedMonthDate(from.getFullYear(), from.getMonth(), monthDay);
    // 이번 달의 대상 날짜가 이미 지났거나(클램프로 인해 from보다 앞선 날짜가 됐거나) 지난 경우 다음 달로 넘어간다.
    if (cand < from) cand = clampedMonthDate(from.getFullYear(), from.getMonth() + 1, monthDay);
    return toISODate(cand.getFullYear(), cand.getMonth(), cand.getDate());
  }
  function buildGrid(year, monthIndex) {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
    const cells = [];
    for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
    while (cells.length % 7 !== 0 || cells.length < 42) {
      cells.push({ day: cells.length - (firstWeekday + daysInMonth) + 1, current: false });
    }
    return cells;
  }
  function isTodayCell(day, current) {
    return current && day === today.getDate() && cal.monthIndex === today.getMonth() && cal.year === today.getFullYear();
  }
  function formatRangeLabel(iso1, iso2) {
    const a = parseISODate(iso1), b = parseISODate(iso2);
    return `${a.getMonth() + 1}/${a.getDate()} → ${b.getMonth() + 1}/${b.getDate()}`;
  }
  function computeUpcoming() {
    const isCurrentMonth = cal.year === today.getFullYear() && cal.monthIndex === today.getMonth();
    const fromDay = isCurrentMonth ? today.getDate() : 1;
    const dayKeys = Object.keys(cal.monthData).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    const items = [];
    const seen = new Set();
    dayKeys.forEach((dayKey) => {
      const dayNum = parseInt(dayKey, 10);
      if (dayNum < fromDay) return;
      (cal.monthData[dayKey] || []).forEach((entry) => {
        if (entry.done) return;
        if (seen.has(entry.id)) return;
        seen.add(entry.id);
        items.push(Object.assign({}, entry, { dayKey, dayNum }));
      });
    });
    items.sort((a, b) => {
      if (a.dayNum !== b.dayNum) return a.dayNum - b.dayNum;
      if (!!a.priority !== !!b.priority) return a.priority ? -1 : 1;
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    return items;
  }

  const UPCOMING_COLLAPSED_COUNT = 5; // 접었을 때 기본으로 보여줄 개수

  // 일정/메모 한 건을 수정 중일 때 목록 안에 인라인으로 표시하는 편집 폼.
  function entryEditFormHtml(entry) {
    const isRange = entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd;
    return `
      <div class="entry entry-editing" data-id="${entry.id}">
        <div class="entry-edit-form">
          <div class="type-row">
            <button type="button" class="type-btn priority ${cal.editPriority ? "active" : ""}" id="btn-edit-priority">★ 중요</button>
          </div>
          ${isRange ? `
          <div class="range-row">
            <input type="date" class="date-input" id="edit-input-start" value="${entry.rangeStart}">
            <span class="arrow">→</span>
            <input type="date" class="date-input" id="edit-input-end" value="${entry.rangeEnd}">
          </div>` : ""}
          <div class="add-row">
            ${isRange ? "" : `<input type="time" class="add-input time-input" id="edit-input-time" value="${esc(entry.time || "")}">`}
            <input class="add-input text-input" id="edit-input-text" placeholder="제목을 입력하세요" autocomplete="off" value="${esc(entry.text)}">
          </div>
          <button type="button" class="detail-toggle-link ${cal.editDetailMode ? "active" : ""}" id="btn-edit-detail-toggle">
            ${ICON_NOTE} ${cal.editDetailMode ? "상세 내용 접기" : "상세 내용 추가"}
          </button>
          ${cal.editDetailMode ? `<textarea class="add-textarea" id="edit-input-detail" placeholder="상세 내용을 입력하세요 (선택)" rows="3">${esc(entry.detail || "")}</textarea>` : ""}
          <div class="entry-edit-actions">
            <button type="button" class="ghost-btn" data-action="cancel-edit">취소</button>
            <button type="button" class="submit-btn confirm-btn" data-action="save-edit" data-id="${entry.id}">저장</button>
          </div>
        </div>
      </div>`;
  }

  function renderCalendarPage(root) {
    const grid = buildGrid(cal.year, cal.monthIndex);
    const selectedKey = pad2(cal.selectedDay);
    const selectedEntries = cal.monthData[selectedKey] || [];
    const selectedWeekday = WEEKDAYS[new Date(cal.year, cal.monthIndex, cal.selectedDay).getDay()];
    const upcomingAll = computeUpcoming();
    const upcoming = cal.upcomingExpanded ? upcomingAll : upcomingAll.slice(0, UPCOMING_COLLAPSED_COUNT);
    const selectedISO = toISODate(cal.year, cal.monthIndex, cal.selectedDay);
    const repeatDefaultUntil = addMonthsClamped(new Date(cal.year, cal.monthIndex, cal.selectedDay), 3);
    const repeatDefaultUntilISO = toISODate(repeatDefaultUntil.getFullYear(), repeatDefaultUntil.getMonth(), repeatDefaultUntil.getDate());
    const repeatWeekdayValue = cal.repeatWeekday !== null ? cal.repeatWeekday : new Date(cal.year, cal.monthIndex, cal.selectedDay).getDay();
    const repeatMonthDayValue = cal.repeatMonthDay !== null ? cal.repeatMonthDay : cal.selectedDay;

    let gridHtml = "";
    grid.forEach((c, i) => {
      const weekend = i % 7 === 0 || i % 7 === 6;
      const weekdayIdx = i % 7;
      const entries = c.current ? (cal.monthData[pad2(c.day)] || []) : [];
      const cellISO = c.current ? toISODate(cal.year, cal.monthIndex, c.day) : null;

      const rangeEntries = entries.filter((e) => e.rangeStart && e.rangeEnd && e.rangeStart !== e.rangeEnd);
      rangeEntries.sort((a, b) => (a.rangeStart + a.id).localeCompare(b.rangeStart + b.id));
      const normalEntries = entries.filter((e) => !(e.rangeStart && e.rangeEnd && e.rangeStart !== e.rangeEnd));
      const combined = rangeEntries.concat(normalEntries);
      const visible = combined.slice(0, 3);
      const extra = combined.length - visible.length;

      const holidayName = cellISO ? getHoliday(cellISO) : null;
      const selected = c.current && c.day === cal.selectedDay;
      const classes = ["cell", c.current ? "current" : "dim", weekend ? "weekend" : "", holidayName ? "holiday" : "", selected ? "selected" : "", isTodayCell(c.day, c.current) ? "today" : ""].join(" ").trim();

      let entriesHtml = "";
      if (visible.length > 0) {
        const chips = visible.map((entry) => {
          const isRange = entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd;
          let bridgeCls = "";
          if (isRange && cellISO) {
            const continuesLeft = cellISO !== entry.rangeStart && weekdayIdx !== 0;
            const continuesRight = cellISO !== entry.rangeEnd && weekdayIdx !== 6;
            bridgeCls = (continuesLeft ? "bridge-l " : "") + (continuesRight ? "bridge-r" : "");
          }
          const star = entry.priority && !entry.done ? '<span class="star">★</span>' : "";
          const timePart = (!isRange && entry.time) ? esc(entry.time) + " " : "";
          return `<span class="chip ${entry.type} ${entry.done ? "done" : ""} ${bridgeCls}">${star}${timePart}${esc(entry.text)}</span>`;
        }).join("");
        const more = extra > 0 ? `<span class="chip-more">+${extra}개 더보기</span>` : "";
        entriesHtml = `<div class="cell-entries">${chips}${more}</div>`;
      }
      const holidayHtml = holidayName ? `<span class="holiday-label" title="${esc(holidayName)}">${esc(holidayName)}</span>` : "";

      gridHtml += `<div class="${classes}" data-day="${c.day}" data-current="${c.current}" tabindex="${c.current ? 0 : -1}">
        <span class="day-num">${c.day}</span>
        ${holidayHtml}
        ${entriesHtml}
      </div>`;
    });

    let entriesHtml = "";
    const visibleEntries = selectedEntries.filter((e) => !cal.hideDone || !e.done);
    if (visibleEntries.length === 0) {
      entriesHtml = `<div class="empty">이 날짜엔 아직 기록이 없어요.<br>아래에서 일정이나 메모를 추가해보세요.</div>`;
    } else {
      entriesHtml = `<div class="entries">` + visibleEntries.map((entry) => {
        const isRange = entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd;
        const isRepeat = !!entry.repeatId;
        const hasDetail = !!(entry.detail && entry.detail.trim());
        const expanded = hasDetail && !!cal.expandedEntries[entry.id];
        if (cal.editingEntryId === entry.id) return entryEditFormHtml(entry);
        return `
        <div class="entry ${entry.type} ${entry.done ? "done" : ""} ${expanded ? "expanded" : ""}" data-id="${entry.id}">
          <button class="check-btn" data-action="toggle" data-id="${entry.id}">${entry.done ? "✓" : ""}</button>
          <div class="body">
            <span class="meta-row">
              ${isRange ? `<span class="range-badge">${formatRangeLabel(entry.rangeStart, entry.rangeEnd)}</span>` : ""}
              ${isRepeat ? `<span class="repeat-badge">${ICON_REFRESH} ${esc(entry.repeatLabel || "반복")}</span>
                <button type="button" class="repeat-clear-btn" data-action="delete-series" data-id="${entry.id}">전체 삭제</button>` : ""}
              ${(!isRange && entry.time) ? `<span class="time">${esc(entry.time)}</span>` : ""}
              ${entry.priority && !entry.done ? `<span class="priority-tag">★ 중요</span>` : ""}
            </span>
            ${hasDetail ? `
              <button type="button" class="entry-title-btn" data-action="expand" data-id="${entry.id}">
                <span class="text">${esc(entry.text)}</span>
                <span class="expand-chevron">${ICON_CHEVRON_RIGHT}</span>
              </button>
              ${expanded ? `<div class="entry-detail-card">${esc(entry.detail)}</div>` : ""}
            ` : `
              <span class="text">${esc(entry.text)}</span>
            `}
          </div>
          <button class="icon-edit-btn" data-action="edit" data-id="${entry.id}" aria-label="수정">${ICON_EDIT}</button>
          <button class="del" data-action="delete" data-id="${entry.id}">✕</button>
        </div>`;
      }).join("") + `</div>`;
    }

    let upcomingHtml = "";
    if (upcomingAll.length > 0) {
      const remaining = upcomingAll.length - upcoming.length;
      upcomingHtml = `<div class="upcoming">
        <div class="upcoming-title">${ICON_CLIPBOARD} 다가오는 일정</div>
        <div class="upcoming-list">
          ${upcoming.map((item) => {
            const isRange = item.rangeStart && item.rangeEnd && item.rangeStart !== item.rangeEnd;
            const dayLabel = isRange ? formatRangeLabel(item.rangeStart, item.rangeEnd) : `${cal.monthIndex + 1}/${item.dayNum}`;
            return `
            <button class="upcoming-item" data-goto-day="${item.dayNum}">
              <span class="upcoming-day">${dayLabel}</span>
              ${item.priority ? '<span class="upcoming-star">★</span>' : ""}
              <span class="upcoming-text ${item.type}">${esc(item.text)}</span>
            </button>`;
          }).join("")}
        </div>
        ${upcomingAll.length > UPCOMING_COLLAPSED_COUNT ? `
          <button type="button" class="upcoming-toggle" id="btn-upcoming-toggle">
            ${cal.upcomingExpanded ? "접기 ▲" : `더보기 (${remaining}개) ▾`}
          </button>
        ` : ""}
      </div>`;
    }

    root.innerHTML = `
      <div class="calendar-page-header">
        <div class="calendar-page-title">캘린더</div>
      </div>
      <div class="shell">
        <div class="card">
          <div class="cal-header">
            <div class="cal-title"><span class="year">${cal.year}</span>${MONTH_NAMES[cal.monthIndex]}</div>
            <div class="cal-nav">
              <button class="today-btn" id="btn-today">오늘</button>
              <button class="icon-btn" id="btn-prev" aria-label="이전 달">‹</button>
              <button class="icon-btn" id="btn-next" aria-label="다음 달">›</button>
            </div>
          </div>
          <div class="weekday-row">${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div>
          <div class="grid">${gridHtml}</div>
        </div>

        <div class="side-col">
          <div class="card">
            <div class="side-date">${cal.monthIndex + 1}월 ${cal.selectedDay}일 <span class="wd">${selectedWeekday}요일</span>${getHoliday(selectedISO) ? ` <span class="side-holiday">${esc(getHoliday(selectedISO))}</span>` : ""}</div>
            <div class="status" id="cal-status"></div>
            <div class="legend">
              <span class="item"><span class="dot memo"></span>메모</span>
              <span class="item"><span class="dot event"></span>일정</span>
              <label class="hide-done">
                <input type="checkbox" id="hide-done-check" ${cal.hideDone ? "checked" : ""}>
                완료 항목 숨기기
              </label>
            </div>
            ${entriesHtml}
            ${upcomingHtml}
            <form class="add-form" id="add-form">
              <div class="type-row">
                <button type="button" class="type-btn priority ${cal.formPriority ? "active" : ""}" id="btn-priority">★ 중요</button>
                <button type="button" class="type-btn rangetoggle ${cal.rangeMode ? "active" : ""}" id="btn-range">기간 설정</button>
                <button type="button" class="type-btn repeattoggle ${cal.repeatMode ? "active" : ""}" id="btn-repeat">${ICON_REFRESH} 반복</button>
              </div>
              ${cal.rangeMode ? `
              <div class="range-row">
                <input type="date" class="date-input" id="input-start" value="${selectedISO}">
                <span class="arrow">→</span>
                <input type="date" class="date-input" id="input-end" value="${selectedISO}">
              </div>` : ""}
              ${cal.repeatMode ? `
              <div class="repeat-row">
                <select class="repeat-select" id="input-repeat-freq">
                  <option value="weekly" ${cal.repeatFreq === "weekly" ? "selected" : ""}>매주</option>
                  <option value="monthly" ${cal.repeatFreq === "monthly" ? "selected" : ""}>매월</option>
                </select>
                ${cal.repeatFreq === "monthly" ? `
                <select class="repeat-select" id="input-repeat-monthday">
                  ${Array.from({ length: 31 }, (_, i) => i + 1).map((d) => `<option value="${d}" ${d === repeatMonthDayValue ? "selected" : ""}>${d}일</option>`).join("")}
                </select>` : `
                <select class="repeat-select" id="input-repeat-weekday">
                  ${WEEKDAYS.map((w, i) => `<option value="${i}" ${i === repeatWeekdayValue ? "selected" : ""}>${w}요일</option>`).join("")}
                </select>`}
              </div>
              <div class="repeat-row">
                <span class="repeat-until-label">종료일</span>
                <input type="date" class="date-input" id="input-repeat-until" value="${repeatDefaultUntilISO}" min="${selectedISO}">
              </div>` : ""}
              <div class="add-row">
                ${cal.rangeMode ? "" : `<input type="time" class="add-input time-input" id="input-time">`}
                <input class="add-input text-input" id="input-text" placeholder="제목을 입력하세요" autocomplete="off">
                <button type="submit" class="submit-btn" aria-label="추가">＋</button>
              </div>
              <button type="button" class="detail-toggle-link ${cal.formDetailMode ? "active" : ""}" id="btn-detail-toggle">
                ${ICON_NOTE} ${cal.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}
              </button>
              ${cal.formDetailMode ? `<textarea class="add-textarea" id="input-detail" placeholder="상세 내용을 입력하세요 (선택)" rows="3"></textarea>` : ""}
            </form>
          </div>
          ${renderTodoCard()}
        </div>
      </div>
    `;

    attachCalEvents();
    attachTodoEvents();
  }

  function attachCalEvents() {
    document.querySelectorAll(".repeat-select").forEach((sel) => enhanceSelect(sel));
    document.querySelectorAll('input[type="date"]').forEach((inp) => enhanceDateInput(inp));
    document.querySelectorAll('input[type="time"]').forEach((inp) => enhanceTimeInput(inp));
    document.getElementById("btn-today").onclick = () => {
      cal.year = today.getFullYear();
      cal.monthIndex = today.getMonth();
      cal.selectedDay = today.getDate();
      loadMonth(cal.year, cal.monthIndex);
      renderApp();
    };
    document.getElementById("btn-prev").onclick = () => goMonth(-1);
    document.getElementById("btn-next").onclick = () => goMonth(1);

    document.querySelectorAll(".cell[data-current='true']").forEach((cellEl) => {
      cellEl.onclick = () => {
        cal.selectedDay = parseInt(cellEl.getAttribute("data-day"), 10);
        renderApp();
      };
      cellEl.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") cellEl.click(); };
    });

    document.getElementById("hide-done-check").onchange = (e) => {
      cal.hideDone = e.target.checked;
      renderApp();
    };

    const upcomingToggleBtn = document.getElementById("btn-upcoming-toggle");
    if (upcomingToggleBtn) {
      upcomingToggleBtn.onclick = () => {
        cal.upcomingExpanded = !cal.upcomingExpanded;
        renderApp();
      };
    }

    document.querySelectorAll("[data-action='toggle']").forEach((btn) => {
      btn.onclick = () => toggleDoneEntry(btn.getAttribute("data-id"));
    });
    document.querySelectorAll("[data-action='delete']").forEach((btn) => {
      btn.onclick = () => deleteEntry(btn.getAttribute("data-id"));
    });
    document.querySelectorAll("[data-action='delete-series']").forEach((btn) => {
      btn.onclick = () => deleteRepeatSeries(btn.getAttribute("data-id"));
    });
    document.querySelectorAll("[data-action='edit']").forEach((btn) => {
      btn.onclick = () => startEditEntry(btn.getAttribute("data-id"));
    });
    document.querySelectorAll("[data-action='cancel-edit']").forEach((btn) => {
      btn.onclick = () => { cal.editingEntryId = null; renderApp(); };
    });
    document.querySelectorAll("[data-action='save-edit']").forEach((btn) => {
      btn.onclick = () => saveEditEntry(btn.getAttribute("data-id"));
    });
    const editPriorityBtn = document.getElementById("btn-edit-priority");
    if (editPriorityBtn) {
      editPriorityBtn.onclick = (e) => {
        cal.editPriority = !cal.editPriority;
        e.currentTarget.classList.toggle("active", cal.editPriority);
      };
    }
    const editDetailToggleBtn = document.getElementById("btn-edit-detail-toggle");
    if (editDetailToggleBtn) {
      editDetailToggleBtn.onclick = () => {
        cal.editDetailMode = !cal.editDetailMode;
        editDetailToggleBtn.classList.toggle("active", cal.editDetailMode);
        editDetailToggleBtn.innerHTML = `${ICON_NOTE} ${cal.editDetailMode ? "상세 내용 접기" : "상세 내용 추가"}`;
        let ta = document.getElementById("edit-input-detail");
        if (cal.editDetailMode) {
          if (!ta) {
            ta = document.createElement("textarea");
            ta.className = "add-textarea";
            ta.id = "edit-input-detail";
            ta.placeholder = "상세 내용을 입력하세요 (선택)";
            ta.rows = 3;
            ta.value = editingDetailDraft();
            editDetailToggleBtn.insertAdjacentElement("afterend", ta);
          }
          ta.focus();
        } else if (ta) {
          ta.remove();
        }
      };
    }
    document.querySelectorAll("[data-action='expand']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        cal.expandedEntries[id] = !cal.expandedEntries[id];
        renderApp();
      };
    });
    document.querySelectorAll("[data-goto-day]").forEach((btn) => {
      btn.onclick = () => { cal.selectedDay = parseInt(btn.getAttribute("data-goto-day"), 10); renderApp(); };
    });

    document.getElementById("btn-priority").onclick = (e) => {
      cal.formPriority = !cal.formPriority;
      e.currentTarget.classList.toggle("active", cal.formPriority);
    };
    document.getElementById("btn-range").onclick = () => {
      cal.rangeMode = !cal.rangeMode;
      if (cal.rangeMode) cal.repeatMode = false;
      renderApp();
    };
    document.getElementById("btn-repeat").onclick = () => {
      cal.repeatMode = !cal.repeatMode;
      if (cal.repeatMode) cal.rangeMode = false;
      renderApp();
    };
    const repeatFreqSelect = document.getElementById("input-repeat-freq");
    if (repeatFreqSelect) {
      repeatFreqSelect.onchange = (e) => { cal.repeatFreq = e.target.value; renderApp(); };
    }
    const repeatWeekdaySelect = document.getElementById("input-repeat-weekday");
    if (repeatWeekdaySelect) {
      repeatWeekdaySelect.onchange = (e) => { cal.repeatWeekday = parseInt(e.target.value, 10); };
    }
    const repeatMonthDaySelect = document.getElementById("input-repeat-monthday");
    if (repeatMonthDaySelect) {
      repeatMonthDaySelect.onchange = (e) => { cal.repeatMonthDay = parseInt(e.target.value, 10); };
    }
    document.getElementById("btn-detail-toggle").onclick = () => {
      cal.formDetailMode = !cal.formDetailMode;
      const btn = document.getElementById("btn-detail-toggle");
      btn.classList.toggle("active", cal.formDetailMode);
      btn.innerHTML = `${ICON_NOTE} ${cal.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}`;
      let ta = document.getElementById("input-detail");
      if (cal.formDetailMode) {
        if (!ta) {
          ta = document.createElement("textarea");
          ta.className = "add-textarea";
          ta.id = "input-detail";
          ta.placeholder = "상세 내용을 입력하세요 (선택)";
          ta.rows = 3;
          btn.insertAdjacentElement("afterend", ta);
        }
        ta.focus();
      } else if (ta) {
        ta.remove();
      }
    };

    document.getElementById("add-form").onsubmit = (e) => {
      e.preventDefault();
      const textInput = document.getElementById("input-text");
      const trimmed = textInput.value.trim();
      if (!trimmed) return;
      const detailInput = document.getElementById("input-detail");
      const detailVal = detailInput ? detailInput.value.trim() : "";

      const id = `${Date.now()}`;
      const baseEntry = { id, text: trimmed, type: cal.formType, priority: cal.formPriority, done: false, detail: detailVal };

      if (cal.rangeMode) {
        const startVal = document.getElementById("input-start").value;
        const endVal = document.getElementById("input-end").value;
        if (!startVal || !endVal) return;
        const days = dateRangeDays(startVal, endVal);
        const rangeStart = days[0].iso;
        const rangeEnd = days[days.length - 1].iso;
        days.forEach(({ y, m, d }) => {
          const dayKey = pad2(d);
          const entry = Object.assign({}, baseEntry, { time: "", rangeStart, rangeEnd });
          if (y === cal.year && m === cal.monthIndex) {
            const list = cal.monthData[dayKey] ? [...cal.monthData[dayKey]] : [];
            list.push(entry);
            cal.monthData[dayKey] = sortEntries(list);
          } else {
            const otherData = readMonthRaw(y, m);
            const list = otherData[dayKey] ? [...otherData[dayKey]] : [];
            list.push(entry);
            otherData[dayKey] = sortEntries(list);
            writeMonthRaw(y, m, otherData);
          }
        });
        saveCurrentMonth();
      } else if (cal.repeatMode) {
        const untilVal = document.getElementById("input-repeat-until").value;
        const selectedISO = toISODate(cal.year, cal.monthIndex, cal.selectedDay);
        if (!untilVal) return;
        const timeInput = document.getElementById("input-time");
        const freq = cal.repeatFreq;
        const weekdaySelect = document.getElementById("input-repeat-weekday");
        const monthDaySelect = document.getElementById("input-repeat-monthday");
        const weekday = weekdaySelect ? parseInt(weekdaySelect.value, 10) : new Date(cal.year, cal.monthIndex, cal.selectedDay).getDay();
        const monthDay = monthDaySelect ? parseInt(monthDaySelect.value, 10) : cal.selectedDay;
        const actualStartISO = firstRuleMatchOnOrAfter(selectedISO, freq, weekday, monthDay);
        if (actualStartISO > untilVal) return; // 종료일 안에 조건에 맞는 날짜가 하나도 없음
        const repeatDates = computeRepeatDates(actualStartISO, freq, untilVal, monthDay);
        const repeatId = `rep-${id}`;
        const repeatLabel = repeatRuleLabel(freq, weekday, monthDay);
        repeatDates.forEach((iso, idx) => {
          const dt = parseISODate(iso);
          const y = dt.getFullYear(), m = dt.getMonth(), d = dt.getDate();
          const dayKey = pad2(d);
          const entry = Object.assign({}, baseEntry, {
            id: `${id}-${idx}`, time: timeInput.value.trim(), rangeStart: iso, rangeEnd: iso,
            repeatId, repeatLabel, repeatDates,
          });
          if (y === cal.year && m === cal.monthIndex) {
            const list = cal.monthData[dayKey] ? [...cal.monthData[dayKey]] : [];
            list.push(entry);
            cal.monthData[dayKey] = sortEntries(list);
          } else {
            const otherData = readMonthRaw(y, m);
            const list = otherData[dayKey] ? [...otherData[dayKey]] : [];
            list.push(entry);
            otherData[dayKey] = sortEntries(list);
            writeMonthRaw(y, m, otherData);
          }
        });
        saveCurrentMonth();
        if (repeatDates.length >= REPEAT_MAX_OCCURRENCES) flashCalStatus(`최대 ${REPEAT_MAX_OCCURRENCES}개까지 등록됐어요`);
      } else {
        const timeInput = document.getElementById("input-time");
        const key = pad2(cal.selectedDay);
        const iso = toISODate(cal.year, cal.monthIndex, cal.selectedDay);
        const entry = Object.assign({}, baseEntry, { time: timeInput.value.trim(), rangeStart: iso, rangeEnd: iso });
        const list = cal.monthData[key] ? [...cal.monthData[key]] : [];
        list.push(entry);
        cal.monthData[key] = sortEntries(list);
        saveCurrentMonth();
      }

      cal.formPriority = false;
      cal.formDetailMode = false;
      cal.repeatWeekday = null;
      cal.repeatMonthDay = null;
      renderApp();
      const nt = document.getElementById("input-text");
      if (nt) nt.focus();
    };
  }

  function goMonth(delta) {
    let m = cal.monthIndex + delta;
    let y = cal.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    cal.monthIndex = m; cal.year = y; cal.selectedDay = 1;
    loadMonth(y, m);
    renderApp();
  }

  function findEntry(id) {
    const key = pad2(cal.selectedDay);
    return (cal.monthData[key] || []).find((it) => it.id === id);
  }
  function editingDetailDraft() {
    const entry = findEntry(cal.editingEntryId);
    return entry ? (entry.detail || "") : "";
  }
  function forEachRangeDay(entry, fn) {
    if (entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd) {
      dateRangeDays(entry.rangeStart, entry.rangeEnd).forEach(({ y, m, d }) => fn(y, m, pad2(d)));
    } else {
      fn(cal.year, cal.monthIndex, pad2(cal.selectedDay));
    }
  }
  function toggleDoneEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    const newDone = !entry.done;
    forEachRangeDay(entry, (y, m, dayKey) => {
      if (y === cal.year && m === cal.monthIndex) {
        const list = (cal.monthData[dayKey] || []).map((it) => (it.id === id ? Object.assign({}, it, { done: newDone }) : it));
        cal.monthData[dayKey] = sortEntries(list);
      } else {
        const data = readMonthRaw(y, m);
        const list = (data[dayKey] || []).map((it) => (it.id === id ? Object.assign({}, it, { done: newDone }) : it));
        data[dayKey] = sortEntries(list);
        writeMonthRaw(y, m, data);
      }
    });
    saveCurrentMonth();
    renderApp();
  }
  function deleteEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    // 여러 달에 걸친 일정이면 관련된 모든 달의 저장 키를 함께 스냅샷해둔다.
    const touchedMonthKeys = new Set([monthKey(cal.year, cal.monthIndex)]);
    forEachRangeDay(entry, (y, m) => { touchedMonthKeys.add(monthKey(y, m)); });
    const undoYear = cal.year, undoMonthIndex = cal.monthIndex;
    recordUndo("일정 삭제", Array.from(touchedMonthKeys), () => {
      if (cal.year === undoYear && cal.monthIndex === undoMonthIndex) loadMonth(cal.year, cal.monthIndex);
    });
    forEachRangeDay(entry, (y, m, dayKey) => {
      if (y === cal.year && m === cal.monthIndex) {
        const list = (cal.monthData[dayKey] || []).filter((it) => it.id !== id);
        if (list.length) cal.monthData[dayKey] = list; else delete cal.monthData[dayKey];
      } else {
        const data = readMonthRaw(y, m);
        const list = (data[dayKey] || []).filter((it) => it.id !== id);
        if (list.length) data[dayKey] = list; else delete data[dayKey];
        writeMonthRaw(y, m, data);
      }
    });
    saveCurrentMonth();
    renderApp();
  }

  // 반복 일정의 한 항목(id)을 눌렀을 때, 같은 repeatId를 가진 모든 날짜의 항목을 한 번에 삭제한다.
  function deleteRepeatSeries(id) {
    const entry = findEntry(id);
    if (!entry || !entry.repeatId || !Array.isArray(entry.repeatDates)) return;
    const repeatId = entry.repeatId;
    const dates = entry.repeatDates;
    if (!window.confirm(`"${entry.text}" 반복 일정 전체(${dates.length}개)를 삭제할까요?`)) return;

    const touchedMonthKeys = new Set([monthKey(cal.year, cal.monthIndex)]);
    dates.forEach((iso) => {
      const dt = parseISODate(iso);
      touchedMonthKeys.add(monthKey(dt.getFullYear(), dt.getMonth()));
    });
    const undoYear = cal.year, undoMonthIndex = cal.monthIndex;
    recordUndo("반복 일정 삭제", Array.from(touchedMonthKeys), () => {
      if (cal.year === undoYear && cal.monthIndex === undoMonthIndex) loadMonth(cal.year, cal.monthIndex);
    });

    dates.forEach((iso) => {
      const dt = parseISODate(iso);
      const y = dt.getFullYear(), m = dt.getMonth();
      const dayKey = pad2(dt.getDate());
      if (y === cal.year && m === cal.monthIndex) {
        const list = (cal.monthData[dayKey] || []).filter((it) => it.repeatId !== repeatId);
        if (list.length) cal.monthData[dayKey] = list; else delete cal.monthData[dayKey];
      } else {
        const data = readMonthRaw(y, m);
        const list = (data[dayKey] || []).filter((it) => it.repeatId !== repeatId);
        if (list.length) data[dayKey] = list; else delete data[dayKey];
        writeMonthRaw(y, m, data);
      }
    });
    saveCurrentMonth();
    renderApp();
  }

  function startEditEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    cal.editingEntryId = id;
    cal.editType = entry.type;
    cal.editPriority = !!entry.priority;
    cal.editDetailMode = !!(entry.detail && entry.detail.trim());
    renderApp();
  }

  function saveEditEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    const textInput = document.getElementById("edit-input-text");
    const trimmed = textInput.value.trim();
    if (!trimmed) return;
    const detailInput = document.getElementById("edit-input-detail");
    const detailVal = detailInput ? detailInput.value.trim() : "";
    const isRange = entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd;

    const touchedMonthKeys = new Set([monthKey(cal.year, cal.monthIndex)]);
    forEachRangeDay(entry, (y, m) => { touchedMonthKeys.add(monthKey(y, m)); });

    if (isRange) {
      const startVal = document.getElementById("edit-input-start").value;
      const endVal = document.getElementById("edit-input-end").value;
      if (!startVal || !endVal) return;
      const newDays = dateRangeDays(startVal, endVal);
      newDays.forEach(({ y, m }) => touchedMonthKeys.add(monthKey(y, m)));
      const undoYear = cal.year, undoMonthIndex = cal.monthIndex;
      recordUndo("일정 수정", Array.from(touchedMonthKeys), () => {
        if (cal.year === undoYear && cal.monthIndex === undoMonthIndex) loadMonth(cal.year, cal.monthIndex);
      });
      // 기존에 걸쳐 있던 날짜들에서 이 항목을 먼저 지운다.
      forEachRangeDay(entry, (y, m, dayKey) => {
        if (y === cal.year && m === cal.monthIndex) {
          const list = (cal.monthData[dayKey] || []).filter((it) => it.id !== id);
          if (list.length) cal.monthData[dayKey] = list; else delete cal.monthData[dayKey];
        } else {
          const data = readMonthRaw(y, m);
          const list = (data[dayKey] || []).filter((it) => it.id !== id);
          if (list.length) data[dayKey] = list; else delete data[dayKey];
          writeMonthRaw(y, m, data);
        }
      });
      // 새 기간에 다시 채워 넣는다.
      const rangeStart = newDays[0].iso;
      const rangeEnd = newDays[newDays.length - 1].iso;
      const newEntry = { id, text: trimmed, type: cal.editType, priority: cal.editPriority, done: entry.done, detail: detailVal, time: "", rangeStart, rangeEnd };
      newDays.forEach(({ y, m, d }) => {
        const dayKey = pad2(d);
        if (y === cal.year && m === cal.monthIndex) {
          const list = cal.monthData[dayKey] ? [...cal.monthData[dayKey]] : [];
          list.push(newEntry);
          cal.monthData[dayKey] = sortEntries(list);
        } else {
          const otherData = readMonthRaw(y, m);
          const list = otherData[dayKey] ? [...otherData[dayKey]] : [];
          list.push(newEntry);
          otherData[dayKey] = sortEntries(list);
          writeMonthRaw(y, m, otherData);
        }
      });
    } else {
      const timeInput = document.getElementById("edit-input-time");
      const undoYear = cal.year, undoMonthIndex = cal.monthIndex;
      recordUndo("일정 수정", Array.from(touchedMonthKeys), () => {
        if (cal.year === undoYear && cal.monthIndex === undoMonthIndex) loadMonth(cal.year, cal.monthIndex);
      });
      const key = pad2(cal.selectedDay);
      const list = (cal.monthData[key] || []).map((it) => (it.id === id ? Object.assign({}, it, {
        text: trimmed, type: cal.editType, priority: cal.editPriority, detail: detailVal,
        time: timeInput ? timeInput.value.trim() : "",
      }) : it));
      cal.monthData[key] = sortEntries(list);
    }

    cal.editingEntryId = null;
    cal.editDetailMode = false;
    saveCurrentMonth();
    renderApp();
  }

  loadMonth(cal.year, cal.monthIndex);

  /* ===================== 할 일(To-do) 모듈 ===================== */
  const TODO_KEY = acctKey("personal-calendar:todos");
  const todoUi = { dueInput: "", doneExpanded: false, formDetailMode: false, expanded: {}, editingId: null, editDetailMode: false }; // doneExpanded: 완료된 할 일을 펼쳐서 보고 있는지, expanded: 상세 내용을 펼쳐서 보고 있는 할 일 id 모음, editingId: 인라인으로 수정 중인 할 일 id

  function loadTodos() {
    try {
      const raw = localStorage.getItem(TODO_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let todos = loadTodos();

  let todoStatusTimer = null;
  function flashTodoStatus(msg) {
    const el = document.getElementById("todo-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(todoStatusTimer);
    todoStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveTodos() {
    try { localStorage.setItem(TODO_KEY, JSON.stringify(todos)); flashTodoStatus("저장됨"); }
    catch (e) { flashTodoStatus("저장 실패"); }
  }

  function todayISO() { return toISODate(today.getFullYear(), today.getMonth(), today.getDate()); }

  function addTodo(text, due, detail) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.push({ id: genId(), text: trimmed, due: due || "", done: false, detail: (detail || "").trim() });
    saveTodos();
  }
  function toggleTodoDone(id) {
    todos = todos.map((t) => (t.id === id ? Object.assign({}, t, { done: !t.done }) : t));
    saveTodos();
  }
  function deleteTodo(id) {
    if (!todos.some((t) => t.id === id)) return;
    recordUndo("할 일 삭제", TODO_KEY, () => { todos = loadTodos(); });
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
  }
  function updateTodo(id, patch) {
    if (!todos.some((t) => t.id === id)) return;
    recordUndo("할 일 수정", TODO_KEY, () => { todos = loadTodos(); });
    todos = todos.map((t) => (t.id === id ? Object.assign({}, t, patch) : t));
    saveTodos();
  }
  function sortTodos(list) {
    return [...list].sort((a, b) => {
      if (!!a.done !== !!b.done) return a.done ? 1 : -1;
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.localeCompare(b.due);
    });
  }
  function formatTodoDue(due) {
    // 마감일이 없거나 형식이 깨진 값이 들어오면 "NaN/NaN"이 화면에 그대로
    // 찍히므로, 그런 경우엔 빈 문자열을 돌려준다.
    if (!due) return "";
    const d = parseISODate(due);
    if (isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function renderTodoCard() {
    const tISO = todayISO();
    const activeTodos = sortTodos(todos.filter((t) => !t.done));
    const doneTodos = sortTodos(todos.filter((t) => t.done));
    const remaining = activeTodos.length;

    function todoEditFormHtml(t) {
      return `
        <div class="todo-item todo-editing" data-id="${t.id}">
          <div class="todo-edit-form">
            <div class="add-row">
              <input class="add-input text-input" id="todo-edit-input-text" placeholder="할 일 제목을 입력하세요" autocomplete="off" value="${esc(t.text)}">
            </div>
            <div class="todo-add-row">
              <input class="add-input todo-due-input" type="date" id="todo-edit-input-due" value="${esc(t.due || "")}">
            </div>
            <button type="button" class="detail-toggle-link ${todoUi.editDetailMode ? "active" : ""}" id="btn-todo-edit-detail-toggle">
              ${ICON_NOTE} ${todoUi.editDetailMode ? "상세 내용 접기" : "상세 내용 추가"}
            </button>
            ${todoUi.editDetailMode ? `<textarea class="add-textarea" id="todo-edit-input-detail" placeholder="상세 내용을 입력하세요 (선택)" rows="3">${esc(t.detail || "")}</textarea>` : ""}
            <div class="entry-edit-actions">
              <button type="button" class="ghost-btn" data-action="todo-cancel-edit">취소</button>
              <button type="button" class="submit-btn confirm-btn" data-action="todo-save-edit" data-id="${t.id}">저장</button>
            </div>
          </div>
        </div>`;
    }

    function todoItemHtml(t) {
      if (todoUi.editingId === t.id) return todoEditFormHtml(t);
      const isDueToday = !!t.due && t.due === tISO && !t.done;
      const isOverdue = !!t.due && t.due < tISO && !t.done;
      const dueCls = isDueToday ? "today" : (isOverdue ? "over" : "");
      const dueLabel = t.due ? `${formatTodoDue(t.due)}${isDueToday ? " · 오늘" : (isOverdue ? " · 지남" : "")}` : "";
      const hasDetail = !!(t.detail && t.detail.trim());
      const expanded = hasDetail && !!todoUi.expanded[t.id];
      return `
        <div class="todo-item ${t.done ? "done" : ""} ${isDueToday ? "due-today" : ""} ${expanded ? "expanded" : ""}" data-id="${t.id}">
          <div class="todo-body">
            ${hasDetail ? `
              <button type="button" class="todo-title-btn" data-action="todo-expand" data-id="${t.id}">
                <span class="todo-text">${esc(t.text)}</span>
                <span class="expand-chevron">${ICON_CHEVRON_RIGHT}</span>
              </button>
              ${expanded ? `<div class="todo-detail-card">${esc(t.detail)}</div>` : ""}
            ` : `
              <span class="todo-text">${esc(t.text)}</span>
            `}
            ${t.due ? `<span class="todo-due ${dueCls}">${dueLabel}</span>` : ""}
          </div>
          <button class="check-btn" data-action="todo-toggle" data-id="${t.id}">${t.done ? "✓" : ""}</button>
          <button class="icon-edit-btn" data-action="todo-edit" data-id="${t.id}" aria-label="수정">${ICON_EDIT}</button>
          <button class="del" data-action="todo-delete" data-id="${t.id}">✕</button>
        </div>`;
    }

    let listHtml = "";
    if (activeTodos.length === 0 && doneTodos.length === 0) {
      listHtml = `<div class="todo-empty">할 일이 없어요.<br>아래에서 새 할 일을 추가해보세요.</div>`;
    } else if (activeTodos.length === 0) {
      listHtml = `<div class="todo-empty">남은 할 일이 없어요. 다 처리했어요!</div>`;
    } else {
      listHtml = activeTodos.map(todoItemHtml).join("");
    }

    // 완료된 항목은 기본적으로 접어두고, 버튼을 눌러야 펼쳐서 볼 수 있게 한다.
    let doneSectionHtml = "";
    if (doneTodos.length > 0) {
      doneSectionHtml = `
        <button type="button" class="todo-done-toggle" id="btn-todo-done-toggle">
          ${todoUi.doneExpanded ? "완료 항목 접기 ▲" : `완료 ${doneTodos.length}개 보기 ▾`}
        </button>
        ${todoUi.doneExpanded ? `<div class="todo-done-list">${doneTodos.map(todoItemHtml).join("")}</div>` : ""}
      `;
    }

    return `
      <div class="card todo-card">
        <div class="todo-header">
          <div class="todo-title">${ICON_CHECK} To-Do List</div>
          <div class="todo-count">${remaining}개 남음</div>
        </div>
        <div class="status" id="todo-status"></div>
        <div class="todo-list">${listHtml}</div>
        ${doneSectionHtml}
        <form class="todo-add-form" id="todo-add-form">
          <div class="todo-add-row">
            <input class="add-input text-input" id="todo-input-text" placeholder="할 일 제목을 입력하세요" autocomplete="off">
            <button type="submit" class="submit-btn" aria-label="추가">＋</button>
          </div>
          <div class="todo-add-row">
            <input class="add-input todo-due-input" type="date" id="todo-input-due" value="${todoUi.dueInput}">
          </div>
          <button type="button" class="detail-toggle-link ${todoUi.formDetailMode ? "active" : ""}" id="btn-todo-detail-toggle">
            ${ICON_NOTE} ${todoUi.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}
          </button>
          ${todoUi.formDetailMode ? `<textarea class="add-textarea" id="todo-input-detail" placeholder="상세 내용을 입력하세요 (선택)" rows="3"></textarea>` : ""}
        </form>
      </div>
    `;
  }

  function attachTodoEvents() {
    document.querySelectorAll(".todo-due-input").forEach((inp) => enhanceDateInput(inp));
    document.querySelectorAll("[data-action='todo-toggle']").forEach((btn) => {
      btn.onclick = () => { toggleTodoDone(btn.getAttribute("data-id")); renderApp(); };
    });
    document.querySelectorAll("[data-action='todo-delete']").forEach((btn) => {
      btn.onclick = () => { deleteTodo(btn.getAttribute("data-id")); renderApp(); };
    });
    document.querySelectorAll("[data-action='todo-expand']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        todoUi.expanded[id] = !todoUi.expanded[id];
        renderApp();
      };
    });
    document.querySelectorAll("[data-action='todo-edit']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        const t = todos.find((it) => it.id === id);
        todoUi.editingId = id;
        todoUi.editDetailMode = !!(t && t.detail && t.detail.trim());
        renderApp();
      };
    });
    document.querySelectorAll("[data-action='todo-cancel-edit']").forEach((btn) => {
      btn.onclick = () => { todoUi.editingId = null; renderApp(); };
    });
    document.querySelectorAll("[data-action='todo-save-edit']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        const textInput = document.getElementById("todo-edit-input-text");
        const trimmed = textInput.value.trim();
        if (!trimmed) return;
        const dueInput = document.getElementById("todo-edit-input-due");
        const detailInput = document.getElementById("todo-edit-input-detail");
        updateTodo(id, { text: trimmed, due: dueInput ? dueInput.value : "", detail: detailInput ? detailInput.value.trim() : "" });
        todoUi.editingId = null;
        todoUi.editDetailMode = false;
        renderApp();
      };
    });
    const editDetailToggleBtn = document.getElementById("btn-todo-edit-detail-toggle");
    if (editDetailToggleBtn) {
      editDetailToggleBtn.onclick = () => {
        todoUi.editDetailMode = !todoUi.editDetailMode;
        editDetailToggleBtn.classList.toggle("active", todoUi.editDetailMode);
        editDetailToggleBtn.innerHTML = `${ICON_NOTE} ${todoUi.editDetailMode ? "상세 내용 접기" : "상세 내용 추가"}`;
        let ta = document.getElementById("todo-edit-input-detail");
        if (todoUi.editDetailMode) {
          if (!ta) {
            const editingTodo = todos.find((it) => it.id === todoUi.editingId);
            ta = document.createElement("textarea");
            ta.className = "add-textarea";
            ta.id = "todo-edit-input-detail";
            ta.placeholder = "상세 내용을 입력하세요 (선택)";
            ta.rows = 3;
            ta.value = editingTodo ? (editingTodo.detail || "") : "";
            editDetailToggleBtn.insertAdjacentElement("afterend", ta);
          }
          ta.focus();
        } else if (ta) {
          ta.remove();
        }
      };
    }
    const doneToggleBtn = document.getElementById("btn-todo-done-toggle");
    if (doneToggleBtn) {
      doneToggleBtn.onclick = () => {
        todoUi.doneExpanded = !todoUi.doneExpanded;
        renderApp();
      };
    }
    const detailToggleBtn = document.getElementById("btn-todo-detail-toggle");
    if (detailToggleBtn) {
      detailToggleBtn.onclick = () => {
        todoUi.formDetailMode = !todoUi.formDetailMode;
        detailToggleBtn.classList.toggle("active", todoUi.formDetailMode);
        detailToggleBtn.innerHTML = `${ICON_NOTE} ${todoUi.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}`;
        let ta = document.getElementById("todo-input-detail");
        if (todoUi.formDetailMode) {
          if (!ta) {
            ta = document.createElement("textarea");
            ta.className = "add-textarea";
            ta.id = "todo-input-detail";
            ta.placeholder = "상세 내용을 입력하세요 (선택)";
            ta.rows = 3;
            detailToggleBtn.insertAdjacentElement("afterend", ta);
          }
          ta.focus();
        } else if (ta) {
          ta.remove();
        }
      };
    }
    const form = document.getElementById("todo-add-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const textInput = document.getElementById("todo-input-text");
        const dueInput = document.getElementById("todo-input-due");
        const detailInput = document.getElementById("todo-input-detail");
        addTodo(textInput.value, dueInput.value, detailInput ? detailInput.value : "");
        todoUi.dueInput = dueInput.value;
        todoUi.formDetailMode = false;
        renderApp();
        const nt = document.getElementById("todo-input-text");
        if (nt) nt.focus();
      };
      const dueInput = document.getElementById("todo-input-due");
      if (dueInput) dueInput.onchange = (e) => { todoUi.dueInput = e.target.value; };
    }
  }

  /* ===================== 업무 정리(메모) 모듈 ===================== */
  const NOTES_KEY = acctKey("personal-notes:data");
  const UNFILED = "unfiled";

  function defaultNotesData() {
    return { folders: [], notes: {}, pinnedOrder: [], folderOrder: { [UNFILED]: [] } };
  }
  function loadNotesData() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (!raw) return defaultNotesData();
      const parsed = JSON.parse(raw);
      if (!parsed.folderOrder) parsed.folderOrder = {};
      if (!parsed.folderOrder[UNFILED]) parsed.folderOrder[UNFILED] = [];
      if (!parsed.pinnedOrder) parsed.pinnedOrder = [];
      if (!parsed.folders) parsed.folders = [];
      if (!parsed.notes) parsed.notes = {};
      Object.values(parsed.notes).forEach((n) => { if (!n.attachments) n.attachments = []; });
      return parsed;
    } catch (e) { return defaultNotesData(); }
  }
  const notesData = loadNotesData();

  /* ---- 메모 첨부파일 (Supabase Storage) ----
     메모 내용(text)은 지금까지처럼 localStorage → kv_store로 동기화되지만,
     첨부파일 원본은 크기가 클 수 있어 같은 방식(JSON 문자열)으로 넣기 적합하지
     않다. 그래서 파일 원본은 Supabase Storage의 "note-attachments" 버킷에 직접
     올리고, notesData(=메모 JSON)에는 파일 메타데이터(이름/크기/저장 경로)만
     남겨서 지금처럼 kv_store로 함께 동기화되게 한다.
     버킷/권한 설정은 supabase/notes-attachments-storage-setup.sql 1회 실행 필요. */
  const NOTES_ATTACHMENTS_BUCKET = "note-attachments";
  const NOTES_ATTACHMENT_MAX_MB = 20;
  // 팀 전체가 같은 저장 공간을 쓰는 구조라, 누군가(계정이 도용됐거나 실수로)
  // 실행 파일류를 올리면 다른 사람이 무심코 내려받아 실행할 위험이 있다.
  // 그런 확장자는 아예 업로드 단계에서 막는다(내용 검사가 아니라 확장자 기준의
  // 최소한의 방어선이며, 완전한 백신 검사를 대신하지는 않는다).
  const NOTES_ATTACHMENT_BLOCKED_EXT = [
    "exe", "msi", "bat", "cmd", "com", "scr", "pif", "js", "jse", "vbs", "vbe",
    "wsf", "wsh", "ps1", "psm1", "jar", "apk", "app", "dmg", "pkg", "sh",
    "command", "hta", "html", "htm", "svg",
  ];
  function getFileExtension(name) {
    const m = /\.([a-z0-9]+)$/i.exec(String(name || "").trim());
    return m ? m[1].toLowerCase() : "";
  }

  function formatAttachmentSize(bytes) {
    const n = Number(bytes) || 0;
    if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)}MB`;
    if (n >= 1024) return `${Math.round(n / 1024)}KB`;
    return `${n}B`;
  }
  function sanitizeAttachmentFileName(name) {
    // Supabase Storage 키는 AWS S3 오브젝트 키 규칙(대략 영문/숫자/일부 안전 특수문자)만
    // 허용하며, 한글 등 비-ASCII 문자가 포함되면 "Invalid key" 오류로 업로드가 실패한다.
    // 화면에 보이는 파일명(att.name, 다운로드 시 사용)은 원본 그대로 두고, 이 함수는
    // Storage 저장 경로에만 쓰일 안전한 이름을 만든다.
    const raw = String(name || "file").trim();
    const dot = raw.lastIndexOf(".");
    const hasExt = dot > 0 && dot < raw.length - 1;
    const rawExt = hasExt ? raw.slice(dot + 1) : "";
    const rawBase = hasExt ? raw.slice(0, dot) : raw;
    const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
    let base = rawBase
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9!\-_.'()]/g, "") // 한글 등 비-ASCII 및 기타 특수문자 제거
      .replace(/_+/g, "_")
      .replace(/^[_.]+|[_.]+$/g, "")
      .slice(0, 100);
    if (!base) base = "file";
    return ext ? `${base}.${ext}` : base;
  }
  function attachmentStoragePath(noteId, att) {
    return `${CURRENT_ACCOUNT_ID}/${noteId}/${att.id}_${sanitizeAttachmentFileName(att.name)}`;
  }
  async function uploadNoteAttachments(noteId, fileList) {
    const note = notesData.notes[noteId];
    if (!note) return;
    if (!cloud) { alert("클라우드 연결이 안 되어 있어 파일을 업로드할 수 없어요."); return; }
    if (!note.attachments) note.attachments = [];
    const files = Array.from(fileList || []);
    if (!files.length) return;
    notesUi.uploadingNoteId = noteId;
    renderApp();
    for (const file of files) {
      if (file.size > NOTES_ATTACHMENT_MAX_MB * 1024 * 1024) {
        alert(`"${file.name}"은(는) ${NOTES_ATTACHMENT_MAX_MB}MB를 초과해서 업로드할 수 없어요.`);
        continue;
      }
      const ext = getFileExtension(file.name);
      if (ext && NOTES_ATTACHMENT_BLOCKED_EXT.includes(ext)) {
        alert(`"${file.name}"(.${ext}) 형식은 보안상 첨부할 수 없어요. 실행 파일류나 웹페이지로 열리는 형식은 막아뒀어요. 필요하면 zip으로 압축해서 올려주세요.`);
        continue;
      }
      const att = { id: genId(), name: file.name, size: file.size, type: file.type || "", uploadedAt: new Date().toISOString() };
      const path = attachmentStoragePath(noteId, att);
      try {
        const { error } = await cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).upload(path, file, { upsert: false, contentType: "application/octet-stream" });
        if (error) throw error;
        att.path = path;
        note.attachments.push(att);
        saveNotesData();
      } catch (e) {
        alert(`"${file.name}" 업로드에 실패했어요: ${(e && e.message) || e}\n\n버킷 설정이 아직 안 되어 있다면 supabase/notes-attachments-storage-setup.sql을 Supabase에서 먼저 실행해주세요.`);
      }
    }
    notesUi.uploadingNoteId = null;
    renderApp();
  }
  async function downloadNoteAttachment(noteId, attId) {
    const note = notesData.notes[noteId];
    const att = note && note.attachments && note.attachments.find((a) => a.id === attId);
    if (!att) return;
    if (!cloud) { alert("클라우드 연결이 안 되어 있어 파일을 내려받을 수 없어요."); return; }
    try {
      const { data, error } = await cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).download(att.path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = att.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (e) {
      alert(`파일을 내려받지 못했어요: ${(e && e.message) || e}`);
    }
  }
  async function deleteNoteAttachment(noteId, attId) {
    const note = notesData.notes[noteId];
    if (!note || !note.attachments) return;
    const att = note.attachments.find((a) => a.id === attId);
    if (!att) return;
    if (!window.confirm(`"${att.name}" 파일을 삭제할까요?`)) return;
    if (cloud && att.path) {
      try { await cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).remove([att.path]); } catch (e) {}
    }
    note.attachments = note.attachments.filter((a) => a.id !== attId);
    saveNotesData();
    renderApp();
  }

  let notesStatusTimer = null;
  function flashNotesStatus(msg) {
    const el = document.getElementById("notes-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(notesStatusTimer);
    notesStatusTimer = setTimeout(() => { el.textContent = ""; }, 1500);
  }
  function saveNotesData() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notesData));
      flashNotesStatus("저장됨");
    } catch (e) { flashNotesStatus("저장 실패"); }
  }

  const notesUi = {
    expanded: {},
    collapsedFolders: {},
    showNewNote: false,
    showNewFolder: false,
    uploadingNoteId: null,
  };

  function createFolder(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = genId();
    notesData.folders.push({ id, name: trimmed });
    notesData.folderOrder[id] = [];
    saveNotesData();
  }
  function deleteFolder(id) {
    recordUndo("폴더 삭제", NOTES_KEY, () => undoRestoreObjectInPlace(notesData, loadNotesData()));
    const orphaned = notesData.folderOrder[id] || [];
    notesData.folderOrder[UNFILED] = (notesData.folderOrder[UNFILED] || []).concat(orphaned);
    orphaned.forEach((noteId) => { if (notesData.notes[noteId]) notesData.notes[noteId].folderId = null; });
    notesData.folders = notesData.folders.filter((f) => f.id !== id);
    delete notesData.folderOrder[id];
    saveNotesData();
  }
  function createNote(title, folderIdRaw) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const folderId = folderIdRaw && folderIdRaw !== UNFILED ? folderIdRaw : null;
    const id = genId();
    notesData.notes[id] = { id, title: trimmed, content: "", folderId, pinned: false, attachments: [] };
    const key = folderId || UNFILED;
    if (!notesData.folderOrder[key]) notesData.folderOrder[key] = [];
    notesData.folderOrder[key].push(id);
    saveNotesData();
  }
  function deleteNote(id) {
    const note = notesData.notes[id];
    if (!note) return;
    recordUndo("메모 삭제", NOTES_KEY, () => undoRestoreObjectInPlace(notesData, loadNotesData()));
    const key = note.folderId || UNFILED;
    if (notesData.folderOrder[key]) notesData.folderOrder[key] = notesData.folderOrder[key].filter((x) => x !== id);
    notesData.pinnedOrder = notesData.pinnedOrder.filter((x) => x !== id);
    if (cloud && note.attachments && note.attachments.length) {
      const paths = note.attachments.map((a) => a.path).filter(Boolean);
      if (paths.length) cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).remove(paths).catch(() => {});
    }
    delete notesData.notes[id];
    delete notesUi.expanded[id];
    saveNotesData();
  }
  function togglePin(id) {
    const note = notesData.notes[id];
    if (!note) return;
    if (note.pinned) {
      note.pinned = false;
      notesData.pinnedOrder = notesData.pinnedOrder.filter((x) => x !== id);
    } else {
      if (notesData.pinnedOrder.length >= 5) {
        alert("고정 메모는 최대 5개까지 지정할 수 있어요.");
        return;
      }
      note.pinned = true;
      notesData.pinnedOrder.push(id);
    }
    saveNotesData();
    renderApp();
  }
  function updateNoteContent(id, content) {
    const note = notesData.notes[id];
    if (!note) return;
    note.content = content;
    saveNotesData();
  }
  function renameNote(id) {
    const note = notesData.notes[id];
    if (!note) return;
    const next = window.prompt("메모 제목 수정", note.title);
    if (next === null) return;
    const trimmed = next.trim();
    if (!trimmed) return;
    note.title = trimmed;
    saveNotesData();
    renderApp();
  }

  let dragState = null; // { id, listKey }

  function reorderList(listKey, draggedId, targetId) {
    let arr;
    if (listKey === "pinned") arr = notesData.pinnedOrder;
    else arr = notesData.folderOrder[listKey.replace("folder:", "")];
    if (!arr) return;
    const from = arr.indexOf(draggedId);
    const to = arr.indexOf(targetId);
    if (from === -1 || to === -1 || from === to) return;
    arr.splice(from, 1);
    arr.splice(to, 0, draggedId);
    saveNotesData();
    renderApp();
  }

  function isFolderKind(listKey) { return listKey.indexOf("folder:") === 0; }
  function folderKeyOf(listKey) { return listKey.replace("folder:", ""); }

  function moveNoteAcrossFolders(noteId, fromKey, toKey, targetId) {
    if (!notesData.folderOrder[fromKey]) notesData.folderOrder[fromKey] = [];
    if (!notesData.folderOrder[toKey]) notesData.folderOrder[toKey] = [];
    notesData.folderOrder[fromKey] = notesData.folderOrder[fromKey].filter((x) => x !== noteId);
    notesData.folderOrder[toKey] = notesData.folderOrder[toKey].filter((x) => x !== noteId);
    if (targetId && notesData.folderOrder[toKey].includes(targetId)) {
      notesData.folderOrder[toKey].splice(notesData.folderOrder[toKey].indexOf(targetId), 0, noteId);
    } else {
      notesData.folderOrder[toKey].push(noteId);
    }
    const note = notesData.notes[noteId];
    if (note) note.folderId = toKey === UNFILED ? null : toKey;
    saveNotesData();
    renderApp();
  }

  function attachDragHandlers(root) {
    root.querySelectorAll(".note-row[draggable='true']").forEach((row) => {
      const id = row.getAttribute("data-note-id");
      const listKey = row.getAttribute("data-list-key");
      row.addEventListener("dragstart", (e) => {
        dragState = { id, listKey };
        row.classList.add("dragging");
        try { e.dataTransfer.setData("text/plain", id); } catch (err) {}
        e.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        root.querySelectorAll(".drag-over").forEach((r) => r.classList.remove("drag-over"));
        dragState = null;
      });
      row.addEventListener("dragover", (e) => {
        if (!dragState) return;
        const compatible = (dragState.listKey === "pinned" && listKey === "pinned") ||
          (isFolderKind(dragState.listKey) && isFolderKind(listKey));
        if (!compatible) return;
        e.preventDefault();
        e.stopPropagation();
        row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        row.classList.remove("drag-over");
        if (!dragState || dragState.id === id) return;
        if (dragState.listKey === "pinned" && listKey === "pinned") {
          reorderList("pinned", dragState.id, id);
        } else if (isFolderKind(dragState.listKey) && isFolderKind(listKey)) {
          const fromKey = folderKeyOf(dragState.listKey);
          const toKey = folderKeyOf(listKey);
          if (fromKey === toKey) reorderList(listKey, dragState.id, id);
          else moveNoteAcrossFolders(dragState.id, fromKey, toKey, id);
        }
      });
    });

    root.querySelectorAll("[data-folder-drop]").forEach((zone) => {
      const toKey = zone.getAttribute("data-folder-drop");
      zone.addEventListener("dragover", (e) => {
        if (!dragState || !isFolderKind(dragState.listKey)) return;
        e.preventDefault();
        zone.classList.add("drag-over-zone");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("drag-over-zone"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over-zone");
        if (!dragState || !isFolderKind(dragState.listKey)) return;
        const fromKey = folderKeyOf(dragState.listKey);
        if (fromKey === toKey) return;
        moveNoteAcrossFolders(dragState.id, fromKey, toKey, null);
      });
    });
  }

  function renderNoteRow(note, listKey) {
    const isExpanded = !!notesUi.expanded[note.id];
    const folder = note.folderId ? notesData.folders.find((f) => f.id === note.folderId) : null;
    return `
      <div class="note-row" draggable="true" data-note-id="${note.id}" data-list-key="${listKey}">
        <div class="note-head">
          <span class="drag-handle" title="드래그해서 순서 변경">⠿</span>
          <button class="pin-btn ${note.pinned ? "pinned" : ""}" data-action="pin" data-id="${note.id}" title="${note.pinned ? "고정 해제" : "상단에 고정"}">${note.pinned ? "★" : "☆"}</button>
          <button class="note-title-btn ${isExpanded ? "expanded" : ""}" data-action="expand" data-id="${note.id}">
            <span class="caret">▸</span>
            <span>${esc(note.title)}</span>
            ${folder && listKey === "pinned" ? `<span class="note-folder-tag">${esc(folder.name)}</span>` : ""}
          </button>
          <button class="note-del" data-action="rename" data-id="${note.id}" title="제목 수정">✎</button>
          <button class="note-del" data-action="delete-note" data-id="${note.id}" title="삭제">✕</button>
        </div>
        ${isExpanded ? `
        <div class="note-body">
          <textarea class="note-content" data-content-id="${note.id}" placeholder="메모 내용을 입력하세요">${esc(note.content)}</textarea>
          ${renderNoteAttachments(note)}
        </div>` : ""}
      </div>
    `;
  }

  function renderNoteAttachments(note) {
    const attachments = note.attachments || [];
    const uploading = notesUi.uploadingNoteId === note.id;
    return `
      <div class="note-attachments">
        <div class="note-attachments-head">
          <span class="note-attachments-label">${ICON_PAPERCLIP} 첨부파일${attachments.length ? ` (${attachments.length})` : ""}</span>
          <button type="button" class="ghost-btn note-attach-btn" data-action="attach-file" data-id="${note.id}" ${uploading ? "disabled" : ""}>
            ${uploading ? "업로드 중…" : `${ICON_UPLOAD} 파일 첨부`}
          </button>
          <input type="file" multiple style="display:none;" data-file-input="${note.id}">
        </div>
        ${attachments.length === 0
          ? `<div class="note-attachment-empty">첨부된 파일이 없어요.</div>`
          : `<div class="note-attachment-list">
              ${attachments.map((a) => `
                <div class="note-attachment-row">
                  <span class="note-attachment-name" title="${esc(a.name)}">${esc(a.name)}</span>
                  <span class="note-attachment-size">${formatAttachmentSize(a.size)}</span>
                  <button type="button" class="note-attachment-icon-btn" data-action="download-attachment" data-id="${note.id}" data-att-id="${a.id}" title="다운로드">${ICON_DOWNLOAD}</button>
                  <button type="button" class="note-attachment-icon-btn note-attachment-icon-btn-danger" data-action="delete-attachment" data-id="${note.id}" data-att-id="${a.id}" title="삭제">${ICON_TRASH}</button>
                </div>
              `).join("")}
            </div>`}
      </div>
    `;
  }

  function renderNotesPage(root) {
    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);
    const folderOptions = `<option value="${UNFILED}">미분류</option>` + notesData.folders.map((f) => `<option value="${f.id}">${esc(f.name)}</option>`).join("");

    let pinnedHtml = "";
    if (pinnedNotes.length > 0) {
      pinnedHtml = `
        <div class="pinned-block">
          <div class="pinned-title">${ICON_PIN} 고정된 메모 <span class="pinned-count">(${pinnedNotes.length}/5)</span></div>
          <div class="folder-body" style="padding:0;">
            ${pinnedNotes.map((n) => renderNoteRow(n, "pinned")).join("")}
          </div>
        </div>
      `;
    }

    const allFolders = [{ id: null, name: "미분류", key: UNFILED }].concat(notesData.folders.map((f) => ({ id: f.id, name: f.name, key: f.id })));
    let foldersHtml = "";
    allFolders.forEach((f) => {
      const noteIds = notesData.folderOrder[f.key] || [];
      const notesInFolder = noteIds.map((id) => notesData.notes[id]).filter(Boolean);
      if (f.key === UNFILED && notesInFolder.length === 0) return; // 미분류가 비어있으면 숨김
      const collapsed = !!notesUi.collapsedFolders[f.key];
      foldersHtml += `
        <div class="folder-block">
          <div class="folder-header" data-action="toggle-folder" data-key="${f.key}">
            <span class="folder-chevron">${collapsed ? "▸" : "▾"}</span>
            <span class="folder-name">${esc(f.name)}</span>
            <span class="folder-count">${notesInFolder.length}개</span>
            ${f.id ? `<button class="folder-del" data-action="delete-folder" data-id="${f.id}" title="폴더 삭제">✕</button>` : ""}
          </div>
          ${collapsed ? "" : `
          <div class="folder-body" data-folder-drop="${f.key}">
            ${notesInFolder.length === 0
              ? `<div class="folder-empty">이 폴더에는 아직 메모가 없어요.<br>다른 메모를 여기로 드래그해서 옮길 수도 있어요.</div>`
              : notesInFolder.map((n) => renderNoteRow(n, `folder:${f.key}`)).join("")}
          </div>`}
        </div>
      `;
    });

    const totalNotes = Object.keys(notesData.notes).length;
    const hasFolders = notesData.folders.length > 0;

    root.innerHTML = `
      <div class="notes-header">
        <div class="notes-title">업무 정리</div>
        <div class="notes-actions">
          <button class="ghost-btn solid-accent-btn" id="btn-new-folder">+ 새 폴더</button>
          <button class="ghost-btn solid-accent-btn" id="btn-new-note">+ 새 메모</button>
        </div>
      </div>
      <div class="card">
      <div class="status" id="notes-status" style="margin-bottom:10px;"></div>

      ${notesUi.showNewFolder ? `
      <form class="inline-form" id="folder-form">
        <input type="text" id="new-folder-name" placeholder="폴더 이름 (예: 업무 매뉴얼)" autocomplete="off">
        <button type="submit" class="primary-btn">만들기</button>
        <button type="button" class="cancel-btn" id="cancel-folder">취소</button>
      </form>` : ""}

      ${notesUi.showNewNote ? `
      <form class="inline-form" id="note-form">
        <input type="text" id="new-note-title" placeholder="메모 제목" autocomplete="off">
        <select id="new-note-folder">${folderOptions}</select>
        <button type="submit" class="primary-btn">추가</button>
        <button type="button" class="cancel-btn" id="cancel-note">취소</button>
      </form>` : ""}

      ${pinnedHtml}

      ${(totalNotes === 0 && !hasFolders) ? `<div class="notes-empty">아직 메모가 없어요.<br>오른쪽 위 "＋ 새 메모"로 첫 업무 메모를 만들어보세요.</div>` : foldersHtml}
      </div>
    `;

    attachNotesEvents(root);
  }

  function attachNotesEvents(root) {
    const noteFolderSelect = document.getElementById("new-note-folder");
    if (noteFolderSelect) enhanceSelect(noteFolderSelect);
    const newFolderBtn = document.getElementById("btn-new-folder");
    const newNoteBtn = document.getElementById("btn-new-note");
    if (newFolderBtn) newFolderBtn.onclick = () => { notesUi.showNewFolder = true; notesUi.showNewNote = false; renderApp(); setTimeout(() => { const el = document.getElementById("new-folder-name"); if (el) el.focus(); }, 0); };
    if (newNoteBtn) newNoteBtn.onclick = () => { notesUi.showNewNote = true; notesUi.showNewFolder = false; renderApp(); setTimeout(() => { const el = document.getElementById("new-note-title"); if (el) el.focus(); }, 0); };

    const folderForm = document.getElementById("folder-form");
    if (folderForm) {
      folderForm.onsubmit = (e) => {
        e.preventDefault();
        const val = document.getElementById("new-folder-name").value;
        createFolder(val);
        notesUi.showNewFolder = false;
        renderApp();
      };
      const cancelFolder = document.getElementById("cancel-folder");
      if (cancelFolder) cancelFolder.onclick = () => { notesUi.showNewFolder = false; renderApp(); };
    }

    const noteForm = document.getElementById("note-form");
    if (noteForm) {
      noteForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById("new-note-title").value;
        const folderId = document.getElementById("new-note-folder").value;
        createNote(title, folderId);
        notesUi.showNewNote = false;
        renderApp();
      };
      const cancelNote = document.getElementById("cancel-note");
      if (cancelNote) cancelNote.onclick = () => { notesUi.showNewNote = false; renderApp(); };
    }

    root.querySelectorAll("[data-action='toggle-folder']").forEach((el) => {
      el.onclick = () => {
        const key = el.getAttribute("data-key");
        notesUi.collapsedFolders[key] = !notesUi.collapsedFolders[key];
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='delete-folder']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (window.confirm("이 폴더를 삭제할까요? 폴더 안의 메모는 '미분류'로 이동해요.")) {
          deleteFolder(btn.getAttribute("data-id"));
          renderApp();
        }
      };
    });
    root.querySelectorAll("[data-action='pin']").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); togglePin(btn.getAttribute("data-id")); };
    });
    root.querySelectorAll("[data-action='rename']").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); renameNote(btn.getAttribute("data-id")); };
    });
    root.querySelectorAll("[data-action='delete-note']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        deleteNote(btn.getAttribute("data-id"));
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='expand']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        notesUi.expanded[id] = !notesUi.expanded[id];
        renderApp();
      };
    });
    root.querySelectorAll("[data-content-id]").forEach((ta) => {
      ta.addEventListener("input", (e) => { updateNoteContent(ta.getAttribute("data-content-id"), e.target.value); });
    });

    root.querySelectorAll("[data-action='attach-file']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const input = root.querySelector(`[data-file-input="${id}"]`);
        if (input) input.click();
      };
    });
    root.querySelectorAll("[data-file-input]").forEach((input) => {
      input.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("change", (e) => {
        const id = input.getAttribute("data-file-input");
        if (e.target.files && e.target.files.length) uploadNoteAttachments(id, e.target.files);
        input.value = "";
      });
    });
    root.querySelectorAll("[data-action='download-attachment']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        downloadNoteAttachment(btn.getAttribute("data-id"), btn.getAttribute("data-att-id"));
      };
    });
    root.querySelectorAll("[data-action='delete-attachment']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        deleteNoteAttachment(btn.getAttribute("data-id"), btn.getAttribute("data-att-id"));
      };
    });

    attachDragHandlers(root);
  }

  /* ===================== 상담사 관리 모듈 ===================== */
  const AGENTS_KEY = acctKey("personal-agents:data");

  function loadAgentsData() {
    try {
      const raw = localStorage.getItem(AGENTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let agentsData = loadAgentsData();

  // "오늘" 날짜를 "YYYY-MM-DD" 문자열로. 퇴사일자와 그대로 비교하기 위해 쓴다.
  function agentTodayStr() { return `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`; }
  // 퇴사일자를 미래 날짜로 입력해둔("예약된 퇴사") 사람인지. 이런 사람은 그 날짜가
  // 되기 전까지는 "상담사 관리"에서 여전히 "근무중"으로 보이고(자동으로는 안 바뀜),
  // 월별 스케줄에는 입력한 순간 바로 반영돼 있다.
  function isAgentScheduledResign(a) {
    return a.status === "WORKING" && !!a.resignDate && a.resignDate > agentTodayStr();
  }
  // 예약해둔 퇴사일자가 실제로 지나면(오늘이 되거나 지나면) 자동으로 "퇴사" 상태로
  // 바꿔준다. 앱을 열 때마다(=날짜가 바뀐 뒤 새로 열었을 때) 한 번씩 확인한다.
  function autoFlipResignedAgents() {
    const todayStr = agentTodayStr();
    let changed = false;
    agentsData.forEach((a) => {
      if (a.status === "WORKING" && a.resignDate && a.resignDate <= todayStr) {
        a.status = "RESIGNED";
        changed = true;
      }
    });
    return changed;
  }

  const agentsUi = {
    selectedId: null,
    mode: "view", // "view" | "add" | "edit"
    editingId: null,
    searchQuery: "",
    filterTypes: new Set(), // 비어있으면 "전체". "voice"|"chat"|"day"|"night"|"working"|"resigned" 중복 선택(AND 조합) 가능
    sortBy: "shift", // "shift" | "custom" | "name" | "type" | "chat" | "night" | "created"
    interviewMode: "list", // "list" | "add" | "edit" — 상담사 상세의 면담 이력 섹션용
    interviewEditingId: null,
    page: 1, // 고정 인원을 제외한 목록의 현재 페이지(PAGE_SIZE개씩)
  };

  let agentStatusTimer = null;
  function flashAgentStatus(msg) {
    const el = document.getElementById("agent-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(agentStatusTimer);
    agentStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveAgentsData() {
    try { localStorage.setItem(AGENTS_KEY, JSON.stringify(agentsData)); flashAgentStatus("저장됨"); }
    catch (e) { flashAgentStatus("저장 실패"); }
    // 상담사 관리 목록이 바뀔 때마다 월별 스케줄의 인원 목록도 자동으로 맞춰준다.
    if (typeof syncScheduleStaffFromAgents === "function") {
      syncScheduleStaffFromAgents();
      saveScheduleData();
    }
  }

  // 앱을 여는 시점에 예약된 퇴사일이 이미 지난 사람이 있으면 바로 "퇴사"로 넘겨준다.
  if (autoFlipResignedAgents()) saveAgentsData();

  function addAgent(values) {

    const id = genId();
    agentsData.push(Object.assign({ id }, values));
    saveAgentsData();
    return id;
  }
  function updateAgent(id, values) {
    const idx = agentsData.findIndex((a) => a.id === id);
    if (idx === -1) return;
    agentsData[idx] = Object.assign({}, agentsData[idx], values);
    saveAgentsData();
  }
  function deleteAgent(id) {
    // 상담사를 지울 때 그 사람의 면담 기록·QA 평가 기록(점수 + 업로드된 엑셀 파일 정보)도
    // 함께 정리되므로, 관련 저장소를 모두 함께 스냅샷해둔다.
    recordUndo("상담사 삭제", [AGENTS_KEY, INTERVIEWS_KEY, QA_KEY], () => {
      agentsData = loadAgentsData();
      interviewsData = loadInterviewsData();
      if (typeof loadQAData === "function") qaData = loadQAData();
    });
    agentsData = agentsData.filter((a) => a.id !== id);
    if (agentsUi.selectedId === id) agentsUi.selectedId = null;
    saveAgentsData();
    // 상담사를 지울 때 그 사람의 면담 기록도 함께 정리한다.
    if (typeof interviewsData !== "undefined") {
      interviewsData = interviewsData.filter((r) => r.agentId !== id);
      saveInterviewsData();
    }
    // 상담사를 지울 때, 그 사람 앞으로 업로드해뒀던 QA 점수·평가 엑셀(원문/정리된 텍스트 전부)도
    // 모든 달에 걸쳐 함께 삭제한다. 이걸 안 지우면 "파일은 있는데 상담사 목록엔 없는"
    // 유령 데이터로 계속 남게 된다.
    if (typeof qaData !== "undefined" && qaData) {
      const prefix = `${id}|`;
      let qaChanged = false;
      if (qaData.scores) {
        Object.keys(qaData.scores).forEach((key) => {
          if (key.indexOf(prefix) === 0) { delete qaData.scores[key]; qaChanged = true; }
        });
      }
      if (qaData.details) {
        Object.keys(qaData.details).forEach((key) => {
          if (key.indexOf(prefix) === 0) { delete qaData.details[key]; qaChanged = true; }
        });
      }
      if (qaChanged && typeof saveQAData === "function") saveQAData();
    }
  }
  function reorderAgents(fromId, toId) {
    const fromIdx = agentsData.findIndex((a) => a.id === fromId);
    const toIdx = agentsData.findIndex((a) => a.id === toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [item] = agentsData.splice(fromIdx, 1);
    const newToIdx = agentsData.findIndex((a) => a.id === toId);
    agentsData.splice(newToIdx, 0, item);
    saveAgentsData();
  }
  const AGENT_PIN_LIMIT = 10;
  function togglePinAgent(id) {
    const agent = agentsData.find((a) => a.id === id);
    if (!agent) return;
    if (!agent.pinned) {
      const pinnedCount = agentsData.filter((a) => a.pinned).length;
      if (pinnedCount >= AGENT_PIN_LIMIT) {
        flashAgentStatus(`고정은 최대 ${AGENT_PIN_LIMIT}개까지 가능해요`);
        return;
      }
    }
    agent.pinned = !agent.pinned;
    saveAgentsData();
    renderApp();
  }

  // 리스트에서 바로 "근무중" ↔ "퇴사"를 전환한다. 수정 화면을 열지 않아도 되도록
  // 리스트 안의 배지를 클릭하면 즉시 상태가 바뀌고, 저장과 동시에 월별 스케줄
  // 반영 여부도 자동으로 다시 계산된다. "퇴사"로 바꿀 때는 퇴사일자를 물어보고,
  // 그 날짜부터 해당 월 말일까지 월별 스케줄이 자동으로 "퇴사"로 채워진다.
  // 입력한 퇴사일자가 오늘보다 미래라면, "상담사 관리"의 재직 상태는 그 날짜가
  // 될 때까지 "근무중"으로 남아있고(자동으로 바로 "퇴사"로 바뀌지 않음) 그 날짜가
  // 되면 자동으로 "퇴사"로 전환된다. 다만 월별 스케줄에는 입력한 즉시 반영된다.
  function toggleAgentStatus(id) {
    const agent = agentsData.find((a) => a.id === id);
    if (!agent) return;
    if (agent.status === "RESIGNED") {
      if (typeof clearResignedScheduleFrom === "function" && agent.resignDate) {
        clearResignedScheduleFrom(agent.id, agent.resignDate);
      }
      agent.status = "WORKING";
      agent.resignDate = null;
    } else {
      const defaultDate = agentTodayStr();
      const input = window.prompt(
        `${agent.name}님의 퇴사일자를 입력해주세요 (예: ${defaultDate}).\n이 날짜부터 이번 달 말일까지 월별 스케줄에 자동으로 "퇴사"로 표시돼요.\n미래 날짜를 입력하면, 그 날짜가 될 때까지는 "상담사 관리"에서 재직 상태가 "근무중"으로 유지되다가 그 날짜에 자동으로 "퇴사"로 바뀌어요(스케줄에는 지금 바로 반영돼요).`,
        defaultDate
      );
      if (input === null) return; // 취소하면 상태를 바꾸지 않는다
      const trimmed = input.trim();
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
      const parsed = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
      const isValid = m && parsed.getFullYear() === Number(m[1]) && parsed.getMonth() === Number(m[2]) - 1 && parsed.getDate() === Number(m[3]);
      if (!isValid) {
        flashAgentStatus("퇴사일자 형식이 올바르지 않아요 (예: 2026-09-14)");
        return;
      }
      agent.status = trimmed <= agentTodayStr() ? "RESIGNED" : "WORKING";
      agent.resignDate = trimmed;
      if (typeof applyResignedScheduleFrom === "function") applyResignedScheduleFrom(agent.id, trimmed);
    }
    saveAgentsData();
    renderApp();
  }

  // 이름 초성만으로도 검색이 되도록 한글 음절에서 초성을 뽑아내는 헬퍼.
  const CHOSUNG_LIST = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  function getChosungString(str) {
    let out = "";
    for (const ch of (str || "")) {
      const code = ch.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) out += CHOSUNG_LIST[Math.floor((code - 0xac00) / 588)];
      else out += ch;
    }
    return out;
  }
  // 이름/LDAP/초성 외에, "주간"/"야간"/"채팅"/"유선" 같은 근무 형태 키워드로도 검색할 수 있게 한다.
  // 이름에 이 단어들이 실제로 들어갈 일은 거의 없으므로, 이름 검색과 그냥 OR로 묶어도 안전하다.
  const AGENT_SEARCH_KEYWORD_MATCHERS = {
    "주간": (a) => a.group !== "night",
    "야간": (a) => a.group === "night",
    "채팅": (a) => (a.workTypes || []).indexOf("채팅") !== -1,
    "유선": (a) => (a.workTypes || []).indexOf("유선") !== -1,
  };
  function agentMatchesSearchKeyword(a, needle) {
    const fn = AGENT_SEARCH_KEYWORD_MATCHERS[needle];
    if (fn) return fn(a);
    // 사용자가 추가한 업무 구분 이름도 그대로 검색어로 쓸 수 있게 한다(대소문자 무시).
    const customHit = customWorkTypes.some((t) => t.toLowerCase() === needle && (a.workTypes || []).indexOf(t) !== -1);
    return customHit;
  }
  function agentMatchesSearch(a, query) {
    const needle = (query || "").trim().toLowerCase();
    if (!needle) return true;
    if ((a.name || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((a.ldap || "").toLowerCase().indexOf(needle) !== -1) return true;
    if (getChosungString(a.name || "").indexOf(needle) !== -1) return true;
    if (agentMatchesSearchKeyword(a, needle)) return true;
    return false;
  }
  function agentMatchesFilterType(a, filterType) {
    if (filterType === "voice") return (a.workTypes || []).indexOf("유선") !== -1;
    if (filterType === "chat") return (a.workTypes || []).indexOf("채팅") !== -1;
    if (filterType === "day") return a.group !== "night";
    if (filterType === "night") return a.group === "night";
    if (filterType === "working") return a.status !== "RESIGNED";
    if (filterType === "resigned") return a.status === "RESIGNED";
    // 사용자가 추가한 업무 구분 필터 버튼은 "custom:이름" 형태의 filterType으로 들어온다.
    if (filterType && filterType.indexOf("custom:") === 0) {
      const typeName = filterType.slice("custom:".length);
      return (a.workTypes || []).indexOf(typeName) !== -1;
    }
    return true;
  }
  // filterTypes: Set(문자열). 비어있으면 전체 통과. 여러 개면 모두 만족(AND)해야 통과 — 버튼 중복 선택 지원.
  function agentMatchesFilter(a, filterTypes) {
    if (!filterTypes || filterTypes.size === 0) return true;
    for (const ft of filterTypes) {
      if (!agentMatchesFilterType(a, ft)) return false;
    }
    return true;
  }
  function agentTypeRank(a) {
    const hasVoice = (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a.workTypes || []).indexOf("채팅") !== -1;
    if (hasVoice && hasChat) return 1;
    if (hasVoice) return 0;
    if (hasChat) return 2;
    return 3;
  }
  function agentChatRank(a) {
    const hasVoice = (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a.workTypes || []).indexOf("채팅") !== -1;
    if (hasChat && hasVoice) return 1;
    if (hasChat) return 0;
    if (hasVoice) return 2;
    return 3;
  }
  function agentNightRank(a) {
    return a.group === "night" ? 0 : 1;
  }
  // 기본 정렬(주간→야간, 그 안에서 채팅→유선, 그 중에서도 근무 시작 시각 순)을 위한 순위들.
  function agentGroupRank(a) {
    return a.group === "night" ? 1 : 0;
  }
  function agentShiftTypeRank(a) {
    const types = a.workTypes || [];
    if (types.indexOf("채팅") !== -1) return 0;
    if (types.indexOf("유선") !== -1) return 1;
    return 2;
  }
  // 근무시간(예: "09:00-18:00") 문자열에서 시작 시각을 분 단위로 추출한다.
  // 형식을 찾을 수 없으면 맨 뒤로 보내기 위해 아주 큰 값을 반환한다.
  function agentStartMinutes(a) {
    const wh = a.timezone || "";
    const m = wh.match(/(\d{1,2}):(\d{2})/);
    if (!m) return Infinity;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  function sortAgentList(list, sortBy) {
    const arr = [...list];
    if (sortBy === "shift") {
      arr.sort((a, b) => {
        const g = agentGroupRank(a) - agentGroupRank(b);
        if (g !== 0) return g;
        const t = agentShiftTypeRank(a) - agentShiftTypeRank(b);
        if (t !== 0) return t;
        const s = agentStartMinutes(a) - agentStartMinutes(b);
        if (s !== 0) return s;
        return a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortBy === "type") {
      arr.sort((a, b) => {
        const r = agentTypeRank(a) - agentTypeRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "chat") {
      arr.sort((a, b) => {
        const r = agentChatRank(a) - agentChatRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "night") {
      arr.sort((a, b) => {
        const r = agentNightRank(a) - agentNightRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "created") {
      arr.sort((a, b) => a.id.localeCompare(b.id));
    }
    // "custom" -> keep existing (drag-defined) order

    // 정렬 기준과 무관하게, 퇴사 처리된 인원은 항상 목록 맨 아래로 보낸다.
    // sort는 안정 정렬이라 같은 재직 상태 안에서는 위에서 정한 순서가 그대로 유지된다.
    arr.sort((a, b) => (a.status === "RESIGNED" ? 1 : 0) - (b.status === "RESIGNED" ? 1 : 0));
    return arr;
  }

  function workTypeBadgesHtml(types) {
    if (!types || types.length === 0) return `<span class="agent-field-empty">-</span>`;
    return renderWorkTypeBadges(types);
  }
  function scheduleGroupLabel(group) { return group === "night" ? `${ICON_MOON} 야간` : `${ICON_SUN} 주간`; }
  function scheduleGroupBadgeHtml(group) {
    return `<span class="badge ${group === "night" ? "night" : "day"}">${scheduleGroupLabel(group)}</span>`;
  }

  function renderAgentRow(a, section, draggable) {
    const selected = a.id === agentsUi.selectedId;
    const typeBadges = renderWorkTypeBadges(a.workTypes, "sm");
    const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
    const isResigned = a.status === "RESIGNED";
    const scheduledResign = isAgentScheduledResign(a);
    const statusLabel = isResigned ? "퇴사" : (scheduledResign ? "근무중(퇴사예정)" : "근무중");
    const statusBadge = `<button type="button" class="badge-btn sm ${isResigned ? "resigned" : "working"}" data-action="toggle-agent-status" data-id="${a.id}" title="${scheduledResign ? `${a.resignDate}부터 자동으로 퇴사 처리돼요. 클릭하면 재직 상태가 바로 바뀌어요` : "클릭하면 재직 상태가 바로 바뀌어요"}">${statusLabel}</button>`;
    return `
      <div class="agent-row ${selected ? "selected" : ""}" draggable="${draggable ? "true" : "false"}" data-agent-id="${a.id}" data-agent-section="${section}">
        <span class="drag-handle ${draggable ? "" : "drag-handle-disabled"}" title="${draggable ? "드래그해서 순서 변경" : "사용자 지정 정렬에서만 드래그할 수 있어요"}">⠿</span>
        <button class="pin-btn ${a.pinned ? "pinned" : ""}" data-action="pin-agent" data-id="${a.id}" title="${a.pinned ? "고정 해제" : "상단에 고정"}">${a.pinned ? "★" : "☆"}</button>
        <div class="agent-row-main" data-action="select-agent" data-id="${a.id}">
          <span class="agent-row-name">${esc(a.name)}${a.isAdmin ? ' <span class="badge sm admin">관리자</span>' : ""}${a.ldap ? ` <span class="agent-row-ldap-inline">${esc(a.ldap)}</span>` : ""}</span>
          <span class="agent-row-meta">${typeBadges}${groupBadge}${statusBadge}</span>
        </div>
      </div>
    `;
  }

  function renderAgentDetail(agent) {
    return `
      <div class="agent-detail-header">
        <div class="agent-detail-heading">
          <div class="agent-detail-name">${esc(agent.name)}</div>
        </div>
        <div class="agent-detail-actions">
          <button class="ghost-btn" data-action="edit-agent" data-id="${agent.id}">수정</button>
          <button class="ghost-btn danger" data-action="delete-agent" data-id="${agent.id}">삭제</button>
        </div>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">LDAP 이름</span>
        <span class="agent-field-value">${esc(agent.ldap)}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">사번</span>
        <span class="agent-field-value">${agent.empNo ? esc(agent.empNo) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">입사일자</span>
        <span class="agent-field-value">${agent.hireDate ? esc(agent.hireDate) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">연락처</span>
        <span class="agent-field-value">${agent.contact ? esc(agent.contact) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">업무 구분</span>
        <span class="agent-field-value">${workTypeBadgesHtml(agent.workTypes)}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">근무 조</span>
        <span class="agent-field-value">${scheduleGroupBadgeHtml(agent.group)}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">시간대</span>
        <span class="agent-field-value">${agent.timezone ? esc(agent.timezone) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">권한</span>
        <span class="agent-field-value">${agent.isAdmin ? '<span class="badge admin">관리자</span>' : '<span class="agent-field-empty">일반</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">재직 상태</span>
        <span class="agent-field-value">${agent.status === "RESIGNED" ? '<span class="badge resigned">퇴사</span>' : '<span class="badge working">근무중</span>'}${isAgentScheduledResign(agent) ? ` <span class="agent-field-empty">(${esc(agent.resignDate)}부터 자동 퇴사 예정, 월별 스케줄엔 이미 반영됨)</span>` : ""}</span>
      </div>
      ${renderAgentQAPreview(agent)}
      ${renderAgentInterviewSection(agent)}
    `;
  }

  function renderAgentForm(agent) {
    const isEdit = !!agent;
    const v = agent || { name: "", ldap: "", empNo: "", hireDate: "", contact: "", workTypes: [], timezone: "", group: "day", isAdmin: false, status: "WORKING", resignDate: "" };
    const workTypes = v.workTypes || [];
    const group = v.group === "night" ? "night" : "day";
    // 아직 날짜가 안 된 "예약된 퇴사"(status는 WORKING인데 resignDate가 미래)여도
    // 수정 화면에서는 "퇴사" 쪽을 선택해둔 상태로 보여준다. 그래야 나중에 다시
    // 열었을 때 예약해둔 날짜를 확인하거나 취소(근무중으로 되돌리기)할 수 있다.
    const status = (v.status === "RESIGNED" || v.resignDate) ? "RESIGNED" : "WORKING";
    return `
      <div class="agent-form-title">${isEdit ? "상담사 정보 수정" : "새 상담사 추가"}</div>
      <form class="agent-form" id="agent-form">
        <label class="agent-form-label">상담사 이름
          <input type="text" class="add-input" id="agent-input-name" value="${esc(v.name)}" placeholder="예: 홍길동" autocomplete="off">
        </label>
        <label class="agent-form-label">LDAP 이름
          <input type="text" class="add-input" id="agent-input-ldap" value="${esc(v.ldap)}" placeholder="예: hong.gd" autocomplete="off">
        </label>
        <label class="agent-form-label">사번
          <input type="text" class="add-input" id="agent-input-empno" value="${esc(v.empNo)}" placeholder="예: T25070840" autocomplete="off">
        </label>
        <label class="agent-form-label">입사일자
          <input type="date" class="add-input" id="agent-input-hiredate" value="${esc(v.hireDate)}" autocomplete="off">
        </label>
        <label class="agent-form-label">연락처
          <input type="text" class="add-input" id="agent-input-contact" value="${esc(v.contact)}" placeholder="예: 010-1234-5678" autocomplete="off">
        </label>
        <div class="agent-form-label">업무 구분
          <div class="agent-checkbox-row">
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-voice" ${workTypes.indexOf("유선") !== -1 ? "checked" : ""}> 유선</label>
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-chat" ${workTypes.indexOf("채팅") !== -1 ? "checked" : ""}> 채팅</label>
            ${customWorkTypes.map((t) => `
              <label class="agent-checkbox"><input type="checkbox" class="agent-input-custom-type" data-worktype="${esc(t)}" ${workTypes.indexOf(t) !== -1 ? "checked" : ""}> ${esc(t)}</label>
            `).join("")}
            <button type="button" class="ghost-btn agent-worktype-manage-btn" id="agent-worktype-manage-btn">+ 관리</button>
          </div>
        </div>
        <div class="agent-form-label">근무 조
          <div class="agent-radio-row">
            <label class="agent-radio"><input type="radio" name="agent-input-group" id="agent-input-group-day" value="day" ${group === "day" ? "checked" : ""}> ${ICON_SUN} 주간</label>
            <label class="agent-radio"><input type="radio" name="agent-input-group" id="agent-input-group-night" value="night" ${group === "night" ? "checked" : ""}> ${ICON_MOON} 야간</label>
          </div>
        </div>
        <label class="agent-form-label">시간대
          <input type="text" class="add-input" id="agent-input-timezone" value="${esc(v.timezone)}" placeholder="예: 09:00-18:00" autocomplete="off">
        </label>
        <div class="agent-form-label">재직 상태
          <div class="agent-radio-row">
            <label class="agent-radio"><input type="radio" name="agent-input-status" id="agent-input-status-working" value="WORKING" ${status === "WORKING" ? "checked" : ""}> 근무중</label>
            <label class="agent-radio"><input type="radio" name="agent-input-status" id="agent-input-status-resigned" value="RESIGNED" ${status === "RESIGNED" ? "checked" : ""}> 퇴사</label>
          </div>
        </div>
        <label class="agent-form-label" id="agent-resigndate-wrap" style="${status === "RESIGNED" ? "" : "display:none;"}">퇴사일자
          <input type="date" class="add-input" id="agent-input-resigndate" value="${esc(v.resignDate || "")}" autocomplete="off">
          <span class="agent-form-hint">오늘 이전(또는 오늘) 날짜면 바로 "퇴사"로 처리돼요. 미래 날짜를 넣으면 그 날짜가 될 때까지 재직 상태는 "근무중"으로 유지되다 그 날 자동으로 "퇴사"로 바뀌어요 — 월별 스케줄에는 지금 바로 그 날짜부터 반영됩니다.</span>
        </label>
        <div class="agent-form-label">권한
          <div class="agent-checkbox-row">
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-admin" ${v.isAdmin ? "checked" : ""}> 관리자</label>
          </div>
        </div>
        <div class="agent-form-actions">
          <button type="submit" class="primary-btn">${isEdit ? "저장" : "추가"}</button>
          <button type="button" class="cancel-btn" id="agent-form-cancel">취소</button>
        </div>
      </form>
    `;
  }

  function buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable) {
    let pinnedHtml = "";
    if (pinnedAgents.length > 0) {
      pinnedHtml = `
        <div class="pinned-block">
          <div class="pinned-title">${ICON_PIN} 고정된 인원 <span class="pinned-count">(${pinnedCount}/${AGENT_PIN_LIMIT})</span></div>
          <div class="agent-list">${pinnedAgents.map((a) => renderAgentRow(a, "pinned", draggable)).join("")}</div>
        </div>
      `;
    }

    let listHtml = "";
    if (agentsData.length === 0) {
      listHtml = `<div class="agent-list-empty">등록된 상담사가 없어요.<br>오른쪽 위 "＋ 상담사 추가"로 첫 상담사를 등록해보세요.</div>`;
    } else if (filtered.length === 0) {
      listHtml = `<div class="agent-list-empty">검색 또는 필터 조건에 맞는 상담사가 없어요.</div>`;
    } else if (listAgents.length > 0) {
      // 고정되지 않은 인원 목록은 10명씩 페이지를 나눠서 보여준다.
      const { items, page, totalPages } = paginateList(listAgents, agentsUi.page);
      agentsUi.page = page;
      listHtml = `
        <div class="agent-list">${items.map((a) => renderAgentRow(a, "list", draggable)).join("")}</div>
        ${renderPaginationHtml(page, totalPages, "agent-list")}
      `;
    }

    return `${pinnedHtml}${listHtml}`;
  }

  // 검색어/필터/정렬이 바뀔 때 목록 영역만 다시 그림.
  // 입력창(input) 자체는 건드리지 않으므로 한글 조합(IME) 중에도
  // 입력이 끊기지 않고, 목록은 타이핑하는 즉시 반영됨.
  function updateAgentListArea() {
    const listArea = document.getElementById("agent-list-area");
    if (!listArea) return;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";
    const pinnedCount = agentsData.filter((a) => a.pinned).length;

    listArea.innerHTML = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);
    attachAgentListAreaHandlers(listArea);
  }

  function attachAgentListAreaHandlers(root) {
    root.querySelectorAll("[data-action='select-agent']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.selectedId = btn.getAttribute("data-id");
        agentsUi.mode = "view";
        agentsUi.interviewMode = "list";
        agentsUi.interviewEditingId = null;
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='pin-agent']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        togglePinAgent(btn.getAttribute("data-id"));
      };
    });
    root.querySelectorAll("[data-action='toggle-agent-status']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleAgentStatus(btn.getAttribute("data-id"));
      };
    });
    attachPaginationHandlers(root, "agent-list", (delta) => {
      agentsUi.page = agentsUi.page + delta;
      updateAgentListArea();
    });
    attachAgentDragHandlers(root);
  }

  function renderAgentsPage(root) {
    const selected = agentsData.find((a) => a.id === agentsUi.selectedId) || null;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";

    const totalCount = agentsData.length;
    const resignedCount = agentsData.filter((a) => a.status === "RESIGNED").length;
    const workingCount = totalCount - resignedCount;
    const nonAdminAgents = agentsData.filter((a) => !a.isAdmin);
    const adminCount = agentsData.filter((a) => a.isAdmin).length;
    const voiceCount = nonAdminAgents.filter((a) => (a.workTypes || []).indexOf("유선") !== -1).length;
    const chatCount = nonAdminAgents.filter((a) => (a.workTypes || []).indexOf("채팅") !== -1).length;
    const dayCount = nonAdminAgents.filter((a) => a.group !== "night").length;
    const nightCount = nonAdminAgents.filter((a) => a.group === "night").length;
    const pinnedCount = agentsData.filter((a) => a.pinned).length;

    const summaryHtml = `<div class="agent-summary">전체 ${totalCount}명 · 관리자 ${adminCount}명 · 유선 ${voiceCount}명 · 채팅 ${chatCount}명 · 주간 ${dayCount}명 · 야간 ${nightCount}명 · 재직 ${workingCount}명 · 퇴사 ${resignedCount}명 · 고정 ${pinnedCount}명${customWorkTypes.map((t) => ` · ${esc(t)} ${nonAdminAgents.filter((a) => (a.workTypes || []).indexOf(t) !== -1).length}명`).join("")}</div>`;

    const controlsHtml = `
      <div class="agent-controls">
        <div class="agent-controls-top">
          <div class="agent-filter-row">
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.size === 0 ? "active" : ""}" data-filter="all">전체</button>
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("voice") ? "active" : ""}" data-filter="voice">유선</button>
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("chat") ? "active" : ""}" data-filter="chat">챗</button>
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("day") ? "active" : ""}" data-filter="day">주간</button>
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("night") ? "active" : ""}" data-filter="night">야간</button>
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("working") ? "active" : ""}" data-filter="working">재직</button>
            <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("resigned") ? "active" : ""}" data-filter="resigned">퇴사</button>
            ${customWorkTypes.map((t) => `
              <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has(`custom:${t}`) ? "active custom-active" : ""}" data-filter="custom:${esc(t)}">${esc(t)}</button>
            `).join("")}
          </div>
          <div class="agent-search-input">
            <input type="text" class="agent-search-input-field" id="agent-search-input" placeholder="이름 또는 LDAP 검색" value="${esc(agentsUi.searchQuery)}" autocomplete="off">
            ${ICON_SEARCH_MINI}
          </div>
        </div>
        <div class="agent-sort-row">
          <select class="agent-sort-select" id="agent-sort-select" data-trigger-class="agent-sort-select">
            <option value="shift" ${agentsUi.sortBy === "shift" ? "selected" : ""}>기본순(주간→야간·업무·시간순)</option>
            <option value="custom" ${agentsUi.sortBy === "custom" ? "selected" : ""}>사용자 지정(드래그)</option>
            <option value="name" ${agentsUi.sortBy === "name" ? "selected" : ""}>이름순</option>
            <option value="type" ${agentsUi.sortBy === "type" ? "selected" : ""}>업무구분별</option>
            <option value="chat" ${agentsUi.sortBy === "chat" ? "selected" : ""}>채팅순</option>
            <option value="night" ${agentsUi.sortBy === "night" ? "selected" : ""}>야간순</option>
            <option value="created" ${agentsUi.sortBy === "created" ? "selected" : ""}>등록순</option>
          </select>
        </div>
      </div>
    `;

    const listAreaHtml = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);

    let rightHtml;
    if (agentsUi.mode === "add") {
      rightHtml = renderAgentForm(null);
    } else if (agentsUi.mode === "edit") {
      const editing = agentsData.find((a) => a.id === agentsUi.editingId) || null;
      rightHtml = renderAgentForm(editing);
    } else if (selected) {
      rightHtml = renderAgentDetail(selected);
    } else {
      rightHtml = `<div class="agent-detail-empty">왼쪽 목록에서 상담사를 선택하면<br>상세 정보를 볼 수 있어요.</div>`;
    }

    // 모바일(≤900px)에서는 목록/상세를 한 화면에 같이 쌓아두지 않고 탭 한 번에
    // 화면 전체가 전환되는 것처럼 보이도록, 상세를 보여줄 상태인지에 따라
    // .agent-shell에 show-list/show-detail 클래스를 붙인다(데스크톱에서는 항상 나란히 보이므로 영향 없음).
    const mobileShowDetail = agentsUi.mode === "add" || agentsUi.mode === "edit" || !!selected;
    const shellStateClass = mobileShowDetail ? "show-detail" : "show-list";

    root.innerHTML = `
      <div class="agent-page-header">
        <div class="agent-list-heading">
          <div class="agent-list-title">상담사 관리</div>
          ${agentsData.length > 0 ? summaryHtml : ""}
        </div>
        <button class="agent-add-btn" id="btn-agent-add">＋ 상담사 추가</button>
      </div>
      <div class="agent-shell ${shellStateClass}">
        <div class="card agent-list-card">
          <div class="status" id="agent-status"></div>
          ${agentsData.length > 0 ? controlsHtml : ""}
          <div id="agent-list-area">${listAreaHtml}</div>
        </div>
        <div class="card agent-detail-card">
          <button type="button" class="agent-mobile-back-btn" id="btn-agent-mobile-back">‹ 목록으로</button>
          ${rightHtml}
        </div>
      </div>
    `;

    attachAgentEvents(root);
  }

  function attachAgentDragHandlers(root) {
    let dragState = null; // { id, section }
    root.querySelectorAll(".agent-row").forEach((row) => {
      if (row.getAttribute("draggable") !== "true") return;
      const id = row.getAttribute("data-agent-id");
      const section = row.getAttribute("data-agent-section");
      row.addEventListener("dragstart", (e) => {
        dragState = { id, section };
        row.classList.add("dragging");
        try { e.dataTransfer.effectAllowed = "move"; } catch (err) {}
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        dragState = null;
        root.querySelectorAll(".agent-row").forEach((r) => r.classList.remove("drag-over"));
      });
      row.addEventListener("dragover", (e) => {
        if (!dragState || dragState.id === id || dragState.section !== section) return;
        e.preventDefault();
        row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.classList.remove("drag-over");
        if (!dragState || dragState.id === id || dragState.section !== section) return;
        reorderAgents(dragState.id, id);
        renderApp();
      });
    });
  }

  function attachAgentEvents(root) {
    const addBtn = document.getElementById("btn-agent-add");
    if (addBtn) {
      addBtn.onclick = () => {
        agentsUi.mode = "add";
        agentsUi.editingId = null;
        renderApp();
        setTimeout(() => { const el = document.getElementById("agent-input-name"); if (el) el.focus(); }, 0);
      };
    }

    // 모바일 전체화면 전환 모드에서 상세/폼 화면 위에 뜨는 "‹ 목록으로" 버튼.
    // 선택 해제 + 추가/수정 모드 종료 후 목록 화면으로 되돌아간다.
    const mobileBackBtn = document.getElementById("btn-agent-mobile-back");
    if (mobileBackBtn) {
      mobileBackBtn.onclick = () => {
        agentsUi.selectedId = null;
        agentsUi.mode = "view";
        agentsUi.editingId = null;
        renderApp();
      };
    }

    attachAgentListAreaHandlers(root);

    const searchInput = document.getElementById("agent-search-input");
    if (searchInput) {
      // 목록 영역(#agent-list-area)만 갱신하고 검색창 자체는 다시 그리지 않음.
      // - 검색창 DOM이 그대로 유지되므로 한글 조합(IME) 중에도 입력이 끊기지 않음.
      // - 매 입력마다 목록 영역을 갱신하므로 검색 결과가 타이핑 즉시 반영됨.
      searchInput.oninput = (e) => {
        agentsUi.searchQuery = e.target.value;
        agentsUi.page = 1;
        updateAgentListArea();
      };
    }
    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.onclick = () => {
        const key = btn.getAttribute("data-filter");
        if (key === "all") {
          agentsUi.filterTypes.clear();
        } else if (agentsUi.filterTypes.has(key)) {
          agentsUi.filterTypes.delete(key);
        } else {
          agentsUi.filterTypes.add(key);
        }
        agentsUi.page = 1;
        renderApp();
      };
    });
    const sortSelect = document.getElementById("agent-sort-select");
    if (sortSelect) {
      enhanceSelect(sortSelect);
      sortSelect.onchange = (e) => {
        agentsUi.sortBy = e.target.value;
        agentsUi.page = 1;
        renderApp();
      };
    }
    root.querySelectorAll("[data-action='edit-agent']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.mode = "edit";
        agentsUi.editingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='delete-agent']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 상담사 정보를 삭제할까요?")) {
          deleteAgent(id);
          renderApp();
        }
      };
    });

    const form = document.getElementById("agent-form");
    if (form) {
      const worktypeManageBtn = document.getElementById("agent-worktype-manage-btn");
      // 관리 모달에서 추가/삭제가 일어나면 renderApp()으로 폼을 다시 그려서
      // 방금 추가한 업무 구분 체크박스가 바로 나타나게 한다. 단, 입력 중이던
      // 이름/사번 등 다른 값은 폼을 새로 그리며 날아가므로, 다시 그리기 전에
      // 지금까지 고른 업무 구분만 v.workTypes에 반영해 모달을 열기 전 상태를 최대한 살린다.
      if (worktypeManageBtn) {
        worktypeManageBtn.onclick = () => {
          openWorkTypesModal(() => renderApp());
        };
      }
      enhanceDateInput(document.getElementById("agent-input-hiredate"));
      const resignDateInput = document.getElementById("agent-input-resigndate");
      if (resignDateInput) enhanceDateInput(resignDateInput);
      // 재직 상태 라디오에 따라 퇴사일자 입력칸을 보이거나 숨긴다. "퇴사"로 바꿨는데
      // 아직 날짜가 비어있으면 오늘 날짜를 기본값으로 채워준다.
      const resignWrap = document.getElementById("agent-resigndate-wrap");
      const statusWorkingRadio = document.getElementById("agent-input-status-working");
      const statusResignedRadio = document.getElementById("agent-input-status-resigned");
      const syncResignWrapVisibility = () => {
        if (!resignWrap) return;
        const isResigned = !!(statusResignedRadio && statusResignedRadio.checked);
        resignWrap.style.display = isResigned ? "" : "none";
        if (isResigned && resignDateInput && !resignDateInput.value) {
          resignDateInput.value = agentTodayStr();
        }
      };
      if (statusWorkingRadio) statusWorkingRadio.onchange = syncResignWrapVisibility;
      if (statusResignedRadio) statusResignedRadio.onchange = syncResignWrapVisibility;

      form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("agent-input-name").value.trim();
        const ldap = document.getElementById("agent-input-ldap").value.trim();
        if (!name || !ldap) return;
        const empNo = document.getElementById("agent-input-empno").value.trim();
        const hireDate = document.getElementById("agent-input-hiredate").value.trim();
        const contact = document.getElementById("agent-input-contact").value.trim();
        const timezone = document.getElementById("agent-input-timezone").value.trim();
        const workTypes = [];
        if (document.getElementById("agent-input-voice").checked) workTypes.push("유선");
        if (document.getElementById("agent-input-chat").checked) workTypes.push("채팅");
        form.querySelectorAll(".agent-input-custom-type:checked").forEach((el) => workTypes.push(el.getAttribute("data-worktype")));
        const group = document.getElementById("agent-input-group-night").checked ? "night" : "day";
        const isAdmin = document.getElementById("agent-input-admin").checked;
        const selectedResigned = document.getElementById("agent-input-status-resigned").checked;
        let resignDate = null;
        if (selectedResigned) {
          const rawResignDate = resignDateInput ? resignDateInput.value.trim() : "";
          resignDate = rawResignDate || agentTodayStr();
        }
        // 퇴사일자가 오늘 이전(또는 오늘)이면 바로 "퇴사"로 저장하지만, 미래 날짜면
        // 그 날짜가 될 때까지 재직 상태는 "근무중"으로 남아있다가 그 날 자동으로
        // "퇴사"로 바뀐다(autoFlipResignedAgents). 월별 스케줄 자동 반영 여부는
        // 이 저장 상태(status)가 아니라 아래에서 selectedResigned로 따로 판단하므로,
        // 미래 날짜를 입력해도 스케줄에는 지금 바로 반영된다.
        const status = (selectedResigned && !(resignDate && resignDate > agentTodayStr())) ? "RESIGNED" : "WORKING";
        const values = { name, ldap, empNo, hireDate, contact, workTypes, timezone, group, isAdmin, status, resignDate };

        const prevAgent = (agentsUi.mode === "edit" && agentsUi.editingId)
          ? agentsData.find((a) => a.id === agentsUi.editingId)
          : null;
        const prevResigning = !!(prevAgent && prevAgent.resignDate);
        const prevResignDate = prevAgent ? prevAgent.resignDate : null;

        let targetId;
        if (agentsUi.mode === "edit" && agentsUi.editingId) {
          updateAgent(agentsUi.editingId, values);
          agentsUi.selectedId = agentsUi.editingId;
          targetId = agentsUi.editingId;
        } else {
          targetId = addAgent(values);
          agentsUi.selectedId = targetId;
        }

        // 재직 상태/퇴사일자가 실제로 바뀐 경우에만 월별 스케줄의 자동 "퇴사" 반영을
        // 다시 계산한다. 퇴사일자를 고쳤을 때는 예전 날짜로 채워둔 칸을 먼저 지우고
        // 새 날짜로 다시 채운다. (퇴사일자가 미래라 재직 상태 자체는 아직 "근무중"으로
        // 남아있는 경우에도, 스케줄에는 선택한 날짜를 그대로 바로 반영한다)
        if (selectedResigned && (!prevResigning || prevResignDate !== resignDate)) {
          if (prevResigning && prevResignDate && typeof clearResignedScheduleFrom === "function") {
            clearResignedScheduleFrom(targetId, prevResignDate);
          }
          if (typeof applyResignedScheduleFrom === "function") applyResignedScheduleFrom(targetId, resignDate);
        } else if (!selectedResigned && prevResigning && prevResignDate) {
          if (typeof clearResignedScheduleFrom === "function") clearResignedScheduleFrom(targetId, prevResignDate);
        }

        agentsUi.mode = "view";
        agentsUi.editingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("agent-form-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          agentsUi.mode = "view";
          agentsUi.editingId = null;
          renderApp();
        };
      }
    }

    const selectedAgentForInterview = agentsData.find((a) => a.id === agentsUi.selectedId);
    if (selectedAgentForInterview && agentsUi.mode === "view") {
      attachAgentInterviewEvents(root, selectedAgentForInterview);
    }

    attachAgentDragHandlers(root);
  }

  /* ===================== 품질 관리(QA) 모듈 ===================== */
  const QA_KEY = acctKey("personal-qa:data");

  // 05a-qa-data.js — 데이터 로드/저장, 상세 만료 처리, 월 잠금
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function loadQAData() {
    try {
      const raw = localStorage.getItem(QA_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return (parsed && typeof parsed === "object" && parsed.scores) ? parsed : { scores: {} };
    } catch (e) { return { scores: {} }; }
  }
  let qaData = loadQAData();
  // 월별 스케줄과 동일한 방식의 "월별 잠금". 잠긴 달은 점수 입력이 막힌다.
  if (!qaData.monthLocks || typeof qaData.monthLocks !== "object") qaData.monthLocks = {};
  // 엑셀 업로드로 뽑아낸 상세 QA 내역(회차별 감점/코멘트 원문 + 정리된 텍스트 캐시).
  // qaData(=계정별 클라우드 동기화 대상) 안에 같이 저장한다.
  if (!qaData.details || typeof qaData.details !== "object") qaData.details = {};

  // ----- 업로드한 엑셀 원문의 자동 만료 -----
  // 업로드일로부터 3개월이 지나면 회차별 원문(감점 항목/코멘트)을 서버(클라우드)와
  // 이 기기 양쪽 모두에서 완전히 지운다. 예전 요약본을 남겨두지 않고, 흔적 없이 삭제한다.
  const QA_DETAIL_EXPIRY_MONTHS = 3;
  function qaDetailExpiryDate(detail) {
    if (!detail || !detail.uploadedAt) return null;
    const d = new Date(detail.uploadedAt);
    if (isNaN(d.getTime())) return null;
    d.setMonth(d.getMonth() + QA_DETAIL_EXPIRY_MONTHS);
    return d;
  }
  function qaIsDetailExpired(detail) {
    const exp = qaDetailExpiryDate(detail);
    return !!exp && new Date() >= exp;
  }
  function qaPurgeExpiredDetails() {
    let changed = false;
    Object.keys(qaData.details).forEach((key) => {
      const detail = qaData.details[key];
      if (!detail || detail.purged) return;
      if (!qaIsDetailExpired(detail)) return;
      (detail.rounds || []).forEach((round) => {
        // 원문(감점/코멘트)을 흔적 없이 완전히 지운다. 별도 요약본도 남기지 않는다.
        round.items = [];
        delete round.localSummary;
      });
      detail.fileName = "";
      detail.purged = true;
      changed = true;
    });
    // saveQAData()가 localStorage에 쓰는 즉시 클라우드(Supabase)에도 같은 내용으로
    // 덮어써지므로, 지워진 원문은 이 기기뿐 아니라 서버에도 남지 않는다.
    if (changed) saveQAData();
  }
  qaPurgeExpiredDetails();

  function qaDetailKey(agentId, year, monthIndex) { return `${agentId}|${qaMonthKey(year, monthIndex)}`; }
  function getQADetail(agentId, year, monthIndex) { return qaData.details[qaDetailKey(agentId, year, monthIndex)] || null; }
  function setQADetail(agentId, year, monthIndex, detailObj) {
    qaData.details[qaDetailKey(agentId, year, monthIndex)] = detailObj;
    saveQAData();
  }
  // 상담사 1명의 등록된 엑셀(원문+정리된 텍스트 전부)을 완전히 삭제한다.
  function deleteQADetail(agentId, year, monthIndex) {
    delete qaData.details[qaDetailKey(agentId, year, monthIndex)];
    saveQAData();
  }
  // 해당 달에 등록된 모든 상담사의 엑셀(원문+정리된 텍스트 전부)을 한 번에 삭제한다.
  function deleteAllQADetails(year, monthIndex) {
    const suffix = `|${qaMonthKey(year, monthIndex)}`;
    let count = 0;
    Object.keys(qaData.details).forEach((key) => {
      if (key.endsWith(suffix)) { delete qaData.details[key]; count++; }
    });
    if (count > 0) saveQAData();
    return count;
  }

  let qaStatusTimer = null;
  function flashQAStatus(msg) {
    const el = document.getElementById("qa-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(qaStatusTimer);
    qaStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveQAData() {
    try { localStorage.setItem(QA_KEY, JSON.stringify(qaData)); flashQAStatus("저장됨"); }
    catch (e) { flashQAStatus("저장 실패"); }
  }

  const qaUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
    searchQuery: "", // 상담사 검색어. 쉼표(,)로 여러 명을 한 번에 검색할 수 있다.
  };

  // ----- 상담사 검색 -----
  // "상담사 관리"의 검색(이름/LDAP/초성)과 같은 방식을 쓰되, "주간"/"야간"/"채팅"/"유선"
  // 키워드를 입력하면 그 조건에 해당하는 인원이 모두 걸린다. 쉼표(,)로 여러 조건을 구분해서
  // 입력하면(이름+키워드를 섞어도 됨) 그 중 하나라도 일치하는 상담사를 모두 보여준다.
  function qaAgentMatchesSearch(a, query) {
    const terms = (query || "").split(",").map((t) => t.trim()).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.some((t) => agentMatchesSearch(a, t));
  }
  // 상담사 상세에서 "품질 관리로 이동"을 눌렀을 때, 이동한 화면에서 그 인원의 행을
  // 한 번 강조해서 보여주기 위한 값. 렌더링 후 바로 비워서 다음 화면 갱신부터는
  // 강조가 남지 않게 한다.
  let qaHighlightAgentId = null;

  // 05b-qa-stats.js — 월 키/점수 getter·setter, 통계, 홈 화면 트렌드 계산
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaMonthKey(year, monthIndex) { return `${year}-${pad2(monthIndex + 1)}`; }
  function qaMonthLabel() { return `${qaUi.year}년 ${qaUi.monthIndex + 1}월`; }
  function qaScoreEntryKey(agentId, year, monthIndex) { return `${agentId}|${qaMonthKey(year, monthIndex)}`; }

  // ----- 월별 "잠금" (월별 스케줄과 동일한 규칙) -----
  // monthLocks[key] === true  → 사용자가 강제로 잠가둔 상태
  // monthLocks[key] === false → 사용자가 강제로 잠금을 풀어둔 상태(지나간 달이라도 수정 가능)
  // 없으면 → 지나간 달은 기본적으로 잠기고, 이번 달·미래 달은 기본적으로 풀려 있다.
  function qaCurrentMonthKey() { return qaMonthKey(today.getFullYear(), today.getMonth()); }
  function qaIsMonthPast(year, monthIndex) { return qaMonthKey(year, monthIndex) < qaCurrentMonthKey(); }
  function qaIsMonthLocked(year, monthIndex) {
    const key = qaMonthKey(year, monthIndex);
    if (Object.prototype.hasOwnProperty.call(qaData.monthLocks, key)) return !!qaData.monthLocks[key];
    return qaIsMonthPast(year, monthIndex);
  }
  function qaToggleMonthLock(year, monthIndex) {
    const key = qaMonthKey(year, monthIndex);
    qaData.monthLocks[key] = !qaIsMonthLocked(year, monthIndex);
    saveQAData();
    renderApp();
  }

  function qaShiftMonth(delta) {
    let m = qaUi.monthIndex + delta;
    let y = qaUi.year;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    qaUi.monthIndex = m;
    qaUi.year = y;
    renderApp();
  }

  // 해당 인원·월의 점수를 반환한다. 없으면 null.
  // (예전 버전에서는 유선/채팅 점수를 따로 저장했는데, 그 형식으로 남아있는 데이터는
  //  두 값의 평균으로 자동 변환해서 보여준다.)
  function getQAScore(agentId, year, monthIndex) {
    const rec = qaData.scores[qaScoreEntryKey(agentId, year, monthIndex)];
    if (rec === undefined || rec === null) return null;
    if (typeof rec === "object") {
      const vals = [rec.voice, rec.chat].filter((v) => v !== null && v !== undefined);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }
    return rec;
  }
  // rawValue가 빈 문자열이면 그 값을 지운다.
  function setQAScore(agentId, year, monthIndex, rawValue) {
    if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 입력해주세요."); return; }
    const key = qaScoreEntryKey(agentId, year, monthIndex);
    const trimmed = String(rawValue == null ? "" : rawValue).trim();
    if (trimmed === "") { delete qaData.scores[key]; saveQAData(); return; }
    const parsed = Number(trimmed);
    if (isNaN(parsed)) return;
    qaData.scores[key] = Math.max(0, Math.min(100, parsed));
    saveQAData();
  }

  // 한 인원의 그 달 점수(입력값 그 자체).
  function qaOverallScore(agentId, year, monthIndex) {
    return getQAScore(agentId, year, monthIndex);
  }

  function qaAvg(list) {
    const vals = list.filter((v) => v !== null && v !== undefined);
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  // ----- 퇴사자의 품질 관리 목록 유지 기간 -----
  // "상담사 관리"에서 퇴사로 바뀌어도 품질관리에서 바로 사라지지 않는다. 퇴사 처리된
  // 달과 그 다음 달까지는 이름에 취소선을 그은 채로 목록에 계속 남아있다가, 그 다음
  // 달(=퇴사월+2)부터는 자연스럽게 목록에서 빠진다.
  function qaResignMonthKey(resignDate) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(resignDate || "");
    return m ? `${m[1]}-${m[2]}` : null;
  }
  function qaResignKeepUntilKey(resignDate) {
    const key = qaResignMonthKey(resignDate);
    if (!key) return null;
    const parts = key.split("-").map(Number);
    let year = parts[0], monthIndex = parts[1]; // parts[1]은 1-based 월이므로 그대로 쓰면 "다음 달"의 0-based 인덱스가 된다
    if (monthIndex > 11) { monthIndex -= 12; year += 1; }
    return qaMonthKey(year, monthIndex);
  }
  // 특정 달의 품질관리 목록에 이 상담사가 보여야 하는지 판단한다.
  // 재직중이면 항상 보이고, 퇴사자는 퇴사월과 그 다음달까지만 보인다.
  function qaAgentVisibleInMonth(a, year, monthIndex) {
    if (a.status !== "RESIGNED") return true;
    const keepUntil = qaResignKeepUntilKey(a.resignDate);
    if (!keepUntil) return true; // 퇴사일자 정보가 없으면 안전하게 계속 보여준다
    return qaMonthKey(year, monthIndex) <= keepUntil;
  }

  // QA 관리 대상 상담사 목록. 관리자는 제외하고, 재직중인 인원 + (유지 기간 안의) 퇴사자를
  // 함께 가져온다. year/monthIndex를 생략하면 현재 화면에 보이는 달(qaUi) 기준으로 계산한다.
  // "상담사 관리"의 기본 정렬을 그대로 따른다.
  function qaWorkingAgents(year, monthIndex) {
    const y = (year === undefined || year === null) ? qaUi.year : year;
    const mi = (monthIndex === undefined || monthIndex === null) ? qaUi.monthIndex : monthIndex;
    return sortAgentList(agentsData.filter((a) => !a.isAdmin && qaAgentVisibleInMonth(a, y, mi)), "shift");
  }

  // 인원마다 점수는 하나뿐이지만, "업무구분"(유선/채팅) · "조"(주간/야간) 태그를 기준으로
  // 그 점수를 여러 통계에 나눠 담는다.
  function qaComputeStats(agentsList, year, monthIndex) {
    const hasVoice = (a) => (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a) => (a.workTypes || []).indexOf("채팅") !== -1;
    const isDay = (a) => a.group !== "night";
    const isNight = (a) => a.group === "night";
    const scoreOf = (a) => qaOverallScore(a.id, year, monthIndex);

    return {
      voice: qaAvg(agentsList.filter(hasVoice).map(scoreOf)),
      chat: qaAvg(agentsList.filter(hasChat).map(scoreOf)),
      day: qaAvg(agentsList.filter(isDay).map(scoreOf)),
      night: qaAvg(agentsList.filter(isNight).map(scoreOf)),
      dayChat: qaAvg(agentsList.filter((a) => isDay(a) && hasChat(a)).map(scoreOf)),
      dayVoice: qaAvg(agentsList.filter((a) => isDay(a) && hasVoice(a)).map(scoreOf)),
      nightChat: qaAvg(agentsList.filter((a) => isNight(a) && hasChat(a)).map(scoreOf)),
      nightVoice: qaAvg(agentsList.filter((a) => isNight(a) && hasVoice(a)).map(scoreOf)),
      total: qaAvg(agentsList.map(scoreOf)),
    };
  }

  function qaPrevMonth(year, monthIndex) {
    let m = monthIndex - 1;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    return { year: y, monthIndex: m };
  }

  /* ---- 홈 화면 QA 카드: "이번 달"이 아니라 "점수가 입력된 가장 최근 달" 찾기 ----
     달이 막 바뀌면 그 달 점수는 한동안 입력이 안 되어 있는 게 정상이라, 이번 달
     기준으로만 보면 계속 "점수 없음"으로 보인다. 이번 달부터 거꾸로 훑어서 전체
     평균이 있는 첫 달을 찾아 그 달 기준으로 보여준다. */
  const QA_HOME_LATEST_LOOKBACK_MONTHS = 12;
  function qaHomeFindLatestMonthWithData(agentsList, year, monthIndex) {
    let y = year, m = monthIndex;
    for (let i = 0; i < QA_HOME_LATEST_LOOKBACK_MONTHS; i++) {
      const stats = qaComputeStats(agentsList, y, m);
      if (stats.total !== null) return { year: y, monthIndex: m, stats };
      const prev = qaPrevMonth(y, m);
      y = prev.year; m = prev.monthIndex;
    }
    return null;
  }

  /* ---- 홈 화면 QA 카드: 최근 N개월 전체 평균 추이 꺾은선 그래프 ----
     qaTrendSvgHtml(개인별)과 같은 방식이지만, 인원 개인이 아니라 매달 전체
     평균(qaComputeStats(...).total)을 점으로 찍는다. */
  const QA_HOME_TREND_MONTHS = 6;
  function qaHomeComputeTrend(agentsList, year, monthIndex, count) {
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      let m = monthIndex - i;
      let y = year;
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m, score: qaComputeStats(agentsList, y, m).total });
    }
    return months;
  }
  function qaHomeTrendSvgHtml(agentsList, year, monthIndex) {
    const months = qaHomeComputeTrend(agentsList, year, monthIndex, QA_HOME_TREND_MONTHS);
    const validScores = months.map((mo) => mo.score).filter((s) => s !== null);
    if (validScores.length === 0) return "";

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

    const segments = [];
    let cur = [];
    months.forEach((mo, i) => {
      if (mo.score === null) { if (cur.length) segments.push(cur); cur = []; }
      else cur.push({ x: xAt(i), y: yAt(mo.score) });
    });
    if (cur.length) segments.push(cur);
    const pathHtml = segments.map((seg) => {
      const d = seg.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join("");

    const dotHtml = months.map((mo, i) => {
      if (mo.score === null) return "";
      const x = xAt(i), y = yAt(mo.score);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="var(--accent)"/><text x="${x.toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle" class="qa-trend-value">${mo.score.toFixed(1)}</text>`;
    }).join("");

    const labelHtml = months.map((mo, i) => {
      const x = xAt(i);
      const isCurrent = mo.year === year && mo.monthIndex === monthIndex;
      return `<text x="${x.toFixed(1)}" y="${H - 6}" text-anchor="middle" class="qa-trend-month${isCurrent ? " current" : ""}">${mo.monthIndex + 1}월</text>`;
    }).join("");

    return `
      <div class="qa-trend-block home-qa-trend-block">
        <div class="qa-trend-title">최근 ${QA_HOME_TREND_MONTHS}개월 전체 평균 추이</div>
        <svg viewBox="0 0 ${W} ${H}" class="qa-trend-svg" preserveAspectRatio="xMidYMid meet">
          ${pathHtml}
          ${dotHtml}
          ${labelHtml}
        </svg>
      </div>
    `;
  }

  /* ===================== QA 평가 엑셀 업로드 → 점수/상세 자동 반영 ===================== */
  // 파일마다 "평균" 행, "총점" 열, "구분" 열의 실제 위치(행/열)가 달라질 수 있어서
  // 매번 셀 값을 직접 탐색해서 찾는다(고정된 셀 주소를 쓰지 않음).

  // 05c-qa-excel-import.js — 엑셀 셀/워크시트 파싱, 업로드 처리
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaColLetterToNum(letters) {
    let n = 0;
    for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n;
  }
  // 병합 셀·수식 셀 어디서든 "실제로 화면에 보이는 값"을 안전하게 꺼낸다.
  function qaCellRawValue(ws, row, col) {
    const cell = ws.getRow(row).getCell(col);
    let val = cell.value;
    if (cell.isMerged && cell.master && cell.master !== cell) val = cell.master.value;
    if (val && typeof val === "object") {
      if (val instanceof Date) return val;
      if (Object.prototype.hasOwnProperty.call(val, "result")) val = val.result;
      else if (Array.isArray(val.richText)) val = val.richText.map((t) => t.text).join("");
      else if (Object.prototype.hasOwnProperty.call(val, "text")) val = val.text;
      else if (Object.prototype.hasOwnProperty.call(val, "error")) val = null;
    }
    return val;
  }
  function qaCellText(ws, row, col) {
    const v = qaCellRawValue(ws, row, col);
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return "";
    return String(v).trim();
  }
  // 시트 전체(또는 위쪽 몇 줄)에서 특정 텍스트와 정확히 일치하는 칸을 찾는다.
  function qaFindCell(ws, targetText, opts) {
    opts = opts || {};
    const maxRow = opts.maxRow || ws.rowCount;
    const maxCol = opts.maxCol || ws.columnCount;
    for (let r = 1; r <= maxRow; r++) {
      for (let c = 1; c <= maxCol; c++) {
        if (qaCellText(ws, r, c) === targetText) return { row: r, col: c };
      }
    }
    return null;
  }
  // 위와 같지만 "포함" 여부로 찾는다(칸 이름이 "상담ID", "상담 ID" 등으로 조금씩 달라도 잡히게).
  function qaFindCellContains(ws, targetText, opts) {
    opts = opts || {};
    const maxRow = opts.maxRow || ws.rowCount;
    const maxCol = opts.maxCol || ws.columnCount;
    for (let r = 1; r <= maxRow; r++) {
      for (let c = 1; c <= maxCol; c++) {
        const t = qaCellText(ws, r, c).replace(/\s+/g, "");
        if (t && t.indexOf(targetText) !== -1) return { row: r, col: c };
      }
    }
    return null;
  }

  // 시트 하나를 분석해서 { totalScore, rounds } 형태로 돌려준다.
  // rounds: 구분 열의 "1차/2차/…" 라벨이 여러 행에 걸쳐 병합된 블록마다,
  // 그 블록 안에서 2칸 이상 가로로 병합된(=서술형 코멘트) 칸의 내용을 모은 것.
  function qaParseWorksheet(ws) {
    const avgCell = qaFindCell(ws, "평균");
    const totalCell = qaFindCell(ws, "총점", { maxRow: 12 });
    if (!avgCell || !totalCell) throw new Error("'평균' 행 또는 '총점' 열을 찾지 못했어요.");
    const rawScore = qaCellRawValue(ws, avgCell.row, totalCell.col);
    const scoreNum = Number(rawScore);
    if (rawScore === null || rawScore === undefined || isNaN(scoreNum)) throw new Error("평균×총점 칸의 값이 숫자가 아니에요.");
    // 엑셀 수식이 내부적으로 81.166666...처럼 소수점 아래 여러 자리를 들고 있어도,
    // 엑셀 화면(및 우리 목록)에는 소수점 첫째 자리까지만 보이므로 그 표시값과
    // 저장되는 값이 어긋나지 않도록 여기서 미리 소수 첫째 자리로 반올림해서 저장한다.
    const score = Math.round(scoreNum * 10) / 10;

    const merges = (ws.model && ws.model.merges ? ws.model.merges : [])
      .map((rangeStr) => {
        const m = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(rangeStr);
        if (!m) return null;
        return { c1: qaColLetterToNum(m[1]), r1: parseInt(m[2], 10), c2: qaColLetterToNum(m[3]), r2: parseInt(m[4], 10) };
      })
      .filter(Boolean);

    const gubunCell = qaFindCell(ws, "구분");
    const gubunCol = gubunCell ? gubunCell.col : 2;

    const roundBlocks = merges
      .filter((mg) => mg.c1 === gubunCol && mg.c2 === gubunCol && mg.r2 > mg.r1)
      .map((mg) => ({ label: qaCellText(ws, mg.r1, mg.c1).replace(/\s+/g, ""), startRow: mg.r1, endRow: mg.r2 }))
      .filter((b) => /^\d+차$/.test(b.label))
      .sort((a, b) => a.startRow - b.startRow);

    const roundSummaryRows = [];
    for (let r = 1; r <= ws.rowCount; r++) {
      const label = qaCellText(ws, r, gubunCol).replace(/\s+/g, "");
      if (!/^\d+차$/.test(label)) continue;
      if (roundBlocks.some((b) => r >= b.startRow && r <= b.endRow)) continue;
      roundSummaryRows.push({ label, row: r });
    }
    const dateCell = qaFindCell(ws, "상담일", { maxRow: 12 });
    // "상담ID"의 실제 헤더가 "상담 ID"처럼 띄어쓰기가 다르거나, 맨 위 12행이 아니라
    // 각 차수 표 근처(더 아래쪽)에 있을 수도 있어서 시트 전체를 대상으로 찾는다.
    const idCell = qaFindCell(ws, "상담ID") || qaFindCellContains(ws, "상담ID") || qaFindCellContains(ws, "상담아이디");
    // 서술형 피드백 칸은 항상 "총점" 열에서 끝나는 가로 병합(예: S19:X19)으로 되어 있다.
    // (카테고리 라벨처럼 폭이 좁은 다른 가로 병합과 구분하기 위한 기준)
    const feedbackMerges = merges.filter((mg) => mg.c2 > mg.c1 && mg.r1 === mg.r2 && mg.c2 === totalCell.col);
    const guidelineRe = /^\[-?\d+\]\s*/;

    const rounds = roundBlocks.map((block) => {
      const summary = roundSummaryRows.find((s) => s.label === block.label);
      let dateVal = summary && dateCell ? qaCellRawValue(ws, summary.row, dateCell.col) : null;
      if (dateVal instanceof Date) dateVal = `${dateVal.getFullYear()}-${pad2(dateVal.getMonth() + 1)}-${pad2(dateVal.getDate())}`;
      else dateVal = dateVal ? String(dateVal).trim() : "";
      // "상담ID"는 요약표(구분/상담사/상담일)가 아니라, 각 회차 상세표의 시작 행에만
      // 한 번 들어있다(예: "1차" 블록의 첫 행). summary.row(요약표) 기준으로 읽으면
      // 그 자리엔 상담사 이름이 있어서 엉뚱한 값이 나온다.
      let idVal = idCell ? qaCellRawValue(ws, block.startRow, idCell.col) : null;
      idVal = (idVal === null || idVal === undefined) ? "" : String(idVal).trim();
      const roundScoreRaw = summary ? qaCellRawValue(ws, summary.row, totalCell.col) : null;
      const roundScoreNum = Number(roundScoreRaw);
      const roundScore = (roundScoreRaw === null || roundScoreRaw === undefined || isNaN(roundScoreNum)) ? null : Math.round(roundScoreNum * 10) / 10;

      const items = [];
      for (let r = block.startRow; r <= block.endRow; r++) {
        const fbMerge = feedbackMerges.find((mg) => mg.r1 === r);
        const feedbackText = fbMerge ? qaCellText(ws, fbMerge.r1, fbMerge.c1) : "";
        if (!feedbackText) continue; // 코멘트가 없는(만점) 항목은 요약 대상에서 제외
        let guideline = "";
        const rowWidth = Math.min(ws.columnCount, 40);
        for (let c = 1; c <= rowWidth; c++) {
          const t = qaCellText(ws, r, c);
          if (t && guidelineRe.test(t)) { guideline = t.replace(guidelineRe, "").trim(); break; }
        }
        items.push({ guideline, feedback: feedbackText });
      }
      // itemCount는 원문이 나중에 만료되어 items가 비워져도 "원래 감점 항목이 있었는지"를
      // 계속 구분할 수 있도록 별도로 남겨둔다.
      return { label: block.label, date: dateVal, consultId: idVal, score: roundScore, items, itemCount: items.length };
    });

    return { totalScore: score, rounds };
  }

  // 여러 개의 xlsx 파일(상담사 1명당 1개, 또는 여러 상담사가 시트로 나뉜 파일 모두 지원)을
  // 한 번에 받아서, 시트 이름(없으면 파일명)을 상담사 이름과 맞춰 자동으로 반영한다.
  async function qaHandleExcelFiles(fileList) {
    console.log("[QA 업로드] onchange 발생, 선택된 파일 수:", fileList ? fileList.length : 0);
    const files = Array.from(fileList || []);
    if (!files.length) {
      console.warn("[QA 업로드] 선택된 파일이 없어요 (파일 선택 대화상자에서 취소했거나, 브라우저가 파일을 전달하지 못했어요).");
      return;
    }
    console.log("[QA 업로드] 파일 목록:", files.map((f) => f.name));
    const { year, monthIndex } = qaUi;
    if (qaIsMonthLocked(year, monthIndex)) {
      console.warn("[QA 업로드] 이 달은 잠겨 있어서 업로드를 막았어요:", qaMonthLabel());
      flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 업로드해주세요.");
      alert(`${qaMonthLabel()}은(는) 잠겨 있어서 업로드할 수 없어요.\n상단의 "잠금 해제" 버튼을 먼저 눌러주세요.`);
      return;
    }
    if (typeof ExcelJS === "undefined") {
      console.error("[QA 업로드] ExcelJS 라이브러리가 로드되지 않았어요. CDN(cdn.jsdelivr.net)이 차단됐거나 인터넷 연결이 끊겼을 수 있어요. 개발자도구 Network 탭에서 exceljs.min.js 요청이 실패했는지 확인해주세요.");
      flashQAStatus("엑셀 처리 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      alert("엑셀 처리 기능을 불러오지 못했어요.\n\n인터넷 연결을 확인하거나, 방화벽/보안 프로그램이 cdn.jsdelivr.net 접속을 막고 있지 않은지 확인해주세요.\n(F12 개발자도구 → Network 탭에서 exceljs.min.js 요청이 실패(빨간색)로 뜨는지 확인하시면 정확한 원인을 알 수 있어요.)");
      return;
    }

    let allAgents, normName, matchAgentByName, okCount, failList;
    try {
      allAgents = agentsData.filter((a) => !a.isAdmin);
      normName = (s) => String(s || "").trim().replace(/\s+/g, "");
      matchAgentByName = (name) => {
        const target = normName(name);
        if (!target) return null;
        return allAgents.find((a) => normName(a.name) === target) || null;
      };
      okCount = 0;
      failList = [];
    } catch (setupErr) {
      console.error("[QA 업로드] 초기화 단계에서 오류가 발생했어요:", setupErr);
      alert(`엑셀 업로드 준비 중 오류가 발생했어요.\n\n${setupErr.message}\n\n(F12 콘솔에 자세한 내용이 남았어요. 개발자에게 이 메시지를 전달해주세요.)`);
      return;
    }
    flashQAStatus("엑셀을 분석하고 있어요...");

    for (const file of files) {
      let wb;
      try {
        const buf = await file.arrayBuffer();
        wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buf);
      } catch (readErr) {
        console.error(readErr);
        failList.push(`${file.name}: 파일을 읽지 못했어요 (.xlsx 파일이 맞는지 확인해주세요)`);
        continue;
      }
      const sheets = wb.worksheets || [];
      if (!sheets.length) { failList.push(`${file.name}: 시트를 찾지 못했어요.`); continue; }
      let matchedAny = false;
      for (const ws of sheets) {
        let agent = matchAgentByName(ws.name);
        if (!agent && sheets.length === 1) agent = matchAgentByName(file.name.replace(/\.xlsx$/i, ""));
        if (!agent) {
          console.warn(`[QA 업로드] 이름이 일치하는 상담사를 못 찾았어요. 시트명="${ws.name}", 파일명="${file.name}". 등록된 상담사 이름 목록:`, allAgents.map((a) => a.name));
          continue;
        }
        matchedAny = true;
        try {
          const parsed = qaParseWorksheet(ws);
          setQAScore(agent.id, year, monthIndex, String(parsed.totalScore));
          // 퇴사한 상담사는 점수만 반영하고, 차수별 원문(감점/코멘트)은 어차피
          // 볼 일이 없으므로 가져오지 않는다. 상세 카드에는 "퇴사 인원"이라고만 표시된다.
          if (agent.status === "RESIGNED") {
            setQADetail(agent.id, year, monthIndex, {
              fileName: file.name,
              sheetName: ws.name,
              uploadedAt: new Date().toISOString(),
              rounds: [],
              resignedNote: true,
            });
          } else {
            setQADetail(agent.id, year, monthIndex, {
              fileName: file.name,
              sheetName: ws.name,
              uploadedAt: new Date().toISOString(),
              rounds: parsed.rounds,
            });
          }
          okCount++;
        } catch (parseErr) {
          failList.push(`${ws.name || file.name}: ${parseErr.message}`);
        }
      }
      if (!matchedAny) failList.push(`${file.name}: 이름이 일치하는 상담사를 찾지 못했어요 (시트명 또는 파일명을 상담사 이름과 맞춰주세요)`);
    }

    renderApp();
    if (failList.length) {
      flashQAStatus(`${okCount}명 반영됨 · ${failList.length}건 실패`);
      alert(`엑셀 업로드 결과\n\n반영됨: ${okCount}건\n실패: ${failList.length}건\n\n${failList.join("\n")}`);
    } else {
      flashQAStatus(`${okCount}명 반영됨`);
    }
  }

  /* ===================== 상담사 이름 클릭 → QA 상세 카드 팝업 (엑셀 원문 정리) ===================== */

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
      return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
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

  // 05e-qa-modals.js — 업로드/상세 모달, 점수 셀·차이 HTML, 상담사 QA 미리보기
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function closeQAUploadModal() {
    const existing = document.getElementById("qa-upload-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaUploadEscHandler, true);
  }
  function qaUploadEscHandler(e) { if (e.key === "Escape") closeQAUploadModal(); }

  function openQAUploadModal() {
    closeQAUploadModal();
    const { year, monthIndex } = qaUi;
    if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 업로드해주세요."); return; }

    const overlay = document.createElement("div");
    overlay.id = "qa-upload-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box qa-upload-box">
        <div class="sch-preview-head">
          <span>QA 평가 엑셀 업로드 · ${esc(qaMonthLabel())}</span>
          <button type="button" class="sch-preview-close" id="qa-upload-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body qa-upload-body">
          <div class="qa-upload-dropzone" id="qa-upload-dropzone">
            <div class="qa-upload-dropzone-icon">${ICON_UPLOAD}</div>
            <div class="qa-upload-dropzone-text">여기로 엑셀 파일을 끌어다 놓아주세요</div>
            <div class="qa-upload-dropzone-sub">여러 상담사 파일을 한꺼번에 놓아도 돼요</div>
            <button type="button" class="ghost-btn" id="qa-upload-pick-btn">파일 선택</button>
            <input type="file" id="qa-upload-input" accept=".xlsx" multiple style="display:none;">
          </div>
          <div class="qa-help-text" style="margin:12px 0 0;">상담사 1명당 파일 1개(시트명 또는 파일명 = 상담사 이름)도, 여러 상담사가 시트로 나뉜 파일 하나도 모두 지원돼요.</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQAUploadModal(); };
    document.getElementById("qa-upload-close-x").onclick = () => closeQAUploadModal();
    document.addEventListener("keydown", qaUploadEscHandler, true);

    const dropzone = document.getElementById("qa-upload-dropzone");
    const fileInput = document.getElementById("qa-upload-input");

    const runUpload = (fileList, source) => {
      console.log(`[QA 업로드] ${source}로 전달된 파일 수:`, fileList ? fileList.length : 0);
      if (!fileList || !fileList.length) {
        flashQAStatus("파일을 인식하지 못했어요.");
        return;
      }
      closeQAUploadModal();
      qaHandleExcelFiles(fileList).catch((err) => {
        console.error(`[QA 업로드] ${source} 처리 중 예상치 못한 오류:`, err);
        alert(`엑셀 업로드 중 예상치 못한 오류가 발생했어요.\n\n${err && err.message ? err.message : err}\n\nF12 콘솔에 자세한 내용이 남았어요.`);
      });
    };

    document.getElementById("qa-upload-pick-btn").onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const files = e.target.files;
      e.target.value = "";
      runUpload(files, "파일 선택");
    };

    ["dragenter", "dragover"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("qa-upload-dropzone-active");
      });
    });
    ["dragleave", "dragend"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("qa-upload-dropzone-active");
      });
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("qa-upload-dropzone-active");
      runUpload(e.dataTransfer && e.dataTransfer.files, "드래그앤드롭");
    });
    // 모달 밖(브라우저 창 전체)에 실수로 파일을 떨어뜨려서 브라우저가 그 파일을
    // 통째로 열어버리는 사고 방지.
    ["dragover", "drop"].forEach((evt) => {
      overlay.addEventListener(evt, (e) => { if (e.target === overlay) e.preventDefault(); });
    });
  }

  function closeQADetailModal() {
    const existing = document.getElementById("qa-detail-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaDetailEscHandler, true);
  }
  function qaDetailEscHandler(e) { if (e.key === "Escape") closeQADetailModal(); }

  function openQADetailModal(agentId) {
    closeQADetailModal();
    qaPurgeExpiredDetails();
    const agent = agentsData.find((a) => a.id === agentId);
    if (!agent) return;
    const { year, monthIndex } = qaUi;
    const detail = getQADetail(agentId, year, monthIndex);

    const metaText = detail && detail.purged
      ? `원본 엑셀은 업로드 후 ${QA_DETAIL_EXPIRY_MONTHS}개월이 지나 자동 삭제됐어요 · 차수 ${detail.rounds.length}개`
      : detail
        ? `${esc(detail.fileName || "")} 업로드됨 · 차수 ${detail.rounds.length}개 (원문은 업로드 후 ${QA_DETAIL_EXPIRY_MONTHS}개월 뒤 자동 삭제돼요)`
        : "";

    const trendHtml = qaTrendSvgHtml(agentId, year, monthIndex);

    const bodyHtml = (detail && detail.resignedNote)
      ? `<div class="qa-detail-empty">퇴사 인원이에요.<br>점수만 반영되고, 차수별 감점/코멘트 원문은 가져오지 않아요.</div>`
      : (!detail || !detail.rounds || !detail.rounds.length)
      ? `<div class="qa-detail-empty">이번 달(${esc(qaMonthLabel())})에 업로드된 QA 평가 엑셀이 없어요.<br>상단 "${esc("엑셀 업로드")}" 버튼으로 이 상담사의 평가표를 올려주세요.</div>`
      : `
        <div class="qa-detail-meta">${metaText}</div>
        <div class="qa-detail-rounds">
          ${detail.rounds.map((round, idx) => {
            // itemCount가 없는 예전 데이터(이 필드가 생기기 전에 저장된 회차)는
            // items 개수로 대신 판단한다. items도 없다면(정말 원문이 없는 경우) 0으로 취급.
            const effectiveItemCount = (round.itemCount !== undefined && round.itemCount !== null)
              ? round.itemCount
              : (round.items ? round.items.length : 0);
            const isPerfect = effectiveItemCount === 0;
            const rawGone = !isPerfect && round.items.length === 0; // 원문 만료로 사라진 경우
            let bodyBlock;
            if (isPerfect) {
              bodyBlock = `<div class="qa-round-empty">감점/코멘트 항목이 없어요 (만점 처리된 차수예요).</div>`;
            } else if (rawGone) {
              bodyBlock = `<div class="qa-round-summary-box" id="qa-round-summary-${idx}"><span class="qa-round-hint" style="color:var(--red);">원문이 ${QA_DETAIL_EXPIRY_MONTHS}개월 만료되어 삭제됐어요.</span></div>`;
            } else {
              bodyBlock = `
              <div class="qa-round-raw">
                <button type="button" class="qa-round-raw-toggle" data-qa-raw-toggle="${idx}">원문 보기</button>
                <div class="qa-round-raw-box" id="qa-round-raw-${idx}" style="display:none;"></div>
              </div>`;
            }
            return `
            <div class="qa-round-card">
              <div class="qa-round-head" data-qa-round-toggle="${idx}">
                <div class="qa-round-title"><span class="qa-round-chevron" id="qa-round-chevron-${idx}">▶</span>${qaRoundSummaryLine(round)}</div>
              </div>
              <div class="qa-round-body" id="qa-round-body-${idx}" style="display:none;">
                ${bodyBlock}
              </div>
            </div>
          `;
          }).join("")}
        </div>
      `;

    const overlay = document.createElement("div");
    overlay.id = "qa-detail-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box qa-detail-box">
        <div class="sch-preview-head">
          <span>${esc(agent.name)} · ${esc(qaMonthLabel())} QA 상세</span>
          <div class="qa-detail-head-actions">
            ${detail ? `<button type="button" class="ghost-btn qa-detail-delete-btn" id="qa-detail-delete-btn">${ICON_TRASH} 엑셀 삭제</button>` : ""}
            <button type="button" class="sch-preview-close" id="qa-detail-close-x" aria-label="닫기">✕</button>
          </div>
        </div>
        <div class="sch-preview-body qa-detail-body">
          ${trendHtml}
          ${bodyHtml}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQADetailModal(); };
    document.getElementById("qa-detail-close-x").onclick = () => closeQADetailModal();
    const deleteBtn = document.getElementById("qa-detail-delete-btn");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        if (!confirm(`${agent.name}님의 ${qaMonthLabel()} QA 엑셀 데이터를 삭제할까요?\n원문과 정리된 내용이 모두 함께 삭제되며, 되돌릴 수 없어요.`)) return;
        deleteQADetail(agentId, year, monthIndex);
        flashQAStatus("삭제됐어요.");
        openQADetailModal(agentId); // 모달을 "업로드된 엑셀 없음" 상태로 다시 그림
      };
    }

    // "원문 보기" 토글: 개별 버튼이 아니라 오버레이 전체에 위임해서 클릭을 잡는다.
    // 기본은 접힌 상태(style="display:none")이고, 누를 때마다 펼치고/접는다.
    overlay.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest && e.target.closest("[data-qa-raw-toggle]");
      if (!toggleBtn) return;
      e.stopPropagation();
      const idx = Number(toggleBtn.getAttribute("data-qa-raw-toggle"));
      const round = detail.rounds[idx];
      const rawBox = document.getElementById(`qa-round-raw-${idx}`);
      if (!round || !rawBox) return;
      const opening = rawBox.style.display === "none";
      if (opening && !rawBox.dataset.filled) {
        rawBox.innerHTML = qaFormatSummaryHtml(qaOrganizeItemsText(round.items));
        rawBox.dataset.filled = "1";
      }
      rawBox.style.display = opening ? "" : "none";
      toggleBtn.textContent = opening ? "원문 접기" : "원문 보기";
    });

    // 회차 카드 헤드를 누르면 펼치기/접기 (버튼 클릭은 위에서 stopPropagation으로 분리됨)
    overlay.querySelectorAll("[data-qa-round-toggle]").forEach((head) => {
      head.onclick = () => {
        const idx = head.getAttribute("data-qa-round-toggle");
        const body = document.getElementById(`qa-round-body-${idx}`);
        const chevron = document.getElementById(`qa-round-chevron-${idx}`);
        if (!body) return;
        const opening = body.style.display === "none";
        body.style.display = opening ? "" : "none";
        if (chevron) chevron.textContent = opening ? "▼" : "▶";
      };
    });

    setTimeout(() => document.addEventListener("keydown", qaDetailEscHandler, true), 0);
  }

  function qaScoreCellHtml(agent, year, monthIndex) {
    const val = getQAScore(agent.id, year, monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);
    return `<td><input type="number" class="qa-score-input" min="0" max="100" step="0.1" inputmode="decimal"
      data-qa-agent="${agent.id}" value="${val === null ? "" : val.toFixed(1)}" placeholder="-" title="점수"${locked ? " disabled" : ""}></td>`;
  }

  function qaDiffHtml(agent, year, monthIndex) {
    const cur = qaOverallScore(agent.id, year, monthIndex);
    if (cur === null) return `<span class="qa-diff flat">-</span>`;
    const prev = qaPrevMonth(year, monthIndex);
    const prevScore = qaOverallScore(agent.id, prev.year, prev.monthIndex);
    if (prevScore === null) return `<span class="qa-diff flat">신규</span>`;
    const diff = cur - prevScore;
    if (Math.abs(diff) < 0.05) return `<span class="qa-diff flat">±0.0</span>`;
    const cls = diff > 0 ? "up" : "down";
    const sign = diff > 0 ? "▲" : "▼";
    return `<span class="qa-diff ${cls}">${sign} ${Math.abs(diff).toFixed(1)}</span>`;
  }

  // ----- 상담사 상세 카드용 "최근 QA 점수" 미리보기 -----
  // 이번 달 포함 최근 3개월 점수를 관리자→월별 스케줄 이동 없이 바로 보여준다.
  // QA 관리 대상이 아닌 관리자 계정은 표시하지 않는다.
  function renderAgentQAPreview(agent) {
    if (agent.isAdmin) return "";
    const months = [];
    for (let i = 0; i < 3; i++) {
      let m = today.getMonth() - i;
      let y = today.getFullYear();
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m });
    }
    const cellsHtml = months.map(({ year, monthIndex }, idx) => {
      const val = getQAScore(agent.id, year, monthIndex);
      const label = idx === 0 ? "이번 달" : `${monthIndex + 1}월`;
      return `
        <div class="agent-qa-cell">
          <div class="agent-qa-cell-label">${esc(label)}</div>
          <div class="agent-qa-cell-value${val === null ? " empty" : ""}">${val === null ? "데이터 없음" : val.toFixed(1)}</div>
          <div class="agent-qa-cell-diff">${qaDiffHtml(agent, year, monthIndex)}</div>
        </div>
      `;
    }).join("");
    return `
      <div class="agent-interview-section agent-qa-preview">
        <div class="agent-interview-header">
          <div class="agent-interview-title">${ICON_QA} 최근 QA 점수</div>
          <button class="ghost-btn" data-action="agent-goto-qa" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 품질 관리로 이동</button>
        </div>
        <div class="agent-qa-preview-grid">${cellsHtml}</div>
      </div>
    `;
  }

  function qaStatDiff(cur, prev) {
    if (cur === null || prev === null || prev === undefined) return null;
    const diff = cur - prev;
    if (Math.abs(diff) < 0.05) return { cls: "flat", sign: "±", abs: 0 };
    return { cls: diff > 0 ? "up" : "down", sign: diff > 0 ? "▲" : "▼", abs: Math.abs(diff) };
  }

  function qaStatItemHtml(label, value, prevValue, accent) {
    const isEmpty = value === null;
    const d = qaStatDiff(value, prevValue);
    const diffHtml = d ? ` <span class="qa-stat-diff ${d.cls}">${d.sign} ${d.abs.toFixed(1)}</span>` : "";
    return `<div class="qa-stat-item${accent ? " accent" : ""}">
      <div class="qa-stat-num${isEmpty ? " empty" : ""}">${isEmpty ? "데이터 없음" : value.toFixed(1)}</div>
      <div class="qa-stat-label">${esc(label)}${diffHtml}</div>
    </div>`;
  }

  // 이미지 저장 시 유형별로 인원을 걸러낼 때 쓴다. (월별 스케줄과 동일한 구분 기준)

  // 05f-qa-render.js — 표 빌드, 영역 핸들러, renderQAPage 진입점
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaFilterAgentsByMode(agentsList, mode) {
    if (!mode || mode === "ALL") return agentsList;
    const hasVoice = (a) => (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a) => (a.workTypes || []).indexOf("채팅") !== -1;
    if (mode === "DAY") return agentsList.filter((a) => a.group !== "night");
    if (mode === "NIGHT") return agentsList.filter((a) => a.group === "night");
    if (mode === "VOICE") return agentsList.filter(hasVoice);
    if (mode === "CHAT") return agentsList.filter(hasChat);
    return agentsList;
  }

  // 화면에 보이는 표와 이미지 캡처용 표가 같은 마크업을 쓰도록 분리해뒀다.
  // forCapture가 true면 점수 입력칸 대신 텍스트로 값을 보여준다(캡처 이미지에 <input>이 그대로 찍히지 않도록).
  function buildQATableHtml(agentsList, year, monthIndex, forCapture) {
    return `
      <div class="qa-table-wrap">
        <table class="qa-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>LDAP</th>
              <th>시간대</th>
              <th>업무구분</th>
              <th>조</th>
              <th>점수</th>
              <th>전월 대비</th>
            </tr>
          </thead>
          <tbody>
            ${agentsList.length === 0 ? `
              <tr><td class="qa-empty" colspan="7">${forCapture ? "해당하는 상담사가 없어요." : `근무중인 상담사가 없어요. "상담사 관리"에서 인원을 등록해주세요.`}</td></tr>
            ` : agentsList.map((a) => {
              const typeBadges = renderWorkTypeBadges(a.workTypes, "sm");
              const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
              const val = getQAScore(a.id, year, monthIndex);
              const scoreCell = forCapture
                ? `<td>${val === null ? "-" : val.toFixed(1)}</td>`
                : qaScoreCellHtml(a, year, monthIndex);
              const highlight = !forCapture && qaHighlightAgentId === a.id;
              const isResigned = a.status === "RESIGNED";
              const rowClass = `${highlight ? "qa-row-highlight " : ""}${isResigned ? "qa-row-resigned" : ""}`.trim();
              const resignedBadge = isResigned ? ` <span class="badge sm resigned">퇴사</span>` : "";
              return `
                <tr data-qa-row-agent="${a.id}" class="${rowClass}">
                  <td class="qa-col-name"${forCapture ? "" : ` data-qa-name-click="${a.id}"`}>${esc(a.name)}${resignedBadge}${forCapture ? "" : `<span class="qa-name-search-icon">${ICON_SEARCH_MINI}</span>`}</td>
                  <td class="qa-col-ldap">${esc(a.ldap || "-")}</td>
                  <td>${esc(a.timezone || "-")}</td>
                  <td class="qa-col-badges">${typeBadges || "-"}</td>
                  <td>${groupBadge}</td>
                  ${scoreCell}
                  <td>${qaDiffHtml(a, year, monthIndex)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // 검색창 자체는 다시 그리지 않고 표 영역만 갱신한다(agents/interviews 화면과 같은 방식).
  // IME(한글) 조합 중에도 입력이 끊기지 않고, 타이핑 즉시 결과가 반영된다.
  function updateQATableArea() {
    const tableArea = document.getElementById("qa-table-area");
    if (!tableArea) return;
    const { year, monthIndex } = qaUi;
    const filteredList = qaWorkingAgents().filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
    tableArea.innerHTML = buildQATableHtml(filteredList, year, monthIndex, false);
    attachQATableAreaHandlers(tableArea, filteredList, year, monthIndex);
  }

  function attachQATableAreaHandlers(root, agentsList, year, monthIndex) {
    root.querySelectorAll("[data-qa-name-click]").forEach((el) => {
      el.onclick = () => openQADetailModal(el.getAttribute("data-qa-name-click"));
    });

    root.querySelectorAll(".qa-score-input").forEach((input) => {
      // 필요인력 입력칸과 같은 방식: blur(포커스 아웃) 또는 Enter일 때만 저장해서
      // 타이핑 중에 표 전체가 다시 그려지며 깜빡이거나 포커스가 빠지지 않게 한다.
      input.onchange = () => {
        setQAScore(
          input.getAttribute("data-qa-agent"),
          year, monthIndex,
          input.value
        );
        renderApp();
      };
      // 엑셀처럼 Enter/Tab으로 다음(아래) 칸, Shift+Enter/Shift+Tab으로 이전(위) 칸으로
      // 바로 이동한다. blur()를 호출하면 값이 바뀐 경우 change 이벤트가 이 안에서
      // 그대로(동기적으로) 발생해서 저장 + 표 다시 그리기까지 끝나므로, blur() 호출이
      // 끝난 뒤에 다음 칸을 찾아 포커스를 옮기면 된다(다시 그려졌든 안 그려졌든 그
      // 시점엔 이미 최종 DOM이 갖춰져 있다).
      input.onkeydown = (e) => {
        if (e.key !== "Enter" && e.key !== "Tab") return;
        e.preventDefault();
        const idx = agentsList.findIndex((a) => a.id === input.getAttribute("data-qa-agent"));
        const delta = e.shiftKey ? -1 : 1;
        const nextAgent = idx !== -1 ? agentsList[idx + delta] : null;
        input.blur();
        if (nextAgent) qaFocusScoreInput(nextAgent.id);
      };
    });
  }

  function renderQAPage(root) {
    const agentsList = qaWorkingAgents();
    const filteredList = agentsList.filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
    const { year, monthIndex } = qaUi;
    // 통계(평균)는 검색어와 무관하게 항상 재직중인 전체 인원 기준으로 보여준다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const prevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, prevYm.year, prevYm.monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);

    root.innerHTML = `
      <div class="qa-top">
        <div class="qa-title">품질 관리</div>
        <div class="schedule-month-nav">
          <button class="schedule-month-btn" id="qa-prev-month">‹</button>
          <div class="schedule-month-label">${qaMonthLabel()}${locked ? ` <span class="sch-locked-badge">${ICON_LOCK} 확정됨</span>` : ""}</div>
          <button class="schedule-month-btn" id="qa-next-month">›</button>
          <button class="ghost-btn sch-lock-toggle-btn ${locked ? "locked" : ""}" id="qa-lock-btn" style="margin-left:8px;">${locked ? `${ICON_UNLOCK} 잠금 해제` : `${ICON_LOCK} 이 달 잠그기`}</button>
          <button class="ghost-btn" id="qa-excel-upload-btn">${ICON_UPLOAD} 엑셀 업로드</button>
          <button class="ghost-btn qa-bulk-delete-btn" id="qa-bulk-delete-btn">${ICON_TRASH} 엑셀 일괄삭제</button>
          <button class="ghost-btn" id="qa-capture-btn">${ICON_CAMERA} 이미지로 저장 ▾</button>
        </div>
      </div>
      <div class="status" id="qa-status"></div>
      <div class="qa-stat-row">
        <div class="agent-search-input">
          <input type="text" class="agent-search-input-field" id="qa-search-input" placeholder="이름 검색" title="상담사 검색 (이름/주간/야간/채팅/유선, 쉼표로 여러 개)" value="${esc(qaUi.searchQuery)}" autocomplete="off">
          ${ICON_SEARCH_MINI}
        </div>
        <div class="qa-stat-grid">
          ${qaStatItemHtml("전체 평균", stats.total, prevStats.total, true)}
          ${qaStatItemHtml("유선 점수 평균", stats.voice, prevStats.voice)}
          ${qaStatItemHtml("채팅 점수 평균", stats.chat, prevStats.chat)}
          ${qaStatItemHtml("주간 점수 평균", stats.day, prevStats.day)}
          ${qaStatItemHtml("야간 점수 평균", stats.night, prevStats.night)}
          ${qaStatItemHtml("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
          ${qaStatItemHtml("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
          ${qaStatItemHtml("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
          ${qaStatItemHtml("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
        </div>
      </div>
      <div id="qa-table-area">${buildQATableHtml(filteredList, year, monthIndex, false)}</div>
    `;

    // 상담사 상세에서 "품질 관리로 이동"으로 넘어온 경우, 그 인원의 행으로
    // 스크롤하고 한 번만 강조 표시한다.
    if (qaHighlightAgentId) {
      const targetId = qaHighlightAgentId;
      qaHighlightAgentId = null;
      const row = root.querySelector(`[data-qa-row-agent="${CSS.escape(targetId)}"]`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => row.classList.remove("qa-row-highlight"), 2200);
      }
    }

    document.getElementById("qa-prev-month").onclick = () => qaShiftMonth(-1);
    document.getElementById("qa-next-month").onclick = () => qaShiftMonth(1);
    document.getElementById("qa-lock-btn").onclick = () => qaToggleMonthLock(year, monthIndex);
    document.getElementById("qa-capture-btn").onclick = (e) => openQACaptureMenu(e.currentTarget);
    document.getElementById("qa-bulk-delete-btn").onclick = () => {
      if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 삭제해주세요."); return; }
      if (!confirm(`${qaMonthLabel()}에 등록된 모든 상담사의 QA 엑셀 데이터를 일괄삭제할까요?\n원문과 정리된 내용이 모두 함께 삭제되며, 되돌릴 수 없어요.`)) return;
      const count = deleteAllQADetails(year, monthIndex);
      flashQAStatus(count > 0 ? `${count}건 삭제됐어요.` : "삭제할 데이터가 없어요.");
      renderApp();
    };
    document.getElementById("qa-excel-upload-btn").onclick = () => openQAUploadModal();

    const qaSearchInput = document.getElementById("qa-search-input");
    if (qaSearchInput) {
      qaSearchInput.oninput = (e) => {
        qaUi.searchQuery = e.target.value;
        updateQATableArea();
      };
    }

    attachQATableAreaHandlers(root.querySelector("#qa-table-area"), filteredList, year, monthIndex);
  }
  // 특정 상담사의 점수 입력칸에 포커스를 주고 기존 값을 선택 상태로 만든다
  // (Enter/Tab으로 다음 칸으로 넘어갈 때, 바로 덮어쓸 수 있게).

  // 05g-qa-capture-menu.js — 포커스 이동, 미리보기, 캡처 메뉴
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaFocusScoreInput(agentId) {
    const el = document.querySelector(`.qa-score-input[data-qa-agent="${CSS.escape(agentId)}"]`);
    if (!el || el.disabled) return;
    el.focus();
    el.select();
  }

  // ----- 품질 관리 표를 이미지로 저장: 전체/주간/야간/유선/채팅 -----
  const QA_CAPTURE_MODES = [
    { key: "ALL", label: "전체 저장" },
    { key: "DAY", label: "주간 저장" },
    { key: "NIGHT", label: "야간 저장" },
    { key: "VOICE", label: "유선 저장" },
    { key: "CHAT", label: "채팅 저장" },
  ];

  function closeQAPreview() {
    const existing = document.getElementById("qa-preview-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaPreviewEscHandler, true);
  }
  function qaPreviewEscHandler(e) {
    if (e.key === "Escape") closeQAPreview();
  }
  function openQAPreview(dataUrl, filename, modeName) {
    closeQAPreview();
    const overlay = document.createElement("div");
    overlay.id = "qa-preview-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box">
        <div class="sch-preview-head">
          <span>${modeName ? `${esc(modeName)} 이미지 미리보기` : "이미지 미리보기"}</span>
          <button type="button" class="sch-preview-close" id="qa-preview-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body">
          <img src="${dataUrl}" alt="품질 관리 캡처 미리보기">
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="qa-preview-cancel">닫기</button>
          <button type="button" class="primary-btn" id="qa-preview-download">${ICON_DOWNLOAD} 이미지 다운로드</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQAPreview(); };
    document.getElementById("qa-preview-close-x").onclick = () => closeQAPreview();
    document.getElementById("qa-preview-cancel").onclick = () => closeQAPreview();
    document.getElementById("qa-preview-download").onclick = () => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      closeQAPreview();
      flashQAStatus("이미지 저장됨");
    };
    setTimeout(() => document.addEventListener("keydown", qaPreviewEscHandler, true), 0);
  }

  function closeQAMenu() {
    const existing = document.getElementById("qa-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", qaMenuOutsideHandler, true);
  }
  function qaMenuOutsideHandler(e) {
    const menu = document.getElementById("qa-menu");
    if (menu && !menu.contains(e.target)) closeQAMenu();
  }
  function openQACaptureMenu(anchorEl) {
    closeQAMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "qa-menu";
    menu.className = "sch-menu";
    menu.innerHTML = QA_CAPTURE_MODES.map((o) =>
      `<button type="button" data-capture-mode="${o.key}">${ICON_CAMERA} ${o.label}</button>`
    ).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-capture-mode]").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-capture-mode");
        closeQAMenu();
        captureQAPage(mode);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", qaMenuOutsideHandler, true), 0);
  }

  // 품질 관리 표를 통째로 PNG 이미지로 캡처해서 다운로드한다. (월별 스케줄 캡처와 동일한 방식)
  function captureQAPage(mode) {
    const captureMode = mode || "ALL";
    const modeMeta = QA_CAPTURE_MODES.find((m) => m.key === captureMode) || QA_CAPTURE_MODES[0];
    const modeName = modeMeta.label.replace(/ 저장$/, "");
    const btn = document.getElementById("qa-capture-btn");
    if (typeof html2canvas === "undefined") {
      flashQAStatus("캡처 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "이미지 생성 중..."; }

    const cs = getComputedStyle(document.documentElement);
    const themeColor = (name) => cs.getPropertyValue(name).trim();
    const cBg = themeColor("--bg");
    const cText = themeColor("--text");
    const cTextDim = themeColor("--text-dim");
    const cHairline = themeColor("--hairline");

    const { year, monthIndex } = qaUi;
    const agentsList = qaFilterAgentsByMode(qaWorkingAgents(), captureMode);
    const lockedTag = qaIsMonthLocked(year, monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;

    // "전체 저장"일 때만 상단 평균 통계도 표 위에 같이 캡처되게 한다.
    // 화면과 완전히 같은 마크업(qaStatItemHtml)을 그대로 재사용해서 스타일이 어긋나지 않게 한다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const capturePrevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, capturePrevYm.year, capturePrevYm.monthIndex);
    const statsHtml = captureMode === "ALL" ? `
      <div class="qa-stat-grid" style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid ${cHairline};">
        ${qaStatItemHtml("전체 평균", stats.total, prevStats.total, true)}
        ${qaStatItemHtml("유선 점수 평균", stats.voice, prevStats.voice)}
        ${qaStatItemHtml("채팅 점수 평균", stats.chat, prevStats.chat)}
        ${qaStatItemHtml("주간 점수 평균", stats.day, prevStats.day)}
        ${qaStatItemHtml("야간 점수 평균", stats.night, prevStats.night)}
        ${qaStatItemHtml("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
        ${qaStatItemHtml("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
        ${qaStatItemHtml("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
        ${qaStatItemHtml("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
      </div>
    ` : "";

    const wrapper = document.createElement("div");
    wrapper.className = "sch-capture-flatten";
    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";
    wrapper.style.top = "0";
    wrapper.style.background = cBg;
    wrapper.style.padding = "28px";
    wrapper.style.fontFamily = "'KoPub Dotum', system-ui, sans-serif";
    wrapper.style.color = cText;
    wrapper.style.width = "fit-content";
    wrapper.style.maxWidth = "none";
    wrapper.style.overflow = "visible";
    wrapper.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;color:${cText};">품질 관리${titleSuffix}</div>
      <div style="font-size:15px;color:${cTextDim};margin-bottom:16px;">${esc(qaMonthLabel())}${lockedTag} · 캡처일 ${esc(todayISO())}</div>
      ${statsHtml}
      ${buildQATableHtml(agentsList, year, monthIndex, true)}
    `;
    document.body.appendChild(wrapper);

    function cleanup(label) {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CAMERA + " 이미지로 저장 ▾"; }
      if (label) flashQAStatus(label);
    }

    requestAnimationFrame(() => {
      // 표는 CSS(display:table + margin:auto)만으로 이미 표 크기에 맞춰 가운데 정렬된다.
      // 통계 줄은 fit-content 래퍼 안에서는 justify-content:space-between이 퍼질 공간이
      // 없으므로, 표의 실제 렌더링 너비에 맞춰 폭을 직접 지정해서 표와 나란히 맞춘다.
      const statGridEl = wrapper.querySelector(".qa-stat-grid");
      const tableWrapEl = wrapper.querySelector(".qa-table-wrap");
      if (statGridEl && tableWrapEl) {
        statGridEl.style.width = tableWrapEl.getBoundingClientRect().width + "px";
      }

      const fullW = wrapper.scrollWidth;
      const fullH = wrapper.scrollHeight;
      html2canvas(wrapper, {
        backgroundColor: cBg,
        scale: 2,
        width: fullW,
        height: fullH,
        windowWidth: fullW,
        windowHeight: fullH,
      }).then((canvas) => {
        const fileSuffix = captureMode === "ALL" ? "" : `_${modeName}`;
        const filename = `품질관리${fileSuffix}_${year}-${pad2(monthIndex + 1)}.png`;
        const dataUrl = canvas.toDataURL("image/png");
        cleanup("");
        openQAPreview(dataUrl, filename, captureMode === "ALL" ? null : modeName);
      }).catch((err) => {
        console.error(err);
        cleanup("캡처 실패");
      });
    });
  }

  /* ===================== 면담일지 모듈 ===================== */
  const INTERVIEWS_KEY = acctKey("personal-interviews:data");
  const INTERVIEW_TYPES = ["정기", "비정기", "경고", "퇴사"];

  function loadInterviewsData() {
    try {
      const raw = localStorage.getItem(INTERVIEWS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let interviewsData = loadInterviewsData();

  let interviewStatusTimer = null;
  function flashInterviewStatus(msg, elId) {
    const el = document.getElementById(elId || "interview-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(interviewStatusTimer);
    interviewStatusTimer = setTimeout(() => { if (el.textContent === msg) el.textContent = ""; }, 1600);
  }
  function saveInterviewsData() {
    try { localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(interviewsData)); }
    catch (e) {}
  }
  function addInterview(values) {
    const id = genId();
    interviewsData.push(Object.assign({ id, createdAt: new Date().toISOString() }, values));
    saveInterviewsData();
    return id;
  }
  function updateInterview(id, values) {
    const idx = interviewsData.findIndex((r) => r.id === id);
    if (idx === -1) return;
    interviewsData[idx] = Object.assign({}, interviewsData[idx], values);
    saveInterviewsData();
  }
  function deleteInterview(id) {
    if (!interviewsData.some((r) => r.id === id)) return;
    recordUndo("면담 기록 삭제", INTERVIEWS_KEY, () => { interviewsData = loadInterviewsData(); });
    interviewsData = interviewsData.filter((r) => r.id !== id);
    saveInterviewsData();
  }
  /* ---- 면담일지 엑셀 다운로드 ---- */
  function interviewExportFilename(labelPart) {
    return `면담일지_${sanitizeFilenamePart(labelPart)}_${backupFilenameStamp()}.xlsx`;
  }
  // 입사일자 문자열(예: 2025-07-17) 기준으로 오늘까지의 근속 개월수를 계산한다. 형식이 없거나 잘못되면 null.
  function calcTenureMonths(hireDateStr) {
    if (!hireDateStr) return null;
    const hire = new Date(hireDateStr);
    if (isNaN(hire.getTime())) return null;
    const now = new Date();
    let months = (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth());
    if (now.getDate() < hire.getDate()) months -= 1;
    return months < 0 ? 0 : months;
  }
  function interviewExportRowData(rec) {
    const agent = agentsData.find((a) => a.id === rec.agentId);
    const manager = rec.managerId ? agentsData.find((a) => a.id === rec.managerId) : null;
    const tenureMonths = agent ? calcTenureMonths(agent.hireDate) : null;
    return {
      date: rec.date || "",
      type: rec.type || "비정기",
      agentName: agent ? agent.name : "(삭제된 상담사)",
      agentLdap: agent ? (agent.ldap || "") : "",
      group: agent ? (agent.group === "night" ? "야간" : "주간") : "",
      hireDate: agent ? (agent.hireDate || "") : "",
      tenureMonths: tenureMonths === null ? "" : `${tenureMonths}개월`,
      workTypes: agent && agent.workTypes ? agent.workTypes.join(", ") : "",
      manager: manager ? `${manager.name} (${manager.ldap || "-"})` : "",
      content: rec.content || "",
      followUp: rec.followUp || "",
      createdAt: rec.createdAt ? rec.createdAt.replace("T", " ").slice(0, 16) : "",
    };
  }
  // 면담 기록 목록을 엑셀(.xlsx) 파일로 내려받는다. 개별/전체/주·야간별/상담사별 다운로드가 모두 이 함수를 함께 쓴다.
  async function exportInterviewsToExcel(list, filename, statusElId) {
    if (typeof ExcelJS === "undefined") {
      flashInterviewStatus("엑셀 변환 기능을 불러오지 못했어요. 인터넷 연결을 확인해주세요.", statusElId);
      return;
    }
    if (!list.length) {
      flashInterviewStatus("다운로드할 면담 기록이 없어요.", statusElId);
      return;
    }
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("면담일지");
      const columns = [
        { header: "면담일자", key: "date", width: 12 },
        { header: "유형", key: "type", width: 8 },
        { header: "상담사", key: "agentName", width: 12 },
        { header: "LDAP", key: "agentLdap", width: 12 },
        { header: "근무조", key: "group", width: 8 },
        { header: "입사일자", key: "hireDate", width: 12 },
        { header: "근속개월수", key: "tenureMonths", width: 10 },
        { header: "업무구분", key: "workTypes", width: 12 },
        { header: "면담 관리자", key: "manager", width: 16 },
        { header: "면담 내용", key: "content", width: 46 },
        { header: "후속조치 / 다음 계획", key: "followUp", width: 32 },
        { header: "작성일시", key: "createdAt", width: 17 },
      ];
      ws.columns = columns;
      // 면담 내용 · 후속조치 열은 글이 길어 왼쪽 정렬, 나머지 열은 가운데 정렬로 통일한다.
      const leftAlignKeys = new Set(["content", "followUp"]);
      sortInterviews(list).forEach((rec) => ws.addRow(interviewExportRowData(rec)));

      const headerRow = ws.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 10, color: { argb: "FF4D5057" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF0F3" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FFB7BCC5" } },
          left: { style: "thin", color: { argb: "FFB7BCC5" } },
          right: { style: "thin", color: { argb: "FFB7BCC5" } },
          bottom: { style: "medium", color: { argb: "FF9AA0AB" } },
        };
      });
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        row.eachCell({ includeEmpty: true }, (cell) => {
          const key = columns[cell.col - 1] ? columns[cell.col - 1].key : null;
          const isLeft = leftAlignKeys.has(key);
          cell.font = Object.assign({}, cell.font, { size: 10 });
          cell.alignment = isLeft
            ? { vertical: "middle", horizontal: "left", wrapText: true }
            : { vertical: "middle", horizontal: "center", wrapText: true };
          cell.border = {
            top: { style: "thin", color: { argb: "FFC7CBD3" } },
            left: { style: "thin", color: { argb: "FFC7CBD3" } },
            right: { style: "thin", color: { argb: "FFC7CBD3" } },
            bottom: { style: "thin", color: { argb: "FFC7CBD3" } },
          };
        });
      });
      // 표(사용된 범위) 밖 셀에는 엑셀 기본 눈금선이 보이지 않도록 시트 눈금선 자체를 끈다.
      ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      flashInterviewStatus("엑셀 파일을 다운로드했어요.", statusElId);
    } catch (err) {
      console.error(err);
      flashInterviewStatus("엑셀 파일을 만들지 못했어요.", statusElId);
    }
  }
  // 면담 기록 한 건만 엑셀로 내려받는다. (목록의 각 행 · 상담사 상세 화면 공용)
  function downloadSingleInterview(id) {
    const rec = interviewsData.find((r) => r.id === id);
    if (!rec) return;
    const agent = agentsData.find((a) => a.id === rec.agentId);
    const label = `${agent ? agent.name : "상담사"}_${rec.date || ""}`;
    exportInterviewsToExcel([rec], interviewExportFilename(label));
  }
  // 등록된 면담 기록 전체를 (현재 검색·필터와 무관하게) 엑셀로 내려받는다.
  function downloadAllInterviews() {
    exportInterviewsToExcel(interviewsData, interviewExportFilename("전체"), "interview-status");
  }
  // 대상 상담사의 근무 조(주간/야간) 기준으로 면담 기록을 나눠 엑셀로 내려받는다.
  function downloadInterviewsByGroup(group) {
    const list = interviewsData.filter((r) => {
      const agent = agentsData.find((a) => a.id === r.agentId);
      if (!agent) return false;
      const isNight = agent.group === "night";
      return group === "night" ? isNight : !isNight;
    });
    exportInterviewsToExcel(list, interviewExportFilename(group === "night" ? "야간" : "주간"), "interview-status");
  }
  // 상담사 한 명을 골라 그 사람의 면담 기록만 엑셀로 내려받는다.
  function downloadInterviewsByAgent(agentId) {
    const agent = agentsData.find((a) => a.id === agentId);
    if (!agent) return;
    const list = interviewsData.filter((r) => r.agentId === agentId);
    exportInterviewsToExcel(list, interviewExportFilename(agent.name), "interview-status");
  }

  // ----- 면담일지 엑셀 다운로드 버튼: 클릭하면 옵션 목록이 뜨는 팝업 메뉴 -----
  // 월별 스케줄의 "이미지로 저장 ▾" 메뉴와 같은 방식(sch-menu)을 그대로 재사용한다.
  function closeInterviewExportMenu() {
    const existing = document.getElementById("interview-export-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", interviewExportMenuOutsideHandler, true);
  }
  function interviewExportMenuOutsideHandler(e) {
    const menu = document.getElementById("interview-export-menu");
    if (menu && !menu.contains(e.target)) closeInterviewExportMenu();
  }
  function positionInterviewExportMenu(menu, anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
  }
  function renderInterviewExportMenuMain(menu, anchorEl) {
    menu.innerHTML = `
      <button type="button" class="interview-export-menu-item" data-export-action="all">전체 다운로드</button>
      <button type="button" class="interview-export-menu-item" data-export-action="day">주간 다운로드</button>
      <button type="button" class="interview-export-menu-item" data-export-action="night">야간 다운로드</button>
      <button type="button" class="interview-export-menu-item" data-export-action="by-agent">상담사별 다운로드 ›</button>
    `;
    menu.querySelector("[data-export-action='all']").onclick = () => { closeInterviewExportMenu(); downloadAllInterviews(); };
    menu.querySelector("[data-export-action='day']").onclick = () => { closeInterviewExportMenu(); downloadInterviewsByGroup("day"); };
    menu.querySelector("[data-export-action='night']").onclick = () => { closeInterviewExportMenu(); downloadInterviewsByGroup("night"); };
    menu.querySelector("[data-export-action='by-agent']").onclick = () => renderInterviewExportMenuAgents(menu, anchorEl);
    positionInterviewExportMenu(menu, anchorEl);
  }
  function renderInterviewExportMenuAgents(menu, anchorEl) {
    const sortedAgents = agentsData.slice().sort((a, b) => a.name.localeCompare(b.name, "ko"));
    menu.innerHTML = `
      <button type="button" class="interview-export-menu-back" data-export-action="back">‹ 뒤로</button>
      ${sortedAgents.length === 0
        ? `<span class="interview-export-menu-empty">등록된 상담사가 없어요.</span>`
        : sortedAgents.map((a) => `<button type="button" data-export-agent-id="${a.id}">${esc(a.name)} <span class="interview-export-menu-ldap">${esc(a.ldap || "-")}</span></button>`).join("")}
    `;
    menu.querySelector("[data-export-action='back']").onclick = () => renderInterviewExportMenuMain(menu, anchorEl);
    menu.querySelectorAll("[data-export-agent-id]").forEach((btn) => {
      btn.onclick = () => { closeInterviewExportMenu(); downloadInterviewsByAgent(btn.getAttribute("data-export-agent-id")); };
    });
    positionInterviewExportMenu(menu, anchorEl);
  }
  function openInterviewExportMenu(anchorEl) {
    closeInterviewExportMenu();
    const menu = document.createElement("div");
    menu.id = "interview-export-menu";
    menu.className = "sch-menu interview-export-menu";
    document.body.appendChild(menu);
    renderInterviewExportMenuMain(menu, anchorEl);
    setTimeout(() => document.addEventListener("mousedown", interviewExportMenuOutsideHandler, true), 0);
  }

  function interviewTypeBadgeClass(type) {
    if (type === "정기") return "type-regular";
    if (type === "경고") return "type-warning";
    if (type === "퇴사") return "type-resign";
    return "type-adhoc"; // 비정기(과거 데이터의 "수시" 포함)
  }
  // 면담 기록을 최신 날짜순(같은 날짜면 최근 작성순)으로 정렬한다.
  function sortInterviews(list) {
    return [...list].sort((a, b) => {
      const d = (b.date || "").localeCompare(a.date || "");
      if (d !== 0) return d;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }
  // 상담사 이름 또는 LDAP으로 면담 기록을 검색한다.
  function interviewMatchesSearch(rec, query) {
    const needle = (query || "").trim().toLowerCase();
    if (!needle) return true;
    const agent = agentsData.find((a) => a.id === rec.agentId);
    if (!agent) return false;
    return (agent.name || "").toLowerCase().indexOf(needle) !== -1 || (agent.ldap || "").toLowerCase().indexOf(needle) !== -1;
  }
  function interviewMatchesType(rec, typeFilter) {
    if (typeFilter === "all") return true;
    return rec.type === typeFilter;
  }

  const interviewsUi = {
    mode: "list", // "list" | "add" | "edit"
    editingId: null,
    searchQuery: "",
    typeFilter: "all", // "all" | "정기" | "비정기" | "경고" | "퇴사"
    expandedIds: new Set(), // 목록에서 펼쳐본 면담 기록 id들 (상담사 상세 화면과 공유)
    page: 1, // 면담일지 목록의 현재 페이지(10건씩)
  };

  const homeUi = {
    interviewAlertExpanded: false, // 홈 화면의 "면담 필요 알림" 목록을 펼쳐서 볼지 여부
  };

  // 이름 · LDAP · 초성으로 검색해서 목록에서 바로 고르는 검색-선택 위젯 한 칸을 그려준다.
  // (대상 상담사 / 면담 관리자 모두 이 위젯을 함께 쓴다)
  function renderAgentPickerField(idPrefix, fieldKey, label, selectedAgent, placeholder) {
    const inputValue = selectedAgent ? `${selectedAgent.name} (${selectedAgent.ldap || "-"})` : "";
    return `
      <div class="agent-picker-field">
        <label class="agent-form-label">${label}
          <div class="agent-picker" id="${idPrefix}-${fieldKey}-picker">
            <div class="agent-picker-input">
              <input type="text" class="agent-picker-input-field" id="${idPrefix}-${fieldKey}-search" placeholder="${esc(placeholder)}" value="${esc(inputValue)}" autocomplete="off">
              ${ICON_SEARCH_MINI}
            </div>
            <input type="hidden" id="${idPrefix}-${fieldKey}" value="${selectedAgent ? selectedAgent.id : ""}">
            <div class="agent-picker-list" id="${idPrefix}-${fieldKey}-list"></div>
          </div>
        </label>
        <div class="agent-picker-info" id="${idPrefix}-${fieldKey}-info">${selectedAgent ? agentPickerInfoHtml(selectedAgent) : ""}</div>
      </div>
    `;
  }

  function agentPickerInfoHtml(agent) {
    const item = (label, valueHtml) => `<div class="agent-picker-info-item"><span class="agent-picker-info-item-label">${label}</span><span class="agent-picker-info-item-value">${valueHtml}</span></div>`;
    return `
      ${item("이름", esc(agent.name || "-"))}
      ${item("LDAP", esc(agent.ldap || "-"))}
      ${item("근무 조", scheduleGroupBadgeHtml(agent.group))}
      ${item("업무 구분", workTypeBadgesHtml(agent.workTypes))}
      ${item("시간대", agent.timezone ? esc(agent.timezone) : '<span class="agent-field-empty">-</span>')}
    `;
  }

  // 위 필드를 실제로 검색·선택되게 동작시킨다. candidates가 검색 대상 목록.
  function attachAgentPickerField(idPrefix, fieldKey, candidates) {
    const picker = document.getElementById(`${idPrefix}-${fieldKey}-picker`);
    if (!picker) return;
    const input = document.getElementById(`${idPrefix}-${fieldKey}-search`);
    const hidden = document.getElementById(`${idPrefix}-${fieldKey}`);
    const listEl = document.getElementById(`${idPrefix}-${fieldKey}-list`);
    const infoEl = document.getElementById(`${idPrefix}-${fieldKey}-info`);

    function selectAgent(agent) {
      hidden.value = agent ? agent.id : "";
      input.value = agent ? `${agent.name} (${agent.ldap || "-"})` : "";
      infoEl.innerHTML = agent ? agentPickerInfoHtml(agent) : "";
    }

    function renderList(query) {
      const matches = candidates.filter((a) => agentMatchesSearch(a, query)).slice(0, 30);
      listEl.innerHTML = matches.length === 0
        ? `<div class="agent-picker-empty">${candidates.length === 0 ? "등록된 인원이 없어요." : "일치하는 인원이 없어요."}</div>`
        : matches.map((a) => `
            <div class="agent-picker-item" data-id="${a.id}">
              <span>${esc(a.name)}</span><span class="agent-picker-item-ldap">${esc(a.ldap || "")}</span>
            </div>
          `).join("");
      listEl.querySelectorAll("[data-id]").forEach((item) => {
        // 클릭 시 input의 blur가 먼저 발생해 목록이 닫히는 것을 막기 위해 mousedown에서 선택을 처리한다.
        item.onmousedown = (e) => {
          e.preventDefault();
          const agent = candidates.find((a) => a.id === item.getAttribute("data-id"));
          if (agent) selectAgent(agent);
          listEl.classList.remove("open");
        };
      });
      listEl.classList.add("open");
    }

    input.oninput = () => {
      if (hidden.value) selectAgent(null);
      renderList(input.value);
    };
    input.onfocus = () => renderList(input.value);
    input.onblur = () => { setTimeout(() => listEl.classList.remove("open"), 120); };
  }

  function renderInterviewFormFields(v, lockAgentId, idPrefix) {
    const activeAgents = agentsData.slice().sort((a, b) => a.name.localeCompare(b.name, "ko"));
    const managerCandidates = agentsData.filter((a) => a.isAdmin).sort((a, b) => a.name.localeCompare(b.name, "ko"));
    const selectedManager = v.managerId ? agentsData.find((a) => a.id === v.managerId) || null : null;

    const targetFieldHtml = lockAgentId ? "" : renderAgentPickerField(idPrefix, "agent", "대상 상담사", v.agentId ? activeAgents.find((a) => a.id === v.agentId) || null : null, "이름, LDAP, 초성으로 검색");
    const managerFieldHtml = renderAgentPickerField(idPrefix, "manager", "면담 관리자", selectedManager, managerCandidates.length ? "이름, LDAP, 초성으로 검색" : "등록된 관리자가 없어요");

    const pickerRowHtml = lockAgentId
      ? managerFieldHtml
      : `<div class="agent-form-row-2">${targetFieldHtml}${managerFieldHtml}</div>`;

    return `
      ${pickerRowHtml}
      <div class="agent-form-row-2 agent-form-row-2-date-type">
        <label class="agent-form-label">면담 날짜
          <input type="date" class="add-input" id="${idPrefix}-date" value="${esc(v.date || "")}" autocomplete="off">
        </label>
        <div class="agent-form-label">면담 유형
          <div class="agent-radio-row">
            ${INTERVIEW_TYPES.map((t) => `
              <label class="agent-radio"><input type="radio" name="${idPrefix}-type" value="${t}" ${v.type === t ? "checked" : ""}> ${t}</label>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="interview-draft-helper">
        <label class="agent-form-label">AI 초안 정리 (선택)
          <textarea class="add-input interview-textarea interview-textarea-draft" id="${idPrefix}-draft" placeholder="면담 중/직후 대충 메모해두세요. 예: 오늘 콜 응대 느리다고 얘기함, 담달까지 지켜보기로"></textarea>
        </label>
        <div class="interview-draft-actions">
          <button type="button" class="ghost-btn" id="${idPrefix}-draft-btn">AI로 다듬기</button>
          <span class="interview-draft-status" id="${idPrefix}-draft-status"></span>
        </div>
      </div>
      <label class="agent-form-label">면담 내용
        <textarea class="add-input interview-textarea interview-textarea-content" id="${idPrefix}-content" placeholder="면담에서 나눈 내용을 적어주세요">${esc(v.content || "")}</textarea>
      </label>
      <label class="agent-form-label">후속조치 / 다음 계획 (선택)
        <textarea class="add-input interview-textarea" id="${idPrefix}-followup" placeholder="다음에 확인할 사항이 있다면 적어주세요">${esc(v.followUp || "")}</textarea>
      </label>
    `;
  }

  // renderInterviewFormFields로 그려진 폼이 실제 DOM에 붙은 뒤 호출해서 검색-선택 위젯을 동작시킨다.
  function attachInterviewFormPickers(idPrefix, lockAgentId) {
    enhanceDateInput(document.getElementById(`${idPrefix}-date`));
    if (!lockAgentId) {
      const activeAgents = agentsData.slice().sort((a, b) => a.name.localeCompare(b.name, "ko"));
      attachAgentPickerField(idPrefix, "agent", activeAgents);
    }
    const managerCandidates = agentsData.filter((a) => a.isAdmin).sort((a, b) => a.name.localeCompare(b.name, "ko"));
    attachAgentPickerField(idPrefix, "manager", managerCandidates);
    attachInterviewDraftHelper(idPrefix);
  }

  function readInterviewFormValues(idPrefix, lockAgentId) {
    const agentHidden = document.getElementById(`${idPrefix}-agent`);
    const agentId = lockAgentId || (agentHidden ? agentHidden.value : "");
    if (!agentId) return null;
    const managerHidden = document.getElementById(`${idPrefix}-manager`);
    const managerId = managerHidden ? managerHidden.value : "";
    const date = document.getElementById(`${idPrefix}-date`).value.trim();
    const typeInput = document.querySelector(`input[name="${idPrefix}-type"]:checked`);
    const type = typeInput ? typeInput.value : INTERVIEW_TYPES[0];
    const content = document.getElementById(`${idPrefix}-content`).value.trim();
    const followUp = document.getElementById(`${idPrefix}-followup`).value.trim();
    return { agentId, managerId, date, type, content, followUp };
  }

  function renderInterviewRow(rec, actionPrefix) {
    const agent = agentsData.find((a) => a.id === rec.agentId);
    const agentNameHtml = agent
      ? `<span class="interview-agent-name">${esc(agent.name)}</span><span class="interview-agent-ldap">${esc(agent.ldap)}</span>`
      : `<span class="interview-agent-name agent-field-empty">(삭제된 상담사)</span>`;
    const agentMetaHtml = agent ? `
      <span class="interview-agent-meta">
        ${agent.timezone ? `<span class="interview-agent-timezone">${ICON_CLOCK} ${esc(agent.timezone)}</span>` : ""}
        <span class="badge sm ${agent.group === "night" ? "night" : "day"}">${agent.group === "night" ? "야간" : "주간"}</span>
        ${renderWorkTypeBadges(agent.workTypes, "sm")}
      </span>
    ` : "";
    const manager = rec.managerId ? agentsData.find((a) => a.id === rec.managerId) : null;
    const managerHtml = manager ? `<span class="interview-agent-ldap">${ICON_SHIELD} ${esc(manager.name)} · ${esc(manager.ldap)}</span>` : "";
    const isExpanded = interviewsUi.expandedIds.has(rec.id);
    return `
      <div class="interview-row ${isExpanded ? "expanded" : ""}">
        <div class="interview-row-top" data-action="toggle-interview-row" data-id="${rec.id}">
          <span class="interview-row-chevron">${ICON_CHEVRON_RIGHT}</span>
          <span class="interview-date">${esc(rec.date || "-")}</span>
          <span class="badge sm ${interviewTypeBadgeClass(rec.type)}">${esc(rec.type || "비정기")}</span>
          ${agentNameHtml}
          ${agentMetaHtml}
          ${managerHtml}
          <div class="interview-row-actions">
            <button class="ghost-btn" data-action="${actionPrefix}-download-interview" data-id="${rec.id}" title="엑셀 다운로드">${ICON_DOWNLOAD}</button>
            <button class="ghost-btn" data-action="${actionPrefix}-edit-interview" data-id="${rec.id}">수정</button>
            <button class="ghost-btn danger" data-action="${actionPrefix}-delete-interview" data-id="${rec.id}">삭제</button>
          </div>
        </div>
        ${isExpanded ? `
          <div class="interview-row-body">
            ${rec.content ? `<div class="interview-content">${esc(rec.content)}</div>` : ""}
            <div class="interview-followup">후속조치: ${rec.followUp ? esc(rec.followUp) : "없음"}</div>
          </div>
        ` : ""}
      </div>
    `;
  }

  // 면담 기록 행을 펼치고/접는 클릭을 처리한다. 수정·삭제 버튼 클릭은 여기서 무시한다.
  function attachInterviewRowToggles(root, onToggle) {
    root.querySelectorAll("[data-action='toggle-interview-row']").forEach((row) => {
      row.onclick = (e) => {
        if (e.target.closest(".interview-row-actions")) return;
        const id = row.getAttribute("data-id");
        if (interviewsUi.expandedIds.has(id)) {
          interviewsUi.expandedIds.delete(id);
        } else {
          interviewsUi.expandedIds.add(id);
        }
        onToggle();
      };
    });
  }

  /* ---- 독립 메뉴: 면담일지 페이지 ---- */
  function renderInterviewsPage(root) {
    const filtered = sortInterviews(
      interviewsData.filter((r) => interviewMatchesSearch(r, interviewsUi.searchQuery) && interviewMatchesType(r, interviewsUi.typeFilter))
    );

    let bodyHtml;
    let exportRowHtml = "";
    if (interviewsUi.mode === "add") {
      bodyHtml = `
        <div class="agent-form-title">새 면담 기록 추가</div>
        <form class="agent-form" id="interview-page-form">
          ${renderInterviewFormFields({ date: todayISO(), type: "정기" }, null, "interview-page")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">추가</button>
            <button type="button" class="cancel-btn" id="interview-page-cancel">취소</button>
          </div>
        </form>
      `;
    } else if (interviewsUi.mode === "edit") {
      const editing = interviewsData.find((r) => r.id === interviewsUi.editingId) || null;
      bodyHtml = editing ? `
        <div class="agent-form-title">면담 기록 수정</div>
        <form class="agent-form" id="interview-page-form">
          ${renderInterviewFormFields(editing, null, "interview-page")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">저장</button>
            <button type="button" class="cancel-btn" id="interview-page-cancel">취소</button>
          </div>
        </form>
      ` : `<div class="agent-list-empty">기록을 찾을 수 없어요.</div>`;
    } else {
      const typeFilterBtns = ["all", ...INTERVIEW_TYPES].map((t) => `
        <button type="button" class="agent-filter-btn ${interviewsUi.typeFilter === t ? "active" : ""}" data-interview-filter="${t}">${t === "all" ? "전체" : t}</button>
      `).join("");
      exportRowHtml = `<button class="ghost-btn" id="interview-export-btn">${ICON_DOWNLOAD} 엑셀로 다운로드 ▾</button>`;
      bodyHtml = `
        <div class="agent-controls">
          <div class="agent-filter-row">${typeFilterBtns}</div>
        </div>
        <div id="interview-list-area">
          ${renderInterviewListAreaHtml(filtered)}
        </div>
      `;
    }

    root.innerHTML = `
      <div class="agent-list-header">
        <div class="agent-list-title">면담일지</div>
        ${interviewsUi.mode === "list" ? `<div class="agent-list-header-actions">${exportRowHtml}<button class="ghost-btn" id="btn-interview-ai-summary">AI 요약</button><button class="ghost-btn solid-accent-btn" id="btn-interview-add">＋ 면담 기록 추가</button></div>` : ""}
      </div>
      <div class="card">
        <div class="interview-summary-row">
          <div class="agent-summary">전체 ${interviewsData.length}건${interviewsUi.mode === "list" && filtered.length !== interviewsData.length ? ` · 필터 결과 ${filtered.length}건` : ""}</div>
          ${interviewsUi.mode === "list" ? `<div class="agent-search-input"><input type="text" class="agent-search-input-field" id="interview-search-input" placeholder="상담사 이름 또는 LDAP 검색" value="${esc(interviewsUi.searchQuery)}" autocomplete="off">${ICON_SEARCH_MINI}</div>` : ""}
        </div>
        <div class="status" id="interview-status"></div>
        ${bodyHtml}
      </div>
    `;

    attachInterviewsPageEvents(root);
  }

  // 면담일지 목록 영역(검색바 아래)의 내용을 만든다. 10건씩 페이지를 나눠서 보여준다.
  function renderInterviewListAreaHtml(filtered) {
    if (filtered.length === 0) {
      return `<div class="agent-list-empty">${interviewsData.length === 0 ? "등록된 면담 기록이 없어요." : "검색 또는 필터 조건에 맞는 면담 기록이 없어요."}</div>`;
    }
    const { items, page, totalPages } = paginateList(filtered, interviewsUi.page);
    interviewsUi.page = page;
    return `
      <div class="interview-list">${items.map((r) => renderInterviewRow(r, "page")).join("")}</div>
      ${renderPaginationHtml(page, totalPages, "interview-list")}
    `;
  }

  function updateInterviewListArea() {
    const area = document.getElementById("interview-list-area");
    if (!area) return;
    const filtered = sortInterviews(
      interviewsData.filter((r) => interviewMatchesSearch(r, interviewsUi.searchQuery) && interviewMatchesType(r, interviewsUi.typeFilter))
    );
    area.innerHTML = renderInterviewListAreaHtml(filtered);
    attachInterviewListAreaHandlers(area);
    const summaryEl = document.querySelector("#page-inner .agent-summary");
    if (summaryEl) {
      summaryEl.textContent = `전체 ${interviewsData.length}건${filtered.length !== interviewsData.length ? ` · 필터 결과 ${filtered.length}건` : ""}`;
    }
  }

  function attachInterviewListAreaHandlers(root) {
    attachInterviewRowToggles(root, updateInterviewListArea);
    attachPaginationHandlers(root, "interview-list", (delta) => {
      interviewsUi.page = interviewsUi.page + delta;
      updateInterviewListArea();
    });
    root.querySelectorAll("[data-action='page-download-interview']").forEach((btn) => {
      btn.onclick = () => downloadSingleInterview(btn.getAttribute("data-id"));
    });
    root.querySelectorAll("[data-action='page-edit-interview']").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.mode = "edit";
        interviewsUi.editingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='page-delete-interview']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 면담 기록을 삭제할까요?")) {
          deleteInterview(id);
          renderApp();
        }
      };
    });
  }

  function attachInterviewsPageEvents(root) {
    const addBtn = document.getElementById("btn-interview-add");
    if (addBtn) {
      addBtn.onclick = () => {
        interviewsUi.mode = "add";
        interviewsUi.editingId = null;
        renderApp();
      };
    }
    const aiSummaryBtn = document.getElementById("btn-interview-ai-summary");
    if (aiSummaryBtn) aiSummaryBtn.onclick = () => openInterviewAiModal();
    const searchInput = document.getElementById("interview-search-input");
    if (searchInput) {
      searchInput.oninput = (e) => {
        interviewsUi.searchQuery = e.target.value;
        interviewsUi.page = 1;
        updateInterviewListArea();
      };
    }
    root.querySelectorAll("[data-interview-filter]").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.typeFilter = btn.getAttribute("data-interview-filter");
        interviewsUi.page = 1;
        renderApp();
      };
    });
    const exportBtn = document.getElementById("interview-export-btn");
    if (exportBtn) exportBtn.onclick = (e) => openInterviewExportMenu(e.currentTarget);
    attachInterviewListAreaHandlers(root);

    const form = document.getElementById("interview-page-form");
    if (form) {
      attachInterviewFormPickers("interview-page", null);
      form.onsubmit = (e) => {
        e.preventDefault();
        const values = readInterviewFormValues("interview-page", null);
        if (!values) { flashInterviewStatus("대상 상담사를 선택해주세요."); return; }
        if (interviewsUi.mode === "edit" && interviewsUi.editingId) {
          updateInterview(interviewsUi.editingId, values);
        } else {
          addInterview(values);
        }
        interviewsUi.mode = "list";
        interviewsUi.editingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("interview-page-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          interviewsUi.mode = "list";
          interviewsUi.editingId = null;
          renderApp();
        };
      }
    }
  }

  /* ---- 상담사 상세 화면에 끼워 넣는 면담 이력 섹션 ---- */
  function renderAgentInterviewSection(agent) {
    const records = sortInterviews(interviewsData.filter((r) => r.agentId === agent.id));
    let bodyHtml;
    if (agentsUi.interviewMode === "add") {
      bodyHtml = `
        <form class="agent-form" id="agent-interview-form">
          ${renderInterviewFormFields({ date: todayISO(), type: "정기" }, agent.id, "agent-interview")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">추가</button>
            <button type="button" class="cancel-btn" id="agent-interview-cancel">취소</button>
          </div>
        </form>
      `;
    } else if (agentsUi.interviewMode === "edit") {
      const editing = interviewsData.find((r) => r.id === agentsUi.interviewEditingId) || null;
      bodyHtml = editing ? `
        <form class="agent-form" id="agent-interview-form">
          ${renderInterviewFormFields(editing, agent.id, "agent-interview")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">저장</button>
            <button type="button" class="cancel-btn" id="agent-interview-cancel">취소</button>
          </div>
        </form>
      ` : `<div class="agent-list-empty">기록을 찾을 수 없어요.</div>`;
    } else {
      bodyHtml = records.length === 0
        ? `<div class="agent-list-empty">이 상담사와의 면담 기록이 없어요.</div>`
        : `<div class="interview-list">${records.map((r) => renderInterviewRow(r, "agent")).join("")}</div>`;
    }
    return `
      <div class="agent-interview-section">
        <div class="agent-interview-header">
          <div class="agent-interview-title">${ICON_CLIPBOARD} 면담 이력</div>
          <div class="agent-interview-header-actions">
            ${agentsUi.interviewMode === "list" ? `<button class="ghost-btn solid-accent-btn" id="btn-agent-interview-add">＋ 면담 기록 추가</button>` : ""}
            <button class="ghost-btn" data-action="agent-goto-interviews" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 면담일지 전체보기</button>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function attachAgentInterviewEvents(root, agent) {
    attachInterviewRowToggles(root, renderApp);
    root.querySelectorAll("[data-action='agent-download-interview']").forEach((btn) => {
      btn.onclick = () => downloadSingleInterview(btn.getAttribute("data-id"));
    });
    const addBtn = document.getElementById("btn-agent-interview-add");
    if (addBtn) {
      addBtn.onclick = () => {
        agentsUi.interviewMode = "add";
        agentsUi.interviewEditingId = null;
        renderApp();
      };
    }
    // 상담사 상세 → 면담일지 전체 화면으로 이동하면서, 이 상담사 이름으로 미리 검색해둔다.
    root.querySelectorAll("[data-action='agent-goto-interviews']").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.searchQuery = agent.name;
        interviewsUi.typeFilter = "all";
        interviewsUi.mode = "list";
        interviewsUi.page = 1;
        setPage("interviews");
      };
    });
    // 상담사 상세 → 품질 관리 화면으로 이동하면서, 이 상담사가 있는 달로 맞춰준다.
    root.querySelectorAll("[data-action='agent-goto-qa']").forEach((btn) => {
      btn.onclick = () => {
        qaUi.year = today.getFullYear();
        qaUi.monthIndex = today.getMonth();
        qaHighlightAgentId = agent.id;
        setPage("qa");
      };
    });
    root.querySelectorAll("[data-action='agent-edit-interview']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.interviewMode = "edit";
        agentsUi.interviewEditingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='agent-delete-interview']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 면담 기록을 삭제할까요?")) {
          deleteInterview(id);
          renderApp();
        }
      };
    });
    const form = document.getElementById("agent-interview-form");
    if (form) {
      attachInterviewFormPickers("agent-interview", agent.id);
      form.onsubmit = (e) => {
        e.preventDefault();
        const values = readInterviewFormValues("agent-interview", agent.id);
        if (!values) return;
        if (agentsUi.interviewMode === "edit" && agentsUi.interviewEditingId) {
          updateInterview(agentsUi.interviewEditingId, values);
        } else {
          addInterview(values);
        }
        agentsUi.interviewMode = "list";
        agentsUi.interviewEditingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("agent-interview-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          agentsUi.interviewMode = "list";
          agentsUi.interviewEditingId = null;
          renderApp();
        };
      }
    }
  }

  /* ===================== 면담일지 AI 요약 (Groq) ===================== */
  // 실제 Groq API 키는 브라우저에 없고, QA AI 요약과 동일한 Supabase Edge Function
  // (qa-groq-summary)의 서버 환경변수에만 있다. 그 함수는 prompt 텍스트를 넘기면
  // Groq 응답 텍스트를 돌려주는 범용 함수라서, 면담일지에서도 그대로 재사용한다.
  const INTERVIEW_AI_SUMMARY_FN = "qa-groq-summary";

  // AI 응답에서 대괄호 제목/불필요한 여백을 걷어내고, "- "로 시작하는 개조식 줄 목록으로 다듬는다.
  function parseInterviewDraftSummary(text) {
    const clean = String(text || "")
      .replace(/\*\*/g, "")
      .replace(/^\s*\[[^\[\]]+\]\s*/m, "") // 혹시 모델이 "[면담 내용]" 같은 제목을 붙여 보내도 제거
      .trim();
    return clean
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => (line.startsWith("-") ? line : `- ${line}`))
      .join("\n");
  }

  // 면담 기록 폼의 "AI 초안 정리" 버튼: 대충 적은 메모를 "면담 내용" 필드로 정리해서 채워준다.
  // 후속조치는 AI가 건드리지 않고, 관리자가 직접 작성하는 칸으로 남겨둔다.
  function attachInterviewDraftHelper(idPrefix) {
    const btn = document.getElementById(`${idPrefix}-draft-btn`);
    const draftEl = document.getElementById(`${idPrefix}-draft`);
    const statusEl = document.getElementById(`${idPrefix}-draft-status`);
    if (!btn || !draftEl) return;
    btn.onclick = async () => {
      const draft = draftEl.value.trim();
      if (statusEl) statusEl.textContent = "";
      if (!draft) { if (statusEl) statusEl.textContent = "먼저 메모를 입력해주세요."; return; }
      if (!cloud) { if (statusEl) statusEl.textContent = "AI 서버에 연결할 수 없어요 (네트워크 확인)."; return; }
      const contentEl = document.getElementById(`${idPrefix}-content`);
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "정리 중...";
      try {
        const prompt = `다음은 콜센터 관리자가 상담사와의 면담 중/직후 대충 적어둔 메모입니다.\n\n${draft}\n\n위 메모를 바탕으로, 실제 면담 기록의 "면담 내용" 칸에 남길 내용을 정리해주세요. 한국어로, 하나의 문단이 아니라 항목별로 줄을 나눠서 쓰고, 모든 줄은 반드시 "- "로 시작하세요. 문장은 정중한 존댓말이 아니라 "~함", "~됨", "~하기로 함"처럼 짧고 담백한 개조식 종결형으로 쓰고, 한 줄에는 하나의 내용만 담으세요. 불필요한 서론·결론이나 섹션 제목은 쓰지 말고, 순수하게 "- "로 시작하는 줄들만 나열하세요. 마크다운 기호(**, *, # 등)는 절대 쓰지 마세요.\n\n예시:\n- QA 점수가 85점을 넘지 못하고 있음을 확인함\n- 상담 시간과 후처리 시간은 기준 이내로 안정적임`;
        // 실제 Groq API 키는 이 브라우저가 아니라 Supabase Edge Function(qa-groq-summary)
        // 서버 쪽 환경변수에만 있다. 여기서는 그 함수를 호출하기만 한다.
        const { data, error } = await cloud.functions.invoke(INTERVIEW_AI_SUMMARY_FN, { body: { prompt } });
        if (error) {
          let msg = error.message || "요청 실패";
          try {
            const ctx = error.context && typeof error.context.json === "function" ? await error.context.json() : null;
            if (ctx && ctx.error) msg = ctx.error;
          } catch (_e) {}
          throw new Error(msg);
        }
        const text = (data && data.text) ? String(data.text).trim() : "";
        if (!text) throw new Error("응답에서 정리된 내용을 찾지 못했어요.");
        const content = parseInterviewDraftSummary(text);
        if (contentEl && content) contentEl.value = content;
        if (statusEl) statusEl.textContent = "정리했어요. 필요하면 직접 다듬어주세요.";
      } catch (err) {
        console.error(err);
        if (statusEl) statusEl.textContent = `정리 실패: ${err.message || String(err)}`;
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    };
  }

  // 면담 기록이 1건 이상 있는 상담사만, 가장 최근 면담일이 최신인 순서로 정렬해 돌려준다.
  function interviewAiAgentCandidates() {
    const list = agentsData
      .map((agent) => ({ agent, records: sortInterviews(interviewsData.filter((r) => r.agentId === agent.id)) }))
      .filter((entry) => entry.records.length > 0);
    list.sort((a, b) => (b.records[0].date || "").localeCompare(a.records[0].date || ""));
    return list;
  }

  function closeInterviewAiModal() {
    const existing = document.getElementById("interview-ai-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", interviewAiEscHandler, true);
  }
  function interviewAiEscHandler(e) { if (e.key === "Escape") closeInterviewAiModal(); }

  function openInterviewAiModal() {
    closeInterviewAiModal();
    const overlay = document.createElement("div");
    overlay.id = "interview-ai-overlay";
    overlay.className = "sch-preview-overlay";
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeInterviewAiModal(); };
    document.addEventListener("keydown", interviewAiEscHandler, true);
    renderInterviewAiAgentStep(overlay, "");
  }

  // 1단계: AI 요약을 돌릴 상담사를 검색해서 고르는 화면.
  function renderInterviewAiAgentStep(overlay, query) {
    const q = query || "";
    const candidates = interviewAiAgentCandidates();
    const matches = q.trim() ? candidates.filter((entry) => agentMatchesSearch(entry.agent, q)) : candidates;

    const listHtml = candidates.length === 0
      ? `<div class="agent-picker-empty">면담 기록이 있는 상담사가 없어요.</div>`
      : matches.length === 0
        ? `<div class="agent-picker-empty">일치하는 상담사가 없어요.</div>`
        : matches.map(({ agent, records }) => `
            <div class="interview-ai-agent-item" data-id="${agent.id}">
              <span class="interview-ai-agent-name">${esc(agent.name)}</span>
              <span class="interview-ai-agent-ldap">${esc(agent.ldap || "")}</span>
              <span class="interview-ai-agent-count">최근 ${esc(records[0].date || "-")} · 총 ${records.length}건</span>
            </div>
          `).join("");

    overlay.innerHTML = `
      <div class="sch-preview-box interview-ai-box">
        <div class="sch-preview-head">
          <span>면담일지 AI 요약 · 상담사 선택</span>
          <button type="button" class="sch-preview-close" id="interview-ai-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body interview-ai-body">
          <div class="agent-picker-input interview-ai-search-row">
            <input type="text" class="agent-picker-input-field" id="interview-ai-search" placeholder="이름, LDAP, 초성으로 검색" value="${esc(q)}" autocomplete="off">
            ${ICON_SEARCH_MINI}
          </div>
          <div class="interview-ai-agent-list">${listHtml}</div>
        </div>
      </div>
    `;
    document.getElementById("interview-ai-close-x").onclick = () => closeInterviewAiModal();
    const searchInput = document.getElementById("interview-ai-search");
    searchInput.oninput = () => renderInterviewAiAgentStep(overlay, searchInput.value);
    searchInput.focus();
    overlay.querySelectorAll("[data-id]").forEach((item) => {
      item.onclick = () => {
        const agent = agentsData.find((a) => a.id === item.getAttribute("data-id"));
        if (agent) runInterviewAiSummary(overlay, agent);
      };
    });
  }

  // 2단계: 선택한 상담사의 최근 면담 3건을 Groq에게 요약시켜 보여준다.
  async function runInterviewAiSummary(overlay, agent) {
    const records = sortInterviews(interviewsData.filter((r) => r.agentId === agent.id)).slice(0, 3);
    overlay.innerHTML = `
      <div class="sch-preview-box interview-ai-box">
        <div class="sch-preview-head">
          <span>${esc(agent.name)} · 최근 면담 ${records.length}건 AI 요약</span>
          <button type="button" class="sch-preview-close" id="interview-ai-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body interview-ai-body">
          <button type="button" class="ghost-btn interview-ai-back-btn" id="interview-ai-back-btn">← 다른 상담사 선택</button>
          ${records.length ? `
            <div class="interview-ai-source-list">
              ${records.map((r) => `
                <div class="interview-ai-source-item">
                  <span class="interview-date">${esc(r.date || "-")}</span>
                  <span class="badge sm ${interviewTypeBadgeClass(r.type)}">${esc(r.type || "비정기")}</span>
                </div>
              `).join("")}
            </div>
          ` : ""}
          <div class="interview-ai-summary-box qa-round-summary-box" id="interview-ai-summary-box">
            <span class="qa-round-hint">AI에게 요약을 요청하고 있어요...</span>
          </div>
        </div>
      </div>
    `;
    document.getElementById("interview-ai-close-x").onclick = () => closeInterviewAiModal();
    document.getElementById("interview-ai-back-btn").onclick = () => renderInterviewAiAgentStep(overlay, "");

    const box = document.getElementById("interview-ai-summary-box");
    if (!records.length) { box.innerHTML = `<span class="qa-round-hint">면담 기록이 없어요.</span>`; return; }
    if (!cloud) { box.innerHTML = `<span class="qa-round-hint" style="color:var(--red);">AI 요약 서버에 연결할 수 없어요 (네트워크 확인).</span>`; return; }

    try {
      // 오래된 순으로 정리해서, AI가 시간 흐름을 따라 이해할 수 있게 한다.
      const recordsText = records.slice().reverse().map((r, i) => (
        `${i + 1}. [${r.date || "날짜 미상"} · ${r.type || "비정기"}]\n내용: ${r.content || "(내용 없음)"}\n후속조치: ${r.followUp || "없음"}`
      )).join("\n\n");
      const prompt = `다음은 콜센터 상담사 "${agent.name}"님과 나눈 최근 면담 ${records.length}건의 기록입니다(오래된 순).\n\n${recordsText}\n\n위 내용을 한국어로, 아래와 같이 정확히 세 개 섹션으로만 정리해주세요. 불필요한 서론·결론 문장은 쓰지 마세요. 마크다운 기호(**, *, # 등)는 절대 쓰지 말고, 아래처럼 대괄호로 된 제목만 그대로 써주세요.\n\n[면담 흐름 요약]\n- (여러 회차에 걸친 면담 내용을 시간 순으로 간결하게 정리하세요. 문장은 "~하세요/~마세요" 같은 권유형이 아니라 "~함", "~됨"처럼 개조식 명사형 종결로 쓰세요.)\n\n[반복되는 이슈]\n- (여러 면담에서 공통적으로 나온 문제나 패턴이 있다면 한 줄씩. 없다면 "특별히 반복되는 이슈는 없음" 한 줄만 쓰세요.)\n\n[후속 조치 필요 사항]\n- (아직 해결되지 않았거나 다음 면담에서 계속 챙겨야 할 점을 한 줄씩. "~하세요", "~주세요" 같은 권유형은 쓰지 말고 "~필요", "~해야 함"처럼 개조식 명사형 종결로 쓰세요.)`;
      // 실제 Groq API 키는 이 브라우저가 아니라 Supabase Edge Function(qa-groq-summary)
      // 서버 쪽 환경변수에만 있다. 여기서는 그 함수를 호출하기만 한다.
      const { data, error } = await cloud.functions.invoke(INTERVIEW_AI_SUMMARY_FN, { body: { prompt } });
      if (error) {
        let msg = error.message || "요청 실패";
        try {
          const ctx = error.context && typeof error.context.json === "function" ? await error.context.json() : null;
          if (ctx && ctx.error) msg = ctx.error;
        } catch (_e) {}
        throw new Error(msg);
      }
      const text = (data && data.text) ? String(data.text).trim() : "";
      if (!text) throw new Error("응답에서 요약 내용을 찾지 못했어요.");
      box.innerHTML = qaFormatSummaryHtml(text);
    } catch (err) {
      console.error(err);
      box.innerHTML = `<span class="qa-round-hint" style="color:var(--red);">요약 실패: ${esc(err.message || String(err))}</span>`;
    }
  }

  /* ===================== 내비게이션 + 앱 렌더 ===================== */
  /* ===================== 월별 스케줄 모듈 ===================== */
  const SCHEDULE_KEY = acctKey("personal-schedule:data");

  // 07a1-schedule-data.js — 데이터 로드/저장/정규화, 월 잠금, 상담사 목록 동기화
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function loadScheduleData() {
    try {
      const raw = localStorage.getItem(SCHEDULE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.staff) && parsed.records && typeof parsed.records === "object") {
          if (!parsed.staffHistory || typeof parsed.staffHistory !== "object") parsed.staffHistory = {};
          if (typeof parsed.lastSyncMonthKey !== "string") parsed.lastSyncMonthKey = null;
          return parsed;
        }
      }
    } catch (e) {}
    return { staff: [], records: {}, staffHistory: {}, lastSyncMonthKey: null, requiredHeadcount: {}, monthLocks: {}, memos: {}, nameMemos: {} };
  }
  function normalizeScheduleData(d) {
    if (!d.requiredHeadcount) d.requiredHeadcount = {};
    // 셀(인원×날짜)마다 남길 수 있는 메모. key는 scheduleRecordKey와 같은 형식(staffId|dateKey).
    if (!d.memos || typeof d.memos !== "object") d.memos = {};
    // 이름 칸에 남기는 메모. 셀 메모와 달리 "인원 × 달" 단위라서 key는 `staffId|YYYY-MM` 형식이다.
    // (셀 메모와 같은 memos 안에 섞지 않는 이유: 셀 메모는 key 끝이 날짜(YYYY-MM-DD)라는 전제로
    //  가감점 취합·복사/붙여넣기·수정 이력이 동작하는데, 여기에 다른 모양의 key가 끼면 헷갈리기 때문)
    if (!d.nameMemos || typeof d.nameMemos !== "object") d.nameMemos = {};
    // 사용자가 직접 켜고 끄는 "월별 잠금". 잠긴 달은 셀 클릭·일괄 붙여넣기·삭제·필요인력 입력 등
    // 데이터를 바꾸는 조작이 전부 막혀서 실수로 수정되는 걸 막아준다. 다시 버튼을 눌러 풀면 그대로 수정 가능.
    if (!d.monthLocks || typeof d.monthLocks !== "object") d.monthLocks = {};
    // 사용자가 직접 접어둔 열/행 상태(행 그룹, 열 그룹, 개별로 숨긴 날짜·정보열·인원·집계행).
    // 달(월)마다 날짜 개수·인원 구성이 달라지므로 달 단위("YYYY-MM")로 따로 저장해서,
    // 그 달을 다시 열면(다른 사람이 열어도) 접어뒀던 그대로 보이게 한다.
    if (!d.collapseByMonth || typeof d.collapseByMonth !== "object") d.collapseByMonth = {};
    // "AI 자동 배치"에서 쓰는 인원별 선호 오프 요일. { [staffId]: { dows: [0~6, ...] } } 형태(0=일 … 6=토).
    // 달과 상관없이 그 사람에게 계속 적용되는 설정이고, 반드시 지켜야 하는 조건이 아니라
    // "최대한 맞춰주는" 소프트 조건이다(필요인력·연속 근무 제한이 우선). 비어 있으면 키 자체를 두지 않는다.
    if (!d.autoOffPrefs || typeof d.autoOffPrefs !== "object") d.autoOffPrefs = {};
    if (!d.autoWorkPrefs || typeof d.autoWorkPrefs !== "object") d.autoWorkPrefs = {};
    return d;
  }
  // 특정 달의 접기 상태 저장 칸을 가져온다(없으면 빈 상태로 만들어서 돌려준다).
  function scheduleGetMonthCollapseState(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (!scheduleData.collapseByMonth) scheduleData.collapseByMonth = {};
    if (!scheduleData.collapseByMonth[key]) {
      scheduleData.collapseByMonth[key] = {
        collapsedRowGroups: [], colGroups: [], manualHiddenDays: [],
        manualHiddenStaffIds: [], manualHiddenInfoCols: [], manualHiddenSummaryRows: [],
        manualHiddenBatches: [], manualExcludedAggregateStaffIds: [],
      };
    }
    return scheduleData.collapseByMonth[key];
  }
  // 되돌리기(undo)로 스냅샷을 복원한 뒤 이 함수를 호출해 scheduleData를 다시 읽어들인다.
  function reloadScheduleData() {
    scheduleData = normalizeScheduleData(loadScheduleData());
    // 되돌리기(undo)나 다른 사람의 원격 변경으로 데이터를 다시 읽어들인 뒤에도,
    // 지금 보고 있는 달의 접기 상태를 최신 저장값으로 다시 맞춰준다.
    scheduleSyncUiCollapseFromData();
  }
  let scheduleData = normalizeScheduleData(loadScheduleData());

  // "YYYY-MM" 형태의 달 키. 과거 달을 고정(확정)하고 식별하는 데 쓴다.
  function scheduleMonthKey(year, monthIndex) { return `${year}-${pad2(monthIndex + 1)}`; }
  function scheduleCurrentMonthKey() { return scheduleMonthKey(today.getFullYear(), today.getMonth()); }
  // 실제 오늘 날짜 기준으로 이미 지나간 달인지 (이번 달·미래 달이면 false).
  // 지나간 달의 인원 스냅샷(staffHistory)을 고정할지 판단하는 용도로만 쓰인다.
  function scheduleIsMonthPast(year, monthIndex) {
    return scheduleMonthKey(year, monthIndex) < scheduleCurrentMonthKey();
  }
  // ----- 월별 "잠금" -----
  // 달이 지나서 확정되면 자동으로 잠기고, 사용자가 잠금 버튼으로 언제든 다시 풀거나 잠글 수 있다.
  // monthLocks[key] === true  → 사용자가 강제로 잠가둔 상태
  // monthLocks[key] === false → 사용자가 강제로 잠금을 풀어둔 상태(지나간 달이라도 수정 가능)
  // monthLocks[key]가 아예 없으면 → 지나간 달은 기본적으로 잠기고, 이번 달·미래 달은 기본적으로 풀려 있다.
  // 잠긴 달은 셀 클릭 편집, 일괄 붙여넣기, 일정 삭제, 필요인력 입력이 모두 막힌다.
  function scheduleIsMonthLocked(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (Object.prototype.hasOwnProperty.call(scheduleData.monthLocks, key)) {
      return !!scheduleData.monthLocks[key];
    }
    return scheduleIsMonthPast(year, monthIndex);
  }
  function scheduleToggleMonthLock(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    scheduleData.monthLocks[key] = !scheduleIsMonthLocked(year, monthIndex);
    saveScheduleData();
    renderApp();
  }
  // 지금 편집하려는 날짜(dateKey, "YYYY-MM-DD")가 속한 달이 잠겨 있는지 확인.
  function scheduleIsDateLocked(dateKey) {
    const parts = (dateKey || "").split("-");
    if (parts.length < 2) return false;
    return scheduleIsMonthLocked(Number(parts[0]), Number(parts[1]) - 1);
  }
  // 특정 달에 적용할 인원 목록을 반환한다.
  // - 이미 지나간(확정된) 달은 그 시점에 저장해둔 스냅샷(staffHistory)을 그대로 쓴다.
  //   스냅샷이 아직 없는 지난 달이라면(=이번에 처음 그 달이 과거가 된 경우) 지금 시점의
  //   인원 데이터로 스냅샷을 만들어 고정해버린다. 이후로는 "상담사 관리"에서 인원이
  //   바뀌어도 이 스냅샷은 절대 바뀌지 않는다.
  // - 이번 달과 미래 달은 "상담사 관리"의 실시간 데이터(scheduleData.staff)를 기반으로 쓰되,
  //   "보고 있는 달" 자체를 기준으로 퇴사 여부를 한 번 더 거른다. 퇴사일이 속한 달까지는
  //   명단에 남고, 그 다음 달부터는(실제 오늘 날짜와 상관없이, 미리 열어보는 미래 달이라도)
  //   명단에서 완전히 빠진다. (예: 9월 30일에 퇴사해도 9월 스케줄은 그대로 남고, 10월
  //   스케줄을 미리 열어봐도 그 사람은 더 이상 보이지 않는다)
  function getStaffListForMonth(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (scheduleData.staffHistory[key]) return scheduleData.staffHistory[key];
    if (scheduleIsMonthPast(year, monthIndex)) {
      scheduleData.staffHistory[key] = JSON.parse(JSON.stringify(scheduleData.staff));
      saveScheduleData();
      return scheduleData.staffHistory[key];
    }
    return scheduleData.staff.filter((s) => {
      if (!s.resignDate) return true;
      const resignMonthKey = s.resignDate.slice(0, 7); // "YYYY-MM"
      return resignMonthKey >= key;
    });
  }

  // 월별 스케줄의 인원 목록을 "상담사 관리"의 목록으로 자동 반영한다.
  // 이름/사번/입사일/근무시간/업무구분(채팅·유선)/조(주간·야간) 모두
  // 상담사 관리 쪽 값을 그대로 따라간다. 조는 스케줄 화면에서도 바로
  // 바꿀 수 있는데, 그 경우 "상담사 관리" 쪽 값도 함께 바뀌어 항상 서로 일치한다.
  function syncScheduleStaffFromAgents() {
    // 실제 오늘 날짜가 이전에 동기화했던 달을 지나 새 달로 넘어갔다면,
    // 그 이전 달은 이제 "지나간 달"이므로 지금까지의 실시간 인원 데이터를
    // 스냅샷으로 고정해서 남겨둔다. (해당 달을 아직 한 번도 안 열어봤어도
    // 여기서 바로 고정되므로, 나중에 상담사 관리에서 인원이 바뀌어도 안전하다)
    const currentMonthKey = scheduleCurrentMonthKey();
    if (scheduleData.lastSyncMonthKey && scheduleData.lastSyncMonthKey !== currentMonthKey) {
      if (!scheduleData.staffHistory[scheduleData.lastSyncMonthKey]) {
        scheduleData.staffHistory[scheduleData.lastSyncMonthKey] = JSON.parse(JSON.stringify(scheduleData.staff));
      }
    }
    scheduleData.lastSyncMonthKey = currentMonthKey;

    // 월별 스케줄에는 "근무중" 상태인 인원과, "퇴사" 처리됐어도 아직 퇴사일이
    // 속한 달까지는(그 달이 지나기 전까지는) 계속 반영한다. 실제 오늘 날짜가
    // 퇴사일이 속한 달을 완전히 지나야(다음 달이 되어야) 명단에서 빠진다.
    // (단, 이미 지나간 달에 대한 기록·스냅샷은 그대로 보존된다)
    scheduleData.staff = agentsData.filter((a) => {
      if (a.status !== "RESIGNED") return true;
      if (!a.resignDate) return false;
      const resignMonthKey = a.resignDate.slice(0, 7); // "YYYY-MM"
      return resignMonthKey >= currentMonthKey;
    }).map((a) => ({
      id: a.id,
      nickname: a.ldap || a.name,
      name: a.name,
      empNo: a.empNo,
      hireDate: a.hireDate,
      workHours: a.timezone,
      group: a.group === "night" ? "night" : "day",
      types: a.workTypes || [],
      isAdmin: !!a.isAdmin,
      // getStaffListForMonth에서 "보고 있는 달" 기준으로 퇴사 여부를 다시 거르는 데 쓰인다.
      // 재직 상태(status)가 아직 "근무중"이어도(=퇴사일자를 미래로 예약해둔 경우) 이 값은
      // 그대로 채워서, 월별 스케줄에는 예약한 순간 바로 반영되게 한다.
      resignDate: a.resignDate || null,
    }));
    // 기록(근무/오프/지각 등)을 지울 때는, 지금 "상담사 관리"에 없는 인원이라도
    // 지나간 달의 스냅샷에 남아있는 인원이면 그 달 기록은 지우지 않는다.
    // (지나간 달을 고정해두는 의미가 없어지지 않도록)
    const validIds = {};
    agentsData.forEach((a) => { validIds[a.id] = true; });
    Object.keys(scheduleData.staffHistory).forEach((mk) => {
      (scheduleData.staffHistory[mk] || []).forEach((s) => { validIds[s.id] = true; });
    });
    Object.keys(scheduleData.records).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) delete scheduleData.records[key];
    });
    Object.keys(scheduleData.memos).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) delete scheduleData.memos[key];
    });
    Object.keys(scheduleData.nameMemos || {}).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) delete scheduleData.nameMemos[key];
    });
  }

  function saveScheduleData() {
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(scheduleData)); flashScheduleStatus("저장됨"); }
    catch (e) { flashScheduleStatus("저장 실패"); }
  }

  // ----- 퇴사 처리 시 월별 스케줄 자동 반영 -----
  // "상담사 관리"에서 어떤 인원을 "퇴사"로 바꾸면, 입력한 퇴사일자 "다음 날"부터 그 달
  // 말일까지 월별 스케줄의 해당 인원 칸을 전부 "퇴사"로 자동 채운다(퇴사일 당일까지는
  // 마지막 근무일로 보고 그대로 둔다). 이미 손으로 다른 값을 넣어둔 칸이라도 퇴사
  // 처리 시점에는 더는 의미가 없으므로 덮어쓴다. 자동으로 채워진 칸도 잠금 처리는
  // 하지 않으므로, 필요하면 관리자가 다른 셀과 똑같이 클릭해서 다시 고칠 수 있다.
  // (퇴사일이 그 달의 말일이면 다음 날이 다음 달로 넘어가므로, 이 달에는 아무 칸도
  // 바뀌지 않고 그대로 유지된다 — 대신 다음 달 명단에서는 getStaffListForMonth가
  // 알아서 그 사람을 빼준다)
  function applyResignedScheduleFrom(staffId, resignDateStr) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(resignDateStr || "");
    if (!m) return;
    const year = Number(m[1]), monthIndex = Number(m[2]) - 1, startDay = Number(m[3]) + 1;
    // 다른 일괄 변경 기능들(붙여넣기/일괄삭제 등)과 마찬가지로, 퇴사일이 속한 달이
    // 잠겨 있으면(이미 확정된 지난 달 등) 자동 반영하지 않고 알려준다.
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("퇴사일이 속한 달이 잠겨 있어 스케줄에 자동 반영되지 않았어요.");
      return;
    }
    // 다른 일괄 변경 기능들처럼 되돌리기(undo) 스택에도 남겨서, 실수로 반영됐을 때
    // 관리자가 "되돌리기"로 바로 취소할 수 있게 한다.
    recordUndo("퇴사 처리 자동 반영", SCHEDULE_KEY, reloadScheduleData);
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    for (let day = startDay; day <= daysInMonth; day++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, day));
      scheduleData.records[key] = { status: "RESIGNED", attendance: null };
    }
    saveScheduleData();
  }
  // 퇴사 처리를 취소(다시 "근무중"으로)하거나 퇴사일자를 다른 날짜로 고칠 때,
  // 예전 퇴사일자부터 채워뒀던 "퇴사" 칸을 지운다. 그사이 관리자가 개별 셀에서
  // 손으로 다른 값으로 바꿔둔 칸까지 지우지 않도록, 지금 값이 여전히 "퇴사"인
  // 칸만 지운다(지우면 기본값인 "근무"로 되돌아간다).
  function clearResignedScheduleFrom(staffId, resignDateStr) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(resignDateStr || "");
    if (!m) return;
    const year = Number(m[1]), monthIndex = Number(m[2]) - 1, startDay = Number(m[3]) + 1;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let changed = false;
    for (let day = startDay; day <= daysInMonth; day++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, day));
      if (scheduleData.records[key] && scheduleData.records[key].status === "RESIGNED") changed = true;
    }
    if (!changed) return; // 지울 게 없으면 undo 스택도 더럽히지 않는다
    recordUndo("퇴사 취소로 스케줄 되돌리기", SCHEDULE_KEY, reloadScheduleData);
    for (let day = startDay; day <= daysInMonth; day++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, day));
      if (scheduleData.records[key] && scheduleData.records[key].status === "RESIGNED") {
        delete scheduleData.records[key];
      }
    }
    saveScheduleData();
  }

  let scheduleStatusTimer = null;
  // ms: 메시지를 보여줄 시간(생략하면 1.2초). 복사/붙여넣기 결과처럼 읽을 내용이 긴 안내만 더 길게 준다.
  function flashScheduleStatus(msg, ms) {
    const el = document.getElementById("schedule-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(scheduleStatusTimer);
    scheduleStatusTimer = setTimeout(() => { el.textContent = ""; }, ms || 1200);
  }

  const scheduleUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
    collapsedRowGroups: new Set(), // 접힌 행 그룹(관리자/주간/야간/채팅/유선 등)의 키 모음
    colGroups: [], // 사용자가 지정한 열(날짜) 그룹: { id, start, end, collapsed }
    manualHiddenDays: new Set(), // 열 머리글을 직접 선택해서 접은 날짜(일자 숫자) 모음
    manualHiddenStaffIds: new Set(), // 인원 이름칸을 직접 선택해서 접은 staffId 모음
    manualHiddenInfoCols: new Set(), // 직접 선택해서 접은 인원 정보 열(닉네임~결근) 키 모음
    manualHiddenSummaryRows: new Set(), // 직접 선택해서 접은 집계행(관리자 인원/필요인력/대비 등) 키 모음
    // 인원 정보 칸·인원·집계행을 "한 번에 여러 개 선택해서 접었을 때" 그 묶음을 기억해두는 목록.
    // { id, infoCols: [key,...], staffIds: [id,...], summaryRows: [key,...] } 형태.
    // "숨긴 열/행" 패널에서 같이 접은 항목들을 한 덩어리로 보여주고, 버튼 하나로 한 번에
    // 펼칠 수 있게 하려는 용도다(날짜는 연속 여부로 자동 판단하므로 여기 포함 안 함).
    manualHiddenBatches: [],
    // 우클릭 메뉴에서 "집계 제외"로 표시한 staffId 모음. 행 자체는 그대로 표시하되
    // (구분만 가능할 정도로 옅은 회색으로 칠해서) 유선/채팅 인원·필요인력 대비·총 인원 등
    // 집계 행 계산에서는 빼준다. 달마다 따로 저장한다(manualHiddenStaffIds와 같은 방식).
    manualExcludedAggregateStaffIds: new Set(),
    searchQuery: "", // 상담사 검색어. 쉼표(,)로 여러 명을 한 번에 검색할 수 있다.
  };

  // 지금 보고 있는 달(scheduleUi.year/monthIndex)의 접기 상태를 scheduleData.collapseByMonth에
  // 그대로 옮겨 담고 saveScheduleData()로 저장한다. saveScheduleData()가 localStorage에
  // 쓰는 순간 클라우드(Supabase)에도 함께 올라가므로, 접어둔 열/행이 다른 사람 화면에도
  // 그대로 보이고 새로고침해도 유지된다. 열/행을 접거나 펼치는 모든 동작 뒤에 호출한다.

  // 07a2-schedule-ui-state.js — 접기 상태, 검색, 행/열 그룹, 헤더 선택, 숨김 메뉴, 일괄 붙여넣기
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleSaveCollapseState() {
    const state = scheduleGetMonthCollapseState(scheduleUi.year, scheduleUi.monthIndex);
    state.collapsedRowGroups = Array.from(scheduleUi.collapsedRowGroups);
    state.colGroups = scheduleUi.colGroups.map((g) => ({ ...g }));
    state.manualHiddenDays = Array.from(scheduleUi.manualHiddenDays);
    state.manualHiddenStaffIds = Array.from(scheduleUi.manualHiddenStaffIds);
    state.manualHiddenInfoCols = Array.from(scheduleUi.manualHiddenInfoCols);
    state.manualHiddenSummaryRows = Array.from(scheduleUi.manualHiddenSummaryRows);
    state.manualHiddenBatches = scheduleUi.manualHiddenBatches.map((b) => ({ ...b }));
    state.manualExcludedAggregateStaffIds = Array.from(scheduleUi.manualExcludedAggregateStaffIds);
    saveScheduleData();
  }
  // scheduleData.collapseByMonth에 저장돼 있던(=서버에서 불러온) 지금 달의 접기 상태를
  // 화면이 실제로 쓰는 scheduleUi로 되살린다. 페이지를 처음 열었을 때, 달을 이동했을 때,
  // 되돌리기(undo)나 다른 사람의 원격 변경으로 scheduleData를 다시 읽어들였을 때 호출한다.
  function scheduleSyncUiCollapseFromData() {
    const state = scheduleGetMonthCollapseState(scheduleUi.year, scheduleUi.monthIndex);
    scheduleUi.collapsedRowGroups = new Set(state.collapsedRowGroups || []);
    scheduleUi.colGroups = (state.colGroups || []).map((g) => ({ ...g }));
    scheduleUi.manualHiddenDays = new Set(state.manualHiddenDays || []);
    scheduleUi.manualHiddenStaffIds = new Set(state.manualHiddenStaffIds || []);
    scheduleUi.manualHiddenInfoCols = new Set(state.manualHiddenInfoCols || []);
    scheduleUi.manualHiddenSummaryRows = new Set(state.manualHiddenSummaryRows || []);
    scheduleUi.manualHiddenBatches = (state.manualHiddenBatches || []).map((b) => ({ ...b }));
    scheduleUi.manualExcludedAggregateStaffIds = new Set(state.manualExcludedAggregateStaffIds || []);
  }
  // 페이지가 처음 로드될 때, 지금 보고 있는 달(기본은 이번 달)에 저장돼 있던 접기 상태를
  // 곧바로 불러와둔다.
  scheduleSyncUiCollapseFromData();

  // ----- 상담사 검색 -----
  // "상담사 관리"·"면담 관리"와 같은 방식: 이름/닉네임(LDAP)/사번 일부만 입력해도 찾고,
  // 초성만 입력해도 찾는다("ㅎㄱㅇ" → "홍길동"). "주간"/"야간"/"채팅"/"유선" 키워드를 입력하면
  // 그 조건에 해당하는 인원이 모두 걸린다. 쉼표(,)로 여러 조건을 구분해서 입력하면
  // 그 중 하나라도 일치하는 인원을 모두 보여준다(이름+키워드를 섞어도 됨. 예: "홍길동,야간").
  // 이름/닉네임/사번/초성 외에, "주간"/"야간"/"채팅"/"유선" 근무 형태 키워드로도 검색할 수 있게 한다.
  const SCHEDULE_SEARCH_KEYWORD_MATCHERS = {
    "주간": (s) => s.group !== "night",
    "야간": (s) => s.group === "night",
    "채팅": (s) => (s.types || []).indexOf("채팅") !== -1,
    "유선": (s) => (s.types || []).indexOf("유선") !== -1,
  };
  function scheduleStaffMatchesSearchTerm(s, needle) {
    if (!needle) return true;
    if ((s.name || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((s.nickname || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((s.empNo || "").toLowerCase().indexOf(needle) !== -1) return true;
    if (getChosungString(s.name || "").indexOf(needle) !== -1) return true;
    if (getChosungString(s.nickname || "").indexOf(needle) !== -1) return true;
    const keywordFn = SCHEDULE_SEARCH_KEYWORD_MATCHERS[needle];
    if (keywordFn && keywordFn(s)) return true;
    // 사용자가 추가한 업무 구분 이름도 검색어로 쓸 수 있게 한다(대소문자 무시).
    if (customWorkTypes.some((t) => t.toLowerCase() === needle && (s.types || []).indexOf(t) !== -1)) return true;
    return false;
  }
  function scheduleStaffMatchesSearch(s, query) {
    const terms = (query || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.some((t) => scheduleStaffMatchesSearchTerm(s, t));
  }

  // ----- 월별 스케줄 표: 행(인원 그룹)·열(날짜) 접기/펼치기 -----
  // 행 그룹 키는 "필터모드::그룹이름" 형태로 만들어서, 전체보기/주간보기/야간보기 등
  // 화면마다 접힌 상태가 서로 섞이지 않게 한다.
  function scheduleRowGroupKey(filterMode, name) { return `${filterMode || "ALL"}::${name}`; }
  // "숨긴 항목" 패널에서 행 key를 사람이 읽기 좋은 한글로 대충 바꿔서 보여준다.
  // (완벽히 다듬어진 문구는 아니지만, 어떤 행인지 알아볼 수 있는 정도면 충분하다.)
  function schedulePrettyRowKey(key) {
    const map = {
      ADMIN: "관리자", DAY: "주간", NIGHT: "야간", CHAT: "채팅", VOICE: "유선",
      ETC: "업무 구분 미지정", DAY_TYPED: "주간", NIGHT_TYPED: "야간", total: "합계", ALL: null,
    };
    return key.split(/::|·/).filter(Boolean).map((seg) => (seg in map ? map[seg] : seg)).filter(Boolean).join(" · ") || key;
  }
  function scheduleIsRowGroupCollapsed(key) { return scheduleUi.collapsedRowGroups.has(key); }
  function scheduleToggleRowGroup(key) {
    if (scheduleUi.collapsedRowGroups.has(key)) scheduleUi.collapsedRowGroups.delete(key);
    else scheduleUi.collapsedRowGroups.add(key);
    scheduleSaveCollapseState();
    renderApp();
  }

  function scheduleAddColGroup(start, end) {
    const s = Math.min(start, end), e = Math.max(start, end);
    scheduleUi.colGroups.push({ id: `cg${Date.now()}${Math.random().toString(36).slice(2, 6)}`, start: s, end: e, collapsed: true });
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleRemoveColGroup(id) {
    scheduleUi.colGroups = scheduleUi.colGroups.filter((g) => g.id !== id);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleToggleColGroup(id) {
    const g = scheduleUi.colGroups.find((g) => g.id === id);
    if (g) g.collapsed = !g.collapsed;
    scheduleSaveCollapseState();
    renderApp();
  }
  // "숨긴 열/행" 버튼 옆에 표시할 개수: 열 그룹(접힌 것) + 개별로 숨긴 열·행을 모두 합친다.
  function scheduleHiddenCount() {
    const collapsedColGroups = (scheduleUi.colGroups || []).filter((g) => g.collapsed).length;
    return collapsedColGroups + scheduleUi.manualHiddenDays.size + scheduleUi.manualHiddenInfoCols.size
      + scheduleUi.manualHiddenStaffIds.size + scheduleUi.manualHiddenSummaryRows.size;
  }
  // 이번 달 기준으로, 접혀 있는 열 그룹 + 개별로 접은 날짜들을 합쳐 돌려준다.
  function scheduleCollapsedDaySet() {
    const set = new Set(scheduleUi.manualHiddenDays);
    (scheduleUi.colGroups || []).forEach((g) => {
      if (!g.collapsed) return;
      for (let d = g.start; d <= g.end; d++) set.add(d);
    });
    return set;
  }

  // ----- 표에서 열 머리글(날짜)·행 머리글(닉네임 칸)을 직접 클릭해서 선택 → 오른쪽 클릭으로 접기 -----
  // 열 그룹(범위 지정)이나 행 그룹(관리자/주간/야간 등 미리 정해진 묶음) 접기와는 별개로,
  // 표를 보다가 필요없는 날짜 몇 개·인원 몇 명만 바로 골라서 접을 수 있게 해준다.
  // 클릭할 때마다 선택 상태가 토글되고(다시 누르면 선택 해제), 헤더가 아닌 곳을 클릭하면
  // 선택이 전부 풀린다. 선택된 상태에서 오른쪽 마우스를 누르면 "접기" 메뉴가 뜬다.
  let scheduleHeaderSelCols = new Set(); // 선택된 열의 key. 날짜 열은 "d:3", 인원정보 열은 "i:empno" 형태
  let scheduleHeaderSelRows = new Set(); // 선택된 staffId(행)
  let scheduleHiddenPanelOpen = false; // "숨긴 열/행" 패널(열 그룹 관리 + 접은 열·행을 다시 펼치는 곳) 열림 여부

  function scheduleApplyHeaderSelectionHighlight() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    root.querySelectorAll(".sch-col-th").forEach((th) => {
      th.classList.toggle("sch-th--selected", scheduleHeaderSelCols.has(th.getAttribute("data-col-key")));
    });
    root.querySelectorAll(".sch-row-th").forEach((td) => {
      td.classList.toggle("sch-th--selected", scheduleHeaderSelRows.has(td.getAttribute("data-row-key")));
    });
  }
  function scheduleClearHeaderSelection() {
    if (scheduleHeaderSelCols.size === 0 && scheduleHeaderSelRows.size === 0) return;
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    scheduleApplyHeaderSelectionHighlight();
  }
  function scheduleToggleColSelection(colKey) {
    if (scheduleHeaderSelCols.has(colKey)) scheduleHeaderSelCols.delete(colKey);
    else scheduleHeaderSelCols.add(colKey);
    scheduleApplyHeaderSelectionHighlight();
  }
  function scheduleToggleRowSelection(rowKey) {
    if (scheduleHeaderSelRows.has(rowKey)) scheduleHeaderSelRows.delete(rowKey);
    else scheduleHeaderSelRows.add(rowKey);
    scheduleApplyHeaderSelectionHighlight();
  }
  // ----- 머리글을 드래그해서 여러 열·행을 한 번에 선택 → 손을 떼면 접기 메뉴 -----
  // 하나씩 클릭해서 고르던 것을 마우스로 쭉 끌어서 범위째 고를 수 있게 한다.
  //  - 날짜 머리글(09/03 ~ 09/06)을 가로로 끌면 그 사이의 날짜 열이 전부 선택된다.
  //  - 닉네임·이름 같은 인원 정보 머리글을 가로로 끌면 그 사이의 정보 열이 선택된다.
  //  - 왼쪽 인원 정보 칸(이름 등)을 세로로 끌면 그 사이의 행(인원·집계행·그룹 제목 행)이 선택된다.
  // 끌다가 손을 떼면 클릭·우클릭했을 때와 똑같은 "접기 / 선택 해제" 메뉴가 그 자리에 뜬다.
  // 끌지 않고 그냥 클릭하면 예전처럼 그 머리글 하나만 선택/해제된다.
  // 그냥 끌면 기존 선택을 새 범위로 바꾸고, Ctrl(⌘)/Shift를 누른 채 끌면 기존 선택에 더한다.
  // 화면에 안 보이는(이미 접힌) 열·행은 범위에서 빠진다. 열은 날짜끼리, 정보 열끼리만 이어진다
  // (날짜에서 시작해 정보 열로 넘어가는 식의 섞인 범위는 만들지 않는다).
  let scheduleHeaderDrag = null; // { kind: "col"|"row", anchor, current, moved, baseCols, baseRows }
  let scheduleHeaderDragSuppressClick = false; // 드래그를 끝낸 직후 따라오는 click이 선택을 되돌리지 않게 막는 표시

  // orderedKeys(화면 순서대로 나열한 key 목록)에서 aKey~bKey 사이(양 끝 포함)를 돌려준다.
  // 둘 중 하나라도 목록에 없으면(접혀 있거나 종류가 다르면) 빈 배열.
  function scheduleRangeBetween(orderedKeys, aKey, bKey) {
    const a = orderedKeys.indexOf(aKey);
    const b = orderedKeys.indexOf(bKey);
    if (a === -1 || b === -1) return [];
    return orderedKeys.slice(Math.min(a, b), Math.max(a, b) + 1);
  }
  // 지금 화면에 보이는 열 key를 왼쪽부터 순서대로. prefix가 "d:"면 날짜 열, "i:"면 인원 정보 열.
  function scheduleVisibleColKeys(prefix) {
    if (prefix === "d:") {
      const numDays = scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex);
      const hidden = scheduleCollapsedDaySet();
      const keys = [];
      for (let d = 1; d <= numDays; d++) if (!hidden.has(d)) keys.push(`d:${d}`);
      return keys;
    }
    return SCHEDULE_INFO_COLS.filter((c) => !scheduleUi.manualHiddenInfoCols.has(c.key)).map((c) => `i:${c.key}`);
  }
  // 지금 화면에 보이는 행 key("s:인원id" 또는 "r:행고유키")를 위에서부터 순서대로.
  function scheduleVisibleRowKeys(root) {
    const keys = [];
    root.querySelectorAll("tr").forEach((tr) => {
      if (tr.classList.contains("sch-row-hidden")) return;
      const td = tr.querySelector("[data-row-key]");
      if (td) keys.push(td.getAttribute("data-row-key"));
    });
    return keys;
  }
  function scheduleHeaderDragStart(kind, key, e) {
    if (e.button !== 0 || !key) return;
    const additive = e.ctrlKey || e.metaKey || e.shiftKey;
    scheduleHeaderDrag = {
      kind, anchor: key, current: key, moved: false,
      baseCols: additive ? new Set(scheduleHeaderSelCols) : new Set(),
      baseRows: additive ? new Set(scheduleHeaderSelRows) : new Set(),
    };
  }
  // 표 위에서 마우스가 움직일 때마다 호출된다(드래그 중일 때만 동작). 열 드래그는 머리글이나 날짜 칸,
  // 행 드래그는 어느 칸이든 그 칸이 속한 행 위에 있으면 그 위치까지 범위를 늘린다.
  function scheduleHeaderDragOver(e) {
    const d = scheduleHeaderDrag;
    if (!d) return;
    if (!(e.buttons & 1)) { scheduleHeaderDrag = null; return; } // 창 밖에서 버튼을 뗐다면 드래그 종료로 본다
    const root = document.getElementById("schedule-table-area");
    if (!root || !e.target || !e.target.closest) return;
    let key = null;
    if (d.kind === "row") {
      const tr = e.target.closest("tr");
      const td = tr && !tr.classList.contains("sch-row-hidden") ? tr.querySelector("[data-row-key]") : null;
      key = td ? td.getAttribute("data-row-key") : null;
    } else {
      const el = e.target.closest("[data-col-key], td[data-day]");
      if (el) key = el.getAttribute("data-col-key") || `d:${el.getAttribute("data-day")}`;
      if (key && key.slice(0, 2) !== d.anchor.slice(0, 2)) key = null; // 날짜↔정보 열은 이어 붙이지 않음
    }
    if (!key || key === d.current) return;
    d.current = key;
    d.moved = true;
    const range = d.kind === "row"
      ? scheduleRangeBetween(scheduleVisibleRowKeys(root), d.anchor, d.current)
      : scheduleRangeBetween(scheduleVisibleColKeys(d.anchor.slice(0, 2)), d.anchor, d.current);
    scheduleHeaderSelCols = new Set(d.baseCols);
    scheduleHeaderSelRows = new Set(d.baseRows);
    range.forEach((k) => (d.kind === "row" ? scheduleHeaderSelRows : scheduleHeaderSelCols).add(k));
    scheduleApplyHeaderSelectionHighlight(); // 끄는 동안 선택될 범위가 실시간으로 하이라이트된다
  }
  function scheduleHeaderDragEnd(e) {
    const d = scheduleHeaderDrag;
    scheduleHeaderDrag = null;
    if (!d || !d.moved) return; // 안 끌었으면 기존 click 동작(그 머리글 하나 선택/해제)에 맡긴다
    // 손을 뗀 직후 브라우저가 보내는 click이 "헤더가 아닌 곳 클릭 = 선택 해제"로 처리돼서
    // 방금 고른 범위를 지워버리지 않도록, click이 지나갈 때까지만 표시를 켜둔다.
    scheduleHeaderDragSuppressClick = true;
    setTimeout(() => { scheduleHeaderDragSuppressClick = false; }, 0);
    if (scheduleHeaderSelCols.size + scheduleHeaderSelRows.size === 0) return;
    openScheduleHideMenu(e);
  }
  function scheduleHeaderDragJustEnded() { return scheduleHeaderDragSuppressClick; }
  document.addEventListener("mouseup", scheduleHeaderDragEnd);

  // 드래그(또는 클릭)로 고른 열·행 선택은 머리글도, 접기 메뉴도 아닌 곳을 누르면 풀린다.
  // 표 안의 다른 칸뿐 아니라 표 밖(빈 배경, 상단 버튼, 다른 영역 등)을 눌러도 마찬가지다.
  // click이 아니라 pointerdown을 쓰는 이유: 마우스와 터치(태블릿·모바일)를 한 번에 받고,
  // 터치에서는 빈 곳을 눌러도 click이 안 오는 경우가 있기 때문이다.
  // 머리글(다시 클릭해서 선택을 바꾸거나 우클릭 메뉴를 여는 동작)과 접기 메뉴(#sch-menu) 위에서는
  // 풀지 않는다 — 풀어버리면 "접기" 버튼을 누르기도 전에 선택이 사라진다.
  document.addEventListener("pointerdown", (e) => {
    if (scheduleHeaderSelCols.size + scheduleHeaderSelRows.size === 0) return;
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest(".sch-col-th, .sch-row-th, #sch-menu")) return;
    scheduleClearHeaderSelection();
  }, true);

  // 오른쪽 클릭으로 바로 접기 메뉴를 연다. 우클릭한 헤더가 지금 선택 목록에 없으면
  // (다른 걸 선택해둔 채 엉뚱한 헤더를 우클릭한 경우 등) 그 헤더 하나만 선택한 것으로
  // 다시 잡아준다. 이미 선택된 헤더를 우클릭하면 지금까지 골라둔 선택을 그대로 유지한다.
  function scheduleHeaderRightClick(el, e) {
    e.preventDefault();
    e.stopPropagation();
    const isCol = el.classList.contains("sch-col-th");
    if (isCol) {
      const colKey = el.getAttribute("data-col-key");
      if (!scheduleHeaderSelCols.has(colKey)) {
        scheduleHeaderSelCols = new Set([colKey]);
        scheduleHeaderSelRows = new Set();
      }
    } else {
      const rowKey = el.getAttribute("data-row-key");
      if (!scheduleHeaderSelRows.has(rowKey)) {
        scheduleHeaderSelRows = new Set([rowKey]);
        scheduleHeaderSelCols = new Set();
      }
    }
    scheduleApplyHeaderSelectionHighlight();
    // 인원 행의 "이름" 칸을 우클릭한 경우에는 접기 메뉴에 그 인원의 이름 메모 항목도 함께 보여준다.
    // (열 머리글이나 그룹/집계 행 머리글에는 sch-col-name 클래스가 없으므로 해당 없음)
    const nameMemoStaffId = (!isCol && el.classList.contains("sch-col-name")) ? (el.getAttribute("data-staff-id") || null) : null;
    openScheduleHideMenu(e, nameMemoStaffId);
  }
  // 선택된 열·행을 실제로 접는다(=목록에 추가). 데이터 자체는 그대로 두고 화면에서만 숨긴다.
  // 행 key는 인원이면 "s:staffId", 집계행(관리자 인원/필요인력/대비 등)이면 "r:행고유키" 형태.
  function scheduleCollapseHeaderSelection() {
    const n = scheduleHeaderSelCols.size + scheduleHeaderSelRows.size;
    const batchInfoCols = [];
    const batchStaffIds = [];
    const batchSummaryRows = [];
    scheduleHeaderSelCols.forEach((k) => {
      if (k.startsWith("d:")) scheduleUi.manualHiddenDays.add(Number(k.slice(2)));
      else if (k.startsWith("i:")) { const key = k.slice(2); scheduleUi.manualHiddenInfoCols.add(key); batchInfoCols.push(key); }
    });
    scheduleHeaderSelRows.forEach((k) => {
      if (k.startsWith("s:")) { const id = k.slice(2); scheduleUi.manualHiddenStaffIds.add(id); batchStaffIds.push(id); }
      else if (k.startsWith("r:")) { const key = k.slice(2); scheduleUi.manualHiddenSummaryRows.add(key); batchSummaryRows.push(key); }
    });
    // 날짜 외에(정보 칸·인원·집계행 중 하나라도) 같이 접은 게 있으면, "숨긴 열/행" 패널에서
    // 한 덩어리로 묶어서 보여주고 한 번에 펼칠 수 있도록 이번에 접은 조합을 기록해둔다.
    if (batchInfoCols.length || batchStaffIds.length || batchSummaryRows.length) {
      scheduleUi.manualHiddenBatches.push({
        id: `hb${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
        infoCols: batchInfoCols, staffIds: batchStaffIds, summaryRows: batchSummaryRows,
      });
    }
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    closeScheduleMenu();
    scheduleSaveCollapseState();
    renderApp();
    flashScheduleStatus(`${n}개 접었어요.`);
  }
  // 배치(한 번에 같이 접은 정보 칸·인원·집계행 묶음)를 한 번에 펼친다.
  function scheduleUnhideBatch(batchId) {
    const batch = scheduleUi.manualHiddenBatches.find((b) => b.id === batchId);
    if (!batch) return;
    (batch.infoCols || []).forEach((key) => scheduleUi.manualHiddenInfoCols.delete(key));
    (batch.staffIds || []).forEach((id) => scheduleUi.manualHiddenStaffIds.delete(id));
    (batch.summaryRows || []).forEach((key) => scheduleUi.manualHiddenSummaryRows.delete(key));
    scheduleUi.manualHiddenBatches = scheduleUi.manualHiddenBatches.filter((b) => b.id !== batchId);
    scheduleSaveCollapseState();
    renderApp();
  }
  // 배치 목록에서, 이미 다른 경로로 펼쳐졌거나(개별 펼치기) 지워진 항목은 걸러내고
  // 실제로 아직 숨겨져 있는 항목만 남긴 배치를 돌려준다. 빈 배치는 통째로 제외한다.
  function scheduleEffectiveHiddenBatches() {
    return scheduleUi.manualHiddenBatches
      .map((b) => ({
        id: b.id,
        infoCols: (b.infoCols || []).filter((key) => scheduleUi.manualHiddenInfoCols.has(key)),
        staffIds: (b.staffIds || []).filter((id) => scheduleUi.manualHiddenStaffIds.has(id)),
        summaryRows: (b.summaryRows || []).filter((key) => scheduleUi.manualHiddenSummaryRows.has(key)),
      }))
      .filter((b) => b.infoCols.length + b.staffIds.length + b.summaryRows.length > 1); // 1개짜리는 기존 개별 칩으로 표시
  }
  // memoStaffId: 이름 칸을 우클릭해서 열었을 때 그 인원의 id. 있으면 "메모 추가/수정/삭제" 항목을 함께 보여준다.
  // 다만 그 인원 행 하나만 선택된 상태일 때만 보여준다 — 여러 행·열을 골라 놓고 우클릭했다면
  // 목적이 "한꺼번에 접기"이고, 메모는 어느 인원 것인지 애매해지기 때문이다.
  function openScheduleHideMenu(e, memoStaffId) {
    closeScheduleMenu();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    const labelParts = [];
    if (scheduleHeaderSelCols.size > 0) labelParts.push(`열 ${scheduleHeaderSelCols.size}개`);
    if (scheduleHeaderSelRows.size > 0) labelParts.push(`행 ${scheduleHeaderSelRows.size}개`);
    const showNameMemo = !!memoStaffId && scheduleHeaderSelCols.size === 0
      && scheduleHeaderSelRows.size === 1 && scheduleHeaderSelRows.has(`s:${memoStaffId}`);
    // 인원 행 하나만 선택된 상태로 우클릭했으면(이름 칸이 아니어도 됨) "집계 제외" 토글 버튼을 보여준다.
    const singleRowKey = (scheduleHeaderSelCols.size === 0 && scheduleHeaderSelRows.size === 1)
      ? Array.from(scheduleHeaderSelRows)[0] : null;
    const aggregateExcludeStaffId = (singleRowKey && singleRowKey.startsWith("s:")) ? singleRowKey.slice(2) : null;
    let aggregateExcludeHtml = "";
    if (aggregateExcludeStaffId) {
      const excluded = scheduleIsAggregateExcluded(aggregateExcludeStaffId);
      aggregateExcludeHtml = `<button type="button" data-toggle-aggregate-exclude="${esc(aggregateExcludeStaffId)}">${excluded ? "집계 제외 해제" : "집계 제외"}</button>`;
    }
    let memoHtml = "";
    if (showNameMemo) {
      const { year, monthIndex } = scheduleUi;
      const hasMemo = !!getScheduleNameMemo(memoStaffId, year, monthIndex);
      if (scheduleIsMonthLocked(year, monthIndex)) {
        // 잠긴 달은 수정은 막되, 이미 남겨둔 메모는 읽을 수 있게 한다(모바일엔 마우스 툴팁이 없으므로).
        if (hasMemo) memoHtml = `<button type="button" data-name-memo="1">${ICON_NOTE || ""} 메모 보기</button>`;
      } else {
        memoHtml = `<button type="button" data-name-memo="1">${ICON_NOTE || ""} ${hasMemo ? "메모 수정" : "메모 추가"}</button>`
          + (hasMemo ? `<button type="button" class="sch-menu-danger" data-name-memo-delete="1">${ICON_TRASH || ""} 메모 삭제</button>` : "");
      }
      if (memoHtml) memoHtml += `<div class="sch-menu-divider"></div>`;
    }
    menu.innerHTML = `<div class="sch-menu-title">${labelParts.join(" · ")} 선택됨</div>` +
      memoHtml +
      aggregateExcludeHtml +
      `<button type="button" data-collapse-header-sel="1">접기</button>` +
      `<button type="button" class="sch-menu-reset" data-clear-header-sel="1">선택 해제</button>`;
    document.body.appendChild(menu);
    const clientX = e ? e.clientX : window.innerWidth / 2;
    const clientY = e ? e.clientY : window.innerHeight / 2;
    const top = Math.min(clientY + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(clientX, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelector("[data-collapse-header-sel]").onclick = () => scheduleCollapseHeaderSelection();
    // 메모 항목을 고르면 우클릭하면서 잡혔던 행 선택은 풀어준다(메모를 다 남긴 뒤에도 그 행이
    // 계속 선택된 채로 남아 있으면 헷갈리므로).
    const nameMemoBtn = menu.querySelector("[data-name-memo]");
    if (nameMemoBtn) {
      nameMemoBtn.onclick = () => {
        closeScheduleMenu();
        scheduleClearHeaderSelection();
        openScheduleNameMemoModal(memoStaffId);
      };
    }
    const nameMemoDeleteBtn = menu.querySelector("[data-name-memo-delete]");
    if (nameMemoDeleteBtn) {
      nameMemoDeleteBtn.onclick = () => {
        closeScheduleMenu();
        scheduleClearHeaderSelection();
        setScheduleNameMemo(memoStaffId, scheduleUi.year, scheduleUi.monthIndex, "");
        updateScheduleTableArea();
      };
    }
    const aggregateExcludeBtn = menu.querySelector("[data-toggle-aggregate-exclude]");
    if (aggregateExcludeBtn) {
      aggregateExcludeBtn.onclick = () => {
        closeScheduleMenu();
        scheduleClearHeaderSelection();
        scheduleToggleAggregateExclusion(aggregateExcludeStaffId);
      };
    }
    const clearBtn = menu.querySelector("[data-clear-header-sel]");
    clearBtn.onclick = () => { closeScheduleMenu(); scheduleClearHeaderSelection(); };
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }
  // 개별로 접어둔 날짜/인원정보열/인원/집계행을 다시 펼친다.
  // 연속된 날짜 구간(start~end)을 한 번에 펼친다. "숨긴 열/행" 패널에서 여러 날짜를
  // 한 번에 접었을 때 하나로 묶여 보이는 범위 칩의 "펼치기" 버튼에서 쓰인다.
  function scheduleUnhideDayRange(start, end) {
    for (let d = start; d <= end; d++) scheduleUi.manualHiddenDays.delete(d);
    scheduleSaveCollapseState();
    renderApp();
  }
  // 접혀 있는 날짜들을 정렬한 뒤, 연속된(바로 다음날) 구간끼리 묶어서
  // [{start, end}, ...] 형태로 돌려준다. 예: [11,12,13,15] → [{11,13},{15,15}]
  // 여러 날짜를 한 번에 선택해서 접으면 "09/11~09/13" 처럼 범위 하나로 보여주고,
  // 그 범위를 한 번에 펼칠 수 있게 하기 위함이다.
  function scheduleGroupConsecutiveDays(days) {
    const sorted = Array.from(days).sort((a, b) => a - b);
    const ranges = [];
    for (const d of sorted) {
      const last = ranges[ranges.length - 1];
      if (last && d === last.end + 1) last.end = d;
      else ranges.push({ start: d, end: d });
    }
    return ranges;
  }
  function scheduleUnhideInfoCol(key) {
    scheduleUi.manualHiddenInfoCols.delete(key);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleUnhideSummaryRow(key) {
    scheduleUi.manualHiddenSummaryRows.delete(key);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleUnhideStaff(staffId) {
    scheduleUi.manualHiddenStaffIds.delete(staffId);
    scheduleSaveCollapseState();
    renderApp();
  }
  // ----- 인원 행 "집계 제외" -----
  // 행은 그대로 표에 남겨두되(구분만 가능할 정도로 옅은 회색으로 칠함), 유선/채팅 인원·필요인력
  // 대비·총 인원 등 집계 행 계산에서는 그 인원을 빼준다. 휴직 등으로 잠깐 빠지는 인원을
  // 표에서 아예 숨기지 않고도 집계에서만 제외하고 싶을 때 쓴다. 다시 우클릭하면 풀 수 있다.
  function scheduleIsAggregateExcluded(staffId) { return scheduleUi.manualExcludedAggregateStaffIds.has(staffId); }
  function scheduleSetAggregateExcluded(staffId, excluded) {
    if (excluded) scheduleUi.manualExcludedAggregateStaffIds.add(staffId);
    else scheduleUi.manualExcludedAggregateStaffIds.delete(staffId);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleToggleAggregateExclusion(staffId) {
    scheduleSetAggregateExcluded(staffId, !scheduleIsAggregateExcluded(staffId));
  }
  function scheduleUnhideAll() {
    scheduleUi.manualHiddenDays = new Set();
    scheduleUi.manualHiddenInfoCols = new Set();
    scheduleUi.manualHiddenStaffIds = new Set();
    scheduleUi.manualHiddenSummaryRows = new Set();
    scheduleUi.manualHiddenBatches = [];
    scheduleUi.collapsedRowGroups = new Set();
    scheduleUi.colGroups = [];
    scheduleSaveCollapseState();
    renderApp();
  }

  // ----- 월별 스케줄 일괄 붙여넣기 -----
  // "이름 [공백] 1일값 [공백] 2일값 ... [공백] 말일값" 형태의 한 줄짜리 텍스트를
  // (엑셀 등에서 복사해온) 여러 줄 붙여넣으면, 이름으로 인원을 찾아 그 달 1일부터
  // 순서대로 각 칸의 상태를 반영해준다. 공백(스페이스·탭 모두)이 나올 때마다
  // 다음 날짜로 넘어간다고 보고 값을 나눈다.
  let scheduleBulkPasteOpen = false;
  let scheduleBulkPasteMsg = "";

  // 붙여넣기 텍스트에 쓰인 표현을 내부 상태값으로 변환한다. 인식하지 못하는
  // 값은 null을 반환해서 결과 메시지에 "인식 못한 값"으로 알려준다.
  function scheduleTokenToRecord(tokRaw) {
    const tok = (tokRaw || "").trim();
    if (tok === "1" || tok === "근무" || tok === "출근") return { status: "WORK", attendance: null };
    if (tok === "휴일" || tok === "오프" || tok === "휴무" || tok === "휴") return { status: "OFF", attendance: null };
    if (tok === "연차") return { status: "ANNUAL", attendance: null };
    if (tok === "대휴") return { status: "DAEHYU", attendance: null };
    if (tok === "반차") return { status: "HALF", attendance: null };
    if (tok === "공휴") return { status: "GONGHYU", attendance: null };
    if (tok === "공가") return { status: "GONGGA", attendance: null };
    if (tok === "육휴" || tok === "육아휴직") return { status: "MATERNITY", attendance: null };
    if (tok === "특휴" || tok === "특별휴가") return { status: "SPECIAL", attendance: null };
    if (tok === "교육") return { status: "EDUCATION", attendance: null };
    if (tok === "지각") return { status: "WORK", attendance: "LATE" };
    if (tok === "결근") return { status: "WORK", attendance: "ABSENT" };
    if (tok === "퇴사") return { status: "RESIGNED", attendance: null };
    return null;
  }

  // ----- 일괄 붙여넣기의 "필요인력 줄" -----
  // 인원 이름 대신 "주간 채팅 필요인력" 같은 이름표로 시작하는 줄은 인원 스케줄이 아니라 그 달의
  // 필요인력(주간/야간 × 채팅/유선) 입력값으로 반영한다. 이름표는 화면의 필요인력 행 이름과 같은 형태를
  // 쓰되, "필요인력" 글자는 생략해도 되고(주간 채팅), 띄어쓰기 여부(주간채팅)도 따지지 않는다.
  // 뒤에 오는 값들은 1일부터 순서대로 각 날짜의 필요인력이 된다.
  const SCHEDULE_REQUIRED_LINE_RE = /^(주간|야간)\s*(채팅|유선)(?:\s*필요\s*(?:인력|인원))?(?=\s|$)/;
  // 줄이 필요인력 줄이면 { group: "DAY"|"NIGHT", type: "채팅"|"유선", label, tokens } 를, 아니면 null을 돌려준다.
  // 값 구분: 줄에 탭이 있으면(엑셀에서 복사) 탭 단위로 나눠서 빈 칸도 "그 날짜는 건너뜀"으로 자리를
  // 지키고, 탭이 없으면 공백 단위로 나눈다(인원 스케줄 줄과 같은 규칙).
  function scheduleParseRequiredLine(line) {
    const m = SCHEDULE_REQUIRED_LINE_RE.exec(line || "");
    if (!m) return null;
    const rest = line.slice(m[0].length);
    let tokens;
    if (rest.indexOf("\t") !== -1) {
      tokens = rest.split("\t");
      if (tokens[0].trim() === "") tokens.shift(); // 이름표 칸과 첫 값 사이의 탭
    } else {
      tokens = rest.split(/\s+/).filter((t) => t.length > 0);
    }
    return {
      group: m[1] === "주간" ? "DAY" : "NIGHT",
      type: m[2],
      label: `${m[1]} ${m[2]}`,
      tokens: tokens.map((t) => t.trim()),
    };
  }
  // 필요인력 값 하나를 해석한다. "3"·"3명"·"2.5" → { value }, 빈 칸·"-" → { skip: true }
  // (그 날짜의 기존 값을 건드리지 않는다), 그 밖의 글자는 null(인식 못함).
  function scheduleParseRequiredToken(tokRaw) {
    const t = (tokRaw || "").trim();
    if (t === "" || t === "-") return { skip: true };
    const m = /^(\d+(?:\.\d+)?)\s*명?$/.exec(t);
    return m ? { value: Number(m[1]) } : null;
  }

  function applyScheduleBulkPaste(text) {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      scheduleBulkPasteMsg = "이 달은 잠겨 있어요. 잠금을 해제한 뒤 붙여넣어주세요.";
      return;
    }
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length === 0) {
      scheduleBulkPasteMsg = "붙여넣은 내용이 없어요.";
      return;
    }

    recordUndo("스케줄 일괄 붙여넣기", SCHEDULE_KEY, reloadScheduleData);
    let matchedLines = 0;
    let filledCells = 0;
    let requiredLines = 0; // 필요인력 줄 수
    let filledRequired = 0; // 필요인력으로 실제 반영된 칸 수
    const unmatchedNames = [];
    const unknownTokens = [];

    lines.forEach((line) => {
      const requiredLine = scheduleParseRequiredLine(line);
      if (requiredLine) {
        if (requiredLine.tokens.length === 0) return; // 이름표만 있고 값이 없는 줄
        requiredLines += 1;
        const count = Math.min(numDays, requiredLine.tokens.length);
        for (let i = 0; i < count; i++) {
          const day = i + 1;
          const parsed = scheduleParseRequiredToken(requiredLine.tokens[i]);
          if (!parsed) { unknownTokens.push(`${requiredLine.label} 필요인력 ${day}일 "${requiredLine.tokens[i]}"`); continue; }
          if (parsed.skip) continue;
          scheduleData.requiredHeadcount[scheduleRequiredKey(year, monthIndex, requiredLine.group, requiredLine.type, day)] = parsed.value;
          filledRequired += 1;
        }
        return;
      }
      const parts = line.split(/\s+/).filter((p) => p.length > 0);
      if (parts.length < 2) return;
      const name = parts[0];
      const tokens = parts.slice(1);
      const staff = monthStaff.find((s) => s.name === name) || monthStaff.find((s) => s.nickname === name);
      if (!staff) { unmatchedNames.push(name); return; }
      matchedLines += 1;
      const dayCount = Math.min(numDays, tokens.length);
      for (let i = 0; i < dayCount; i++) {
        const day = i + 1;
        const mapped = scheduleTokenToRecord(tokens[i]);
        if (!mapped) { unknownTokens.push(`${name} ${day}일 "${tokens[i]}"`); continue; }
        const dateKey = scheduleDateKey(year, monthIndex, day);
        const key = scheduleRecordKey(staff.id, dateKey);
        if (mapped.status === "WORK" && !mapped.attendance) {
          delete scheduleData.records[key];
        } else {
          scheduleData.records[key] = { status: mapped.status, attendance: mapped.attendance || null };
        }
        filledCells += 1;
      }
    });

    saveScheduleData();

    const msgParts = [];
    // 필요인력 줄만 붙여넣었을 때 "0명 반영 완료"가 먼저 보이면 헷갈리므로, 인원 줄이 있거나
    // 필요인력 줄이 아예 없을 때만 인원 결과를 보여준다.
    if (matchedLines > 0 || requiredLines === 0) msgParts.push(`${matchedLines}명 반영 완료 (총 ${filledCells}칸).`);
    if (requiredLines > 0) msgParts.push(`필요인력 ${requiredLines}줄 반영 완료 (총 ${filledRequired}칸).`);
    if (unmatchedNames.length > 0) msgParts.push(`이름을 찾지 못함: ${unmatchedNames.join(", ")}`);
    if (unknownTokens.length > 0) msgParts.push(`인식 못한 값: ${unknownTokens.join(", ")}`);
    scheduleBulkPasteMsg = msgParts.join("\n");
  }

  const SCHEDULE_STATUS_META = {
    WORK: { label: "1", cls: "st-work" },
    OFF: { label: "오프", cls: "st-off" },
    ANNUAL: { label: "연차", cls: "st-annual" },
    DAEHYU: { label: "대휴", cls: "st-daehyu" },
    HALF: { label: "반차", cls: "st-half" },
    GONGHYU: { label: "공휴", cls: "st-gonghyu" },
    GONGGA: { label: "공가", cls: "st-gongga" },
    MATERNITY: { label: "육휴", cls: "st-maternity" },
    SPECIAL: { label: "특휴", cls: "st-special" },
    EDUCATION: { label: "교육", cls: "st-education" },
    RESIGNED: { label: "퇴사", cls: "st-resigned" },
  };

  // 표 왼쪽에 고정된(스크롤해도 안 움직이는) 인원 정보 열들. 순서·너비는 CSS(.sch-col-*)와
  // 반드시 맞춰야 한다 — 개별 열을 접었을 때 나머지 고정 열들의 위치(left)를 여기 너비값으로
  // 다시 계산해서 밀어주기 때문. summaryOnly는 이미지 캡처(hideSummaryCols=true)에서는
  // 아예 마크업에서 빠지는 근무~결근 집계 열 5개를 표시한다.
  const SCHEDULE_INFO_COLS = [
    { key: "nickname", label: "닉네임", width: 92 },
    { key: "name", label: "이름", width: 60 },
    { key: "empno", label: "사번", width: 84 },
    { key: "hiredate", label: "입사일자", width: 92 },
    { key: "workhours", label: "근무시간", width: 92 },
    { key: "work", label: "근무", width: 48, summaryOnly: true },
    { key: "off", label: "휴일", width: 48, summaryOnly: true },
    { key: "annual", label: "연차", width: 48, summaryOnly: true },
    { key: "daehyu", label: "대휴", width: 48, summaryOnly: true },
    { key: "absent", label: "결근", width: 48, summaryOnly: true },
  ];
  // 지금 화면(hideSummaryCols=false 기준)에서, 접히지 않은 고정 열들이 각각 왼쪽에서
  // 몇 px 위치에 붙어야 하는지 계산한다. 접힌 열은 폭이 0이 되므로 뒤 열들이 그만큼 당겨진다.

  // 07a3-schedule-records.js — 필요인원, 셀 기록/메모, 조정요약, 정렬 헬퍼
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleInfoColLeftOffsets() {
    let offset = 0;
    const lefts = {};
    let lastVisibleKey = null;
    SCHEDULE_INFO_COLS.forEach((c) => {
      if (scheduleUi.manualHiddenInfoCols.has(c.key)) { lefts[c.key] = null; return; }
      lefts[c.key] = offset;
      offset += c.width;
      lastVisibleKey = c.key;
    });
    return { lefts, lastVisibleKey };
  }

  function scheduleDaysInMonth(year, monthIndex) { return new Date(year, monthIndex + 1, 0).getDate(); }
  function scheduleDateKey(year, monthIndex, day) { return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`; }
  function scheduleRecordKey(staffId, dateKey) { return `${staffId}|${dateKey}`; }
  // ----- 주간/야간 · 채팅/유선 "필요인력" (사용자가 직접 입력하는 값) -----
  // 그룹(DAY/NIGHT) · 업무구분(채팅/유선) · 날짜별로 하나씩 숫자를 저장한다.
  // 값을 입력하지 않은 날짜는 null로 취급해서 "대비"·"인력 대비 편성"을 비워둔다.
  function scheduleRequiredKey(year, monthIndex, group, type, day) {
    return `${scheduleMonthKey(year, monthIndex)}|${group}|${type}|${day}`;
  }
  function getRequiredHeadcount(year, monthIndex, group, type, day) {
    const v = scheduleData.requiredHeadcount[scheduleRequiredKey(year, monthIndex, group, type, day)];
    return (typeof v === "number" && !isNaN(v)) ? v : null;
  }
  function setRequiredHeadcount(year, monthIndex, group, type, day, rawValue) {
    if (scheduleIsMonthLocked(year, monthIndex)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    const key = scheduleRequiredKey(year, monthIndex, group, type, day);
    const trimmed = (rawValue || "").toString().trim();
    if (trimmed === "") {
      delete scheduleData.requiredHeadcount[key];
    } else {
      const n = Number(trimmed);
      if (isNaN(n)) return;
      scheduleData.requiredHeadcount[key] = n;
    }
    saveScheduleData();
  }
  // 특정 날짜에 실제로 투입(출근)된 인원 수. summaryRowHtml과 같은 집계 기준을 쓴다.
  function scheduleActualCount(staffList, type, dateKey) {
    return staffList.filter((s) => (!type || (s.types || []).indexOf(type) !== -1) && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
  }
  function getScheduleRecord(staffId, dateKey) {
    return scheduleData.records[scheduleRecordKey(staffId, dateKey)] || { status: "WORK", attendance: null };
  }
  function setScheduleRecord(staffId, dateKey, patch) {
    if (scheduleIsDateLocked(dateKey)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    recordUndo("스케줄 셀 변경", SCHEDULE_KEY, reloadScheduleData);
    const key = scheduleRecordKey(staffId, dateKey);
    const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
    const next = Object.assign({}, cur, patch);
    if (next.status === "WORK" && !next.attendance) {
      delete scheduleData.records[key]; // 기본값이면 굳이 저장하지 않음
    } else {
      scheduleData.records[key] = next;
    }
    saveScheduleData();
  }
  // ----- 셀 메모 (엑셀의 "메모/노트"처럼, 스케줄 상태와 별개로 짧은 텍스트를 남긴다) -----
  function getScheduleMemo(staffId, dateKey) {
    return scheduleData.memos[scheduleRecordKey(staffId, dateKey)] || "";
  }
  function setScheduleMemo(staffId, dateKey, text) {
    if (scheduleIsDateLocked(dateKey)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    const key = scheduleRecordKey(staffId, dateKey);
    const trimmed = (text || "").trim();
    if (trimmed === "") {
      delete scheduleData.memos[key];
    } else {
      scheduleData.memos[key] = trimmed;
    }
    saveScheduleData();
  }
  // ----- 이름 메모 (이름 칸에 남기는 메모) -----
  // 셀 메모가 "인원 × 날짜"라면, 이름 메모는 "인원 × 달"이다. 그 달 스케줄을 볼 때 그 사람에 대해
  // 기억해 둘 내용(예: "9/15 퇴사 예정", "수습 기간")을 남기는 용도라서, 달이 바뀌면 새로 시작한다.
  // 그래서 잠금(확정)된 달의 이름 메모도 셀 메모처럼 수정이 막히고, 지난 달을 열어보면 그때 남긴 그대로 보인다.
  // key 형식: `staffId|YYYY-MM` (셀 메모의 `staffId|YYYY-MM-DD`와 섞이지 않도록 scheduleData.nameMemos에 따로 둔다)
  function scheduleNameMemoKey(staffId, year, monthIndex) {
    return `${staffId}|${scheduleMonthKey(year, monthIndex)}`;
  }
  function getScheduleNameMemo(staffId, year, monthIndex) {
    const map = scheduleData.nameMemos || {};
    return map[scheduleNameMemoKey(staffId, year, monthIndex)] || "";
  }
  function setScheduleNameMemo(staffId, year, monthIndex, text) {
    if (scheduleIsMonthLocked(year, monthIndex)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    const trimmed = (text || "").trim();
    // 바뀐 게 없으면 저장도, 되돌리기 기록도 남기지 않는다(같은 내용으로 저장 버튼을 눌렀을 때 등).
    if (trimmed === getScheduleNameMemo(staffId, year, monthIndex)) return;
    recordUndo("스케줄 이름 메모 변경", SCHEDULE_KEY, reloadScheduleData);
    if (!scheduleData.nameMemos || typeof scheduleData.nameMemos !== "object") scheduleData.nameMemos = {};
    const key = scheduleNameMemoKey(staffId, year, monthIndex);
    if (trimmed === "") {
      delete scheduleData.nameMemos[key];
    } else {
      scheduleData.nameMemos[key] = trimmed;
    }
    saveScheduleData();
  }
  // ----- 메모 문구 기반 "가감점 취합" -----
  // 메모 안에 아래 문구들이 포함되어 있으면 해당 날짜를 카테고리별로 모아서 보여준다.
  // 표기가 다양해도(공백 유무 등) 같은 카테고리로 합쳐지도록 정리해뒀다.
  // "역동석"이 "동석"의 부분 문자열이라, 역동석을 먼저 확인하고 그 부분을 제거한 뒤에
  // 동석을 검사해서 한 메모가 "역동석"과 "동석" 두 개로 중복 집계되지 않게 한다.
  const SCHEDULE_ADJUST_CATEGORIES = [
    { label: "선 투입", patterns: ["선투입", "선 투입"] },
    { label: "연장 근무", patterns: ["연장근무", "연장 근무", "연장"] },
    { label: "초과", patterns: ["초과"] },
    { label: "라운딩", patterns: ["라운딩"] },
    { label: "역동석", patterns: ["역동석", "역 동석"] },
    { label: "동석", patterns: ["동석"] },
  ];
  // 한 메모(셀) 안에 여러 문구가 섞여 있어도(예: "선투입 후 연장근무"), 그중 텍스트상
  // 가장 앞에 나오는 문구 하나만 대표로 가져온다. 같은 위치에서 시작하는 경우
  // (예: "역동석" 안의 "동석") 더 긴/구체적인 문구가 우선하도록 한다.
  // 한 메모(셀) 안에 문구가 하나뿐이면 그걸 그대로 쓰고, 두 개 이상 섞여 있으면
  // (예: "선투입 후 연장근무") 어떤 조합이 섞여 있는지만 알려준다.
  // "역동석"이 "동석"의 부분 문자열이라, 역동석을 먼저 확인하고 그 부분을 제거한 뒤에
  // 동석을 검사해서 한 메모가 "역동석"과 "동석" 두 개로 중복 집계되지 않게 한다.
  // 반환값은 항상 SCHEDULE_ADJUST_CATEGORIES에 정의된 순서를 따른다(텍스트상 등장 순서가 아님).
  // → 같은 조합(예: "선 투입"+"연장 근무")이 여러 번 나와도 항상 같은 순서로 후보가 정해지고,
  //    그 순서를 기준으로 번갈아 뽑을 수 있게 하기 위함.
  function scheduleDetectMemoCategories(memoText) {
    let working = memoText || "";
    if (!working) return [];
    const found = [];
    SCHEDULE_ADJUST_CATEGORIES.forEach((cat) => {
      const hit = cat.patterns.some((p) => working.indexOf(p) !== -1);
      if (!hit) return;
      found.push(cat.label);
      cat.patterns.forEach((p) => { working = working.split(p).join(""); });
    });
    return found;
  }
  // 지금 화면에 보이는 달(scheduleUi.year/monthIndex) 기준으로, 메모에 위 문구가 포함된
  // 날짜를 상담사별로 모아서 [{ id, name, nickname, entries: [{ day, label }] }, ...] 형태로 돌려준다.
  // entries는 날짜순으로 정렬되고, 상담사는 이름 가나다순으로 정렬된다.
  // 한 메모에 문구가 두 개 이상 섞여 있는 "애매한" 경우엔 그중 하나만 골라야 하는데,
  // 이때 같은 상담사에게 같은 조합(예: "선 투입"+"연장 근무")이 여러 번 나오면
  // 매번 같은 것만 뽑지 않고 날짜 순서대로 번갈아가며 뽑는다.
  // (예: 8/12에 선투입+연장근무 → 선 투입, 8/14에 또 선투입+연장근무 → 연장 근무, 8/20에 또 나오면 → 다시 선 투입 ...)
  function scheduleBuildAdjustSummary(year, monthIndex) {
    const monthPrefix = `${year}-${pad2(monthIndex + 1)}-`;
    const staffList = getStaffListForMonth(year, monthIndex);
    const byStaff = {};
    Object.keys(scheduleData.memos).forEach((key) => {
      const sep = key.lastIndexOf("|");
      if (sep === -1) return;
      const staffId = key.slice(0, sep);
      const dateKey = key.slice(sep + 1);
      if (dateKey.indexOf(monthPrefix) !== 0) return;
      const day = parseInt(dateKey.slice(monthPrefix.length), 10);
      if (!day) return;
      const categories = scheduleDetectMemoCategories(scheduleData.memos[key]);
      if (!categories.length) return;
      if (!byStaff[staffId]) byStaff[staffId] = [];
      byStaff[staffId].push({ day, categories });
    });
    const result = Object.keys(byStaff).map((staffId) => {
      const staff = staffList.find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
      const raw = byStaff[staffId].sort((a, b) => a.day - b.day);
      const comboCounters = {}; // 같은 조합이 반복될 때 번갈아 뽑기 위한 카운터
      const entries = raw.map((item) => {
        let label;
        if (item.categories.length === 1) {
          label = item.categories[0];
        } else {
          const comboKey = item.categories.join("+");
          const idx = comboCounters[comboKey] || 0;
          label = item.categories[idx % item.categories.length];
          comboCounters[comboKey] = idx + 1;
        }
        return { day: item.day, label };
      });
      return {
        id: staffId,
        name: staff ? staff.name : "(삭제된 인원)",
        nickname: staff ? staff.nickname : "",
        entries,
      };
    });
    result.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return result;
  }

  function scheduleCellDisplay(record) {
    if (record.status === "WORK" && record.attendance === "LATE") return { label: "지각", cls: "st-late" };
    if (record.status === "WORK" && record.attendance === "ABSENT") return { label: "결근", cls: "st-absent" };
    const meta = SCHEDULE_STATUS_META[record.status] || SCHEDULE_STATUS_META.WORK;
    return meta;
  }
  function scheduleCountsAsWorked(record) {
    return record.status === "WORK" && record.attendance !== "ABSENT";
  }

  // 이번 달 근무/오프/연차/대휴/결근 일수를 인원별로 집계.
  // "오프" 합계는 스케줄상 오프뿐 아니라 대휴·공휴·육휴·특휴까지 모두 포함해서 셈한다.
  // (대휴는 별도 열에도 단독으로 계속 표시되므로 DAEHYU 값 자체는 그대로 둔다)
  function scheduleStaffMonthCounts(staffId, year, monthIndex) {
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const counts = { WORK: 0, OFF: 0, ANNUAL: 0, DAEHYU: 0, ABSENT: 0 };
    // "오프" 합계에 함께 포함시킬 휴무성 상태 목록 (대휴는 아래에서 DAEHYU로 별도 집계도 함께 함)
    const OFF_GROUP_STATUSES = ["OFF", "DAEHYU", "GONGHYU", "MATERNITY", "SPECIAL"];
    for (let d = 1; d <= numDays; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      const record = getScheduleRecord(staffId, dateKey);
      if (record.status === "WORK" && record.attendance === "ABSENT") counts.ABSENT += 1;
      else if (record.status === "WORK") counts.WORK += 1;
      else if (record.status === "ANNUAL") counts.ANNUAL += 1;
      else if (record.status === "DAEHYU") counts.DAEHYU += 1;
      if (OFF_GROUP_STATUSES.indexOf(record.status) !== -1) counts.OFF += 1;
    }
    return counts;
  }

  // 조(주간/야간)는 "상담사 관리"에 등록된 값이 기본으로 반영되지만,
  // 이 스케줄 화면에서도 바로 전환할 수 있다. 이때는 "상담사 관리" 쪽
  // 데이터도 함께 바꿔서 두 화면이 항상 같은 값을 보여주도록 한다.
  // 이름/사번/입사일 등 나머지 정보는 "상담사 관리"에서 수정하면 자동으로 반영된다.
  function scheduleMonthLabel() { return `${scheduleUi.year}년 ${scheduleUi.monthIndex + 1}월`; }
  // 오늘 버튼: 현재 달이면 오늘 날짜 열로 바로 이동하고, 다른 달을 보고 있으면
  // 현재 달로 전환한 뒤 오늘 날짜 열을 가운데쯤으로 가져온다.
  function scheduleGoToday() {
    const now = new Date();
    const targetYear = now.getFullYear();
    const targetMonth = now.getMonth();
    const targetDay = now.getDate();
    const sameMonth = scheduleUi.year === targetYear && scheduleUi.monthIndex === targetMonth;

    const scrollToToday = () => {
      requestAnimationFrame(() => {
        const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
        const cell = document.querySelector(`#schedule-table-area .schedule-table thead th[data-col-key="d:${targetDay}"]`);
        if (!wrap || !cell) return;
        const wrapRect = wrap.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        const cellLeftInScroll = cellRect.left - wrapRect.left + wrap.scrollLeft;
        const left = cellLeftInScroll - Math.max(0, (wrap.clientWidth - cellRect.width) / 2);
        wrap.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
        cell.classList.add("sch-today-focus");
        setTimeout(() => cell.classList.remove("sch-today-focus"), 1400);
      });
    };

    if (!sameMonth) {
      scheduleUi.year = targetYear;
      scheduleUi.monthIndex = targetMonth;
      scheduleHeaderSelCols = new Set();
      scheduleHeaderSelRows = new Set();
      scheduleSyncUiCollapseFromData();
      renderApp();
      scrollToToday();
      return;
    }
    scrollToToday();
  }

  function scheduleShiftMonth(delta) {
    let m = scheduleUi.monthIndex + delta;
    let y = scheduleUi.year;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    scheduleUi.monthIndex = m;
    scheduleUi.year = y;
    // 달이 바뀌면 지금 선택 중이던 헤더는 의미가 없어지므로 선택 상태만 초기화하고,
    // 접기 상태는 새로 보는 달에 맞춰 서버에 저장돼 있던 값(scheduleData.collapseByMonth)을
    // 그대로 불러와서 유지한다 — 그래야 이전에 이 달을 접어뒀다면(나든 다른 사람이든)
    // 다시 열었을 때도 그 모습 그대로 보인다.
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    scheduleSyncUiCollapseFromData();
    renderApp();
  }

  // 채팅 담당자를 먼저, 유선만 담당하는 인원을 그다음에 배치하기 위한 순위.
  // (채팅+유선을 함께 하는 인원은 채팅 쪽에 먼저 표시)
  function scheduleTypeRank(s) {
    const types = s.types || [];
    if (types.indexOf("채팅") !== -1) return 0;
    if (types.indexOf("유선") !== -1) return 1;
    return 2;
  }
  // 근무시간(예: "09:00-18:00")에서 시작 시각을 분 단위로 추출한다.
  // 시간 형식을 찾을 수 없으면 맨 뒤로 보내기 위해 아주 큰 값을 반환한다.
  function scheduleStartMinutes(s) {
    const wh = s.workHours || "";
    const m = wh.match(/(\d{1,2}):(\d{2})/);
    if (!m) return Infinity;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  // 업무 구분(채팅/유선) 순으로 정렬하고, 같은 구분 안에서는 근무시간(시작 시각) 순으로,
  // 시간이 같거나 없으면 기존 등록 순서를 유지한다.
  function sortStaffByType(list) {
    return list
      .map((s, idx) => ({ s, idx }))
      .sort((a, b) => {
        const r = scheduleTypeRank(a.s) - scheduleTypeRank(b.s);
        if (r !== 0) return r;
        const t = scheduleStartMinutes(a.s) - scheduleStartMinutes(b.s);
        return t !== 0 ? t : a.idx - b.idx;
      })
      .map((x) => x.s);
  }
  function splitByType(list) {
    return {
      chat: list.filter((s) => scheduleTypeRank(s) === 0),
      voice: list.filter((s) => scheduleTypeRank(s) === 1),
      etc: list.filter((s) => scheduleTypeRank(s) === 2),
    };
  }

  // filterMode: 인자를 안 주면(undefined) 지금까지와 같은 "전체" 표(관리자+주간+야간)를 그린다.
  // "DAY"/"NIGHT"를 주면 그 조만, "VOICE"/"CHAT"을 주면 주야간을 통합하되 표 안에서는
  // 주간/야간 구획을 나눠서 보여준다. (월별 스케줄 캡처의 "주간 저장"·"야간 저장"·
  // "유선 저장"·"채팅 저장" 기능에서 사용)
  // hideRequiredRows: true면 "필요인력"/"대비"/"인력 대비 편성" 3행 묶음(입력칸 포함)을 아예 빼고 그린다.
  // (이미지로 저장할 때 켜서 씀. 이 행에는 <input>이 들어있어 캡처 대상에서 빼는 게 더 안전하고,
  //  캡처 이미지 안에 사용자가 직접 편집하는 입력용 요소가 노출되지 않게 한다.)

  // 07a4-schedule-table-render.js — 월별 스케줄 표 렌더링 (buildScheduleTableHtml)
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  // "AI 자동 배치" 미리보기 표에서만 쓴다. { "staffId|YYYY-MM-DD": 1 또는 2 } 형태로, 새로 배정될 오프 칸을
  // 알려주면 그 칸에 강조 클래스를 붙인다(1 = 새로 배정될 오프, 2 = 그중 선호 요일과 맞은 칸).
  // 평소에는 null이라 화면의 실제 월별 스케줄 표에는 아무 영향이 없다.
  let schedulePreviewMarks = null;
  // "AI 자동 배치" 미리보기 전용: 이번 배치에서 제외한 인원의 id 집합. 표(인원 행·집계·필요인력 대비)에서 이 인원을 뺀다.
  // 평소에는 null이라 실제 월별 스케줄 표에는 아무 영향이 없다.
  let schedulePreviewExcludedIds = null;
  function buildScheduleTableHtml(filterMode, hideSummaryCols, hideRequiredRows, hideMemoMarks) {
    const { year, monthIndex } = scheduleUi;
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const days = [];
    for (let d = 1; d <= numDays; d++) days.push(d);
    // 상담사 검색 중(캡처용 표는 제외)이면 그룹 제목 행·소제목 행·집계행(관리자 인원/필요인력/대비/
    // 인력 대비 편성/총 인원 등)을 전부 숨기고, 검색어와 일치하는 인원 행만 보이게 한다.
    const searchActive = !hideSummaryCols && !!(scheduleUi.searchQuery && scheduleUi.searchQuery.trim());
    const collapsedDays = scheduleCollapsedDaySet();
    const colHiddenCls = (d) => (collapsedDays.has(d) ? " sch-col-hidden" : "");
    // 이미지로 저장할 때는 근무~결근 집계 열 5개를 표에서 아예 빼고 그린다.
    // 화면(hideSummaryCols가 false)에서 개별로 접은 인원정보 열(사번 등)도 같은 이유로
    // "안 보이게" CSS로 숨기는 대신 마크업 자체에서 통째로 빼버린다 — "관리자 인원" 같은
    // 요약행들이 인원정보 영역 전체를 colspan 하나로 합친 칸을 쓰는데, 이 표에서는
    // CSS로 열을 숨기는 방식으로는 그 colspan 너비 계산이 정확히 안 맞아서(브라우저가
    // 숨긴 셀만큼 너비를 못 줄여줌) 표가 밀려 보인다. 아예 셀 자체를 안 만들면 이 문제가 없다.
    const infoColCount = hideSummaryCols
      ? 5
      : SCHEDULE_INFO_COLS.filter((c) => !scheduleUi.manualHiddenInfoCols.has(c.key)).length;
    const { lefts: infoColLefts, lastVisibleKey: infoColLastVisible } = scheduleInfoColLeftOffsets();

    const monthStaff = getStaffListForMonth(year, monthIndex).filter((s) => !schedulePreviewExcludedIds || !schedulePreviewExcludedIds.has(s.id));
    const adminStaff = monthStaff.filter((s) => s.isAdmin);
    const dayStaff = sortStaffByType(monthStaff.filter((s) => s.group !== "night" && !s.isAdmin));
    const nightStaff = sortStaffByType(monthStaff.filter((s) => s.group === "night" && !s.isAdmin));
    // "집계 제외"로 표시해둔 인원은 행 자체는 그대로 두되(옅은 회색으로 표시), 유선/채팅 인원·
    // 필요인력 대비·총 인원 등 집계 행 계산에서만 뺀다. 아래 집계 관련 함수(summaryRowHtml·
    // requiredHeadcountBlockHtml·totalRowHtml)에 넘기는 staffList는 이 함수로 한 번 걸러서 쓴다.
    const aggOnly = (list) => list.filter((s) => !scheduleUi.manualExcludedAggregateStaffIds.has(s.id));
    // 인원 정보 열(닉네임~결근) 하나를 그려주는 헬퍼. asTh=true면 헤더 셀(선택 가능),
    // false면 각 인원 행의 값 칸(행 선택 가능)을 만든다. 개별로 접어둔 열은 아예 마크업에서
    // 빼버린다(위 infoColCount 주석 참고) — 그래야 요약행들의 colspan 너비도 같이 맞는다.
    // titleText: 값 칸(td)에 마우스를 올렸을 때 보여줄 툴팁. 이름 칸의 메모 내용을 보여주는 데 쓴다.
    function infoColHtml(colDef, asTh, valueHtml, extraCls, staffId, titleText) {
      if (hideSummaryCols) {
        // 캡처용 마크업: 개별 열 숨김을 적용하지 않고 항상 그대로 그린다.
        if (colDef.summaryOnly) return "";
        const tag = asTh ? "th" : "td";
        return `<${tag} class="sch-info sch-col-${colDef.key}${extraCls ? ` ${extraCls}` : ""}">${asTh ? colDef.label : valueHtml}</${tag}>`;
      }
      if (scheduleUi.manualHiddenInfoCols.has(colDef.key)) return "";
      const tag = asTh ? "th" : "td";
      const stickyEndCls = colDef.key === infoColLastVisible ? " sch-sticky-end" : "";
      const leftStyle = ` style="left:${infoColLefts[colDef.key]}px"`;
      const selCls = asTh ? " sch-col-th" : " sch-row-th";
      const dataAttrs = asTh
        ? ` data-col-key="i:${colDef.key}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`
        : ` data-staff-id="${staffId || ""}" data-row-key="s:${staffId || ""}"${titleText ? ` title="${esc(titleText)}"` : ""}`;
      return `<${tag} class="sch-info sch-col-${colDef.key}${stickyEndCls}${selCls}${extraCls ? ` ${extraCls}` : ""}"${leftStyle}${dataAttrs}>${asTh ? colDef.label : valueHtml}</${tag}>`;
    }

    const headRow1 = `<th class="sch-info" colspan="${infoColCount}"></th>` + days.map((d) => {
      const wd = new Date(year, monthIndex, d).getDay();
      const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
      const cls = wd === 6 ? "wd-sat" : (isHoliday || wd === 0) ? "wd-sun" : "";
      return `<th class="${cls}${colHiddenCls(d)} sch-col-th" data-col-key="d:${d}" title="${isHoliday ? esc(getHoliday(scheduleDateKey(year, monthIndex, d))) : "클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"}">${pad2(monthIndex + 1)}/${pad2(d)}</th>`;
    }).join("");
    const headRow2 = SCHEDULE_INFO_COLS.map((c) => infoColHtml(c, true)).join("") +
      days.map((d) => {
        const wd = new Date(year, monthIndex, d).getDay();
        const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
        const cls = wd === 6 ? "wd-sat" : (isHoliday || wd === 0) ? "wd-sun" : "";
        return `<th class="${cls}${colHiddenCls(d)} sch-col-th" data-col-key="d:${d}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기">${WEEKDAYS[wd]}</th>`;
      }).join("");

    let scheduleRowCounter = 0; // 드래그 선택의 사각형 범위 계산에 쓰는, 렌더링될 때마다 매겨지는 행 순번
    function staffRowHtml(s) {
      const rowIdx = scheduleRowCounter++;
      const searchHidden = !scheduleStaffMatchesSearch(s, scheduleUi.searchQuery);
      const rowHiddenCls = (scheduleUi.manualHiddenStaffIds.has(s.id) || searchHidden) ? " sch-row-hidden" : "";
      const rowExcludedCls = scheduleUi.manualExcludedAggregateStaffIds.has(s.id) ? " sch-row-excluded" : "";
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const record = getScheduleRecord(s.id, dateKey);
        const disp = scheduleCellDisplay(record);
        const memo = getScheduleMemo(s.id, dateKey);
        const memoDot = (memo && !hideMemoMarks) ? `<span class="sch-memo-dot" title="${esc(memo)}"></span>` : "";
        const previewMark = schedulePreviewMarks ? schedulePreviewMarks[scheduleRecordKey(s.id, dateKey)] : 0;
        const previewCls = previewMark ? (previewMark === 2 ? " sch-cell--auto sch-cell--auto-pref" : " sch-cell--auto") : "";
        return `<td class="sch-cell ${disp.cls}${previewCls}${colHiddenCls(d)}" data-staff-id="${s.id}" data-date="${dateKey}" data-row-idx="${rowIdx}" data-day="${d}" title="${esc(memo)}" tabindex="0"><span class="sch-cell-label">${disp.label}</span>${memoDot}</td>`;
      }).join("");
      const counts = scheduleStaffMonthCounts(s.id, year, monthIndex);
      // 이름 칸 메모: 셀 메모와 같은 주황 삼각형 표시(이미지 저장 시엔 hideMemoMarks로 빠진다)를 붙이고,
      // 마우스를 올리면 메모 내용이 툴팁으로 보인다. 이름 칸을 오른쪽 클릭하면 추가/수정/삭제할 수 있다.
      const nameMemo = getScheduleNameMemo(s.id, year, monthIndex);
      const nameMemoDot = (nameMemo && !hideMemoMarks) ? `<span class="sch-memo-dot sch-memo-dot--name"></span>` : "";
      const infoColValues = {
        nickname: esc(s.nickname), name: esc(s.name) + nameMemoDot, empno: esc(s.empNo),
        hiredate: esc(s.hireDate), workhours: esc(s.workHours),
        work: counts.WORK, off: counts.OFF, annual: counts.ANNUAL, daehyu: counts.DAEHYU, absent: counts.ABSENT,
      };
      const infoCells = SCHEDULE_INFO_COLS.map((c) => {
        const extraCls = c.key === "nickname" ? "sch-nickname" : (c.summaryOnly ? "sch-count" : "");
        return infoColHtml(c, false, infoColValues[c.key], extraCls, s.id, c.key === "name" ? nameMemo : "");
      }).join("");
      return `
        <tr class="${(rowHiddenCls + rowExcludedCls).trim()}">
          ${infoCells}
          ${cells}
        </tr>
      `;
    }

    // 집계행(관리자 인원/필요인력/대비 등) 왼쪽 라벨 칸. rowKey가 있으면(=캡처가 아니면) 클릭해서
    // 선택 → 오른쪽 클릭으로 그 행 전체를 접을 수 있게 만든다.
    function summaryLabelCellHtml(rowKey, label) {
      if (hideSummaryCols || !rowKey) return `<td class="sch-info" colspan="${infoColCount}">${label}</td>`;
      return `<td class="sch-info sch-row-th" colspan="${infoColCount}" data-row-key="r:${esc(rowKey)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기">${label}</td>`;
    }
    function summaryRowHiddenCls(rowKey) {
      if (hideSummaryCols) return "";
      if (searchActive) return " sch-row-hidden";
      return (rowKey && scheduleUi.manualHiddenSummaryRows.has(rowKey)) ? " sch-row-hidden" : "";
    }
    // type이 null/undefined면 업무 구분(채팅/유선)과 무관하게 목록 전체를 집계한다.
    // (관리자 인원 집계처럼 채팅/유선 구분 없이 셀 때 사용)
    function summaryRowHtml(label, staffList, type, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const count = staffList.filter((s) => (!type || (s.types || []).indexOf(type) !== -1) && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
        return `<td class="${colHiddenCls(d).trim()}">${count}</td>`;
      }).join("");
      return `<tr class="sch-summary-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }

    // "필요인력" 행: 사용자가 직접 숫자를 입력하는 칸(인풋). groupKey는 "DAY"/"NIGHT", type은 "채팅"/"유선".
    // 이 달이 잠겨 있으면(확정됨) 다른 스케줄 셀과 마찬가지로 입력칸 자체를 비활성화해서
    // 클릭·타이핑 자체가 안 먹게 한다. (예전에는 blur 시점에만 저장을 막아서, 입력은 계속
    // 가능해 보이는데 실제로는 저장이 안 되는 것처럼 보이는 문제가 있었다.)
    const monthLocked = scheduleIsMonthLocked(year, monthIndex);
    function requiredHeadcountRowHtml(groupKey, type, label, rowKey) {
      const cells = days.map((d) => {
        const val = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        return `<td class="sch-required-cell${colHiddenCls(d)}"><input type="number" class="sch-required-input${monthLocked ? " sch-required-input--locked" : ""}" min="0" step="1" inputmode="numeric" data-required-group="${groupKey}" data-required-type="${esc(type)}" data-required-day="${d}" value="${val === null ? "" : val}" placeholder="-"${monthLocked ? " disabled title=\"잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.\"" : ""}></td>`;
      }).join("");
      return `<tr class="sch-required-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // "대비" 행: 실제 투입 인력 - 필요인력 (필요인력을 입력하지 않은 날짜는 빈칸)
    function requiredDiffRowHtml(groupKey, type, staffList, label, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        const diff = required === null ? "" : (scheduleActualCount(staffList, type, dateKey) - required);
        return `<td class="${colHiddenCls(d).trim()}">${diff}</td>`;
      }).join("");
      return `<tr class="sch-diff-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // "인력 대비 편성" 행: 대비가 0 이상이면 O, 음수면 X (필요인력 미입력 날짜는 빈칸)
    function requiredStatusRowHtml(groupKey, type, staffList, label, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        let mark = "";
        let statusCls = "";
        if (required !== null) {
          const diff = scheduleActualCount(staffList, type, dateKey) - required;
          mark = diff >= 0 ? "O" : "X";
          statusCls = diff >= 0 ? " sch-status-ok" : " sch-status-ng";
        }
        return `<td class="${(colHiddenCls(d).trim() + statusCls).trim()}">${mark}</td>`;
      }).join("");
      return `<tr class="sch-status-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // 그룹(주간/야간)의 채팅·유선 필요인력 3행 묶음(필요인력/대비/인력 대비 편성)을 한 번에 만든다.
    function requiredHeadcountBlockHtml(groupKey, groupLabel, staffList) {
      return (
        requiredHeadcountRowHtml(groupKey, "채팅", `${groupLabel} 채팅 필요인력`, `${groupKey}·채팅·필요인력`) +
        requiredDiffRowHtml(groupKey, "채팅", staffList, "대비", `${groupKey}·채팅·대비`) +
        requiredStatusRowHtml(groupKey, "채팅", staffList, "인력 대비 편성", `${groupKey}·채팅·인력대비편성`) +
        requiredHeadcountRowHtml(groupKey, "유선", `${groupLabel} 유선 필요인력`, `${groupKey}·유선·필요인력`) +
        requiredDiffRowHtml(groupKey, "유선", staffList, "대비", `${groupKey}·유선·대비`) +
        requiredStatusRowHtml(groupKey, "유선", staffList, "인력 대비 편성", `${groupKey}·유선·인력대비편성`)
      );
    }

    function totalRowHtml(label, groups, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        let total = 0;
        groups.forEach(({ staffList, type }) => {
          total += staffList.filter((s) => (s.types || []).indexOf(type) !== -1 && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
        });
        return `<td class="${colHiddenCls(d).trim()}">${total}</td>`;
      }).join("");
      return `<tr class="sch-total-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }

    // 행 그룹(관리자/주간/야간 등) 제목 행. 클릭하면 접히고 펼쳐지는 삼각형 토글을 함께 넣는다.
    function groupHeaderRow(key, label, isStatic) {
      const collapsed = scheduleIsRowGroupCollapsed(key);
      const toggle = `<span class="sch-row-toggle" data-toggle-row-group="${key}">${collapsed ? "▸" : "▾"}</span>`;
      const hiddenCls = summaryRowHiddenCls(key);
      const tdCls = hideSummaryCols ? "" : " sch-row-th";
      const tdAttrs = hideSummaryCols ? "" : ` data-row-key="r:${esc(key)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`;
      return `<tr class="sch-group-row${isStatic ? " sch-group-row--static" : ""}${hiddenCls}" data-group-key="${key}"><td class="${tdCls.trim()}" colspan="${infoColCount + numDays}"${tdAttrs}>${toggle}${label}</td></tr>`;
    }
    // 소제목 행(채팅/유선/업무 구분 미지정). 부모 그룹 키에 이어 붙여서 고유 키를 만든다.
    function subGroupHeaderRow(key, label) {
      const collapsed = scheduleIsRowGroupCollapsed(key);
      const toggle = `<span class="sch-row-toggle" data-toggle-row-group="${key}">${collapsed ? "▸" : "▾"}</span>`;
      const hiddenCls = summaryRowHiddenCls(key);
      const tdCls = hideSummaryCols ? "" : " sch-row-th";
      const tdAttrs = hideSummaryCols ? "" : ` data-row-key="r:${esc(key)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`;
      return `<tr class="sch-subgroup-row${hiddenCls}" data-group-key="${key}"><td class="${tdCls.trim()}" colspan="${infoColCount + numDays}"${tdAttrs}>${toggle}${label}</td></tr>`;
    }
    // 접힌 그룹은 제목 행만 남기고 본문(인원 행·집계 행)은 렌더링하지 않는다.
    function groupBody(key, renderFn) {
      return scheduleIsRowGroupCollapsed(key) ? "" : renderFn();
    }

    // 그룹(주간/야간) 안에서 다시 채팅 담당 → 유선 담당 순으로 소제목을 나눠 보여준다.
    function subGroupsHtml(staffList, parentKey) {
      const { chat, voice, etc } = splitByType(staffList);
      let html = "";
      if (chat.length > 0) {
        const key = `${parentKey}::CHAT`;
        html += subGroupHeaderRow(key, `채팅 (${chat.length}명)`);
        html += groupBody(key, () => chat.map(staffRowHtml).join(""));
      }
      if (voice.length > 0) {
        const key = `${parentKey}::VOICE`;
        html += subGroupHeaderRow(key, `유선 (${voice.length}명)`);
        html += groupBody(key, () => voice.map(staffRowHtml).join(""));
      }
      if (etc.length > 0) {
        const key = `${parentKey}::ETC`;
        html += subGroupHeaderRow(key, `업무 구분 미지정 (${etc.length}명)`);
        html += groupBody(key, () => etc.map(staffRowHtml).join(""));
      }
      return html;
    }

    let bodyHtml = "";
    if (filterMode === "ADMIN") {
      // "관리자 저장": 관리자로 등록된 인원만 보여준다.
      if (adminStaff.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 관리자가 없어요.</td></tr>`;
      } else {
        const key = scheduleRowGroupKey(filterMode, "ADMIN");
        bodyHtml += groupHeaderRow(key, `${ICON_SHIELD} 관리자 (${adminStaff.length}명)`, true);
        bodyHtml += groupBody(key, () => adminStaff.map(staffRowHtml).join("") + summaryRowHtml("관리자 인원", aggOnly(adminStaff), null, "관리자"));
      }
    } else if (filterMode === "DAY" || filterMode === "NIGHT") {
      // "주간 저장" / "야간 저장": 관리자는 빼고 해당 조만 보여준다.
      const staffList = filterMode === "DAY" ? dayStaff : nightStaff;
      const groupTitle = filterMode === "DAY" ? `${ICON_SUN} 아침조 / 주간 (${staffList.length}명)` : `${ICON_MOON} 야간조 (${staffList.length}명)`;
      if (staffList.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 인원이 없어요.</td></tr>`;
      } else {
        const key = scheduleRowGroupKey(filterMode, filterMode);
        bodyHtml += groupHeaderRow(key, groupTitle);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(staffList, key) + summaryRowHtml("채팅 인원", aggOnly(staffList), "채팅", `${filterMode}·채팅인원`) + summaryRowHtml("유선 인원", aggOnly(staffList), "유선", `${filterMode}·유선인원`) +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml(filterMode, filterMode === "DAY" ? "주간" : "야간", aggOnly(staffList)))
        );
      }
    } else if (filterMode === "VOICE" || filterMode === "CHAT") {
      // "유선 저장" / "채팅 저장": 주야간은 통합하되, 캡처 안에서는 주간/야간 구획을 나눠 보여준다.
      const typeName = filterMode === "VOICE" ? "유선" : "채팅";
      const typeKey = filterMode === "VOICE" ? "voice" : "chat";
      const dayTyped = splitByType(dayStaff)[typeKey];
      const nightTyped = splitByType(nightStaff)[typeKey];
      if (dayTyped.length === 0 && nightTyped.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">${typeName} 담당 인원이 없어요.</td></tr>`;
      } else {
        if (dayTyped.length > 0) {
          const key = scheduleRowGroupKey(filterMode, "DAY_TYPED");
          bodyHtml += groupHeaderRow(key, `${ICON_SUN} 주간 · ${typeName} (${dayTyped.length}명)`);
          bodyHtml += groupBody(key, () => dayTyped.map(staffRowHtml).join("") + summaryRowHtml(`${typeName} 인원`, aggOnly(dayTyped), typeName, `DAY_TYPED·${typeKey}`));
        }
        if (nightTyped.length > 0) {
          const key = scheduleRowGroupKey(filterMode, "NIGHT_TYPED");
          bodyHtml += groupHeaderRow(key, `${ICON_MOON} 야간 · ${typeName} (${nightTyped.length}명)`);
          bodyHtml += groupBody(key, () => nightTyped.map(staffRowHtml).join("") + summaryRowHtml(`${typeName} 인원`, aggOnly(nightTyped), typeName, `NIGHT_TYPED·${typeKey}`));
        }
        if (dayTyped.length > 0 && nightTyped.length > 0) {
          bodyHtml += totalRowHtml(`주/야간 총 ${typeName} 출근 인원`, [{ staffList: aggOnly(dayTyped), type: typeName }, { staffList: aggOnly(nightTyped), type: typeName }], `total·${typeKey}`);
        }
      }
    } else if (dayStaff.length === 0 && nightStaff.length === 0 && adminStaff.length === 0) {
      bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 인원이 없어요. "상담사 관리"에서 상담사를 등록하면 자동으로 표시돼요.</td></tr>`;
    } else {
      if (adminStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "ADMIN");
        bodyHtml += groupHeaderRow(key, `${ICON_SHIELD} 관리자 (${adminStaff.length}명)`, true);
        bodyHtml += groupBody(key, () => adminStaff.map(staffRowHtml).join("") + summaryRowHtml("관리자 인원", aggOnly(adminStaff), null, "관리자"));
      }
      if (dayStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "DAY");
        bodyHtml += groupHeaderRow(key, `${ICON_SUN} 아침조 / 주간 (${dayStaff.length}명)`);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(dayStaff, key) + summaryRowHtml("채팅 인원", aggOnly(dayStaff), "채팅", "DAY·채팅인원") + summaryRowHtml("유선 인원", aggOnly(dayStaff), "유선", "DAY·유선인원") +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml("DAY", "주간", aggOnly(dayStaff)))
        );
      }
      if (nightStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "NIGHT");
        bodyHtml += groupHeaderRow(key, `${ICON_MOON} 야간조 (${nightStaff.length}명)`);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(nightStaff, key) + summaryRowHtml("채팅 인원", aggOnly(nightStaff), "채팅", "NIGHT·채팅인원") + summaryRowHtml("유선 인원", aggOnly(nightStaff), "유선", "NIGHT·유선인원") +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml("NIGHT", "야간", aggOnly(nightStaff)))
        );
      }
      if (dayStaff.length > 0 && nightStaff.length > 0) {
        bodyHtml += totalRowHtml("주/야간 총 채팅 출근 인원", [{ staffList: aggOnly(dayStaff), type: "채팅" }, { staffList: aggOnly(nightStaff), type: "채팅" }], "total·채팅");
        bodyHtml += totalRowHtml("주/야간 총 유선 출근 인원", [{ staffList: aggOnly(dayStaff), type: "유선" }, { staffList: aggOnly(nightStaff), type: "유선" }], "total·유선");
      }
    }

    return `
      <table class="schedule-table">
        <thead>
          <tr>${headRow1}</tr>
          <tr>${headRow2}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;
  }


  // 화면의 월별 스케줄 표와 같은 내용을 엑셀(.xlsx) 파일로 내려받는다.
  // HTML 표를 그대로 파싱하지 않고, 표를 만들 때 쓰는 것과 같은 데이터를
  // 다시 조립해서 셀 값(라벨 텍스트)을 그대로 넣는다.
  // 1-based 열 번호 -> 엑셀 열 문자(A, B, ..., Z, AA, ...)
  function scheduleColLetter(n) {
    let s = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  // 월별 스케줄 표를 엑셀(.xlsx)로 내려받는다.
  // 사내에서 예전부터 쓰던 수기 엑셀 양식(통합/채팅/유선 3개 시트, 기준일 하나에서
  // 수식으로 이어지는 날짜 행, 근무=SUM 수식 등)과 열 순서·수식 스타일을 맞췄다.
  // - 통합 시트: 전체 인원(관리자+주간+야간, 주간/야간은 다시 채팅/유선/미지정 순)
  // - 채팅/유선 시트: 업무 구분이 채팅(또는 유선)인 인원만 모아서 같은 양식으로 반복
  // - 근무/휴일/연차/대휴/결근 합계와 채팅·유선 인원 집계는 값이 아니라 SUM·COUNTIF
  //   수식으로 넣어서, 엑셀에서 날짜 칸을 직접 고쳐도 합계가 자동으로 다시 계산된다.
  //   (반차는 인원 집계에서 0.5명으로 센다.)
  // - "필요인력 대비 편성(O/X)" 판정은 앱에 없는 날짜별 수기 허용치가 있어야 하는
  //   부분이라 이 내보내기에는 포함하지 않는다.
  async function exportScheduleToExcel() {
    if (typeof ExcelJS === "undefined") {
      flashScheduleStatus("엑셀 변환 기능을 불러오지 못했어요. 인터넷 연결을 확인해주세요.");
      return;
    }
    const btn = document.getElementById("sch-excel-btn");
    if (btn) { btn.disabled = true; btn.textContent = "엑셀 생성 중..."; }

    try {
      const { year, monthIndex } = scheduleUi;
      const numDays = scheduleDaysInMonth(year, monthIndex);
      const days = [];
      for (let d = 1; d <= numDays; d++) days.push(d);
      // A: 이름 참조(=C{row}, 정렬·검색용) ~ K: 결근. L부터 날짜 열.
      const infoCols = 11;
      const totalCols = infoCols + numDays;
      const anchorCol = totalCols + 1; // 날짜 수식이 참조하는 "기준 월" 칸(맨 오른쪽)
      const anchorColL = scheduleColLetter(anchorCol);
      const firstDayColL = scheduleColLetter(infoCols + 1);
      const lastDayColL = scheduleColLetter(infoCols + numDays);

      const monthStaff = getStaffListForMonth(year, monthIndex);

      // 엑셀은 화면 밖에서(인쇄·공유 등) 보는 경우가 많으므로, 현재 켜둔 화면 테마(다크 등)와
      // 상관없이 항상 밝고 차분한 "보고용" 팔레트를 쓴다. 상태별 배경은 화면 월별 스케줄 표와
      // 같은 색을 옅게(흰 배경에 얹은 배지색) 넣고, 글자는 그 진한 원색을 써서 어떤 색인지는
      // 한눈에 들어오되 셀 전체가 원색으로 칠해지지 않게 한다.
      const blendWithWhite = (hex, alpha) => {
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
        const a = alpha / 255;
        const mix = (c) => Math.round(c * a + 255 * (1 - a)).toString(16).padStart(2, "0").toUpperCase();
        return mix(r) + mix(g) + mix(b);
      };
      const solid = (hex) => "FF" + hex;
      const pastel = (hex, alpha) => "FF" + blendWithWhite(hex, alpha || 0x26);

      const COLOR = {
        headerBg: solid("DBEEF3"),
        headerText: solid("4D5057"),
        dateGray: solid("BFBFBF"),
        summary: solid("D7E4BC"),
        summaryText: solid("000000"),
        total: solid("B3A2C7"),
        totalText: solid("000000"),
        border: solid("DEE1E6"),
        nickname: solid("24262B"),
        groupLabel: solid("FF0000"),
        anchorBg: solid("FFC000"),
        amountBg: solid("FFFFCC"),
      };
      // 월별 스케줄 표의 범례와 같은 상태별 색(배경은 옅게, 글자는 진하게)
      const STATUS_BASE = {
        "휴일": "3778B0",
        "연차": "B9791E",
        "대휴": "2C7F96",
        "반차": "C2603F",
        "공휴": "227D75",
        "공가": "7454B5",
        "육휴": "B5548F",
        "특휴": "A554B6",
        "교육": "2F9E63",
        "지각": "8A6A1F",
        "결근": "C94F4F",
      };
      const STATUS_FILL = {};
      const STATUS_TEXT = {};
      Object.keys(STATUS_BASE).forEach((label) => {
        STATUS_FILL[label] = pastel(STATUS_BASE[label]);
        STATUS_TEXT[label] = solid(STATUS_BASE[label]);
      });
      STATUS_FILL["퇴사"] = solid("E4E6EA");
      STATUS_TEXT["퇴사"] = solid("7C7D84");

      const wb = new ExcelJS.Workbook();
      const thinBorder = { style: "thin", color: { argb: COLOR.border } };
      function applyBorder(cell) {
        cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
      }

      // sheetName: 시트 이름("통합"/"채팅"/"유선"). staffList: 이 시트에 실을 인원(이미
      // 업무 구분으로 걸러진 목록). singleTypeLabel: "채팅"/"유선"이면 주간·야간을 채팅/유선으로
      // 다시 나누지 않고 통째로 하나의 인원 집계행만 만든다(통합 시트는 undefined로 호출).
      function buildSheet(sheetName, staffList, singleTypeLabel) {
        const adminStaff = staffList.filter((s) => s.isAdmin);
        const dayStaff = sortStaffByType(staffList.filter((s) => s.group !== "night" && !s.isAdmin));
        const nightStaff = sortStaffByType(staffList.filter((s) => s.group === "night" && !s.isAdmin));

        const ws = wb.addWorksheet(sheetName, {
          views: [{ state: "frozen", xSplit: infoCols, ySplit: 3, showGridLines: false }],
        });
        ws.columns = [
          { width: 6 }, { width: 11 }, { width: 8 }, { width: 10 }, { width: 10 }, { width: 11 },
          { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 },
        ].concat(days.map(() => ({ width: 4.7 }))).concat([{ width: 9.5 }]);

        // 1행: 일(day) 숫자만 수식으로 표시 (=DAY(같은 열의 2행))
        const row1 = ws.addRow([]);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const cell = row1.getCell(col);
          cell.value = { formula: `DAY(${scheduleColLetter(col)}2)` };
          cell.font = { color: { argb: COLOR.dateGray } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // 2행: 인원정보 항목명 + 날짜(기준 월 칸에서 이어지는 수식 체인)
        const row2 = ws.addRow([]);
        ["", "LDAP", "이름", "사번", "입사일자", "근무시간", "근무", "휴일", "연차", "대휴", "결근"].forEach((h, i) => {
          if (i === 0) return;
          row2.getCell(i + 1).value = h;
        });
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const cell = row2.getCell(col);
          cell.value = { formula: i === 0 ? `${anchorColL}3` : `${scheduleColLetter(col - 1)}2+1` };
          cell.numFmt = "mm/dd";
        });
        row2.getCell(anchorCol).value = "기준 월";
        row2.getCell(anchorCol).font = { bold: true };
        row2.getCell(anchorCol).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.anchorBg } };
        applyBorder(row2.getCell(anchorCol));
        row2.getCell(anchorCol).alignment = { horizontal: "center", vertical: "middle" };

        // 3행: 요일(=TEXT(2행,"AAA")) + 기준일(그 달 1일) 값
        const row3 = ws.addRow([]);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          row3.getCell(col).value = { formula: `TEXT(${scheduleColLetter(col)}2,"AAA")` };
        });
        row3.getCell(anchorCol).value = new Date(year, monthIndex, 1);
        row3.getCell(anchorCol).numFmt = 'mm"월" dd"일"';
        applyBorder(row3.getCell(anchorCol));
        row3.getCell(anchorCol).alignment = { horizontal: "center", vertical: "middle" };

        [row2, row3].forEach((row) => {
          for (let c = 2; c <= totalCols; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.headerBg } };
            cell.font = Object.assign({ color: { argb: COLOR.headerText } }, cell.font);
            cell.alignment = { horizontal: "center", vertical: "middle" };
            applyBorder(cell);
          }
        });
        for (let c = 2; c <= infoCols; c++) ws.mergeCells(2, c, 3, c);

        function addStaffRow(s) {
          const row = ws.addRow([]);
          const r = row.number;
          row.getCell(1).value = { formula: `C${r}` };
          row.getCell(2).value = s.nickname || "";
          row.getCell(3).value = s.name || "";
          row.getCell(4).value = s.empNo || "";
          if (s.hireDate) {
            row.getCell(5).value = new Date(s.hireDate);
            row.getCell(5).numFmt = "yyyy-mm-dd";
          }
          row.getCell(6).value = s.workHours || "";

          const rangeRef = `${firstDayColL}${r}:${lastDayColL}${r}`;
          const rangeAbs = `$${firstDayColL}${r}:$${lastDayColL}${r}`;
          // 근무=근무일(SUM)+반차+공가, 휴일=휴일류(육휴·특휴·대휴·공휴 포함) 개수,
          // 연차/대휴/결근은 해당 라벨 개수를 그대로 센다.
          row.getCell(7).value = { formula: `SUM(${rangeRef})+COUNTIF(${rangeRef},"반차")+COUNTIF(${rangeRef},"공가")` };
          row.getCell(8).value = { formula: `COUNTIF(${rangeAbs},H$2)+COUNTIF(${rangeAbs},"육휴")+COUNTIF(${rangeAbs},"특휴")+COUNTIF(${rangeAbs},"대휴")+COUNTIF(${rangeAbs},"공휴")` };
          row.getCell(9).value = { formula: `COUNTIF(${rangeAbs},I$2)` };
          row.getCell(10).value = { formula: `COUNTIF(${rangeAbs},J$2)` };
          row.getCell(11).value = { formula: `COUNTIF(${rangeAbs},K$2)` };

          for (let c = 2; c <= totalCols; c++) {
            applyBorder(row.getCell(c));
            row.getCell(c).alignment = { horizontal: "center", vertical: "middle" };
          }
          for (let c = 7; c <= 11; c++) {
            const amountCell = row.getCell(c);
            amountCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.amountBg } };
            amountCell.numFmt = '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@';
          }
          row.getCell(2).font = { bold: true, color: { argb: COLOR.nickname } };
          // 이름 칸에 남긴 메모도 셀 메모처럼 엑셀 "메모(노트)"로 넣는다.
          const nameMemo = getScheduleNameMemo(s.id, year, monthIndex);
          if (nameMemo) {
            row.getCell(3).note = { texts: [{ text: nameMemo }], margins: { insetmode: "auto" } };
          }

          days.forEach((d, i) => {
            const col = infoCols + 1 + i;
            const cell = row.getCell(col);
            const dateKey = scheduleDateKey(year, monthIndex, d);
            const appLabel = scheduleCellDisplay(getScheduleRecord(s.id, dateKey)).label;
            // 화면·복사/붙여넣기 등 앱 내부에서는 "오프"라는 값을 그대로 쓰지만,
            // 엑셀 내보내기에서는(헤더도 "휴일"로 통일했으므로) 이 칸의 표시 값도
            // "휴일"로 바꿔서 써야 헤더 문구·COUNTIF(H$2 등) 수식과 어긋나지 않는다.
            const label = appLabel === "오프" ? "휴일" : appLabel;
            // 근무("1")는 SUM 수식이 실제로 더할 수 있게 문자열이 아닌 숫자로 넣는다.
            cell.value = label === "1" ? 1 : label;
            const fillArgb = STATUS_FILL[label];
            if (fillArgb) {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillArgb } };
              cell.font = { bold: label === "지각" || label === "결근", color: { argb: STATUS_TEXT[label] || COLOR.nickname } };
            }
            // 화면에서 남긴 셀 메모는 엑셀에서 "메모(노트)"로 그대로 들어간다.
            const memo = getScheduleMemo(s.id, dateKey);
            if (memo) {
              cell.note = { texts: [{ text: memo }], margins: { insetmode: "auto" } };
            }
          });
          return r;
        }

        // "주간"/"야간" 같은 조 라벨 한 줄(굵은 빨강 글자 + 인원 수). 채팅/유선 구분 없이
        // 짧게 표시만 하고, 별도 배경색·테두리는 넣지 않는다.
        function addGroupLabelRow(label, count) {
          const row = ws.addRow([]);
          row.getCell(2).value = label;
          row.getCell(2).font = { bold: true, color: { argb: COLOR.groupLabel } };
          row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
          row.getCell(3).value = count;
          row.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
          row.height = 15;
          return row.number;
        }

        // range의 각 날짜 열에서 근무("1")+반차 0.5명을 더한 인원 집계 행.
        function addPersonSummaryRow(label, range) {
          const row = ws.addRow([]);
          ws.mergeCells(row.number, 2, row.number, infoCols);
          row.getCell(2).value = label;
          days.forEach((d, i) => {
            const col = infoCols + 1 + i;
            const colL = scheduleColLetter(col);
            row.getCell(col).value = { formula: `COUNTIF(${colL}${range.start}:${colL}${range.end},"1")+(COUNTIF(${colL}${range.start}:${colL}${range.end},"반차")*0.5)` };
          });
          for (let c = 2; c <= totalCols; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.summary } };
            cell.font = { color: { argb: COLOR.summaryText } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            applyBorder(cell);
          }
          return row.number;
        }

        function addTotalRow(label, rowNums) {
          const row = ws.addRow([]);
          ws.mergeCells(row.number, 2, row.number, infoCols);
          row.getCell(2).value = label;
          days.forEach((d, i) => {
            const col = infoCols + 1 + i;
            const colL = scheduleColLetter(col);
            row.getCell(col).value = { formula: `SUM(${rowNums.map((rn) => `${colL}${rn}`).join("+")})` };
          });
          for (let c = 2; c <= totalCols; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.total } };
            cell.font = { color: { argb: COLOR.totalText }, bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            applyBorder(cell);
          }
          return row.number;
        }

        // groupLabel(주간/야간) 한 조 전체를 쓴다. 통합 시트(singleTypeLabel 없음)는 채팅/유선을
        // 나눠 각각 인원 집계행을 만들고, 채팅/유선 시트는 이미 한 업무 구분만 모여 있으므로
        // 나누지 않고 인원 집계행 하나만 만든다.
        function addGroupBlock(groupLabel, groupStaff) {
          addGroupLabelRow(groupLabel, groupStaff.length);
          // 샘플 양식과 동일하게: "주간" 조의 집계행에만 "총"을 붙이고("주간 총 채팅 인원"),
          // "야간" 조는 붙이지 않는다("야간 채팅 인원").
          const totalPrefix = groupLabel === "주간" ? `${groupLabel} 총` : groupLabel;
          if (!singleTypeLabel) {
            const { chat, voice, etc } = splitByType(groupStaff);
            let chatRange = null, voiceRange = null;
            if (chat.length > 0) { const start = ws.rowCount + 1; chat.forEach(addStaffRow); chatRange = { start, end: ws.rowCount }; }
            if (voice.length > 0) { const start = ws.rowCount + 1; voice.forEach(addStaffRow); voiceRange = { start, end: ws.rowCount }; }
            if (etc.length > 0) etc.forEach(addStaffRow);
            const result = {};
            if (chatRange) result.chatRow = addPersonSummaryRow(`${totalPrefix} 채팅 인원`, chatRange);
            if (voiceRange) result.voiceRow = addPersonSummaryRow(`${totalPrefix} 유선 인원`, voiceRange);
            return result;
          }
          const start = ws.rowCount + 1;
          groupStaff.forEach(addStaffRow);
          return { sumRow: addPersonSummaryRow(`${totalPrefix} ${singleTypeLabel} 인원`, { start, end: ws.rowCount }) };
        }

        if (adminStaff.length === 0 && dayStaff.length === 0 && nightStaff.length === 0) {
          ws.getCell(4, 2).value = "등록된 인원이 없어요.";
        } else {
          if (adminStaff.length > 0) adminStaff.forEach(addStaffRow);
          let dayRes = null, nightRes = null;
          if (dayStaff.length > 0) dayRes = addGroupBlock("주간", dayStaff);
          if (nightStaff.length > 0) nightRes = addGroupBlock("야간", nightStaff);
          if (singleTypeLabel && dayRes && nightRes) {
            addTotalRow(`주/야간 총 ${singleTypeLabel} 출근 인원`, [dayRes.sumRow, nightRes.sumRow]);
          }
        }

        // 셀마다 색상·굵기 등은 이미 위에서 개별로 지정했으므로, 그 속성은 그대로 두고
        // 폰트 크기만 기본 10으로 통일해준다.
        ws.eachRow((row) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = Object.assign({}, cell.font, { size: 8 });
          });
        });
      }

      buildSheet("통합", monthStaff);
      const chatStaff = monthStaff.filter((s) => (s.types || []).indexOf("채팅") !== -1);
      const voiceStaff = monthStaff.filter((s) => (s.types || []).indexOf("유선") !== -1);
      if (chatStaff.length > 0) buildSheet("채팅", chatStaff, "채팅");
      if (voiceStaff.length > 0) buildSheet("유선", voiceStaff, "유선");

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `월별상담사스케줄_${year}${pad2(monthIndex + 1)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      flashScheduleStatus("엑셀 파일을 다운로드했어요.");
    } catch (err) {
      console.error(err);
      flashScheduleStatus("엑셀 파일을 만들지 못했어요.");
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CHART + " 엑셀로 다운로드"; }
    }
  }

  // buildScheduleTableHtml의 filterMode와 같은 기준으로, 캡처 대상 인원만 골라
  // "이번 달 지각·결근 기록"도 캡처된 표 안의 인원과 항상 일치하도록 한다.

  // 07a5-schedule-log-capture.js — 변경 로그, 표 크기 맞춤, 이미지 캡처
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleLogStaffForFilter(monthStaff, filterMode) {
    if (!filterMode) return monthStaff;
    if (filterMode === "ADMIN") return monthStaff.filter((s) => s.isAdmin);
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    if (filterMode === "DAY") return nonAdmin.filter((s) => s.group !== "night");
    if (filterMode === "NIGHT") return nonAdmin.filter((s) => s.group === "night");
    if (filterMode === "VOICE") return nonAdmin.filter((s) => (s.types || []).indexOf("유선") !== -1);
    if (filterMode === "CHAT") return nonAdmin.filter((s) => (s.types || []).indexOf("채팅") !== -1);
    return monthStaff;
  }

  function buildScheduleLogHtml(filterMode) {
    const { year, monthIndex } = scheduleUi;
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const monthStaff = scheduleLogStaffForFilter(getStaffListForMonth(year, monthIndex), filterMode);
    const entries = [];
    for (let d = 1; d <= numDays; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      monthStaff.forEach((s) => {
        const rec = scheduleData.records[scheduleRecordKey(s.id, dateKey)];
        if (rec && rec.attendance) {
          entries.push({ dateKey, d, staff: s, attendance: rec.attendance });
        }
      });
    }
    if (entries.length === 0) {
      return `<div class="agent-list-empty">이번 달에는 등록된 지각·결근 기록이 없어요.</div>`;
    }
    const items = entries.map((e) => {
      const tagCls = e.attendance === "LATE" ? "late" : "absent";
      const tagLabel = e.attendance === "LATE" ? "지각" : "결근";
      return `
        <div class="sch-log-item">
          <span class="sch-log-date">${pad2(monthIndex + 1)}/${pad2(e.d)}</span>
          <span class="sch-log-name">${esc(e.staff.nickname)} · ${esc(e.staff.name)}</span>
          <span class="sch-log-tag ${tagCls}">${tagLabel}</span>
          <button class="sch-staff-btn sch-log-clear" data-action="clear-sch-attendance" data-staff-id="${e.staff.id}" data-date="${e.dateKey}">되돌리기</button>
        </div>
      `;
    }).join("");
    return `<div class="sch-log-list">${items}</div>`;
  }

  function syncScheduleLogWidth() {
    const tableWrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const logArea = document.getElementById("schedule-log-area");
    if (!tableWrap || !logArea) return;
    const w = tableWrap.offsetWidth;
    if (w > 0) {
      logArea.style.width = `${w}px`;
      logArea.style.maxWidth = "100%";
    }
  }

  // 메인 페이지의 월별 스케줄 표는 가로 스크롤 없이 항상 한 화면에 다 보이도록,
  // 표를 원래 크기로 그린 뒤 폭에 맞춰 JS로 축소(scale)한다.
  // (예전엔 축소 비율이 일정 밑으로 내려가면 더 줄이지 않고 가로 스크롤로 넘기게 했었는데,
  //  그러면 오른쪽 날짜 칸들이 화면 밖으로 잘려서 안 보이는 문제가 있었다. 그래서 지금은
  //  글씨가 아무리 작아지더라도 항상 폭에 딱 맞춰 전체 날짜가 한 번에 다 보이게 한다.)
  function fitScheduleTable() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const inner = wrap ? wrap.querySelector(".schedule-scale-inner") : null;
    const table = inner ? inner.querySelector("table") : null;
    if (!wrap || !inner || !table) return;
    inner.style.transform = "none";
    inner.style.width = "auto";
    inner.style.height = "auto";
    wrap.style.height = "auto";
    // 모바일 화면에서는 표를 억지로 축소해서 글씨를 읽을 수 없게 만드는 대신,
    // 표를 원래 크기 그대로 두고 가로 스크롤(스크린 좌우로 넘기기)로 보게 한다.
    // (고정된 인원 정보 열이 sticky로 남아있어 스크롤해도 어떤 상담사인지 계속 보임)
    if (window.innerWidth <= 720) return;
    const naturalW = table.offsetWidth;
    const naturalH = table.offsetHeight;
    const availW = wrap.clientWidth;
    if (naturalW <= 0 || availW <= 0) return;
    const scale = Math.min(availW / naturalW, 1);
    const scaledW = naturalW * scale;
    const offsetX = Math.max(0, (availW - scaledW) / 2);
    inner.style.width = `${naturalW}px`;
    inner.style.height = `${naturalH}px`;
    inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    wrap.style.overflowX = "hidden";
    wrap.style.height = `${naturalH * scale}px`;
  }


  // 브라우저 페이지 스크롤 시 월별 스케줄의 날짜/요일 헤더를 화면 상단에 고정한다.
  // 표 자체는 기존처럼 가로 스크롤/폭 맞춤을 유지하고, 고정 상태에서는 헤더만 복제해
  // viewport 위에 올린다. 이렇게 하면 overflow-x 컨테이너 때문에 native position:sticky가
  // 페이지 스크롤에 묶이는 브라우저별 차이를 피할 수 있다.
  let _scheduleStickyHead = null;
  let _scheduleStickySource = null;
  let _scheduleStickyListenersAttached = false;

  function scheduleStickyHeadEnsure() {
    if (_scheduleStickyHead && _scheduleStickyHead.isConnected) return _scheduleStickyHead;
    const el = document.createElement("div");
    el.id = "schedule-sticky-head";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:0;top:0;display:none;overflow:hidden;pointer-events:none;z-index:80;background:var(--panel);border-bottom:1px solid var(--hairline-strong);box-shadow:0 3px 10px -6px #00000080;box-sizing:border-box;";
    document.body.appendChild(el);
    _scheduleStickyHead = el;
    return el;
  }

  function scheduleStickyHeadHide() {
    if (_scheduleStickyHead) _scheduleStickyHead.style.display = "none";
    _scheduleStickySource = null;
  }

  function scheduleStickyHeadRebuild(table) {
    const el = scheduleStickyHeadEnsure();
    if (!table) { scheduleStickyHeadHide(); return; }
    const sourceHead = table.querySelector("thead");
    if (!sourceHead) { scheduleStickyHeadHide(); return; }
    el.innerHTML = "";
    const clone = table.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.add("schedule-sticky-clone");
    const tbody = clone.querySelector("tbody");
    if (tbody) {
      tbody.style.visibility = "hidden";
      tbody.style.pointerEvents = "none";
    }
    clone.style.margin = "0";
    clone.style.transformOrigin = "top left";
    el.appendChild(clone);
    _scheduleStickySource = table;
  }

  function scheduleStickyHeadSync() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const table = wrap ? wrap.querySelector(".schedule-table") : null;
    if (!wrap || !table || !table.tHead) { scheduleStickyHeadHide(); return; }

    const tableRect = table.getBoundingClientRect();
    const headRect = table.tHead.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const headHeight = Math.ceil(headRect.height);

    // 표가 화면을 지나간 뒤부터, 표 하단이 화면 위로 완전히 사라지기 전까지만 고정.
    const shouldShow = tableRect.top < 0 && tableRect.bottom > headHeight && headHeight > 0;
    if (!shouldShow) { scheduleStickyHeadHide(); return; }

    if (_scheduleStickySource !== table) scheduleStickyHeadRebuild(table);
    const el = scheduleStickyHeadEnsure();
    const clone = el.querySelector(".schedule-sticky-clone");
    if (!clone) return;

    const naturalWidth = Math.max(1, table.offsetWidth);
    const renderedWidth = Math.max(1, tableRect.width);
    const scale = renderedWidth / naturalWidth;
    const renderedHeight = headHeight;

    // tableRect.left는 데스크톱 축소/중앙정렬 및 모바일 가로스크롤을 모두 반영한다.
    el.style.left = `${Math.round(tableRect.left)}px`;
    el.style.top = "0px";
    el.style.width = `${Math.max(0, Math.min(window.innerWidth - Math.max(0, tableRect.left), renderedWidth))}px`;
    el.style.height = `${renderedHeight}px`;
    el.style.display = "block";

    clone.style.width = `${naturalWidth}px`;
    clone.style.transform = `scale(${scale})`;
    clone.style.transformOrigin = "top left";

    // 원본 헤더의 2행 sticky CSS는 복제본에서는 불필요하고 오히려 top offset을 만들 수 있으므로 해제.
    clone.querySelectorAll("thead th").forEach((th) => {
      th.style.position = "static";
      th.style.top = "auto";
    });
  }

  function scheduleStickyHeadBind() {
    if (_scheduleStickyListenersAttached) return;
    _scheduleStickyListenersAttached = true;
    window.addEventListener("scroll", scheduleStickyHeadSync, { passive: true });
    window.addEventListener("resize", scheduleStickyHeadSync, { passive: true });
    document.addEventListener("scroll", scheduleStickyHeadSync, { passive: true, capture: true });
  }

  // wrap의 너비를 안정적으로 관찰해서, 폰트 늦게 로드/레이아웃 지연/화면 회전 등
  // 어떤 이유로 폭이 나중에 바뀌더라도 항상 다시 맞춤 계산되도록 한다.
  // (단순 window resize 이벤트만으로는 컨테이너 폭만 바뀌는 경우를 놓칠 수 있음)
  let _scheduleFitObserver = null;
  function watchScheduleTableSize() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    if (!wrap) return;
    if (_scheduleFitObserver) _scheduleFitObserver.disconnect();
    if (typeof ResizeObserver === "undefined") return;
    let lastW = 0;
    _scheduleFitObserver = new ResizeObserver((entries) => {
      const w = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
      if (Math.abs(w - lastW) < 1) return;
      lastW = w;
      fitScheduleTable();
      syncScheduleLogWidth();
    });
    _scheduleFitObserver.observe(wrap);
  }

  function updateScheduleTableArea() {
    const tableArea = document.getElementById("schedule-table-area");
    const logArea = document.getElementById("schedule-log-area");
    if (tableArea) {
      tableArea.innerHTML = `<div class="schedule-table-wrap"><div class="schedule-scale-inner">${buildScheduleTableHtml()}</div></div>`;
      attachScheduleTableHandlers(tableArea);
    }
    if (logArea) {
      logArea.innerHTML = buildScheduleLogHtml();
      attachScheduleLogHandlers(logArea);
    }
    fitScheduleTable();
    syncScheduleLogWidth();
    watchScheduleTableSize();
    scheduleStickyHeadBind();
    requestAnimationFrame(scheduleStickyHeadSync);
  }

  // 월별 스케줄 표를 통째로 PNG 이미지로 캡처해서 다운로드한다.
  // 화면에 보이는 축소된 표 대신, 화면 밖에 원본 크기 그대로 다시 그려서 캡처하기 때문에
  // 화면 크기와 상관없이 항상 선명하고 잘리지 않은 이미지가 만들어진다.
  // 캡처 이미지의 배경/글자/범례 색은 하드코딩하지 않고, 캡처하는 시점에 실제 적용 중인
  // 다크모드/라이트모드 색상 변수를 그대로 읽어와 사용한다. (라이트모드에서 캡처해도
  // 검은 배경으로 나오지 않고, 현재 화면과 같은 톤으로 저장됨)
  // mode: "ALL"(기본, 전체) / "DAY"(주간) / "NIGHT"(야간) / "VOICE"(유선, 주야간 통합)
  // / "CHAT"(채팅, 주야간 통합). buildScheduleTableHtml·buildScheduleLogHtml에는
  // "ALL"일 때만 filterMode 없이(undefined) 넘겨서 지금까지와 완전히 같은 전체 표를 유지한다.
  function captureSchedulePage(mode) {
    const captureMode = mode || "ALL";
    const modeMeta = SCHEDULE_CAPTURE_MODES.find((m) => m.key === captureMode) || SCHEDULE_CAPTURE_MODES[0];
    const modeName = modeMeta.label.replace(/ 저장$/, "");
    const tableFilter = captureMode === "ALL" ? undefined : captureMode;
    const btn = document.getElementById("sch-capture-btn");
    if (typeof html2canvas === "undefined") {
      flashScheduleStatus("캡처 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "이미지 생성 중..."; }

    const cs = getComputedStyle(document.documentElement);
    const themeColor = (name) => cs.getPropertyValue(name).trim();
    const cBg = themeColor("--bg");
    const cText = themeColor("--text");
    const cTextDim = themeColor("--text-dim");
    const cBlue = themeColor("--blue");
    const cOrange = themeColor("--orange");
    const cGreen = themeColor("--green");
    const cSalmon = themeColor("--salmon");
    const cTeal = themeColor("--teal");
    const cPurple = themeColor("--purple");
    const cPink = themeColor("--pink");
    const cIndigo = themeColor("--indigo");
    const cAmber = themeColor("--amber");
    const cRed = themeColor("--red");
    const cFaint = themeColor("--text-faint");

    const wrapper = document.createElement("div");
    wrapper.className = "sch-capture-flatten";
    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";
    wrapper.style.top = "0";
    wrapper.style.background = cBg;
    wrapper.style.padding = "28px";
    wrapper.style.fontFamily = "'KoPub Dotum', system-ui, sans-serif";
    wrapper.style.color = cText;
    wrapper.style.width = "fit-content";
    wrapper.style.maxWidth = "none";
    wrapper.style.overflow = "visible";
    const lockedTag = scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;
    wrapper.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;color:${cText};">월별 스케줄${titleSuffix}</div>
      <div style="font-size:15px;color:${cTextDim};margin-bottom:16px;">${esc(scheduleMonthLabel())}${lockedTag} · 캡처일 ${esc(todayISO())}</div>
      <div class="schedule-legend" style="margin-bottom:14px;">
        <span class="item"><span class="swatch" style="background:${cBlue};"></span>휴일</span>
        <span class="item"><span class="swatch" style="background:${cOrange};"></span>연차</span>
        <span class="item"><span class="swatch" style="background:${cGreen};"></span>대휴</span>
        <span class="item"><span class="swatch" style="background:${cSalmon};"></span>반차</span>
        <span class="item"><span class="swatch" style="background:${cTeal};"></span>공휴</span>
        <span class="item"><span class="swatch" style="background:${cPurple};"></span>공가</span>
        <span class="item"><span class="swatch" style="background:${cPink};"></span>육휴</span>
        <span class="item"><span class="swatch" style="background:${cIndigo};"></span>특휴 · 교육</span>
        <span class="item"><span class="swatch" style="background:${cAmber};"></span>지각</span>
        <span class="item"><span class="swatch" style="background:${cRed};"></span>결근</span>
        <span class="item"><span class="swatch" style="background:${cFaint};"></span>퇴사</span>
      </div>
      ${buildScheduleTableHtml(tableFilter, true, true, true)}
    `;
    document.body.appendChild(wrapper);

    function cleanup(label) {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CAMERA + " 이미지로 저장 ▾"; }
      if (label) flashScheduleStatus(label);
    }

    requestAnimationFrame(() => {
      const fullW = wrapper.scrollWidth;
      const fullH = wrapper.scrollHeight;
      html2canvas(wrapper, {
        backgroundColor: cBg,
        scale: 2,
        width: fullW,
        height: fullH,
        windowWidth: fullW,
        windowHeight: fullH,
      }).then((canvas) => {
        const fileSuffix = captureMode === "ALL" ? "" : `_${modeName}`;
        const filename = `상담사_스케줄${fileSuffix}_${scheduleUi.year}-${pad2(scheduleUi.monthIndex + 1)}.png`;
        const dataUrl = canvas.toDataURL("image/png");
        cleanup("");
        openSchedulePreview(dataUrl, filename, captureMode === "ALL" ? null : modeName);
      }).catch((err) => {
        console.error(err);
        cleanup("캡처 실패");
      });
    });
  }

  function closeScheduleMenu() {
    const existing = document.getElementById("sch-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", scheduleMenuOutsideHandler, true);
    scheduleClearSelection();
  }
  function scheduleMenuOutsideHandler(e) {
    const menu = document.getElementById("sch-menu");
    if (menu && !menu.contains(e.target)) closeScheduleMenu();
  }
  // ----- 스케줄 셀 드래그로 여러 칸 선택 후 한 번에 상태 적용 -----
  // 마우스로 셀을 누른 채 다른 셀 위로 드래그하면(행·열 사각형 범위) 선택되고,
  // 뗄 때 상태 선택 메뉴가 한 번만 뜬다. 드래그 없이 그냥 클릭하면 기존처럼
  // 그 칸 하나만 다루는 메뉴(openScheduleMenu)가 뜬다.
  let scheduleSelectDragging = false;
  let scheduleSelectMoved = false;
  let scheduleSelectAnchor = null; // { rowIdx, day }
  let scheduleSelectCurrent = null; // { rowIdx, day }

  // 07a6-schedule-cell-edit.js — 셀 선택/편집/키보드 핸들링
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleSelectionRectCells(root, anchor, current) {
    if (!root || !anchor || !current) return [];
    const minRow = Math.min(anchor.rowIdx, current.rowIdx);
    const maxRow = Math.max(anchor.rowIdx, current.rowIdx);
    const minDay = Math.min(anchor.day, current.day);
    const maxDay = Math.max(anchor.day, current.day);
    return Array.from(root.querySelectorAll(".sch-cell")).filter((cell) => {
      const rowIdx = Number(cell.getAttribute("data-row-idx"));
      const day = Number(cell.getAttribute("data-day"));
      return rowIdx >= minRow && rowIdx <= maxRow && day >= minDay && day <= maxDay;
    });
  }
  function scheduleApplySelectionHighlight() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    const selected = new Set(scheduleSelectionRectCells(root, scheduleSelectAnchor, scheduleSelectCurrent));
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      cell.classList.toggle("sch-cell--selected", selected.has(cell));
    });
  }
  function scheduleClearSelection() {
    scheduleSelectDragging = false;
    scheduleSelectMoved = false;
    scheduleSelectAnchor = null;
    scheduleSelectCurrent = null;
    const root = document.getElementById("schedule-table-area");
    if (root) root.querySelectorAll(".sch-cell--selected").forEach((cell) => cell.classList.remove("sch-cell--selected"));
  }
  // 선택된 여러 칸에 상태를 한 번에 적용한다. 칸마다 저장하지 않고 한 번만 저장/동기화한다.
  function scheduleApplyBulk(cells, patch) {
    if (cells.length) recordUndo(`셀 ${cells.length}개 일괄 변경`, SCHEDULE_KEY, reloadScheduleData);
    cells.forEach((cell) => {
      const staffId = cell.getAttribute("data-staff-id");
      const dateKey = cell.getAttribute("data-date");
      const key = scheduleRecordKey(staffId, dateKey);
      const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
      const next = Object.assign({}, cur, patch);
      if (next.status === "WORK" && !next.attendance) delete scheduleData.records[key];
      else scheduleData.records[key] = next;
    });
    saveScheduleData();
  }
  const SCHEDULE_STATUS_OPTIONS = [
    ["WORK", null, "근무"],
    ["OFF", null, "휴일"],
    ["ANNUAL", null, "연차"],
    ["DAEHYU", null, "대휴"],
    ["HALF", null, "반차"],
    ["GONGHYU", null, "공휴"],
    ["GONGGA", null, "공가"],
    ["MATERNITY", null, "육휴"],
    ["SPECIAL", null, "특휴"],
    ["EDUCATION", null, "교육"],
    ["WORK", "LATE", "지각"],
    ["WORK", "ABSENT", "결근"],
    ["RESIGNED", null, "퇴사"],
  ];
  function openScheduleBulkMenu(cells, evt) {
    // 선택 범위 안에 잠긴 달의 날짜가 하나라도 있으면 전체를 막는다 (개별 셀 잠금 규칙과 동일).
    const lockedFound = cells.some((cell) => scheduleIsDateLocked(cell.getAttribute("data-date")));
    if (lockedFound) {
      flashScheduleStatus("선택한 범위에 잠긴 달이 포함돼 있어요. 잠금을 해제한 뒤 다시 선택해주세요.");
      scheduleClearSelection();
      return;
    }
    closeScheduleMenu();
    cells.forEach((cell) => cell.classList.add("sch-cell--selected")); // closeScheduleMenu가 지운 하이라이트를 다시 표시
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = `<div class="sch-menu-title">${cells.length}칸 선택됨</div>` +
      SCHEDULE_STATUS_OPTIONS.map((o) =>
        `<button type="button" data-status="${o[0]}" data-attendance="${o[1] || ""}">${o[2]}</button>`
      ).join("") +
      `<button type="button" class="sch-menu-reset" data-reset="1">기본값(근무)으로</button>`;
    document.body.appendChild(menu);
    const clientX = evt ? evt.clientX : window.innerWidth / 2;
    const clientY = evt ? evt.clientY : window.innerHeight / 2;
    const top = Math.min(clientY + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(clientX, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    function applyAndClose(status, attendance) {
      scheduleApplyBulk(cells, { status, attendance: attendance || null });
      closeScheduleMenu();
      updateScheduleTableArea();
      flashScheduleStatus(`${cells.length}칸에 적용했어요.`);
    }
    menu.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.onclick = () => applyAndClose(btn.getAttribute("data-status"), btn.getAttribute("data-attendance"));
    });
    const resetBtn = menu.querySelector("[data-reset]");
    if (resetBtn) resetBtn.onclick = () => applyAndClose("WORK", null);
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }
  // 마우스를 뗄 때(문서 전체 기준): 드래그해서 여러 칸을 옮겨다녔으면 일괄 적용 메뉴를 띄우고,
  // 그냥 제자리에서 뗐으면(=클릭) 선택만 풀고 끝낸다. 그 칸 하나의 메뉴(상태 변경 등)는
  // 더 이상 왼쪽 클릭으로 열리지 않고, 셀의 오른쪽 클릭(우클릭, oncontextmenu)으로 연다.
  function scheduleSelectionMouseUpHandler(e) {
    if (!scheduleSelectDragging) return;
    const root = document.getElementById("schedule-table-area");
    const wasMoved = scheduleSelectMoved;
    const anchor = scheduleSelectAnchor;
    const current = scheduleSelectCurrent;
    scheduleSelectDragging = false;
    if (wasMoved && root) {
      const cells = scheduleSelectionRectCells(root, anchor, current);
      if (cells.length > 1) {
        openScheduleBulkMenu(cells, e);
        return;
      }
    }
    scheduleClearSelection();
  }
  document.addEventListener("mouseup", scheduleSelectionMouseUpHandler);

  function openScheduleMenu(anchorEl, staffId, dateKey) {
    closeScheduleMenu();
    const locked = scheduleIsDateLocked(dateKey);
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    if (locked) {
      // 잠긴 달은 수정은 막되, 수정 이력만큼은 그대로 볼 수 있게 한다.
      menu.innerHTML = `<div class="sch-menu-title">잠긴 달이에요</div>`
        + `<button type="button" data-history="1">${ICON_CLOCK || ""} 수정 이력 보기</button>`;
    } else {
      const options = SCHEDULE_STATUS_OPTIONS;
      const hasMemo = !!getScheduleMemo(staffId, dateKey);
      const memoLabel = hasMemo ? `${ICON_NOTE || ""} 메모 수정` : `${ICON_NOTE || ""} 메모 추가`;
      const memoDeleteBtnHtml = hasMemo ? `<button type="button" class="sch-menu-danger" data-memo-delete="1">${ICON_TRASH || ""} 메모 삭제</button>` : "";
      menu.innerHTML = options.map((o) =>
        `<button type="button" data-status="${o[0]}" data-attendance="${o[1] || ""}">${o[2]}</button>`
      ).join("")
        + `<div class="sch-menu-divider"></div>`
        + `<button type="button" data-memo="1">${memoLabel}</button>`
        + memoDeleteBtnHtml
        + `<button type="button" data-history="1">${ICON_CLOCK || ""} 수정 이력 보기</button>`
        + `<button type="button" class="sch-menu-reset" data-reset="1">기본값(근무)으로</button>`;
    }
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.onclick = () => {
        setScheduleRecord(staffId, dateKey, { status: btn.getAttribute("data-status"), attendance: btn.getAttribute("data-attendance") || null });
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    });
    const memoBtn = menu.querySelector("[data-memo]");
    if (memoBtn) {
      memoBtn.onclick = () => {
        closeScheduleMenu();
        openScheduleMemoModal(staffId, dateKey);
      };
    }
    const memoDeleteBtn = menu.querySelector("[data-memo-delete]");
    if (memoDeleteBtn) {
      memoDeleteBtn.onclick = () => {
        setScheduleMemo(staffId, dateKey, "");
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    }
    const resetBtn = menu.querySelector("[data-reset]");
    if (resetBtn) {
      resetBtn.onclick = () => {
        setScheduleRecord(staffId, dateKey, { status: "WORK", attendance: null });
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    }
    const historyBtn = menu.querySelector("[data-history]");
    if (historyBtn) {
      historyBtn.onclick = () => {
        closeScheduleMenu();
        openScheduleCellHistoryModal(staffId, dateKey);
      };
    }
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // ----- 스케줄 셀 "수정 이력" -----
  // 스케줄 저장은 전체 스케줄 데이터를 한 번에 저장하는 구조라, 실제 변경 이력은
  // 계정 활동 로그(appendActivityLog)에 "records.{staffId}|{dateKey}...", "memos.{staffId}|{dateKey}..."
  // 형태의 일반 diff 텍스트로 이미 쌓이고 있다. 이 함수들은 그 로그에서 특정 셀(사람×날짜)에
  // 해당하는 줄만 골라내 사람이 읽기 쉬운 문장으로 바꿔준다.
  function scheduleHistoryStatusLabel(status, attendance) {
    if (status === "WORK" && attendance === "LATE") return "지각";
    if (status === "WORK" && attendance === "ABSENT") return "결근";
    if (status === "WORK") return "근무";
    const meta = SCHEDULE_STATUS_META[status];
    return meta ? meta.label : (status || "근무");
  }
  function scheduleHistoryTranslateFieldValue(fieldName, raw) {
    if (raw === "(없음)" || raw === "(비어있음)" || raw === "(빈 값)") return "없음";
    if (fieldName === "status") {
      if (raw === "WORK") return "근무";
      const meta = SCHEDULE_STATUS_META[raw];
      return meta ? meta.label : raw;
    }
    if (fieldName === "attendance") {
      if (raw === "LATE") return "지각";
      if (raw === "ABSENT") return "결근";
      return raw;
    }
    return raw;
  }
  function scheduleHistoryDescribeBlob(raw) {
    if (raw === "(없음)" || raw === "(비어있음)" || raw === "(빈 값)") return "없음";
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object" && "status" in obj) return scheduleHistoryStatusLabel(obj.status, obj.attendance);
    } catch (e) { /* 잘렸거나 JSON이 아니면 원문 그대로 보여준다 */ }
    return raw;
  }
  // 활동 로그 한 줄(예: "[14:32] 월별 스케줄 — records.abc123|2026-08-12.status: WORK → OFF")에서
  // 이 셀(cellKey)에 해당하는 부분만 사람이 읽기 쉬운 { time, text } 형태로 뽑아낸다.
  // 이 셀과 무관한 줄이면 null을 돌려준다.
  function scheduleDescribeCellHistoryLine(cellKey, rawLine) {
    const sepIdx = rawLine.indexOf(" — ");
    if (sepIdx === -1) return null;
    const prefix = rawLine.slice(0, sepIdx);
    const content = rawLine.slice(sepIdx + 3);
    const timeMatch = /^\[(\d{2}:\d{2})\]/.exec(prefix);
    const time = timeMatch ? timeMatch[1] : "";
    const recPrefix = `records.${cellKey}`;
    const memoPrefix = `memos.${cellKey}`;
    let isMemo = false, rest = null;
    if (content.indexOf(recPrefix) === 0) rest = content.slice(recPrefix.length);
    else if (content.indexOf(memoPrefix) === 0) { isMemo = true; rest = content.slice(memoPrefix.length); }
    if (rest === null) return null;
    let m = /^\.(\w+): (.*) → (.*)$/.exec(rest);
    if (m) {
      const fieldName = m[1];
      if (isMemo) return { time, text: `메모: "${m[2]}" → "${m[3]}"` };
      const fieldLabel = fieldName === "status" ? "근태" : (fieldName === "attendance" ? "출결" : fieldName);
      const oldLabel = scheduleHistoryTranslateFieldValue(fieldName, m[2]);
      const newLabel = scheduleHistoryTranslateFieldValue(fieldName, m[3]);
      return { time, text: `${fieldLabel}: ${oldLabel} → ${newLabel}` };
    }
    m = /^: (.*) → (.*)$/.exec(rest);
    if (m) {
      if (isMemo) {
        const oldLabel = (m[1] === "(없음)" || m[1] === "(비어있음)" || m[1] === "(빈 값)") ? "없음" : m[1];
        const newLabel = (m[2] === "(없음)" || m[2] === "(비어있음)" || m[2] === "(빈 값)") ? "없음" : m[2];
        return { time, text: `메모: "${oldLabel}" → "${newLabel}"` };
      }
      return { time, text: `근태: ${scheduleHistoryDescribeBlob(m[1])} → ${scheduleHistoryDescribeBlob(m[2])}` };
    }
    // 정규식으로 못 잡은 형태는 원문이라도 그대로 보여준다(정보 유실 방지).
    return { time, text: rest.replace(/^[.:]\s*/, "") || content };
  }
  // 이 계정(CURRENT_ACCOUNT_ID)의 활동 로그 전체를 훑어서, 특정 사람×날짜 셀에 대한
  // 변경 내역만 최신순으로 모아 돌려준다. { when, who, text }[] 형태.
  // (활동 로그는 이제 변경이 생기자마자 곧바로 activity-log:entries에 기록되므로,
  // 방금 고친 셀도 바로 이 목록에 나타난다. "여러 변경을 묶어서 보여주기"는 마스터
  // 계정의 활동 로그 화면에서만 화면 표시용으로 따로 처리한다.)
  function scheduleCellHistoryEntries(staffId, dateKey) {
    const cellKey = scheduleRecordKey(staffId, dateKey);
    const log = loadActivityLog();
    const out = [];
    log.forEach((entry) => {
      if (entry.accountId !== CURRENT_ACCOUNT_ID) return;
      const lines = Array.isArray(entry.diff) ? entry.diff : [];
      lines.forEach((line) => {
        if (line.indexOf(`records.${cellKey}`) === -1 && line.indexOf(`memos.${cellKey}`) === -1) return;
        const parsed = scheduleDescribeCellHistoryLine(cellKey, line);
        if (!parsed) return;
        const ts = entry.endedAt || entry.at || "";
        const dateStr = formatKSTDateTime(ts).slice(0, 10);
        out.push({
          sortKey: `${ts}|${parsed.time}`,
          when: parsed.time ? `${dateStr} ${parsed.time}` : dateStr,
          who: entry.viaMasterName ? `${entry.accountName || "-"} (마스터 진입: ${entry.viaMasterName})` : (entry.accountName || "-"),
          text: parsed.text,
        });
      });
    });
    out.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
    return out;
  }
  function closeScheduleCellHistoryModal() {
    const existing = document.getElementById("sch-history-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleCellHistoryEscHandler, true);
  }
  function scheduleCellHistoryEscHandler(e) {
    if (e.key === "Escape") closeScheduleCellHistoryModal();
  }
  function openScheduleCellHistoryModal(staffId, dateKey) {
    closeScheduleCellHistoryModal();
    const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
    const d = new Date(`${dateKey}T00:00:00`);
    const wd = isNaN(d.getTime()) ? "" : WEEKDAYS[d.getDay()];
    const dateLabel = wd ? `${dateKey} (${wd})` : dateKey;
    const entries = scheduleCellHistoryEntries(staffId, dateKey);
    const rows = entries.map((e) => `
      <div class="sch-history-row">
        <div class="sch-history-meta"><span class="sch-history-when">${esc(e.when)}</span><span class="sch-history-who">${esc(e.who)}</span></div>
        <div class="sch-history-text">${esc(e.text)}</div>
      </div>
    `).join("");
    const overlay = document.createElement("div");
    overlay.id = "sch-history-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-history-box">
        <div class="sch-preview-head">
          <span>${esc(staff ? staff.name : "")} · ${esc(dateLabel)} 수정 이력</span>
          <button type="button" class="sch-preview-close" id="sch-history-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-history-body">
          <div class="sch-adjust-desc">최근 ${ACTIVITY_LOG_RETENTION_DAYS}일 이내에 이 칸에서 있었던 변경 내역이에요.</div>
          ${rows ? `<div class="sch-history-list">${rows}</div>` : `<div class="sch-adjust-empty">이 칸에는 아직 기록된 변경 이력이 없어요.</div>`}
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-history-close-btn">닫기</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleCellHistoryModal(); };
    document.getElementById("sch-history-close-x").onclick = () => closeScheduleCellHistoryModal();
    document.getElementById("sch-history-close-btn").onclick = () => closeScheduleCellHistoryModal();
    setTimeout(() => document.addEventListener("keydown", scheduleCellHistoryEscHandler, true), 0);
  }

  // ----- 셀 메모 입력 모달 -----
  function closeScheduleMemoModal() {
    const existing = document.getElementById("sch-memo-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleMemoEscHandler, true);
  }
  function scheduleMemoEscHandler(e) {
    if (e.key === "Escape") closeScheduleMemoModal();
  }
  function openScheduleMemoModal(staffId, dateKey) {
    if (scheduleIsDateLocked(dateKey)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.");
      return;
    }
    closeScheduleMemoModal();
    const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
    const current = getScheduleMemo(staffId, dateKey);
    const overlay = document.createElement("div");
    overlay.id = "sch-memo-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-memo-box">
        <div class="sch-preview-head">
          <span>${esc(staff ? staff.name : "")} · ${esc(dateKey)} 메모</span>
          <button type="button" class="sch-preview-close" id="sch-memo-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-memo-body">
          <textarea class="add-input sch-memo-textarea" id="sch-memo-textarea" placeholder="이 날짜에 남길 메모를 입력하세요">${esc(current)}</textarea>
        </div>
        <div class="sch-preview-actions">
          ${current ? `<button type="button" class="ghost-btn danger" id="sch-memo-delete">삭제</button>` : ""}
          <button type="button" class="ghost-btn" id="sch-memo-cancel">취소</button>
          <button type="button" class="primary-btn" id="sch-memo-save">저장</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleMemoModal(); };
    document.getElementById("sch-memo-close-x").onclick = () => closeScheduleMemoModal();
    document.getElementById("sch-memo-cancel").onclick = () => closeScheduleMemoModal();
    const deleteBtn = document.getElementById("sch-memo-delete");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        setScheduleMemo(staffId, dateKey, "");
        closeScheduleMemoModal();
        updateScheduleTableArea();
      };
    }
    document.getElementById("sch-memo-save").onclick = () => {
      const val = document.getElementById("sch-memo-textarea").value;
      setScheduleMemo(staffId, dateKey, val);
      closeScheduleMemoModal();
      updateScheduleTableArea();
    };
    setTimeout(() => {
      document.addEventListener("keydown", scheduleMemoEscHandler, true);
      const ta = document.getElementById("sch-memo-textarea");
      if (ta) { ta.focus(); ta.select(); }
    }, 0);
  }

  // ----- 이름 메모 입력 모달 (이름 칸 오른쪽 클릭 → 메모 추가/수정) -----
  // 셀 메모 모달과 같은 모양·스타일을 쓰고 닫는 함수(closeScheduleMemoModal)도 그대로 공유한다.
  // 다른 점은 날짜가 아니라 "지금 보고 있는 달" 기준의 메모라는 것뿐이다.
  // 잠긴 달은 수정이 막혀 있으므로, 이미 남겨둔 메모가 있을 때만 읽기 전용으로 열어서 보여준다.
  function openScheduleNameMemoModal(staffId) {
    const { year, monthIndex } = scheduleUi;
    const locked = scheduleIsMonthLocked(year, monthIndex);
    const current = getScheduleNameMemo(staffId, year, monthIndex);
    if (locked && !current) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.");
      return;
    }
    closeScheduleMemoModal();
    const staff = getStaffListForMonth(year, monthIndex).find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
    const overlay = document.createElement("div");
    overlay.id = "sch-memo-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-memo-box">
        <div class="sch-preview-head">
          <span>${esc(staff ? staff.name : "")} · ${year}년 ${monthIndex + 1}월 메모${locked ? " (잠김)" : ""}</span>
          <button type="button" class="sch-preview-close" id="sch-memo-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-memo-body">
          <textarea class="add-input sch-memo-textarea" id="sch-memo-textarea" placeholder="이번 달 이 인원에 대해 남길 메모를 입력하세요"${locked ? " readonly" : ""}>${esc(current)}</textarea>
        </div>
        <div class="sch-preview-actions">
          ${(!locked && current) ? `<button type="button" class="ghost-btn danger" id="sch-memo-delete">삭제</button>` : ""}
          <button type="button" class="ghost-btn" id="sch-memo-cancel">${locked ? "닫기" : "취소"}</button>
          ${locked ? "" : `<button type="button" class="primary-btn" id="sch-memo-save">저장</button>`}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleMemoModal(); };
    document.getElementById("sch-memo-close-x").onclick = () => closeScheduleMemoModal();
    document.getElementById("sch-memo-cancel").onclick = () => closeScheduleMemoModal();
    const deleteBtn = document.getElementById("sch-memo-delete");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        setScheduleNameMemo(staffId, year, monthIndex, "");
        closeScheduleMemoModal();
        updateScheduleTableArea();
      };
    }
    const saveBtn = document.getElementById("sch-memo-save");
    if (saveBtn) {
      saveBtn.onclick = () => {
        const val = document.getElementById("sch-memo-textarea").value;
        setScheduleNameMemo(staffId, year, monthIndex, val);
        closeScheduleMemoModal();
        updateScheduleTableArea();
      };
    }
    setTimeout(() => {
      document.addEventListener("keydown", scheduleMemoEscHandler, true);
      const ta = document.getElementById("sch-memo-textarea");
      if (ta && !locked) { ta.focus(); ta.select(); }
    }, 0);
  }

  // ----- "가감점 취합" 팝업: 메모에 선 투입/연장/초과/라운딩/동석/역동석 문구가 있는
  // 날짜를 상담사별로 모아서 보여준다. -----
  function closeScheduleAdjustModal() {
    const existing = document.getElementById("sch-adjust-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleAdjustEscHandler, true);
  }
  function scheduleAdjustEscHandler(e) {
    if (e.key === "Escape") closeScheduleAdjustModal();
  }
  // 한 상담사의 entries를 "8/12 선투입, 8/14 연장근무" 형태의 텍스트로 만든다.
  function scheduleAdjustCopyText(monthIndex, entries) {
    return entries.map((en) => `${monthIndex + 1}/${en.day} ${en.label}`).join(", ");
  }
  function openScheduleAdjustModal() {
    closeScheduleAdjustModal();
    const { year, monthIndex } = scheduleUi;
    const summary = scheduleBuildAdjustSummary(year, monthIndex);
    const bodyHtml = summary.length === 0
      ? `<div class="sch-adjust-empty">${esc(scheduleMonthLabel())}에는 "선 투입 / 연장 / 초과 / 라운딩 / 동석 / 역동석" 문구가 담긴 메모가 없어요.</div>`
      : `<div class="sch-adjust-list">
          ${summary.map((agent) => `
            <div class="sch-adjust-row" data-staff-id="${esc(agent.id)}">
              <div class="sch-adjust-row-head">
                <div class="sch-adjust-name">${esc(agent.name)}${agent.nickname ? ` <span class="sch-adjust-nick">${esc(agent.nickname)}</span>` : ""}</div>
                <button type="button" class="sch-adjust-copy-btn" data-copy-staff="${esc(agent.id)}">${ICON_CLIPBOARD} 복사</button>
              </div>
              <div class="sch-adjust-detail">${agent.entries.map((en) => `<span class="sch-adjust-chip">${monthIndex + 1}/${en.day} ${esc(en.label)}</span>`).join("")}</div>
            </div>
          `).join("")}
        </div>`;

    const overlay = document.createElement("div");
    overlay.id = "sch-adjust-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-adjust-box">
        <div class="sch-preview-head">
          <span>가감점 취합 · ${esc(scheduleMonthLabel())}</span>
          <button type="button" class="sch-preview-close" id="sch-adjust-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-adjust-body">
          <div class="sch-adjust-desc">메모에 <b>선투입 / 선 투입 / 연장 / 연장근무 / 연장 근무 / 초과 / 라운딩 / 동석 / 역동석</b> 문구가 포함된 날짜를 상담사별로 모아서 보여줘요.</div>
          ${bodyHtml}
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-adjust-close-btn">닫기</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAdjustModal(); };
    document.getElementById("sch-adjust-close-x").onclick = () => closeScheduleAdjustModal();
    document.getElementById("sch-adjust-close-btn").onclick = () => closeScheduleAdjustModal();
    overlay.querySelectorAll(".sch-adjust-copy-btn").forEach((btn) => {
      btn.onclick = () => {
        const staffId = btn.getAttribute("data-copy-staff");
        const agent = summary.find((a) => a.id === staffId);
        if (!agent) return;
        const text = scheduleAdjustCopyText(monthIndex, agent.entries);
        scheduleCopyTextToClipboard(text, () => {
          const original = `${ICON_CLIPBOARD} 복사`;
          btn.innerHTML = "복사됨!";
          btn.classList.add("is-copied");
          setTimeout(() => { btn.innerHTML = original; btn.classList.remove("is-copied"); }, 1200);
        });
      };
    });
    setTimeout(() => document.addEventListener("keydown", scheduleAdjustEscHandler, true), 0);
  }
  // 클립보드 복사 (구형 환경 대비 execCommand 폴백 포함)
  function scheduleCopyTextToClipboard(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => { if (onDone) onDone(); }).catch(() => {
        scheduleCopyTextFallback(text, onDone);
      });
    } else {
      scheduleCopyTextFallback(text, onDone);
    }
  }
  function scheduleCopyTextFallback(text, onDone) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (onDone) onDone();
    } catch (e) {
      flashScheduleStatus("복사 실패");
    }
  }

  // ----- 스케줄 셀: 키보드로 상하좌우/Tab 이동 + 텍스트 직접 입력 -----
  // 칸을 클릭하거나 방향키로 이동해서 포커스를 두면(파란 테두리), 그 상태에서
  // 글자를 바로 치기 시작하면 입력창이 뜬다. Enter/Tab으로 확정하고, 확정한 값이
  // scheduleTokenToRecord가 알아보는 값(근무/오프/연차 등)이 아니면 저장하지 않고
  // 빨간 테두리로 오류를 표시한 채 그 칸에 그대로 머문다. Esc는 취소.
  let scheduleActiveEdit = null; // { cell }

  function scheduleFindCell(staffId, dateKey) {
    const root = document.getElementById("schedule-table-area");
    if (!root) return null;
    const cells = root.querySelectorAll(".sch-cell");
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].getAttribute("data-staff-id") === staffId && cells[i].getAttribute("data-date") === dateKey) return cells[i];
    }
    return null;
  }
  function scheduleVisibleCells() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return [];
    return Array.from(root.querySelectorAll(".sch-cell")).filter((c) => {
      if (c.classList.contains("sch-col-hidden")) return false;
      const tr = c.closest("tr");
      if (tr && tr.classList.contains("sch-row-hidden")) return false;
      return true;
    });
  }
  function scheduleNeighborCell(cell, dir) {
    const visible = scheduleVisibleCells();
    const rowIdx = Number(cell.getAttribute("data-row-idx"));
    const day = Number(cell.getAttribute("data-day"));
    if (dir === "left" || dir === "right") {
      const rowCells = visible.filter((c) => Number(c.getAttribute("data-row-idx")) === rowIdx)
        .sort((a, b) => Number(a.getAttribute("data-day")) - Number(b.getAttribute("data-day")));
      const idx = rowCells.indexOf(cell);
      if (idx === -1) return null;
      return (dir === "right") ? (rowCells[idx + 1] || null) : (rowCells[idx - 1] || null);
    }
    const colCells = visible.filter((c) => Number(c.getAttribute("data-day")) === day)
      .sort((a, b) => Number(a.getAttribute("data-row-idx")) - Number(b.getAttribute("data-row-idx")));
    const idx2 = colCells.indexOf(cell);
    if (idx2 === -1) return null;
    return (dir === "down") ? (colCells[idx2 + 1] || null) : (colCells[idx2 - 1] || null);
  }
  function scheduleMoveFocus(cell, dir) {
    const target = scheduleNeighborCell(cell, dir);
    if (target) target.focus();
  }
  // 편집 중 저장/취소가 끝나면 표를 다시 그리고, 가능하면 같은 칸(또는 이동한 칸)에 포커스를 되돌린다.
  function scheduleExitCellEdit(staffId, dateKey, moveDir) {
    scheduleActiveEdit = null;
    updateScheduleTableArea();
    const cell = (staffId != null && dateKey != null) ? scheduleFindCell(staffId, dateKey) : null;
    if (!cell) return;
    if (moveDir) scheduleMoveFocus(cell, moveDir);
    else cell.focus();
  }
  // 입력값을 확정 시도한다. 빈 값이면 기본값(근무)으로, 알아보는 근태 표현이면 그 값으로 저장.
  // 알아보지 못하는 텍스트면 mode에 따라: "block"=그 칸에 그대로 머물며 오류 표시,
  // "revert"=저장하지 않고 원래 값으로 되돌리며 안내만 띄움.
  // 반환값: 실제로 편집 모드를 빠져나갔으면(저장/되돌림) true, 오류로 그 칸에 계속 머물면 false.
  function scheduleFinalizeCellEdit(cell, staffId, dateKey, rawValue, mode, moveDir) {
    const trimmed = (rawValue || "").trim();
    const mapped = trimmed === "" ? { status: "WORK", attendance: null } : scheduleTokenToRecord(trimmed);
    if (!mapped) {
      if (mode === "revert") {
        scheduleExitCellEdit(staffId, dateKey, null);
        flashScheduleStatus(`인식할 수 없는 값이라 되돌렸어요: "${trimmed}"`);
        return true;
      }
      const input = cell.querySelector(".sch-cell-input");
      if (input) {
        input.classList.add("sch-cell-input--error");
        input.title = `"${trimmed}"은(는) 등록된 근태가 아니에요.`;
        input.focus();
        input.select();
      }
      flashScheduleStatus(`인식할 수 없는 값이에요: "${trimmed}"`);
      return false;
    }
    setScheduleRecord(staffId, dateKey, { status: mapped.status, attendance: mapped.attendance || null });
    scheduleExitCellEdit(staffId, dateKey, moveDir);
    return true;
  }
  function scheduleStartCellEdit(cell, typedChar) {
    if (cell.classList.contains("sch-cell--editing")) return;
    const staffId = cell.getAttribute("data-staff-id");
    const dateKey = cell.getAttribute("data-date");
    if (scheduleIsDateLocked(dateKey)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    closeScheduleMenu();
    const labelEl = cell.querySelector(".sch-cell-label");
    const originalLabel = labelEl ? labelEl.textContent : "";
    const startValue = (typedChar === null) ? originalLabel : typedChar;
    cell.classList.add("sch-cell--editing");
    cell.innerHTML = `<input type="text" class="sch-cell-input" />`;
    const input = cell.querySelector(".sch-cell-input");
    input.value = startValue;
    scheduleActiveEdit = { cell };
    let finished = false;
    // 값이 틀려서 그 칸에 그대로 머무는 경우(mode="block"이고 인식 실패)엔 finished를
    // true로 고정하면 안 된다. 그러면 사용자가 값을 바로잡아도 이후의 Enter/Tab이
    // "이미 끝난 편집"으로 취급되어 아무 반응이 없는 문제가 생긴다.
    function finish(mode, moveDir) {
      if (finished) return;
      if (mode === "cancel") { finished = true; scheduleExitCellEdit(staffId, dateKey, null); return; }
      const done = scheduleFinalizeCellEdit(cell, staffId, dateKey, input.value, mode, moveDir);
      if (done) finished = true;
    }
    input.onkeydown = (e) => {
      e.stopPropagation();
      if (e.key === "Enter") { e.preventDefault(); finish("block", null); }
      else if (e.key === "Escape") { e.preventDefault(); finish("cancel", null); }
      else if (e.key === "Tab") { e.preventDefault(); finish("block", e.shiftKey ? "left" : "right"); }
    };
    // 오류로 빨갛게 표시된 뒤 글자를 다시 고치기 시작하면, 확정하기 전이라도 오류 표시를 지운다.
    input.oninput = () => {
      if (input.classList.contains("sch-cell-input--error")) {
        input.classList.remove("sch-cell-input--error");
        input.title = "";
      }
    };
    input.onblur = () => finish("revert", null);
    requestAnimationFrame(() => {
      input.focus();
      if (typedChar === null) input.select();
      else input.setSelectionRange(input.value.length, input.value.length);
    });
  }
  function scheduleCommitActiveEditIfOutside(target) {
    if (!scheduleActiveEdit) return;
    if (scheduleActiveEdit.cell.contains(target)) return;
    // 이 핸들러는 mousedown "캡처" 단계라, 사용자가 실제로 누른 요소(target)에
    // 이벤트가 도달하기도 전에 먼저 실행된다. 여기서 곧바로 blur()를 호출해
    // 표 전체를 innerHTML로 다시 그리면, 방금 클릭한 그 DOM 노드가 target에
    // 닿기 전에 파괴되어 click 이벤트 자체가 발생하지 않는 문제가 있었다
    // (다른 칸 클릭, 행 그룹 접기/펼치기 화살표 클릭 등 첫 클릭이 씹힘).
    // 그래서 커밋(재렌더링)을 한 틱(setTimeout 0) 늦춰서, 원래 클릭이 target까지
    // 정상적으로 전달되고 처리된 뒤에 편집을 정리하도록 한다.
    const cellAtCapture = scheduleActiveEdit.cell;
    setTimeout(() => {
      if (!scheduleActiveEdit || scheduleActiveEdit.cell !== cellAtCapture) return; // 그 사이 이미 다른 방식으로 정리됨
      if (!document.contains(cellAtCapture)) { scheduleActiveEdit = null; return; } // 그 사이 다른 재렌더링으로 이미 떨어져 나감
      const input = cellAtCapture.querySelector(".sch-cell-input");
      if (input) input.blur(); // blur 핸들러(finish("revert"))가 정리를 맡는다.
    }, 0);
  }
  document.addEventListener("mousedown", (e) => scheduleCommitActiveEditIfOutside(e.target), true);

  function scheduleCellKeydown(e, cell) {
    if (cell.classList.contains("sch-cell--editing")) return;
    const key = e.key;
    // Ctrl/⌘+C: 선택한 칸(드래그로 고른 범위, 없으면 지금 포커스된 칸)을 메모까지 함께 복사한다.
    // Ctrl/⌘+V는 여기서 막지 않고 그대로 통과시킨다 — 브라우저가 paste 이벤트를 띄워주면
    // 07a9의 scheduleHandlePaste가 클립보드를 읽어 처리한다. (07a9-schedule-copy-paste.js 참고)
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && scheduleKeyIsLetter(e, "c")) {
      e.preventDefault();
      scheduleCopySelection(cell);
      return;
    }
    // Esc: 복사해 둔 범위의 점선 표시만 끈다.
    if (key === "Escape") { scheduleClearCopiedOutline(); return; }
    if (key === "ArrowUp") { e.preventDefault(); scheduleMoveFocus(cell, "up"); return; }
    if (key === "ArrowDown") { e.preventDefault(); scheduleMoveFocus(cell, "down"); return; }
    if (key === "ArrowLeft") { e.preventDefault(); scheduleMoveFocus(cell, "left"); return; }
    if (key === "ArrowRight") { e.preventDefault(); scheduleMoveFocus(cell, "right"); return; }
    if (key === "Tab") { e.preventDefault(); scheduleMoveFocus(cell, e.shiftKey ? "left" : "right"); return; }
    if (key === "Enter" || key === "F2") { e.preventDefault(); scheduleStartCellEdit(cell, null); return; }
    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      scheduleStartCellEdit(cell, key);
    }
  }

  function attachScheduleTableHandlers(root) {
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      // 왼쪽 클릭(드래그 없이 눌렀다 뗌)은 이제 메뉴를 열지 않는다 — 셀 선택/드래그 선택
      // 용도로만 쓰고, 그 칸 하나의 메뉴(상태 변경/메모/이력 등)는 오른쪽 클릭(우클릭)
      // 으로 연다.
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        openScheduleMenu(cell, cell.getAttribute("data-staff-id"), cell.getAttribute("data-date"));
      };
      cell.onmousedown = (e) => {
        if (e.button !== 0) return; // 왼쪽 버튼만
        scheduleSelectDragging = true;
        scheduleSelectMoved = false;
        scheduleSelectAnchor = { rowIdx: Number(cell.getAttribute("data-row-idx")), day: Number(cell.getAttribute("data-day")) };
        scheduleSelectCurrent = scheduleSelectAnchor;
        e.preventDefault(); // 드래그 중 글자 선택(파랗게 칠해지는 것) 방지
        // mousedown에서 preventDefault()를 하면 브라우저가 클릭에 따른 기본 포커스 이동까지
        // 취소해버려서, 셀을 클릭해도 이 tabindex="0" 셀에 실제 포커스가 잡히지 않는 문제가
        // 있었다. 그러면 클릭 직후 방향키·Tab 이동이나 글자 바로 입력(scheduleCellKeydown)이
        // 전혀 동작하지 않으므로, 여기서 명시적으로 포커스를 줘서 이어서 키보드 조작이
        // 가능하게 한다.
        cell.focus();
      };
      cell.onmouseenter = () => {
        if (!scheduleSelectDragging) return;
        const rowIdx = Number(cell.getAttribute("data-row-idx"));
        const day = Number(cell.getAttribute("data-day"));
        if (rowIdx !== scheduleSelectAnchor.rowIdx || day !== scheduleSelectAnchor.day) scheduleSelectMoved = true;
        scheduleSelectCurrent = { rowIdx, day };
        scheduleApplySelectionHighlight();
      };
      cell.onkeydown = (e) => scheduleCellKeydown(e, cell);
    });
    root.querySelectorAll(".sch-required-input").forEach((input) => {
      // 입력칸을 벗어날 때(blur) 또는 Enter 시 저장. 매 타이핑마다 전체를 다시 그리지 않아
      // 숫자 입력 중 표가 깜빡이거나 포커스가 빠지지 않는다.
      input.onchange = () => {
        const { year, monthIndex } = scheduleUi;
        setRequiredHeadcount(
          year, monthIndex,
          input.getAttribute("data-required-group"),
          input.getAttribute("data-required-type"),
          Number(input.getAttribute("data-required-day")),
          input.value
        );
        renderApp();
      };
      input.onkeydown = (e) => { if (e.key === "Enter") input.blur(); };
    });
    root.querySelectorAll("[data-toggle-row-group]").forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        scheduleToggleRowGroup(el.getAttribute("data-toggle-row-group"));
      };
    });
    // 열 머리글(날짜)·행 머리글(닉네임 칸) 클릭 = 선택 토글, 오른쪽 클릭 = 접기 메뉴 열기
    // 머리글은 클릭(하나 선택/해제)에 더해 드래그(범위 선택)도 받는다. 드래그를 막 끝낸 직후에 따라오는
    // click은 무시한다 — 안 그러면 방금 드래그로 고른 범위가 클릭 처리로 바로 취소되거나 뒤집힌다.
    root.querySelectorAll(".sch-col-th").forEach((th) => {
      th.onclick = (e) => {
        e.stopPropagation();
        if (scheduleHeaderDragJustEnded()) return;
        scheduleToggleColSelection(th.getAttribute("data-col-key"));
      };
      th.oncontextmenu = (e) => scheduleHeaderRightClick(th, e);
      th.onmousedown = (e) => scheduleHeaderDragStart("col", th.getAttribute("data-col-key"), e);
    });
    root.querySelectorAll(".sch-row-th").forEach((td) => {
      td.onclick = (e) => {
        e.stopPropagation();
        if (scheduleHeaderDragJustEnded()) return;
        scheduleToggleRowSelection(td.getAttribute("data-row-key"));
      };
      td.oncontextmenu = (e) => scheduleHeaderRightClick(td, e);
      td.onmousedown = (e) => {
        if (e.target.closest("[data-toggle-row-group]")) return; // 그룹 접기/펼치기 삼각형은 드래그 시작점이 아니다
        scheduleHeaderDragStart("row", td.getAttribute("data-row-key"), e);
      };
    });
    root.onmouseover = scheduleHeaderDragOver;
    // 헤더가 아닌 다른 곳을 클릭하면 열/행 선택을 해제한다.
    root.onclick = (e) => {
      if (scheduleHeaderDragJustEnded()) return;
      if (!e.target.closest(".sch-col-th") && !e.target.closest(".sch-row-th")) scheduleClearHeaderSelection();
    };
    scheduleApplyHeaderSelectionHighlight();
    // 표를 다시 그리면 클래스가 사라지므로, 복사해 둔 칸의 점선 표시를 다시 켠다(07a9).
    scheduleApplyCopiedOutline();
  }

  // ----- 월별 스케줄 일괄 삭제 -----
  // "등록된 일정 전체 삭제" 및 조/업무 구분별 삭제(주간 채팅·주간 유선·야간 채팅·야간 유선)를
  // 지원한다. 대상은 항상 "현재 화면에 보이는 달"이며, 대상 인원의 해당 달 1일~말일 기록을
  // 전부 기본값(근무)으로 되돌린다. 실수로 누르는 걸 막기 위해 실행 전에 꼭 확인을 받는다.
  const SCHEDULE_DELETE_SCOPES = [
    { key: "ALL", label: "등록된 일정 전체 삭제", danger: true },
    { key: "ADMIN", label: "관리자 삭제" },
    { key: "DAY_CHAT", label: "주간 채팅 삭제" },
    { key: "DAY_VOICE", label: "주간 유선 삭제" },
    { key: "NIGHT_CHAT", label: "야간 채팅 삭제" },
    { key: "NIGHT_VOICE", label: "야간 유선 삭제" },
  ];

  // scope에 해당하는 인원 목록과 화면 표시용 라벨을 반환한다.
  // (표를 그릴 때 쓰는 것과 같은 분류 기준 — 관리자/주간/야간, 채팅/유선 — 을 그대로 사용해서
  // "표에서 보이는 그룹"과 "삭제 대상"이 항상 일치하도록 한다)

  // 07a7-schedule-menus.js — 삭제/미리보기/캡처 메뉴
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleDeleteTargets(scope, year, monthIndex) {
    const monthStaff = getStaffListForMonth(year, monthIndex);
    if (scope === "ALL") return monthStaff;
    if (scope === "ADMIN") return monthStaff.filter((s) => s.isAdmin);
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    const dayStaff = nonAdmin.filter((s) => s.group !== "night");
    const nightStaff = nonAdmin.filter((s) => s.group === "night");
    if (scope === "DAY_CHAT") return splitByType(dayStaff).chat;
    if (scope === "DAY_VOICE") return splitByType(dayStaff).voice;
    if (scope === "NIGHT_CHAT") return splitByType(nightStaff).chat;
    if (scope === "NIGHT_VOICE") return splitByType(nightStaff).voice;
    return [];
  }

  function scheduleBulkDelete(scope) {
    const meta = SCHEDULE_DELETE_SCOPES.find((s) => s.key === scope);
    const label = meta ? meta.label.replace(/ 삭제$/, "") : "선택한";
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("이 달은 잠겨 있어요. 잠금을 해제한 뒤 삭제해주세요.");
      return;
    }
    const targetStaff = scheduleDeleteTargets(scope, year, monthIndex);

    if (targetStaff.length === 0) {
      flashScheduleStatus(`${label} 대상 인원이 없어요.`);
      return;
    }
    const ok = window.confirm(
      `${scheduleMonthLabel()} "${label}" 일정을 모두 삭제할까요?\n대상 인원 ${targetStaff.length}명 · 이 달의 모든 날짜가 기본값(근무)으로 되돌아가요. (Ctrl+Z로 되돌리기 가능)`
    );
    if (!ok) return;

    recordUndo(`${label} 일괄 삭제`, SCHEDULE_KEY, reloadScheduleData);
    const numDays = scheduleDaysInMonth(year, monthIndex);
    let cleared = 0;
    targetStaff.forEach((s) => {
      for (let d = 1; d <= numDays; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const key = scheduleRecordKey(s.id, dateKey);
        if (scheduleData.records[key]) {
          delete scheduleData.records[key];
          cleared += 1;
        }
      }
    });
    saveScheduleData();
    updateScheduleTableArea();
    flashScheduleStatus(cleared > 0 ? `${label} 일정 삭제됨 (${targetStaff.length}명 · ${cleared}칸)` : `${label}에는 삭제할 일정이 없었어요.`);
  }

  function openScheduleDeleteMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_DELETE_SCOPES.map((o, idx) => {
      const divider = idx === 1 ? `<div class="sch-menu-divider"></div>` : "";
      return `${divider}<button type="button" class="${o.danger ? "sch-menu-danger" : ""}" data-scope="${o.key}">${o.danger ? ICON_TRASH + " " : ""}${o.label}</button>`;
    }).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-scope]").forEach((btn) => {
      btn.onclick = () => {
        const scope = btn.getAttribute("data-scope");
        closeScheduleMenu();
        scheduleBulkDelete(scope);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // ----- 이미지로 저장: 다운로드 전 미리보기 모달 -----
  function closeSchedulePreview() {
    const existing = document.getElementById("sch-preview-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", schedulePreviewEscHandler, true);
  }
  function schedulePreviewEscHandler(e) {
    if (e.key === "Escape") closeSchedulePreview();
  }
  // dataUrl: html2canvas로 만든 캡처 이미지, filename: 실제 다운로드할 때 쓸 파일명,
  // modeName: "주간"/"유선" 등 캡처 모드 이름 (전체 저장이면 null)
  function openSchedulePreview(dataUrl, filename, modeName) {
    closeSchedulePreview();
    const overlay = document.createElement("div");
    overlay.id = "sch-preview-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box">
        <div class="sch-preview-head">
          <span>${modeName ? `${esc(modeName)} 이미지 미리보기` : "이미지 미리보기"}</span>
          <button type="button" class="sch-preview-close" id="sch-preview-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body">
          <img src="${dataUrl}" alt="월별 스케줄 캡처 미리보기">
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-preview-cancel">닫기</button>
          <button type="button" class="primary-btn" id="sch-preview-download">${ICON_DOWNLOAD} 이미지 다운로드</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeSchedulePreview(); };
    document.getElementById("sch-preview-close-x").onclick = () => closeSchedulePreview();
    document.getElementById("sch-preview-cancel").onclick = () => closeSchedulePreview();
    document.getElementById("sch-preview-download").onclick = () => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      closeSchedulePreview();
      flashScheduleStatus("이미지 저장됨");
    };
    setTimeout(() => document.addEventListener("keydown", schedulePreviewEscHandler, true), 0);
  }

  // ----- 월별 스케줄 이미지로 저장: 전체/주간/야간/유선/채팅 -----
  // 유선·채팅은 주야간을 통합해서 한 장으로 캡처하되, 캡처 이미지 안에서는
  // 주간/야간 구획을 나눠서 보여준다. (buildScheduleTableHtml·buildScheduleLogHtml 참고)
  const SCHEDULE_CAPTURE_MODES = [
    { key: "ALL", label: "전체 저장" },
    { key: "ADMIN", label: "관리자 저장" },
    { key: "DAY", label: "주간 저장" },
    { key: "NIGHT", label: "야간 저장" },
    { key: "VOICE", label: "유선 저장" },
    { key: "CHAT", label: "채팅 저장" },
  ];

  function openScheduleCaptureMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_CAPTURE_MODES.map((o) =>
      `<button type="button" data-capture-mode="${o.key}">${ICON_CAMERA} ${o.label}</button>`
    ).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-capture-mode]").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-capture-mode");
        closeScheduleMenu();
        captureSchedulePage(mode);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // "이번 달 지각·결근 기록" 영역의 "되돌리기" 버튼에 클릭 이벤트를 연결한다.
  // 이 영역은 되돌리기를 누를 때마다 통째로 다시 그려지므로, 매번 다시 호출해서
  // 새로 그려진 버튼에도 이벤트가 붙도록 해야 한다.
  function attachScheduleLogHandlers(root) {
    root.querySelectorAll("[data-action='clear-sch-attendance']").forEach((btn) => {
      btn.onclick = () => {
        setScheduleRecord(btn.getAttribute("data-staff-id"), btn.getAttribute("data-date"), { attendance: null, status: "WORK" });
        updateScheduleTableArea();
      };
    });
  }

  // "숨긴 열/행" 패널에 나열할 칩들의 HTML을 만든다. 연속 날짜는 범위로, 한 번에 같이
  // 접은 정보 칸/인원/집계행 묶음(2개 이상)은 한 칩으로 묶어서 보여준다.
  function scheduleHiddenItemsListHtml() {
    const effectiveBatches = scheduleEffectiveHiddenBatches();
    const coveredInfoCols = new Set();
    const coveredStaffIds = new Set();
    const coveredSummaryRows = new Set();
    effectiveBatches.forEach((b) => {
      b.infoCols.forEach((k) => coveredInfoCols.add(k));
      b.staffIds.forEach((k) => coveredStaffIds.add(k));
      b.summaryRows.forEach((k) => coveredSummaryRows.add(k));
    });
    const batchLabel = (b) => {
      const parts = [];
      b.infoCols.forEach((key) => {
        const col = SCHEDULE_INFO_COLS.find((c) => c.key === key);
        parts.push(esc(col ? col.label : key));
      });
      b.staffIds.forEach((id) => {
        const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === id);
        parts.push(esc(staff ? staff.nickname : "(알 수 없음)"));
      });
      b.summaryRows.forEach((key) => parts.push(esc(schedulePrettyRowKey(key))));
      return parts.join(", ");
    };
    return `
      ${scheduleGroupConsecutiveDays(scheduleUi.manualHiddenDays).map((r) => `
        <span class="schedule-colgroup-chip">
          ${pad2(scheduleUi.monthIndex + 1)}/${pad2(r.start)}${r.end > r.start ? `~${pad2(scheduleUi.monthIndex + 1)}/${pad2(r.end)}` : ""}
          <button class="sch-colgroup-toggle-btn" data-unhide-day-range="${r.start}-${r.end}">펼치기</button>
        </span>
      `).join("")}
      ${effectiveBatches.map((b) => `
        <span class="schedule-colgroup-chip">
          ${batchLabel(b)}
          <button class="sch-colgroup-toggle-btn" data-unhide-batch="${b.id}">펼치기</button>
        </span>
      `).join("")}
      ${Array.from(scheduleUi.manualHiddenInfoCols).filter((key) => !coveredInfoCols.has(key)).map((key) => {
        const col = SCHEDULE_INFO_COLS.find((c) => c.key === key);
        return `
        <span class="schedule-colgroup-chip">
          ${esc(col ? col.label : key)}
          <button class="sch-colgroup-toggle-btn" data-unhide-infocol="${esc(key)}">펼치기</button>
        </span>
      `;
      }).join("")}
      ${Array.from(scheduleUi.manualHiddenStaffIds).filter((id) => !coveredStaffIds.has(id)).map((id) => {
        const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === id);
        return `
        <span class="schedule-colgroup-chip">
          ${esc(staff ? staff.nickname : "(알 수 없음)")}
          <button class="sch-colgroup-toggle-btn" data-unhide-staff="${id}">펼치기</button>
        </span>
      `;
      }).join("")}
      ${Array.from(scheduleUi.manualHiddenSummaryRows).filter((key) => !coveredSummaryRows.has(key)).map((key) => `
        <span class="schedule-colgroup-chip">
          ${esc(schedulePrettyRowKey(key))}
          <button class="sch-colgroup-toggle-btn" data-unhide-summaryrow="${esc(key)}">펼치기</button>
        </span>
      `).join("")}
    `;
  }

  // 07a8-schedule-render-page.js — renderSchedulePage 진입점
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function renderSchedulePage(root) {
    root.innerHTML = `
      <div class="schedule-top">
        <div class="schedule-title">월별 스케줄</div>
        <div class="schedule-month-nav">
          <button class="schedule-month-btn" id="sch-prev-month" title="이전 달">‹</button>
          <div class="schedule-month-label">${scheduleMonthLabel()}${scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? ` <span class="sch-locked-badge">${ICON_LOCK} 확정됨</span>` : ""}</div>
          <button class="schedule-month-btn" id="sch-next-month" title="다음 달">›</button>
          <button class="ghost-btn sch-today-btn" id="sch-today-btn" title="오늘 날짜로 이동">오늘</button>
          <button class="ghost-btn sch-lock-toggle-btn ${scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? "locked" : ""}" id="sch-lock-btn" style="margin-left:8px;">${scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? `${ICON_UNLOCK} 잠금 해제` : `${ICON_LOCK} 이 달 잠그기`}</button>
          <button class="ghost-btn ${scheduleBulkPasteOpen ? "active" : ""}" id="sch-bulk-btn" style="margin-left:8px;">${ICON_CLIPBOARD} 일괄 붙여넣기</button>
          <button class="ghost-btn" id="sch-capture-btn">${ICON_CAMERA} 이미지로 저장 ▾</button>
          <button class="ghost-btn" id="sch-excel-btn">${ICON_CHART} 엑셀로 다운로드</button>
          <button class="ghost-btn" id="sch-holidaydoc-btn">${ICON_CLIPBOARD} 휴일대체 확인서</button>
        </div>
      </div>
      <div class="status" id="schedule-status"></div>
      ${scheduleBulkPasteOpen ? `
        <div class="schedule-bulk-panel">
          <div class="schedule-bulk-desc">
            한 줄에 <b>이름</b>을 쓰고 이어서 <b>1일부터 말일까지의 값</b>을 공백(탭도 가능)으로 구분해서 붙여넣으세요. 공백이 나올 때마다 다음 날짜로 넘어가요. 인원 여러 명은 줄바꿈으로 구분해서 한 번에 붙여넣을 수 있어요.<br>
            인식되는 값: <b>1</b>(근무), <b>휴일 / 오프 / 휴무</b>(휴일), <b>연차</b>, <b>대휴</b>, <b>반차</b>, <b>공휴</b>, <b>공가</b>, <b>육휴</b>, <b>특휴</b>, <b>교육</b>, <b>지각</b>, <b>결근</b>, <b>퇴사</b>. 값 개수가 이번 달 일수보다 적으면 앞에서부터만 반영되고, 많으면 초과분은 무시돼요.<br>
            <b>필요인력</b>도 같은 칸에 붙여넣을 수 있어요. 이름 대신 줄 맨 앞에 <b>주간 채팅 필요인력</b>(또는 주간 유선 / 야간 채팅 / 야간 유선)을 쓰고, 이어서 1일부터의 숫자를 넣으세요. 엑셀에서 복사할 때 이름표 칸부터 같이 복사하면 돼요. 빈 칸이나 <b>-</b>는 건너뛰어서 그 날짜의 기존 값이 그대로 남아요.
          </div>
          <textarea class="add-input schedule-bulk-textarea" id="sch-bulk-textarea" placeholder="이기욱	휴일	1	휴일	휴일	1	휴일	1	1	1	휴일	1	1	1	대휴	1	1	1	1	휴일	1	1	1	대휴	1	1	1	휴일	1	1	1"></textarea>
          <div class="schedule-bulk-actions">
            <button class="primary-btn" id="sch-bulk-apply-btn">적용</button>
            <button class="ghost-btn" id="sch-bulk-clear-btn">지우기</button>
          </div>
          ${scheduleBulkPasteMsg ? `<div class="schedule-bulk-result">${esc(scheduleBulkPasteMsg)}</div>` : ""}
        </div>
      ` : ""}
      <div class="schedule-legend">
        <span class="item"><span class="swatch" style="background:var(--blue);"></span>휴일</span>
        <span class="item"><span class="swatch" style="background:var(--orange);"></span>연차</span>
        <span class="item"><span class="swatch" style="background:var(--green);"></span>대휴</span>
        <span class="item"><span class="swatch" style="background:var(--salmon);"></span>반차</span>
        <span class="item"><span class="swatch" style="background:var(--teal);"></span>공휴</span>
        <span class="item"><span class="swatch" style="background:var(--purple);"></span>공가</span>
        <span class="item"><span class="swatch" style="background:var(--pink);"></span>육휴</span>
        <span class="item"><span class="swatch" style="background:var(--indigo);"></span>특휴 · 교육</span>
        <span class="item"><span class="swatch" style="background:var(--amber);"></span>지각</span>
        <span class="item"><span class="swatch" style="background:var(--red);"></span>결근</span>
        <span class="item"><span class="swatch" style="background:var(--text-faint);"></span>퇴사</span>
      </div>
      <div class="schedule-table-toolbar">
        <div class="agent-search-input">
          <input type="text" class="agent-search-input-field" id="sch-search-input" placeholder="이름 검색" title="상담사 검색 (이름/주간/야간/채팅/유선, 쉼표로 여러 개)" value="${esc(scheduleUi.searchQuery)}" autocomplete="off">
          ${ICON_SEARCH_MINI}
        </div>
        <button class="ghost-btn" id="sch-adjust-summary-btn">${ICON_CLIPBOARD} 가감점 취합</button>
        <button class="ghost-btn" id="sch-auto-btn">자동 배치 ▾</button>
        <button class="ghost-btn ${scheduleHiddenPanelOpen ? "active" : ""}" id="sch-hidden-btn">${ICON_CALENDAR} 숨긴 열/행${scheduleHiddenCount() > 0 ? ` (${scheduleHiddenCount()})` : ""} ▾</button>
        <button class="ghost-btn sch-delete-btn-small" id="sch-delete-btn">${ICON_TRASH} 일정 삭제</button>
      </div>
      ${scheduleHiddenPanelOpen ? `
        <div class="schedule-colgroup-panel">
          <div class="schedule-colgroup-subtitle">날짜 범위로 열 그룹 만들기</div>
          <div class="schedule-colgroup-desc">
            엑셀처럼 원하는 날짜 범위를 골라 그 열들을 한 번에 접거나 펼 수 있어요. 시작일과 종료일을 입력하고 "그룹 추가"를 누르면 아래 목록에 추가돼요.
          </div>
          <div class="schedule-colgroup-form">
            <input type="number" min="1" max="${scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex)}" class="add-input" id="sch-colgroup-start" placeholder="시작일">
            <span>~</span>
            <input type="number" min="1" max="${scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex)}" class="add-input" id="sch-colgroup-end" placeholder="종료일">
            <button class="primary-btn" id="sch-colgroup-add-btn">그룹 추가</button>
          </div>
          ${scheduleUi.colGroups.length === 0 ? `
            <div class="schedule-colgroup-empty">추가된 열 그룹이 없어요.</div>
          ` : `
            <div class="schedule-colgroup-list">
              ${scheduleUi.colGroups.map((g) => `
                <span class="schedule-colgroup-chip">
                  ${pad2(scheduleUi.monthIndex + 1)}/${pad2(g.start)}~${pad2(scheduleUi.monthIndex + 1)}/${pad2(g.end)}
                  <button class="sch-colgroup-toggle-btn" data-toggle-colgroup="${g.id}">${g.collapsed ? "펼치기" : "접기"}</button>
                  <button class="sch-colgroup-remove-btn" data-remove-colgroup="${g.id}">✕</button>
                </span>
              `).join("")}
            </div>
          `}
          <div class="schedule-colgroup-divider"></div>
          <div class="schedule-colgroup-subtitle">개별로 숨긴 열·행</div>
          <div class="schedule-colgroup-desc">
            표에서 날짜 칸·인원 정보 칸(닉네임~결근)·인원 닉네임 칸·집계행(관리자 인원/필요인력/대비)·그룹 제목 행(관리자/아침조/채팅/유선 등)을 클릭해 선택한 뒤(여러 개 선택 가능), 오른쪽 마우스 버튼을 눌러 "접기"를 고르면 여기에 쌓여요. 데이터는 그대로 있고 화면에서만 숨겨져요.
          </div>
          ${(scheduleUi.manualHiddenDays.size === 0 && scheduleUi.manualHiddenInfoCols.size === 0 && scheduleUi.manualHiddenStaffIds.size === 0 && scheduleUi.manualHiddenSummaryRows.size === 0) ? `
            <div class="schedule-colgroup-empty">접어둔 열·행이 없어요.</div>
          ` : `
            <div class="schedule-colgroup-list">
              ${scheduleHiddenItemsListHtml()}
            </div>
            <div><button class="ghost-btn" id="sch-unhide-all-btn">모두 펼치기</button></div>
          `}
          ${scheduleUi.manualExcludedAggregateStaffIds.size > 0 ? `
            <div class="schedule-colgroup-divider"></div>
            <div class="schedule-colgroup-subtitle">집계 제외한 인원</div>
            <div class="schedule-colgroup-desc">
              인원 행을 선택한 뒤 오른쪽 마우스 버튼으로 "집계 제외"를 고르면 여기에 쌓여요. 행은 표에 그대로 남고(옅은 회색으로 표시), 유선/채팅 인원·필요인력 대비·총 인원 등 집계에서만 빠져요.
            </div>
            <div class="schedule-colgroup-list">
              ${Array.from(scheduleUi.manualExcludedAggregateStaffIds).map((id) => {
                const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === id);
                return `
                <span class="schedule-colgroup-chip">
                  ${esc(staff ? staff.nickname : "(알 수 없음)")}
                  <button class="sch-colgroup-toggle-btn" data-unexclude-aggregate-staff="${id}">해제</button>
                </span>
              `;
              }).join("")}
            </div>
          ` : ""}
        </div>
      ` : ""}
      <div id="schedule-table-area"><div class="schedule-table-wrap"><div class="schedule-scale-inner">${buildScheduleTableHtml()}</div></div></div>
      <div class="schedule-log-title">이번 달 지각·결근 기록</div>
      <div id="schedule-log-area">${buildScheduleLogHtml()}</div>
    `;

    attachScheduleTableHandlers(document.getElementById("schedule-table-area"));

    document.getElementById("sch-prev-month").onclick = () => scheduleShiftMonth(-1);
    document.getElementById("sch-next-month").onclick = () => scheduleShiftMonth(1);
    document.getElementById("sch-today-btn").onclick = () => scheduleGoToday();
    document.getElementById("sch-lock-btn").onclick = () => scheduleToggleMonthLock(scheduleUi.year, scheduleUi.monthIndex);
    document.getElementById("sch-capture-btn").onclick = (e) => openScheduleCaptureMenu(e.currentTarget);
    document.getElementById("sch-excel-btn").onclick = () => exportScheduleToExcel();
    document.getElementById("sch-holidaydoc-btn").onclick = () => generateHolidayDocx();
    document.getElementById("sch-delete-btn").onclick = (e) => openScheduleDeleteMenu(e.currentTarget);
    document.getElementById("sch-hidden-btn").onclick = () => {
      scheduleHiddenPanelOpen = !scheduleHiddenPanelOpen;
      renderApp();
    };
    document.getElementById("sch-adjust-summary-btn").onclick = () => openScheduleAdjustModal();
    document.getElementById("sch-auto-btn").onclick = (e) => openScheduleAutoMenu(e.currentTarget);
    const schSearchInput = document.getElementById("sch-search-input");
    if (schSearchInput) {
      // 표 영역만 다시 그려서(전체 renderApp() 대신) 검색창의 IME 조합·포커스가 끊기지 않게 한다.
      schSearchInput.oninput = (e) => {
        scheduleUi.searchQuery = e.target.value;
        updateScheduleTableArea();
      };
    }
    root.querySelectorAll("[data-unhide-day-range]").forEach((btn) => {
      const [s, e] = btn.getAttribute("data-unhide-day-range").split("-").map(Number);
      btn.onclick = () => scheduleUnhideDayRange(s, e);
    });
    root.querySelectorAll("[data-unhide-batch]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideBatch(btn.getAttribute("data-unhide-batch"));
    });
    root.querySelectorAll("[data-unhide-infocol]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideInfoCol(btn.getAttribute("data-unhide-infocol"));
    });
    root.querySelectorAll("[data-unhide-staff]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideStaff(btn.getAttribute("data-unhide-staff"));
    });
    root.querySelectorAll("[data-unhide-summaryrow]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideSummaryRow(btn.getAttribute("data-unhide-summaryrow"));
    });
    root.querySelectorAll("[data-unexclude-aggregate-staff]").forEach((btn) => {
      btn.onclick = () => scheduleSetAggregateExcluded(btn.getAttribute("data-unexclude-aggregate-staff"), false);
    });
    const unhideAllBtn = document.getElementById("sch-unhide-all-btn");
    if (unhideAllBtn) unhideAllBtn.onclick = () => scheduleUnhideAll();
    const colGroupAddBtn = document.getElementById("sch-colgroup-add-btn");
    if (colGroupAddBtn) {
      colGroupAddBtn.onclick = () => {
        const maxDay = scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex);
        const startInput = document.getElementById("sch-colgroup-start");
        const endInput = document.getElementById("sch-colgroup-end");
        const s = parseInt(startInput ? startInput.value : "", 10);
        const e = parseInt(endInput ? endInput.value : "", 10);
        if (!s || !e || s < 1 || e < 1 || s > maxDay || e > maxDay) {
          flashScheduleStatus("올바른 날짜(1~" + maxDay + ")를 입력해주세요.");
          return;
        }
        scheduleAddColGroup(s, e);
      };
    }
    root.querySelectorAll("[data-toggle-colgroup]").forEach((btn) => {
      btn.onclick = () => scheduleToggleColGroup(btn.getAttribute("data-toggle-colgroup"));
    });
    root.querySelectorAll("[data-remove-colgroup]").forEach((btn) => {
      btn.onclick = () => scheduleRemoveColGroup(btn.getAttribute("data-remove-colgroup"));
    });
    document.getElementById("sch-bulk-btn").onclick = () => {
      scheduleBulkPasteOpen = !scheduleBulkPasteOpen;
      if (scheduleBulkPasteOpen) scheduleBulkPasteMsg = "";
      renderApp();
    };
    const bulkTextarea = document.getElementById("sch-bulk-textarea");
    const bulkApplyBtn = document.getElementById("sch-bulk-apply-btn");
    const bulkClearBtn = document.getElementById("sch-bulk-clear-btn");
    if (bulkApplyBtn) {
      bulkApplyBtn.onclick = () => {
        applyScheduleBulkPaste(bulkTextarea ? bulkTextarea.value : "");
        renderApp();
      };
    }
    if (bulkClearBtn) {
      bulkClearBtn.onclick = () => {
        if (bulkTextarea) bulkTextarea.value = "";
        scheduleBulkPasteMsg = "";
        renderApp();
      };
    }

    attachScheduleLogHandlers(document.getElementById("schedule-log-area"));

    fitScheduleTable();
    syncScheduleLogWidth();
    watchScheduleTableSize();
    // renderSchedulePage()는 월 이동·잠금 토글·일괄 붙여넣기 등으로 화면을 다시 그릴 때마다
    // 반복 호출된다. 매번 새 리스너를 쌓아두면 resize 이벤트마다 중복 계산이 계속 늘어나므로,
    // 등록 전에 이전 리스너를 먼저 제거해서 항상 딱 1개씩만 걸려 있도록 한다.
    window.removeEventListener("resize", fitScheduleTable);
    window.removeEventListener("resize", syncScheduleLogWidth);
    window.addEventListener("resize", fitScheduleTable);
    window.addEventListener("resize", syncScheduleLogWidth);
    // 웹폰트(KoPub Dotum)가 표를 처음 그릴 때 아직 로딩 중이면 실제 너비보다 좁게
    // 측정되어 축소 비율이 맞지 않을 수 있다. 폰트 로딩이 끝난 뒤 한 번 더 재계산한다.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fitScheduleTable();
        syncScheduleLogWidth();
      });
    }
  }

  /* ===================== 홈(메인) 페이지 모듈 ===================== */
  // 그날의 근무 현황·일정·할 일·고정 메모를 한 화면에 요약해서 보여준다.

  // 07a9-schedule-copy-paste.js — 월별 스케줄 셀 복사(Ctrl/⌘+C) · 붙여넣기(Ctrl/⌘+V)
  // (07a6의 셀 선택/포커스 기능 위에 얹은 기능이라 07a6·07a5 뒤에 오도록 07a9로 이름 붙임)
  //
  // 사용법
  //  - 칸을 클릭하거나 드래그로 여러 칸을 선택한 뒤 Ctrl+C → 상태(근무/오프/연차…)와 메모를 함께 복사.
  //    (드래그로 고른 범위가 없으면 지금 포커스(파란 테두리)가 있는 칸 하나를 복사)
  //  - 붙여넣을 칸을 클릭(또는 범위를 드래그)한 뒤 Ctrl+V.
  //      · 클릭한 칸이 붙여넣기의 "왼쪽 위 시작점"이 되고, 복사한 크기만큼 오른쪽·아래로 채운다.
  //      · 1칸만 복사했고 붙여넣을 곳을 여러 칸 드래그해 뒀다면 그 범위 전체를 그 값으로 채운다.
  //      · 붙여넣기는 상태와 메모를 함께 덮어쓴다(복사한 칸에 메모가 없으면 대상 칸의 메모도 지워짐).
  //        Ctrl+Z 한 번으로 통째로 되돌릴 수 있다.
  //  - 엑셀 등 다른 곳에서 복사한 "오프/연차/1…" 같은 근태 값(탭·줄바꿈으로 구분)도 붙여넣을 수 있다.
  //    이 경우 메모 정보가 없으므로 상태만 바꾸고 기존 메모는 그대로 둔다.
  //  - Esc: 복사한 범위를 알려주는 점선 표시만 끈다(복사한 내용은 그대로 남음).
  //
  // 구현 메모
  //  - 복사(C)는 keydown에서, 붙여넣기(V)는 브라우저의 paste 이벤트에서 처리한다. V를 keydown에서
  //    가로채지 않는 이유: 키 이벤트 안에서는 클립보드를 동기로 읽을 수 없고, navigator.clipboard.readText()는
  //    권한 팝업이 뜨기 때문. paste 이벤트는 권한 없이 clipboardData로 바로 읽을 수 있다.
  //  - 메모는 시스템 클립보드(텍스트)에 실을 수 없어서 앱 안의 버퍼(scheduleCopyBuffer)에 따로 보관한다.
  //    붙여넣을 때 클립보드 텍스트가 복사 당시 넣어둔 텍스트와 같을 때만 그 버퍼(메모 포함)를 쓰고,
  //    다르면(그 사이 다른 곳에서 복사함) 클립보드 텍스트를 그대로 해석한다 — 그래야 옛날에
  //    복사해 둔 내용이 엉뚱하게 붙여넣어지지 않는다.

  // 앱 안에서 복사해 둔 칸들.
  //  - rows: 복사한 범위를 [행][열] 배열로 담은 것. 칸 하나는 { status, attendance, memo }.
  //  - text: 그때 시스템 클립보드에 같이 넣은 문자열 (붙여넣을 때 "내가 복사한 게 맞는지" 대조용).
  //  - keys: 복사한 칸들의 "인원id|날짜" 모음 (점선 표시용).
  //  - showOutline: false면 점선 표시를 끈 상태 (Esc).
  let scheduleCopyBuffer = null;

  // 키보드 이벤트가 특정 알파벳 키인지 판별한다. 한글 입력 상태에서는 Ctrl+C를 눌러도 e.key가
  // "c"가 아니라 "ㅊ"이나 "Process"로 올 수 있어서(특히 한글 IME), 알파벳이 아닌 값이 오면
  // 물리 키 위치(e.code)로 판단한다. 알파벳이 오면 e.key를 우선한다(Dvorak 등 다른 배열 존중).
  function scheduleKeyIsLetter(e, letter) {
    const k = e.key || "";
    if (/^[a-z]$/i.test(k)) return k.toLowerCase() === letter;
    return e.code === "Key" + letter.toUpperCase();
  }

  // 윈도우/엑셀은 줄바꿈을 \r\n으로, 끝에 빈 줄을 붙여 주기도 해서 비교 전에 맞춰준다.
  function scheduleNormalizeClipText(text) {
    return String(text == null ? "" : text).replace(/\r\n?/g, "\n").replace(/\n+$/, "");
  }

  // [행][열] 칸 배열 → 시스템 클립보드에 넣을 텍스트(탭·줄바꿈 구분). 칸에 보이는 글자
  // ("1", "오프", "연차", "지각" …)를 그대로 쓰므로 엑셀에 붙여넣어도 표 모양이 유지되고,
  // 이 글자들은 모두 scheduleTokenToRecord가 다시 알아본다(왕복 가능).
  function scheduleClipboardTextFromRows(rows) {
    return rows
      .map((row) => row.map((item) => (item ? scheduleCellDisplay(item).label : "")).join("\t"))
      .join("\n");
  }

  // 외부(엑셀 등)에서 온 텍스트 → [행][열] 칸 배열.
  // 빈 칸은 null(=건드리지 않음). 알아보지 못하는 값도 null로 두고 unknown에 모아서 알려준다.
  // memo가 null인 칸은 "메모 정보 없음"이라는 뜻이라 붙여넣어도 기존 메모를 지우지 않는다.
  function scheduleParseClipText(text) {
    const unknown = [];
    const rows = scheduleNormalizeClipText(text).split("\n").map((line) =>
      line.split("\t").map((raw) => {
        const tok = raw.trim();
        if (tok === "") return null;
        const mapped = scheduleTokenToRecord(tok);
        if (!mapped) { unknown.push(tok); return null; }
        return { status: mapped.status, attendance: mapped.attendance || null, memo: null };
      })
    );
    return { rows, unknown };
  }

  // 화면에 "보이는" 행 번호 목록(rowIdxList)과 날짜 목록(dayList) 위에서, 시작 칸을 왼쪽 위로
  // 두고 rows를 깔았을 때 각 칸이 어느 (행번호, 날짜)에 놓이는지 계산한다.
  // 접어둔(숨긴) 행·열은 목록에 없으므로 자연스럽게 건너뛰고, 표 끝을 넘어서는 부분은
  // 잘라내며 clipped=true로 알려준다. item이 null인 자리는 건너뛴다.
  function schedulePlanPaste(rows, rowIdxList, dayList, startRowIdx, startDay) {
    const r0 = rowIdxList.indexOf(startRowIdx);
    const c0 = dayList.indexOf(startDay);
    if (r0 === -1 || c0 === -1) return { targets: [], clipped: false };
    const targets = [];
    let clipped = false;
    rows.forEach((row, ri) => {
      row.forEach((item, ci) => {
        if (!item) return;
        const rowIdx = rowIdxList[r0 + ri];
        const day = dayList[c0 + ci];
        if (rowIdx === undefined || day === undefined) { clipped = true; return; }
        targets.push({ rowIdx, day, item });
      });
    });
    return { targets, clipped };
  }

  // 계산된 붙여넣기 결과를 실제 데이터에 반영한다(한 번에 저장, 되돌리기 한 번).
  // entries: [{ staffId, dateKey, item: { status, attendance, memo } }]
  // 붙여넣을 범위에 잠긴 달이 하나라도 있으면 아무것도 바꾸지 않고 locked=true로 돌려준다
  // (일괄 적용 메뉴의 잠금 규칙과 동일).
  function scheduleApplyPasteEntries(entries) {
    const result = { applied: 0, memoSet: 0, memoCleared: 0, locked: false };
    if (!entries.length) return result;
    if (entries.some((en) => scheduleIsDateLocked(en.dateKey))) { result.locked = true; return result; }
    recordUndo(`셀 ${entries.length}개 붙여넣기`, SCHEDULE_KEY, reloadScheduleData);
    entries.forEach(({ staffId, dateKey, item }) => {
      const key = scheduleRecordKey(staffId, dateKey);
      const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
      const next = Object.assign({}, cur, { status: item.status, attendance: item.attendance || null });
      if (next.status === "WORK" && !next.attendance) delete scheduleData.records[key]; // 기본값이면 저장하지 않음
      else scheduleData.records[key] = next;
      if (item.memo !== null && item.memo !== undefined) {
        const memo = String(item.memo).trim();
        if (memo) { scheduleData.memos[key] = memo; result.memoSet += 1; }
        else if (scheduleData.memos[key]) { delete scheduleData.memos[key]; result.memoCleared += 1; }
      }
      result.applied += 1;
    });
    saveScheduleData();
    return result;
  }

  // ----- 여기부터는 실제 화면(DOM)과 붙는 부분 -----
  function scheduleCellRowIdx(cell) { return Number(cell.getAttribute("data-row-idx")); }
  function scheduleCellDay(cell) { return Number(cell.getAttribute("data-day")); }
  function scheduleCellKey(cell) { return `${cell.getAttribute("data-staff-id")}|${cell.getAttribute("data-date")}`; }
  function scheduleSortedUnique(nums) { return Array.from(new Set(nums)).sort((a, b) => a - b); }

  function scheduleCellItem(cell) {
    const staffId = cell.getAttribute("data-staff-id");
    const dateKey = cell.getAttribute("data-date");
    const rec = getScheduleRecord(staffId, dateKey);
    return { status: rec.status, attendance: rec.attendance || null, memo: getScheduleMemo(staffId, dateKey) };
  }

  // 드래그로 골라 둔 칸들(파란 선택 표시가 켜진 칸). 일괄 적용 메뉴가 떠 있는 동안에만 남아 있다.
  // (그 메뉴를 열 때 closeScheduleMenu가 선택 좌표 변수는 비우고 표시만 다시 켜기 때문에,
  //  지금 "선택된 칸"의 진실은 화면에 켜진 표시 자체다.) 접힌 행·열의 칸은 뺀다.
  function scheduleSelectedVisibleCells(root) {
    const visible = new Set(scheduleVisibleCells());
    return Array.from(root.querySelectorAll(".sch-cell--selected")).filter((c) => visible.has(c));
  }

  // 메모/이력/미리보기 같은 팝업이 떠 있으면(뒤쪽 표에 포커스가 남아 있을 수 있음) 복사·붙여넣기를 막는다.
  function scheduleCopyPasteBlocked() {
    return !!document.querySelector(".sch-preview-overlay");
  }

  // 복사해 둔 칸들에 점선 테두리를 켠다. 표를 다시 그릴 때마다(attachScheduleTableHandlers)
  // 다시 불러서 유지한다.
  function scheduleApplyCopiedOutline() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    const keys = (scheduleCopyBuffer && scheduleCopyBuffer.showOutline) ? scheduleCopyBuffer.keys : null;
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      cell.classList.toggle("sch-cell--copied", !!keys && keys.has(scheduleCellKey(cell)));
    });
  }
  function scheduleClearCopiedOutline() {
    if (scheduleCopyBuffer) scheduleCopyBuffer.showOutline = false;
    scheduleApplyCopiedOutline();
  }

  // Ctrl/⌘+C
  function scheduleCopySelection(focusCell) {
    const root = document.getElementById("schedule-table-area");
    if (!root || scheduleCopyPasteBlocked()) return;
    let cells = scheduleSelectedVisibleCells(root);
    if (!cells.length && focusCell) cells = [focusCell];
    if (!cells.length) return;

    const rowIdxList = scheduleSortedUnique(cells.map(scheduleCellRowIdx));
    const dayList = scheduleSortedUnique(cells.map(scheduleCellDay));
    const rows = rowIdxList.map(() => dayList.map(() => null));
    const keys = new Set();
    let memoCount = 0;
    cells.forEach((cell) => {
      const item = scheduleCellItem(cell);
      rows[rowIdxList.indexOf(scheduleCellRowIdx(cell))][dayList.indexOf(scheduleCellDay(cell))] = item;
      keys.add(scheduleCellKey(cell));
      if (item.memo) memoCount += 1;
    });

    const text = scheduleClipboardTextFromRows(rows);
    scheduleCopyBuffer = { rows, text, keys, showOutline: true };
    // 드래그 선택 직후 떠 있던 "N칸 선택됨" 일괄 적용 메뉴와 파란 선택 표시를 정리하고,
    // 그 자리에 "복사됨" 점선 표시를 켠다.
    closeScheduleMenu();
    scheduleApplyCopiedOutline();

    const msg = `${cells.length}칸 복사됨${memoCount ? ` (메모 ${memoCount}개 포함)` : ""}`;
    scheduleCopyTextToClipboard(text, () => {
      // 구형 폴백(execCommand)은 임시 입력창에 포커스를 뺏기므로 원래 칸으로 돌려놓는다.
      if (focusCell && document.contains(focusCell) && document.activeElement !== focusCell) focusCell.focus();
      flashScheduleStatus(msg, 2200);
    });
  }

  // Ctrl/⌘+V (브라우저가 띄워주는 paste 이벤트)
  function scheduleHandlePaste(e) {
    const root = document.getElementById("schedule-table-area");
    if (!root) return; // 스케줄 화면이 아니면 다른 화면의 붙여넣기를 건드리지 않는다
    const active = document.activeElement;
    // 칸에 포커스가 있을 때만 처리한다. 입력창·메모 입력칸·일괄 붙여넣기 칸에 포커스가 있으면
    // 그 안의 평범한 붙여넣기가 그대로 동작해야 한다.
    if (!active || !active.classList || !active.classList.contains("sch-cell") || !root.contains(active)) return;
    if (scheduleCopyPasteBlocked()) return;
    e.preventDefault();
    const text = e.clipboardData ? e.clipboardData.getData("text/plain") : "";
    schedulePasteIntoCells(root, active, text);
  }

  function schedulePasteIntoCells(root, activeCell, text) {
    const visible = scheduleVisibleCells();
    const selected = scheduleSelectedVisibleCells(root);
    const anchorCells = selected.length ? selected : [activeCell];
    const startRowIdx = Math.min.apply(null, anchorCells.map(scheduleCellRowIdx));
    const startDay = Math.min.apply(null, anchorCells.map(scheduleCellDay));
    const rowIdxList = scheduleSortedUnique(visible.map(scheduleCellRowIdx));
    const dayList = scheduleSortedUnique(visible.map(scheduleCellDay));
    const cellAt = new Map(visible.map((c) => [`${scheduleCellRowIdx(c)}|${scheduleCellDay(c)}`, c]));

    // 무엇을 붙여넣을지: 방금 이 앱에서 복사한 게 맞으면 버퍼(메모 포함), 아니면 클립보드 텍스트 해석.
    const fromApp = !!scheduleCopyBuffer &&
      scheduleNormalizeClipText(text) === scheduleNormalizeClipText(scheduleCopyBuffer.text);
    let rows, unknown = [];
    if (fromApp) rows = scheduleCopyBuffer.rows;
    else { const parsed = scheduleParseClipText(text); rows = parsed.rows; unknown = parsed.unknown; }

    // 어디에 붙여넣을지
    let cellTargets, clipped = false;
    const single = rows.length === 1 && rows[0].length === 1 && rows[0][0];
    if (single && selected.length > 1) {
      cellTargets = selected.map((cell) => ({ cell, item: single })); // 1칸 → 선택 범위 전체 채우기
    } else {
      const plan = schedulePlanPaste(rows, rowIdxList, dayList, startRowIdx, startDay);
      clipped = plan.clipped;
      cellTargets = plan.targets
        .map((t) => ({ cell: cellAt.get(`${t.rowIdx}|${t.day}`), item: t.item }))
        .filter((t) => t.cell);
    }

    if (!cellTargets.length) {
      flashScheduleStatus(unknown.length
        ? `인식할 수 없는 값이라 붙여넣지 못했어요: "${unknown[0]}"${unknown.length > 1 ? " 외" : ""}`
        : "붙여넣을 내용이 없어요.", 2600);
      return;
    }

    const result = scheduleApplyPasteEntries(cellTargets.map((t) => ({
      staffId: t.cell.getAttribute("data-staff-id"),
      dateKey: t.cell.getAttribute("data-date"),
      item: t.item,
    })));
    if (result.locked) {
      flashScheduleStatus("붙여넣을 범위에 잠긴 달이 포함돼 있어요. 잠금을 해제한 뒤 다시 붙여넣어주세요.", 2600);
      return;
    }

    // 붙여넣기 후 표를 다시 그리면 포커스가 사라지므로, 원래 있던 칸에 포커스를 돌려준다.
    const focusStaffId = activeCell.getAttribute("data-staff-id");
    const focusDate = activeCell.getAttribute("data-date");
    closeScheduleMenu();
    updateScheduleTableArea();
    const again = scheduleFindCell(focusStaffId, focusDate);
    if (again) again.focus();

    const notes = [];
    if (result.memoSet) notes.push(`메모 ${result.memoSet}개 포함`);
    if (result.memoCleared) notes.push(`기존 메모 ${result.memoCleared}개 삭제됨`);
    if (clipped) notes.push("표 밖으로 넘치는 칸 제외");
    if (unknown.length) notes.push(`인식 못한 값 ${unknown.length}칸 제외`);
    // saveScheduleData가 방금 "저장됨"을 띄웠으므로, 그 위에 결과 요약을 덮어 보여준다.
    flashScheduleStatus(`${result.applied}칸 붙여넣음${notes.length ? ` (${notes.join(", ")})` : ""}`, 2600);
  }

  document.addEventListener("paste", scheduleHandlePaste);

  /* ===================== 휴일대체 확인서(.docx) 생성 ===================== */
  // 업로드된 회사 양식(.docx)의 서식을 그대로 재사용해서, 월별 스케줄 데이터를 채운
  // 휴일대체 확인서를 사람별로 반복해 만들어 낸다. 아래 두 상수(PREFIX/SUFFIX)는
  // 원본 양식 파일의 실제 OOXML(word/document.xml) 조각을 그대로 잘라온 것이라,
  // 글꼴·굵기·표 테두리·음영 등 서식이 원본과 100% 동일하다. §YEAR§/§MONTH§/§MANAGER§
  // 자리표시자만 실제 값으로 바꿔치기한다. 표의 데이터 행(1~13행)만 매번 새로 만든다.
  const HOLIDAY_DOC_SKELETON_B64 = "UEsDBBQAAAAIAAAAIQB6ITA6eQEAAC0HAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbLWVy27CMBBF95X6D5G3KDF0UVUVgUUfyxap9ANMPAGrfskeXn/fCYGoqihBhWwiOTP33uOxZA/HG6OTFYSonM3ZIOuzBGzhpLLznH1OX9MHlkQUVgrtLORsC5GNR7c3w+nWQ0xIbWPOFoj+kfNYLMCImDkPliqlC0YgLcOce1F8iTnwu37/nhfOIlhMsfJgo+EzlGKpMXnZ0O+aJICOLHmqG6usnAnvtSoEUp2vrPyVku4TMlLueuJC+dijBsaPJlSVvwP2uncaTVASkokI+CYMdfG1C5JLVywNKbPTNkc4XVmqAhp95eaDKyBGmrnRWVMxQtleG4ddmhkEUl4fpLFuhYi41RCvT1D7tscDIgm6ANg7tyKsYfbRGcUP81aQ0jm0Drs4jca6FQKs7Ijh4HzWHCAMupkChDPyKU/MNHRBsLduhUC6jqH+Xj6Jnc2pSOqcBOcjXe/hH9s+3N+VOqUNewioTp90k0jWF+8PqqdBgjySzXeP3egbUEsDBBQAAAAIAAAAIQAekRq36QAAAE4CAAALAAAAX3JlbHMvLnJlbHOtksFqwzAMQO+D/YPRvVHawRijTi9j0NsY2QcIW0lME9vYatf+/TzY2AJd6WFHy9LTk9B6c5xGdeCUXfAallUNir0J1vlew1v7vHgAlYW8pTF41nDiDJvm9mb9yiNJKcqDi1kVis8aBpH4iJjNwBPlKkT25acLaSIpz9RjJLOjnnFV1/eYfjOgmTHV1mpIW3sHqj1FvoYdus4ZfgpmP7GXMy2Qj8Lesl3EVOqTuDKNain1LBpsMC8lnJFirAoa8LzR6nqjv6fFiYUsCaEJiS/7fGZcElr+54rmGT827yFZtF/hbxucXUHzAVBLAwQUAAAACAAAACEA5RyHtiIBAAA+BQAAHAAAAHdvcmQvX3JlbHMvZG9jdW1lbnQueG1sLnJlbHOtlM1OwzAQhO9IvEPkO3FSoPyoTi8IqVcID+Akmx+RrCN7C+TtMUVNXVpZHHzcsXbm08j2av019NEHaNMpFCyNExYBlqrqsBHsLX++umeRIYmV7BWCYBMYts4uL1Yv0EuyS6btRhNZFzSCtUTjI+embGGQJlYjoD2plR4k2VE3fJTlu2yAL5JkybXrwbIjz2hTCaY3lc3PpxH+463quivhSZXbAZDORPBaIeWy6MGaSt0ACTZLsXVj/DzEdUgIA0S2XnNg2Cs+hLuwPSgC7ZbwM6e+/EXQCmjqwS1gN/vi05DxuB0K0LbxA8Es+SCWISEAK7StOy3sFR/Cbehr8IdhlnwQNyEhPqF4PXkRjugDeQgJQnbX+Rh24684Pwx+9Otl31BLAwQUAAAACAAAACEA4QXpQqMCAADJDwAAEQAAAHdvcmQvZG9jdW1lbnQueG1s7VdLT9wwEL73V0S+Q5J9AREBIbZQDpVWLFXPXttJLOKHbGe321/fcZx9tFRoYYvUQ062ZzzffOPHl/jy+oeooyUzliuZo/Q0QRGTRFEuyxx9e7o7OUeRdVhSXCvJcrRmFl1ffbpcZVSRRjDpIkCQNltpkqPKOZ3FsSUVE9ieCk6Msqpwp0SJWBUFJyxeKUPjQZImbU8bRZi1kO4WyyW2qIMTL9GUZhKchTICOxiaMhbYPDf6BNA1dnzBa+7WgJ1MNjAqR42RWQdxsiXkQ7JAqGs2EeaQvCFk2q1AmzE2rAYOStqK610Z70UDZ7UBWb5WxFLUaLsF6ei4PZgavIJmB3gIfRqCRB2Yv46YJgfsiIfYRhxC4fecGyYCc7lL/K6l2VvcdPw2gMGfALo8bnPujWr0Do0fh/Ygn7dY/mK/Aavb5P3S7HFk5hXWcAMFyR5KqQxe1MAItiyCVY/8sUZXoDgLRde+1f/4aPTK1SvXRyhXLzn/v+SsMvj1oY85SpLb4WR6cbc1TVmBm9q99Mz2TK0czUzbzN26ZjBniescfZ2j2Ft90u8G63ZgNSaQGubU3C/AYJSgbvDYeMnDjVMhjkvq0/GyAgZpmiTBbEIuc6ekszABW8L5E5QPwYKDdH65kZZ7UIatu7Ec/9VZ+c5LTyD5c1PDYOAtcZc17ir1bTuPETczvRT3UtxLcS/FHynFc1Aab53ejoafx63mFko5Zh5ZwQw8V73qurWGOmgQbRSZjNMcmQd6FlRNl3Ovaysvphf+aoMIQn9yPjzfTPiKjcdRcF7HkzO0J7+joNML5ZwSu3HNij1vxTBlcPHbQeCXo2HwlY1zwdfmIqr24u0/B8B5NBgHM7yo7w2n3Rdhxh0BisNJ0qlwENy2G/6E490j/OoXUEsDBBQAAAAIAAAAIQDUczl82QEAAJEGAAASAAAAd29yZC9mb290bm90ZXMueG1szZTNTuMwEMfvK/EOke9tnFAQipoiQQXihmD3AYzjNBaxx7Kdhr79jpMmLR+qCr1wiTP2zG/+M5N4fv2m6mgtrJOgc5JMKYmE5lBIvcrJv793kysSOc90wWrQIicb4cj14uzPvM1KAK/BCxchQ7usNTwnlfcmi2PHK6GYmyrJLTgo/ZSDiqEsJRdxC7aIU5rQ7s1Y4MI5THjL9Jo5ssWpzzQwQuNhCVYxj6ZdxYrZ18ZMkG6Yly+yln6DbHo5YCAnjdXZFjEZBYWQrBe0XYYIe0zePmQJvFFC+y5jbEWNGkC7SppdGT+l4WE1QNaHilirmowjSGanzWBpWYvLDniM/KIPUnWv/DAxoUdMJCDGiGMkvM85KFFM6l3iH7Vmr7nJxfcA6UeAWZ02nHsLjdnR5Gm0B/06ssKv/Q3Wdsj7pbnTxDxXzOAfqHj2sNJg2UuNinBkEXY9Cp81WexdOVGb+Y1BDycMs8yDJbgli5xMks7RoIl3WvGUE0ov0vPk7pYMW0tRsqb2n08ew9bNZXo1W/aQRxsWZxhHhejESi/wdqAhoJahZ+lsNJ6aIJk1Hki8mMdjeM8YdPZHtnfonkNNX9bHQXupm+5aef5YK/2VpX4p+VDZe4Zb/AdQSwMEFAAAAAgAAAAhACUjWarYAQAAiwYAABEAAAB3b3JkL2VuZG5vdGVzLnhtbM2UyW7bMBCG7wX6DgLvNiXVCQLBcoDGSJFbkLQPwFCURUTkECRl1W/fodZsMJz40ou4zMw3/3BErq//qjraC+sk6Jwky5hEQnMopN7l5M/v28UViZxnumA1aJGTg3DkevP927rNhC40eOEiRGiXtYbnpPLeZJQ6XgnF3FJJbsFB6ZccFIWylFzQFmxB0ziJu5mxwIVzmO+G6T1zZMCp9zQwQqOxBKuYx6XdUcXsc2MWSDfMyydZS39Adnw5YiAnjdXZgFhMgkJI1gsahjHCnpK3D9kCb5TQvstIrahRA2hXSTOX8VUaGqsRsj9WxF7VZGpBsjqvB1vLWhxm4Cnyiz5I1b3y48QkPqEjATFFnCLhdc5RiWJSz4m/dDQvDje5+BwgfQswu/Oa88tCY2aaPI92p58nVrjZn2ANTX5ZmjtPzGPFDN5AxbO7nQbLnmpUhC2L8NSj8FuTzfziRG3mDwYdnDDMMg+W4JYscrJIOj+DS3zRioecxPFF+iO5vSHj1laUrKn9e8t92Pp5mV6ttj3k3obBGcZRIDqx0gt8HOIQUMtwZOlqWjw0QTFrPBC6WdMpvGeMOnuT7R2671DSR9Vx0F7qpntTHt9WGv+XhX4o+UjR89xt/gFQSwMEFAAAAAgAAAAhAKGnb631AQAACgYAABAAAAB3b3JkL2Zvb3RlcjEueG1spZTNbtQwEMfvSLxD5Puuk6hbStSkgq6KeqsoPIDrOBtTf8l2EvbOAfUMt6onhBDiAbjwNBx3eQec75ZKZbd7sZ0Zz2/+44l9ePSeM68k2lApYhBMfeARgWVKxSIGb9+cTA6AZywSKWJSkBgsiQFHydMnh1WUWe25aGGiSuEY5NaqCEKDc8KRmXKKtTQys1MsOZRZRjGBldQpDP3Ab1ZKS0yMcamOkSiRAR2O36dJRYRzZlJzZN2nXkCO9GWhJo6ukKUXlFG7dGx/v8fIGBRaRB1iMgiqQ6JWUDf1EXqTvG3IXOKCE2GbjFAT5jRIYXKqxjIeS3POvIeUDxVRcgaGFgR7u/VgrlHlphG4ify0DeKsVf4wMfA36EiNGCI2kXA3Z6+EIyrGxI86mluHG8y2A4T/AtRit+a80rJQI43uRjsVlwOrvtRbsLom3y7N7CbmPEfK3UCOo9OFkBpdMKfItcxzp+7VvzVI3GOjvCpyj1T6Oga+/3w2C49D0JvmJEMFs/c9Z7Xp5X54sDdvIWe6mc7tkhG3p0QsBugZgLX1He4t2N1EomsrHGKawSa/P17XRtu4RofuNp1IYY3D5FQ4OQQZ+8JQ1JG6TTb5c/VzdXO9vvqy/vXJjavv39r16uuP9ecPd/i1gO3L/0+tfVUtHDYvefIXUEsDBBQAAAAIAAAAIQD/vArg/AUAAJYaAAAVAAAAd29yZC90aGVtZS90aGVtZTEueG1s7Vlbixs3FH4v9D+IeXfmPraXeIM9tpM2u0nIblLyqJ2RZ5TVjMxI3l0TAiWh0EIpFNLShwb6lodSGmigoS/9MQsJbdr/UM2MLxpbk+bihUBigz2SvnP06Rzpk2bm/IWThIAjlDFM045mnjM0gNKAhjiNOtqN/WGjpQHGYRpCQlPU0aaIaRe2P/7oPNziMUoQEPYp24IdLeZ8vKXrLBDVkJ2jY5SKthHNEshFMYv0MIPHwm9CdMswPD2BONVAChPh9upohAME/v3i6xePvtS2594HRPyknOUVAcn2gqJL2aTAhodm/semzCcZOIKko4mOQnq8j064BghkXDR0NKP4aPr2eX1hRHiNrWQ3LD4zu5lBeGgVdll0sDB0HNfxugv/Vul/HTdoDryBt/BXAGAQiJGaa1i31+713RlWApWXCt/9Zt82K3jJv72G77r5t4K3l3hnDT8c+ssYSqDy0lXEpGn5TgXvLvHeGr5pdPtOs4IvQDHB6eEa2nA925+PdgEZUXJJCW+7zrBpzeBLlC7NrtI+5XVzLYG3aTYUgCK5kOMU8OkYjWAgcC8effvPw8/B37/99OLBdxoYw5QyUW1YxtCwxW/+dYqrIiJwC0HJuqwK2FpVzgewIMNj3tE+FV41CfLs6dPTe09O7/1+ev/+6b1fwQ6OYq6wuwTTSKvlqsQzGf/8l6+e//Hny9zzCq3vHz9/8vjZD9/89fMDBbybwQMZvo8TxMAVdAyu00QMUNEBOshez2I/hli26KYRgynMbRToAY8r6CtTSKAC10PVON7MhFyogBcntyuE9+JswrECeDlOKsBdSkmPZsoxXc77kqMwSSN159lExl2H8EjVt7+S5cFkLOY9Vrn0Y1SheY2IlMMIpYiDvI0eIqQwu4VxJa67OMgooyMObmHQg1gZkn18wNVGl3Ai8jJVERT5rsRm9yboUaJy30dHVaRYG5CoXCJSCeNFOOEwUTKGCZGRO5DHKpJ70yyoBJxxkekIEQoGIWJMZXM1m1boXoZCt5Rp3yXTpIrMOD5UIXcgpTKyTw/9GCZjJWecxjL2E3YopigE1yhXkqDVFZKXRR5gWpvumxjx11vbN4QMqSdI3jLJVEsC0ep6nJIRROlsN6joeoLTNxN59+xEXkjpsx8fnpmwb17SuxlWrqlVIa/Drcq3T7MQv/vq3YeT9BoSC+aDeH8Q7/dRvOvW8+Yle6nSunxoL9wktSf4ESZkj08J2mGFvjMxvHAoKotCYbS4YRjH4nLWXQUXZbC4Bhnln2Ee78VwLLoxix4iNnMdMTCmTOwNWq3vYoeZJLs0LGtNc36PKgwgX9aLvWVeL/YjXtZ6zeXN2MJ9UYqYTMAtnL46CamzKglbQaJpvxoJ09gUi7aCRct8GQtdyopYfwDmzzdcp2Qk5hskKMzzVNrPs7vxTNcFszpsSzG8trOxTFdISNOtSkKahjEM0Wr1hnPdbqtTbSlpNFtnkWt9XRtIWi2BY7HmbFe4CeC4o43E2VBcJmPhj+W6CUmUdrSAzwL9JsoyzhjvQxaXsKKpHH+COcoAwYmY63IaSLrkZlpN490l1zbevcjpq0lGoxEKeE3NsijaSifK1rcE5wU6EaT34vAYHJBJdh2KQLlNMw9giBlfRDPEmTS5l1FckavZUqw8O1suUUjGMZztKLKYl/DiekFHGkfBdHVUuiqEB9FwE7vu/xutiGbNBtKsVbGz2+QlVraalavUunbLePku8fYbgkStpaZmq6nV7R0bPBBI3Xk1cbNqs/mWu8HqrNWlc2VRWntJQQ9ui5nfF8fVCeGsvPs/EfcI/vzxcqkERe1cXU44mGS4o90x3K7jW67fMFruoOHYjtFouV270XVd2xy4ptHvWXdFUHicmG7Z91Dcz5Dp7CVMUb/2IiaZH7PPBTTRaXEO1gvj4kWMaalexOzn7RrAIjJ3PGvYtts9r9G2u8OG0++1Gm3f6zX6nt/sD/u+22oP72rgqAA7Xdt3vEGr4Zm+33A8I6ffajeajmV1nWa3NXC6d2exFiOf/8/DW/Da/g9QSwMEFAAAAAgAAAAhAIxF5HB6EQAA6U4AABEAAAB3b3JkL3NldHRpbmdzLnhtbLVcW3MbN5Z+36r9Dy49ryLcL6o4U7hOMmPPTEXJ5rlFtiyuSTarSVlRpva/7wEpWnbyIeXZ1DyR7K8BnD74cG4A++s//bxZv/owzvvVtH19wb9iF6/G7WJarrbvXl/8+EO9dBev9odhuxzW03Z8ffE07i/+9M1//sfXj9f78XCg2/avqIvt/nqzeH1xfzjsrq+u9ov7cTPsv5p245bAu2neDAf6Ob+72gzz+4fd5WLa7IbD6na1Xh2ergRj5uK5m+n1xcO8vX7u4nKzWszTfro7tCbX093dajE+f5xbzF8y7qlJnhYPm3F7OI54NY9rkmHa7u9Xu/25t83/tzcC78+dfPi9h/iwWZ/ve+TsCx73cZqXH1t8iXitwW6eFuN+TxO0WZ8FXG1fBla/6ejj2F/R2M+PeOyKmnN2/Pap5Ppf60D8qoP9+kue5AS9Wd3Ow/z06WNsFtffvdtO83C7JlbS47wiiS6+IVr+Mk2bV4/Xu3Fe0NwQpxm7uGrALY1PRM/T36bDzcM8Tw/b5bfjQNe6cJ2mwzM8LA6rD+NP86px/ubwtB5pkGG3+9uwIQHe3vx0nKTH6/XQVs64vfzxpv38MG6X0/xdfn1hVPu9XK//++Nqk5xZ165u1+l+XLynS+3Xon0/DvH64ln2f23099PlX7//otHt74/OT6MTl6a7m8NwaKPud+N6fTQPi/U4bFuTd/OwoYV9vnJssxzvhof14Yfh9uYw7ZosA824O0/GcrXfrYenb6d59cu0PQzrPA+P1Ouf59WykD16Orf4/H6S/rBa9O8Wp7u30z8etovDw3F5/3Wct3TvEVjcDzPpcpxvdsOCLiYae57W5+bLNvmJbNNMS+fU1f1yvrkfdmM+Pc/+m6+n63278PyA+1cfrsefiWfjcnUgW7lbLTfDzyQJU771cIW6eLy+I2ZtiVz/mD/9RXKslq8vLp/1/qvL7Lm/z9vSFP/mx6/6+fzquZvPGp4Mcvu2J82MdZp/fHNaFgNxajHekLLWY3w6kNV7uD19+2m1PNyfZqfp7c04fBjjsHi/Xw/7+9D8xRF8WP8wD6t10/j4cnf5eUde5eZ+dXf4fjyQDTzxfPk/D/vDm9V2/HZcvbs/fLf9oa3wUz/7sZY3w9P0cLh6Efnm5IUajY9r4TPP8nZajo2gD/Pqy63VxZkNZFB+Z6CJeEf0G48CHtdLJTLdrH4Zw3b5F3qKFfV4JOAfkOD3BBi3beS/k9H84Wk31nEgLZJ3/vcMdpyzul7t3q7INM7fbZdkXP9tg63u7saZBliRyXlLS2Y1T49HPZ/s9R8d9+pTvpM5XO7PX76npfXR8jBL5pnLk6QNfUEY4yE5jEgXBES4cElhRDqbMGKNZx3EC4wI5lyEiJQ6YtmUMIJjRGmWMaKNwzpQOir8pMoUZyCiuRQWIzoHLBtNkMa9WR5KgIjXNHUYMa6DBGGy7iBeYR1Em04e4DdIMjzi+UkmMjxOZtFh7WQuMp7TzIupEClMF9ymKB87bbTUHcQIjWe7ylywRqtKtYNYaaBsnEnlCkaMElA2zpsaOkiWGKHxC5w5Lm3NGFHcdCRQqng4p1xzVvGTamU9ZEhDMHe41pLDWeDaMAOtGCHSwlXCtWWuI7V1HvdmOLcdRAjMN26UwzaEG+M7slllBW5jVc5YAmuJJB0kFaxRp3zFDHE6YsZzZ6KEvObOsoAlcJYnzGsvtcGyeV0MtMo80ARhXYemUogk6RzWdVIMW1ieiKKYIZnJgLWTmQt4nKx9hyFFpM44RSuHxykmVLwaKze5g0jXYUg1skBPK8g1MdibYNZwqGvBBTe4N64d5gG1yB4yUVB8gJ9UCJEsXCWCnFnBbSSLFdo3IYXCjBdSZQ4ZLyjYCPh5lLAarlOhFE+Q10KTr4U8EFok3WmjBfZZQluNPbowujCsA0N+Ac+pFUlhCWgYHB8Iz2XEOvCEwVVPSMQrWHjpFNZ14CbhcaJgFbdJ5NQx38geYPsmslY9xMiIx8nGYI8uCi0TrANCOqwqJiU828U6jddctQbHO7KtbiiBZCZbaCkkpxgW8oCQInAboaWA8yOFSRGuOSltwZGDVC1exoihzAQiFN9jfyo1dwmuBUIKXj9Sk02CNp6Qgi0fITVBXktSjoWzLY3mHOva6E4EKS05M8hrabnG3CEk47UgraFABCKOsg+4FmiVdjgqHakUt2m+HnPHWxaxroNI2KMTQhkDRig9xHwLMmY8c8GqgmchUlSBeR0pO8Rtki4J6yBT7IBXYyZbjsfJSuKsmpDsOm2sw1mbJLvjsdSF8pJOG6s6vVVWsd+WVSQcrcuqE86DFfkzbBNV43ynjenEyooLJaHUhMQEV31Lf3BcpSgUclBvSijPIa8JyRLyTQnSAZxTJYXAtQ0lySrCtaDI8BjIeGKOxYxXivJGrDelREdqZShYhYjWHOeNhJgIrTIh1uL5ccriiJg07XBMrjy5U/w8XisF15wKUnssQZBWY6mDTBnaeBVMxHUxFaxhuLfIssWsihRBYsZHehzMg0jKxkyMhvI2iCRmVQfhWWCOUpTYYXyyTGGkcIMzcVVIuk4bHXHeqKqUOG9U1ZSObNV6XA/RLQuE7NWUmQQ4c5pRSAznh/x5kVBqLSTH1SKK702Az6MpKJdwtimkSApaCoobdIVM1EoLHK1TBmhxTqupM1z50ZZLj/XmuMLZrnaqU2HSjrwmli2w0JmFwMmdQSRyqXBvkbuM5ycKjrMcQjKO43VsWsCI1RUykYjjI57tbD3DvRXGcF6vK/PYWhIJGLZIhHgck5PICq85Q9mZguw1x3I4RigchawyzFacTRkKvPEKNoLSAmh7jbABV4+NFKUzjjQdO2qkJZfaQbzCiDIuwzk1muIaqGujrcD1EErRI2aVMSbgioyxIiT8PFZKbHsNGTFcjTDWBLwWjKOlihHfEjeIBObwvoyhaB1H+CYY6zDfInM4QjGR8gKs66gDtjsmcdthfDIK71qZLCvO+E1WEXtN8ktaY10X6g9LXSylBRCpTHuoN8tEp75DvjlgjVrilYdz2t87tJwbDp+HkKihdig9FR0JuM4RrnrSQMC1WysFw/sYhMSIx5GUhWKpFWUseBxlLMO9aeZxJmG16Kx6SxNUId8sJaE4erKOOQeZaJ1MmKPWmdxpQ/kKXsHWU7iBWeWlwfunNhjmoe21iQVcp7CJdzJkmyzHlR9KZCy2vYQ4XE+02SrsSyxlu9ib2WItrh/Y2tO1o5wF680dPTdEaC3gONFxo/GuLxnRgjNkJ6SLUAdOUPYOV3BDcBzipCkBWkunWBfhLsLZdpp7idtQqIrtgdOqUzFz2tgE+UZIxn7bWe5xFdRZwRjuzTGBrZhzoiQ8p46MMuSO89oJLEHUnR1cQgrOT2mqQ0c7iaINzINkfca6Ltzh/McV4fAOrita4mzKVd7JAQnRBWunas86iM24su3bjgnkdQtDcGRHSMVVQ89sTPBJPZcaewxP7gfXAsiMmoARKQTeHSMk4vzH05rDlTkKRguOqwipFktAKWWB8+O1pFQLI4rjWqfXWuDVSIjDuRkhAdctvaEFiaUmJ4PryoSEjgRGGHxyxBuy/p02qnPuyVMo1GEVZYA4d/YUOigsQdtYxTNnKRbCDLG2c2LAk0XC0ZNvJhaP43Qn6vTOOrwj4D2PuGbnST14d9kHaXH2QUjGEbEP1uIzC5S2drymj6Zz8spHW3AF0CdlOwzJMhrcW1bZY70VEToMKaLgmM8XaXHd0heV8F6BL7QYOhJQDoZnrqqKczNfrcHeLLBe/BZYC1EwopWFsgUuK95ZDe1cAHxSSnUTjimCkBJXcYKwFtfwg9QK7y4HRfYA2jdCCsfaIQTvEAZlUsaIbrs5EDGs4rp/sLzi3ctgje3owFqHTwMFJyq2b8EpgaNOQkzAEjgVcX0nOMq0sN48z7WDqE6lPnjNKrR8gaiId3lC4A7X8ENsJ/owIhM+cxoSq7jeGxIXGdrekIyQmG+ZB1xTDW0fsNNGWXwyLlDWKPGckg3BZyNC5RlHxKEKhitmhAhcE4qM8m3IA0I6sXLkPOKaXeRC4Z3vyLXDWRshCc9p5MZiT0uIw3yLQga8SxqFrphVUdiO7Y2SVQM5GludAnqZKLXHdf+GdCRQrOJdnqhVwPunkWJbvAMVDRce8poQifcOCemcJ49GOGxhozEJ156ia1u1GGnHUTuINlhvXhWO2wThcTUiBhkqXKeRCJfhKolEEZzxx2QMzrdjshrHYpEiJFzni9lkvMsTi5J4RyAWComhrlM7cA+1Q0jGeVZiRDjIqrapiM+yJc4zXttkRhnOQpPgncw1iZ51SUJmfEIlCa2w3UlSMhyHpHa0B84CIQmfP0jSGHxqgpCM980oee/UVAkJ2GsmLSWuXyejJF6NhGiBdWDJ9kJeJys753eSVRxn74T0pLZa42w3ORU6Enju8BnN5HXBddgUmMGWPAXBceRNiMd7BSloj08lU5iqcOSQkha4BkmIwp4pZVvxiY5UyMZ3EJ5w1paKVHjPiJDa0UFRDp+MS5VZbEdTtZzD58mMFVz5yYxX1WnTSiUY0Z3ababJxllb5lLgHD2TIcfRbRYUeELtkEFUOC8hJIROG110p43tsDeTn+1olKwLtr2Z5hr/o4pSj4h5nTWXODMixOIcPWsyVpDx2aiI7UE2FL9h7VgSD7exnOG4NzsyflgHjndO9WenO+cCcis5Y1Y5XXGdLztTcP06e+lw5E1IxLFL9irjTCJ7K7DdyYF3/teWg+rEYjlxhiOunCipxXrLZOIxq7LhDrOqcMnxOEUo7OsbgnNaQjI+LZyLKvhcQC7aOcyQ2oIXjBiBM9dcrcReszAdcH2HBLM4giyce8wQUpvE+0yERFyvKpwifNxGyCTwOMJIHEESUgKWmoIN/A8+QgrWG7kfhuO3duQUW8siTcXnRwt1hv/3UShbwPkCBcQMR9GUOjv834qibMIMocfs/F+GDLzB/rRo6bEVK1rVgLljWMV7yMVI39GOlRKfGChWVRwJFWsKjm6LtRGfei1OWFxzKE4X7EuKs4VjxOuELUUJQnXmJwiNq+ElKCGhHS3BxA7fgjWdtdDOfmGpo3W4zleyYZ0VXCi0wnorvGK/UCgWxHsfhBQNe6tcRKyDypXEfKvt716QO60k1EO0x/9fqJIL7DWr7J3jIiTgCL8qbT2chaoZN7hNO3CJtaObeYGIYRKfmK4Uu+Ccthob8d5utaZzUra6dhARI0Zj7lRP6oEcrV4Z/O+B6rXCu2PV29CROvCIfUmlFjimqEErfCaLEI8z5BqZxzVVQiLe16yRG3wKpEYhcORQo2IdXdMKxuc2amIG1w9qIo7iWUiq4r2CSskzPr1JiMe1tJqZxTFfzTLgnKlmU/BJGErzksZPSq4JZ1O1UoZ87O3qBO2/+Xpz3V4Q1V62cvrWXhbyanNqkYbN7bwaXr1tr5C6anfczu/janvGb8e7aR4/RW4ebs/g5eUJ2G+G9brOw+IMsNP19uacPN4dv6/fDvO7l36f75jh1eV495ePfbVXKY3zn+fpYXdCH+dhd3oJyPkWrtRzy9X28Ga1OV/fP9zenFtth/npE+hhu/z7h/mopxf1PF4f7sfN8WUqb4bjS0GO9358o9I47A9hvxrOrzk66n+xnm/aO0DGt8Nud3qVyO07/vpi3V4ic3yt0YF+LYf5/fHH7TvxjIkjJk7Y8cewaA9Ldz9/ebkmztc+uU+er8mXa+p8Tb1c0+dr+uWaOV8z7dr9026c16vt+9cXH7+263fTej09jstvX/DfXDopYf9H3lP0fPf6+H6dz+5tWLt593kPy+EwnN+n8lnjI+v3v37h0XJcrIihN0+b25f3LX11Eny92h9uxt0wD4dpPmP/dcS4vl5Oi++W7fVep+v/ZDrFmrm8dLTSL5UQ9dLpVC6NzdVZZoNM4X+fF9/5HXXf/B9QSwMEFAAAAAgAAAAhAP9ZcoO7AQAA3gkAABQAAAB3b3JkL3dlYlNldHRpbmdzLnhtbO2WTW+jMBBA7yv1PyDfG+wEEkAllaKqVaXuh3bbvRtjEqu2x7KdsOmvXwfSJN320Jw2h5wYjz2PGT0QXF3/UTJacesE6BKRAUYR1wxqoeclenq8vcxQ5DzVNZWgeYnW3KHr6cWXq7ZoefWLex9OuihQtCsUK9HCe1PEsWMLrqgbgOE6bDZgFfVhaeexovZ5aS4ZKEO9qIQUfh0PMR6jLcZ+hgJNIxi/AbZUXPuuPrZcBiJotxDGvdLaz9BasLWxwLhzYR4le56iQu8wJHkHUoJZcND4QRhm21GHCuUEd5GSe0B6HGC4AyhW3M81WFrJoCB0EgUYmgYHtVi57TVqC1GXKEmTYZpmJO/2K6jXN93eisrgF8WbbDDwwBv/msW77E8xX3yQfgTzPjkD70H9kw99zGq7ify+RocnB4WFe9mc2wSGMr6NGUgIwunSQ4+QB50dV1m96ei4Wns4+TGl8X7oPnyrIxulCRmTSXrWcQo6CB5OcD4eYXL2cRI+EkyyPB9NkrOPk/CR4fEEj3Jyfj/+m494/1kH44USL/wW7MxC67jt78bl+rv+/fWhW1Epof3x7a6nHfyVTf8CUEsDBBQAAAAIAAAAIQACsxMwKw4AAByCAAAPAAAAd29yZC9zdHlsZXMueG1s7Z3Pb+PGFcfvBfo/EDq1h41+WL+8iBP4Z73IeuOsvNnziBxZjCmOSlLrdU7bJgGKBEGbIumlCbAB2iQocgjQLZBD/6LY/h86MyQlUo9D8Q0nRgt0L2tRfB/OzPe9N/NIkXz9zeczz3pGg9Bl/k6j/VqrYVHfZo7rn+80npwd3Rs2rDAivkM85tOdxhUNG2++8ctfvH55P4yuPBpaHOCH92f2TmMaRfP7zWZoT+mMhK+xOfX5lxMWzEjEPwbnzRkJLhbzezabzUnkjl3Pja6anVar30gwQRUKm0xcmx4wezGjfiTtmwH1OJH54dSdhyntsgrtkgXOPGA2DUPe6ZkX82bE9ZeYdheAZq4dsJBNotd4Z5IWSRQ3b7fkXzNvBejhAJ0lYGbff3Dus4CMPT76vCUWhzXe4MPvMPuATsjCi0LxMTgNko/JJ/nfEfOj0Lq8T0Lbdc/4kTlk5nLe8a4fug3+DSVhtBu6JPvlYbJNfD8VOxZa2mGU2bznOm6jKQ56QQOff/2MeDuNTrwpfH8/XG5KtnnEP0+3Uf/ek1G2NTuNC3bvrcdi05iDdxokuDfaFYbNpHPN9S7P1z/JA8+J7crjkElEuXe1+y0B9VzhzJ3edvrh8UKML1lELG7de3batjGLpsmB58mBs4dqAiW4I3K3HMXRwb+lk4fMvqDOKOJf7DTk8fnGJw9OA5cFPAJ2GtvbycYRnbnHruNQP7OjP3Ud+nRK/SchdVbb3zmSXpxssNnC539vDdrSO7zQOXxu07mICf6tT4RQj4SBJ/ZeuKuDS/PfprB2ok6R/ZQSkRis9jpiG43oCIsw09ti5mKt7230gbbu6kDduzpQ764O1L+rAw3u6kDDuzrQ9s99INd36PM4EOFhAHUTRxGNaI4i2NAcRSyhOYpQQXMUkYDmKBwdzVH4MZqjcFMEJ2K2ygszzr6l8PZy7uY5Qo+7eUrQ426eAfS4mxO+Hndzftfjbk7netzN2VuPuzlZ47nxUst6wMPMj2pH2YSxyGcRtSL6vD6N+JwlqyUzPDHp0cBIJw1g4syWTMS1aTaRnzd7SK/efB6JAs9iE2vini8CXmTXbTj1n1GPl7sWcRzOMwgMaLQIFCOi49MBndCA+jY16djmoKI6tPzFbGzAN+fk3BiL+o7h4UuJRpLC0qF5TT0VQeIacOoZsQNmYM1CjOWHh25Yf6wExNpbeB41xHpkxsUkq35tIDH1SwOJqV8ZSEz9wiCjmakhSmiGRiqhGRqwhGZo3GL/NDVuCc3QuCU0Q+OW0OqP25kbeXR91dGufu5u32OhiYQ3cs99whcA9aeb5JypdUoCch6Q+dQSZ6s3rrTQx9ljzpV1ZmJOW5JMreuli+zzXrv+ov6A5mimgmvJMxReS56hAFvy6ofYCV8miwXasZl6ZrQYR4VBW70qGBFvES9o60cbiep72CoAjtwgNBYGxVgDHvxILGePDS31Vq2s37AVq35YrWclo81LkAZa6TH7wkwaPr6a04CXZRe1SUfM89gldcwRR1HAYl/LhnynUznkD2fzKQndECCqT/XplXHrhMxrd+jUI65vRrfDezPiepa5FcTx2clD64zNRZkpBsYMcI9FEZsZYyZnAn/1lI5/baaBu7wI9q8M9XbX0OkhCdt3DUwyMYk5hkh8men6rpE5VPLeoldjRgLHDO00oPGPUSJqiDgis7lnKrZ4Xrzk+cfAakjy3iWBK84LmQqqMyOwzGnDcDF+j9r1U90jZhk5M/T2IpLnH+VSt/7V3hyu/jIhh6u/RJBq8ulB+K+BzuZw9Tubw5nq7L5HwtBVXkLV5pnqbsoz3d/6xV/CYx4LJgvP3ACmQGMjmAKNDSHzFjM/NNljyTPYYckz3V+DLiN5Bk7JSd5vAtcxJoaEmVJCwkzJIGGmNJAwowLU/4VOBlb/ZzoZWP3f6sQwQ0uADMyUnxmd/g1d5cnATPmZhJnyMwkz5WcSZsrPtg4sOpnwRbC5KSaDNOVzGaS5icaP6GzOAhJcGUIeevScGDhBGtNOAzYRdykwP/4Rt4nl7GIcmVxsxzhTIj+lY2NNEyyT7TJwRpR4HmOGzq2tJhxpmf/t2iYzeXtH7SacesSmU+Y5NFD0qbReHsW3aqw3v/rFkofu+TSyRtPl2f4spt/aaJkW7DmzzQcsGvN+p8TshDruYpY2FN5M0d+qbtwBxt3NxquVRM6yV9ESHrO/2XK1Ss5ZDipawmMOK1puAcuyeDggwUWhIwzK/GdZ4ymcb1B6YT41LjxsmSMtLYtccFDmRblQsXZtW1wtgOpUixm1fbXgUdtjokhNwYSTmlI5rtSIsgB7TJ+5YeE56g3Xv5e/ngB5v1s5c76zYBG4TN2pflPXA75w8kNqFXK2ql+4ymUZ9ThWTjdqROW8o0ZUTkBqRKVMpDRHpSQ1pXJuUiMqJyk1Ap2t4IyAy1bQHpetoL1OtoIUnWxVYxWgRlReDqgR6ECFCHSg1lgpqBGoQAXmWoEKKehAhQh0oEIEOlDhAgwXqNAeF6jQXidQIUUnUCEFHagQgQ5UiEAHKkSgAxUi0IGqubZXmmsFKqSgAxUi0IEKEehA7dYMVGiPC1RorxOokKITqJCCDlSIQAcqRKADFSLQgQoR6ECFCFSgAnOtQIUUdKBCBDpQIQIdqL2agQrtcYEK7XUCFVJ0AhVS0IEKEehAhQh0oEIEOlAhAh2oEIEKVGCuFaiQgg5UiEAHKkSgA7VfM1ChPS5Qob1OoEKKTqBCCjpQIQIdqBCBDlSIQAcqRKADFSJQgQrMtQIVUtCBChHoQIWIMv9MLlGqfmbfxp/1VP5iH3GfT9yox9lbuXPnUKuj0lapWdXvRdhj7MIqvPFwa6s6xB17LpOnqBWX1bPcAfrC59v75Xf4VHiMR9WuJPdCyGumAN6tagnOqXTLXD5rCYq8bpmnZy3BqrNbln2zlmAa7JYlXRmX6Y9S+HQEjMvSTMa4rTAvy9YZczjEZTk6YwhHuCwzZwzhAJfl44xhzxLJed26V3Gc+svflwJCmTtmCAM1ocwtoVbKc/uVRVMTqqqnJlSVUU1A6anE4IVVo9AKq1F6UsMww0qtH6hqAlZqSNCSGmD0pYYobakhSk9qmBixUkMCVmr95KwmaEkNMPpSQ5S21BClJzWcyrBSQwJWakjASl1zQlZi9KWGKG2pIUpPari4w0oNCVipIQErNSRoSQ0w+lJDlLbUEKUnNaiS0VJDAlZqSMBKDQlaUgOMvtQQpS01RJVJLc+i6FdLGXPcIixjiJuQM4a45Jwx1KiWMtaa1VKGoFktQa30qqWsaHrVUlY9vWopK6NetQT01KuWCoXVq5YKFdarltRS46qlIqn1A1WvWiqSGlctKaXGVUulUuOqpVKpcdWSWmpctVQkNa5aKpJaPznrVUtKqXHVUqnUuGqpVGpctaSWGlctFUmNq5aKpMZVS0VS15yQ9aqlUqlx1VKp1LhqSS01rloqkhpXLRVJjauWiqTGVUtKqXHVUqnUuGqpVGpctaSWGlctFUmNq5aKpMZVS0VS46olpdS4aqlUaly1VCq1olpqXuZewCTY8kVlfOfoak7FM7gzN8w48TNIk4uAcscHzk6DyHcoiUZYyVugklcnybYm1wrl30HIC7pkn1arP+jvpiolb6C6dB12KW4tDpi33DHeQ7zj6ylvydpm8RIqcTMkPThUfvMo903m1VSyC7DT9pT32k6e46TqdAv0WvGIVtmY1dCneydSri7BxvvlLrc2y1oZCanLWthW6JI8CErRru3tag3jzRh7sWr8jwe+EPYyeT9W3EDnOWmkO+5Tzzsh8d5srt7Vo5Mo/rbdGhZ8P44fN6e0D2ReUgKa+cY0l51QD3P8APrkgrlqqDsFQx3folhzlNXtykWmvQj5sMggBm3bAm27/uHz2w+++OnHF8mYEn6st/3023Qkc7E6aA2G7a1crIK3xWXeFbc17KYf1t8VJ56Xv+u557586GL62jjeBLFzNj4V7+Xbadx+8d3Nqz9cf/193A9xoNWb8H7616vrb/4ttsl38WU32OHyk2yJLXLkqoviX/xF9p18yabcO/nSNBKUe05VhU5GQKGTkWmN0nf49X8+Xa6//ezmqxfWT/98ef35f68qy7S5ipAuGP/MAwIKh7+tiuv0+QF5ZY6G/d52q3L0dLqtYpVWEmRz7x6fGWkQrnKrPKp4fnnS0ff5Wkb+IWbD5RsQ+TBn9U8yr5btMitrWac5W8vY5e7k0ON65u/qmTfzw19lNsnlhJUH9oAHrt2uXJIECpywu2np1Wn3hvuHOYd05QwuvGCfL39C8euj2Av5lp3GsFVx7aToYB90MHkPUknHxCOG002iTZvm0oIlSr7Xe/3OsHuQ6zXPBmHyf7qfWC/HS785E8PQS3NqZp8gvYIgd9ludfqpPyS80CfzMyYvYNRYe5ZMGnJAwMT+3Y/X33zPJw1rNV7rY9uCg0v6m4ZWNY5oPxiANicvskL4Qev/jrDmCLAW4cuH60/+jveEwZ15whC0OfeIH4Q/KCfj6qXM2nS9vdXd7ZqcrkvfME3eK3nDtPhS+YbpnOXqDdNi8+oN0+H7ac/aQ7hsirdtXjZh3BEWnrd//vTmw5fW9R8/vPnri+tv/2TdfvTpzcd/u/34R6R/DpFaq4X935ekcgW4DfS4+ctnN598dfvBi5uvXt3+7lX1GqPT63V6R/lzNsmJmaZ2nGRfIJ4kXWOl4peyqy+v//HRzdc/3FFRkm7oFpQpXZ3icSUlPNcmX1VSop8vXkxRnkA7phNorzXoHbTLpwVMQoGnV65///Lm2y+RyUO5YK6UPIo6lf4VvvEfUEsDBBQAAAAIAAAAIQBl4UIG2goAAJMyAQASAAAAd29yZC9udW1iZXJpbmcueG1s7d3fbts4Fgfg+wX2HQIDuZyE/0kFkw4oSlp0MbNY7HYfwHWUxqgtG7KTTufpV47jdNKkJzKVVHLnd+XWFikei6a+kNLRz7/8Pp8d3ZT1arqozkf8hI2OymqyuJhWH85H/3tX/ORGR6v1uLoYzxZVeT76XK5Gv7z5+99+/nRWXc/fl3Wz4VFTR7U6+7ScnI+u1uvl2enpanJVzserk/l0Ui9Wi8v1yWQxP11cXk4n5emnRX1xKhhnt/9a1otJuVo19YRxdTNeje6qmz+ubbEsq+bDy0U9H6+b/9YfTufj+uP18qem9uV4PX0/nU3Xn5u6mdlVszgfXdfV2V0VP903aFPkbNugu5ddibrNfrdFssXkel5W69s9ntblrGnDolpdTZdfwoitrfnwalfJDRXEzXw2uj8EXHU7Blk9/tS8fKmwTfMvtoXms23L6Ro5a3FENlXcl2jThIf73LVkPp5WX3Yc9dX86cvler8KxNcVLD90Ozj/qBfXyy+1TbvV9rb6eF/X5qe9R113B/nPoa26Nea/V+Nl8wucT87efqgW9fj9rGlRc8iOmm/9aNOtR2+aIWf8frWux5P1v67nRw/+9/bifNQMXc3GZ3XZjFf15s3t6OQv12Wd1uX442aTTS3VanrRFL8Zz5p3mJci8Xx0uvlkfj1bT38tb8rZu8/LcrfN1ef39fTit81ns81n223X8+Vst0WaaFew4LafzG42H0ybl22jztbLWTOYpdI5VoT8tg23bdwVv9t7M6AW8/s3L8rJdD6e3Vf5rvz9/rNjfnL//j8nu3dn5eV6+/by3/XmZVpt4ty8fT6yTm+acjWuPtyO7dKwzban9xvXdy/FolqvNltOq/WmFZfjJvC7TW+3Ob3d7deB8i+BMsUSxnhy+04znjWD4k252aJd4NfLZVn/Wq6bw/Z08GLv4LkQD6NX7EH0T4ckHoWURoY0W3wq6/8s5uPq6YjkUxHV0w9XREgmJiT5dUisiAyJ7J5q7yMkWEw46vt1Or1/SComJP3dOp3Zv9MJFxOS+T6dzu59hGTUsGC/X6dz+4cUNSy479bpkv07nWo5NJw+EMGzXOBRXJA2GCbSblyQ3hnrdSC5EJLUJz7z4AK4AC6AC+ACuAAu9MYFEcUFnTdfjg/duJA1WEhNMCQXZJBGMs164oJhf2UuMPbDcSEmpAFzISacgXMhJqSBcyEmpAFzISacgXMhJqSBc6FdSHtyQUZxwalMpGnejQu55k6bzJNcUDYJNuF9LUaAC+ACuAAugAvgAriwHTv250JIvU6TrBsXlMlVkaQ0F7TzIrDCgAvgArgALoAL4AK40BsXdBQX8pCKkKluXGDCqeAKejHChNwwX2AxAlwAF8AFcAFcABf644KJ4QKX3gqWuW5c8KL5lkXCSC4o57wwhcKljj1wAZc6Dp0LuNTxELiASx2HzgVc6tiOCzaKCyERWqcdFyMEN8Zlnp5dcDJzNk8EuAAugAvgArgALoALvXHBxXBBcOutD10vdSwyk7hAX7vAZOqlRN4FcAFcABfABXABXOiRC0kUF5TmViRdb6R0PLfM0nkX7GajzAVcu4BrF3DtwiMu4NqFQ+ACrl0YOhdw7ULLNE1RaR1vvZCLjl4omj8lDHvm4gXnlC8Cx2oEphcwvfDYC5heOAQvYHph6F7A9EJLL0TldRTOFFabjlcv5JKZnDt6fiEvpJLMO3gBXoAX4AV4AV6AF/rzQlRiR8m5E1liunkhyZmT3uakF5RUTKZFX+sR8AK8AC/AC/ACvAAvNM2PyuwouU1kcB3nF6xTInOJor2QpLlOs55SNSXC/oW9II390bxgY0Iarhd4TDjD9oKOCWnYXkhiQhquF6KGhWF7IWpYGLYXWg4N+3ohKrWjFIEJZWU3L6Q8z7165voFIYtmCMnxnCnML2B+4dGZCPMLh+AFzC8M3QuYX2jrhajcjlKpwpi843qEZDKEIhGkFzIr88IaXO8IL8AL8AK8AC/ACz16ISq5o1TOKJ2Jbl7wrghS5/T8QsKls7mDF+AFeAFegBfgBXihRy9EZXeUyhc67ZquyRXaZ4I/k90xZT4Rsq9HTcEL8AK8AC/AC/ACvNA0Pyq9oyysNz7X3byQc+/zVNL3R4RMq1Qx3B8BL8AL8AK8AC/ACz16ISq/o1LNuUSYopsXguEstxk9vyCz1DWb9fVsSngBXoAX4AV4AV6AFzYjTpQXjMuZKTreHyGYCjqX9P2UXGiVZApegBfgBXgBXoAX4IUevRCV31HZzJl8dydkdL4mxXwqMzq/o8kSkwrd0/WOyL/wg3kB+ReG7gXkXxi6F5B/4RC88Dr5F0RUfkdlC6Gy0PV5U4nKBX9mPaIwyhgVkA8a8wuYX3h0JsL8wiF4AfMLQ/cC5hfaeiEqv6PyIkjLbUcvBMdCwej1CB+sN8Hh/gh4AV6AF+AFeAFe6NELUfkdtRbS6Mx184LSwlnlaC9kCQ9pqpB/AV6AF+AFeAFegBd69EJUfkdtcmES2/H6Be642TzRmvRCmnmVed7X/IJhHb3QNPqP3a6E2L0TVg/fO2hVxDw7fuCqiAlpwKqICWfgqogJaeCqiAlpwKqICWfgqogJaeCqaBfSvqqIygKp8yCly1U3VeRMO8ndM3dd+kSlKkOWBsxCYBbisRcwC3EIXsAsxNC9gFmIll6IygJpWAMyoTtmaRC+MM4/c9elcs4rJXJ4AV6AF+AFeAFegBf680JUFkjjUsWU4d28YDgLSSrpuy7vfyu9eCFqJnHgCMAiw9ARgEWGQ0DASy0y9HTSx6LCIZz0X2dRISqVoykKLm3W+dHVTKjM0o+idDpjudC4FQKTBJgkeOwDTBIcgg8wSTB0L2CSoJ0XZFQqRyu1k7rrpY3BOqc186QXmt0oKfOXuRUCXAAXwAVwAVwAF8CFGC5EZXK0OpXc6KwbF7wRonApPb2gcuvzzPhDvRPioL2A5YehewHLD4fgBdzjMHQvYDmipReiMjlaFzKR8o6ZHJXPHbepI73AgnPS4clSmF/A/ALmFw7UC5hfGLoXML/Q0gtRmRxtapn2znfzQpY7pgtOe8GaELLE4R4HeAFegBfgBXgBXujRC1GZHG3IU5amHdcjihCE4Zq+x8GmIec+x3oE1iNexAtYjxi6F7AeMXQvYD3iELzwOusRUZkcbeGZkUpQXpgTUmAZF6lPn8ye0IsLHv1R0/z/ZV3wImEdi30DSxLxILDNc/5anPJfqLUnx3JvpCju9m+xfMEWnxyrvRudOPWg0Za5NuftF230ybHe++SsNX/QbqdbnZxfut0nx2bfpkvxFeU532Zjee4s/AptPzm2ezffffWMWy6saXPWfZ3mnxy7fSNQMnnY529/uS1Osq8Wwclxsm8QmrOH4yO3bU+r1e3ptNqeRrfj+4Nz627/92eS6olygijHiHLy2+UcUUx9u5glimmilZIoZ75djgrOfruYIYo5opWCKJcQ5aj9cfbtgpwsSPQWTn0xnOgukjoQnOgvPKEKEj2Gk3uk+gynChKdhlM/JU50G071bk50HE42leg5kupxguo5ZEFqnKGOo6AGGurLEVTPUVRBoueQIVIdh9wh1XGoclS/oQZTQfQbSf2MBdFvqIMoiW5D/RYl0WuoX5SkhhvqUEii00jqWEii00iyqUSvIVtKdBrx+OC/vfhtPPHrMCvH1fXyqe9i+9fzm/8DUEsDBBQAAAAIAAAAIQC5ATLfTAEAAKgCAAARAAAAZG9jUHJvcHMvY29yZS54bWydkkFPwjAUx+8mfoel963dACPNNhIxXJSExBmNt6Z9QOPaNW1l8O3dBhuonDy+vl9/ee/fprO9KoMdWCcrnaE4IigAzSsh9SZDr8UivEeB80wLVlYaMnQAh2b57U3KDeWVhZWtDFgvwQWNSTvKTYa23huKseNbUMxFDaGb5rqyivmmtBtsGP9kG8AJIXdYgWeCeYZbYWgGIzopBR+U5suWnUBwDCUo0N7hOIrxmfVglbt6oetckEr6g4GraN8c6L2TA1jXdVSPOrSZP8bvy+eXbtVQ6jYrDihPBafcAvOVzYv5U4ov6ja7kjm/bGJeSxAPhyPy97glLexk+zp50hFD2VtWVmoPIk9IMgnJJEymBRnTcUwJ+RicPZSe8jnOAiJo9qLHFPrO22j+WCxQ67sLyTQkcUGmlEyOvl/3z0J1mvrfxl6Qd0P//Fv5N1BLAwQUAAAACAAAACEAg2MI9ncCAABSBwAAEgAAAHdvcmQvZm9udFRhYmxlLnhtbLWTTWvbMBjH74N9B6N7Y9lpXqlbmqYeO6yHLf0AqiInYnoxkpIst8EYDHoqNDtt0F62MXYorLvtEzXpd5j8krQQd40Hk7EtP8+jv6Sf/9rZe8OZMyZKUykC4FUgcIjAsk/FIADHvXCrCRxtkOgjJgUJwJRosLf79MnOpB1JYbRjxwvd5jgAQ2PitutqPCQc6YqMibDJSCqOjP1UA5cj9XoUb2HJY2ToCWXUTF0fwjrIZdQmKjKKKCZdiUecCJOOdxVhVlEKPaSxXqpNNlGbSNWPlcREa7tnzjI9jqhYyXjba0KcYiW1jEzFbiZfUSplh3sw7XF2J1ArJ+CvBDhuPx8IqdAJs/DtShwrBnZz+s6kLRC3iR7lRDtHZOK8lByJtCBGQmri2ZoxYgGAvr3qsAprcNvevu1tAzcpxEOkNDGrQpiFI8Qpmy6jKtVNEzE1eLiMj5GiyeKylKYDmxjpExiAQwihfxiGIIt4ATiwkUaz1skjfjJX2lp5pLqKwCSCU53008t0cKqzqrFzuhmJNSLzr2eLz2+dm58X8/PZAzw6lkPVvpOWPIt5NL0iHlz2iSoHpJVNdA+I3+o2GgfhGhDPfwRIMykqB+R29m1x/WF++WN+dX77LkOCmDmyyeXS9+3KmXMsqD3/xHnxqgSO8vawxwT6+83GHQ2v1Q2Tdp+G1wm73cbfaXhheXvc/Lqef/ldBOHZiFGe76TAMfXsBy2v/+uYTmqY/XuOqT/gmCp83DGtkoxuZ58WH88Wpxfz7+8Xl1dFsHIvFdIqaP9mKCFNT41IbxqTdXh9EqERMwX+yo/SHTvYyv7e2mnbgN0q8hC7vKN3/wBQSwMEFAAAAAgAAAAhAMWAP+zmAQAA5gMAABAAAABkb2NQcm9wcy9hcHAueG1snVPBctMwEL0zwz94dG9kJ5CGjKIOkw7TA9DMxG3PQl4nGmxJI20zLd/CgSv8GnwEK5sYh/aET2/frp+edlfi4qFtsgOEaJxdsWKSswysdpWxuxW7Kd+dLVgWUdlKNc7Cij1CZBfy5QuxCc5DQAMxIwkbV2yP6JecR72HVsUJpS1lahdahRSGHXd1bTRcOn3fgkU+zfM5hwcEW0F15gdB1isuD/i/opXTyV+8LR896UlRQusbhSA/pj+bSeWwFXxgRelQNaVpQeZED4HYqB1EOSOyR+LOhSrK6SIvBO+xWO9VUBqph7J4/WY+F3zEiLfeN0YrpP7KD0YHF12N2XVnOksKgo9LBF1kC/o+GHxMXsaheG8seShmM8F7SP6C2gXl92TyPJkcQrHVqoE1dUHWqokg+F9CXIFKE94okywecHkAjS5k0XyhGU9Z9klFSL1bsYMKRllkfVkfdLjxEYP89e3rzx/fBR+IDo7rxti8kkVXQOC0kA8mCJ/aKw02EK9ruhw+47YYu+08sJG/J86OZ/yjunatV5Z6zAdELf4cb3zpLtOK/GniKTma/Z3B/dYrnQa0OE8b82xObImFisY6jGUgxBXdITTpBPrX7qA61jxNpL267Z8tbd0kp69bpCNHuzC8J/kbUEsBAi0AFAAAAAgAAAAhAHohMDp5AQAALQcAABMAAAAAAAAAAAAAAIABAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECLQAUAAAACAAAACEAHpEat+kAAABOAgAACwAAAAAAAAAAAAAAgAGqAQAAX3JlbHMvLnJlbHNQSwECLQAUAAAACAAAACEA5RyHtiIBAAA+BQAAHAAAAAAAAAAAAAAAgAG8AgAAd29yZC9fcmVscy9kb2N1bWVudC54bWwucmVsc1BLAQItABQAAAAIAAAAIQDhBelCowIAAMkPAAARAAAAAAAAAAAAAACAARgEAAB3b3JkL2RvY3VtZW50LnhtbFBLAQItABQAAAAIAAAAIQDUczl82QEAAJEGAAASAAAAAAAAAAAAAACAAeoGAAB3b3JkL2Zvb3Rub3Rlcy54bWxQSwECLQAUAAAACAAAACEAJSNZqtgBAACLBgAAEQAAAAAAAAAAAAAAgAHzCAAAd29yZC9lbmRub3Rlcy54bWxQSwECLQAUAAAACAAAACEAoadvrfUBAAAKBgAAEAAAAAAAAAAAAAAAgAH6CgAAd29yZC9mb290ZXIxLnhtbFBLAQItABQAAAAIAAAAIQD/vArg/AUAAJYaAAAVAAAAAAAAAAAAAACAAR0NAAB3b3JkL3RoZW1lL3RoZW1lMS54bWxQSwECLQAUAAAACAAAACEAjEXkcHoRAADpTgAAEQAAAAAAAAAAAAAAgAFMEwAAd29yZC9zZXR0aW5ncy54bWxQSwECLQAUAAAACAAAACEA/1lyg7sBAADeCQAAFAAAAAAAAAAAAAAAgAH1JAAAd29yZC93ZWJTZXR0aW5ncy54bWxQSwECLQAUAAAACAAAACEAArMTMCsOAAAcggAADwAAAAAAAAAAAAAAgAHiJgAAd29yZC9zdHlsZXMueG1sUEsBAi0AFAAAAAgAAAAhAGXhQgbaCgAAkzIBABIAAAAAAAAAAAAAAIABOjUAAHdvcmQvbnVtYmVyaW5nLnhtbFBLAQItABQAAAAIAAAAIQC5ATLfTAEAAKgCAAARAAAAAAAAAAAAAACAAURAAABkb2NQcm9wcy9jb3JlLnhtbFBLAQItABQAAAAIAAAAIQCDYwj2dwIAAFIHAAASAAAAAAAAAAAAAACAAb9BAAB3b3JkL2ZvbnRUYWJsZS54bWxQSwECLQAUAAAACAAAACEAxYA/7OYBAADmAwAAEAAAAAAAAAAAAAAAgAFmRAAAZG9jUHJvcHMvYXBwLnhtbFBLBQYAAAAADwAPAL4DAAB6RgAAAAA=";

  const HOLIDAY_DOC_BLOCK_PREFIX = `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00C40615" w:rsidRPr="00DF6250" w:rsidRDefault="00DF6250" w:rsidP="00DF6250"><w:pPr><w:pStyle w:val="a3"/><w:wordWrap/><w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/><w:u w:val="single" w:color="000000"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:b/><w:bCs/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr><w:t xml:space="preserve">              </w:t></w:r></w:p><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00E40DEF" w:rsidRDefault="00E40DEF" w:rsidP="00E40DEF"><w:pPr><w:pStyle w:val="a3"/><w:wordWrap/><w:spacing w:line="240" w:lineRule="auto"/><w:ind w:firstLineChars="700" w:firstLine="2520"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:b/><w:bCs/><w:sz w:val="36"/><w:szCs w:val="36"/><w:u w:val="single" w:color="000000"/></w:rPr></w:pPr><w:r w:rsidRPr="00E40DEF"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:bCs/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr><w:t xml:space="preserve">   </w:t></w:r><w:r w:rsidRPr="002158CE"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:b/><w:bCs/><w:sz w:val="36"/><w:szCs w:val="36"/><w:u w:val="single" w:color="000000"/></w:rPr><w:t xml:space="preserve">휴일대체 </w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:b/><w:bCs/><w:sz w:val="36"/><w:szCs w:val="36"/><w:u w:val="single" w:color="000000"/></w:rPr><w:t>확인서</w:t></w:r><w:r w:rsidRPr="00E40DEF"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="36"/></w:rPr><w:t xml:space="preserve">       </w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="36"/></w:rPr><w:t xml:space="preserve">          </w:t></w:r></w:p><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00E40DEF" w:rsidRPr="004322B2" w:rsidRDefault="00E40DEF" w:rsidP="002575D5"><w:pPr><w:pStyle w:val="a5"/><w:wordWrap/><w:ind w:leftChars="0"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>1. 확인사항</w:t></w:r></w:p><w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><w:tblPr><w:tblStyle w:val="a4"/><w:tblW w:w="8931" w:type="dxa"/><w:tblInd w:w="-145" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="2" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="2" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="12" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="12" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="12" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="12" w:space="0" w:color="auto"/></w:tblBorders><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="8931"/></w:tblGrid><w:tr w:rsidR="00E40DEF" w:rsidRPr="002B20FE" w:rsidTr="00185B54"><w:trPr><w:trHeight w:val="282"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="8931" w:type="dxa"/></w:tcPr><w:p w:rsidR="00E40DEF" w:rsidRDefault="00E40DEF" w:rsidP="00DC43E5"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:pPr><w:r w:rsidRPr="00017920"><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>본인은 익월 근무</w:t></w:r><w:r w:rsidR="000C6B05"><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00017920"><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>스케쥴을</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00017920"><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve"> 확인하였으며</w:t></w:r><w:r><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve"> 이에 따른 </w:t></w:r><w:r w:rsidR="00DC43E5"><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>휴일대체 부여를 확인하고 근로함에 동의</w:t></w:r><w:r><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>합니다.</w:t></w:r></w:p><w:p w:rsidR="00E40DEF" w:rsidRPr="00D0544C" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr></w:pPr><w:r w:rsidRPr="00D0544C"><w:rPr><w:rFonts w:hint="eastAsia"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t xml:space="preserve">※ 휴일이 대체되면 당초의 휴일이 </w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00D0544C"><w:rPr><w:rFonts w:hint="eastAsia"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t>근로일이</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00D0544C"><w:rPr><w:rFonts w:hint="eastAsia"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t xml:space="preserve"> 되고, 대체된 날이 휴일이 되므로 휴일대체의 사실을 알려주었음에도 그날 근로를 하지 않았을 경우에는 </w:t></w:r><w:r><w:rPr><w:rFonts w:hint="eastAsia"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t>결근 처리함</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00E40DEF" w:rsidRPr="0035327E" w:rsidRDefault="00E40DEF" w:rsidP="00E40DEF"><w:pPr><w:pStyle w:val="a5"/><w:wordWrap/><w:ind w:leftChars="0" w:left="560"/><w:rPr><w:rFonts w:eastAsiaTheme="minorHAnsi"/><w:b/><w:bCs/><w:sz w:val="22"/><w:u w:val="single" w:color="000000"/></w:rPr></w:pPr></w:p><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00E40DEF" w:rsidRPr="004322B2" w:rsidRDefault="00E40DEF" w:rsidP="002575D5"><w:pPr><w:pStyle w:val="a5"/><w:wordWrap/><w:ind w:leftChars="0"/><w:rPr><w:rFonts w:eastAsiaTheme="minorHAnsi"/><w:b/><w:bCs/><w:sz w:val="22"/><w:u w:val="single" w:color="000000"/></w:rPr></w:pPr><w:r w:rsidRPr="004322B2"><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>2. 휴일대체 여부</w:t></w:r></w:p><w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><w:tblPr><w:tblStyle w:val="a4"/><w:tblW w:w="9430" w:type="dxa"/><w:tblInd w:w="-289" w:type="dxa"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="1553"/><w:gridCol w:w="716"/><w:gridCol w:w="2693"/><w:gridCol w:w="2693"/><w:gridCol w:w="1775"/></w:tblGrid><w:tr w:rsidR="00E40DEF" w:rsidTr="009E2ABA"><w:trPr><w:trHeight w:val="1008"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="1553" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="DBDBDB" w:themeFill="accent3" w:themeFillTint="66"/><w:vAlign w:val="center"/></w:tcPr><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:proofErr w:type="gramStart"/><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>성  명</w:t></w:r><w:proofErr w:type="gramEnd"/></w:p><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>(사 번)</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="716" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="DBDBDB" w:themeFill="accent3" w:themeFillTint="66"/><w:vAlign w:val="center"/></w:tcPr><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>순번</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2693" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="DBDBDB" w:themeFill="accent3" w:themeFillTint="66"/><w:vAlign w:val="center"/></w:tcPr><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>휴일</w:t></w:r><w:r w:rsidR="00185B54"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t xml:space="preserve"> 및 임시공휴일</w:t></w:r></w:p><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="00185B54"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>(이날의 근로는</w:t></w:r><w:r w:rsidR="00185B54"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>통상근로)</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2693" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="DBDBDB" w:themeFill="accent3" w:themeFillTint="66"/><w:vAlign w:val="center"/></w:tcPr><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>대체 휴일</w:t></w:r></w:p><w:p w:rsidR="00E40DEF" w:rsidRPr="005B1343" w:rsidRDefault="00E40DEF" w:rsidP="00185B54"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr></w:pPr><w:r w:rsidRPr="005B1343"><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:b/><w:szCs w:val="20"/></w:rPr><w:t>(이날의 근로는 휴일근로)</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1775" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="DBDBDB" w:themeFill="accent3" w:themeFillTint="66"/><w:vAlign w:val="center"/></w:tcPr><w:p w:rsidR="00E40DEF" w:rsidRDefault="00E40DEF" w:rsidP="006C176B"><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:b/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:hint="eastAsia"/><w:b/></w:rPr><w:t>비고</w:t></w:r></w:p></w:tc></w:tr>`;

  const HOLIDAY_DOC_BLOCK_SUFFIX = `</w:tbl><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00DC43E5" w:rsidRDefault="00DC43E5" w:rsidP="00DC43E5"><w:pPr><w:pStyle w:val="MS"/><w:wordWrap/><w:spacing w:line="240" w:lineRule="auto"/><w:ind w:right="800"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr></w:pPr></w:p><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00DC43E5" w:rsidRDefault="008859A4" w:rsidP="00DC43E5"><w:pPr><w:pStyle w:val="MS"/><w:wordWrap/><w:spacing w:line="240" w:lineRule="auto"/><w:ind w:right="800"/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/></w:rPr><w:t>본인은</w:t></w:r><w:r w:rsidR="0014162F"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r w:rsidR="00F97A2B"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/></w:rPr><w:t xml:space="preserve">§YEAR§년 </w:t></w:r><w:r w:rsidR="009B423B"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/></w:rPr><w:t>§MONTH§월</w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/></w:rPr><w:t xml:space="preserve"> 휴일 및 임시공휴일 근로에 다른 대체휴무</w:t></w:r><w:r w:rsidR="00DC43E5"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/></w:rPr><w:t xml:space="preserve"> 진행을 동의 합니다.</w:t></w:r></w:p><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00913565" w:rsidRDefault="00E40DEF" w:rsidP="00EA2528"><w:pPr><w:pStyle w:val="MS"/><w:wordWrap/><w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="right"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t>담당</w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t>매니저 :</w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve"> §MANAGER§</w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">   (서  명)</w:t></w:r></w:p><w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" w:rsidR="00913565" w:rsidRDefault="00E40DEF" w:rsidP="00EA2528"><w:pPr><w:pStyle w:val="MS"/><w:wordWrap/><w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="right"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t>근로자</w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve"> 확인 :  </w:t></w:r><w:r><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:hint="eastAsia"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">         (서  명)</w:t></w:r></w:p>`;
  // XML 특수문자 이스케이프 (이름·사번·비고 등 사용자 데이터를 표 셀에 넣을 때 사용)
  function holidayDocXmlEsc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 표 왼쪽 "성 명 (사 번)" 칸. 13행을 세로 병합(vMerge)하는 원본 양식과 동일하게,
  // 첫 행에서만 실제 내용(이름 줄바꿈 + 사번)을 채우고 나머지 행은 병합만 이어간다.
  function holidayDocNameCellXml(isFirstRow, name, empNo) {
    if (isFirstRow) {
      return `<w:tc><w:tcPr><w:tcW w:w="1553" w:type="dxa"/><w:vMerge w:val="restart"/><w:vAlign w:val="center"/></w:tcPr>` +
        `<w:p><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:szCs w:val="20"/></w:rPr></w:pPr>` +
        `<w:r><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:szCs w:val="20"/></w:rPr><w:t>${holidayDocXmlEsc(name)}</w:t></w:r></w:p>` +
        `<w:p><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:szCs w:val="20"/></w:rPr></w:pPr>` +
        `<w:r><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:szCs w:val="20"/></w:rPr><w:t>(${holidayDocXmlEsc(empNo)})</w:t></w:r></w:p></w:tc>`;
    }
    return `<w:tc><w:tcPr><w:tcW w:w="1553" w:type="dxa"/><w:vMerge/><w:vAlign w:val="center"/></w:tcPr>` +
      `<w:p><w:pPr><w:wordWrap/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:szCs w:val="20"/></w:rPr></w:pPr></w:p></w:tc>`;
  }

  // 가운데 정렬된 일반 텍스트 칸(순번/날짜/비고). text가 빈 문자열이면 원본 양식처럼
  // 아예 빈 문단(런 없음)으로 남겨서 인쇄했을 때 불필요한 표시가 남지 않게 한다.
  function holidayDocTextCellXml(width, text) {
    const runXml = text
      ? `<w:r><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia" w:hint="eastAsia"/><w:szCs w:val="20"/></w:rPr><w:t>${holidayDocXmlEsc(text)}</w:t></w:r>`
      : "";
    return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>` +
      `<w:p><w:pPr><w:wordWrap/><w:jc w:val="center"/><w:rPr><w:rFonts w:asciiTheme="minorEastAsia" w:hAnsiTheme="minorEastAsia"/><w:szCs w:val="20"/></w:rPr></w:pPr>${runXml}</w:p></w:tc>`;
  }

  // 데이터 행 1개(순번, 휴일 및 임시공휴일, 대체 휴일, 비고) + (첫 행이면) 성명·사번 칸.
  function holidayDocRowXml(rowNum, isFirstRow, name, empNo, holDate, subDate, note) {
    const nameCell = holidayDocNameCellXml(isFirstRow, name, empNo);
    const seqCell = holidayDocTextCellXml(716, String(rowNum));
    const holCell = holidayDocTextCellXml(2693, holDate || "");
    const subCell = holidayDocTextCellXml(2693, subDate || "");
    const noteCell = holidayDocTextCellXml(1775, note || "");
    return `<w:tr><w:trPr><w:trHeight w:val="566"/></w:trPr>${nameCell}${seqCell}${holCell}${subCell}${noteCell}</w:tr>`;
  }

  // 특정 날짜가 "휴일"(토·일·회사 지정 공휴일 포함)인지 판단.
  function holidayDocIsHolidayDate(dateKey) {
    const parts = (dateKey || "").split("-").map(Number);
    if (parts.length < 3) return false;
    const wd = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    return wd === 0 || wd === 6 || !!getHoliday(dateKey);
  }

  // 한 사람의 휴일대체 확인서 한 페이지(표 포함) 전체를 만든다.
  // - holidayDates: "휴일 및 임시공휴일" 열에 들어갈 날짜들 (오름차순)
  // - substEntries: "대체 휴일" 열에 들어갈 { date, note } 목록 (오름차순). note는 비고 칸에 그대로 들어간다.
  // 원본 양식이 항상 13행을 두므로 그 이하일 땐 13행을 유지하고, 넘치면 필요한 만큼 늘린다.
  function holidayDocPersonBlockXml(staff, year, month, manager, holidayDates, substEntries, pageBreakBefore) {
    const rowCount = Math.max(13, holidayDates.length, substEntries.length);
    let rowsXml = "";
    for (let i = 0; i < rowCount; i++) {
      const sub = substEntries[i];
      rowsXml += holidayDocRowXml(i + 1, i === 0, staff.name, staff.empNo, holidayDates[i], sub ? sub.date : undefined, sub ? sub.note : "");
    }
    let block = HOLIDAY_DOC_BLOCK_PREFIX + rowsXml + HOLIDAY_DOC_BLOCK_SUFFIX;
    block = block.split("§YEAR§").join(String(year));
    block = block.split("§MONTH§").join(pad2(month));
    block = block.split("§MANAGER§").join(holidayDocXmlEsc(manager || ""));
    // 사람 사이 페이지 나눔은 별도의 빈 문단(<w:br w:type="page"/>)을 추가하는 대신,
    // 이 블록의 첫 문단 pPr에 <w:pageBreakBefore/>를 심어서 처리한다. 별도 문단으로
    // 나눔을 넣으면, 이전 사람의 표가 페이지를 거의 다 채운 경우 그 빈 문단 하나만
    // 다음 페이지로 밀려나 "공백 페이지"가 생긴다. pageBreakBefore는 문단 자체를
    // 추가하지 않고 다음 내용이 항상 새 페이지에서 "바로" 시작하게 만들어 이 문제가
    // 생기지 않는다.
    if (pageBreakBefore) {
      block = block.replace('<w:pPr><w:pStyle w:val="a3"/>', '<w:pPr><w:pageBreakBefore/><w:pStyle w:val="a3"/>');
    }
    return block;
  }

  // 대체휴일로 인정하는 메모 문구. 평일에 근무(1)로 기재되어 있어도, 이 메모가 달려 있어야만
  // "오프였던 날을 반납하고 출근한 날 = 대체 휴일"로 간주한다.
  const HOLIDAY_DOC_SUBST_MEMO = "오프반납";

  // "대체 휴일" 열에 그대로 인정하는 상태 값들 (오프/휴일/공휴/대휴). "휴일"이라는 토큰도
  // 스케줄상으로는 OFF 상태로 저장되므로 별도 상태 코드가 없다.
  const HOLIDAY_DOC_SUBST_STATUSES = ["OFF", "GONGHYU", "DAEHYU"];

  // 이번 달(스케줄 상 year/monthIndex) 전체 인원을 훑어서, 사람별로
  // "휴일 및 임시공휴일에 근무(1)·연차로 표기된 날짜"와
  // "평일(토/일/공휴일이 아닌 날) 중 상태가 오프/휴일/공휴/대휴로 기재된 날짜"를 모은다.
  // 평일에 근무(1)로 기재되어 있어도 메모가 '오프반납'이면 오프/휴일/공휴/대휴로 간주해서
  // 함께 모으고, 이 경우에는 비고 칸에 '오프반납'이라고 표시한다.
  // 하나도 해당 사항이 없는 사람은 확인서 자체를 만들지 않는다(원본 양식과 동일).
  function collectHolidayDocData(year, monthIndex) {
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const adminStaff = monthStaff.filter((s) => s.isAdmin);
    const dayStaff = sortStaffByType(monthStaff.filter((s) => s.group !== "night" && !s.isAdmin));
    const nightStaff = sortStaffByType(monthStaff.filter((s) => s.group === "night" && !s.isAdmin));
    const ordered = adminStaff.concat(dayStaff, nightStaff);

    const results = [];
    ordered.forEach((s) => {
      const holidayDates = [];
      const substEntries = [];
      for (let d = 1; d <= numDays; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const rec = getScheduleRecord(s.id, dateKey);
        const isNormalWork = rec.status === "WORK" && !rec.attendance;
        if (holidayDocIsHolidayDate(dateKey)) {
          if (isNormalWork || rec.status === "ANNUAL") holidayDates.push(dateKey);
        } else if (HOLIDAY_DOC_SUBST_STATUSES.indexOf(rec.status) !== -1) {
          substEntries.push({ date: dateKey, note: "" });
        } else if (isNormalWork) {
          const memo = (getScheduleMemo(s.id, dateKey) || "").trim();
          if (memo === HOLIDAY_DOC_SUBST_MEMO) substEntries.push({ date: dateKey, note: memo });
        }
      }
      if (holidayDates.length > 0 || substEntries.length > 0) {
        results.push({ staff: s, holidayDates, substEntries });
      }
    });
    return results;
  }

  // 확인서에 적을 담당 매니저 이름 (엑셀 다운로드처럼 별도 패널 없이 바로 받도록 고정값 사용).
  const scheduleHolidayDocManager = "백주희";

  // 위에서 모은 데이터로 실제 .docx 파일(원본 양식과 동일한 서식)을 만들어 내려받는다.
  // "엑셀로 다운로드" 버튼과 동일하게, 누르면 별도 패널 없이 바로 파일이 생성되어 다운로드된다.
  async function generateHolidayDocx() {
    if (typeof JSZip === "undefined") {
      flashScheduleStatus("문서 생성 기능을 불러오지 못했어요. 인터넷 연결을 확인해주세요.");
      return;
    }
    const { year, monthIndex } = scheduleUi;
    const month = monthIndex + 1;
    const manager = (scheduleHolidayDocManager || "").trim();
    const data = collectHolidayDocData(year, monthIndex);
    if (data.length === 0) {
      flashScheduleStatus("이 달에는 휴일대체로 표기할 근무 기록이 없어요.");
      return;
    }

    const btn = document.getElementById("sch-holidaydoc-btn");
    if (btn) { btn.disabled = true; btn.textContent = "확인서 생성 중..."; }
    try {
      // 사람 사이는 각 블록의 첫 문단에 pageBreakBefore를 심어서 나눈다(표 길이가 우연히
      // 한 페이지를 안 채우는 경우에도 다음 사람이 항상 새 페이지에서 시작). 별도의 빈
      // "페이지 나눔용" 문단을 끼워 넣지 않으므로, 이전 사람의 표가 페이지를 거의 다
      // 채운 경우에도 짝수 페이지에 빈 페이지가 생기지 않는다.
      const blocksXml = data
        .map((item, idx) => holidayDocPersonBlockXml(item.staff, year, month, manager, item.holidayDates, item.substEntries, idx > 0))
        .join("");

      const zip = await JSZip.loadAsync(HOLIDAY_DOC_SKELETON_B64, { base64: true });
      const original = await zip.file("word/document.xml").async("string");
      // 스켈레톤 문서의 <w:body> 여는 태그 바로 뒤에 사람별 블록들을 끼워 넣는다.
      // 스켈레톤에는 body 닫는 태그 앞에 빈 문단이 하나 남아있는데(원본 양식의 잔재),
      // 이게 항상 마지막 사람 블록 뒤에 붙다 보니 표가 페이지를 거의 다 채우는 경우
      // 이 빈 문단 하나만 다음 페이지로 밀려나서 빈 페이지가 생겨버린다. 그래서 그
      // 빈 문단은 건너뛰고 문서 구역 설정(sectPr)부터 바로 이어붙인다.
      const bodyOpenTag = "<w:body>";
      const insertAt = original.indexOf(bodyOpenTag) + bodyOpenTag.length;
      const sectPrIdx = original.indexOf("<w:sectPr", insertAt);
      const tail = sectPrIdx !== -1 ? original.slice(sectPrIdx) : original.slice(insertAt);
      const newXml = original.slice(0, insertAt) + blocksXml + tail;
      zip.file("word/document.xml", newXml);

      const blob = await zip.generateAsync({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `휴일대체_확인서_${year}_${pad2(month)}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      flashScheduleStatus(`휴일대체 확인서를 다운로드했어요. (${data.length}명 분)`);
    } catch (e) {
      flashScheduleStatus("문서를 만드는 중 문제가 발생했어요.");
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = `${ICON_CLIPBOARD} 휴일대체 확인서`; }
    }
  }

  // 07c-schedule-auto-fill.js — 월별 스케줄 "AI 자동 배치"
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  //
  // 하는 일: 그 달의 "공휴일 + 토요일 + 일요일" 개수를 인원별 목표 오프(OFF) 개수로 잡고,
  // 이미 뭔가 입력된 칸(연차·공가·특휴·교육·기존 오프·대휴 등 무엇이든)은 절대 건드리지 않은 채
  // 기본값(근무)인 빈 칸에만 새로 "오프"를 채운다. 채울 때는 조(주간/야간)×업무구분(채팅/유선)별
  // 필요인력 대비, 금·토·월은 부족을 절대 허용하지 않고 0만 허용하며, 그 외 요일은 되도록 -1
  // (정 안 되면 최후의 수단으로 -2까지) 범위 안에서 가장 안전한 날짜를 고른다. 대비(투입-필요인력)가 +인 날(인원이 남는 날)은
  // 항상 허용하고 "부족"(-)만 제한한다. 단, 그 날짜가 공휴일인 평일(월~금)이면 금·토·월이어도 -2까지 허용한다.
  // 목표 개수를 계산할 때, 이미 입력된 "오프류" 중 대휴·공휴는 그대로 빼주고, "오프"는 그 칸의
  // 메모에 "필휴"라고 적혀 있을 때만 뺀다(필휴 표시가 없는 오프는 연차·공가·육휴·특휴와 같은 취급으로
  // 목표 달성에 포함시키지 않는다). 연차·공가·육휴·특휴는 항상 별도로 취급해서 목표 달성에 포함시키지 않는다.
  // 실제로 저장하지 않고 "계획(plan)"만 만든 뒤, 미리보기 팝업에서 "이대로 입력"을 눌러야
  // 비로소 scheduleData에 반영된다.
  //
  // ---- 배치 조건: 제외할 인원 (이번 배치 한정, 저장 안 함) ----
  //  미리보기 팝업의 "배치 조건"에서 인원을 고르면(여러 명 가능) 그 인원은 이번 계산에서 "그 달 재직 인원에
  //  없는 것처럼" 취급한다. 그 인원에게는 오프를 새로 배정하지 않고, 조×업무구분 출근 인원수·필요인력 대비·
  //  출근 인원수·필요인력 대비 재직 인원수를 셀 때도 빠진다(= 나머지 인원만으로 필요인력을 맞춘다). 미리보기 표에서도
  //  그 인원을 빼고 그려서 집계·대비·O/X가 계획과 같은 기준으로 보인다. 실제 스케줄의 그 인원 칸은 건드리지 않는다.
  //  팝업을 열 때마다 비워지므로 다음 배치에 남아서 조용히 빠지는 일은 없다.
  //
  // ---- 대전제: 구분별 하루 출근 인원 최소 3명 (예외 없음, 아래 모든 조건보다 우선) ----
  //  주간 유선/주간 채팅/야간 유선/야간 채팅 각 구분에서, 어느 날이든 출근 인원이 3명 밑으로 떨어지지 않게 한다.
  //  오프를 넣었을 때 그 날 그 구분의 출근 인원이 3명 미만이 되는 배치는 다른 조건(연속 근무·필요인력·선호 요일)과
  //  상관없이 후보에서 아예 제외한다. 그래서 목표 오프 개수를 못 채우거나 연속 근무 5일 제한을 못 지켜도 이 조건이 먼저다
  //  (그 경우는 경고로 알려준다). "출근 인원"은 월별 스케줄 표의 투입 인원과 같은 기준(근무·결근 제외)으로 센다.
  //  - 이미 입력된 값(연차·공가 등) 때문에 원래부터 3명 미만인 날은 새 오프를 넣지 않고, 경고로 알려준다.
  //  - 그 구분의 재직 인원이 3명 미만이면 애초에 지킬 수 없으므로 그 구분에는 적용하지 않고 경고로 알려준다.
  //  - 이번 배치에서 제외한 인원은 재직 인원에서 빠진 것으로 세어 나머지 인원으로 이 조건을 지킨다.
  //
  // ---- 날짜를 고를 때 지키는 조건 (강한 순서) ----
  //  1) 연속 근무 5일 제한(SCHEDULE_AUTO_MAX_WORK_STREAK): 원칙적으로 6일 연속 근무가 나오지 않게 한다.
  //     단, 필휴가 기존 일정에 몰려 빈 칸이 부족해 5일 제한을 피할 수 없는 경우에는 6일까지 허용한다.
  //     7일 이상 연속 근무는 허용하지 않는다.
  //     - 이번 달 안에서는 물론이고, "지난달에도 있던 인원"은 지난달 말일부터 이어진 연속 근무일수를
  //       월 초에 그대로 이어서 센다(예: 지난달 마지막 4일을 연속 근무했으면 이번 달은 1~2일 안에 오프가 필요).
  //     - 근무일로 세는 것: 근무(결근 제외)·반차·교육. 오프류·연차·공가·퇴사 등은 쉬는 날로 본다.
  //     - 오프 개수는 목표(공휴일+토+일)를 넘겨서 늘리지 않는다. 그 개수 안에서 못 막는 구간(빈 칸이
  //       없거나 이미 입력된 값 때문에)은 경고로 알려준다.
  //  2) 필요인력 허용범위: 금·토·월은 0(부족 없음)만 허용한다. -1까지 넓히는 최후의 수단은 없다. 그 외 요일(화·수·목·일)은 1순위로 -1을 찾고, 정 안 되면 최후의 수단으로
  //     -2까지 넓혀서 고른다. 대비가 +(인원이 남음)인 건 언제나 허용한다(부족만 제한).
  //     추가로 각 구분(조×업무구분)마다 모든 인원이 출근하는 날이 생기지 않도록, 그런 날을 우선해서 오프를 배정한다.
  //     이때 그 날을 해소하기 위해 필요한 경우에만 해당 구분의 필요인력 부족을 -1까지 한시적으로 허용한다.
  //     즉, 모든 인원 출근을 피하기 위한 날짜에서만 기존 허용범위보다 -1을 더 허용하며, 다른 날짜에는 기존 범위를 그대로 적용한다.
  //     다만 그 날짜가 평일 공휴일이면 금·토·월이어도 -2까지 허용한다
  //     (토요일 자체는 "평일"이 아니므로 이 예외 대상이 아니다).
  //     허용범위(금·토·월은 0, 그 외/공휴일은 -2)를 넘겨서(더 부족하게) 배치될 때만 경고로 알려준다.
  //  3) 연속 오프 3일 제한(SCHEDULE_AUTO_MAX_OFF_STREAK): 새로 배정하는 오프 때문에
  //     기존 휴무(필휴 포함)와 연결되어 연속 휴무가 4일 이상 생기지 않게 고른다.
  //     필휴도 실제 연속 오프 구간에 포함해서 계산한다. 이미 입력된 4일 이상 연속 휴무는
  //     기존 일정을 건드리지 않고 경고로 알려주며, 그 구간을 더 늘리는 새 오프는 넣지 않는다.
  //  4) 인원별 "선호 오프 / 선호 출근 요일"(소프트 조건): 위 1)~3)의 강한 조건과
  //     필요인력 1순위 범위를 지키면서, 같은 수준의 후보끼리는 선호를 이전보다 더 적극적으로 반영한다.
  //     선호를 강제하지 않으며 필요인력/연속근무/연속오프 같은 앞선 조건을 깨지 않는다.
  //  5) 그 밖의 분산 기준(제약 없는 날 우선, 여유가 큰 날, 이미 몰린 날 회피, 빠른 날짜)
  //
  // ---- 관리자는 대상에서 제외 ----
  //  관리자(isAdmin)는 애초에 필요인력 집계에도 들어가지 않을 뿐 아니라, 자동 배치 자체의 대상에서도
  //  완전히 빠진다 — 목표 오프 개수를 계산하지도, 빈 칸에 오프를 채우지도 않는다(관리자 일정은 짤 필요가
  //  없다는 요청에 따름). 미리보기 표·요약에도 관리자는 변경 사항 없이 그대로 나온다.

  let scheduleAutoPlan = null; // 미리보기에 띄워둔 계획. 적용 버튼에서 이 값을 그대로 씀.
  let scheduleAutoChecklistCollapsed = false; // 조건 체크리스트 접힘 상태(모달을 새로 열면 초기화됨)
  let scheduleAutoSettingsLastKind = "off"; // 인원별 설정 팝업에서 마지막으로 본 탭("off" | "work")
  let scheduleAutoFitObserver = null; // 미리보기 표를 팝업 폭에 맞춰 축소할 때, 폭이 바뀌면 다시 맞추기 위한 관찰자

  // 하이브리드 자동배치: 기존 규칙으로만 유효한 후보를 여러 개 만든 뒤,
  // Groq는 그 후보의 번호만 선택한다. Groq가 일정/조건 자체를 생성하거나 수정할 수는 없다.
  const SCHEDULE_AUTO_HYBRID_CANDIDATE_COUNT = 6;
  let scheduleAutoHybridRequestId = 0;

  // 이 일수를 넘는 연속 근무(=6일째부터)는 만들지 않는다.
  const SCHEDULE_AUTO_MAX_WORK_STREAK = 5;
  // 새로 배정하는 오프가 기존 휴무(필휴 포함)와 연결되어 연속 휴무가 4일 이상 생기지 않게 한다.
  // 필휴도 연속 오프 길이에 포함한다. (필휴 자체는 자동배치가 수정하지 않는 보호 일정이다.)
  const SCHEDULE_AUTO_MAX_OFF_STREAK = 3;
  // 선호 오프 요일이 있는 인원은, 목표 오프 개수 안에서 적어도 이 개수(목표 오프 개수가 이보다
  // 작으면 목표 개수까지만)는 선호 요일에 맞추도록 마지막 보정 단계에서 우선적으로 스왑을 배정한다.
  const SCHEDULE_AUTO_PREF_FLOOR = 5;
  // ----- 최소 출근 인원 때문에 자리가 하나도 안 나는 사람을 위한 "빌려오기" 한도 -----
  // 어떤 인원이 구분별 하루 최소 출근 인원 조건에 막혀 목표 오프를 못 채우면(이응님 사례),
  // 같은 조·같은 업무구분의 동료 중 그 날 자동배치로 오프를 받은 사람의 오프를 다른 빈 날로
  // 옮겨서 자리를 만들어준다(최소출근/필요인력 허용범위·연속근무·연속오프는 그대로 지킨다).
  // 옮기는 동료의 그 날이 그 동료의 "선호 오프 요일"이었다면 선호 적중이 하나 깎이는데,
  // 이 손해를 한 사람당 최대 이 개수까지만 허용한다(선호 우선순위 자체는 바꾸지 않고,
  // 자리가 정말 안 나는 최후의 경우에만 쓰는 한도다). 선호가 아닌 날을 옮기는 건 이 한도에
  // 포함하지 않는다(공짜이므로 항상 우선 시도한다).
  const SCHEDULE_AUTO_SHORTFALL_PREF_SACRIFICE_LIMIT = 3;
  const SCHEDULE_AUTO_DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

  // 대전제: 구분(조×업무구분)별 하루 최소 출근 인원.
  const SCHEDULE_AUTO_MIN_WORKING = 3;
  // 구분별 하루 최소 출근 인원. 자동 배치 팝업에서 직접 설정한다.
  let scheduleAutoMinWorkingByGroup = {
    DAY_채팅: SCHEDULE_AUTO_MIN_WORKING, DAY_유선: SCHEDULE_AUTO_MIN_WORKING,
    NIGHT_채팅: SCHEDULE_AUTO_MIN_WORKING, NIGHT_유선: SCHEDULE_AUTO_MIN_WORKING,
  };
  function scheduleAutoMinWorkingKey(g, t) { return `${g}_${t}`; }
  function scheduleAutoGetMinWorking(g, t) {
    const n = Number(scheduleAutoMinWorkingByGroup[scheduleAutoMinWorkingKey(g, t)]);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : SCHEDULE_AUTO_MIN_WORKING;
  }

  // 연차(ANNUAL)·공가(GONGGA)·육휴(MATERNITY)·특휴(SPECIAL)는 목표 개수 계산에 포함시키지 않는다(별도 취급 요청).
  // 특휴(SPECIAL)도 연차·공가·육휴와 같이 목표 개수에서 빼지 않는다(미차감).
  // 그 밖의 오프류 중 "오프"를 뺀 나머지(대휴·공휴)는 항상 목표 개수에서 뺀다.
  const SCHEDULE_AUTO_ALWAYS_OFF_STATUSES = ["DAEHYU", "GONGHYU"];

  // 이 칸이 인원별 목표 오프 개수에서 "이미 채운 것"으로 차감돼야 하는지.
  //  - "오프"는 그 칸 메모에 "필휴"라는 문구가 있을 때만 차감한다(필휴 표시가 없는 오프는
  //    연차·공가·육휴처럼 목표 달성에 포함시키지 않는다 — 다만 칸 자체는 그대로 유지된다).
  //  - 대휴·공휴는 메모와 상관없이 항상 차감한다.
  //  - 연차·공가·육휴·특휴는 항상 차감하지 않는다.
  function scheduleAutoCountsTowardTarget(staffId, dateKey, rec) {
    if (!rec) return false;
    if (rec.status === "OFF") return getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
    return SCHEDULE_AUTO_ALWAYS_OFF_STATUSES.indexOf(rec.status) !== -1;
  }

  // 이미 입력된 OFF 중 "필휴" 메모가 붙은 날은 자동 배치에서 보호되는 휴무일이다.
  // 자동 배치가 새로 넣는 OFF는 항상 보호일이 아니다.
  function scheduleAutoIsProtectedOffDay(staffId, dateKey, rec) {
    return !!rec &&
      rec.status === "OFF" &&
      getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
  }


  // 필요인력 허용범위. 여기서 ideal/max는 "허용하는 부족 인원(대비가 -몇까지인지)"이다.
  // 금·토·월은 일반일에는 부족을 절대 허용하지 않고 0만 허용한다(ideal=0, max=0).
  // 그 외 요일(화·수·목·일)은 1순위 -1, 최후의 수단 -2까지 허용한다.
  // 대비가 +(인원이 남음)인 건 언제나 허용하고, 부족(-)만 제한한다.
  // 단, 평일(월~금) 공휴일은 요일과 관계없이 기존 예외대로 -2까지 허용한다.
  // 토요일은 평일이 아니므로 이 공휴일 예외에 포함되지 않는다.
  function scheduleAutoToleranceInfo(dow, dateKey) {
    const isWeekdayHoliday = dow !== 0 && dow !== 6 && !!getHoliday(dateKey);
    if (isWeekdayHoliday) return { ideal: 2, max: 2 };
    if (dow === 5 || dow === 6 || dow === 1) return { ideal: 0, max: 0 };
    return { ideal: 1, max: 2 };
  }

  // 대전제(구분별 하루 출근 최소 3명): 이 오프를 넣으면 그 인원이 속한 구분(조×업무구분) 중 하나라도 그 날 출근
  // 인원이 3명 미만이 되는지. 그러면 후보에서 제외한다(경고로 넘어가는 "최후의 수단"도 없다).
  // 재직 인원이 3명 미만인 구분은 오프를 하나도 안 넣어도 3명이 안 되므로 적용하지 않는다(그 구분은 경고로 알려줌).
  // minWorking는 기본값 SCHEDULE_AUTO_MIN_WORKING(3)이다(scheduleAutoBuildPlan의 options.minWorking으로만 바꿀 수 있고, 화면에서는 바꾸지 않는다).
  function scheduleAutoMinWorkingBlocked(g, staffTypes, working, totalCount, d, minWorkingByGroup) {
    return staffTypes.some((t) => {
      const key = scheduleAutoMinWorkingKey(g, t);
      const minWorking = Number(minWorkingByGroup && Object.prototype.hasOwnProperty.call(minWorkingByGroup, key)
        ? minWorkingByGroup[key] : scheduleAutoGetMinWorking(g, t));
      if (!(minWorking > 0)) return false;
      if (totalCount[g][t] < minWorking) return false;
      return working[g][t][d] - 1 < minWorking; // 이 오프를 반영했다고 가정했을 때 남는 출근 인원
    });
  }

  // ----- 추가 대전제: 주간(DAY) 유선/채팅 각 구분, 07:00 시작(이른 조) 인원 하루 최소 1명 -----
  // 근무시간(workHours) 문자열의 "시작 시각"이 07:00이면 종료 시각과 상관없이 "이른 조"로 본다
  // (예: "07:00-14:00", "07:00-16:00" 모두 해당). 위 구분별 하루 최소 출근 인원(3명)과 같은 급의
  // 강한 조건으로, 야간(NIGHT)에는 적용하지 않는다.
  const SCHEDULE_AUTO_EARLY_SHIFT_START_MIN = 7 * 60; // 07:00을 분으로 환산
  const SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING = 1;
  function scheduleAutoIsEarlyShiftStaff(s) {
    return !!s && scheduleStartMinutes(s) === SCHEDULE_AUTO_EARLY_SHIFT_START_MIN;
  }
  // 이 인원이 "이른 조"이고, 이 오프를 넣었을 때 그 인원이 속한 구분(조×업무구분) 중 하나라도
  // 그 날 이른 조 출근 인원이 0명이 되는지. DAY에서만 적용한다. 그 구분에 이른 조 인원이 애초에
  // 한 명도 없으면 지킬 수 없는 조건이므로 적용하지 않는다(그 구분은 경고로 알려줌).
  function scheduleAutoEarlyShiftBlocked(g, s, staffTypes, earlyWorking, earlyTotalCount, d) {
    if (g !== "DAY" || !scheduleAutoIsEarlyShiftStaff(s)) return false;
    return staffTypes.some((t) => {
      if (!(earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING)) return false;
      return earlyWorking[g][t][d] - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING; // 이 오프를 반영했다고 가정했을 때 남는 이른 조 출근 인원

    });
  }

  // ----- 인원별 "선호 오프 / 선호 출근 요일" (소프트 조건) -----
  // 두 설정 모두 달과 상관없이 계속 적용된다. 같은 사람의 같은 요일은 둘 중 하나만 선택할 수 있다.
  function scheduleAutoGetPrefDowsFromMap(map, staffId) {
    const entry = map && typeof map === "object" ? map[staffId] : null;
    const raw = entry && Array.isArray(entry.dows) ? entry.dows : [];
    const out = [];
    raw.forEach((n) => { if (Number.isInteger(n) && n >= 0 && n <= 6 && out.indexOf(n) === -1) out.push(n); });
    return out.sort((a, b) => a - b);
  }
  function scheduleAutoGetPrefDows(staffId) { return scheduleAutoGetPrefDowsFromMap(scheduleData.autoOffPrefs, staffId); }
  function scheduleAutoGetWorkPrefDows(staffId) { return scheduleAutoGetPrefDowsFromMap(scheduleData.autoWorkPrefs, staffId); }
  function scheduleAutoSetPrefDow(staffId, dow, kind) {
    if (!scheduleData.autoOffPrefs || typeof scheduleData.autoOffPrefs !== "object") scheduleData.autoOffPrefs = {};
    if (!scheduleData.autoWorkPrefs || typeof scheduleData.autoWorkPrefs !== "object") scheduleData.autoWorkPrefs = {};
    const targetMap = kind === "work" ? scheduleData.autoWorkPrefs : scheduleData.autoOffPrefs;
    const otherMap = kind === "work" ? scheduleData.autoOffPrefs : scheduleData.autoWorkPrefs;
    const cur = scheduleAutoGetPrefDowsFromMap(targetMap, staffId);
    const idx = cur.indexOf(dow);
    if (idx === -1) cur.push(dow); else cur.splice(idx, 1);
    cur.sort((a, b) => a - b);
    if (cur.length === 0) delete targetMap[staffId];
    else targetMap[staffId] = { dows: cur };
    const other = scheduleAutoGetPrefDowsFromMap(otherMap, staffId).filter((d) => d !== dow);
    if (other.length === 0) delete otherMap[staffId];
    else otherMap[staffId] = { dows: other };
    saveScheduleData();
  }
  function scheduleAutoTogglePrefDow(staffId, dow) { scheduleAutoSetPrefDow(staffId, dow, "off"); }
  function scheduleAutoToggleWorkPrefDow(staffId, dow) { scheduleAutoSetPrefDow(staffId, dow, "work"); }
  function scheduleAutoPrefLabel(dows) { return dows.map((n) => SCHEDULE_AUTO_DOW_LABELS[n]).join("·"); }
  // 탭 하나(선호 오프 또는 선호 출근) 전체를 통째로 비운다. 다른 쪽 탭 설정은 건드리지 않는다.
  function scheduleAutoClearPrefKind(kind) {
    const map = kind === "work" ? "autoWorkPrefs" : "autoOffPrefs";
    scheduleData[map] = {};
    saveScheduleData();
  }

  // ----- 이번 배치에서 제외할 인원 (조건) -----
  // 저장하지 않는 "이번 실행 한정" 조건. openScheduleAutoModal이 열 때마다 비운다.
  let scheduleAutoExcludedIds = [];
  function scheduleAutoGetExcluded() { return scheduleAutoExcludedIds.slice(); }
  function scheduleAutoResetExcluded() { scheduleAutoExcludedIds = []; }
  function scheduleAutoSetExcluded(staffId, on) {
    const idx = scheduleAutoExcludedIds.indexOf(staffId);
    if (on && idx === -1) scheduleAutoExcludedIds.push(staffId);
    else if (!on && idx !== -1) scheduleAutoExcludedIds.splice(idx, 1);
  }

  // ----- 연속 근무 계산 -----
  // 연속 근무일수를 셀 때 "근무일"로 보는 칸인지. 기록이 없는 칸은 기본값(근무)이다.
  // 반차·교육은 출근하는 날이라 근무일로 세고, 오프류·연차·공가·육휴·특휴·퇴사·결근은 쉬는 날로 본다.
  function scheduleAutoIsWorkRecord(rec) {
    if (!rec) return true;
    if (rec.status === "WORK") return rec.attendance !== "ABSENT";
    return rec.status === "HALF" || rec.status === "EDUCATION";
  }

  // 그 인원이 (year, monthIndex)달의 인원 명단에 있었는지. getStaffListForMonth와 달리
  // "아직 스냅샷이 없는 지난 달"이어도 스냅샷을 새로 만들어 저장하지 않는다(미리보기 계산이 데이터를 건드리면 안 되므로).
  function scheduleAutoStaffWasInMonth(staffId, year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    const hist = scheduleData.staffHistory && scheduleData.staffHistory[key];
    const list = hist || scheduleData.staff || [];
    const s = list.find((x) => x && x.id === staffId);
    if (!s) return false;
    if (!hist && !scheduleIsMonthPast(year, monthIndex) && typeof s.resignDate === "string" && s.resignDate && s.resignDate.slice(0, 7) < key) return false;
    const lastDayKey = scheduleDateKey(year, monthIndex, scheduleDaysInMonth(year, monthIndex));
    if (typeof s.hireDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.hireDate) && s.hireDate > lastDayKey) return false;
    return true;
  }

  // 지난달 말일부터 거꾸로 센 "연속 근무일수". 이번 달 1일부터 이어질 수 있는 구간이다.
  // - 지난달에도 있던 인원만 센다(지난달 명단에 없던 신규 인원은 0).
  // - 지난달에 그 인원 기록이 하나도 없으면(아직 안 짠 달) 기본값 "근무"를 전부 근무로 세면
  //   말이 안 되므로 0으로 본다.
  function scheduleAutoCarryStreak(staffId, year, monthIndex) {
    const py = monthIndex === 0 ? year - 1 : year;
    const pm = monthIndex === 0 ? 11 : monthIndex - 1;
    if (!scheduleAutoStaffWasInMonth(staffId, py, pm)) return 0;
    const prevDays = scheduleDaysInMonth(py, pm);
    let hasAny = false;
    for (let d = 1; d <= prevDays; d++) {
      if (Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(staffId, scheduleDateKey(py, pm, d)))) { hasAny = true; break; }
    }
    if (!hasAny) return 0;
    let n = 0;
    for (let d = prevDays; d >= 1; d--) {
      const rec = scheduleData.records[scheduleRecordKey(staffId, scheduleDateKey(py, pm, d))];
      if (!scheduleAutoIsWorkRecord(rec)) break;
      n++;
    }
    return n;
  }

  // 지난달 말일부터 이어진 연속 휴무 길이(필휴 포함).
  // 지난달 기록이 하나도 없으면 기본값 근무로 보고 0으로 시작한다.
  function scheduleAutoCarryOffStreak(staffId, year, monthIndex) {
    const py = monthIndex === 0 ? year - 1 : year;
    const pm = monthIndex === 0 ? 11 : monthIndex - 1;
    if (!scheduleAutoStaffWasInMonth(staffId, py, pm)) return 0;
    const prevDays = scheduleDaysInMonth(py, pm);
    let hasAny = false;
    for (let d = 1; d <= prevDays; d++) {
      if (Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(staffId, scheduleDateKey(py, pm, d)))) {
        hasAny = true; break;
      }
    }
    if (!hasAny) return 0;
    let n = 0;
    for (let d = prevDays; d >= 1; d--) {
      const dateKey = scheduleDateKey(py, pm, d);
      const rec = scheduleData.records[scheduleRecordKey(staffId, dateKey)];
      if (!rec || scheduleAutoIsWorkRecord(rec)) break;
      n++;
    }
    return n;
  }


  // 벡터(숫자 배열)를 앞자리부터 비교한다(클수록 좋음). 앞자리가 같을 때만 다음 자리를 본다.
  function scheduleAutoCmpVec(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    }
    return 0;
  }

  // 한 인원의 오프 날짜를 "한꺼번에" 고르는 정확한 계산(동적 계획법).
  //  - K = min(needed, 빈 칸 수)개의 날짜를 빈 칸 중에서 고른다.
  //  - 가장 먼저 "5일 초과 연속 근무가 되는 근무일 수"를 최소로 만든다. 지난달 말에서 이어지는 일수(carry)도
  //    월 초에 그대로 이어서 센다. 오프 개수 안에서 못 없애는 구간은 그만큼만 남는다(늘려서 채우지 않음).
  //  - 그다음에는 날짜별 점수(dayScore(d), 클수록 좋은 숫자 배열)를 고른 날짜들에 대해 더한 값을
  //    앞자리부터 비교해 가장 좋은 조합을 고른다. 날짜를 하나씩 탐욕적으로 고르면 "선호 요일 위주로 먼저 골라
  //    놓고 나중에 연속 근무 때문에 다른 요일이 끼어드는" 식으로 손해를 볼 수 있어서 전체 조합으로 푼다.
  //  - isRest(d): 이미 쉬는 날(기록된 휴무류)인지 / isFree(d): 비어 있어서 오프를 넣을 수 있는 칸인지
  // 반환: { picked: 오름차순 날짜들, violations: 5일 초과 연속 근무가 되는 근무일 수 }
  function scheduleAutoSolveDays(opts) {
    const {
      daysInMonth, carry, offCarry = 0, limit, offLimit = SCHEDULE_AUTO_MAX_OFF_STREAK,
      needed, isRest, isFree, isProtectedRest = () => false, dayScore,
      maxWorkStreak
    } = opts;
    let freeCount = 0, firstFreeDay = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!isRest(d) && isFree(d)) { freeCount++; if (!firstFreeDay) firstFreeDay = d; }
    }
    const K = Math.min(needed, freeCount);
    const hardWorkCap = Number.isInteger(maxWorkStreak) ? Math.max(limit, maxWorkStreak) : limit + 1;
    const workCap = hardWorkCap;
    // 기존 일정만으로 이미 4일 이상 이어진 휴무 구간은 그대로 둘 수 있지만,
    // 그 구간을 더 늘리는 새 OFF는 허용하지 않는다. 필휴도 이 연속 길이에 포함한다.
    const offCap = daysInMonth + 1;
    const width = 1 + (firstFreeDay ? dayScore(firstFreeDay).length : 0); // [위반 수(음수), ...날짜 점수 합]
    const zero = () => new Array(width).fill(0);

    // cur[k][workStreak][offStreak] = { v, prev, day }
    let cur = [];
    for (let k = 0; k <= K; k++) {
      cur.push(new Array(workCap + 1));
      for (let ws = 0; ws <= workCap; ws++) cur[k][ws] = new Array(offCap + 1).fill(null);
    }
    cur[0][Math.min(carry, workCap)][Math.min(offCarry, offCap)] = { v: zero(), prev: null, day: 0 };

    function relax(next, k, ws, os, v, prev, day) {
      const old = next[k][ws][os];
      if (!old || scheduleAutoCmpVec(v, old.v) > 0) next[k][ws][os] = { v, prev, day };
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const next = [];
      for (let k = 0; k <= K; k++) {
        next.push(new Array(workCap + 1));
        for (let ws = 0; ws <= workCap; ws++) next[k][ws] = new Array(offCap + 1).fill(null);
      }
      for (let k = 0; k <= K; k++) {
        for (let ws = 0; ws <= workCap; ws++) {
          for (let os = 0; os <= offCap; os++) {
            const node = cur[k][ws][os];
            if (!node) continue;
            const rest = isRest(d), free = !rest && isFree(d);

            if (rest) {
              // 기존 휴무는 모두 연속 휴무로 이어서 센다. 필휴도 포함한다.
              // 필휴 자체는 보호 일정이지만, 연속 오프 3일 제한에서는 길이를 끊지 않는다.
              const nextOs = Math.min(os + 1, offCap);
              relax(next, k, 0, nextOs, node.v, node, 0);
              continue;
            }

            // 이 날을 근무로 두는 경우.
            // 새로 만들어지는 연속 근무는 6일(=limit+1)까지만 허용한다.
            // 6일째가 불가피한 경우에는 위반 1회로 기록하되, 7일째부터는
            // 더 이어지는 상태를 만들지 않는다. 지난달에서 이미 6일을 넘겨
            // 들어온 carry는 기존 일정이므로 별도 경고로 처리한다.
            if (ws < workCap || !Number.isInteger(maxWorkStreak)) {
              const streak = Math.min(ws + 1, workCap);
              const v = node.v.slice();
              if (ws + 1 > limit) v[0] -= 1;
              relax(next, k, streak, 0, v, node, 0);
            }

            // 이 날을 새 오프로 고르는 경우.
            // 앞쪽의 기존 휴무(필휴 포함)뿐 아니라, 바로 뒤에 붙어 있는
            // 기존 휴무(필휴 포함)까지 합쳐서 3일을 넘으면 이 OFF를 금지한다.
            // 예: 10~12가 기존 휴무(12일이 메모의 필휴)라면 9일/13일 모두
            // 새 OFF로 넣을 수 없다. 필휴를 연속 휴무에서 끊는 날로 취급하지 않는다.
            if (free && k < K && os < offLimit) {
              let fixedRestAfter = 0;
              for (let rd = d + 1; rd <= daysInMonth && isRest(rd); rd++) fixedRestAfter++;
              if (os + 1 + fixedRestAfter <= offLimit) {
                const v2 = node.v.slice();
                const score = dayScore(d);
                for (let i = 0; i < score.length; i++) v2[1 + i] += score[i];
                relax(next, k + 1, 0, os + 1, v2, node, d);
              }
            }
          }
        }
      }
      cur = next;
    }

    let bestNode = null;
    for (let ws = 0; ws <= workCap; ws++) {
      for (let os = 0; os <= offCap; os++) {
        const node = cur[K][ws][os];
        if (node && (!bestNode || scheduleAutoCmpVec(node.v, bestNode.v) > 0)) bestNode = node;
      }
    }
    const picked = [];
    let violations = 0;
    if (bestNode) {
      violations = -bestNode.v[0];
      for (let n = bestNode; n; n = n.prev) if (n.day) picked.push(n.day);
    }
    picked.sort((a, b) => a - b);
    return { picked, violations };
  }


  // 최종 결과에서 limit일을 넘는 연속 근무 구간 목록. start가 1보다 작으면 지난달 말부터 이어진 구간이다.
  function scheduleAutoFindLongRuns(daysInMonth, isRest, carry, limit) {
    const runs = [];
    let streak = carry;
    let start = 1 - carry;
    for (let d = 1; d <= daysInMonth; d++) {
      if (isRest(d)) {
        if (streak > limit) runs.push({ start, end: d - 1, length: streak });
        streak = 0; start = d + 1;
        continue;
      }
      streak++;
    }
    if (streak > limit) runs.push({ start, end: daysInMonth, length: streak });
    return runs;
  }

  // 필휴를 포함해 3일을 넘는 연속 휴무 구간을 찾는다.
  // start/end는 실제 달력 날짜다.
  function scheduleAutoFindLongOffRuns(staffId, year, monthIndex, daysInMonth, carryOff, isRest) {
    const runs = [];
    let streak = carryOff;
    let start = streak > 0 ? 1 - carryOff : 1;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!isRest(d)) {
        if (streak > SCHEDULE_AUTO_MAX_OFF_STREAK) runs.push({ start, end: d - 1, length: streak });
        streak = 0;
        start = d + 1;
        continue;
      }
      // 필휴도 연속 휴무에 포함되므로 별도로 끊지 않는다.
      streak++;
    }
    if (streak > SCHEDULE_AUTO_MAX_OFF_STREAK) runs.push({ start, end: daysInMonth, length: streak });
    return runs;
  }


  // 그 달의 "공휴일(평일) + 토요일 + 일요일" 개수. 공휴일이 주말과 겹치는 날은 주말 쪽으로만
  // 한 번 세어서 중복 집계되지 않게 한다.
  function scheduleAutoTargetInfo(year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let holidayCount = 0, saturdayCount = 0, sundayCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, monthIndex, d).getDay();
      if (dow === 6) { saturdayCount++; continue; }
      if (dow === 0) { sundayCount++; continue; }
      if (getHoliday(scheduleDateKey(year, monthIndex, d))) holidayCount++;
    }
    return { target: holidayCount + saturdayCount + sundayCount, holidayCount, saturdayCount, sundayCount };
  }

  // 이번 달 이미 목표에서 차감돼야 하는 칸 개수 (연차·공가·육휴 제외, 오프는 "필휴" 메모가 있을 때만 포함).
  function scheduleAutoAlreadyOffCount(staffId, year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let n = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      const rec = scheduleData.records[scheduleRecordKey(staffId, dateKey)];
      if (scheduleAutoCountsTowardTarget(staffId, dateKey, rec)) n++;
    }
    return n;
  }

  // 아직 아무 값도 입력되지 않은(=기본값 "근무") 날짜만 후보로 돌려준다.
  function scheduleAutoFreeDays(staffId, year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d));
      if (!Object.prototype.hasOwnProperty.call(scheduleData.records, key)) days.push(d);
    }
    return days;
  }

  // ----- 계획 세우기 -----
  // 실제로 scheduleData를 바꾸지 않고, "누구를 며칠에 오프로 채울지"만 계산해서 돌려준다.
  // options.excludeStaffIds: 이번 계산에서 재직 인원에 넣지 않을 인원 id들(배치 조건). 그 인원은 오프를
  // 배정받지 않고, 출근 인원수·필요인력 대비의 재직 인원수에서도 빠진다.
  function scheduleAutoBuildPlan(year, monthIndex, options) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const variant = Number.isInteger(options && options.variant) ? Math.max(0, options.variant) : 0;
    const targetInfo = scheduleAutoTargetInfo(year, monthIndex);
    const target = targetInfo.target;
    const excludeIds = new Set(options && Array.isArray(options.excludeStaffIds) ? options.excludeStaffIds : []);
    // 대전제: 구분별 하루 최소 출근 인원(기본 3). options.minWorking은 테스트·확장용 — 화면에서는 넘기지 않는다.
    let minWorkingByGroup;
    if (options && Number.isInteger(options.minWorking) && options.minWorking >= 0) {
      minWorkingByGroup = {};
      ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => { minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] = options.minWorking; }));
    } else {
      minWorkingByGroup = options && options.minWorkingByGroup && typeof options.minWorkingByGroup === "object"
        ? options.minWorkingByGroup : scheduleAutoMinWorkingByGroup;
    }
    const fullMonthStaff = getStaffListForMonth(year, monthIndex);
    const excluded = fullMonthStaff
      .filter((s) => excludeIds.has(s.id))
      .map((s) => ({ id: s.id, name: s.name, nickname: s.nickname }));
    const monthStaff = fullMonthStaff.filter((s) => !excludeIds.has(s.id));
    const TYPES = ["채팅", "유선"];
    const LIMIT = SCHEDULE_AUTO_MAX_WORK_STREAK;
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);

    // 조(DAY/NIGHT)×업무구분×날짜별 "현재 투입 인원수"를 시뮬레이션하면서 하나씩 줄여나간다.
    // (관리자는 필요인력 집계 자체에서 빠지므로 여기 포함하지 않는다 — 표 렌더링과 동일한 기준)
    const working = {};
    const required = {};
    const totalCount = {}; // 조×업무구분별 그 달 재직 인원수(최소 출근 인원 조건 계산용)
    const earlyWorking = {}; // 조×업무구분×날짜별 "이른 조(07:00 시작)" 출근 인원수(DAY에서만 사용)
    const earlyTotalCount = {}; // 조×업무구분별 그 달 이른 조 재직 인원수
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      working[g] = {}; required[g] = {}; totalCount[g] = {};
      earlyWorking[g] = {}; earlyTotalCount[g] = {};
      TYPES.forEach((t) => {
        working[g][t] = {}; required[g][t] = {};
        totalCount[g][t] = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
        const earlyStaff = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1 && scheduleAutoIsEarlyShiftStaff(s));
        earlyTotalCount[g][t] = earlyStaff.length;
        earlyWorking[g][t] = {};
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          working[g][t][d] = scheduleActualCount(groupStaff, t, dateKey);
          required[g][t][d] = getRequiredHeadcount(year, monthIndex, g, t, d);
          earlyWorking[g][t][d] = scheduleActualCount(earlyStaff, t, dateKey);
        }
      });
    });

    const assignedCountByDay = {}; // 이번 실행에서 그 날짜에 이미 몇 명 배정했는지(분산용)
    for (let d = 1; d <= daysInMonth; d++) assignedCountByDay[d] = 0;

    // 인원별로 "최소 출근 인원 조건 때문에 오프를 못 넣은 빈 칸" 날짜 목록(빌려오기 보정 단계에서 사용).
    const staffMinBlockedDayList = new Map();
    // 인원별로 "이른 조(07:00) 최소 1명 조건 때문에 오프를 못 넣은 빈 칸" 날짜 목록(빌려오기 보정 단계에서 사용).
    const staffEarlyBlockedDayList = new Map();

    const warnings = [];
    const perStaffPlan = [];
    const monthNo = monthIndex + 1;
    // 인원별 경고와 계산 맥락. 배치 뒤에 오프를 옮기는 보정 단계(선호 교환·전원 출근 해소·선호 최대화)가 있어서,
    // 경고는 바로 warnings에 넣지 않고 모아 두었다가 "최종 계획" 기준으로 다시 확정한다(옮겨진 칸에 대한 낡은 경고 방지).
    const staffWarnCtx = new Map();
    const staffWarnOrder = [];

    // 처리 순서(먼저 처리될수록 빈 칸이 아직 많이 남아 있어 유리하다):
    //  ①이월 연속근무일수(carry)가 많은 사람 우선 — 한도(5일, 불가피시 6일)에 가깝거나 이미 넘은 사람은
    //    월초 며칠 안에 오프를 넣지 못하면 그 초과를 영영 못 끊으므로 가장 급하다.
    //  ②그다음은 이번 달 남은 목표 오프 개수가 많은 사람 우선 — 빈 칸이 다른 사람 오프로 먼저
    //    소진되면 필요인력/최소출근 조건에 막혀 목표를 채울 기회 자체가 사라지기 때문이다.
    //  ③선호 요일 설정 여부는 위 두 기준이 동률일 때만 살짝 우선한다. 선호 자체는 이 순서와
    //    무관하게 개인별 점수(dayVec, 아래)와 마지막 "선호 요일 최대화" 보정 단계에서 별도로 반영되므로,
    //    선호 유무를 최우선 기준으로 두면(예전 방식) 선호 없는 고수요 인원이 항상 뒤로 밀려
    //    필요인력 하한에 막혀 목표 오프를 하나도 못 받는 문제가 있었다.
    // 관리자는 자동 배치 대상에서 완전히 제외한다. 필요인력 집계뿐 아니라 목표 오프 계산·신규 오프 배정도 하지 않는다.
    const hasPref = (id) => (scheduleAutoGetPrefDows(id).length > 0 || scheduleAutoGetWorkPrefDows(id).length > 0 ? 1 : 0);
    const order = monthStaff
      .filter((s) => !s.isAdmin)
      .map((s, idx) => ({
        s, idx,
        carry: scheduleAutoCarryStreak(s.id, year, monthIndex),
        needed: Math.max(0, target - scheduleAutoAlreadyOffCount(s.id, year, monthIndex)),
        pref: hasPref(s.id),
      }));
    order.sort((a, b) => {
      if (a.carry !== b.carry) return b.carry - a.carry;
      if (a.needed !== b.needed) return b.needed - a.needed;
      if (a.pref !== b.pref) return b.pref - a.pref;
      // 후보별로 동률 순서를 바꿔 같은 강한 조건 안에서 다른 조합을 만든다.
      if (variant % 3 === 1) return b.idx - a.idx;
      if (variant % 3 === 2) return ((a.idx + variant) % Math.max(1, order.length)) - ((b.idx + variant) % Math.max(1, order.length));
      return a.idx - b.idx;
    });

    order.forEach(({ s }) => {
      const staffLabel = s.name || s.nickname || "이름 없음";
      const alreadyOff = scheduleAutoAlreadyOffCount(s.id, year, monthIndex);
      const needed = Math.max(0, target - alreadyOff);
      const g = s.group === "night" ? "NIGHT" : "DAY";
      const staffTypes = s.isAdmin ? [] : TYPES.filter((t) => (s.types || []).indexOf(t) !== -1);
      const remainingFree = scheduleAutoFreeDays(s.id, year, monthIndex);
      const assigned = [];
      const prefDows = scheduleAutoGetPrefDows(s.id);
      const workPrefDows = scheduleAutoGetWorkPrefDows(s.id);
      const carry = scheduleAutoCarryStreak(s.id, year, monthIndex);
      const offCarry = scheduleAutoCarryOffStreak(s.id, year, monthIndex);

      // 연속 근무/오프 계산용: 이미 입력된 값 중 "쉬는 날"인 칸, 그리고 비어 있어서 오프를 넣을 수 있는 칸.
      // 대전제(구분별 출근 최소 3명)에 걸리는 날은 어떤 요일이든 빈 칸이어도 후보에서 제외한다.
      const baseRest = {}, isFreeDay = {};
      let minBlockedDays = 0; // 대전제 때문에 오프를 못 넣는 (그 인원의) 빈 칸 수 — 목표를 못 채웠을 때 원인 안내용
      const minBlockedDayList = []; // 위와 같은 날짜의 실제 번호 목록(빌려오기 보정 단계에서 사용)
      let earlyBlockedDays = 0; // 이른 조(07:00) 최소 1명 조건 때문에 오프를 못 넣는 (그 인원의) 빈 칸 수
      const earlyBlockedDayList = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const key = scheduleRecordKey(s.id, scheduleDateKey(year, monthIndex, d));
        const has = Object.prototype.hasOwnProperty.call(scheduleData.records, key);
        const minBlocked = !has && scheduleAutoMinWorkingBlocked(g, staffTypes, working, totalCount, d, minWorkingByGroup);
        const earlyBlocked = !has && !minBlocked && scheduleAutoEarlyShiftBlocked(g, s, staffTypes, earlyWorking, earlyTotalCount, d);
        if (minBlocked) { minBlockedDays++; minBlockedDayList.push(d); }
        if (earlyBlocked) { earlyBlockedDays++; earlyBlockedDayList.push(d); }
        isFreeDay[d] = !has && !minBlocked && !earlyBlocked;
        baseRest[d] = has && !scheduleAutoIsWorkRecord(scheduleData.records[key]);
      }
      staffMinBlockedDayList.set(s.id, minBlockedDayList);
      staffEarlyBlockedDayList.set(s.id, earlyBlockedDayList);
      const chosen = {};
      if (typeof globalThis.__DEBUG_STAFF !== "undefined" && s.id === globalThis.__DEBUG_STAFF) {
        console.log("DEBUG", s.id, "needed", needed, "carry", carry, "offCarry", offCarry, "minBlockedDays", minBlockedDays, "remainingFree", remainingFree.length, "freeAfterBlock", remainingFree.filter(d=>isFreeDay[d]).length);
      }


      // 날짜별 점수(클수록 좋고, 앞 항목이 우선. 고른 날짜들의 합을 앞자리부터 비교한다):
      // ① 그 인원의 조×업무구분 필요인력이 최후 허용범위 안인지
      // ② 모두 출근 상태를 해소하는지
      // ③ 선호 오프/선호 출근인지
      // ④ 1순위 필요인력 범위인지 ⑤ 제약 없음 ⑥ 여유 ⑦ 분산 ⑧ 빠른 날짜
      // ※ 선호는 이 단계에서 반영하고, 아래 최종 보정 단계에서 서로의 오프를 안전하게 교환해
      //    선호가 실제 결과에 더 많이 반영되도록 한다. 강한 조건을 깨는 교환은 하지 않는다.
      const dayFeasible = {}, dayIdeal = {}, dayVec = {};
      remainingFree.forEach((d) => {
        const dow = new Date(year, monthIndex, d).getDay();
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const tolInfo = scheduleAutoToleranceInfo(dow, dateKey);
        let idealOk = true, maxOk = true;
        let priorityRangeOk = true;
        let hasConstraint = false;
        let minSlack = Infinity;
        let breaksAllWorking = false;
        staffTypes.forEach((t) => {
          const req = required[g][t][d];
          if (req === null) return;
          hasConstraint = true;
          const beforeWorking = working[g][t][d];
          const total = totalCount[g][t];
          // 현재 이 구분의 모든 인원이 출근 중이고, 바로 이 인원에게 오프를 넣으면
          // 해당 구분의 '모두 출근' 상태가 해소된다. 이런 날짜를 최우선으로 선택한다.
          const breaksThisGroupAllWorking = total > 0 && beforeWorking === total;
          if (breaksThisGroupAllWorking) breaksAllWorking = true;
          const diff = (beforeWorking - 1) - req;
          // 대비(diff)가 +(인원이 남음)이면 항상 허용, 부족(-)일 때만 제한한다.
          // 모든 인원 출근 상태를 해소하는 날짜에 한해서만 필요하면 -1까지 추가 허용한다.
          const effectiveMax = breaksThisGroupAllWorking ? Math.max(tolInfo.max, 1) : tolInfo.max;
          if (-diff > tolInfo.ideal) idealOk = false;
          if (-diff > effectiveMax) maxOk = false;
          if (-diff > tolInfo.ideal && !breaksThisGroupAllWorking) priorityRangeOk = false;
          if (-diff > effectiveMax) priorityRangeOk = false;
          minSlack = Math.min(minSlack, effectiveMax + diff); // 클수록 여유(인원이 더 남을수록 안전)
        });
        // 경고("허용범위를 벗어나 배치됐어요")는 "최후의 수단 범위"까지 넘겼을 때만 띄운다.
        // 1순위 범위를 못 맞춰 최후의 수단 범위로 배치된 건 정상 동작이라 경고 대상이 아니다.
        dayFeasible[d] = maxOk;
        dayIdeal[d] = priorityRangeOk;
        const prefWeight = [3, 5, 2, 4, 6, 1][variant % 6];
        const workPrefWeight = [3, 5, 2, 4, 6, 1][(variant + 2) % 6];
        const prefScore = prefDows.indexOf(dow) !== -1 ? prefWeight : (workPrefDows.indexOf(dow) !== -1 ? -workPrefWeight : 0);
        const distributionWeight = [1, 2, 1, 3, 2, 1][variant % 6];
        // 우선순위: ① 최후 허용범위(maxOk)를 벗어나지 않는 것 → ② 선호 오프/출근 →
        // ③ 이상적인 필요인력 범위 → ④ 모두 출근 상태 해소 → ⑤ 여유/분산/날짜.
        // 이전에는 "모든 인원이 출근 중인 날을 해소"가 선호보다 앞에 있어,
        // 선호일을 선택해도 충분히 조정 가능한 상황에서 비선호일로 밀리는 문제가 있었다.
        // 선호를 강제하지는 않되, 강한 조건을 지키는 후보끼리는 선호를 더 우선한다.
        dayVec[d] = [
          maxOk ? 1 : 0,
          prefScore,
          idealOk ? 1 : 0,
          breaksAllWorking ? 1 : 0,
          hasConstraint ? 0 : 1,
          hasConstraint ? minSlack : 0,
          -assignedCountByDay[d] * distributionWeight,
          variant % 2 ? d : -d,
        ];
      });
      const tolWarn = []; // 필요인력 허용범위를 넘겨 배치된 칸 — 나중에 그 칸이 옮겨지면 경고도 함께 사라진다
      const solveDays = (idealOnly) => scheduleAutoSolveDays({
        daysInMonth, carry, limit: LIMIT, maxWorkStreak: 6, needed,
        isRest: (d) => !!baseRest[d],
        // 필요인력 허용범위(최후 기준, dayFeasible)를 넘기는 날은 애초에 후보에서 제외한다.
        // 먼저 1순위 범위(idealOk)만으로 목표를 채울 수 있는지 시도한다. 가능하면 -2까지
        // 넓히지 않고 0~-1 범위 안에서 끝낸다. 다만 연속근무/연속오프/기존 일정 때문에
        // ideal-only로 목표를 다 채울 수 없는 경우에는 기존 정책대로 최후 허용범위(maxOk)까지
        // 한 단계 넓혀서 남은 오프를 채운다.
        isFree: (d) => !!isFreeDay[d] && !!dayFeasible[d] && (!idealOnly || !!dayIdeal[d]),
        isProtectedRest: (d) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          const rec = scheduleData.records[scheduleRecordKey(s.id, dateKey)];
          return scheduleAutoIsProtectedOffDay(s.id, dateKey, rec);
        },
        offCarry,
        offLimit: SCHEDULE_AUTO_MAX_OFF_STREAK,
        dayScore: (d) => dayVec[d],
      });
      const idealSolved = solveDays(true);
      const maxSolved = solveDays(false);
      // 1순위 범위만으로 목표를 채울 수 있어도, 그 선택 때문에 연속근무 위반이 새로
      // 생기면 안 된다. 먼저 연속근무 위반 수가 적은 해를 고르고, 위반 수가 같을 때만
      // ideal-only 결과를 우선해서 -2 확장을 불필요하게 사용하지 않는다.
      let solved;
      if (idealSolved.picked.length < needed) solved = maxSolved;
      else if (maxSolved.picked.length < needed) solved = idealSolved;
      else if (idealSolved.violations < maxSolved.violations) solved = idealSolved;
      else if (idealSolved.violations > maxSolved.violations) solved = maxSolved;
      else solved = idealSolved;
      solved.picked.forEach((d) => {
        if (!dayFeasible[d]) {
          tolWarn.push({ d, text: `${staffLabel}님 ${monthNo}/${d} — 필요인력 허용범위를 벗어나 배치됐어요. 확인해주세요.` });
        }
        assigned.push(d);
        chosen[d] = true;
        assignedCountByDay[d] += 1;
        staffTypes.forEach((t) => { working[g][t][d] -= 1; });
        if (scheduleAutoIsEarlyShiftStaff(s)) staffTypes.forEach((t) => { earlyWorking[g][t][d] -= 1; });
      });

      let shortfallText = null;
      if (assigned.length < needed) {
        const minNote = minBlockedDays > 0
          ? ` 출근 3명 이상을 지키느라 오프를 넣을 수 없는 날이 ${minBlockedDays}일 있어요.`
          : "";
        const earlyNote = earlyBlockedDays > 0
          ? ` 주간 유선/채팅 07:00 근무 인원 최소 1명 조건을 지키느라 오프를 넣을 수 없는 날이 ${earlyBlockedDays}일 있어요.`
          : "";
        shortfallText = `${staffLabel}님은 빈 칸이 부족해 목표 ${needed}개 중 ${assigned.length}개만 배정됐어요.${minNote}${earlyNote}`;
      }

      // 연속 휴무/연속 근무 경고는 오프를 옮기는 보정 단계가 끝난 뒤 최종 계획으로 계산한다(flushStaffWarnings).
      staffWarnCtx.set(s.id, {
        label: staffLabel, g, staffTypes, carry, offCarry, baseRest,
        prefSet: new Set(prefDows), workPrefSet: new Set(workPrefDows),
        tolWarn, shortfallText, isEarly: scheduleAutoIsEarlyShiftStaff(s),
      });
      staffWarnOrder.push(s.id);

      if (needed > 0 || assigned.length > 0) {
        const sorted = assigned.slice().sort((a, b) => a - b);
        perStaffPlan.push({
          staffId: s.id,
          name: s.name,
          nickname: s.nickname,
          alreadyOff,
          needed,
          assigned: sorted,
          carry,
          prefDows,
          prefHits: sorted.filter((d) => prefDows.indexOf(new Date(year, monthIndex, d).getDay()) !== -1).length,
          ...(workPrefDows.length ? { workPrefDows, workPrefHits: sorted.filter((d) => workPrefDows.indexOf(new Date(year, monthIndex, d).getDay()) === -1).length } : {}),
        });
      }
    });

    // ----- 선호 오프/출근 최종 보정 -----
    // 사람별로 독립적으로 오프를 고르면, 앞에서 처리된 다른 사람이 선호일을 먼저 차지해
    // 뒤 사람의 선호가 사라질 수 있다. 여기서는 같은 조·같은 업무구분의 두 사람 사이에서만
    // "선호일 OFF ↔ 비선호일 OFF"를 교환한다. 두 사람의 하루 출근 인원수는 그대로라서
    // 필요인력/최소출근 조건을 건드리지 않고, 양쪽의 연속근무·연속휴무 한도도 다시 검사한다.
    function autoPlanIsWorkFor(staffId, d, assignedSet) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d));
      const rec = scheduleData.records[key];
      if (rec) return scheduleAutoIsWorkRecord(rec) && !assignedSet.has(d);
      return !assignedSet.has(d);
    }
    function autoPlanValidSet(staffId, assignedSet) {
      let workStreak = scheduleAutoCarryStreak(staffId, year, monthIndex);
      let offStreak = scheduleAutoCarryOffStreak(staffId, year, monthIndex);
      for (let d = 1; d <= daysInMonth; d++) {
        const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d));
        const rec = scheduleData.records[key];
        const isOff = assignedSet.has(d) || (!!rec && !scheduleAutoIsWorkRecord(rec));
        if (isOff) {
          offStreak++;
          workStreak = 0;
          if (offStreak > SCHEDULE_AUTO_MAX_OFF_STREAK) return false;
        } else {
          offStreak = 0;
          workStreak++;
          if (workStreak > SCHEDULE_AUTO_MAX_WORK_STREAK + 1) return false;
        }
      }
      return true;
    }
    const planById = new Map(perStaffPlan.map((p) => [p.staffId, p]));
    const staffById = new Map(monthStaff.map((s) => [s.id, s]));

    // 선호 오프 교환처럼 두 사람의 자동 오프 위치를 동시에 바꾸는 단계에서는
    // 개별 인원의 연속근무/휴무만 검사해서는 안 된다. 특히 07:00 시작 인원이
    // 아닌 사람과 이른 조 인원의 오프를 교환하면, 초기 배치에서 지켜졌던
    // "주간 유선/채팅 07:00 최소 1명" 조건이 깨질 수 있다.
    // 현재 perStaffPlan을 기준으로 overrides에 들어온 인원만 새 오프 집합으로
    // 대체해, 두 사람의 교환 결과 전체를 다시 계산한다.
    function autoPlanEarlyValidWithOverrides(overrides) {
      for (const t of TYPES) {
        if (earlyTotalCount.DAY[t] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) continue;
        const earlyStaff = nonAdmin.filter((st) =>
          st.group !== "night" &&
          (st.types || []).indexOf(t) !== -1 &&
          scheduleAutoIsEarlyShiftStaff(st)
        );
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          let workingCount = 0;
          for (const st of earlyStaff) {
            const rec = scheduleData.records[scheduleRecordKey(st.id, dateKey)];
            const override = overrides && overrides.get(st.id);
            const currentPlan = override || (() => {
              const p = planById.get(st.id);
              return p ? new Set(p.assigned) : new Set();
            })();
            const isOff = currentPlan.has(d) || (!!rec && !scheduleAutoIsWorkRecord(rec));
            if (!isOff) workingCount++;
          }
          if (workingCount < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) return false;
        }
      }
      return true;
    }

    // ----- 최소 출근 인원 때문에 자리가 안 나는 사람을 위한 "빌려오기" 보정 -----
    // (이응님 사례) 어떤 인원이 목표 오프 개수를 다 못 채운 게 "구분별 하루 최소 출근 인원"
    // 조건 때문이면, 같은 조·업무구분의 동료 중 그 날 자동배치로 오프를 받은 사람의 오프를
    // 다른 빈 날로 옮겨서 그 자리를 대신 내어준다. 선호 반영 우선순위 자체는 그대로 두되(이
    // 단계는 선호 요일 최대화보다 먼저 실행해 부족 인원에게 빈 칸을 최우선으로 확보해 준다),
    // 동료의 그 날이 동료 자신의 선호 오프 요일이었을 때만 "선호 적중 1개 손해"로 치고,
    // 그 손해를 동료 한 명당 SCHEDULE_AUTO_SHORTFALL_PREF_SACRIFICE_LIMIT(3)개까지만 허용한다.
    // 선호와 무관한 날을 옮기는 건 공짜이므로 항상 먼저 시도한다.
    // 이미 입력된 칸(필휴·연차 등)과 이번 실행에서 아직 배정 안 된 빈 칸은 건드리지 않는다.
    const sacrificedPrefByStaff = new Map(); // staffId -> 이번 보정으로 깎인 선호 오프 적중 개수(누적, 한도 체크용)

    // day의 (group×type) 실제 투입 인원이, 거기 새로 오프 하나를 더 넣어도(=1명 줄어도) 안전한지.
    // 최소 출근 인원(예외 없음)과 필요인력 허용범위(최후 기준, tolInfo.max)를 함께 본다.
    // isEarly: 이 슬롯을 내주는(또는 받는) 인원이 "이른 조(07:00 시작)"인지. 이른 조 인원이면
    // 주간 07:00 최소 1명 조건도 함께 확인한다(야간은 대상이 아니다).
    function scheduleAutoBorrowSlotFeasible(g, types, d, isEarly) {
      const dow = new Date(year, monthIndex, d).getDay();
      const dateKey = scheduleDateKey(year, monthIndex, d);
      const tolInfo = scheduleAutoToleranceInfo(dow, dateKey);
      return types.every((t) => {
        const key = scheduleAutoMinWorkingKey(g, t);
        const minWorking = Number(Object.prototype.hasOwnProperty.call(minWorkingByGroup, key) ? minWorkingByGroup[key] : scheduleAutoGetMinWorking(g, t));
        const total = totalCount[g][t];
        if (minWorking > 0 && total >= minWorking && working[g][t][d] - 1 < minWorking) return false;
        const req = required[g][t][d];
        if (req !== null && req !== undefined) {
          const diff = (working[g][t][d] - 1) - req;
          if (-diff > tolInfo.max) return false;
        }
        if (g === "DAY" && isEarly && earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
          if (earlyWorking[g][t][d] - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) return false;
        }
        return true;
      });
    }
    function scheduleAutoApplyOffDelta(types, g, d, delta, isEarly) {
      types.forEach((t) => { if (working[g] && working[g][t]) working[g][t][d] += delta; });
      if (isEarly) types.forEach((t) => { if (earlyWorking[g] && earlyWorking[g][t]) earlyWorking[g][t][d] += delta; });
    }
    function scheduleAutoStaffTypesOf(st) { return TYPES.filter((t) => (st.types || []).indexOf(t) !== -1); }

    function scheduleAutoBorrowFor(targetPlan) {
      const targetStaff = staffById.get(targetPlan.staffId);
      if (!targetStaff) return;
      const g = targetStaff.group === "night" ? "NIGHT" : "DAY";
      const staffTypes = scheduleAutoStaffTypesOf(targetStaff);
      if (!staffTypes.length) return;
      const targetIsEarly = scheduleAutoIsEarlyShiftStaff(targetStaff);
      const blockedDays = (staffMinBlockedDayList.get(targetPlan.staffId) || []).slice();
      let gap = targetPlan.needed - targetPlan.assigned.length;

      blockedDays.forEach((d) => {
        if (gap <= 0) return;
        if (targetPlan.assigned.indexOf(d) !== -1) return;
        const targetKey = scheduleRecordKey(targetPlan.staffId, scheduleDateKey(year, monthIndex, d));
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) return;
        const nextTargetSet = new Set(targetPlan.assigned); nextTargetSet.add(d);
        if (!autoPlanValidSet(targetPlan.staffId, nextTargetSet)) return;

        const dow = new Date(year, monthIndex, d).getDay();
        let candidates = perStaffPlan.filter((p) => {
          if (p.staffId === targetPlan.staffId) return false;
          const st = staffById.get(p.staffId);
          if (!st) return false;
          const sg = st.group === "night" ? "NIGHT" : "DAY";
          if (sg !== g) return false;
          const sTypes = scheduleAutoStaffTypesOf(st);
          if (!sTypes.some((t) => staffTypes.indexOf(t) !== -1)) return false;
          return p.assigned.indexOf(d) !== -1;
        });
        // 선호 요일이 아닌(=공짜인) 동료부터 시도한다.
        candidates = candidates.slice().sort((a, b) => {
          const costA = (a.prefDows || []).indexOf(dow) !== -1 ? 1 : 0;
          const costB = (b.prefDows || []).indexOf(dow) !== -1 ? 1 : 0;
          return costA - costB;
        });

        const moved = []; // 롤백용: { sourcePlan, sTypes, oldAssigned, oldPrefHits, d2 }
        for (const sourcePlan of candidates) {
          if (scheduleAutoBorrowSlotFeasible(g, staffTypes, d, targetIsEarly)) break;
          const st = staffById.get(sourcePlan.staffId);
          const sTypes = scheduleAutoStaffTypesOf(st);
          const sIsEarly = scheduleAutoIsEarlyShiftStaff(st);
          const isPrefDay = (sourcePlan.prefDows || []).indexOf(dow) !== -1;
          const used = sacrificedPrefByStaff.get(sourcePlan.staffId) || 0;
          if (isPrefDay && used >= SCHEDULE_AUTO_SHORTFALL_PREF_SACRIFICE_LIMIT) continue;

          const sourceAssignedSet = new Set(sourcePlan.assigned);
          let d2Found = -1;
          for (let d2 = 1; d2 <= daysInMonth; d2++) {
            if (d2 === d || sourceAssignedSet.has(d2)) continue;
            const key2 = scheduleRecordKey(sourcePlan.staffId, scheduleDateKey(year, monthIndex, d2));
            if (Object.prototype.hasOwnProperty.call(scheduleData.records, key2)) continue;
            if (!scheduleAutoBorrowSlotFeasible(g, sTypes, d2, sIsEarly)) continue;
            const nextSourceSet = new Set(sourceAssignedSet); nextSourceSet.delete(d); nextSourceSet.add(d2);
            if (!autoPlanValidSet(sourcePlan.staffId, nextSourceSet)) continue;
            d2Found = d2;
            break;
          }
          if (d2Found === -1) continue;

          const oldAssigned = sourcePlan.assigned.slice();
          const oldPrefHits = sourcePlan.prefHits || 0;
          scheduleAutoApplyOffDelta(sTypes, g, d, +1, sIsEarly);
          scheduleAutoApplyOffDelta(sTypes, g, d2Found, -1, sIsEarly);
          sourcePlan.assigned = oldAssigned.filter((x) => x !== d).concat([d2Found]).sort((a, b) => a - b);
          if (sourcePlan.prefDows) {
            sourcePlan.prefHits = sourcePlan.assigned.filter((x) => sourcePlan.prefDows.indexOf(new Date(year, monthIndex, x).getDay()) !== -1).length;
          }
          const newPrefHits = sourcePlan.prefHits || 0;
          const sacrificedDelta = Math.max(0, oldPrefHits - newPrefHits);
          if (sacrificedDelta > 0) sacrificedPrefByStaff.set(sourcePlan.staffId, used + sacrificedDelta);
          moved.push({ sourcePlan, sTypes, oldAssigned, oldPrefHits, d2: d2Found, sacrificedDelta, sIsEarly });
        }

        if (!scheduleAutoBorrowSlotFeasible(g, staffTypes, d, targetIsEarly)) {
          // 이 날짜는 결국 못 풀었다 — 이번에 옮긴 것들을 전부 원위치(날짜·선호 적중·손해 한도)로 되돌린다.
          moved.forEach(({ sourcePlan, sTypes, oldAssigned, oldPrefHits, d2, sacrificedDelta, sIsEarly }) => {
            scheduleAutoApplyOffDelta(sTypes, g, d, -1, sIsEarly);
            scheduleAutoApplyOffDelta(sTypes, g, d2, +1, sIsEarly);
            sourcePlan.assigned = oldAssigned;
            sourcePlan.prefHits = oldPrefHits;
            if (sacrificedDelta > 0) {
              const used = sacrificedPrefByStaff.get(sourcePlan.staffId) || 0;
              sacrificedPrefByStaff.set(sourcePlan.staffId, Math.max(0, used - sacrificedDelta));
            }
          });
          return;
        }

        scheduleAutoApplyOffDelta(staffTypes, g, d, -1, targetIsEarly);
        targetPlan.assigned = targetPlan.assigned.concat([d]).sort((a, b) => a - b);
        gap--;
      });
    }

    perStaffPlan
      .filter((p) => (staffMinBlockedDayList.get(p.staffId) || []).length > 0 && p.needed > p.assigned.length)
      .sort((a, b) => (b.needed - b.assigned.length) - (a.needed - a.assigned.length))
      .forEach(scheduleAutoBorrowFor);

    // 이번 보정으로 부족분이 줄었거나 해소됐으면, 경고 문구도 최신 배정 개수 기준으로 다시 만든다.
    perStaffPlan.forEach((p) => {
      const ctx = staffWarnCtx.get(p.staffId);
      if (!ctx || !ctx.shortfallText) return;
      if (p.assigned.length >= p.needed) { ctx.shortfallText = null; return; }
      const stillBlocked = (staffMinBlockedDayList.get(p.staffId) || []).filter((d) => p.assigned.indexOf(d) === -1).length;
      const minNote = stillBlocked > 0
        ? ` 출근 3명 이상을 지키느라 오프를 넣을 수 없는 날이 ${stillBlocked}일 있어요.`
        : "";
      ctx.shortfallText = `${ctx.label}님은 빈 칸이 부족해 목표 ${p.needed}개 중 ${p.assigned.length}개만 배정됐어요.${minNote}`;
    });

    // 목표선(SCHEDULE_AUTO_PREF_FLOOR, 목표 오프 개수보다 작으면 그 개수까지)에 아직 못 미친 사람을
    // 가장 먼저 처리해 남은 스왑 기회를 우선 배정한다. 목표선을 채운 사람들 사이에서는 (기존처럼)
    // 선호 요일을 더 많이 설정한 사람 순으로 추가 최적화를 시도한다.
    const prefRepairOrder = perStaffPlan
      .filter((p) => (p.prefDows && p.prefDows.length) || (p.workPrefDows && p.workPrefDows.length))
      .slice()
      .sort((a, b) => {
        const floorA = (a.prefDows && a.prefDows.length) ? Math.min(a.needed, SCHEDULE_AUTO_PREF_FLOOR) : 0;
        const floorB = (b.prefDows && b.prefDows.length) ? Math.min(b.needed, SCHEDULE_AUTO_PREF_FLOOR) : 0;
        const gapA = Math.max(0, floorA - (a.prefHits || 0));
        const gapB = Math.max(0, floorB - (b.prefHits || 0));
        if (gapA !== gapB) return gapB - gapA;
        return ((b.prefDows?.length || 0) + (b.workPrefDows?.length || 0)) - ((a.prefDows?.length || 0) + (a.workPrefDows?.length || 0));
      });

    prefRepairOrder.forEach((targetPlan) => {
      const targetStaff = staffById.get(targetPlan.staffId);
      if (!targetStaff) return;
      const targetPref = new Set(targetPlan.prefDows || []);
      const targetWorkPref = new Set(targetPlan.workPrefDows || []);
      const targetAssigned = new Set(targetPlan.assigned);
      const targetGroup = targetStaff.group === "night" ? "NIGHT" : "DAY";
      const targetTypes = TYPES.filter((t) => (targetStaff.types || []).indexOf(t) !== -1).sort().join("|");

      for (let d = 1; d <= daysInMonth; d++) {
        const dow = new Date(year, monthIndex, d).getDay();
        if (!targetPref.has(dow) || targetAssigned.has(d)) continue;
        const targetKey = scheduleRecordKey(targetPlan.staffId, scheduleDateKey(year, monthIndex, d));
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) continue;

        let swapped = false;
        for (const sourcePlan of perStaffPlan) {
          if (sourcePlan.staffId === targetPlan.staffId) continue;
          const sourceStaff = staffById.get(sourcePlan.staffId);
          if (!sourceStaff) continue;
          const sourceGroup = sourceStaff.group === "night" ? "NIGHT" : "DAY";
          const sourceTypes = TYPES.filter((t) => (sourceStaff.types || []).indexOf(t) !== -1).sort().join("|");
          if (sourceGroup !== targetGroup || sourceTypes !== targetTypes) continue;
          const sourceAssigned = new Set(sourcePlan.assigned);
          if (!sourceAssigned.has(d)) continue;
          const sourcePref = new Set(sourcePlan.prefDows || []);
          const sourceWorkPref = new Set(sourcePlan.workPrefDows || []);
          if (sourcePref.has(dow) || sourceWorkPref.has(dow)) continue;

          // target가 가진 비선호 OFF를 source에게 넘긴다. source의 선호일이면 교환하지 않는다.
          const swapOut = targetPlan.assigned.find(x => {
            if (targetPref.has(new Date(year, monthIndex, x).getDay())) return false;
            if (targetWorkPref.has(new Date(year, monthIndex, x).getDay())) return false;
            const sourceKey = scheduleRecordKey(sourcePlan.staffId, scheduleDateKey(year, monthIndex, x));
            return !Object.prototype.hasOwnProperty.call(scheduleData.records, sourceKey);
          });
          if (!swapOut) continue;

          const nextTarget = new Set(targetAssigned);
          nextTarget.delete(swapOut); nextTarget.add(d);
          const nextSource = new Set(sourceAssigned);
          nextSource.delete(d); nextSource.add(swapOut);
          if (!autoPlanValidSet(targetPlan.staffId, nextTarget) || !autoPlanValidSet(sourcePlan.staffId, nextSource)) continue;

          // 두 사람의 교환 결과를 동시에 대입해서, 주간 유선/채팅의 07:00
          // 시작 인원이 하루라도 0명이 되지 않는지 확인한다.
          const earlyOverrides = new Map([
            [targetPlan.staffId, nextTarget],
            [sourcePlan.staffId, nextSource],
          ]);
          if (!autoPlanEarlyValidWithOverrides(earlyOverrides)) continue;

          targetAssigned.clear(); nextTarget.forEach(x => targetAssigned.add(x));
          sourceAssigned.clear(); nextSource.forEach(x => sourceAssigned.add(x));
          targetPlan.assigned = Array.from(targetAssigned).sort((a, b) => a - b);
          sourcePlan.assigned = Array.from(sourceAssigned).sort((a, b) => a - b);
          targetPlan.prefHits = targetPlan.assigned.filter(x => targetPref.has(new Date(year, monthIndex, x).getDay())).length;
          if (sourcePlan.prefDows) sourcePlan.prefHits = sourcePlan.assigned.filter(x => sourcePref.has(new Date(year, monthIndex, x).getDay())).length;
          swapped = true;
          break;
        }
        if (swapped) continue;
      }
    });

    // ----- 모두 출근하는 날 최종 제거 -----
    // 자동으로 새 오프를 하나 더 만드는 것이 아니라, 이미 자동 배치된 오프의 위치를
    // 교환해서 해결한다. 따라서 월 오프 총량은 그대로 유지한다.
    // 대상일의 최소 출근 인원/필요인력 허용범위를 지키고, 이동한 오프의 원래 날짜가
    // 다시 모두 출근 상태가 되지 않도록 검사한다. 기존에 입력된 일정은 절대 이동하지 않는다.
    function repairAllWorkingDays() {
      let repaired = 0;
      let changed = true;
      let guard = 0;
      while (changed && guard++ < daysInMonth * Math.max(1, perStaffPlan.length) * 2) {
        changed = false;
        const currentWorking = {};
        const currentEarlyWorking = {};
        ["DAY", "NIGHT"].forEach((g) => {
          currentWorking[g] = {};
          currentEarlyWorking[g] = {};
          TYPES.forEach((t) => {
            currentWorking[g][t] = {};
            currentEarlyWorking[g][t] = {};
            const groupStaff = nonAdmin.filter((st) => (g === "NIGHT" ? st.group === "night" : st.group !== "night") && (st.types || []).indexOf(t) !== -1);
            const earlyGroupStaff = groupStaff.filter((st) => scheduleAutoIsEarlyShiftStaff(st));
            for (let d = 1; d <= daysInMonth; d++) {
              const dateKey = scheduleDateKey(year, monthIndex, d);
              let w = scheduleActualCount(groupStaff, t, dateKey);
              let ew = scheduleActualCount(earlyGroupStaff, t, dateKey);
              groupStaff.forEach((st) => {
                const set = planByIdForRepair.get(st.id);
                if (set && set.has(d)) w -= 1;
              });
              earlyGroupStaff.forEach((st) => {
                const set = planByIdForRepair.get(st.id);
                if (set && set.has(d)) ew -= 1;
              });
              currentWorking[g][t][d] = w;
              currentEarlyWorking[g][t][d] = ew;
            }
          });
        });

        let fixedOne = false;
        for (const g of ["DAY", "NIGHT"]) {
          if (fixedOne) break;
          // 전원 출근의 기준은 조(DAY/NIGHT) 전체 인원이다. 채팅/유선 중 한 업무의
          // 일부 인원만 전원 출근인 것은 '구분 전체 전원 출근'으로 보지 않는다.
          const groupStaff = nonAdmin.filter((st) => g === "NIGHT" ? st.group === "night" : st.group !== "night");
          const total = groupStaff.length;
          if (total <= 0) continue;

          for (let d = 1; d <= daysInMonth; d++) {
            const targetDateKey = scheduleDateKey(year, monthIndex, d);
            let groupWorking = 0;
            for (const st of groupStaff) {
              const rec = scheduleData.records[scheduleRecordKey(st.id, targetDateKey)];
              const set = planByIdForRepair.get(st.id);
              const isOff = (set && set.has(d)) || (rec && !(hasActiveMinWorking ? scheduleCountsAsWorked(rec) : scheduleAutoIsWorkRecord(rec)));
              if (!isOff) groupWorking++;
            }
            if (groupWorking !== total) continue;

            const targetDow = new Date(year, monthIndex, d).getDay();
            // 이 조의 전원 출근을 해소할 사람을 찾되, 그 사람의 모든 업무구분에서
            // 최소 출근 인원과 전원 출근 해소용 허용범위를 함께 확인한다.
            for (const st of groupStaff) {
              const plan = perStaffPlan.find((x) => x.staffId === st.id);
              if (!plan) continue;
              const assigned = new Set(plan.assigned);
              const targetKey = scheduleRecordKey(st.id, targetDateKey);
              if (assigned.has(d) || Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) continue;

              let targetSafe = true;
              for (const t of TYPES) {
                if ((st.types || []).indexOf(t) === -1) continue;
                const typeWorking = currentWorking[g][t][d];
                const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
                if (typeWorking - 1 < minWorking) { targetSafe = false; break; }
                const targetReq = required[g][t][d];
                if (targetReq !== null && targetReq !== undefined) {
                  const tol = scheduleAutoToleranceInfo(targetDow, targetDateKey);
                  const effectiveMax = Math.max(Number(tol.max || 0), 1);
                  if (targetReq - (typeWorking - 1) > effectiveMax) { targetSafe = false; break; }
                }
                // 주간 07:00 근무 인원 최소 1명 조건: 이 사람이 이른 조라면, 오프를 넣었을 때
                // 그 구분의 이른 조 출근 인원이 0명이 되지 않는지도 함께 확인한다.
                if (g === "DAY" && scheduleAutoIsEarlyShiftStaff(st) && earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
                  const earlyTypeWorking = currentEarlyWorking[g][t][d];
                  if (earlyTypeWorking - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) { targetSafe = false; break; }
                }
              }
              if (!targetSafe) continue;

              for (const sourceDay of plan.assigned.slice()) {
                if (sourceDay === d) continue;
                const sourceDateKey = scheduleDateKey(year, monthIndex, sourceDay);
                const sourceKey = scheduleRecordKey(st.id, sourceDateKey);
                if (Object.prototype.hasOwnProperty.call(scheduleData.records, sourceKey)) continue;

                // OFF를 원래 날짜에서 빼면 그 날짜에 전원 출근이 생기는 교환은 금지한다.
                let sourceWouldBeAllWorking = true;
                for (const sourceStaff of groupStaff) {
                  const sourceRec = scheduleData.records[scheduleRecordKey(sourceStaff.id, sourceDateKey)];
                  const sourceSet = planByIdForRepair.get(sourceStaff.id);
                  const sourceIsOff = (sourceSet && sourceSet.has(sourceDay)) || (sourceRec && !scheduleCountsAsWorked(sourceRec));
                  if (sourceStaff.id === st.id) continue;
                  if (sourceIsOff) { sourceWouldBeAllWorking = false; break; }
                }
                if (sourceWouldBeAllWorking) continue;

                const next = new Set(assigned);
                next.delete(sourceDay);
                next.add(d);
                if (!autoPlanValidSet(st.id, next)) continue;
                if (!hasActiveMinWorking) {
                  const ctx = staffWarnCtx.get(st.id);
                  if (ctx) {
                    const beforeStats = moveRunStats(ctx, assigned);
                    const afterStats = moveRunStats(ctx, next);
                    if (afterStats.runs > beforeStats.runs || afterStats.ex5 > beforeStats.ex5 || afterStats.ex6 > beforeStats.ex6) continue;
                  }
                }

                plan.assigned = Array.from(next).sort((x, y) => x - y);
                planByIdForRepair.set(st.id, new Set(plan.assigned));
                if (plan.prefDows) {
                  const pref = new Set(plan.prefDows);
                  plan.prefHits = plan.assigned.filter((x) => pref.has(new Date(year, monthIndex, x).getDay())).length;
                }
                if (plan.workPrefDows) {
                  const wp = new Set(plan.workPrefDows);
                  plan.workPrefHits = plan.assigned.filter((x) => !wp.has(new Date(year, monthIndex, x).getDay())).length;
                }
                repaired++;
                fixedOne = true;
                changed = true;
                break;
              }
              if (fixedOne) break;
            }
            if (fixedOne) break;
          }
        }
        if (!fixedOne) break;
      }
      return repaired;
    }

    // 위 함수에서 빠르게 참조할 수 있도록 현재 계획의 OFF 집합을 만든다.
    const planByIdForRepair = new Map(perStaffPlan.map((p) => [p.staffId, new Set(p.assigned)]));
    const hasActiveMinWorking = ["DAY", "NIGHT"].some((g) => TYPES.some((t) => Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? 0) > 0));
    const repairedAllWorkingDays = repairAllWorkingDays();

    // ----- 선호 요일 최대화: 검증을 통과한 "오프 이동"만 반영 -----
    // 오프 한 칸을 다른 날로 옮기는 이동(또는 두 사람이 서로 맞바꾸는 이동 묶음)을 하나씩 시험해서,
    // 아래 강한 조건을 전부 통과하고 목표 점수가 좋아질 때만 채택한다. 하나라도 어긋나면 그 이동은 버린다.
    //  - 옮길 수 있는 것: 이번 계획이 새로 배정한 오프뿐. 옮겨 갈 곳: 기록이 하나도 없는 빈 칸뿐.
    //    → 필휴·연차·공가 등 이미 입력된 칸은 구조적으로 옮기거나 덮어쓸 수 없다.
    //  - 옮긴 뒤 어떤 (조×업무구분×날짜) 칸이든 부족이 허용 최대치(금·토·월 0, 그 외 -2, 평일 공휴일 -2,
    //    전원 출근 해소 예외 -1)를 넘으면 안 된다(-3 같은 값이 새로 생기지 않는다). 이미 넘은 칸은 더 나빠지지 않아야 한다.
    //  - 구분별 하루 최소 출근 인원을 지킨다. 전원 출근하는 날(업무구분별·조 전체)이 새로 생기지 않는다.
    //  - 옮기는 인원의 연속 근무(6일째 이상 횟수·7일째 금지)와 연속 오프(3일 초과분)가 지금보다 나빠지지 않는다.
    //  - 인원별 오프 개수는 그대로다(이동만 하고 늘리거나 줄이지 않는다).
    // 목표 점수(클수록 좋음, 앞자리 우선): ① 선호 오프 요일 적중 − 선호 출근 요일에 잡힌 오프 ② 필요인력 부족 감소 ③ 오프 분산.
    const improve = { localMoves: 0, groqProposed: 0, groqAccepted: 0, groqRejected: [] };
    const planByStaff = new Map(perStaffPlan.map((p) => [p.staffId, p]));
    const dowOfDay = [], dateKeyOfDay = [];
    for (let d = 1; d <= daysInMonth; d++) {
      dowOfDay[d] = new Date(year, monthIndex, d).getDay();
      dateKeyOfDay[d] = scheduleDateKey(year, monthIndex, d);
    }
    const hasRecordAt = (id, d) => Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(id, dateKeyOfDay[d]));
    const groupStaffAll = {
      DAY: nonAdmin.filter((st) => st.group !== "night"),
      NIGHT: nonAdmin.filter((st) => st.group === "night"),
    };
    const cellWorking = { DAY: {}, NIGHT: {} };  // [조][업무구분][날짜] 현재(계획 반영) 출근 인원
    const groupWorking = { DAY: [], NIGHT: [] }; // [조][날짜] 조 전체 출근 인원
    const offByDay = new Array(daysInMonth + 1).fill(0); // 날짜별 이번 계획의 오프 수(분산 점수용)
    perStaffPlan.forEach((p) => p.assigned.forEach((d) => { offByDay[d] += 1; }));
    ["DAY", "NIGHT"].forEach((g) => {
      groupWorking[g] = new Array(daysInMonth + 1).fill(0);
      TYPES.forEach((t) => {
        cellWorking[g][t] = new Array(daysInMonth + 1).fill(0);
        for (let d = 1; d <= daysInMonth; d++) {
          let w = scheduleActualCount(groupStaffAll[g], t, dateKeyOfDay[d]);
          groupStaffAll[g].forEach((st) => {
            const set = planByIdForRepair.get(st.id);
            if (set && set.has(d) && (st.types || []).indexOf(t) !== -1) w -= 1;
          });
          cellWorking[g][t][d] = w;
        }
      });
      for (let d = 1; d <= daysInMonth; d++) {
        let w = 0;
        groupStaffAll[g].forEach((st) => {
          const rec = scheduleData.records[scheduleRecordKey(st.id, dateKeyOfDay[d])];
          const set = planByIdForRepair.get(st.id);
          const isOff = (set && set.has(d)) || (rec && !scheduleAutoIsWorkRecord(rec));
          if (!isOff) w++;
        });
        groupWorking[g][d] = w;
      }
    });

    // [조][업무구분][날짜] 현재(계획 반영) "이른 조(07:00 시작)" 출근 인원. 선호 요일 최대화 단계의
    // 오프 이동이 이 조건(주간 유선/채팅 하루 최소 1명)을 깨지 않도록 cellWorking과 같은 방식으로 추적한다.
    const cellEarlyWorking = { DAY: {}, NIGHT: {} };
    ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
        const earlyStaffAll = groupStaffAll[g].filter((st) => (st.types || []).indexOf(t) !== -1 && scheduleAutoIsEarlyShiftStaff(st));
        cellEarlyWorking[g][t] = new Array(daysInMonth + 1).fill(0);
        for (let d = 1; d <= daysInMonth; d++) {
          let w = scheduleActualCount(earlyStaffAll, t, dateKeyOfDay[d]);
          earlyStaffAll.forEach((st) => {
            const set = planByIdForRepair.get(st.id);
            if (set && set.has(d)) w -= 1;
          });
          cellEarlyWorking[g][t][d] = w;
        }
      });
    });

    // 한 인원의 연속 근무/오프 위반 정도. 구간 "수"만 보면 이미 길어진 구간을 더 늘려도 같은 값이라서,
    // 초과한 "일수"까지 함께 센다(이동 후 어느 하나라도 커지면 그 이동은 거부한다).
    //  runs: 5일 초과 연속 근무 구간 수 / ex5: 5일을 넘긴 일수 합 / ex6: 6일을 넘긴 일수 합 / offEx: 3일을 넘긴 연속 오프 일수 합
    function moveRunStats(ctx, set) {
      let ws = ctx.carry, os = ctx.offCarry, runs = 0, ex5 = 0, ex6 = 0, offEx = 0;
      const endWork = () => {
        if (ws > LIMIT) { runs++; ex5 += ws - LIMIT; }
        if (ws > LIMIT + 1) ex6 += ws - (LIMIT + 1);
      };
      for (let d = 1; d <= daysInMonth; d++) {
        if (set.has(d) || ctx.baseRest[d]) {
          endWork();
          ws = 0; os++;
        } else {
          if (os > SCHEDULE_AUTO_MAX_OFF_STREAK) offEx += os - SCHEDULE_AUTO_MAX_OFF_STREAK;
          os = 0; ws++;
        }
      }
      endWork();
      if (os > SCHEDULE_AUTO_MAX_OFF_STREAK) offEx += os - SCHEDULE_AUTO_MAX_OFF_STREAK;
      return { runs, ex5, ex6, offEx };
    }
    function moveDayValue(ctx, d) {
      return (ctx.prefSet.has(dowOfDay[d]) ? 1 : 0) - (ctx.workPrefSet.has(dowOfDay[d]) ? 1 : 0);
    }
    function movePrefNet(ctx, set) {
      let n = 0;
      set.forEach((d) => { n += moveDayValue(ctx, d); });
      return n;
    }

    // moves: [{ staffId, from, to }, ...] (최대 4개). 통과하면 { ok: true, vec, ... }, 아니면 { ok: false, reason }.
    function evaluateMoveGroup(moves) {
      const fail = (reason) => ({ ok: false, reason });
      if (!Array.isArray(moves) || moves.length === 0 || moves.length > 4) return fail("이동 묶음 형식");
      const newSets = new Map();
      const cellDelta = new Map();
      const earlyCellDelta = new Map();
      const offDayDelta = new Map();
      const bump = (map, key, n) => map.set(key, (map.get(key) || 0) + n);
      for (const mv of moves) {
        const ctx = mv ? staffWarnCtx.get(mv.staffId) : null;
        const baseSet = ctx ? planByIdForRepair.get(mv.staffId) : null;
        if (!ctx || !baseSet) return fail("배치 대상 인원이 아님");
        const from = mv.from, to = mv.to;
        if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < 1 || from > daysInMonth || to > daysInMonth || from === to) return fail("날짜 형식");
        const cur = newSets.get(mv.staffId) || new Set(baseSet);
        if (!cur.has(from)) return fail("이번 계획이 배정한 오프가 아님");
        if (cur.has(to)) return fail("이미 오프인 날");
        if (hasRecordAt(mv.staffId, to)) return fail("이미 입력된 칸");
        cur.delete(from); cur.add(to);
        newSets.set(mv.staffId, cur);
        ctx.staffTypes.forEach((t) => { bump(cellDelta, `${ctx.g}|${t}|${from}`, 1); bump(cellDelta, `${ctx.g}|${t}|${to}`, -1); });
        bump(cellDelta, `${ctx.g}||${from}`, 1); bump(cellDelta, `${ctx.g}||${to}`, -1);
        if (ctx.isEarly) {
          ctx.staffTypes.forEach((t) => { bump(earlyCellDelta, `${ctx.g}|${t}|${from}`, 1); bump(earlyCellDelta, `${ctx.g}|${t}|${to}`, -1); });
        }
        bump(offDayDelta, from, -1); bump(offDayDelta, to, 1);
      }
      for (const [id, set] of newSets) {
        const ctx = staffWarnCtx.get(id);
        const before = moveRunStats(ctx, planByIdForRepair.get(id));
        const after = moveRunStats(ctx, set);
        if (after.runs > before.runs || after.ex5 > before.ex5 || after.ex6 > before.ex6 || after.offEx > before.offEx) return fail("연속 근무·연속 오프 제한");
      }
      let shortGain = 0;
      for (const [key, delta] of cellDelta) {
        if (delta === 0) continue;
        const [g, t, dStr] = key.split("|");
        const d = Number(dStr);
        if (t === "") {
          const totalGroup = groupStaffAll[g].length;
          const before = groupWorking[g][d], after = before + delta;
          if (totalGroup > 0 && after === totalGroup && before !== totalGroup) return fail("조 전체가 전원 출근하는 날이 생김");
          continue;
        }
        const before = cellWorking[g][t][d], after = before + delta, total = totalCount[g][t];
        if (total > 0 && after === total && before !== total) return fail("전원 출근하는 날이 생김");
        const req = required[g][t][d];
        const hasReq = req !== null && req !== undefined;
        if (after < before) {
          const minW = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
          if (minW > 0 && total >= minW && after < minW) return fail("구분별 최소 출근 인원");
          if (hasReq) {
            const tol = scheduleAutoToleranceInfo(dowOfDay[d], dateKeyOfDay[d]);
            const effMax = (total > 0 && before === total) ? Math.max(tol.max, 1) : tol.max;
            if (req - after > effMax) return fail("필요인력 허용범위 초과");
          }
        }
        if (hasReq) shortGain += Math.max(0, req - before) - Math.max(0, req - after);
      }
      for (const [key, delta] of earlyCellDelta) {
        if (delta === 0) continue;
        const [g, t, dStr] = key.split("|");
        if (g !== "DAY") continue; // 주간 유선/채팅에만 적용하는 조건
        const d = Number(dStr);
        const before = cellEarlyWorking[g][t][d], after = before + delta;
        if (after < before && earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING && after < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
          return fail("주간 07:00 근무 인원 최소 1명");
        }
      }
      let v0 = 0;
      for (const [id, set] of newSets) {
        const ctx = staffWarnCtx.get(id);
        v0 += movePrefNet(ctx, set) - movePrefNet(ctx, planByIdForRepair.get(id));
      }
      let v2 = 0;
      for (const [d, dd] of offDayDelta) {
        if (dd === 0) continue;
        v2 -= Math.pow(offByDay[d] + dd, 2) - Math.pow(offByDay[d], 2);
      }
      return { ok: true, vec: [v0, shortGain, v2], newSets, cellDelta, earlyCellDelta, offDayDelta };
    }
    function applyEvaluatedMoves(ev) {
      ev.newSets.forEach((set, id) => {
        planByIdForRepair.set(id, set);
        const p = planByStaff.get(id);
        const ctx = staffWarnCtx.get(id);
        p.assigned = Array.from(set).sort((a, b) => a - b);
        p.prefHits = p.assigned.filter((d) => ctx.prefSet.has(dowOfDay[d])).length;
        if (p.workPrefDows) p.workPrefHits = p.assigned.filter((d) => !ctx.workPrefSet.has(dowOfDay[d])).length;
      });
      ev.cellDelta.forEach((delta, key) => {
        const [g, t, dStr] = key.split("|");
        const d = Number(dStr);
        if (t === "") groupWorking[g][d] += delta;
        else cellWorking[g][t][d] += delta;
      });
      if (ev.earlyCellDelta) {
        ev.earlyCellDelta.forEach((delta, key) => {
          const [g, t, dStr] = key.split("|");
          cellEarlyWorking[g][t][Number(dStr)] += delta;
        });
      }
      ev.offDayDelta.forEach((dd, d) => { offByDay[d] += dd; });
    }
    const moveVecBetter = (vec) => vec[0] > 0 || (vec[0] === 0 && (vec[1] > 0 || (vec[1] === 0 && vec[2] > 0)));

    // (1) 규칙 기반 탐색: 선호 점수(vec[0])가 좋아지는 이동만 시도한다. 단일 이동이 막히면 같은 조의 두 사람이 서로 맞바꾸는 묶음도 시험한다.
    function improvePreferences() {
      const prefPlans = perStaffPlan
        .filter((p) => (p.prefDows && p.prefDows.length) || (p.workPrefDows && p.workPrefDows.length))
        .slice()
        .sort((a, b) => ((b.prefDows?.length || 0) + (b.workPrefDows?.length || 0)) - ((a.prefDows?.length || 0) + (a.workPrefDows?.length || 0)));
      let guard = 0;
      for (let pass = 0; pass < 8 && guard < 400; pass++) {
        let progress = false;
        for (const p of prefPlans) {
          const ctx = staffWarnCtx.get(p.staffId);
          const cur = planByIdForRepair.get(p.staffId);
          const freeDays = [];
          for (let d = 1; d <= daysInMonth; d++) if (!cur.has(d) && !hasRecordAt(p.staffId, d)) freeDays.push(d);
          const pairs = [];
          cur.forEach((a) => freeDays.forEach((b) => {
            const gain = moveDayValue(ctx, b) - moveDayValue(ctx, a);
            if (gain > 0) pairs.push({ a, b, gain });
          }));
          if (pairs.length === 0) continue;
          pairs.sort((x, y) => (y.gain - x.gain) || (x.b - y.b) || (x.a - y.a));
          let best = null;
          pairs.forEach(({ a, b }) => {
            const ev = evaluateMoveGroup([{ staffId: p.staffId, from: a, to: b }]);
            if (ev.ok && ev.vec[0] > 0 && (!best || scheduleAutoCmpVec(ev.vec, best.vec) > 0)) best = ev;
          });
          if (!best) {
            // 단일 이동이 전부 막혔다면, 같은 조의 다른 인원이 그 날짜의 오프를 서로 바꿔 주는 묶음을 시험한다.
            for (const { a, b } of pairs.slice(0, 12)) {
              for (const q of perStaffPlan) {
                if (q.staffId === p.staffId) continue;
                const qctx = staffWarnCtx.get(q.staffId);
                if (!qctx || qctx.g !== ctx.g) continue;
                const qset = planByIdForRepair.get(q.staffId);
                if (!qset.has(b) || qset.has(a) || hasRecordAt(q.staffId, a)) continue;
                const ev = evaluateMoveGroup([{ staffId: p.staffId, from: a, to: b }, { staffId: q.staffId, from: b, to: a }]);
                if (ev.ok && ev.vec[0] > 0 && (!best || scheduleAutoCmpVec(ev.vec, best.vec) > 0)) best = ev;
              }
              if (best) break;
            }
          }
          if (best) { applyEvaluatedMoves(best); improve.localMoves += 1; guard++; progress = true; }
        }
        if (!progress) break;
      }
    }
    improvePreferences();

    // (2) 외부(Groq) 제안: 각 묶음을 같은 검증에 통과시켜서 통과한 것만 반영한다. 선호 점수가 나빠지는 제안은 어떤 경우에도 버린다.
    const proposedGroups = options && Array.isArray(options.groqMoveGroups) ? options.groqMoveGroups.slice(0, 8) : [];
    proposedGroups.forEach((moves, gi) => {
      improve.groqProposed += 1;
      const ev = evaluateMoveGroup(moves);
      if (!ev.ok) { improve.groqRejected.push({ index: gi, reason: ev.reason }); return; }
      if (ev.vec[0] < 0 || !moveVecBetter(ev.vec)) { improve.groqRejected.push({ index: gi, reason: "개선되지 않음" }); return; }
      applyEvaluatedMoves(ev);
      improve.groqAccepted += 1;
    });

    // 선호 적중 집계를 최종 배정 기준으로 전부 다시 계산한다. (앞의 선호 교환 단계는 선호 출근 회피 값을 갱신하지 않아서
    // 화면·검증 지표에 낡은 값이 남을 수 있었다.)
    perStaffPlan.forEach((p) => {
      const ctx = staffWarnCtx.get(p.staffId);
      if (!ctx) return;
      p.prefHits = p.assigned.filter((d) => ctx.prefSet.has(dowOfDay[d])).length;
      if (p.workPrefDows) p.workPrefHits = p.assigned.filter((d) => !ctx.workPrefSet.has(dowOfDay[d])).length;
    });

    // 인원별 경고를 최종 계획 기준으로 확정한다. (옮겨진 칸의 "허용범위 초과" 경고는 사라지고,
    // 연속 휴무/연속 근무 경고는 옮긴 뒤의 실제 구간으로 다시 계산한다.)
    staffWarnOrder.forEach((id) => {
      const ctx = staffWarnCtx.get(id);
      const finalSet = planByIdForRepair.get(id) || new Set();
      ctx.tolWarn.forEach((w) => { if (finalSet.has(w.d)) warnings.push(w.text); });
      if (ctx.shortfallText) warnings.push(ctx.shortfallText);
      const finalRest = (d) => finalSet.has(d) || !!ctx.baseRest[d];
      scheduleAutoFindLongOffRuns(id, year, monthIndex, daysInMonth, ctx.offCarry, finalRest).forEach((r) => {
        const span = r.start < 1
          ? `지난달 말부터 이어져 ${monthNo}/${r.end}까지`
          : `${monthNo}/${r.start}~${monthNo}/${r.end}`;
        warnings.push(`${ctx.label}님 ${span} ${r.length}일 연속 휴무가 이미 입력되어 있어요(필휴 포함 최대 ${SCHEDULE_AUTO_MAX_OFF_STREAK}일). 기존 일정은 유지했으니 확인해주세요.`);
      });
      scheduleAutoFindLongRuns(daysInMonth, finalRest, ctx.carry, LIMIT).forEach((r) => {
        const span = r.start < 1
          ? `지난달 말부터 이어져 ${monthNo}/${r.end}까지`
          : `${monthNo}/${r.start}~${monthNo}/${r.end}`;
        warnings.push(`${ctx.label}님 ${span} ${r.length}일 연속 근무가 남아요(최대 ${LIMIT}일). 오프 목표 개수 안에서는 해소할 수 없어서 직접 조정이 필요해요.`);
      });
    });
    // ----- 업무구분별(채팅/유선 단독) 전원 출근 제거 -----
    // 위 repairAllWorkingDays()는 "조 전체(예: 주간 9명)"가 다 출근했을 때만 손을 대서,
    // "채팅 4명만 전원 출근" 같은 구분 단위 전원 출근은 잡지 못했다(원래도 -1 추가 허용
    // 예외는 있었지만, 배치 단계에서 아무도 그 날을 고르지 않으면 그대로 남았다). 여기서는
    // (조×업무구분) 단위로 같은 방식(이미 배정된 오프의 자리만 서로 바꾸고, 총 오프 개수는
    // 그대로 유지)으로 다시 찾아서 없앤다. 필요인력 허용범위는 전원 출근 해소 목적에 한해
    // 기존과 동일하게 -1까지 추가로 허용한다(금·토·월 부족 0 규칙도 이 한도 안에서는 예외).
    function repairTypeAllWorkingDays() {
      let repaired = 0;
      let changed = true;
      let guard = 0;
      // 어떤 사람이 (조×업무구분) t2에서 day에 실제로 출근 중인 인원수.
      function typeWorkingOn(g, t2, day, excludeId) {
        const groupStaff2 = nonAdmin.filter((s2) => (g === "NIGHT" ? s2.group === "night" : s2.group !== "night") && (s2.types || []).indexOf(t2) !== -1);
        let count = 0;
        groupStaff2.forEach((s2) => {
          if (s2.id === excludeId) { count++; return; } // 지금 이동을 시도 중인 당사자는 별도로 처리
          const rec2 = scheduleData.records[scheduleRecordKey(s2.id, scheduleDateKey(year, monthIndex, day))];
          const set2 = planByIdForRepair.get(s2.id);
          const isOff2 = (set2 && set2.has(day)) || (rec2 && !(hasActiveMinWorking ? scheduleCountsAsWorked(rec2) : scheduleAutoIsWorkRecord(rec2)));
          if (!isOff2) count++;
        });
        return { count, total: groupStaff2.length };
      }
      while (changed && guard++ < daysInMonth * Math.max(1, perStaffPlan.length) * 2) {
        changed = false;
        let fixedOne = false;
        for (const g of ["DAY", "NIGHT"]) {
          if (fixedOne) break;
          for (const t of TYPES) {
            if (fixedOne) break;
            const groupStaff = nonAdmin.filter((st) => (g === "NIGHT" ? st.group === "night" : st.group !== "night") && (st.types || []).indexOf(t) !== -1);
            const total = groupStaff.length;
            if (total <= 0) continue;

            for (let d = 1; d <= daysInMonth; d++) {
              const targetDateKey = scheduleDateKey(year, monthIndex, d);
              const { count: typeWorkingNow } = typeWorkingOn(g, t, d, null);
              if (typeWorkingNow !== total) continue;

              const targetDow = new Date(year, monthIndex, d).getDay();
              for (const st of groupStaff) {
                const plan = perStaffPlan.find((x) => x.staffId === st.id);
                if (!plan) continue;
                const assigned = new Set(plan.assigned);
                const targetKey = scheduleRecordKey(st.id, targetDateKey);
                if (assigned.has(d) || Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) continue;

                // 이 사람이 겸직 중인 모든 업무구분에서 최소 출근/필요인력 허용범위(전원 출근
                // 해소용 -1 포함)를 함께 확인한다.
                let targetSafe = true;
                for (const t2 of TYPES) {
                  if ((st.types || []).indexOf(t2) === -1) continue;
                  const { count: typeWorking2 } = typeWorkingOn(g, t2, d, null);
                  const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t2)] ?? SCHEDULE_AUTO_MIN_WORKING);
                  if (typeWorking2 - 1 < minWorking) { targetSafe = false; break; }
                  // 07:00 시작 인원 조건도 업무구분별 전원 출근 해소 이동에서 다시 확인한다.
                  // 이 사람이 이른 조이고, 이 이동으로 해당 업무구분의 이른 조 출근이 0명이 되면
                  // 다른 오프 위치로 바꿀 수 없도록 한다. 기존 자동배치 조건은 건드리지 않고
                  // 이번에 추가된 07:00 절대 조건만 한 겹 더 보호한다.
                  if (g === "DAY" && scheduleAutoIsEarlyShiftStaff(st) && earlyTotalCount[g][t2] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
                    const earlyGroupStaff = groupStaff.filter((st2) => scheduleAutoIsEarlyShiftStaff(st2));
                    let earlyWorkingNow = scheduleActualCount(earlyGroupStaff, t2, targetDateKey);
                    earlyGroupStaff.forEach((st2) => {
                      const set2 = planByIdForRepair.get(st2.id);
                      if (set2 && set2.has(d)) earlyWorkingNow -= 1;
                    });
                    if (earlyWorkingNow - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) { targetSafe = false; break; }
                  }
                  const targetReq = required[g][t2][d];
                  if (targetReq !== null && targetReq !== undefined) {
                    const tol = scheduleAutoToleranceInfo(targetDow, targetDateKey);
                    const effectiveMax = Math.max(Number(tol.max || 0), 1);
                    if (targetReq - (typeWorking2 - 1) > effectiveMax) { targetSafe = false; break; }
                  }
                }
                if (!targetSafe) continue;

                for (const sourceDay of plan.assigned.slice()) {
                  if (sourceDay === d) continue;
                  const sourceDateKey = scheduleDateKey(year, monthIndex, sourceDay);
                  const sourceKey = scheduleRecordKey(st.id, sourceDateKey);
                  if (Object.prototype.hasOwnProperty.call(scheduleData.records, sourceKey)) continue;

                  // 이 오프를 원래 날짜에서 빼면, 이 사람이 겸직 중인 어떤 업무구분이든
                  // 그 날 새로 전원 출근이 생기지 않는지 확인한다.
                  let sourceCreatesAllWorking = false;
                  for (const t2 of TYPES) {
                    if ((st.types || []).indexOf(t2) === -1) continue;
                    const { count: working2, total: total2 } = typeWorkingOn(g, t2, sourceDay, st.id);
                    if (working2 === total2) { sourceCreatesAllWorking = true; break; }
                  }
                  if (sourceCreatesAllWorking) continue;

                  const next = new Set(assigned);
                  next.delete(sourceDay);
                  next.add(d);
                  if (!autoPlanValidSet(st.id, next)) continue;
                  if (!hasActiveMinWorking) {
                    const ctx = staffWarnCtx.get(st.id);
                    if (ctx) {
                      const beforeStats = moveRunStats(ctx, assigned);
                      const afterStats = moveRunStats(ctx, next);
                      if (afterStats.runs > beforeStats.runs || afterStats.ex5 > beforeStats.ex5 || afterStats.ex6 > beforeStats.ex6) continue;
                    }
                  }

                  plan.assigned = Array.from(next).sort((a, b) => a - b);
                  planByIdForRepair.set(st.id, new Set(plan.assigned));
                  if (plan.prefDows) {
                    const pref = new Set(plan.prefDows);
                    plan.prefHits = plan.assigned.filter((x) => pref.has(new Date(year, monthIndex, x).getDay())).length;
                  }
                  if (plan.workPrefDows) {
                    const wp = new Set(plan.workPrefDows);
                    plan.workPrefHits = plan.assigned.filter((x) => !wp.has(new Date(year, monthIndex, x).getDay())).length;
                  }
                  repaired++;
                  fixedOne = true;
                  changed = true;
                  break;
                }
                if (fixedOne) break;
              }
              if (fixedOne) break;
            }
          }
        }
        if (!fixedOne) break;
      }
      return repaired;
    }
    const repairedTypeAllWorkingDays = repairTypeAllWorkingDays();
    if (hasActiveMinWorking && repairedTypeAllWorkingDays > 0) {
      warnings.push(`구분(채팅/유선)만 전원 출근 상태인 날을 ${repairedTypeAllWorkingDays}건 자동으로 해소했어요(전원 출근 해소 목적에 한해 필요인력 부족 -1까지 추가 허용). 기존 입력 일정과 최소 출근 인원 조건은 유지했어요.`);
    }

    if (hasActiveMinWorking && repairedAllWorkingDays > 0) {
      warnings.push(`모든 인원 출근 상태를 ${repairedAllWorkingDays}건 자동으로 해소했어요. 기존 입력 일정과 최소 출근 인원 조건은 유지했어요.`);
    }

    // 최종 확인: 보정 후의 실제 계획을 다시 계산한다.
    // 위의 `working`은 최초 후보 생성 직후의 스냅샷이므로, 오프를 교환한 뒤에는 사용하면 안 된다.
    // 따라서 최종 경고/검증은 records + 현재 자동배치 계획을 기준으로 다시 집계한다.
    const monthLabelNo = monthIndex + 1;
    const finalWorking = {};
    ["DAY", "NIGHT"].forEach((g) => {
      finalWorking[g] = {};
      TYPES.forEach((t) => {
        finalWorking[g][t] = {};
        const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          let w = scheduleActualCount(groupStaff, t, dateKey);
          groupStaff.forEach((st) => {
            if ((st.types || []).indexOf(t) === -1) return;
            const set = planByIdForRepair.get(st.id);
            if (set && set.has(d)) w -= 1;
          });
          finalWorking[g][t][d] = w;
        }
      });
    });
    ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
        const minForGroup = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? 0);
        if (!(minForGroup > 0)) return;
        const total = totalCount[g][t];
        if (total <= 0) return;
        const allWorkingDays = [];
        for (let d = 1; d <= daysInMonth; d++) {
          if (finalWorking[g][t][d] === total) allWorkingDays.push(`${monthLabelNo}/${d}`);
        }
        if (allWorkingDays.length > 0) {
          const label = `${g === "NIGHT" ? "야간" : "주간"} ${t}`;
          warnings.push(`${label} 구분에 모든 인원이 출근하는 날이 남아 있어요: ${allWorkingDays.join(", ")}. 기존 일정 또는 출근 최소 인원 조건 때문에 자동으로 해소할 수 없는 날입니다.`);
        }
      });
    });

    // 조 전체 기준 최종 전원 출근 확인. Groq가 성공했든 fallback이든 동일한 기준으로 검사한다.
    ["DAY", "NIGHT"].forEach((g) => {
      const groupHasMinWorking = TYPES.some((t) => Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? 0) > 0);
      if (!groupHasMinWorking) return;
      const groupStaff = nonAdmin.filter((st) => g === "NIGHT" ? st.group === "night" : st.group !== "night");
      const totalGroup = groupStaff.length;
      if (totalGroup <= 0) return;
      const allWorkingDays = [];
      for (let d = 1; d <= daysInMonth; d++) {
        let workingCount = 0;
        groupStaff.forEach((st) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          const rec = scheduleData.records[scheduleRecordKey(st.id, dateKey)];
          const set = planByIdForRepair.get(st.id);
          const isOff = (set && set.has(d)) || (rec && !(hasActiveMinWorking ? scheduleCountsAsWorked(rec) : scheduleAutoIsWorkRecord(rec)));
          if (!isOff) workingCount++;
        });
        if (workingCount === totalGroup) allWorkingDays.push(`${monthLabelNo}/${d}`);
      }
      if (allWorkingDays.length) warnings.push(`${g === "NIGHT" ? "야간" : "주간"} 구분에 모든 인원이 출근하는 날이 남아 있어요: ${allWorkingDays.join(", ")}. 기존 입력 일정 또는 최소 출근 인원 조건 때문에 자동 해소할 수 없는 날입니다.`);
    });

    // 대전제 최종 확인: 배정을 끝낸 뒤에도 출근 인원이 3명 미만인 날이 있는지 구분별로 알려준다.
    // 새 오프는 3명 미만이 되는 날에는 넣지 않으므로, 여기 걸리는 날은 이미 입력된 값(연차·공가·결근 등) 때문이다.
    // 재직 인원이 3명 미만인 구분은 지킬 수 없어서(위 후보 제외 대상도 아님) 그 사실만 한 줄로 알려준다.
    ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
        const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? scheduleAutoGetMinWorking(g, t));
        if (!(minWorking > 0)) return;
        const label = `${g === "NIGHT" ? "야간" : "주간"} ${t}`;
        const total = totalCount[g][t];
        if (total === 0) return;
        if (total < minWorking) {
          warnings.push(`${label} 구분은 재직 인원이 ${total}명뿐이라 하루 출근 ${minWorking}명 이상 조건을 지킬 수 없어서 이 구분에는 적용하지 않았어요.`);
          return;
        }
        const low = [];
        for (let d = 1; d <= daysInMonth; d++) {
          if (working[g][t][d] < minWorking) low.push(`${monthLabelNo}/${d}(${working[g][t][d]}명)`);
        }
        if (low.length > 0) {
          warnings.push(`${label} 구분은 이미 입력된 일정 때문에 출근 인원이 ${minWorking}명 미만인 날이 있어요: ${low.join(", ")}. 이 구분 인원에게는 그 날 새 오프를 넣지 않았어요.`);
        }
      });
    });

    // 추가 대전제 최종 확인: 주간(DAY) 유선/채팅 각 구분, 07:00 근무(이른 조) 인원이 배정 후에도
    // 0명이 되는 날이 있는지 알려준다. 새 오프는 0명이 되는 날에는 넣지 않으므로, 여기 걸리는 날은
    // 이미 입력된 값(연차·공가·결근 등) 때문이다. 그 구분에 애초에 이른 조 인원이 없으면(=이 조건이
    // 적용될 대상 자체가 없으면) 조용히 건너뛴다(경고로 알리지 않음 — 07:00 근무제를 안 쓰는
    // 조직에서는 이 조건 자체가 항상 해당 없음이라 매번 경고가 뜨면 소음이 된다).
    TYPES.forEach((t) => {
      const g = "DAY";
      const label = `주간 ${t}`;
      const earlyTotal = earlyTotalCount[g][t];
      if (earlyTotal === 0) return;
      const low = [];
      for (let d = 1; d <= daysInMonth; d++) {
        if (earlyWorking[g][t][d] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) low.push(`${monthLabelNo}/${d}(${earlyWorking[g][t][d]}명)`);
      }
      if (low.length > 0) {
        warnings.push(`${label} 구분은 이미 입력된 일정 때문에 07:00 근무 인원이 0명인 날이 있어요: ${low.join(", ")}. 이 구분 인원에게는 그 날 새 오프를 넣지 않았어요.`);
      }
    });

    return { year, monthIndex, target, targetInfo, perStaffPlan, warnings, excluded, improve };
  }

  // ----- 적용: 미리보기에서 "이대로 입력"을 눌렀을 때만 실제로 scheduleData에 반영한다. -----
  function scheduleAutoApplyPlan(plan) {
    if (!plan) return;
    if (scheduleIsMonthLocked(plan.year, plan.monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    const cellsToWrite = [];
    plan.perStaffPlan.forEach((p) => {
      p.assigned.forEach((d) => {
        const key = scheduleRecordKey(p.staffId, scheduleDateKey(plan.year, plan.monthIndex, d));
        // 미리보기를 띄운 사이 다른 경로로 그 칸이 채워졌을 수도 있으니, 적용 직전에 한 번 더
        // "아직 빈 칸"인지 확인해서 이미 입력된 칸은 절대 덮어쓰지 않는다.
        if (!Object.prototype.hasOwnProperty.call(scheduleData.records, key)) cellsToWrite.push(key);
      });
    });
    if (cellsToWrite.length === 0) {
      flashScheduleStatus("적용할 칸이 없어요.");
      closeScheduleAutoModal();
      return;
    }
    recordUndo("자동 배치", SCHEDULE_KEY, reloadScheduleData);
    cellsToWrite.forEach((key) => { scheduleData.records[key] = { status: "OFF", attendance: null }; });
    saveScheduleData();
    closeScheduleAutoModal();
    renderApp();
    flashScheduleStatus(`자동 배치 ${cellsToWrite.length}칸 적용 완료`, 2000);
  }

  // ----- 자동 배치 버튼 드롭다운: "자동 배치" / "필휴·연차 제외 스케줄 삭제" -----
  const SCHEDULE_AUTO_MENU_ITEMS = [
    { key: "OPEN", label: "자동 배치" },
    { key: "DELETE_EXCEPT_PROTECTED", label: "필휴·연차 제외 스케줄 삭제", danger: true },
  ];

  function openScheduleAutoMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_AUTO_MENU_ITEMS.map((o, idx) => {
      const divider = idx === 1 ? `<div class="sch-menu-divider"></div>` : "";
      return `${divider}<button type="button" class="${o.danger ? "sch-menu-danger" : ""}" data-auto-menu="${o.key}">${o.danger ? ICON_TRASH + " " : ""}${esc(o.label)}</button>`;
    }).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-auto-menu]").forEach((btn) => {
      btn.onclick = () => {
        const key = btn.getAttribute("data-auto-menu");
        closeScheduleMenu();
        if (key === "OPEN") openScheduleAutoModal();
        else if (key === "DELETE_EXCEPT_PROTECTED") scheduleAutoDeleteExceptProtected();
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // 보호 대상: "필휴" 메모가 있는 오프, 그리고 연차(ANNUAL). 아래 일괄삭제에서 이 둘은 건드리지 않는다.
  function scheduleAutoIsProtectedFromDelete(staffId, dateKey, rec) {
    if (!rec) return false;
    if (rec.status === "ANNUAL") return true;
    if (rec.status === "OFF") return getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
    return false;
  }

  // "필휴" 메모가 있는 오프와 연차만 남기고, 이 달에 실제로 등록된 나머지 일정을 전부 삭제한다.
  // (미리보기 없이 바로 scheduleData.records에 반영되므로 실행 전 확인창을 띄운다. Ctrl+Z로 되돌리기 가능.)
  function scheduleAutoDeleteExceptProtected() {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const ok = window.confirm(
      `${scheduleMonthLabel()} 일정을 "필휴" 메모가 있는 오프와 연차만 남기고 모두 삭제할까요?\n그 외 날짜는 전부 기본값(근무)으로 되돌아가요. (Ctrl+Z로 되돌리기 가능)`
    );
    if (!ok) return;

    recordUndo("필휴·연차 제외 스케줄 삭제", SCHEDULE_KEY, reloadScheduleData);
    let cleared = 0;
    monthStaff.forEach((s) => {
      for (let d = 1; d <= numDays; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const key = scheduleRecordKey(s.id, dateKey);
        const rec = scheduleData.records[key];
        if (!rec) continue;
        if (scheduleAutoIsProtectedFromDelete(s.id, dateKey, rec)) continue;
        delete scheduleData.records[key];
        cleared += 1;
      }
    });
    saveScheduleData();
    updateScheduleTableArea();
    flashScheduleStatus(cleared > 0 ? `필휴·연차 제외 스케줄 삭제됨 (${cleared}칸)` : "삭제할 일정이 없었어요.");
  }

  // ----- 미리보기 팝업 -----
  function closeScheduleAutoModal() {
    scheduleAutoHybridRequestId += 1;
    closeScheduleAutoSettingsPopup();
    const existing = document.getElementById("sch-auto-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleAutoEscHandler, true);
    if (scheduleAutoFitObserver) { scheduleAutoFitObserver.disconnect(); scheduleAutoFitObserver = null; }
  }
  // ESC: "인원별 설정" 팝업이 위에 떠 있으면 그것만 닫고, 아니면 미리보기 팝업을 닫는다.
  function scheduleAutoEscHandler(e) {
    if (e.key !== "Escape") return;
    if (document.getElementById("sch-auto-settings-overlay")) {
      e.stopPropagation();
      closeScheduleAutoSettingsPopup();
      return;
    }
    closeScheduleAutoModal();
  }

  // 인원 이름 표기(이름 → 닉네임 → "이름 없음")
  function scheduleAutoStaffLabel(s) { return s.name || s.nickname || "이름 없음"; }

  // 주간 → 야간 → 관리자 순서로 묶는다(월별 스케줄 표와 같은 정렬). 비어 있는 묶음은 뺀다.
  function scheduleAutoStaffGroups(staffList) {
    const list = staffList.filter((s) => s);
    return [
      { key: "DAY", label: "주간", list: sortStaffByType(list.filter((s) => s.group !== "night" && !s.isAdmin)) },
      { key: "NIGHT", label: "야간", list: sortStaffByType(list.filter((s) => s.group === "night" && !s.isAdmin)) },
      { key: "ADMIN", label: "관리자", list: list.filter((s) => s.isAdmin) },
    ].filter((g) => g.list.length > 0);
  }

  // "인원별 설정" 버튼 옆에 붙는 요약 문구
  function scheduleAutoPrefsCountText(staffList) {
    const setCount = new Set(staffList.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0 || scheduleAutoGetWorkPrefDows(s.id).length > 0).map((s) => s.id)).size;
    return setCount > 0 ? `(${setCount}명 설정됨)` : "(설정 없음)";
  }

  // 배치 조건 중 "제외할 인원" 영역: 아직 제외하지 않은 인원을 고르는 드롭다운 + 제외된 인원 칩(✕로 해제).
  // 드롭다운은 팝업(오버레이) 위에서 z-index 문제가 없도록 브라우저 기본 select를 그대로 쓴다.
  function scheduleAutoExcludeAreaHtml(staffList, excludedIds) {
    const excludedSet = new Set(excludedIds);
    const chips = excludedIds
      .map((id) => staffList.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => `<span class="sch-auto-exclude-chip">${esc(scheduleAutoStaffLabel(s))}<button type="button" class="sch-auto-exclude-remove" data-auto-exclude-remove="${esc(s.id)}" aria-label="${esc(scheduleAutoStaffLabel(s))} 제외 해제">✕</button></span>`)
      .join("");
    const groups = scheduleAutoStaffGroups(staffList.filter((s) => !excludedSet.has(s.id)));
    const selectHtml = groups.length === 0
      ? `<span class="sch-auto-cond-empty">제외할 수 있는 인원이 없어요.</span>`
      : `<select class="add-input sch-auto-exclude-select" data-auto-exclude-select aria-label="제외할 인원 선택"><option value="">인원 선택…</option>${groups.map((g) => `<optgroup label="${g.label}">${g.list.map((s) => `<option value="${esc(s.id)}">${esc(scheduleAutoStaffLabel(s))}${s.name && s.nickname ? ` (${esc(s.nickname)})` : ""}</option>`).join("")}</optgroup>`).join("")}</select>`;
    return `${selectHtml}<span class="sch-auto-exclude-chips">${chips}</span>`;
  }

  function scheduleAutoMinWorkingInputsHtml() {
    const rows = [
      ["DAY", "채팅", "주간 채팅"], ["DAY", "유선", "주간 유선"],
      ["NIGHT", "채팅", "야간 채팅"], ["NIGHT", "유선", "야간 유선"],
    ];
    return rows.map(([g, t, label]) => {
      const key = scheduleAutoMinWorkingKey(g, t);
      return `<label class="sch-auto-min-working-item"><span>${label}</span><input type="number" min="0" max="99" step="1" value="${scheduleAutoGetMinWorking(g, t)}" data-auto-min-working="${key}" aria-label="${label} 하루 최소 출근 인원"></label>`;
    }).join("");
  }

  // 미리보기 팝업 위쪽의 "배치 조건" 영역.
  // 제외할 인원은 인원별 설정 버튼 바로 왼쪽에 배치한다.
  function scheduleAutoConditionsHtml(staffList) {
    return `
      <div class="sch-auto-conds">
        <div class="sch-auto-conds-head">
          <span class="sch-auto-conds-title">배치 조건</span>
          <div class="sch-auto-conds-actions">
            <div class="sch-auto-exclude-inline">
              <span class="sch-auto-cond-label">제외할 인원</span>
              <div class="sch-auto-cond-body" id="sch-auto-exclude-area">${scheduleAutoExcludeAreaHtml(staffList, scheduleAutoExcludedIds)}</div>
            </div>
            <div class="sch-auto-settings-buttons" aria-label="인원별 설정">
              <button type="button" class="ghost-btn sch-auto-settings-btn" id="sch-auto-settings-btn">인원별 설정</button>
            </div>
          </div>
        </div>
        <div class="sch-auto-cond-row">
          <span class="sch-auto-cond-label">구분별 최소 출근</span>
          <div class="sch-auto-min-working-grid">${scheduleAutoMinWorkingInputsHtml()}</div>
        </div>
      </div>`;
  }

  // 인원별 설정 팝업. 위쪽 탭(선호 오프 설정 / 선호 출근 설정)을 눌러 같은 팝업 안에서
  // 두 화면을 오갈 수 있다. 요일은 월~일 순서로 표시한다. kind: "off" | "work"
  function scheduleAutoSettingsPopupHtml(staffList, excludedIds, kind) {
    const mode = kind === "work" ? "work" : "off";
    const excludedSet = new Set(excludedIds || []);
    const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // 월~일
    const isWork = mode === "work";
    const descTitle = isWork ? "선호 출근 요일" : "선호 오프 요일";
    const desc = isWork
      ? "각 인원이 출근을 선호하는 요일을 선택하세요. 선택한 요일에는 오프 배정을 피해서 배치해요."
      : "각 인원이 오프를 선호하는 요일을 선택하세요. 선택한 요일에는 오프를 우선 배정해요.";
    const tabsHtml = `
      <div class="sch-auto-set-tabs" role="tablist">
        <button type="button" class="sch-auto-set-tab${!isWork ? " is-active" : ""}" data-auto-set-tab="off" role="tab" aria-selected="${!isWork}">선호 오프 설정</button>
        <button type="button" class="sch-auto-set-tab${isWork ? " is-active" : ""}" data-auto-set-tab="work" role="tab" aria-selected="${isWork}">선호 출근 설정</button>
        <button type="button" class="ghost-btn sch-auto-set-reset-btn" id="sch-auto-set-reset-btn" data-auto-set-reset="${mode}">${isWork ? "선호 출근" : "선호 오프"} 초기화</button>
      </div>`;
    const head = dayOrder.map((dow) => {
      const label = SCHEDULE_AUTO_DOW_LABELS[dow];
      return `<th class="sch-auto-set-dow${dow === 0 ? " is-sun" : dow === 6 ? " is-sat" : ""}">${label}</th>`;
    }).join("");
    const groups = scheduleAutoStaffGroups(staffList);
    const body = groups.map((g) => {
      const rows = g.list.map((s) => {
        const selectedDows = isWork ? scheduleAutoGetWorkPrefDows(s.id) : scheduleAutoGetPrefDows(s.id);
        const cells = dayOrder.map((dow) => {
          const on = selectedDows.indexOf(dow) !== -1;
          const kindClass = isWork ? "sch-auto-pref-choice-btn--work" : "sch-auto-pref-choice-btn--off";
          return `<td class="sch-auto-set-pref-cell">
            <button type="button" class="sch-auto-pref-choice-btn ${kindClass}${on ? " on" : ""}" data-auto-pref-staff="${esc(s.id)}" data-auto-pref-dow="${dow}" data-auto-pref-kind="${mode}" aria-pressed="${on ? "true" : "false"}" title="${esc(descTitle)}">${on ? "선택" : "-"}</button>
          </td>`;
        }).join("");
        const isEx = excludedSet.has(s.id);
        return `
          <tr class="sch-auto-set-row${isEx ? " is-excluded" : ""}">
            <th scope="row" class="sch-auto-set-name">${esc(s.name || "")}${s.nickname ? ` <span class="sch-adjust-nick">${esc(s.nickname)}</span>` : ""}${isEx ? ` <span class="sch-auto-set-excluded-tag">이번 배치 제외 중</span>` : ""}</th>
            ${cells}
          </tr>`;
      }).join("");
      return `<tr class="sch-auto-set-group"><th colspan="8">${g.label} <span class="sch-auto-set-group-count">${g.list.length}명</span></th></tr>${rows}`;
    }).join("");
    return `
      <div class="sch-preview-box sch-auto-set-box" data-auto-set-kind="${mode}">
        <div class="sch-preview-head">
          <span>인원별 설정 <span class="sch-auto-prefs-count" id="sch-auto-set-count">${esc(scheduleAutoPrefsCountText(staffList))}</span></span>
          <button type="button" class="sch-preview-close" id="sch-auto-set-close-x" aria-label="닫기">✕</button>
        </div>
        ${tabsHtml}
        <div class="sch-preview-body sch-auto-set-body">
          <div class="sch-auto-set-desc"><b>${descTitle}</b> — ${desc} <span class="sch-auto-set-note">설정은 달이 바뀌어도 계속 적용돼요. 필수 조건은 아니며 필요인력·연속 근무 제한 등과 충돌하면 다른 날로 조정될 수 있어요.</span></div>
          ${groups.length === 0 ? `<div class="sch-adjust-empty">이번 달 인원이 없어요.</div>` : `
          <table class="sch-auto-set-table">
            <thead><tr><th class="sch-auto-set-name-th">인원</th>${head}</tr></thead>
            <tbody>${body}</tbody>
          </table>`}
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="primary-btn" id="sch-auto-set-done-btn">닫기</button>
        </div>
      </div>`;
  }

  function closeScheduleAutoSettingsPopup() {
    const existing = document.getElementById("sch-auto-settings-overlay");
    if (existing) existing.remove();
  }

  // 선호 요일 칸을 눌렀을 때: 저장 → 칸 모양·요약 문구 갱신 → 미리보기 다시 계산
  // (목록 전체를 다시 그리지 않아서 스크롤 위치가 유지된다).
  function scheduleAutoHandlePrefChipClick(chip) {
    const staffId = chip.getAttribute("data-auto-pref-staff");
    const dow = Number(chip.getAttribute("data-auto-pref-dow"));
    const kind = chip.getAttribute("data-auto-pref-kind") === "work" ? "work" : "off";
    scheduleAutoSetPrefDow(staffId, dow, kind);
    const offOn = scheduleAutoGetPrefDows(staffId).indexOf(dow) !== -1;
    const workOn = scheduleAutoGetWorkPrefDows(staffId).indexOf(dow) !== -1;
    const cell = chip.closest(".sch-auto-set-pref-cell");
    if (cell) {
      const offBtn = cell.querySelector('[data-auto-pref-kind="off"]');
      const workBtn = cell.querySelector('[data-auto-pref-kind="work"]');
      [[offBtn, offOn], [workBtn, workOn]].forEach(([btn, on]) => {
        if (!btn) return;
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    const text = scheduleAutoPrefsCountText(getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex));
    ["sch-auto-prefs-count", "sch-auto-set-count"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
    scheduleAutoRefreshPreview();
  }

  function openScheduleAutoSettingsPopup(kind) {
    closeScheduleAutoSettingsPopup();
    const mode = kind === "work" ? "work" : "off";
    scheduleAutoSettingsLastKind = mode;
    const staffList = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex);
    const overlay = document.createElement("div");
    overlay.id = "sch-auto-settings-overlay";
    overlay.className = "sch-preview-overlay sch-auto-set-overlay";
    overlay.innerHTML = scheduleAutoSettingsPopupHtml(staffList, scheduleAutoExcludedIds, mode);
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAutoSettingsPopup(); };
    document.getElementById("sch-auto-set-close-x").onclick = () => closeScheduleAutoSettingsPopup();
    document.getElementById("sch-auto-set-done-btn").onclick = () => closeScheduleAutoSettingsPopup();
    // 상단 탭(선호 오프 설정 / 선호 출근 설정): 팝업을 닫지 않고 같은 자리에서 화면만 바꾼다.
    overlay.addEventListener("click", (e) => {
      const tab = e.target && e.target.closest ? e.target.closest("[data-auto-set-tab]") : null;
      if (!tab) return;
      const nextKind = tab.getAttribute("data-auto-set-tab") === "work" ? "work" : "off";
      if (nextKind === mode) return;
      openScheduleAutoSettingsPopup(nextKind);
    });
    // 초기화: 지금 보고 있는 탭(선호 오프 또는 선호 출근)의 전체 인원 설정을 한 번에 비운다.
    // 다른 탭 설정은 건드리지 않는다.
    overlay.addEventListener("click", (e) => {
      const resetBtn = e.target && e.target.closest ? e.target.closest("[data-auto-set-reset]") : null;
      if (!resetBtn) return;
      const resetKind = resetBtn.getAttribute("data-auto-set-reset") === "work" ? "work" : "off";
      const label = resetKind === "work" ? "선호 출근" : "선호 오프";
      if (!window.confirm(`${label} 설정을 전체 인원 기준으로 모두 초기화할까요? 되돌릴 수 없어요.`)) return;
      scheduleAutoClearPrefKind(resetKind);
      openScheduleAutoSettingsPopup(resetKind);
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    overlay.addEventListener("click", (e) => {
      const chip = e.target && e.target.closest ? e.target.closest("[data-auto-pref-staff]") : null;
      if (chip) scheduleAutoHandlePrefChipClick(chip);
    });
  }

  // 제외 인원을 바꿨을 때: 조건 영역을 다시 그리고 계획·미리보기를 다시 계산한다.
  function scheduleAutoRefreshExcludeArea() {
    const area = document.getElementById("sch-auto-exclude-area");
    if (area) area.innerHTML = scheduleAutoExcludeAreaHtml(getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex), scheduleAutoExcludedIds);
  }

  // 미리보기 표: 화면의 월별 스케줄 표(buildScheduleTableHtml)를 그대로 그리되, 계획에 있는 "새로 배정될 오프"를
  // 오프로 채워서 보여준다. 그래서 인원 집계·근무/오프 합계·필요인력 대비·인력 대비 편성(O/X)까지 적용 후 모습 그대로 나온다.
  //  - 계획한 칸을 scheduleData.records에 잠깐 넣었다가 그린 직후 반드시 원래대로 되돌린다(저장하지 않음).
  //  - 지금 화면에서 접어둔 열·행이나 검색어가 미리보기에 영향을 주지 않도록, 그 상태도 잠깐 비웠다가 되돌린다
  //    (일부 인원이 안 보이면 계획을 확인할 수 없으므로 항상 전체를 보여준다).
  function scheduleAutoPreviewTableHtml(plan) {
    const ui = scheduleUi;
    const saved = {
      searchQuery: ui.searchQuery, collapsedRowGroups: ui.collapsedRowGroups, colGroups: ui.colGroups,
      manualHiddenDays: ui.manualHiddenDays, manualHiddenStaffIds: ui.manualHiddenStaffIds,
      manualHiddenInfoCols: ui.manualHiddenInfoCols, manualHiddenSummaryRows: ui.manualHiddenSummaryRows,
    };
    const injected = [];
    const marks = {};
    let html = "";
    try {
      // 이번 배치에서 제외한 인원은 표(집계·필요인력 대비 포함)에서도 뺀다 — 계획을 세운 기준과 같아야 한다.
      schedulePreviewExcludedIds = new Set((plan.excluded || []).map((x) => x.id));
      ui.searchQuery = "";
      ui.collapsedRowGroups = new Set();
      ui.colGroups = [];
      ui.manualHiddenDays = new Set();
      ui.manualHiddenStaffIds = new Set();
      ui.manualHiddenInfoCols = new Set();
      ui.manualHiddenSummaryRows = new Set();
      plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => {
        const key = scheduleRecordKey(p.staffId, scheduleDateKey(plan.year, plan.monthIndex, d));
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, key)) return; // 이미 값이 있는 칸은 건드리지 않는다
        scheduleData.records[key] = { status: "OFF", attendance: null };
        injected.push(key);
        const dow = new Date(plan.year, plan.monthIndex, d).getDay();
        marks[key] = p.prefDows.indexOf(dow) !== -1 ? 2 : 1;
      }));
      schedulePreviewMarks = marks;
      html = buildScheduleTableHtml();
    } finally {
      schedulePreviewMarks = null;
      schedulePreviewExcludedIds = null;
      injected.forEach((key) => { delete scheduleData.records[key]; });
      Object.assign(ui, saved);
    }
    // 미리보기 표는 눌러서 편집하는 표가 아니다: 포커스·"클릭해서 선택" 안내·필요인력 입력칸을 막는다.
    return html
      .replace(/ tabindex="0"/g, "")
      .replace(/ title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"/g, "")
      .replace(/<input /g, "<input disabled ");
  }

  // 계획에 따라 달라지는 부분(요약 + 경고 + 월별 스케줄 표 모양의 미리보기). 선호 요일을 바꿀 때마다 이 부분만 다시 그린다.
  function scheduleAutoPreviewHtml(plan) {
    const totalAssigned = plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);
    const prefTotal = plan.perStaffPlan.reduce((sum, p) => sum + (p.prefDows.length ? p.assigned.length : 0), 0);
    const prefHits = plan.perStaffPlan.reduce((sum, p) => sum + p.prefHits, 0);
    const workPrefTotal = plan.perStaffPlan.reduce((sum, p) => sum + (p.workPrefDows && p.workPrefDows.length ? p.assigned.length : 0), 0);
    const workPrefAvoided = plan.perStaffPlan.reduce((sum, p) => sum + (p.workPrefHits || 0), 0);

    const warningsHtml = plan.warnings.length === 0 ? "" : `
      <div class="sch-auto-warnings">
        <div class="sch-auto-warnings-title">⚠ 확인이 필요해요</div>
        ${plan.warnings.map((w) => `<div class="sch-auto-warning-item">${esc(w)}</div>`).join("")}
      </div>
    `;
    const excludedHtml = plan.excluded && plan.excluded.length > 0
      ? `<div class="sch-auto-excluded-note">제외한 인원: <b>${plan.excluded.map((x) => esc(scheduleAutoStaffLabel(x))).join(", ")}</b> — 재직 인원에서 뺀 채로 계산했고 아래 표에서도 빠져 있어요. 실제 스케줄 표의 이 인원 칸은 바뀌지 않아요.</div>`
      : "";
    const emptyHtml = totalAssigned === 0
      ? `<div class="sch-auto-none">새로 배정할 칸이 없어요(이미 목표 개수를 채웠거나 대상 인원이 없어요).</div>`
      : "";
    const hybrid = plan.hybrid || null;
    let hybridHtml = "";
    if (hybrid) {
      if (hybrid.groqStatus === "success") {
        const usage = hybrid.groqUsage || {};
        const tokenText = Number.isFinite(Number(usage.total_tokens)) ? ` · 토큰 ${Number(usage.total_tokens)}` : "";
        const modelText = hybrid.groqModel ? ` · ${esc(hybrid.groqModel)}` : "";
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--ok">Groq 호출 성공 · 후보 ${hybrid.allowedCandidateCount}개 중 ${hybrid.selectedCandidate + 1}번 선택${modelText}${tokenText}</div>`;
      } else if (hybrid.groqStatus === "fallback") {
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--fallback">Groq 호출 실패 · 기준 자동배치로 안전하게 계속했어요.${hybrid.groqError ? ` <span>${esc(hybrid.groqError)}</span>` : ""}</div>`;
      } else if (hybrid.groqStatus === "invalid-response") {
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--fallback">Groq 응답 검증 실패 · 기준 자동배치로 안전하게 계속했어요.</div>`;
      } else if (hybrid.groqStatus === "skipped") {
        hybridHtml = `<div class="sch-auto-hybrid-note">Groq 호출 생략 · 기존 조건을 만족하는 후보가 ${hybrid.allowedCandidateCount}개라 추가 선택이 필요하지 않았어요.</div>`;
      } else if (hybrid.groqStatus === "unavailable") {
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--fallback">Groq 연결을 사용할 수 없어 기준 자동배치로 진행했어요.</div>`;
      }
    }
    const imp = hybrid && hybrid.improve ? hybrid.improve : null;
    if (imp) {
      const local = imp.localMoves > 0 ? `규칙 탐색으로 ${imp.localMoves}건 이동` : "";
      let text = "";
      if (imp.status === "success") {
        text = `Groq 제안 ${imp.proposed}건 중 ${imp.accepted}건을 조건 검증 후 반영${imp.rejected > 0 ? ` (${imp.rejected}건은 조건 위반·무개선으로 제외)` : ""}`;
      } else if (imp.status === "no-headroom") {
        text = "선호 요일을 더 맞출 여지가 없어요";
      } else if (imp.status === "no-proposal") {
        text = "Groq가 더 나은 이동을 찾지 못했어요";
      } else if (imp.status === "all-rejected" || imp.status === "discarded") {
        text = `Groq 제안 ${imp.proposed}건은 조건 검증을 통과하지 못해 반영하지 않았어요`;
      } else if (imp.status !== "skipped") {
        text = "Groq 개선 제안은 쓰지 못해 기존 계획 그대로예요";
      }
      const parts = [local, text].filter(Boolean);
      if (parts.length) hybridHtml += `<div class="sch-auto-hybrid-note">선호 요일 개선 · ${esc(parts.join(" · "))}</div>`;
    }
    return `
      ${scheduleAutoChecklistHtml(plan)}
      <div class="sch-auto-total">총 <b>${totalAssigned}칸</b>이 새로 채워질 예정이에요.${prefTotal > 0 ? ` 선호 요일 반영 <b>${prefHits}/${prefTotal}칸</b>.` : ""}${workPrefTotal > 0 ? ` 선호 출근일 회피 <b>${workPrefAvoided}/${workPrefTotal}칸</b>.` : ""}</div>
      ${hybridHtml}
      ${excludedHtml}
      ${warningsHtml}
      ${emptyHtml}
      <div class="sch-auto-legend">
        <span class="sch-auto-legend-item"><span class="sch-auto-swatch"></span>새로 배정될 오프</span>
        ${prefHits > 0 ? `<span class="sch-auto-legend-item"><span class="sch-auto-swatch sch-auto-swatch--pref">★</span>선호 요일과 맞은 오프</span>` : ""}
        <span class="sch-auto-legend-note">나머지 칸은 지금 입력된 값 그대로예요.</span>
      </div>
      <div class="schedule-table-wrap sch-auto-table-wrap"><div class="schedule-scale-inner">${scheduleAutoPreviewTableHtml(plan)}</div></div>
    `;
  }

  // 월별 스케줄 화면처럼, 미리보기 표가 팝업 폭에 딱 맞게 보이도록 축소한다(fitScheduleTable과 같은 방식).
  // 모바일 폭에서는 축소하지 않고 가로 스크롤로 본다.
  function scheduleAutoFitPreview() {
    const area = document.getElementById("sch-auto-preview-area");
    const wrap = area ? area.querySelector(".sch-auto-table-wrap") : null;
    const inner = wrap ? wrap.querySelector(".schedule-scale-inner") : null;
    const table = inner ? inner.querySelector("table") : null;
    if (!wrap || !inner || !table) return;
    inner.style.transform = "none";
    inner.style.width = "auto";
    inner.style.height = "auto";
    wrap.style.height = "auto";
    wrap.style.overflowX = "";
    if (window.innerWidth <= 720) return;
    const naturalW = table.offsetWidth;
    const naturalH = table.offsetHeight;
    const availW = wrap.clientWidth;
    if (naturalW <= 0 || availW <= 0) return;
    const scale = Math.min(availW / naturalW, 1);
    const offsetX = Math.max(0, (availW - naturalW * scale) / 2);
    inner.style.width = `${naturalW}px`;
    inner.style.height = `${naturalH}px`;
    inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    wrap.style.overflowX = "hidden";
    wrap.style.height = `${naturalH * scale}px`;
  }

  // ----- 하이브리드 후보 검증/선택 -----
  // 아래 검증은 Groq의 판단보다 항상 우선한다. 후보는 전부 기존 deterministic 로직으로
  // 생성되며, Groq는 후보 번호 외의 값을 적용할 권한이 없다.
  function scheduleAutoPlanMetrics(plan) {
    const year = plan.year, monthIndex = plan.monthIndex;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const excludedIds = new Set((plan.excluded || []).map((x) => x.id));
    const monthStaff = getStaffListForMonth(year, monthIndex).filter((s) => !excludedIds.has(s.id));
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    const assignedByStaff = new Map(plan.perStaffPlan.map((p) => [p.staffId, new Set(p.assigned)]));
    const assignedKeys = new Set();
    let protectedOverlap = 0;
    let targetShortage = 0;
    let workViolationRuns = 0;   // 5일 초과 구간(6일·7일 이상 모두 포함)
    let sixDayRuns = 0;          // 정확히 6일(원칙 위반은 아니지만 예외로만 허용)
    let sevenPlusRuns = 0;       // 7일 이상(규칙 위반)
    let offViolationRuns = 0;
    let offViolationExcess = 0;
    let prefHits = 0, prefTotal = 0, workPrefAvoided = 0, workPrefTotal = 0;

    plan.perStaffPlan.forEach((p) => {
      const set = assignedByStaff.get(p.staffId) || new Set();
      p.assigned.forEach((d) => {
        const key = scheduleRecordKey(p.staffId, scheduleDateKey(year, monthIndex, d));
        assignedKeys.add(key);
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, key)) protectedOverlap += 1;
      });
      targetShortage += Math.max(0, Number(p.needed || 0) - p.assigned.length);
      prefHits += Number(p.prefHits || 0);
      if (p.prefDows && p.prefDows.length) prefTotal += p.assigned.length;
      workPrefAvoided += Number(p.workPrefHits || 0);
      if (p.workPrefDows && p.workPrefDows.length) workPrefTotal += p.assigned.length;
      const carry = scheduleAutoCarryStreak(p.staffId, year, monthIndex);
      const finalRest = (d) => {
        if (set.has(d)) return true;
        const rec = scheduleData.records[scheduleRecordKey(p.staffId, scheduleDateKey(year, monthIndex, d))];
        return !!rec && !scheduleAutoIsWorkRecord(rec);
      };
      const longRuns = scheduleAutoFindLongRuns(daysInMonth, finalRest, carry, SCHEDULE_AUTO_MAX_WORK_STREAK);
      workViolationRuns += longRuns.length;
      longRuns.forEach((r) => { if (r.length > SCHEDULE_AUTO_MAX_WORK_STREAK + 1) sevenPlusRuns += 1; else sixDayRuns += 1; });
      const offCarry = scheduleAutoCarryOffStreak(p.staffId, year, monthIndex);
      const longOffRuns = scheduleAutoFindLongOffRuns(p.staffId, year, monthIndex, daysInMonth, offCarry, finalRest);
      offViolationRuns += longOffRuns.length;
      offViolationExcess += longOffRuns.reduce((sum, r) => sum + Math.max(0, r.length - SCHEDULE_AUTO_MAX_OFF_STREAK), 0);
    });

    const working = {}, required = {}, totalCount = {};
    const earlyWorking = {}, earlyTotalCount = {};
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      working[g] = {}; required[g] = {}; totalCount[g] = {};
      earlyWorking[g] = {}; earlyTotalCount[g] = {};
      ["채팅", "유선"].forEach((t) => {
        working[g][t] = {}; required[g][t] = {};
        totalCount[g][t] = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
        const earlyStaff = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1 && scheduleAutoIsEarlyShiftStaff(s));
        earlyTotalCount[g][t] = earlyStaff.length;
        earlyWorking[g][t] = {};
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          let w = scheduleActualCount(groupStaff, t, dateKey);
          let ew = scheduleActualCount(earlyStaff, t, dateKey);
          groupStaff.forEach((st) => {
            if ((st.types || []).indexOf(t) === -1) return;
            const set = assignedByStaff.get(st.id);
            if (set && set.has(d)) w -= 1;
          });
          earlyStaff.forEach((st) => {
            const set = assignedByStaff.get(st.id);
            if (set && set.has(d)) ew -= 1;
          });
          working[g][t][d] = w;
          required[g][t][d] = getRequiredHeadcount(year, monthIndex, g, t, d);
          earlyWorking[g][t][d] = ew;
        }
      });
    });

    // 주간(DAY) 유선/채팅 07:00 근무(이른 조) 인원 최소 1명 조건 위반 칸 수.
    let earlyWorkingViolations = 0;
    ["채팅", "유선"].forEach((t) => {
      if (earlyTotalCount.DAY[t] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) return;
      for (let d = 1; d <= daysInMonth; d++) {
        if (earlyWorking.DAY[t][d] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) earlyWorkingViolations += 1;
      }
    });

    let minWorkingViolations = 0;
    let toleranceViolations = 0;   // 최후 허용범위(max)까지 넘은 칸
    let idealMissCells = 0;        // 최후 허용범위(max) 안이지만 1순위(ideal) 범위는 못 지킨 칸
    let toleranceCellsWithReq = 0; // 필요인력이 설정된 칸 수(비율 계산용)
    const toleranceViolationDates = []; // 초과 칸이 며칠·어느 구분인지(체크리스트에 날짜로 보여주기 위함)
    const toleranceGroupLabels = { DAY: { 채팅: "주간채팅", 유선: "주간유선" }, NIGHT: { 채팅: "야간채팅", 유선: "야간유선" } };
    let allWorkingDays = 0;
    let totalSlack = 0;
    let maxShortage = 0; // 가장 깊은 필요인력 부족(예: 3이면 -3인 칸이 있음)
    const minWorkingByGroup = scheduleAutoMinWorkingByGroup;
    ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => {
      const total = totalCount[g][t];
      const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
      for (let d = 1; d <= daysInMonth; d++) {
        const w = working[g][t][d];
        const req = required[g][t][d];
        if (total > 0 && w === total) allWorkingDays += 1;
        if (minWorking > 0 && total >= minWorking && w < minWorking) minWorkingViolations += 1;
        if (req !== null && req !== undefined) {
          const dow = new Date(year, monthIndex, d).getDay();
          const tol = scheduleAutoToleranceInfo(dow, scheduleDateKey(year, monthIndex, d));
          const wasAllWorking = total > 0 && (w + 1) === total;
          const effectiveMax = wasAllWorking ? Math.max(tol.max, 1) : tol.max;
          const diff = w - req;
          toleranceCellsWithReq += 1;
          if (-diff > effectiveMax) {
            toleranceViolations += 1;
            toleranceViolationDates.push(`${monthIndex + 1}/${d}(${toleranceGroupLabels[g][t]})`);
          } else if (-diff > tol.ideal) idealMissCells += 1;
          if (-diff > maxShortage) maxShortage = -diff;
          totalSlack += diff;
        }
      }
    }));

    // 조(DAY/NIGHT) 전체 인원의 전원 출근을 별도 하드 조건으로 집계한다.
    // 기존 allWorkingDays는 채팅/유선별 집계였기 때문에, 한 조 전체의 전원 출근을 놓칠 수 있었다.
    let groupAllWorkingDays = 0;
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((st) => g === "NIGHT" ? st.group === "night" : st.group !== "night");
      const totalGroup = groupStaff.length;
      for (let d = 1; d <= daysInMonth; d++) {
        let workingCount = 0;
        groupStaff.forEach((st) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          const rec = scheduleData.records[scheduleRecordKey(st.id, dateKey)];
          const set = assignedByStaff.get(st.id);
          const isOff = (set && set.has(d)) || (rec && !scheduleCountsAsWorked(rec));
          if (!isOff) workingCount++;
        });
        if (totalGroup > 0 && workingCount === totalGroup) groupAllWorkingDays++;
      }
    });

    const offByDay = new Array(daysInMonth + 1).fill(0);
    plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => { offByDay[d] += 1; }));
    const offMean = daysInMonth ? offByDay.slice(1).reduce((a, b) => a + b, 0) / daysInMonth : 0;
    const offVariance = daysInMonth ? offByDay.slice(1).reduce((sum, x) => sum + Math.pow(x - offMean, 2), 0) / daysInMonth : 0;

    return {
      totalAssigned: plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0),
      protectedOverlap, targetShortage, workViolationRuns, sixDayRuns, sevenPlusRuns, offViolationRuns, offViolationExcess,
      minWorkingViolations, earlyWorkingViolations, toleranceViolations, idealMissCells, toleranceCellsWithReq, toleranceViolationDates,
      allWorkingDays, groupAllWorkingDays, prefHits, prefTotal,
      workPrefAvoided, workPrefTotal, offVariance, totalSlack, maxShortage,
      // 선호 점수 = 선호 오프 요일에 잡힌 오프 수 − 선호 출근 요일에 잡힌 오프 수
      prefNet: prefHits - (workPrefTotal - workPrefAvoided),
      warningCount: Array.isArray(plan.warnings) ? plan.warnings.length : 0,
    };
  }

  // ----- 조건 체크리스트: 미리보기에 "지금 이 계획이 설정한 조건을 지켰는지"를 항목별로 보여준다 -----
  //  ok(✓)  : 완전히 지켰다.
  //  warn(△): 규칙 위반은 아니지만 이상적인 수준까지는 못 미쳤다(허용된 예외 포함).
  //  bad(✗) : 규칙을 어겼다. scheduleAutoBuildPlan은 구조적으로 이 상태를 만들 수 없어야 하므로,
  //           실제로 뜨면 버그를 의심해야 한다(방어적 표시).
  // 위반 칸 날짜 목록을 "(10/17(야간채팅), 10/22(주간유선))"처럼 짧게 표시한다.
  // 너무 많으면 앞쪽 몇 개만 보여주고 나머지는 "외 N건"으로 줄인다.
  function scheduleAutoFormatDateList(dates, max) {
    if (!dates || dates.length === 0) return "";
    const limit = max || 8;
    const shown = dates.slice(0, limit);
    const extra = dates.length - shown.length;
    return `(${shown.join(", ")}${extra > 0 ? ` 외 ${extra}건` : ""})`;
  }

  function scheduleAutoChecklistItems(plan, metrics) {
    const items = [];
    const add = (label, mark, note) => items.push({ label, mark, note: note || "" });

    add(
      "기존 입력값 보호",
      metrics.protectedOverlap === 0 ? "ok" : "bad",
      metrics.protectedOverlap === 0 ? "덮어쓴 칸 없음" : `덮어쓴 칸 ${metrics.protectedOverlap}개`
    );

    const minWLabels = { DAY_채팅: "주간채팅", DAY_유선: "주간유선", NIGHT_채팅: "야간채팅", NIGHT_유선: "야간유선" };
    const minWText = Object.keys(minWLabels)
      .map((key) => `${minWLabels[key]} ${scheduleAutoMinWorkingByGroup[key] ?? SCHEDULE_AUTO_MIN_WORKING}명`)
      .join(" · ");
    add(
      "구분별 하루 최소 출근 인원",
      metrics.minWorkingViolations === 0 ? "ok" : "bad",
      `설정값(${minWText}) — 미만 칸 ${metrics.minWorkingViolations}개`
    );

    add(
      "주간 07:00 근무 인원 최소 1명",
      metrics.earlyWorkingViolations === 0 ? "ok" : "bad",
      metrics.earlyWorkingViolations === 0 ? "미만 칸 없음" : `미만 칸 ${metrics.earlyWorkingViolations}개`
    );

    add(
      "연속 오프 최대 3일",
      metrics.offViolationRuns === 0 ? "ok" : "warn",
      metrics.offViolationRuns === 0
        ? "4일 이상 연휴 없음"
        : `${metrics.offViolationRuns}건 — 기존 입력(연차·공가 등)에 의한 것, 자동배치가 만든 건 아님`
    );

    add(
      "연속 근무 최대 5일(불가피하면 6일)",
      metrics.sevenPlusRuns > 0 ? "bad" : (metrics.sixDayRuns > 0 ? "warn" : "ok"),
      metrics.sevenPlusRuns > 0
        ? `7일 이상 ${metrics.sevenPlusRuns}건 — 확인 필요`
        : (metrics.sixDayRuns > 0 ? `6일 연속 ${metrics.sixDayRuns}건 — 규칙상 허용 범위` : "5일 이내")
    );

    add(
      "필요인력 허용범위(최후 기준)",
      metrics.toleranceViolations === 0 ? "ok" : "bad",
      metrics.toleranceViolations === 0
        ? "초과 칸 없음"
        : `초과 칸 ${metrics.toleranceViolations}개 ${scheduleAutoFormatDateList(metrics.toleranceViolationDates)}`
    );

    if (metrics.toleranceCellsWithReq > 0) {
      add(
        "필요인력 1순위(이상적) 범위",
        metrics.idealMissCells === 0 ? "ok" : "warn",
        metrics.idealMissCells === 0 ? "전 칸 충족" : `1순위 미달 ${metrics.idealMissCells}칸 — 최후 범위 안`
      );
    }

    const prefDenom = metrics.prefTotal + metrics.workPrefTotal;
    if (prefDenom > 0) {
      const fullyMet = metrics.prefHits === metrics.prefTotal && metrics.workPrefAvoided === metrics.workPrefTotal;
      add(
        "선호 오프·선호 출근 요일",
        fullyMet ? "ok" : "warn",
        `선호 오프 ${metrics.prefHits}/${metrics.prefTotal} · 선호 출근일 회피 ${metrics.workPrefAvoided}/${metrics.workPrefTotal}`
      );
    }

    add(
      "모든 인원이 출근하는 날 해소",
      (metrics.allWorkingDays === 0 && metrics.groupAllWorkingDays === 0) ? "ok" : "warn",
      (metrics.allWorkingDays === 0 && metrics.groupAllWorkingDays === 0)
        ? "잔여 없음"
        : `잔여 ${metrics.allWorkingDays + metrics.groupAllWorkingDays}건 — 다른 하드 조건과 충돌`
    );

    add(
      "오프 목표 개수 충족",
      metrics.targetShortage === 0 ? "ok" : "warn",
      metrics.targetShortage === 0 ? "전원 목표 충족" : `목표 대비 부족 ${metrics.targetShortage}칸`
    );

    return items;
  }

  // 지금 이 배치에 실제로 적용된 설정값(제외 인원·최소 출근 인원·선호 설정 인원 수)을 한 줄로 보여준다.
  // 아래 체크리스트는 "이 값들을 지켰는지"를 판정하고, 이 줄은 "무엇을 설정했는지" 자체를 보여준다.
  function scheduleAutoSettingsSummaryHtml(plan) {
    const excludedCount = (plan.excluded || []).length;
    const minWLabels = { DAY_채팅: "주간채팅", DAY_유선: "주간유선", NIGHT_채팅: "야간채팅", NIGHT_유선: "야간유선" };
    const minWText = Object.keys(minWLabels).map((key) => `${minWLabels[key]} ${scheduleAutoMinWorkingByGroup[key] ?? SCHEDULE_AUTO_MIN_WORKING}명`).join(" · ");
    const staffList = getStaffListForMonth(plan.year, plan.monthIndex);
    const prefCount = staffList.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0 || scheduleAutoGetWorkPrefDows(s.id).length > 0).length;
    return `
      <div class="sch-auto-settings-summary">
        <span><b>최소 출근 인원</b> ${esc(minWText)}</span>
        <span><b>제외 인원</b> ${excludedCount > 0 ? `${excludedCount}명` : "없음"}</span>
        <span><b>선호 요일 설정</b> ${prefCount > 0 ? `${prefCount}명` : "없음"}</span>
      </div>
    `;
  }

  function scheduleAutoChecklistHtml(plan) {
    const metrics = scheduleAutoPlanMetrics(plan);
    const items = scheduleAutoChecklistItems(plan, metrics);
    const glyph = { ok: "✓", warn: "△", bad: "✗" };
    const rows = items.map((it) => `
      <div class="sch-auto-check-row sch-auto-check-row--${it.mark}">
        <span class="sch-auto-check-mark" aria-hidden="true">${glyph[it.mark]}</span>
        <div class="sch-auto-check-text">
          <div class="sch-auto-check-label">${esc(it.label)}</div>
          ${it.note ? `<div class="sch-auto-check-note">${esc(it.note)}</div>` : ""}
        </div>
      </div>
    `).join("");
    const collapsed = scheduleAutoChecklistCollapsed;
    return `
      <div class="sch-auto-checklist${collapsed ? " sch-auto-checklist--collapsed" : ""}">
        <button type="button" class="sch-auto-checklist-toggle" aria-expanded="${collapsed ? "false" : "true"}">
          <span class="sch-auto-checklist-title">조건 체크리스트 <span class="sch-auto-checklist-legend">✓ 지킴 · △ 규칙상 문제 없음 · ✗ 규칙 위반</span></span>
          <span class="sch-auto-checklist-caret" aria-hidden="true">${collapsed ? "▸" : "▾"}</span>
        </button>
        <div class="sch-auto-checklist-body">
          ${scheduleAutoSettingsSummaryHtml(plan)}
          ${rows}
        </div>
      </div>
    `;
  }

  function scheduleAutoMetricsNotWorseThanBase(candidate, base) {
    const hardKeys = [
      "protectedOverlap", "workViolationRuns", "offViolationRuns", "offViolationExcess",
      "minWorkingViolations", "earlyWorkingViolations", "toleranceViolations", "allWorkingDays", "groupAllWorkingDays", "targetShortage",
    ];
    return hardKeys.every((key) => Number(candidate[key] || 0) <= Number(base[key] || 0));
  }

  function scheduleAutoCandidatePrompt(metricsList) {
    const compact = metricsList.map((m, i) => ({
      candidate: i,
      assigned: m.totalAssigned,
      targetShortage: m.targetShortage,
      preferenceHits: m.prefHits,
      preferenceTotal: m.prefTotal,
      workPreferenceConflicts: m.workPrefAvoided,
      workPreferenceTotal: m.workPrefTotal,
      allWorkingDays: m.allWorkingDays,
      offVariance: Number(m.offVariance.toFixed(4)),
      staffingSlack: m.totalSlack,
      warnings: m.warningCount,
      groupAllWorkingDays: m.groupAllWorkingDays,
    }));
    return `당신은 월별 직원 스케줄의 후보 선택기입니다. 이미 프로그램이 기존 배치 규칙을 적용해 만든 후보들 중 하나만 선택합니다. 새 일정을 만들거나 기존 일정을 수정하지 마세요.\n\n절대 조건: candidate 번호 외에는 어떤 값도 변경하지 않습니다. 특히 groupAllWorkingDays가 기준 후보에서 0이면 반드시 0인 후보만 선택하고, 0보다 큰 후보는 절대 선택하지 마세요. 업무구분별 allWorkingDays도 기준 후보보다 나쁘게 만들지 마세요. 필휴, 연차, 기존 입력 일정, 최소 출근 인원, 필요인력 허용범위, 연속근무/연속오프 제한, 모든 인원 출근 방지 조건을 완화하거나 예외 처리할 수 없습니다. 후보 자체가 이 조건을 깨는 정도가 기준 후보보다 나쁘면 선택하지 마세요.\n\n선택 우선순위: 1) 위 절대 조건이 기준 후보보다 나쁘지 않을 것 2) 선호 오프는 많이, 선호 출근 충돌은 적게 3) 목표 오프 충족 4) 오프 분산 5) 필요인력 여유와 경고 수. 동률이면 candidate 번호가 작은 것을 선택하세요.\n\n후보 데이터:\n${JSON.stringify(compact)}\n\n반드시 JSON 한 줄만 반환하세요. 형식: {"candidate": 0}`;
  }

  function scheduleAutoParseCandidateChoice(data, count) {
    const raw = data && typeof data.text === "string" ? data.text.trim() : "";
    if (!raw) return null;
    const candidates = [];
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) candidates.push(fenced[1]);
    candidates.push(raw);
    for (const text of candidates) {
      try {
        const parsed = JSON.parse(text);
        const n = Number(parsed && parsed.candidate);
        if (Number.isInteger(n) && n >= 0 && n < count) return n;
      } catch (_e) {}
    }
    return null;
  }


  // ----- Groq 개선 제안 (검증을 통과한 이동만 반영) -----
  // Groq는 "오프를 어디로 옮기면 선호가 더 맞는지"만 제안한다. 제안은 scheduleAutoBuildPlan의 이동 검증
  // (필휴 등 기존 입력 칸 불가침, 필요인력 허용범위·최소 출근·연속 근무/오프·전원 출근 방지)을 통과한 것만 반영되고,
  // 반영 결과는 한 번 더 metrics로 확인해서 기준 계획보다 나쁘면 통째로 버린다.
  const SCHEDULE_AUTO_IMPROVE_MAX_PROMPT = 18000;

  // 선호 때문에 더 옮길 여지가 있는지의 상한. 0이면 Groq를 부르지 않는다.
  function scheduleAutoPreferenceHeadroom(plan) {
    const year = plan.year, monthIndex = plan.monthIndex;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let total = 0;
    plan.perStaffPlan.forEach((p) => {
      const off = new Set(p.prefDows || []);
      const work = new Set(p.workPrefDows || []);
      if (off.size === 0 && work.size === 0) return;
      const val = (d) => { const w = new Date(year, monthIndex, d).getDay(); return (off.has(w) ? 1 : 0) - (work.has(w) ? 1 : 0); };
      const assigned = new Set(p.assigned);
      const freeVals = [];
      for (let d = 1; d <= daysInMonth; d++) {
        if (assigned.has(d)) continue;
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(p.staffId, scheduleDateKey(year, monthIndex, d)))) continue;
        freeVals.push(val(d));
      }
      const assignedVals = p.assigned.map(val);
      const better = freeVals.slice().sort((a, b) => b - a);
      const worse = assignedVals.slice().sort((a, b) => a - b);
      for (let i = 0; i < Math.min(better.length, worse.length); i++) {
        if (better[i] > worse[i]) total += better[i] - worse[i]; else break;
      }
    });
    return total;
  }

  function scheduleAutoImprovementPrompt(plan) {
    const year = plan.year, monthIndex = plan.monthIndex;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const nonAdminAll = getStaffListForMonth(year, monthIndex).filter((s) => !s.isAdmin && !(plan.excluded || []).some((x) => x.id === s.id));
    const planByStaff = new Map(plan.perStaffPlan.map((p) => [p.staffId, p]));
    const keyMap = new Map(); // "S1" -> staffId
    const lines = [];
    const dowText = (arr) => (arr && arr.length ? arr.map((n) => SCHEDULE_AUTO_DOW_LABELS[n]).join("") : "-");
    // 선호가 있는 인원과 오프가 배정된 인원 순서(맞교환 상대가 될 수 있는 인원 포함).
    const ordered = nonAdminAll
      .filter((s) => planByStaff.has(s.id))
      .sort((a, b) => {
        const pa = planByStaff.get(a.id), pb = planByStaff.get(b.id);
        const ha = ((pa.prefDows || []).length + (pa.workPrefDows || []).length) > 0 ? 1 : 0;
        const hb = ((pb.prefDows || []).length + (pb.workPrefDows || []).length) > 0 ? 1 : 0;
        return hb - ha;
      });
    ordered.forEach((s, i) => {
      const p = planByStaff.get(s.id);
      const key = `S${i + 1}`;
      const assigned = new Set(p.assigned);
      const movable = [], fixed = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const rec = scheduleData.records[scheduleRecordKey(s.id, scheduleDateKey(year, monthIndex, d))];
        if (rec) { if (!scheduleAutoIsWorkRecord(rec)) fixed.push(d); }
        else if (!assigned.has(d)) movable.push(d);
      }
      const grp = s.group === "night" ? "야" : "주";
      const types = (s.types || []).join("/") || "-";
      lines.push(`${key} ${grp}·${types} 선호오프=${dowText(p.prefDows)} 선호출근=${dowText(p.workPrefDows)} 배정=[${p.assigned.join(",")}] 이동가능=[${movable.join(",")}] 고정휴무=[${fixed.join(",")}] 전월연속근무=${p.carry || 0}`);
      keyMap.set(key, s.id);
    });
    // 날짜별 "오프를 더 넣어도 되는 여유"(spare): 0 이하인 날에는 오프를 추가하는 이동이 반드시 폐기된다.
    const assignedByStaff = new Map(plan.perStaffPlan.map((p) => [p.staffId, new Set(p.assigned)]));
    const spareLines = [];
    ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => {
      const groupStaff = nonAdminAll.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      const total = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
      if (total === 0) return;
      const minW = Number(scheduleAutoMinWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
      const arr = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        let w = scheduleActualCount(groupStaff, t, dateKey);
        groupStaff.forEach((st) => { const set = assignedByStaff.get(st.id); if (set && set.has(d) && (st.types || []).indexOf(t) !== -1) w -= 1; });
        let spare = minW > 0 && total >= minW ? w - minW : w;
        const req = getRequiredHeadcount(year, monthIndex, g, t, d);
        if (req !== null && req !== undefined) {
          const tol = scheduleAutoToleranceInfo(new Date(year, monthIndex, d).getDay(), dateKey);
          spare = Math.min(spare, w - (req - tol.max));
        }
        arr.push(spare);
      }
      spareLines.push(`${g === "NIGHT" ? "야" : "주"}·${t}: ${arr.join(",")}`);
    }));
    const prompt = `당신은 월별 직원 스케줄의 "개선 제안자"입니다. 이미 규칙으로 만든 계획에서, 인원별 선호 요일이 더 잘 맞도록 오프를 옮기는 제안만 합니다.\n\n`
      + `목표: 각 인원의 선호오프 요일에 오프가 더 많이, 선호출근 요일에 오프는 더 적게 잡히게 하세요. 그 밖의 것은 목표가 아닙니다.\n\n`
      + `제안 방식: 이동 = 한 인원의 "배정" 날짜 하나를 같은 인원의 "이동가능" 날짜 하나로 옮기는 것. 여러 이동을 한 묶음(최대 4개)으로 만들 수 있고, 묶음은 통째로 적용되거나 통째로 버려집니다(두 사람이 오프를 서로 맞바꾸는 용도).\n`
      + `- "고정휴무"(필휴·연차 등)와 "이동가능"에 없는 날짜는 절대 사용할 수 없습니다.\n`
      + `- 아래 "여유" 표에서 오프를 옮겨 갈 날짜가 0 이하이면 그 날 오프를 추가할 수 없습니다(같은 조·업무구분 기준). 이동으로 비워지는 날은 여유가 1 늘어납니다.\n`
      + `- 연속 근무는 5일까지(불가피하면 6일), 연속 오프는 3일까지입니다. 인원별 오프 개수는 바꾸지 않습니다.\n`
      + `- 규칙을 어기는 제안은 프로그램이 자동으로 폐기하니, 확신이 없으면 제안하지 마세요. 개선할 수 없으면 {"groups":[]}를 반환하세요.\n\n`
      + `여유 표(날짜 1일부터 ${daysInMonth}일까지):\n${spareLines.join("\n")}\n\n`
      + `인원(선호오프/선호출근은 요일):\n${lines.join("\n")}\n\n`
      + `반드시 JSON 한 줄만 반환하세요. 형식: {"groups":[[{"staff":"S3","from":12,"to":13}],[{"staff":"S1","from":5,"to":6},{"staff":"S2","from":6,"to":5}]]}`;
    return { prompt, keyMap };
  }

  function scheduleAutoParseImprovementGroups(text, keyMap) {
    const raw = typeof text === "string" ? text.trim() : "";
    if (!raw) return null;
    const candidates = [];
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) candidates.push(fenced[1]);
    candidates.push(raw);
    const braces = raw.match(/\{[\s\S]*\}/);
    if (braces) candidates.push(braces[0]);
    for (const c of candidates) {
      let parsed;
      try { parsed = JSON.parse(c); } catch (_e) { continue; }
      if (!parsed || !Array.isArray(parsed.groups)) continue;
      const groups = [];
      parsed.groups.slice(0, 8).forEach((g) => {
        if (!Array.isArray(g) || g.length === 0 || g.length > 4) return;
        const moves = [];
        for (const mv of g) {
          const staffId = mv && keyMap.get(String(mv.staff));
          const from = Number(mv && mv.from), to = Number(mv && mv.to);
          if (!staffId || !Number.isInteger(from) || !Number.isInteger(to)) return;
          moves.push({ staffId, from, to });
        }
        groups.push(moves);
      });
      return groups;
    }
    return null;
  }

  async function scheduleAutoAskGroqImprove(plan) {
    if (!cloud || typeof cloud.functions?.invoke !== "function") {
      return { status: "unavailable", groups: [] };
    }
    const { prompt, keyMap } = scheduleAutoImprovementPrompt(plan);
    if (prompt.length > SCHEDULE_AUTO_IMPROVE_MAX_PROMPT) {
      return { status: "too-large", groups: [] };
    }
    const res = await cloud.functions.invoke("qa-groq-summary", {
      body: { prompt, mode: "schedule-auto-improvement" },
    });
    if (res && res.error) throw res.error;
    const data = res && res.data;
    const groups = scheduleAutoParseImprovementGroups(data && data.text, keyMap);
    if (groups === null) return { status: "invalid-response", groups: [], model: data?.model || null, usage: data?.usage || null };
    return { status: "success", groups, model: data?.model || null, usage: data?.usage || null };
  }

  // 선택된 계획에 개선 단계를 적용한다. 어떤 실패든 원래 계획을 그대로 돌려준다.
  async function scheduleAutoImprovePlanWithGroq(year, monthIndex, baseOptions, selectedIndex, selectedPlan, selectedMetrics) {
    const info = {
      status: "skipped", localMoves: selectedPlan.improve ? selectedPlan.improve.localMoves : 0,
      proposed: 0, accepted: 0, rejected: 0, rejectReasons: [], model: null, usage: null, error: null,
    };
    try {
      if (scheduleAutoPreferenceHeadroom(selectedPlan) <= 0) { info.status = "no-headroom"; return { plan: selectedPlan, info }; }
      const asked = await scheduleAutoAskGroqImprove(selectedPlan);
      info.model = asked.model || null; info.usage = asked.usage || null;
      if (asked.status !== "success") { info.status = asked.status; return { plan: selectedPlan, info }; }
      info.proposed = asked.groups.length;
      if (asked.groups.length === 0) { info.status = "no-proposal"; return { plan: selectedPlan, info }; }
      const improved = scheduleAutoBuildPlan(year, monthIndex, Object.assign({}, baseOptions, { variant: selectedIndex, groqMoveGroups: asked.groups }));
      const m = scheduleAutoPlanMetrics(improved);
      info.accepted = improved.improve.groqAccepted;
      info.rejected = improved.improve.groqRejected.length;
      info.rejectReasons = improved.improve.groqRejected.map((r) => r.reason);
      // 2차 안전 확인: 이동 검증과 별개로, 최종 계획의 metrics가 기준보다 나쁘거나 -N이 더 깊어지면 통째로 버린다.
      const safe = scheduleAutoMetricsNotWorseThanBase(m, selectedMetrics)
        && m.maxShortage <= selectedMetrics.maxShortage
        && m.prefNet >= selectedMetrics.prefNet
        && m.warningCount <= selectedMetrics.warningCount;
      if (improved.improve.groqAccepted > 0 && safe) { info.status = "success"; return { plan: improved, info }; }
      info.status = improved.improve.groqAccepted > 0 ? "discarded" : "all-rejected";
      return { plan: selectedPlan, info };
    } catch (err) {
      info.status = "fallback";
      info.error = String(err?.message || err || "Groq 호출 실패");
      console.warn("자동 배치 개선 제안 호출 실패 — 기존 계획으로 계속합니다.", err);
      return { plan: selectedPlan, info };
    }
  }

  async function scheduleAutoAskGroq(metricsList, allowedIndexes) {
    if (!cloud || typeof cloud.functions?.invoke !== "function") {
      return { status: "unavailable", selectedIndex: null, error: "서버 연결 기능을 사용할 수 없어요." };
    }
    if (allowedIndexes.length <= 1) {
      return { status: "skipped", selectedIndex: allowedIndexes[0] ?? null, allowedCandidateCount: allowedIndexes.length };
    }
    const filtered = allowedIndexes.map((i) => metricsList[i]);
    const remapped = await cloud.functions.invoke("qa-groq-summary", {
      body: {
        prompt: scheduleAutoCandidatePrompt(filtered),
        mode: "schedule-auto-candidate-selection",
      },
    });
    if (remapped && remapped.error) throw remapped.error;
    const data = remapped && remapped.data;
    const localChoice = scheduleAutoParseCandidateChoice(data, filtered.length);
    if (localChoice === null) {
      return {
        status: "invalid-response",
        selectedIndex: null,
        model: data?.model || null,
        usage: data?.usage || null,
        requestId: data?.groq_request_id || null,
      };
    }
    return {
      status: data?.groq_verified ? "success" : "invalid-response",
      selectedIndex: data?.groq_verified ? allowedIndexes[localChoice] : null,
      model: data?.model || null,
      usage: data?.usage || null,
      requestId: data?.groq_request_id || null,
    };
  }

  async function scheduleAutoBuildHybridPlan(year, monthIndex, options) {
    const baseOptions = Object.assign({}, options || {});
    const candidates = [];
    for (let i = 0; i < SCHEDULE_AUTO_HYBRID_CANDIDATE_COUNT; i++) {
      candidates.push(scheduleAutoBuildPlan(year, monthIndex, Object.assign({}, baseOptions, { variant: i })));
    }
    const metricsList = candidates.map(scheduleAutoPlanMetrics);
    const baseMetrics = metricsList[0];
    const allowedIndexes = metricsList
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => scheduleAutoMetricsNotWorseThanBase(m, baseMetrics))
      .map(({ i }) => i);
    let selectedIndex = 0;
    let groqResult;
    try {
      groqResult = await scheduleAutoAskGroq(metricsList, allowedIndexes);
      if (Number.isInteger(groqResult?.selectedIndex) && allowedIndexes.indexOf(groqResult.selectedIndex) !== -1) {
        selectedIndex = groqResult.selectedIndex;
      }
    } catch (err) {
      groqResult = {
        status: "fallback",
        selectedIndex: null,
        error: String(err?.message || err || "Groq 호출 실패"),
      };
      console.warn("자동 배치 후보 선택 서버 호출 실패 — 기준 후보로 계속합니다.", err);
    }
    // Groq 응답이 없거나 검증되지 않았거나, 허용 후보 밖을 가리키면 기준 후보만 사용한다.
    if (!scheduleAutoMetricsNotWorseThanBase(metricsList[selectedIndex], baseMetrics)) selectedIndex = 0;
    if (groqResult && groqResult.status === "invalid-response") groqResult.status = "fallback";
    let selected = candidates[selectedIndex];
    const improvedResult = await scheduleAutoImprovePlanWithGroq(year, monthIndex, baseOptions, selectedIndex, selected, metricsList[selectedIndex]);
    selected = improvedResult.plan;
    selected.hybrid = {
      improve: improvedResult.info,
      enabled: true,
      candidateCount: candidates.length,
      allowedCandidateCount: allowedIndexes.length,
      selectedCandidate: selectedIndex,
      metrics: improvedResult.plan === candidates[selectedIndex] ? metricsList[selectedIndex] : scheduleAutoPlanMetrics(selected),
      groqStatus: groqResult?.status || "fallback",
      groqModel: groqResult?.model || null,
      groqUsage: groqResult?.usage || null,
      groqRequestId: groqResult?.requestId || null,
      groqError: groqResult?.error || null,
    };
    return selected;
  }

  // 계획을 다시 계산해서 미리보기 영역과 "이대로 입력" 버튼 상태를 갱신한다.
  async function scheduleAutoRefreshPreview() {
    const requestId = ++scheduleAutoHybridRequestId;
    const area = document.getElementById("sch-auto-preview-area");
    if (area) area.innerHTML = `<div class="sch-auto-none">조건을 확인하고 배치 후보를 최적화하는 중...</div>`;
    const plan = await scheduleAutoBuildHybridPlan(scheduleUi.year, scheduleUi.monthIndex, { excludeStaffIds: scheduleAutoExcludedIds, minWorkingByGroup: scheduleAutoMinWorkingByGroup });
    if (requestId !== scheduleAutoHybridRequestId || !document.getElementById("sch-auto-overlay")) return;
    scheduleAutoPlan = plan;
    if (area) area.innerHTML = scheduleAutoPreviewHtml(scheduleAutoPlan);
    scheduleAutoFitPreview();
    const total = scheduleAutoPlan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);
    const applyBtn = document.getElementById("sch-auto-apply-btn");
    if (applyBtn) applyBtn.disabled = total === 0;
  }

  // "?" 버튼을 누르면 뜨는 배치 조건 안내를, 그냥 나열된 문장 목록이 아니라
  // 실제로 자동배치가 조건을 적용하는 우선순위 순서대로 도식표(위→아래, 화살표로 연결)로 보여준다.
  // 각 단계(tier)는 { badge: 배지 텍스트, items: [{ title, desc }] } 형태.
  function scheduleAutoInfoDiagramHtml() {
    const tiers = [
      {
        badge: "1순위 · 절대 불가침",
        items: [
          { title: "기존 입력값 보호", desc: "이미 값이 입력된 칸은 그대로 유지, 기본값(근무)인 빈 칸에만 새 오프를 배정해요." },
          { title: "구분별 하루 최소 출근 인원", desc: "설정한 최소 출근 인원 밑으로는 어떤 경우에도 내려가지 않아요." },
          { title: "주간 07:00 근무 인원 최소 1명", desc: "주간 유선·채팅 각 구분마다 근무시간이 07:00 시작인 인원이 하루 최소 1명은 출근하도록 해요(종료 시각은 상관없어요). 그 구분에 07:00 시작 인원이 아예 없으면 지킬 수 없어서 적용하지 않고 안내해요." },
        ],
      },
      {
        badge: "2순위 · 최후 허용선",
        items: [
          { title: "필요인력 허용범위(최후 기준)", desc: "금·토·월 0 / 그 외 요일 -1(최후의 수단 -2) / 평일 공휴일은 금·토·월도 -2까지 허용해요. (대비 +는 항상 허용, 부족만 제한)" },
        ],
      },
      {
        badge: "3순위 · 규칙(불가피하면 예외)",
        items: [
          { title: `연속 근무 최대 ${SCHEDULE_AUTO_MAX_WORK_STREAK}일`, desc: "불가피하면 6일까지 허용해요. 전월 말일부터 이어진 연속 근무일수도 포함해서 계산해요." },
          { title: `연속 오프 최대 ${SCHEDULE_AUTO_MAX_OFF_STREAK}일`, desc: "메모에 \"필휴\"로 표시된 오프도 연결된 연속 오프 계산에 포함돼요." },
          { title: "전원 출근하는 날 방지", desc: "각 구분별로 모든 인원이 출근하는 날은 만들지 않아요. 이를 피하기 위해 필요한 경우에 한해 그 날짜의 필요인력 부족을 -1까지 더 허용해요." },
        ],
      },
      {
        badge: "4순위 · 가능하면 지키는 선호",
        items: [
          { title: "선호 출근·오프 요일", desc: "\"인원별 설정\" 기준으로 선호 출근일엔 오프를 피하고 선호 오프일엔 오프를 우선 배정해요. 필수는 아니라 위 조건과 충돌하면 조정돼요." },
          { title: "오프 목표 개수 충족", desc: "목표 개수 = 공휴일+토요일+일요일 기준 인원별 자동 계산. 대휴·공휴는 항상 차감, 오프는 \"필휴\" 표시가 있을 때만 차감, 연차·공가·육휴·특휴는 차감 안 해요." },
        ],
      },
    ];
    const tierHtml = tiers.map((tier, i) => `
      <div class="sch-auto-priority-tier">
        <div class="sch-auto-priority-badge">${esc(tier.badge)}</div>
        <div class="sch-auto-priority-boxes">
          ${tier.items.map((it) => `
            <div class="sch-auto-priority-box">
              <div class="sch-auto-priority-box-title">${esc(it.title)}</div>
              <div class="sch-auto-priority-box-desc">${it.desc}</div>
            </div>
          `).join("")}
        </div>
      </div>
      ${i < tiers.length - 1 ? `<div class="sch-auto-priority-arrow" aria-hidden="true">↓</div>` : ""}
    `).join("");
    return `
      <div class="sch-auto-priority-diagram">${tierHtml}</div>
      <div class="sch-auto-priority-notes">
        <div>제외할 인원: 이번 배치에만 적용(저장 안 됨) · 재직 인원에서 빠진 것으로 필요인력 계산 · 오프 신규 배정 없음 · 미리보기 표에서 제외(실제 스케줄 표의 해당 인원 칸은 변경 없음)</div>
        <div>저장 방식: 미리보기 단계에서는 저장되지 않음, "이대로 입력" 클릭 시에만 반영돼요.</div>
      </div>
    `;
  }

  function openScheduleAutoModal() {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    closeScheduleAutoModal();
    scheduleAutoResetExcluded(); // 제외 조건은 이번 실행 한정이라 열 때마다 비운다
    scheduleAutoPlan = null;
    scheduleAutoChecklistCollapsed = false;
    const monthStaff = getStaffListForMonth(year, monthIndex);

    const overlay = document.createElement("div");
    overlay.id = "sch-auto-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-auto-box">
        <div class="sch-preview-head">
          <span class="sch-auto-head-title">
            자동 배치 조건 설정 · ${esc(scheduleMonthLabel())}
            <button type="button" class="sch-auto-info-btn" id="sch-auto-info-btn" aria-label="배치 조건 안내" title="배치 조건 안내">?</button>
          </span>
          <button type="button" class="sch-preview-close" id="sch-auto-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-auto-info-card" id="sch-auto-info-card" hidden>
          ${scheduleAutoInfoDiagramHtml()}
        </div>
        <div class="sch-preview-body sch-auto-body">
          ${scheduleAutoConditionsHtml(monthStaff)}
          <div id="sch-auto-preview-area"><div class="sch-auto-none">조건을 설정한 뒤 <b>배치</b> 버튼을 누르면 미리보기가 생성됩니다.</div></div>
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-auto-cancel-btn">취소</button>
          <button type="button" class="primary-btn" id="sch-auto-build-btn">배치</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAutoModal(); };
    document.getElementById("sch-auto-close-x").onclick = () => closeScheduleAutoModal();
    document.getElementById("sch-auto-cancel-btn").onclick = () => closeScheduleAutoModal();
    // 조건 안내(물음표 아이콘): 누르면 카드를 열고 닫고, 카드 밖을 클릭하면 닫힌다.
    const infoBtn = document.getElementById("sch-auto-info-btn");
    const infoCard = document.getElementById("sch-auto-info-card");
    if (infoBtn && infoCard) {
      infoBtn.onclick = (e) => {
        e.stopPropagation();
        infoCard.hidden = !infoCard.hidden;
      };
      overlay.addEventListener("click", (e) => {
        if (infoCard.hidden) return;
        if (e.target === infoBtn || infoCard.contains(e.target)) return;
        infoCard.hidden = true;
      });
    }
    const applyBtn = document.getElementById("sch-auto-apply-btn");
    if (applyBtn) applyBtn.onclick = () => scheduleAutoApplyPlan(scheduleAutoPlan);
    const buildBtn = document.getElementById("sch-auto-build-btn");
    if (buildBtn) buildBtn.onclick = async () => {
      buildBtn.disabled = true;
      await scheduleAutoRefreshPreview();
      buildBtn.disabled = false;
      const title = document.querySelector("#sch-auto-overlay .sch-auto-head-title");
      // ICON_SPARK는 SVG HTML 문자열이므로 textContent에 넣으면 SVG 소스가 그대로 화면에 노출된다.
      // 제목 전체를 HTML로 다시 그려 아이콘은 실제 SVG로 렌더링한다.
      if (title) {
        title.innerHTML = `자동 배치 미리보기 · ${esc(scheduleMonthLabel())}<button type="button" class="sch-auto-info-btn" id="sch-auto-info-btn" aria-label="배치 조건 안내" title="배치 조건 안내">?</button>`;
        const newInfoBtn = title.querySelector("#sch-auto-info-btn");
        const infoCard = document.getElementById("sch-auto-info-card");
        if (newInfoBtn && infoCard) {
          newInfoBtn.onclick = (e) => {
            e.stopPropagation();
            infoCard.hidden = !infoCard.hidden;
          };
        }
      }
      if (buildBtn) buildBtn.style.display = "none";
      const actions = document.querySelector("#sch-auto-overlay .sch-preview-actions");
      if (actions && !document.getElementById("sch-auto-apply-btn")) {
        const applyBtn = document.createElement("button");
        applyBtn.type = "button";
        applyBtn.className = "primary-btn";
        applyBtn.id = "sch-auto-apply-btn";
        applyBtn.textContent = "이대로 입력";
        applyBtn.disabled = !scheduleAutoPlan || scheduleAutoPlan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0) === 0;
        applyBtn.onclick = () => scheduleAutoApplyPlan(scheduleAutoPlan);
        actions.appendChild(applyBtn);
      }
    };
    // 조건 체크리스트 접기/펼치기: 미리보기를 다시 그릴 때도(배치 재실행 등) 접힌 상태가
    // 유지되도록 상태를 모듈 변수(scheduleAutoChecklistCollapsed)에 저장해둔다.
    overlay.addEventListener("click", (e) => {
      const toggle = e.target && e.target.closest ? e.target.closest(".sch-auto-checklist-toggle") : null;
      if (!toggle) return;
      const box = toggle.closest(".sch-auto-checklist");
      if (!box) return;
      scheduleAutoChecklistCollapsed = !scheduleAutoChecklistCollapsed;
      box.classList.toggle("sch-auto-checklist--collapsed", scheduleAutoChecklistCollapsed);
      toggle.setAttribute("aria-expanded", scheduleAutoChecklistCollapsed ? "false" : "true");
      const caret = toggle.querySelector(".sch-auto-checklist-caret");
      if (caret) caret.textContent = scheduleAutoChecklistCollapsed ? "▸" : "▾";
    });
    overlay.addEventListener("change", (e) => {
      const input = e.target && e.target.closest ? e.target.closest("[data-auto-min-working]") : null;
      if (!input) return;
      const key = input.getAttribute("data-auto-min-working");
      const value = Math.max(0, Math.min(99, Math.floor(Number(input.value) || 0)));
      input.value = String(value);
      scheduleAutoMinWorkingByGroup[key] = value;
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    // 배치 조건: "인원별 설정"을 누르면 팝업이 바로 뜬다(마지막으로 본 탭을 기억).
    const settingsBtn = document.getElementById("sch-auto-settings-btn");
    if (settingsBtn) {
      settingsBtn.onclick = () => openScheduleAutoSettingsPopup(scheduleAutoSettingsLastKind);
    }
    overlay.addEventListener("change", (e) => {
      const sel = e.target && e.target.closest ? e.target.closest("[data-auto-exclude-select]") : null;
      if (!sel || !sel.value) return;
      scheduleAutoSetExcluded(sel.value, true);
      scheduleAutoRefreshExcludeArea();
      // 미리보기 생성 후 제외 인원을 추가한 경우에도 기존 계획을 폐기하고
      // 제외 조건을 반영해 계획/미리보기를 즉시 다시 계산한다.
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    overlay.addEventListener("click", (e) => {
      const rm = e.target && e.target.closest ? e.target.closest("[data-auto-exclude-remove]") : null;
      if (!rm) return;
      scheduleAutoSetExcluded(rm.getAttribute("data-auto-exclude-remove"), false);
      scheduleAutoRefreshExcludeArea();
      // 미리보기 생성 후 제외를 해제한 경우에도 변경된 조건을 즉시 반영한다.
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    // 미리보기 표를 팝업 폭에 맞추고, 스크롤바가 생기거나 창 크기가 바뀌어 폭이 달라져도 다시 맞춘다.
    scheduleAutoFitPreview();
    const previewArea = document.getElementById("sch-auto-preview-area");
    if (previewArea && typeof ResizeObserver !== "undefined") {
      let lastW = 0;
      scheduleAutoFitObserver = new ResizeObserver((entries) => {
        const w = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
        if (Math.abs(w - lastW) < 1) return;
        lastW = w;
        scheduleAutoFitPreview();
      });
      scheduleAutoFitObserver.observe(previewArea);
    }
    setTimeout(() => document.addEventListener("keydown", scheduleAutoEscHandler, true), 0);
  }

  /* ===================== 홈 카드 배치(드래그로 순서 변경) =====================
     사용자가 카드를 원하는 위치로 옮기면 그 배치를 계정별로 저장해서 다음에
     들어와도 유지되게 한다. 계정 데이터라 클라우드 동기화 대상에도 자동으로
     포함된다(CLOUD_EXCLUDED_KEYS에 없는 키라서). */
  const HOME_LAYOUT_KEY = acctKey("home:card-layout");
  const HOME_CARD_IDS = ["status", "calendar", "interviews", "todos", "notes", "qa"];
  function defaultHomeLayout() {
    return [["status", "qa"], ["calendar", "interviews"], ["todos", "notes"]];
  }
  function loadHomeLayout() {
    try {
      const raw = localStorage.getItem(HOME_LAYOUT_KEY);
      if (!raw) return defaultHomeLayout();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return defaultHomeLayout();
      const cleaned = parsed.map((col) => (Array.isArray(col) ? col.filter((id) => HOME_CARD_IDS.includes(id)) : []));
      const flat = cleaned.flat();
      const missing = HOME_CARD_IDS.filter((id) => !flat.includes(id));
      if (missing.length) cleaned[0] = (cleaned[0] || []).concat(missing); // 새로 생긴 카드 종류는 첫 칸에 추가
      while (cleaned.length < 3) cleaned.push([]);
      return cleaned;
    } catch (e) { return defaultHomeLayout(); }
  }
  function saveHomeLayout(layout) {
    try { localStorage.setItem(HOME_LAYOUT_KEY, JSON.stringify(layout)); } catch (e) {}
  }
  function bindHomeCardDrag(grid) {
    if (!grid) return;
    grid.querySelectorAll("[data-drag-handle]").forEach((handle) => {
      handle.addEventListener("pointerdown", (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        const card = handle.closest(".card[data-home-card]");
        if (!card) return;
        e.preventDefault();
        const rect = card.getBoundingClientRect();
        const offsetX = e.clientX - rect.left, offsetY = e.clientY - rect.top;
        // 진입 애니메이션(opacity 0→1, forwards)을 끄면 카드가 애니메이션 시작 전 값인
        // opacity:0으로 되돌아가버려서 드래그 중 안 보이게 된다. 애니메이션은 끄되
        // opacity는 명시적으로 1로 고정해서 카드가 계속 보이게 한다.
        card.style.animation = "none";
        card.style.opacity = "1";
        const placeholder = document.createElement("div");
        placeholder.className = "home-card-placeholder";
        placeholder.style.height = rect.height + "px";
        card.parentNode.insertBefore(placeholder, card.nextSibling);
        card.classList.add("dragging");
        Object.assign(card.style, {
          position: "fixed", width: rect.width + "px", left: rect.left + "px", top: rect.top + "px", zIndex: 500,
        });
        document.body.classList.add("home-card-drag-active");

        function onMove(ev) {
          card.style.left = (ev.clientX - offsetX) + "px";
          card.style.top = (ev.clientY - offsetY) + "px";
          card.style.pointerEvents = "none";
          const elUnder = document.elementFromPoint(ev.clientX, ev.clientY);
          card.style.pointerEvents = "";
          if (!elUnder) return;
          const overCard = elUnder.closest(".card[data-home-card]");
          const overCol = elUnder.closest(".home-col");
          if (overCard && overCard !== card) {
            const rectOver = overCard.getBoundingClientRect();
            const before = (ev.clientY - rectOver.top) < rectOver.height / 2;
            overCard.parentNode.insertBefore(placeholder, before ? overCard : overCard.nextSibling);
          } else if (overCol && !overCard) {
            overCol.appendChild(placeholder);
          }
        }
        function onUp() {
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          document.body.classList.remove("home-card-drag-active");
          placeholder.parentNode.insertBefore(card, placeholder);
          placeholder.remove();
          card.classList.remove("dragging");
          Object.assign(card.style, { position: "", width: "", left: "", top: "", zIndex: "" });
          const newLayout = Array.from(grid.querySelectorAll(".home-col")).map((col) =>
            Array.from(col.querySelectorAll(".card[data-home-card]")).map((c) => c.getAttribute("data-home-card"))
          );
          saveHomeLayout(newLayout);
        }
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp, { once: true });
      });
    });
  }

  function renderHomePage(root) {
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    const iso = todayISO();
    const holiday = getHoliday(iso);
    const wd = WEEKDAYS[today.getDay()];

    /* ---- 오늘 근무 현황 (월별 스케줄 데이터 기준) ---- */
    const staffList = getStaffListForMonth(y, m).filter((s) => !s.isAdmin);
    const dateKey = scheduleDateKey(y, m, d);
    const staffToday = staffList.map((s) => {
      const record = getScheduleRecord(s.id, dateKey);
      return Object.assign({}, s, { record });
    });
    const working = staffToday.filter((s) => scheduleCountsAsWorked(s.record));
    const lateList = working.filter((s) => s.record.attendance === "LATE");
    const absentList = staffToday.filter((s) => s.record.status === "WORK" && s.record.attendance === "ABSENT");
    const offList = staffToday.filter((s) => s.record.status !== "WORK");
    const dayWorking = sortStaffByType(working.filter((s) => s.group !== "night"));
    const nightWorking = sortStaffByType(working.filter((s) => s.group === "night"));

    function staffRowHtml(s) {
      const flags = [];
      if (s.record.attendance === "LATE") flags.push('<span class="flag late">지각</span>');
      if (s.record.attendance === "ABSENT") flags.push('<span class="flag absent">결근</span>');
      if (s.record.status !== "WORK") {
        const meta = SCHEDULE_STATUS_META[s.record.status];
        flags.push(`<span class="flag off">${esc(meta ? meta.label : "휴무")}</span>`);
      }
      const typeBadges = renderWorkTypeBadges(s.types, "sm");
      const ldapText = s.nickname && s.nickname !== s.name ? s.nickname : "";
      return `
        <div class="home-staff-row ${s.record.status !== "WORK" ? "is-off" : ""}">
          <span class="name">${esc(s.name)}</span>
          ${ldapText ? `<span class="ldap">${esc(ldapText)}</span>` : ""}
          ${typeBadges}
          <span class="spacer"></span>
          ${flags.join("")}
        </div>`;
    }

    let scheduleSectionHtml;
    if (staffList.length === 0) {
      scheduleSectionHtml = `<div class="home-empty">등록된 상담사가 없어요.<br>"상담사 관리"에서 추가해보세요.</div>`;
    } else {
      const parts = [];
      if (dayWorking.length) parts.push(`<div class="staff-group-label">${ICON_SUN} 주간 근무 (${dayWorking.length}명)</div><div class="home-staff-list">${dayWorking.map(staffRowHtml).join("")}</div>`);
      if (nightWorking.length) parts.push(`<div class="staff-group-label">${ICON_MOON} 야간 근무 (${nightWorking.length}명)</div><div class="home-staff-list">${nightWorking.map(staffRowHtml).join("")}</div>`);
      if (absentList.length) parts.push(`<div class="staff-group-label">결근</div><div class="home-staff-list">${absentList.map(staffRowHtml).join("")}</div>`);
      if (parts.length === 0) parts.push(`<div class="home-empty">오늘 근무 인원이 없어요.</div>`);
      scheduleSectionHtml = parts.join("");
    }

    /* ---- 오늘 일정 (캘린더) ---- */
    const todayEntries = sortEntries(readMonthRaw(y, m)[pad2(d)] || []);
    const entriesHtml = todayEntries.length === 0
      ? `<div class="home-empty">오늘 등록된 일정이 없어요.</div>`
      : `<div class="home-entry-list">${todayEntries.map((e) => `
        <div class="home-entry-row ${e.type === "event" ? "event" : ""}">
          ${e.priority && !e.done ? '<span class="star">★</span>' : ""}
          ${e.time ? `<span class="time">${esc(e.time)}</span>` : ""}
          <span class="text" style="${e.done ? "text-decoration:line-through;color:var(--text-faint);" : ""}">${esc(e.text)}</span>
        </div>`).join("")}</div>`;

    /* ---- 할 일: 오늘 마감이거나 이미 지난 할 일 ---- */
    const todoRelevant = todos
      .filter((t) => !t.done && (!t.due || t.due <= iso))
      .sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    const remainingCount = todos.filter((t) => !t.done).length;
    const todoHtml = todoRelevant.length === 0
      ? `<div class="home-empty">오늘까지 마감인 할 일이 없어요.</div>`
      : `<div class="home-todo-list">${todoRelevant.slice(0, 6).map((t) => {
          const isOver = t.due && t.due < iso;
          return `<div class="home-todo-row">
            <button type="button" class="check-btn" data-home-todo-toggle="${t.id}" aria-label="완료 표시"></button>
            <span>${esc(t.text)}</span>
            ${t.due ? `<span class="due ${isOver ? "over" : ""}">${formatTodoDue(t.due)}${isOver ? " · 지남" : " · 오늘"}</span>` : ""}
          </div>`;
        }).join("")}</div>`;

    /* ---- 고정 메모 ---- */
    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);
    const notesHtml = pinnedNotes.length === 0
      ? `<div class="home-empty">고정된 메모가 없어요.</div>`
      : `<div class="home-note-list">${pinnedNotes.slice(0, 5).map((n) => `
          <div class="home-note-row" data-note-nav="notes">
            <div>${esc(n.title)}</div>
            ${n.content ? `<div class="snippet">${esc(n.content)}</div>` : ""}
          </div>`).join("")}</div>`;

    const totalAgents = agentsData.filter((a) => a.status !== "RESIGNED").length;

    /* ---- 장기 미면담 상담사 (최근 3주 = 21일 이내 면담 기록이 없는 경우) ---- */
    const NO_INTERVIEW_DAYS = 21;
    const activeAgents = agentsData.filter((a) => a.status !== "RESIGNED" && !a.isAdmin);
    const staleInterviewAgents = activeAgents.map((a) => {
      const records = interviewsData.filter((r) => r.agentId === a.id && r.date);
      const lastDate = records.length ? records.map((r) => r.date).sort().slice(-1)[0] : null;
      return { agent: a, lastDate };
    }).filter((x) => !x.lastDate || x.lastDate < addDaysISO(iso, -NO_INTERVIEW_DAYS))
      .sort((x, y) => (x.lastDate || "").localeCompare(y.lastDate || ""));
    const INTERVIEW_ALERT_VISIBLE = 5;
    const interviewAlertHasMore = staleInterviewAgents.length > INTERVIEW_ALERT_VISIBLE;
    const interviewAlertShown = homeUi.interviewAlertExpanded
      ? staleInterviewAgents
      : staleInterviewAgents.slice(0, INTERVIEW_ALERT_VISIBLE);
    const staleInterviewHtml = staleInterviewAgents.length === 0
      ? `<div class="home-empty">최근 ${NO_INTERVIEW_DAYS}일 내 면담 기록이 없는 상담사가 없어요.</div>`
      : `<div class="home-staff-list">${interviewAlertShown.map((x) => `
          <div class="home-staff-row">
            <span class="name">${esc(x.agent.name)}</span>
            <span class="spacer"></span>
            <span class="flag late">${x.lastDate ? `마지막 면담 ${x.lastDate}` : "면담 기록 없음"}</span>
          </div>`).join("")}</div>${interviewAlertHasMore ? `
          <button class="home-more-btn" id="btn-interview-alert-toggle" type="button">
            ${homeUi.interviewAlertExpanded ? "접기 ▲" : `전체 ${staleInterviewAgents.length}명 보기 ▾`}
          </button>` : ""}`;

    /* ---- QA(품질 관리) 전체 평균 점수 ----
       이번 달 점수가 아직 입력 안 된 경우가 많으므로(달이 막 바뀐 시점 등),
       이번 달부터 거꾸로 훑어서 점수가 입력된 가장 최근 달을 찾아 보여준다. */
    const qaAgentsList = qaWorkingAgents(y, m);
    const qaLatest = qaHomeFindLatestMonthWithData(qaAgentsList, y, m);
    let qaSummaryHtml;
    if (!qaLatest) {
      qaSummaryHtml = `<div class="home-empty">최근 QA 점수가 아직 없어요.</div>`;
    } else {
      const qaPrevYm = qaPrevMonth(qaLatest.year, qaLatest.monthIndex);
      const qaStatsPrev = qaComputeStats(qaAgentsList, qaPrevYm.year, qaPrevYm.monthIndex);
      const qaHomeDiff = qaStatDiff(qaLatest.stats.total, qaStatsPrev.total);
      const qaHomeDiffHtml = qaHomeDiff ? ` <span class="qa-stat-diff ${qaHomeDiff.cls}">${qaHomeDiff.sign} ${qaHomeDiff.abs.toFixed(1)}</span>` : "";
      const qaIsCurrentMonth = qaLatest.year === y && qaLatest.monthIndex === m;
      qaSummaryHtml = `<div class="home-qa-summary">
          <div class="home-qa-score">${qaLatest.stats.total.toFixed(1)}<span class="home-qa-score-unit">점</span></div>
          <div class="home-qa-sub">${qaIsCurrentMonth ? "" : `${qaLatest.year}년 `}${qaLatest.monthIndex + 1}월 전체 평균${qaHomeDiffHtml}</div>
        </div>`;
    }
    const qaHomeTrendHtml = qaHomeTrendSvgHtml(qaAgentsList, y, m);
    if (qaHomeTrendHtml) qaSummaryHtml += qaHomeTrendHtml;

    /* ---- 카드별 제목/링크/내용 정의 → 저장된 배치 순서대로 조립 ---- */
    const cardMeta = {
      status: { icon: ICON_USERS, label: "오늘 근무 현황", link: { nav: "schedule", label: "스케줄 보기 ›" }, content: scheduleSectionHtml },
      calendar: { icon: ICON_CALENDAR, label: "오늘 일정", link: { nav: "calendar", label: "캘린더 보기 ›" }, content: entriesHtml },
      interviews: { icon: ICON_BELL, label: "면담 필요 알림", link: { nav: "interviews", label: "면담일지 보기 ›" }, content: staleInterviewHtml },
      todos: { icon: ICON_CHECK, label: "할 일", link: null, content: todoHtml },
      notes: { icon: ICON_PIN, label: "고정 메모", link: { nav: "notes", label: "업무 정리 보기 ›" }, content: notesHtml },
      qa: { icon: ICON_QA, label: "QA 평균 점수", link: { nav: "qa", label: "품질 관리 보기 ›" }, content: qaSummaryHtml },
    };
    function cardHtml(id) {
      const meta = cardMeta[id];
      if (!meta) return "";
      const linkHtml = meta.link ? `<button class="home-section-link" data-nav="${meta.link.nav}">${meta.link.label}</button>` : "";
      return `
        <div class="card" data-home-card="${id}">
          <button type="button" class="home-card-draghandle" data-drag-handle title="드래그해서 순서 바꾸기" aria-label="카드 위치 이동">${ICON_DRAG_HANDLE}</button>
          <div class="home-section-title"><h3>${meta.icon} ${meta.label}</h3>${linkHtml}</div>
          ${meta.content}
        </div>`;
    }
    const homeLayout = loadHomeLayout();
    const homeColumnsHtml = homeLayout.map((colIds, i) => `<div class="home-col" data-home-col="${i}">${colIds.map(cardHtml).join("")}</div>`).join("");

    root.innerHTML = `
      <div class="card home-hero">
        <div class="home-hero-top">
          <div>
            <div class="home-hero-date">${m + 1}월 ${d}일 <span class="wd">${wd}요일</span></div>
            <div class="home-hero-sub">오늘 하루를 한눈에 확인해보세요</div>
          </div>
          ${holiday ? `<span class="home-holiday-tag">${esc(holiday)}</span>` : ""}
        </div>
        <div class="stat-grid">
          <div class="stat-item ok"><div class="stat-num">${working.length}</div><div class="stat-label">오늘 근무</div></div>
          <div class="stat-item warn"><div class="stat-num">${lateList.length + absentList.length}</div><div class="stat-label">지각·결근</div></div>
          <div class="stat-item"><div class="stat-num">${offList.length}</div><div class="stat-label">휴무·연차 등</div></div>
          <div class="stat-item accent"><div class="stat-num">${remainingCount}</div><div class="stat-label">남은 할 일</div></div>
          <div class="stat-item"><div class="stat-num">${totalAgents}</div><div class="stat-label">전체 상담사</div></div>
        </div>
      </div>

      <div class="home-grid" id="home-card-grid" style="margin-top:20px;">${homeColumnsHtml}</div>
    `;

    root.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.onclick = () => setPage(btn.getAttribute("data-nav"));
    });
    root.querySelectorAll("[data-note-nav]").forEach((el) => {
      el.onclick = () => setPage(el.getAttribute("data-note-nav"));
    });
    const interviewAlertToggleBtn = document.getElementById("btn-interview-alert-toggle");
    if (interviewAlertToggleBtn) {
      interviewAlertToggleBtn.onclick = () => {
        homeUi.interviewAlertExpanded = !homeUi.interviewAlertExpanded;
        renderHomePage(root);
      };
    }
    root.querySelectorAll("[data-home-todo-toggle]").forEach((btn) => {
      btn.onclick = () => {
        toggleTodoDone(btn.getAttribute("data-home-todo-toggle"));
        renderHomePage(root);
      };
    });
    bindHomeCardDrag(document.getElementById("home-card-grid"));
  }

  /* ===================== 오늘의 브리핑 히어로 팝업 =====================
     로그인 직후 한 번, 홈 화면 위에 "오늘 확인해야 할 것들"을 요약한 카드가
     애니메이션과 함께 떠오른다. 항목을 누르면 해당 페이지로 이동하면서 닫힌다. */
  function computeTodayBrief() {
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    const iso = todayISO();
    const holiday = getHoliday(iso);
    const wd = WEEKDAYS[today.getDay()];

    const staffList = getStaffListForMonth(y, m).filter((s) => !s.isAdmin);
    const dateKey = scheduleDateKey(y, m, d);
    const staffToday = staffList.map((s) => Object.assign({}, s, { record: getScheduleRecord(s.id, dateKey) }));
    const working = staffToday.filter((s) => scheduleCountsAsWorked(s.record));
    const lateList = working.filter((s) => s.record.attendance === "LATE");
    const absentList = staffToday.filter((s) => s.record.status === "WORK" && s.record.attendance === "ABSENT");

    const todayEntries = sortEntries(readMonthRaw(y, m)[pad2(d)] || []);

    const todoRelevant = todos
      .filter((t) => !t.done && (!t.due || t.due <= iso))
      .sort((a, b) => (a.due || "").localeCompare(b.due || ""));

    const NO_INTERVIEW_DAYS = 21;
    const activeAgents = agentsData.filter((a) => a.status !== "RESIGNED" && !a.isAdmin);
    const staleInterviewAgents = activeAgents
      .map((a) => {
        const records = interviewsData.filter((r) => r.agentId === a.id && r.date);
        const lastDate = records.length ? records.map((r) => r.date).sort().slice(-1)[0] : null;
        return { agent: a, lastDate };
      })
      .filter((x) => !x.lastDate || x.lastDate < addDaysISO(iso, -NO_INTERVIEW_DAYS));

    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);

    return { y, m, d, wd, holiday, staffList, working, lateList, absentList, todayEntries, todoRelevant, staleInterviewAgents, pinnedNotes };
  }

  function todayBriefRowsHtml(brief) {
    const rows = [];
    if (brief.staffList.length > 0) {
      const troubleCount = brief.lateList.length + brief.absentList.length;
      rows.push({
        nav: "schedule",
        warn: troubleCount > 0,
        icon: ICON_USERS,
        title: `오늘 근무 ${brief.working.length}명`,
        sub: troubleCount > 0 ? `지각 ${brief.lateList.length}명 · 결근 ${brief.absentList.length}명 확인해주세요` : "지각·결근 없이 순조로워요",
      });
    }
    if (brief.todayEntries.length > 0) {
      const first = brief.todayEntries[0];
      rows.push({
        nav: "calendar",
        warn: false,
        icon: ICON_CALENDAR,
        title: `오늘 일정 ${brief.todayEntries.length}건`,
        sub: first.text ? esc(first.text) : "캘린더에서 자세히 확인해보세요",
      });
    }
    if (brief.staleInterviewAgents.length > 0) {
      rows.push({
        nav: "interviews",
        warn: true,
        icon: ICON_BELL,
        title: `면담 필요 상담사 ${brief.staleInterviewAgents.length}명`,
        sub: "최근 21일간 면담 기록이 없어요",
      });
    }
    if (brief.pinnedNotes.length > 0) {
      rows.push({
        nav: "notes",
        warn: false,
        icon: ICON_PIN,
        title: `고정 메모 ${brief.pinnedNotes.length}개`,
        sub: esc(brief.pinnedNotes[0].title || ""),
      });
    }
    return rows;
  }

  const TODAY_BRIEF_TODO_VISIBLE = 5;
  function todayBriefTodoHtml(brief) {
    const iso = todayISO();
    const list = brief.todoRelevant;
    if (list.length === 0) return "";
    const shown = list.slice(0, TODAY_BRIEF_TODO_VISIBLE);
    const moreCount = list.length - shown.length;
    return `
      <div class="today-brief-section">
        <div class="today-brief-section-title">${ICON_CHECK} 오늘 할 일 <span>${list.length}개</span></div>
        <div class="today-brief-todo-list">
          ${shown.map((t) => {
            const isOver = !!t.due && t.due < iso;
            return `
              <div class="today-brief-todo-item" data-brief-todo-id="${t.id}">
                <button type="button" class="check-btn" data-brief-todo-toggle="${t.id}" aria-label="완료 표시"></button>
                <span class="todo-text">${esc(t.text)}</span>
                ${t.due ? `<span class="todo-due ${isOver ? "over" : "today"}">${formatTodoDue(t.due)}${isOver ? " · 지남" : ""}</span>` : ""}
              </div>`;
          }).join("")}
        </div>
        ${moreCount > 0 ? `<button type="button" class="today-brief-more" data-brief-nav="calendar">외 ${moreCount}개 더보기 ›</button>` : ""}
      </div>
    `;
  }

  let todayBriefKeyHandler = null;
  function closeTodayBriefPopup() {
    const overlay = document.getElementById("today-brief-overlay");
    if (!overlay) return;
    if (todayBriefKeyHandler) { document.removeEventListener("keydown", todayBriefKeyHandler); todayBriefKeyHandler = null; }
    overlay.classList.add("closing");
    setTimeout(() => overlay.remove(), 200);
  }
  function todayBriefCardHtml(brief, rows) {
    const hasTodo = brief.todoRelevant.length > 0;
    return `
      <div class="today-brief-card" role="dialog" aria-modal="true" aria-label="오늘의 브리핑">
        <button type="button" class="today-brief-close" id="today-brief-close" aria-label="닫기">${ICON_CLOSE_SM}</button>
        <div class="today-brief-head">
          <div class="today-brief-badge">${ICON_SUN} 오늘의 브리핑</div>
          <div class="today-brief-date">${brief.y}년 ${brief.m + 1}월 ${brief.d}일 <span class="wd">${brief.wd}요일</span></div>
          ${brief.holiday ? `<span class="today-brief-holiday">${esc(brief.holiday)}</span>` : ""}
        </div>
        ${(rows.length === 0 && !hasTodo) ? `
          <div class="today-brief-empty">${ICON_CHECK} 오늘은 특별히 챙길 일이 없어요.<br>편하게 하루를 시작해보세요.</div>
        ` : `
          ${hasTodo ? todayBriefTodoHtml(brief) : ""}
          ${rows.length > 0 ? `
            <div class="today-brief-rows">
              ${rows.map((r, i) => `
                <button type="button" class="today-brief-row ${r.warn ? "warn" : ""}" data-brief-nav="${r.nav}" style="animation-delay:${80 + i * 55}ms">
                  <span class="today-brief-row-icon">${r.icon}</span>
                  <span class="today-brief-row-text">
                    <b>${esc(r.title)}</b>
                    <span>${r.sub}</span>
                  </span>
                  ${ICON_CHEVRON_RIGHT}
                </button>
              `).join("")}
            </div>
          ` : ""}
        `}
        <button type="button" class="today-brief-cta" id="today-brief-cta">확인했어요, 시작할게요</button>
      </div>
    `;
  }
  function bindTodayBriefEvents(overlay) {
    document.getElementById("today-brief-close").onclick = () => closeTodayBriefPopup();
    document.getElementById("today-brief-cta").onclick = () => closeTodayBriefPopup();
    overlay.querySelectorAll("[data-brief-nav]").forEach((btn) => {
      btn.onclick = () => { closeTodayBriefPopup(); setPage(btn.getAttribute("data-brief-nav")); };
    });
    overlay.querySelectorAll("[data-brief-todo-toggle]").forEach((btn) => {
      btn.onclick = () => {
        toggleTodoDone(btn.getAttribute("data-brief-todo-toggle"));
        refreshTodayBriefPopup();
        if (state.page === "home" || state.page === "calendar") renderApp();
      };
    });
  }
  function refreshTodayBriefPopup() {
    const overlay = document.getElementById("today-brief-overlay");
    if (!overlay) return;
    const brief = computeTodayBrief();
    const rows = todayBriefRowsHtml(brief);
    overlay.innerHTML = todayBriefCardHtml(brief, rows);
    bindTodayBriefEvents(overlay);
  }
  function showTodayBriefPopup() {
    if (document.getElementById("today-brief-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "today-brief-overlay";
    overlay.className = "today-brief-overlay";
    document.body.appendChild(overlay);
    refreshTodayBriefPopup();
    overlay.onclick = (e) => { if (e.target === overlay) closeTodayBriefPopup(); };
    todayBriefKeyHandler = (e) => { if (e.key === "Escape") closeTodayBriefPopup(); };
    document.addEventListener("keydown", todayBriefKeyHandler);
  }

  /* ===================== 월마감 확인 팝업 =====================
     달이 바뀌면(예: 9월이 지나 10월이 되면), 방금 지나간 달(9월)의 "최종 스케줄 확정 /
     품질 관리 확정"을 마쳤는지 로그인할 때마다 확인시켜주는 팝업.
     - 최종 스케줄 확정 = 월별 스케줄에서 그 달을 잠금(scheduleIsMonthLocked)
     - 품질 관리 확정  = 품질 관리(QA)에서 그 달을 잠금(qaIsMonthLocked)
     두 항목 모두 매번 그 자리에서 실시간으로(잠금 여부를 직접) 확인하기 때문에,
     확정했다가 수정하려고 다시 풀고 나중에 또 잠그면 자연스럽게 다시 "완료" 상태가
     되어 팝업이 뜨지 않는다 — 별도로 "한 번 확정한 적 있음" 같은 상태를 저장해두지
     않는다. "앞으로 뜨지 않음"만 그 달 단위로 저장해서, 체크해두면 다시 풀었다
     잠가도(또는 아예 안 잠가도) 그 달에 대해서는 로그인해도 더 이상 뜨지 않는다. */
  const MONTH_CLOSE_KEY = acctKey("personal-monthclose:data");
  function loadMonthCloseData() {
    try {
      const raw = localStorage.getItem(MONTH_CLOSE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === "object") {
        if (!parsed.dismissed || typeof parsed.dismissed !== "object") parsed.dismissed = {};
        return parsed;
      }
    } catch (e) {}
    return { dismissed: {} };
  }
  let monthCloseData = loadMonthCloseData();
  function saveMonthCloseData() {
    try { localStorage.setItem(MONTH_CLOSE_KEY, JSON.stringify(monthCloseData)); } catch (e) {}
  }
  // "마감 확인"의 대상이 되는 달 = 오늘이 속한 달의 바로 전 달(=방금 지나간 달).
  function monthCloseTargetMonth() {
    const d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  }
  function monthCloseKeyStr(year, monthIndex) { return `${year}-${pad2(monthIndex + 1)}`; }
  function monthCloseStatus() {
    const { year, monthIndex } = monthCloseTargetMonth();
    const key = monthCloseKeyStr(year, monthIndex);
    const scheduleDone = scheduleIsMonthLocked(year, monthIndex);
    const qaDone = qaIsMonthLocked(year, monthIndex);
    return {
      year, monthIndex, key, scheduleDone, qaDone,
      allDone: scheduleDone && qaDone,
      dismissed: !!monthCloseData.dismissed[key],
    };
  }
  function shouldShowMonthClosePopup() {
    const s = monthCloseStatus();
    return !s.allDone && !s.dismissed;
  }
  function setMonthCloseDismissed(flag) {
    const s = monthCloseStatus();
    if (flag) monthCloseData.dismissed[s.key] = true;
    else delete monthCloseData.dismissed[s.key];
    saveMonthCloseData();
  }

  let monthCloseKeyHandler = null;
  function closeMonthClosePopup() {
    const overlay = document.getElementById("month-close-overlay");
    if (!overlay) return;
    if (monthCloseKeyHandler) { document.removeEventListener("keydown", monthCloseKeyHandler); monthCloseKeyHandler = null; }
    overlay.classList.add("closing");
    setTimeout(() => overlay.remove(), 200);
  }
  function monthCloseRowsHtml(s) {
    const rows = [
      {
        done: s.scheduleDone, icon: ICON_CLIPBOARD, nav: "schedule",
        title: "최종 스케줄 확정",
        sub: s.scheduleDone ? "확정(잠금) 완료" : "이 달 스케줄을 확정(잠금)해주세요",
      },
      {
        done: s.qaDone, icon: ICON_QA, nav: "qa",
        title: "품질 관리 확정",
        sub: s.qaDone ? "확정(잠금) 완료" : "이 달 QA 점수를 확정(잠금)해주세요",
      },
    ];
    return rows.map((r, i) => `
      <button type="button" class="today-brief-row month-close-row ${r.done ? "done" : ""}" data-monthclose-nav="${r.nav}" style="animation-delay:${80 + i * 55}ms">
        <span class="today-brief-row-icon">${r.done ? ICON_CHECK : r.icon}</span>
        <span class="today-brief-row-text">
          <b>${esc(r.title)}</b>
          <span>${esc(r.sub)}</span>
        </span>
        ${ICON_CHEVRON_RIGHT}
      </button>
    `).join("");
  }
  function monthCloseCardHtml(s) {
    return `
      <div class="today-brief-card month-close-card" role="dialog" aria-modal="true" aria-label="월마감 확인">
        <button type="button" class="today-brief-close" id="month-close-close" aria-label="닫기">${ICON_CLOSE_SM}</button>
        <div class="today-brief-head">
          <div class="today-brief-badge">${ICON_CLIPBOARD} 월마감 확인</div>
          <div class="today-brief-date">${s.year}년 ${s.monthIndex + 1}월 마감</div>
        </div>
        <div class="today-brief-rows month-close-rows">
          ${monthCloseRowsHtml(s)}
        </div>
        <label class="month-close-dismiss-row" for="month-close-dismiss-checkbox">
          <input type="checkbox" id="month-close-dismiss-checkbox" ${s.dismissed ? "checked" : ""}>
          <span>앞으로 뜨지 않음</span>
        </label>
        <button type="button" class="today-brief-cta" id="month-close-cta">확인했어요</button>
      </div>
    `;
  }
  function bindMonthCloseEvents(overlay) {
    document.getElementById("month-close-close").onclick = () => closeMonthClosePopup();
    document.getElementById("month-close-cta").onclick = () => closeMonthClosePopup();
    document.getElementById("month-close-dismiss-checkbox").onchange = (e) => {
      setMonthCloseDismissed(e.target.checked);
    };
    overlay.querySelectorAll("[data-monthclose-nav]").forEach((btn) => {
      btn.onclick = () => {
        const nav = btn.getAttribute("data-monthclose-nav");
        const s = monthCloseStatus();
        closeMonthClosePopup();
        if (nav === "schedule" || nav === "qa") setPage(nav, { year: s.year, monthIndex: s.monthIndex });
        else setPage(nav);
      };
    });
  }
  function showMonthClosePopup() {
    if (document.getElementById("month-close-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "month-close-overlay";
    overlay.className = "today-brief-overlay month-close-overlay";
    document.body.appendChild(overlay);
    overlay.innerHTML = monthCloseCardHtml(monthCloseStatus());
    bindMonthCloseEvents(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeMonthClosePopup(); };
    monthCloseKeyHandler = (e) => { if (e.key === "Escape") closeMonthClosePopup(); };
    document.addEventListener("keydown", monthCloseKeyHandler);
  }

  function renderNav() {
    const nav = document.getElementById("nav");
    nav.innerHTML = `
      ${!CURRENT_ACCOUNT_IS_MASTER ? `<div class="nav-label-top">메뉴</div>` : ""}
      <div class="nav-account">
        <span class="nav-account-name">${ICON_USER} <span class="nav-text">${esc(CURRENT_ACCOUNT_DISPLAY_NAME)}${CURRENT_ACCOUNT_IS_MASTER ? ' <span class="badge sm master">마스터</span>' : ""}</span></span>
        <div class="nav-logout-wrap">
          <button class="nav-logout-btn" id="nav-logout-btn" title="로그아웃">${ICON_LOGOUT}<span class="nav-text"> 로그아웃</span></button>
        </div>
      </div>
      <div class="nav-divider"></div>
      ${MASTER_ORIGIN_ACCOUNT ? `
        <div class="nav-master-banner">
          <span>${ICON_SHIELD} 마스터 계정</span>
          <button class="nav-master-return-btn" id="nav-master-return-btn" type="button">마스터로 복귀</button>
        </div>
      ` : ""}
      ${CURRENT_ACCOUNT_IS_MASTER ? `
        <div class="nav-master-mode">
          <span class="nav-master-mode-title">${ICON_SHIELD} 관리자 모드</span>
          <span class="nav-master-mode-sub">계정 관리 전용</span>
        </div>
      ` : `
        <button class="nav-btn ${state.page === "home" ? "active" : ""}" data-nav="home" title="홈">${NAV_ICON_HOME} <span class="nav-text">홈</span></button>
        <button class="nav-btn ${state.page === "calendar" ? "active" : ""}" data-nav="calendar" title="캘린더">${NAV_ICON_CALENDAR} <span class="nav-text">캘린더</span></button>
        <button class="nav-btn ${state.page === "agents" ? "active" : ""}" data-nav="agents" title="상담사 관리">${NAV_ICON_AGENTS} <span class="nav-text">상담사 관리</span></button>
        <button class="nav-btn ${state.page === "notes" ? "active" : ""}" data-nav="notes" title="업무 정리">${NAV_ICON_NOTES} <span class="nav-text">업무 정리</span></button>
        <button class="nav-btn ${state.page === "interviews" ? "active" : ""}" data-nav="interviews" title="면담일지">${NAV_ICON_INTERVIEWS} <span class="nav-text">면담일지</span></button>
        <button class="nav-btn ${state.page === "qa" ? "active" : ""}" data-nav="qa" title="품질 관리">${NAV_ICON_QA} <span class="nav-text">품질 관리</span></button>
        <button class="nav-btn ${state.page === "schedule" ? "active" : ""}" data-nav="schedule" title="월별 스케줄">${NAV_ICON_SCHEDULE} <span class="nav-text">월별 스케줄</span></button>
      `}
      <div class="nav-spacer"></div>
    `;
    renderSettingsToggle();
    renderUndoToggle();
    renderRefreshToggle();
    nav.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.onclick = () => { setPage(btn.getAttribute("data-nav")); closeDock(); };
    });
    const logoutBtn = document.getElementById("nav-logout-btn");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        if (window.confirm("로그아웃할까요?")) logout();
      };
    }
    const masterReturnBtn = document.getElementById("nav-master-return-btn");
    if (masterReturnBtn) {
      masterReturnBtn.onclick = () => masterReturnToOrigin();
    }
  }

  /* ===================== 마스터 계정: 계정 관리 페이지 ===================== */

  function renderMasterPage(root) {
    if (!CURRENT_ACCOUNT_IS_MASTER) { setPage("home"); return; }
    const uiState = {
      tab: "accounts", resettingId: null, renamingId: null, error: "", renameError: "",
      logAccountFilter: "all", expandedLogIds: new Set(),
      manageMembersId: null, memberError: "",
    };

    function draw() {
      root.innerHTML = `
        <div class="agent-list-header">
          <div class="agent-list-title">마스터 계정 관리</div>
        </div>
        <div class="login-tabs" style="max-width:420px; margin-bottom:16px;">
          <button type="button" class="login-tab ${uiState.tab === "accounts" ? "active" : ""}" data-master-tab="accounts">계정 관리</button>
          <button type="button" class="login-tab ${uiState.tab === "activity" ? "active" : ""}" data-master-tab="activity">활동 로그</button>
          <button type="button" class="login-tab ${uiState.tab === "notify" ? "active" : ""}" data-master-tab="notify">디스코드 알림</button>
        </div>
        <div id="master-tab-body"></div>
      `;
      root.querySelectorAll("[data-master-tab]").forEach((btn) => {
        btn.onclick = () => { uiState.tab = btn.getAttribute("data-master-tab"); draw(); };
      });
      const body = document.getElementById("master-tab-body");
      if (uiState.tab === "activity") drawActivityLog(body);
      else if (uiState.tab === "notify") drawNotifySettings(body);
      else drawAccounts(body);
    }

    // ----- 디스코드 알림 탭: 계정별로 디스코드 알림을 받을지 토글로 켜고 끈다 -----
    // 기본은 전부 "제한"이고, 허용으로 켠 계정에만 알림이 간다(여러 계정 동시 허용 가능).
    function drawNotifySettings(root) {
      const accounts = loadAccounts().slice().sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      const settings = loadDiscordNotifySettings();
      const rows = accounts.map((a) => {
        const allowed = settings[a.id] === true;
        return `
          <div class="agent-row master-account-row">
            <div class="agent-row-main" style="cursor:default;">
              <span class="agent-row-name">${esc(a.username)}${a.isMaster ? ' <span class="badge sm master">마스터</span>' : ""}</span>
              <span class="agent-row-ldap">${allowed ? "이 계정의 일정·할일 알림이 디스코드로 전송돼요." : "디스코드 알림이 제한되어 있어요."}</span>
            </div>
            <div class="agent-row-badges">
              <label class="notify-toggle">
                <input type="checkbox" data-notify-toggle="${a.id}" ${allowed ? "checked" : ""}>
                <span class="notify-toggle-track"><span class="notify-toggle-thumb"></span></span>
                <span class="notify-toggle-label">${allowed ? "허용" : "제한"}</span>
              </label>
            </div>
          </div>
        `;
      }).join("");
      const allowedCount = accounts.filter((a) => settings[a.id] === true).length;
      root.innerHTML = `
        <div class="agent-summary">
          디스코드 알림 웹훅은 이제 계정별로 켜고 끌 수 있어요. 기본값은 전부 "제한"이고, 여기서 "허용"으로 켠 계정의
          일정·할일만 디스코드로 알림이 가요(여러 계정을 동시에 허용해도 돼요). 지금 ${accounts.length}개 계정 중 ${allowedCount}개 허용 중.
        </div>
        <div class="status" id="notify-status"></div>
        <div class="agent-list">${rows || `<div class="agent-list-empty">등록된 계정이 없어요.</div>`}</div>
      `;
      const statusEl = document.getElementById("notify-status");
      function flash(msg) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ""; }, 2200);
      }
      root.querySelectorAll("[data-notify-toggle]").forEach((input) => {
        input.onchange = () => {
          const id = input.getAttribute("data-notify-toggle");
          const target = accounts.find((a) => a.id === id);
          const nextAllowed = input.checked;
          setDiscordNotifyAllowed(id, nextAllowed);
          draw();
          flash(`"${target ? target.username : ""}" 계정 알림을 ${nextAllowed ? "허용" : "제한"}으로 바꿨어요.`);
        };
      });
    }

    function drawAccounts(root) {
      const accounts = loadAccounts().slice().sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      const rows = accounts.map((a) => {
        const isSelf = a.id === CURRENT_ACCOUNT_ID;
        const created = a.createdAt ? esc(a.createdAt.slice(0, 10)) : "-";
        const isResetting = uiState.resettingId === a.id;
        const isRenaming = uiState.renamingId === a.id;
        const isTeam = a.accountType === "team";
        const isManagingMembers = uiState.manageMembersId === a.id;
        const members = isTeam && Array.isArray(a.teamMembers) ? a.teamMembers : [];
        return `
          <div class="agent-row master-account-row">
            <div class="agent-row-main" style="cursor:default;">
              <span class="agent-row-name">${esc(a.username)}${a.isMaster ? ' <span class="badge sm master">마스터</span>' : ""} <span class="badge sm type">${isTeam ? "팀용" : "개인용"}</span>${isSelf ? ' <span class="badge sm working">현재 로그인 중</span>' : ""}</span>
              <span class="agent-row-ldap">가입일 ${created}${isTeam ? ` · 로그인 인원 ${members.length}명` : ""}</span>
            </div>
            <div class="agent-row-badges">
              <button class="ghost-btn" data-action="master-type" data-id="${a.id}">${isTeam ? "개인용으로 전환" : "팀용으로 전환"}</button>
              ${isTeam ? `<button class="ghost-btn ${isManagingMembers ? "active" : ""}" data-action="master-members" data-id="${a.id}">${isManagingMembers ? "닫기" : "로그인 인원 관리"}</button>` : ""}
              <button class="ghost-btn ${isRenaming ? "active" : ""}" data-action="master-rename" data-id="${a.id}">${isRenaming ? "취소" : "이름 수정"}</button>
              <button class="ghost-btn ${isResetting ? "active" : ""}" data-action="master-reset" data-id="${a.id}">${isResetting ? "취소" : "비밀번호 초기화"}</button>
              <button class="ghost-btn" data-action="master-enter" data-id="${a.id}" ${isSelf ? "disabled" : ""}>이 계정으로 들어가기</button>
              <button class="ghost-btn danger" data-action="master-delete" data-id="${a.id}" ${isSelf ? "disabled" : ""}>삭제</button>
            </div>
            ${isRenaming ? `
              <form class="login-form master-rename-form" data-rename-form="${a.id}" style="width:100%; margin-top:10px;">
                <label class="login-field"><span>새 계정 이름</span>
                  <input class="add-input" id="rename-username-${a.id}" type="text" autocomplete="off" placeholder="계정 이름" value="${esc(a.username)}">
                </label>
                ${uiState.renameError ? `<div class="login-error">${esc(uiState.renameError)}</div>` : ""}
                <button type="submit" class="primary-btn login-submit">이름 저장</button>
              </form>
            ` : ""}
            ${isResetting ? `
              <form class="login-form master-reset-form" data-reset-form="${a.id}" style="width:100%; margin-top:10px;">
                <label class="login-field"><span>새 비밀번호</span>
                  <input class="add-input" id="reset-password-${a.id}" type="password" autocomplete="new-password" placeholder="비밀번호 (6자 이상)">
                </label>
                <label class="login-field"><span>새 비밀번호 확인</span>
                  <input class="add-input" id="reset-password2-${a.id}" type="password" autocomplete="new-password" placeholder="비밀번호 확인">
                </label>
                ${uiState.error ? `<div class="login-error">${esc(uiState.error)}</div>` : ""}
                <button type="submit" class="primary-btn login-submit">비밀번호 저장</button>
              </form>
            ` : ""}
            ${isTeam && isManagingMembers ? `
              <div class="master-members-panel">
                <div class="agent-row-ldap" style="margin-bottom:8px;">"${esc(a.username)}" 계정으로 로그인할 때 고를 수 있는 인원 목록이에요. 비밀번호는 계정 하나로 공통이고, 여기 인원은 이름표 용도예요.</div>
                <div class="master-members-list">
                  ${members.length ? members.map((m) => `
                    <span class="master-member-chip">${esc(m.name)}<button type="button" class="chip-remove" data-remove-member="${a.id}:${m.id}" title="삭제">×</button></span>
                  `).join("") : `<div class="agent-list-empty" style="padding:6px 0;">아직 등록된 인원이 없어요.</div>`}
                </div>
                <form class="master-member-form" data-member-form="${a.id}">
                  <input class="add-input" id="member-name-${a.id}" type="text" autocomplete="off" placeholder="추가할 인원 이름">
                  <button type="submit" class="primary-btn login-submit">추가</button>
                </form>
                ${uiState.memberError ? `<div class="login-error">${esc(uiState.memberError)}</div>` : ""}
              </div>
            ` : ""}
          </div>
        `;
      }).join("");
      root.innerHTML = `
        <div class="agent-summary">마스터 계정으로 다른 계정을 선택해서 들어가보거나, 비밀번호를 초기화하거나, 필요 없는 계정을 삭제할 수 있어요. 총 ${accounts.length}개 계정.</div>
        <div class="status" id="master-status"></div>
        <div class="agent-list">${rows || `<div class="agent-list-empty">등록된 계정이 없어요.</div>`}</div>
      `;
      const statusEl = document.getElementById("master-status");
      function flash(msg) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ""; }, 2200);
      }
      root.querySelectorAll("[data-action='master-enter']").forEach((btn) => {
        btn.onclick = () => masterEnterAccount(btn.getAttribute("data-id"));
      });
      root.querySelectorAll("[data-action='master-delete']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          const target = accounts.find((a) => a.id === id);
          if (!target) return;
          if (!window.confirm(`"${target.username}" 계정을 정말 삭제할까요? 이 계정의 데이터도 함께 지워지고, 되돌릴 수 없어요.`)) return;
          const result = deleteAccount(id);
          if (!result.ok) { flash(result.reason || "삭제하지 못했어요."); return; }
          draw();
        };
      });
      root.querySelectorAll("[data-action='master-reset']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          uiState.error = "";
          uiState.resettingId = uiState.resettingId === id ? null : id;
          draw();
        };
      });
      root.querySelectorAll("[data-action='master-rename']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          uiState.renameError = "";
          uiState.renamingId = uiState.renamingId === id ? null : id;
          draw();
        };
      });
      root.querySelectorAll("[data-action='master-type']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          const target = accounts.find((a) => a.id === id);
          if (!target) return;
          const isTeamNow = target.accountType === "team";
          const nextType = isTeamNow ? "personal" : "team";
          const nextLabel = isTeamNow ? "개인용" : "팀용";
          const confirmMsg = isTeamNow
            ? `"${target.username}" 계정을 개인용으로 바꿀까요? (등록해둔 로그인 인원 목록은 지워지지 않고 남아있어요)`
            : `"${target.username}" 계정을 팀용으로 바꿀까요? 팀용으로 바꾸면 "로그인 인원 관리"에서 로그인할 인원을 추가할 수 있어요.`;
          if (!window.confirm(confirmMsg)) return;
          const result = setAccountType(id, nextType);
          if (!result.ok) { flash(result.reason || "유형을 바꾸지 못했어요."); return; }
          if (uiState.manageMembersId === id && nextType !== "team") uiState.manageMembersId = null;
          draw();
          flash(`"${target.username}" 계정을 ${nextLabel}으로 바꿨어요.`);
        };
      });
      root.querySelectorAll("[data-action='master-members']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          uiState.memberError = "";
          uiState.manageMembersId = uiState.manageMembersId === id ? null : id;
          draw();
        };
      });
      root.querySelectorAll("[data-member-form]").forEach((form) => {
        form.onsubmit = (e) => {
          e.preventDefault();
          const id = form.getAttribute("data-member-form");
          const input = document.getElementById(`member-name-${id}`);
          const result = addTeamMember(id, input ? input.value : "");
          if (!result.ok) { uiState.memberError = result.reason || "추가하지 못했어요."; draw(); return; }
          uiState.memberError = "";
          draw();
          flash(`로그인 인원 "${(input.value || "").trim()}"을(를) 추가했어요.`);
        };
      });
      root.querySelectorAll("[data-remove-member]").forEach((btn) => {
        btn.onclick = () => {
          const [accId, memberId] = btn.getAttribute("data-remove-member").split(":");
          const acc = accounts.find((x) => x.id === accId);
          const member = acc && Array.isArray(acc.teamMembers) ? acc.teamMembers.find((m) => m.id === memberId) : null;
          if (!window.confirm(`"${member ? member.name : "이 인원"}"을(를) 로그인 인원에서 삭제할까요?`)) return;
          const result = removeTeamMember(accId, memberId);
          if (!result.ok) { flash(result.reason || "삭제하지 못했어요."); return; }
          draw();
          flash("로그인 인원을 삭제했어요.");
        };
      });
      root.querySelectorAll("[data-rename-form]").forEach((form) => {
        form.onsubmit = (e) => {
          e.preventDefault();
          const id = form.getAttribute("data-rename-form");
          const newUsername = document.getElementById(`rename-username-${id}`).value;
          const result = renameAccount(id, newUsername);
          if (!result.ok) { uiState.renameError = result.reason || "이름을 바꾸지 못했어요."; draw(); return; }
          uiState.renamingId = null;
          uiState.renameError = "";
          if (id === CURRENT_ACCOUNT_ID) { location.reload(); return; }
          draw();
          flash(`계정 이름을 "${newUsername.trim()}"(으)로 바꿨어요.`);
        };
      });
      root.querySelectorAll("[data-reset-form]").forEach((form) => {
        form.onsubmit = async (e) => {
          e.preventDefault();
          const id = form.getAttribute("data-reset-form");
          const target = accounts.find((a) => a.id === id);
          const pw1 = document.getElementById(`reset-password-${id}`).value;
          const pw2 = document.getElementById(`reset-password2-${id}`).value;
          if (pw1 !== pw2) { uiState.error = "비밀번호 확인이 일치하지 않아요."; draw(); return; }
          const result = await resetAccountPassword(id, pw1);
          if (!result.ok) { uiState.error = result.reason || "비밀번호를 초기화하지 못했어요."; draw(); return; }
          uiState.resettingId = null;
          uiState.error = "";
          draw();
          flash(`"${target ? target.username : ""}" 계정의 비밀번호를 초기화했어요.`);
        };
      });
    }

    // 실제 저장(activity-log:entries)은 변경이 생기자마자 한 건씩 즉시 기록된다.
    // 다만 마스터 계정에서 이 목록을 볼 때, 같은 계정이 짧은 시간(3분) 안에 여러
    // 번 고친 건 한 줄로 묶어서 보여주는 게 더 읽기 편하므로, 화면에 그릴 때만
    // (표시 전용) 묶는다. 실제 데이터를 건드리지 않으므로 스케줄 셀 "수정 이력
    // 보기" 등 다른 화면에는 영향이 없다.
    function groupActivityEntriesForDisplay(entries) {
      const byAccount = {};
      entries.forEach((e) => {
        if (!byAccount[e.accountId]) byAccount[e.accountId] = [];
        byAccount[e.accountId].push(e);
      });
      const groups = [];
      Object.keys(byAccount).forEach((accountId) => {
        const list = byAccount[accountId].slice().sort((a, b) => Date.parse(a.at || 0) - Date.parse(b.at || 0));
        let current = null;
        list.forEach((e) => {
          const ts = Date.parse(e.at || "");
          const lastTs = current ? Date.parse(current.lastAt || "") : NaN;
          const sameBurst = current
            && (current.viaMasterName || null) === (e.viaMasterName || null)
            && !isNaN(ts) && !isNaN(lastTs)
            && (ts - lastTs) <= ACTIVITY_DISPLAY_GROUP_MS;
          if (sameBurst) {
            current.items.push(e);
            current.lastAt = e.at || current.lastAt;
          } else {
            current = { accountId, accountName: e.accountName, viaMasterName: e.viaMasterName, startAt: e.at, lastAt: e.at, items: [e] };
            groups.push(current);
          }
        });
      });
      groups.sort((a, b) => Date.parse(b.lastAt || 0) - Date.parse(a.lastAt || 0));
      return groups.map((g) => {
        const whereLabels = [];
        g.items.forEach((e) => {
          const w = e.subLabel ? `${e.categoryLabel} · ${e.subLabel}` : e.categoryLabel;
          if (whereLabels.indexOf(w) === -1) whereLabels.push(w);
        });
        const categoryLabel = whereLabels.length <= 2 ? whereLabels.join(", ") : `${whereLabels.slice(0, 2).join(", ")} 외 ${whereLabels.length - 2}곳`;
        const diffLines = [];
        g.items.forEach((e) => { (e.diff || []).forEach((line) => diffLines.push(line)); });
        return {
          id: g.items[0].id,
          at: g.startAt,
          endedAt: g.items.length > 1 ? g.lastAt : null,
          accountId: g.accountId,
          accountName: g.accountName,
          viaMasterName: g.viaMasterName,
          categoryLabel,
          subLabel: g.items.length > 1 ? `${g.items.length}건` : g.items[0].subLabel,
          diff: diffLines,
        };
      });
    }
    // ----- 활동 로그 탭: 계정별 데이터 변경 이력을 간단한 목록으로 보여준다 -----
    function drawActivityLog(root) {
      const entries = groupActivityEntriesForDisplay(loadActivityLog());
      const accounts = loadAccounts();
      const accountNameOf = (id) => { const a = accounts.find((x) => x.id === id); return a ? a.username : null; };

      const accountOptionsMap = {};
      entries.forEach((e) => {
        if (!accountOptionsMap[e.accountId]) accountOptionsMap[e.accountId] = accountNameOf(e.accountId) || e.accountName || e.accountId;
      });
      const accountOptions = Object.keys(accountOptionsMap)
        .map((id) => ({ id, name: accountOptionsMap[id] }))
        .sort((a, b) => a.name.localeCompare(b.name, "ko"));

      const filtered = uiState.logAccountFilter === "all"
        ? entries
        : entries.filter((e) => e.accountId === uiState.logAccountFilter);

      const shown = filtered.slice(0, 200);
      const rows = shown.map((e) => {
        const isExpanded = uiState.expandedLogIds.has(e.id);
        const startLabel = e.at ? esc(formatKSTDateTime(e.at)) : "-";
        const endLabel = e.endedAt ? esc(formatKSTTime(e.endedAt)) : "";
        const dt = endLabel && endLabel !== startLabel.slice(-5) ? `${startLabel} ~ ${endLabel}` : startLabel;
        const whereLabel = esc(e.subLabel ? `${e.categoryLabel} · ${e.subLabel}` : (e.categoryLabel || "기타"));
        return `
          <div class="interview-row ${isExpanded ? "expanded" : ""}">
            <div class="interview-row-top" data-action="toggle-log-row" data-id="${e.id}">
              <span class="interview-row-chevron">${ICON_CHEVRON_RIGHT}</span>
              <span class="interview-date">${dt}</span>
              <span class="agent-row-name">${esc(e.accountName || "(삭제된 계정)")}</span>
              ${e.viaMasterName ? `<span class="badge sm master">마스터: ${esc(e.viaMasterName)}</span>` : ""}
              <span class="badge sm working">${whereLabel}</span>
            </div>
            ${isExpanded ? `
              <div class="interview-row-body">
                ${(e.diff && e.diff.length) ? e.diff.map((d) => `<div class="interview-content">${esc(d)}</div>`).join("") : `<div class="interview-content">세부 내용이 없어요.</div>`}
              </div>
            ` : ""}
          </div>
        `;
      }).join("");

      root.innerHTML = `
        <div class="agent-summary">
          각 계정에서 데이터가 바뀔 때마다 자동으로 기록돼요(시각은 한국 표준시 기준). 목록을 누르면 자세한 변경 내용을 볼 수 있어요.
          ${ACTIVITY_LOG_RETENTION_DAYS}일 지난 로그는 자동으로 정리돼요. 총 ${filtered.length}건${filtered.length > shown.length ? ` (최근 ${shown.length}건만 표시)` : ""}.
        </div>
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:14px; flex-wrap:wrap;">
          <select class="agent-sort-select" id="log-account-filter" data-trigger-class="agent-sort-select">
            <option value="all" ${uiState.logAccountFilter === "all" ? "selected" : ""}>전체 계정</option>
            ${accountOptions.map((a) => `<option value="${esc(a.id)}" ${uiState.logAccountFilter === a.id ? "selected" : ""}>${esc(a.name)}</option>`).join("")}
          </select>
          ${entries.length ? `<button type="button" class="ghost-btn danger" id="log-clear-btn">로그 전체 지우기</button>` : ""}
        </div>
        <div class="interview-list">${rows || `<div class="agent-list-empty">${entries.length ? "이 계정에는 아직 활동 기록이 없어요." : "아직 쌓인 활동 기록이 없어요."}</div>`}</div>
      `;

      const filterEl = document.getElementById("log-account-filter");
      if (filterEl) {
        enhanceSelect(filterEl);
        filterEl.onchange = () => { uiState.logAccountFilter = filterEl.value; draw(); };
      }

      const clearBtn = document.getElementById("log-clear-btn");
      if (clearBtn) {
        clearBtn.onclick = () => {
          if (!window.confirm("모든 계정의 활동 로그를 전부 지울까요? 되돌릴 수 없어요.")) return;
          clearActivityLog();
          uiState.expandedLogIds.clear();
          draw();
        };
      }

      root.querySelectorAll("[data-action='toggle-log-row']").forEach((row) => {
        row.onclick = () => {
          const id = row.getAttribute("data-id");
          if (uiState.expandedLogIds.has(id)) uiState.expandedLogIds.delete(id);
          else uiState.expandedLogIds.add(id);
          draw();
        };
      });
    }

    // 자동 백업 탭은 제거되었습니다 — 이제 자정 백업은 서버(discord-backup-upload
    // 엣지펑션)가 만들어서 디스코드로 올리고, 업로드 성공 즉시 서버에는 남겨두지
    // 않도록 바뀌었습니다. 여기서 조회/다운로드할 서버 보관본이 더 이상 없습니다.

    draw();
  }

  /* ===================== 사용설명서 팝업 (PPT처럼 옆으로 넘겨보기) ===================== */
  const manualUi = { index: 0, dir: "next" };
  let manualKeyHandler = null;

  function closeManualModal() {
    const existing = document.getElementById("manual-modal-overlay");
    if (existing) existing.remove();
    if (manualKeyHandler) { document.removeEventListener("keydown", manualKeyHandler); manualKeyHandler = null; }
  }

  function openManualModal() {
    closeManualModal();
    manualUi.index = 0;
    manualUi.dir = "next";

    const overlay = document.createElement("div");
    overlay.id = "manual-modal-overlay";
    overlay.className = "manual-modal-overlay";
    overlay.innerHTML = `
      <div class="manual-modal-box" role="dialog" aria-modal="true" aria-label="사용설명서">
        <div class="manual-modal-head">
          <span>${ICON_BOOK} 사용설명서</span>
          <button type="button" class="manual-modal-close" id="manual-modal-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body" id="manual-modal-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeManualModal(); };
    document.getElementById("manual-modal-close-x").onclick = () => closeManualModal();

    const root = document.getElementById("manual-modal-body");
    renderManualSlides(root);
  }

  // 사용설명서 각 슬라이드에 곁들일 "간단한 캡처" — 실제 화면을 그대로 찍는 대신,
  // 해당 페이지의 생김새를 알아볼 수 있을 정도로 단순화한 목업 그림을 그려준다.
  function manualPageShot(key) {
    const w = 440, h = 150;
    const frame = `<rect width="${w}" height="${h}" rx="16" fill="var(--elevated)"/>`;
    let inner = "";
    if (key === "home") {
      const cards = [[16, 16, false], [224, 16, true], [16, 80, false], [224, 80, false]];
      inner = cards.map(([x, y, dot]) => `
        <rect x="${x}" y="${y}" width="200" height="54" rx="10" fill="var(--panel)" stroke="var(--hairline)"/>
        <rect x="${x + 12}" y="${y + 14}" width="70" height="7" rx="3.5" fill="var(--text-faint)"/>
        ${dot ? `<circle cx="${x + 16}" cy="${y + 34}" r="4" fill="var(--accent)"/>` : ""}
        <rect x="${x + (dot ? 28 : 12)}" y="${y + 30}" width="${dot ? 134 : 150}" height="7" rx="3.5" fill="var(--text-dim)"/>
      `).join("");
    } else if (key === "calendar") {
      const cols = 7, rows = 4, cw = (w - 32) / cols, ch = (h - 32) / rows, ox = 16, oy = 16;
      let cells = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * cw, y = oy + r * ch;
          const hi = (r === 1 && c === 3) || (r === 2 && c === 5);
          cells += `<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="6" fill="${hi ? "var(--accent-dim)" : "var(--panel)"}" stroke="var(--hairline)"/>`;
          if (hi) cells += `<circle cx="${x + cw / 2}" cy="${y + ch - 9}" r="3" fill="var(--accent)"/>`;
        }
      }
      inner = cells;
    } else if (key === "notes") {
      inner = [16, 58, 100].map((y, idx) => `
        <rect x="16" y="${y}" width="408" height="32" rx="9" fill="var(--panel)" stroke="var(--hairline)"/>
        ${idx === 0 ? `<circle cx="404" cy="${y + 16}" r="5" fill="var(--orange)"/>` : ""}
        <rect x="28" y="${y + 11}" width="${idx === 0 ? 120 : 90}" height="8" rx="4" fill="var(--text)"/>
        <rect x="${idx === 0 ? 156 : 126}" y="${y + 12}" width="190" height="7" rx="3.5" fill="var(--text-faint)"/>
      `).join("");
    } else if (key === "agents") {
      inner = [16, 58, 100].map((y) => `
        <rect x="16" y="${y}" width="408" height="32" rx="9" fill="var(--panel)" stroke="var(--hairline)"/>
        <circle cx="35" cy="${y + 16}" r="11" fill="var(--accent-dim)"/>
        <rect x="54" y="${y + 9}" width="92" height="7" rx="3.5" fill="var(--text)"/>
        <rect x="54" y="${y + 20}" width="60" height="6" rx="3" fill="var(--text-faint)"/>
        <rect x="360" y="${y + 10}" width="36" height="12" rx="6" fill="var(--green-dim)"/>
      `).join("");
    } else if (key === "qa") {
      const cols = 5, colW = (w - 32) / cols;
      let header = "";
      for (let c = 0; c < cols; c++) header += `<rect x="${16 + c * colW}" y="16" width="${colW - 4}" height="20" rx="6" fill="var(--elevated)" stroke="var(--hairline)"/>`;
      let rows = "";
      for (let r = 0; r < 3; r++) {
        const y = 44 + r * 28;
        for (let c = 0; c < cols; c++) {
          rows += `<rect x="${16 + c * colW}" y="${y}" width="${colW - 4}" height="20" rx="6" fill="var(--panel)" stroke="var(--hairline)"/>`;
        }
        rows += `<rect x="${16 + 3 * colW + 6}" y="${y + 5}" width="${colW - 16}" height="10" rx="5" fill="var(--accent-dim)"/>`;
      }
      inner = header + rows;
    } else if (key === "interviews") {
      inner = [16, 62, 108].map((y, idx) => `
        <rect x="16" y="${y}" width="408" height="38" rx="10" fill="var(--panel)" stroke="var(--hairline)"/>
        <rect x="28" y="${y + 11}" width="70" height="8" rx="4" fill="var(--text)"/>
        <rect x="106" y="${y + 10}" width="42" height="16" rx="8" fill="${idx === 0 ? "var(--purple-dim)" : "var(--blue-dim)"}"/>
        <rect x="28" y="${y + 24}" width="220" height="7" rx="3.5" fill="var(--text-faint)"/>
      `).join("");
    } else if (key === "schedule") {
      const cols = 10, rows = 4, cw = (w - 90) / cols, ch = (h - 32) / rows, ox = 90, oy = 16;
      let cells = `<rect x="16" y="16" width="66" height="${h - 32}" rx="8" fill="var(--elevated)"/>`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * cw, y = oy + r * ch;
          const idx = r * cols + c;
          const fill = idx % 9 === 0 ? "var(--blue-dim)" : idx % 11 === 0 ? "var(--orange-dim)" : "var(--panel)";
          cells += `<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="5" fill="${fill}" stroke="var(--hairline)"/>`;
        }
      }
      inner = cells;
    }
    return `<div class="manual-slide-shot"><svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${frame}${inner}</svg></div>`;
  }

  function renderManualSlides(root) {
    const slides = [
      {
        key: "intro",
        icon: ICON_BOOK,
        title: "사용설명서",
        subtitle: "업무 종합 관리, 이렇게 사용하세요",
        desc: "왼쪽 메뉴에는 7가지 기능이 있어요. 이 사용설명서는 PPT처럼 옆으로 넘겨보면서 기능 하나하나를 확인할 수 있게 만들었어요. 위쪽 탭을 클릭하거나, 양옆 화살표 버튼, 키보드 ← → 방향키, 화면 스와이프로도 넘길 수 있어요. 메뉴 아래쪽에는 화면 테마 변경, 되돌리기(Ctrl+Z), 데이터 백업/복원, 새로고침 버튼도 있으니 참고하세요.",
        intro: true,
        chips: [
          { icon: ICON_HOME, label: "홈" },
          { icon: ICON_CALENDAR, label: "캘린더" },
          { icon: ICON_USERS, label: "상담사 관리" },
          { icon: ICON_NOTE, label: "업무 정리" },
          { icon: ICON_CLIPBOARD, label: "면담일지" },
          { icon: ICON_QA, label: "품질 관리" },
          { icon: ICON_CHART, label: "월별 스케줄" },
        ],
      },
      {
        key: "home",
        icon: ICON_HOME,
        title: "홈",
        subtitle: "로그인 후 가장 먼저 보이는 대시보드",
        desc: "오늘 하루를 시작할 때 필요한 정보를 한 화면에 모아서 보여줘요.",
        features: [
          "로그인하면 '오늘의 브리핑' 팝업이 한 번 떠서, 오늘 근무 현황·일정·면담 필요 알림·할 일·고정 메모를 요약해서 보여줘요.",
          "오늘 근무 현황 — 월별 스케줄을 기준으로 오늘 근무 중인 인원과 지각·결근 여부를 바로 확인해요.",
          "오늘 일정 — 캘린더에 등록된 오늘 일정을 미리 보여줘요.",
          "면담 필요 알림 — 최근 21일 내 면담 기록이 없는 상담사를 놓치지 않도록 알려줘요.",
          "할 일 / 고정 메모 — 자주 확인할 항목을 홈 화면에 바로 띄워둘 수 있어요.",
          "각 섹션 오른쪽의 '바로가기' 버튼을 누르면 해당 메뉴로 곧장 이동해요.",
        ],
      },
      {
        key: "calendar",
        icon: ICON_CALENDAR,
        title: "캘린더",
        subtitle: "일정을 등록하고 한 달 흐름을 확인",
        desc: "월 단위로 일정을 관리하고, 다가오는 일정을 놓치지 않게 도와줘요.",
        features: [
          "날짜를 클릭하면 그날의 일정을 확인하고 새로 추가할 수 있어요.",
          "'메모'와 '일정' 두 유형으로 구분해서 등록하고, 시간과 우선순위(★ 중요)도 지정할 수 있어요.",
          "시작일~종료일을 지정해서 여러 날에 걸친 일정도 만들 수 있고, 상세 내용도 함께 적어둘 수 있어요.",
          "완료한 일정은 체크 표시하고, '완료 항목 숨기기'로 화면에서 가려볼 수 있어요.",
          "공휴일은 자동으로 표시돼요.",
          "다가오는 일정 목록을 한눈에 확인할 수 있어요.",
          "캘린더 화면 안에 할 일(Todo) 카드도 있어서, 마감일을 정해 할 일을 등록하고 완료 체크할 수 있어요.",
        ],
      },
      {
        key: "agents",
        icon: ICON_USERS,
        title: "상담사 관리",
        subtitle: "인원 정보를 등록하고 관리",
        desc: "여기에 등록한 인원 정보가 월별 스케줄과 면담일지에도 함께 반영돼요.",
        features: [
          "상담사 정보를 등록하고 검색·필터링할 수 있어요 (재직 상태 · 업무 구분 · 조 등). 이름은 초성만 입력해도 검색돼요.",
          "정렬 기준을 바꾸거나, '사용자 지정' 정렬에서는 직접 드래그해서 순서를 바꿀 수 있어요.",
          "상담사를 클릭하면 상세 정보, QA 점수 미리보기, 면담 이력을 함께 확인할 수 있어요.",
          "자주 확인하는 상담사는 즐겨찾기로 고정해둘 수 있어요.",
        ],
      },
      {
        key: "notes",
        icon: ICON_NOTE,
        title: "업무 정리",
        subtitle: "메모를 남기고 폴더로 정리",
        desc: "업무 중 떠오르는 내용을 바로 기록하고 체계적으로 정리할 수 있어요.",
        features: [
          "새 메모를 작성하고 폴더별로 분류해서 관리해요. 폴더는 접었다 펼 수 있어요.",
          "중요한 메모는 최대 5개까지 화면 상단에 고정할 수 있어요.",
          "제목 수정, 삭제가 자유롭고, 드래그로 순서를 바꾸거나 다른 폴더로 옮길 수 있어요.",
        ],
      },
      {
        key: "interviews",
        icon: ICON_CLIPBOARD,
        title: "면담일지",
        subtitle: "상담사별 면담 기록 관리",
        desc: "면담 내용과 후속조치를 기록해서 다음 면담 때 이어서 참고할 수 있어요.",
        features: [
          "상담사별 면담 기록을 추가·수정·삭제할 수 있어요. 상담사는 이름·LDAP·초성으로 검색해서 바로 선택할 수 있어요.",
          "면담 유형(정기·비정기·경고·퇴사)이나 검색어로 필요한 기록만 걸러볼 수 있어요.",
          "후속조치 내용을 함께 남겨서 다음 면담 때 참고할 수 있어요.",
        ],
      },
      {
        key: "qa",
        icon: ICON_QA,
        title: "품질 관리",
        subtitle: "상담사별 월간 QA 점수 관리",
        desc: "상담사 관리에서 근무중인 인원을 자동으로 불러와서, 월별로 QA 점수를 입력하고 통계를 확인할 수 있어요.",
        features: [
          "월 이동 버튼으로 원하는 달의 QA 점수를 입력·확인할 수 있어요.",
          "인원마다 유선 점수·채팅 점수를 따로 입력하면, 종합 점수와 전월 대비 점수 차이가 자동으로 계산돼요.",
          "당월 전체/유선/채팅/주간/야간/주간 채팅/주간 유선/야간 채팅/야간 유선 평균을 상단에서 한눈에 확인할 수 있어요.",
          "'상담사 관리'에서 재직 상태가 '근무중'인 인원만 자동으로 표시돼요 (관리자는 제외).",
          "표를 전체·주간·야간·유선·채팅 기준으로 나눠서 이미지로 저장할 수 있어요.",
          "지난 달은 자동으로 '확정됨' 상태로 잠겨요. '잠금 해제' 버튼으로 다시 열어 수정한 뒤 '이 달 잠그기'로 다시 잠글 수 있어요.",
        ],
      },
      {
        key: "schedule",
        icon: ICON_CHART,
        title: "월별 스케줄",
        subtitle: "상담사들의 월간 근무표",
        desc: "상담사 관리에 등록한 인원이 자동으로 반영되는 월별 근무표예요.",
        features: [
          "이름·사번·조·업무 구분 등 인원 정보는 '상담사 관리'에서 수정하면 자동으로 반영돼요.",
          "재직 중인 인원만 자동으로 표시되고, 퇴사 처리된 인원은 스케줄에서 빠져요. 관리자는 표 맨 위에 따로 표시돼요.",
          "월 이동 버튼으로 지난 달·다음 달 스케줄도 확인할 수 있어요.",
          "일괄 붙여넣기로 여러 인원의 스케줄을 한 번에 입력할 수 있어요. 근무·오프·연차·대휴·반차·공휴·공가·육휴·특휴·교육·지각·결근·퇴사 등 다양한 값을 인식해요.",
          "일괄 붙여넣기에서 줄 맨 앞에 '주간 채팅 필요인력'(주간 유선 / 야간 채팅 / 야간 유선도 가능)을 쓰고 1일부터의 숫자를 이어 붙이면 필요인력도 한 번에 입력돼요. 인원 스케줄 줄과 함께 섞어서 붙여넣어도 돼요.",
          "셀을 드래그해서 여러 칸을 한 번에 선택한 뒤, 메뉴에서 상태를 골라 한 번에 적용할 수 있어요.",
          "칸(또는 드래그로 고른 범위)을 Ctrl+C로 복사하고, 붙여넣을 칸을 클릭한 뒤 Ctrl+V로 붙여넣을 수 있어요. 상태와 메모가 함께 복사되고, 붙여넣은 칸의 기존 메모는 복사한 메모로 바뀌어요(복사한 칸에 메모가 없으면 지워져요). Ctrl+Z로 한 번에 되돌릴 수 있고, 엑셀에서 복사한 근태 값(오프·연차 등)도 붙여넣을 수 있어요.",
          "셀을 클릭하면 근무/오프/연차 등 다양한 상태로 바로 바꿀 수 있고, 메모도 남길 수 있어요. 지각은 출근 인원에 포함, 결근은 제외돼요.",
          "이름 칸을 오른쪽 클릭하면 그 인원의 이번 달 메모를 남길 수 있어요. 메모가 있으면 이름 칸 모서리에 주황색 표시가 붙고, 마우스를 올리면 내용이 보여요. 엑셀로 다운로드하면 메모로 함께 들어가고(이미지 저장에는 표시되지 않아요), 지난 달은 잠겨서 그때 남긴 메모를 읽기만 할 수 있어요.",
          "날짜·조·업무 구분별로 필요 인원(헤드카운트)을 설정하면, 실제 근무 인원과의 차이를 자동으로 계산해서 보여줘요.",
          "필요 없는 열·행은 선택 후 오른쪽 클릭으로 접어서 숨길 수 있고, 날짜 범위를 묶어 그룹으로 한 번에 접었다 펼 수도 있어요.",
          "날짜·정보 머리글이나 왼쪽 이름·사번 칸을 마우스로 끌면 그 범위의 열·행이 한꺼번에 선택되고, 손을 떼면 뜨는 메뉴에서 '접기'를 누르면 한 번에 접혀요. Ctrl(⌘) 또는 Shift를 누른 채 끌면 이미 고른 것에 더해져요. 고른 뒤 표 밖이나 머리글이 아닌 곳을 누르면 선택이 풀려요.",
          "이미지로 저장하거나 엑셀 파일로 다운로드할 수 있고, '휴일대체 확인서'도 회사 양식 그대로 자동으로 만들 수 있어요.",
          "이번 달 지각·결근 기록을 표 아래에서 바로 확인할 수 있어요.",
          "지난 달은 자동으로 '확정됨' 상태로 잠기고 그 시점 인원 구성이 고정돼요. '잠금 해제' 버튼으로 다시 열어 수정할 수 있어요.",
        ],
      },
    ];

    if (manualUi.index >= slides.length) manualUi.index = 0;

    function goTo(nextIndex) {
      const clamped = Math.max(0, Math.min(slides.length - 1, nextIndex));
      if (clamped === manualUi.index) return;
      manualUi.dir = clamped > manualUi.index ? "next" : "prev";
      manualUi.index = clamped;
      draw();
    }

    function draw() {
      const i = manualUi.index;
      const s = slides[i];
      const animClass = manualUi.dir === "prev" ? "manual-anim-prev" : "manual-anim-next";

      const tabsHtml = slides.map((sl, idx) => `
        <button class="manual-tab ${idx === i ? "active" : ""}" data-goto="${idx}">
          <span class="manual-tab-icon">${sl.icon}</span><span>${sl.title}</span>
        </button>
      `).join("");

      const dotsHtml = slides.map((sl, idx) => `
        <button class="manual-dot ${idx === i ? "active" : ""}" data-goto="${idx}" title="${esc(sl.title)}"></button>
      `).join("");

      const bodyHtml = s.intro
        ? `<div class="manual-chip-grid">${s.chips.map((c, ci) => `
            <button class="manual-chip" data-goto="${ci + 1}">
              <span class="manual-chip-icon">${c.icon}</span><span>${c.label}</span>
            </button>
          `).join("")}</div>`
        : `<ul class="manual-feature-list">${s.features.map((f) => `<li>${f}</li>`).join("")}</ul>`;

      root.innerHTML = `
        <div class="manual-shell">
          <div class="manual-tabs">${tabsHtml}</div>
          <div class="manual-viewport">
            <button class="manual-arrow" id="manual-prev" ${i === 0 ? "disabled" : ""} title="이전">‹</button>
            <div class="manual-slide ${animClass}">
              <div class="manual-slide-head">
                <div class="manual-slide-icon">${s.icon}</div>
                <div>
                  <div class="manual-slide-title">${s.title}</div>
                  <div class="manual-slide-subtitle">${s.subtitle}</div>
                </div>
              </div>
              <p class="manual-slide-desc">${s.desc}</p>
              ${s.intro ? "" : manualPageShot(s.key)}
              ${bodyHtml}
            </div>
            <button class="manual-arrow" id="manual-next" ${i === slides.length - 1 ? "disabled" : ""} title="다음">›</button>
          </div>
          <div class="manual-footer">
            <div class="manual-dots">${dotsHtml}</div>
            <div class="manual-counter">${i + 1} / ${slides.length}</div>
          </div>
        </div>
      `;

      root.querySelectorAll("[data-goto]").forEach((btn) => {
        btn.onclick = () => goTo(parseInt(btn.getAttribute("data-goto"), 10));
      });
      const prevBtn = document.getElementById("manual-prev");
      const nextBtn = document.getElementById("manual-next");
      if (prevBtn) prevBtn.onclick = () => goTo(i - 1);
      if (nextBtn) nextBtn.onclick = () => goTo(i + 1);

      // 터치 스와이프로도 슬라이드를 넘길 수 있게 지원
      const viewport = root.querySelector(".manual-viewport");
      if (viewport) {
        let touchStartX = null;
        viewport.ontouchstart = (e) => { touchStartX = e.touches[0].clientX; };
        viewport.ontouchend = (e) => {
          if (touchStartX === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(dx) > 40) goTo(dx < 0 ? i + 1 : i - 1);
          touchStartX = null;
        };
      }
    }

    // 사용설명서 팝업이 열려 있을 때만 좌우 방향키(Esc 포함)로 조작할 수 있게 한다.
    if (manualKeyHandler) document.removeEventListener("keydown", manualKeyHandler);
    manualKeyHandler = (e) => {
      if (!document.getElementById("manual-modal-overlay")) return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goTo(manualUi.index + 1);
      else if (e.key === "ArrowLeft") goTo(manualUi.index - 1);
      else if (e.key === "Escape") closeManualModal();
    };
    document.addEventListener("keydown", manualKeyHandler);

    draw();
  }

  function renderApp() {
    renderNav();
    const root = document.getElementById("page-inner");
    root.classList.toggle("wide", state.page === "schedule" || state.page === "home" || state.page === "calendar");
    if (state.page === "notes") renderNotesPage(root);
    else if (state.page === "agents") renderAgentsPage(root);
    else if (state.page === "qa") renderQAPage(root);
    else if (state.page === "interviews") renderInterviewsPage(root);
    else if (state.page === "schedule") renderSchedulePage(root);
    else if (state.page === "calendar") renderCalendarPage(root);
    else if (state.page === "master") renderMasterPage(root);
    else renderHomePage(root);
  }

  // 앱을 처음 열 때도 월별 스케줄 인원 목록을 상담사 관리 목록과 맞춰준다.
  syncScheduleStaffFromAgents();
  saveScheduleData();

  renderApp();

  // 로그인/계정 생성 직후 딱 한 번, 홈 화면 위에 팝업을 살짝 늦게(화면이 먼저 자리
  // 잡은 뒤) 애니메이션과 함께 띄워준다. 지난달 마감(최종 스케줄/품질 관리 확정)이
  // 아직 안 끝났고 "앞으로 뜨지 않음"을 체크해두지 않았다면 그 확인 팝업을 먼저
  // 띄우고, 그렇지 않으면 평소처럼 "오늘의 브리핑"을 띄운다(로그인할 때마다 매번
  // 확인해서, 마감이 끝나거나 체크박스를 누르기 전까지는 계속 다시 뜬다).
  if (_justLoggedIn && !CURRENT_ACCOUNT_IS_MASTER) {
    setTimeout(() => {
      if (shouldShowMonthClosePopup()) showMonthClosePopup();
      else showTodayBriefPopup();
    }, 450);
  }

  // 로그인 유지 하트비트: 이 탭이 열려 있는 동안 "마지막으로 살아있던 시각"을 계속
  // 갱신해서, 탭만 잠깐 닫았다 다시 열었을 때는 로그인이 유지되고 컴퓨터를 껐다
  // 켤 정도로 오래 닫혀 있었을 때만 자동 로그아웃되게 한다 (판단 자체는 01-common.js의
  // 세션 확인 부분에서 다음에 열릴 때 이뤄진다).
  touchLastActive();
  setInterval(touchLastActive, 15000);
  window.addEventListener("pagehide", touchLastActive);
  window.addEventListener("beforeunload", touchLastActive);

  /* ===================== 전역 검색 (상담사 · 메모 · 면담일지 통합) =====================
     상담사 관리 / 업무 정리 / 면담일지 페이지에 각각 따로 있는 검색을 한 곳에서
     "이 사람과 관련된 것 다 보여줘" 식으로 통합해서 찾아주는 기능.
     - 위치: 하단 내비게이션 독의 카테고리 아이콘들 바로 위 (#nav-dock 안, #nav 앞)
     - 결과: 새 페이지로 이동하지 않고, 검색 바로 위에 카드 목록(드롭다운)으로 떠서 보여줌
     - 카드를 클릭하면 해당 페이지로 이동해서 그 항목을 바로 펼쳐서 보여줌

     주의: 이 검색창은 renderNav()처럼 매번 innerHTML을 새로 그리지 않는다(앱 전체에서
     renderApp()이 호출될 때마다 통째로 다시 그려지면, 타이핑 중 입력창이 사라져서
     포커스/커서가 끊길 수 있기 때문). 그래서 앱이 처음 뜰 때 딱 한 번만 껍데기를
     그리고, 이후에는 결과 패널(#gs-results-panel)만 갱신한다. */

  const ICON_SEARCH = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.2"/><path d="M13 13l-2.9-2.9"/></svg>`;

  const globalSearchState = { query: "" };

  function gsTruncateText(str, max) {
    const s = (str || "").replace(/\s+/g, " ").trim();
    if (!s) return "";
    if (s.length <= max) return s;
    return s.slice(0, max) + "…";
  }

  // 일반 텍스트 포함 검색 + 초성 검색(상담사 이름 검색과 동일한 방식)을 함께 지원.
  function gsTextMatches(text, needle) {
    if (!needle) return false;
    const t = (text || "").toLowerCase();
    if (t.indexOf(needle) !== -1) return true;
    if (getChosungString(text || "").indexOf(needle) !== -1) return true;
    return false;
  }

  function computeGlobalSearchResults(rawQuery) {
    const needle = (rawQuery || "").trim().toLowerCase();
    if (!needle) return null;

    const agentResults = agentsData.filter((a) => agentMatchesSearch(a, rawQuery)).slice(0, 20);

    const noteResults = [];
    Object.keys(notesData.notes).forEach((id) => {
      const note = notesData.notes[id];
      if (!note) return;
      if (gsTextMatches(note.title, needle) || gsTextMatches(note.content, needle)) {
        noteResults.push(note);
      }
    });

    const interviewResults = interviewsData.filter((rec) => {
      const agent = agentsData.find((a) => a.id === rec.agentId);
      if (agent && agentMatchesSearch(agent, rawQuery)) return true;
      if (gsTextMatches(rec.content, needle)) return true;
      if (gsTextMatches(rec.followUp, needle)) return true;
      return false;
    }).slice(0, 20);

    // 품질 관리는 근무중이든 퇴사든 상관없이, 이름이 일치하는 "QA 관리 대상"
    // (관리자가 아닌) 상담사를 그대로 보여준다. 상담사 결과와 대상은 같지만
    // 화면에서는 면담일지처럼 별도 섹션으로 분리해서 QA 점수만 보여준다.
    const qaResults = agentResults.filter((a) => !a.isAdmin);

    return {
      agentResults,
      noteResults: noteResults.slice(0, 20),
      interviewResults: sortInterviews(interviewResults),
      qaResults,
    };
  }

  // 최근 3개월(이번 달 포함) QA 점수를 가로로 나란히 보여주는 알약 목록.
  // (상담사 상세의 "최근 QA 점수" 미리보기와 같은 3개월 구간을 그대로 재사용한다.)
  function gsQaMonthPillsHtml(agent) {
    if (typeof getQAScore !== "function") return "";
    const months = [];
    for (let i = 0; i <= 2; i++) {
      let m = today.getMonth() - i;
      let y = today.getFullYear();
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m });
    }
    return months.map(({ year, monthIndex }) => {
      const val = getQAScore(agent.id, year, monthIndex);
      const isCur = year === today.getFullYear() && monthIndex === today.getMonth();
      const label = isCur ? "이번 달" : `${monthIndex + 1}월`;
      return `
        <div class="gs-qa-cell${val === null ? " empty" : ""}">
          <div class="gs-qa-cell-label">${esc(label)}</div>
          <div class="gs-qa-cell-value">${val === null ? "데이터 없음" : val.toFixed(1)}</div>
        </div>
      `;
    }).join("");
  }

  function renderGlobalSearchResultsHtml(results, query) {
    if (!results) return "";
    const { agentResults, noteResults, interviewResults, qaResults } = results;
    const total = agentResults.length + noteResults.length + interviewResults.length + qaResults.length;
    if (total === 0) {
      return `<div class="gs-empty">"${esc(query)}"에 대한 검색 결과가 없어요.</div>`;
    }

    let html = "";

    if (agentResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_USERS} 상담사 <span class="gs-count">${agentResults.length}</span></div>`;
      html += agentResults.map((a) => {
        return `
        <button type="button" class="gs-card" data-gs-action="agent" data-id="${a.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(a.name)}${a.isAdmin ? ' <span class="badge sm admin">관리자</span>' : ""}</span>
            <span class="gs-card-sub">${esc(a.ldap || "-")}</span>
          </div>
          <div class="gs-card-badges">
            ${a.status === "RESIGNED" ? '<span class="badge sm resigned">퇴사</span>' : '<span class="badge sm working">근무중</span>'}
          </div>
        </button>
      `;
      }).join("");
      html += `</div>`;
    }

    if (qaResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_QA} 품질 관리 <span class="gs-count">${qaResults.length}</span></div>`;
      html += qaResults.map((a) => `
        <button type="button" class="gs-card gs-card-qa" data-gs-action="qa" data-id="${a.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(a.name)}</span>
            <div class="gs-qa-sub-row">
              <span class="gs-card-sub">QA 점수</span>
              <div class="gs-qa-pills">${gsQaMonthPillsHtml(a)}</div>
            </div>
          </div>
        </button>
      `).join("");
      html += `</div>`;
    }

    if (noteResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_NOTE} 메모 <span class="gs-count">${noteResults.length}</span></div>`;
      html += noteResults.map((n) => {
        const folder = n.folderId ? notesData.folders.find((f) => f.id === n.folderId) : null;
        const snippet = gsTruncateText(n.content, 60);
        return `
        <button type="button" class="gs-card" data-gs-action="note" data-id="${n.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(n.title)}</span>
            <span class="gs-card-sub">${snippet ? esc(snippet) : '<span class="agent-field-empty">내용 없음</span>'}</span>
          </div>
          ${folder ? `<div class="gs-card-badges"><span class="note-folder-tag">${esc(folder.name)}</span></div>` : ""}
        </button>
      `;
      }).join("");
      html += `</div>`;
    }

    if (interviewResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_CLIPBOARD} 면담일지 <span class="gs-count">${interviewResults.length}</span></div>`;
      html += interviewResults.map((rec) => {
        const agent = agentsData.find((a) => a.id === rec.agentId);
        const snippet = gsTruncateText(rec.content, 60);
        return `
        <button type="button" class="gs-card" data-gs-action="interview" data-id="${rec.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(agent ? agent.name : "(삭제된 상담사)")} <span class="badge sm ${interviewTypeBadgeClass(rec.type)}">${esc(rec.type || "비정기")}</span></span>
            <span class="gs-card-sub">${snippet ? esc(snippet) : '<span class="agent-field-empty">내용 없음</span>'}</span>
          </div>
          <div class="gs-card-badges"><span class="gs-card-date">${esc(rec.date || "-")}</span></div>
        </button>
      `;
      }).join("");
      html += `</div>`;
    }

    return html;
  }

  function openGlobalSearchResults() {
    const wrap = document.getElementById("gs-wrap");
    if (wrap) wrap.classList.add("open");
  }
  function closeGlobalSearchResults() {
    const wrap = document.getElementById("gs-wrap");
    if (wrap) wrap.classList.remove("open");
  }

  // 검색창 입력값 + 결과 패널을 비운다. 독을 닫을 때(closeDock)와 검색 결과 카드를
  // 선택해 다른 페이지로 이동할 때 공통으로 쓴다.
  function resetGlobalSearchQuery() {
    globalSearchState.query = "";
    const input = document.getElementById("gs-input");
    if (input) input.value = "";
    const clearBtn = document.getElementById("gs-clear-btn");
    if (clearBtn) clearBtn.classList.remove("visible");
    const panel = document.getElementById("gs-results-panel");
    if (panel) panel.innerHTML = "";
    closeGlobalSearchResults();
  }

  // 검색 결과 카드를 선택해 다른 페이지로 이동한 뒤: 검색창을 비우고 독을 닫는다.
  function resetGlobalSearchAfterNavigate() {
    resetGlobalSearchQuery();
    if (typeof closeDock === "function") closeDock();
  }

  function openAgentFromGlobalSearch(id) {
    agentsUi.selectedId = id;
    agentsUi.mode = "view";
    agentsUi.interviewMode = "list";
    agentsUi.interviewEditingId = null;
    setPage("agents");
    resetGlobalSearchAfterNavigate();
  }

  // 품질 관리 화면으로 이동하면서, 오늘 기준 달로 맞추고 그 상담사의 행을 강조한다.
  // (상담사 상세 → "품질 관리로 이동" 버튼과 동일한 방식)
  function openQAFromGlobalSearch(id) {
    qaUi.year = today.getFullYear();
    qaUi.monthIndex = today.getMonth();
    qaHighlightAgentId = id;
    setPage("qa");
    resetGlobalSearchAfterNavigate();
  }

  function openNoteFromGlobalSearch(id) {
    const note = notesData.notes[id];
    if (!note) return;
    const folderKey = note.folderId || UNFILED;
    notesUi.collapsedFolders[folderKey] = false;
    notesUi.expanded[id] = true;
    setPage("notes");
    resetGlobalSearchAfterNavigate();
    setTimeout(() => {
      const row = document.querySelector(`.note-row[data-note-id="${id}"]`);
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  function openInterviewFromGlobalSearch(id) {
    const rec = interviewsData.find((r) => r.id === id);
    if (!rec) return;
    const agent = agentsData.find((a) => a.id === rec.agentId);
    interviewsUi.mode = "list";
    interviewsUi.searchQuery = agent ? agent.name : "";
    interviewsUi.typeFilter = "all";
    interviewsUi.expandedIds.add(id);
    setPage("interviews");
    resetGlobalSearchAfterNavigate();
    setTimeout(() => {
      const row = document.querySelector(`.interview-row-top[data-id="${id}"]`);
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  function attachGlobalSearchResultHandlers(panel) {
    panel.querySelectorAll("[data-gs-action='agent']").forEach((btn) => {
      btn.onclick = () => openAgentFromGlobalSearch(btn.getAttribute("data-id"));
    });
    panel.querySelectorAll("[data-gs-action='qa']").forEach((btn) => {
      btn.onclick = () => openQAFromGlobalSearch(btn.getAttribute("data-id"));
    });
    panel.querySelectorAll("[data-gs-action='note']").forEach((btn) => {
      btn.onclick = () => openNoteFromGlobalSearch(btn.getAttribute("data-id"));
    });
    panel.querySelectorAll("[data-gs-action='interview']").forEach((btn) => {
      btn.onclick = () => openInterviewFromGlobalSearch(btn.getAttribute("data-id"));
    });
  }

  function updateGlobalSearchResultsPanel() {
    const panel = document.getElementById("gs-results-panel");
    if (!panel) return;
    const query = globalSearchState.query;
    if (!query.trim()) {
      closeGlobalSearchResults();
      panel.innerHTML = "";
      return;
    }
    const results = computeGlobalSearchResults(query);
    panel.innerHTML = renderGlobalSearchResultsHtml(results, query);
    openGlobalSearchResults();
    attachGlobalSearchResultHandlers(panel);
  }

  function globalSearchOutsideHandler(e) {
    const wrap = document.getElementById("gs-wrap");
    if (wrap && !wrap.contains(e.target)) closeGlobalSearchResults();
  }

  function renderGlobalSearchShell() {
    const root = document.getElementById("global-search-root");
    if (!root) return;
    // 마스터(관리자) 계정은 상담사·메모·면담일지 페이지 자체가 없으므로 검색도 숨긴다.
    if (CURRENT_ACCOUNT_IS_MASTER) { root.innerHTML = ""; return; }

    root.innerHTML = `
      <div class="gs-wrap" id="gs-wrap">
        <div class="gs-bar">
          <input type="text" id="gs-input" class="gs-input" placeholder="이름 통합 검색" autocomplete="off">
          <button type="button" id="gs-clear-btn" class="gs-clear-btn" title="지우기" aria-label="지우기">${ICON_CLOSE_SM}</button>
          ${ICON_SEARCH}
        </div>
        <div class="gs-results" id="gs-results-panel"></div>
      </div>
    `;

    const input = document.getElementById("gs-input");
    const clearBtn = document.getElementById("gs-clear-btn");

    input.oninput = (e) => {
      globalSearchState.query = e.target.value;
      clearBtn.classList.toggle("visible", !!e.target.value);
      updateGlobalSearchResultsPanel();
    };
    input.addEventListener("focus", () => {
      if (globalSearchState.query.trim()) openGlobalSearchResults();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeGlobalSearchResults();
        input.blur();
      } else if (e.key === "Enter") {
        const panel = document.getElementById("gs-results-panel");
        const first = panel && panel.querySelector(".gs-card");
        if (first) first.click();
      }
    });
    clearBtn.onclick = () => {
      globalSearchState.query = "";
      input.value = "";
      clearBtn.classList.remove("visible");
      updateGlobalSearchResultsPanel();
      input.focus();
    };

    document.addEventListener("mousedown", globalSearchOutsideHandler, true);
  }

  // 앱 전체 렌더 주기(renderApp/renderNav)와 분리해서, 처음 한 번만 그린다.
  renderGlobalSearchShell();
})();
