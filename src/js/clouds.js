const CLOUDS_CONFIG = [
  { top: 4, rotate: -6, flip: false, sizeRatio: 1.0, opacity: 1 },
  { top: 14, rotate: 10, flip: true, sizeRatio: 0.35, opacity: 1 },
  { top: 24, rotate: -4, flip: false, sizeRatio: 0.15, opacity: 0.9 },
  { top: 33, rotate: 8, flip: false, sizeRatio: 0.05, opacity: 0.85 },
  { top: 42, rotate: -10, flip: true, sizeRatio: 0.55, opacity: 0.9 },
  { top: 53, rotate: 5, flip: false, sizeRatio: 0.25, opacity: 0.85 },
  { top: 64, rotate: -7, flip: false, sizeRatio: 0.8, opacity: 0.9 },
  { top: 76, rotate: 12, flip: true, sizeRatio: 0.1, opacity: 0.8 },
  { top: 88, rotate: -5, flip: false, sizeRatio: 0.45, opacity: 0.85 },
];

const SIZE_MOBILE = { min: 311, max: 538 };
const SIZE_DESKTOP = { min: 739, max: 1563 };
const BREAKPOINT = '(min-width: 1440px)';

const DURATION_MIN = 22; // сек, для найменшої хмаринки (sizeRatio 0)
const DURATION_MAX = 65; // сек, для найбільшої хмаринки (sizeRatio 1)

const IMAGE_BASE_TILT = 9.22;

function getImageRotation(cfg) {
  return cfg.flip ? IMAGE_BASE_TILT : -IMAGE_BASE_TILT;
}

const CLOUD_WEBP_SRCSET =
  '/img/webp/cloud@1x.webp 1x, /img/webp/cloud@2x.webp 2x';
const CLOUD_PNG_SRCSET = '/img/png/cloud@1x.png 1x, /img/png/cloud@2x.png 2x';
const CLOUD_PNG_SRC = '/img/png/cloud@1x.png';

function getWidthForRatio(ratio) {
  const isDesktop = window.matchMedia(BREAKPOINT).matches;
  const { min, max } = isDesktop ? SIZE_DESKTOP : SIZE_MOBILE;
  return min + ratio * (max - min);
}

function getDurationForRatio(ratio) {
  return DURATION_MIN + ratio * (DURATION_MAX - DURATION_MIN);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initCloudsFlight() {
  const layer = document.createElement('div');
  layer.className = 'clouds-layer';
  layer.setAttribute('aria-hidden', 'true');

  const isDesktop = window.matchMedia(BREAKPOINT).matches;
  const activeConfig = isDesktop
    ? CLOUDS_CONFIG
    : CLOUDS_CONFIG.filter((_, i) => i % 2 === 0);

  const order = shuffle(activeConfig.map((_, i) => i));
  const slotSize = 1 / activeConfig.length;

  const clouds = activeConfig.map((cfg, i) => {
    const widthPx = getWidthForRatio(cfg.sizeRatio);

    const anchor = document.createElement('div');
    anchor.className = 'cloud-anchor';
    anchor.style.top = cfg.top + '%';
    anchor.style.opacity = cfg.opacity ?? 1;
    anchor.style.width = widthPx + 'px';

    const wrap = document.createElement('div');
    wrap.className = 'cloud-wrap';

    const duration = getDurationForRatio(cfg.sizeRatio);
    wrap.style.animationDuration = duration + 's';

    const jitter = (Math.random() - 0.5) * slotSize * 0.8;
    const startFraction = (order[i] * slotSize + jitter + 1) % 1;
    wrap.style.animationDelay = -(startFraction * duration) + 's';

    const picture = document.createElement('picture');

    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = CLOUD_WEBP_SRCSET;

    const img = document.createElement('img');
    img.src = CLOUD_PNG_SRC;
    img.srcset = CLOUD_PNG_SRCSET;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.fetchPriority = 'low';

    const flip = cfg.flip ? ' scaleX(-1)' : '';
    img.style.transform = `rotate(${getImageRotation(cfg)}deg)${flip}`;

    picture.appendChild(source);
    picture.appendChild(img);
    wrap.appendChild(picture);
    anchor.appendChild(wrap);
    layer.appendChild(anchor);

    return { anchor, sizeRatio: cfg.sizeRatio };
  });

  document.body.prepend(layer);

  function applyWidths() {
    clouds.forEach(cloud => {
      cloud.anchor.style.width = getWidthForRatio(cloud.sizeRatio) + 'px';
    });
  }

  function syncHeight() {
    layer.style.height = document.body.scrollHeight + 'px';
  }
  syncHeight();

  window.addEventListener('resize', () => {
    applyWidths();
    syncHeight();
  });

  const mq = window.matchMedia(BREAKPOINT);
  const onBreakpointChange = () => {
    mq.removeEventListener('change', onBreakpointChange);
    layer.remove();
    initCloudsFlight();
  };
  mq.addEventListener('change', onBreakpointChange);
}

document.addEventListener('DOMContentLoaded', initCloudsFlight);
