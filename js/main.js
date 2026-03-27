/**
 * ICB Homepage – Smart Animation (Figma Variant 6 → 7 → 3)
 *
 * Variant 6: 흰 배경 / 이미지 하단 일부 / 다크 텍스트
 * Variant 7: 이미지 전체 화면 / 화이트 텍스트 & GNB
 * Variant 3: 이미지 살짝 줌인 / 화이트 텍스트 & GNB
 */

(function () {
  'use strict';

  /* ── Elements ── */
  const gnb           = document.getElementById('gnb');
  const hero          = document.getElementById('hero');
  const imgFrame      = document.getElementById('heroImgFrame');
  const heroText      = document.getElementById('heroText');
  const scrollHint    = document.getElementById('scrollHint');
  const reveals       = document.querySelectorAll('.reveal');

  /* ── State ── */
  let currentVariant  = 6;      // 6 | 7 | 3
  let introPlayed     = false;
  let ticking         = false;

  /* ═══════════════════════════════════════
     1. 페이지 로드 → Variant 6 → 7 자동 전환
  ═══════════════════════════════════════ */
  function playIntro() {
    if (introPlayed) return;
    introPlayed = true;

    // 짧은 딜레이 후 Variant 7 확장 시작
    setTimeout(() => {
      // 이미지 확장 시작 (GNB·텍스트는 아래 타이머로 개별 제어)
      imgFrame.classList.add('state-7');

      // 이미지 top이 텍스트(~50%) 덮기 직전 → 텍스트 화이트 전환
      // 74.6%→50% = 전체 33% 이동, cubic-bezier 기준 약 580ms
      setTimeout(() => {
        heroText.classList.add('white');
      }, 400);

      // 이미지 top이 GNB(~12%) 덮기 직전 → GNB 화이트 전환
      // 74.6%→12% = 전체 84% 이동, cubic-bezier 기준 약 1200ms
      setTimeout(() => {
        gnb.classList.remove('state-6', 'state-scrolled');
        gnb.classList.add('state-7');
      }, 950);

      // 확장 완료 직후 줌인 시작
      setTimeout(() => {
        imgFrame.style.transition = [
          'top    2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          'left   2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          'width  2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          'height 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ].join(', ');
        imgFrame.classList.remove('state-7');
        imgFrame.classList.add('state-3');
        scrollHint.classList.add('visible');
      }, 1500);

    }, 400);
  }

  /* ═══════════════════════════════════════
     2. Variant 적용
     imageOnly=true 시 이미지 프레임만 변경 (텍스트·GNB는 별도 타이머로 제어)
  ═══════════════════════════════════════ */
  function setVariant(v, imageOnly) {
    currentVariant = v;

    /* 이미지 프레임 */
    imgFrame.classList.remove('state-7', 'state-3');
    if (v === 7) imgFrame.classList.add('state-7');
    if (v === 3) imgFrame.classList.add('state-3');

    if (imageOnly) return;

    /* 텍스트 컬러 */
    if (v === 6) {
      heroText.classList.remove('white');
    } else {
      heroText.classList.add('white');
    }

    /* GNB */
    gnb.classList.remove('state-6', 'state-7', 'state-scrolled');
    if (v === 6) {
      gnb.classList.add('state-6');
    } else {
      gnb.classList.add('state-7');
    }

    /* 스크롤 힌트 */
    if (v === 3) {
      scrollHint.classList.add('visible');
    } else {
      scrollHint.classList.remove('visible');
    }
  }

  /* ═══════════════════════════════════════
     3. 스크롤 핸들러
  ═══════════════════════════════════════ */
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  function handleScroll() {
    ticking = false;
    const heroBottom = hero.getBoundingClientRect().bottom;

    if (heroBottom <= 0) {
      /* 히어로 완전히 지남 → GNB 흰 배경 */
      gnb.classList.remove('state-6', 'state-7');
      gnb.classList.add('state-scrolled');
    } else if (currentVariant !== 6) {
      /* 히어로 위 → 이미지 위 GNB 유지 */
      gnb.classList.remove('state-scrolled', 'state-6');
      gnb.classList.add('state-7');
    }

    ticking = false;
  }

  /* ═══════════════════════════════════════
     4. Reveal (스크롤 등장 애니메이션)
  ═══════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  /* ═══════════════════════════════════════
     5. 언어 토글
  ═══════════════════════════════════════ */
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ═══════════════════════════════════════
     6. Init
  ═══════════════════════════════════════ */
  // 초기 상태: Variant 6
  setVariant(6);

  // DOM 완성 후 인트로 시작
  window.addEventListener('load', playIntro);

  // 스크롤 이벤트
  window.addEventListener('scroll', onScroll, { passive: true });

})();
