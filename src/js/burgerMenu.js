const openBtnEl = document.querySelector('[data-action="open"]');
const closeBtnEl = document.querySelector('[data-action="close"]');
const burgerMenuEl = document.querySelector('[data-visible]');
const headerEl = document.querySelector('[data-el="header"]');
const navLinkEls = burgerMenuEl.querySelectorAll(
  '[data-scrolling="scroll-to-section"]'
);

let isOpen = false;

function openMenu() {
  burgerMenuEl.dataset.visible = 'open';
  headerEl.dataset.menu = 'open';
  isOpen = true;
}

function closeMenu() {
  burgerMenuEl.dataset.visible = 'close';
  headerEl.dataset.menu = 'close';
  isOpen = false;
}

openBtnEl.addEventListener('click', openMenu);
closeBtnEl.addEventListener('click', closeMenu);

document.addEventListener('click', event => {
  if (!isOpen) {
    return;
  }

  if (!headerEl.contains(event.target)) {
    closeMenu();
  }
});

navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    }
  });
});

const desktopMedia = window.matchMedia('(min-width: 1440px)');
desktopMedia.addEventListener('change', event => {
  if (event.matches && isOpen) {
    closeMenu();
  }
});
