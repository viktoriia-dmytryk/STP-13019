const features = document.querySelector('.features');
const slider = document.querySelector('.features-slider');
const slides = [...document.querySelectorAll('.features-slide')];
const prevButton = document.querySelector('.features-nav-prev');
const nextButton = document.querySelector('.features-nav-next');
const pagination = document.querySelector('.features-pagination');
const mobileMedia = window.matchMedia('(max-width: 767px)');

let activeIndex = mobileMedia.matches ? 4 : 2;
let pointerStartX = 0;
let pointerCurrentX = 0;
let isDragging = false;

const getOffset = index => {
  const total = slides.length;
  const rawOffset = (index - activeIndex + total) % total;

  return rawOffset > total / 2 ? rawOffset - total : rawOffset;
};

const renderFeaturesSlider = () => {
  const activeDotIndex = mobileMedia.matches
    ? (activeIndex + slides.length - 2) % slides.length
    : activeIndex;

  slides.forEach((slide, index) => {
    const offset = getOffset(index);

    slide.dataset.position = String(offset);
    slide.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
  });

  pagination
    ?.querySelectorAll('.features-pagination-dot')
    .forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeDotIndex);
    });
};

const createPagination = () => {
  if (!pagination) {
    return;
  }

  pagination.innerHTML = slides
    .map(
      (_, index) =>
        `<button class="features-pagination-dot" type="button" aria-label="Show feature ${index + 1}"></button>`
    )
    .join('');

  pagination
    .querySelectorAll('.features-pagination-dot')
    .forEach((dot, index) => {
      dot.addEventListener('click', () => {
        activeIndex = mobileMedia.matches
          ? (index + 2) % slides.length
          : index;
        renderFeaturesSlider();
      });
    });
};

const showPreviousFeature = () => {
  activeIndex = (activeIndex - 1 + slides.length) % slides.length;
  renderFeaturesSlider();
};

const showNextFeature = () => {
  activeIndex = (activeIndex + 1) % slides.length;
  renderFeaturesSlider();
};

if (features && slides.length) {
  createPagination();
  renderFeaturesSlider();

  prevButton?.addEventListener('click', showPreviousFeature);
  nextButton?.addEventListener('click', showNextFeature);

  slider?.addEventListener('pointerdown', event => {
    pointerStartX = event.clientX;
    pointerCurrentX = event.clientX;
    isDragging = true;
    slider.setPointerCapture(event.pointerId);
  });

  slider?.addEventListener('pointermove', event => {
    if (!isDragging) {
      return;
    }

    pointerCurrentX = event.clientX;
  });

  slider?.addEventListener('pointerup', event => {
    if (!isDragging) {
      return;
    }

    const swipeDistance = pointerCurrentX - pointerStartX;

    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance > 0) {
        showPreviousFeature();
      } else {
        showNextFeature();
      }
    }

    isDragging = false;
    slider.releasePointerCapture(event.pointerId);
  });

  slider?.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  mobileMedia.addEventListener('change', event => {
    activeIndex = event.matches ? 4 : 2;
    renderFeaturesSlider();
  });
}
