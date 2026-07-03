const openBtnEl = document.querySelector('[data-action="open"]');
const closeBtnEl = document.querySelector('[data-action="close"]');
const burgerMenuEl = document.querySelector('[data-visible]');
const headerEl = document.querySelector('[data-el="header"]');

openBtnEl.addEventListener('click', () => {
  burgerMenuEl.dataset.visible = 'open';
  headerEl.dataset.menu = 'open';
});

closeBtnEl.addEventListener('click', () => {
  burgerMenuEl.dataset.visible = 'close';
  headerEl.dataset.menu = 'close';
});
