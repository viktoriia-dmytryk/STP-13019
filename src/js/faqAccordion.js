const faqItems = document.querySelectorAll('[data-faq-item]');

faqItems.forEach(item => {
  const button = item.querySelector('[data-faq-toggle]');
  const answer = item.querySelector('[data-faq-answer]');

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!isOpen));

    if (isOpen) {
      item.classList.remove('is-open');
      window.setTimeout(() => {
        if (button.getAttribute('aria-expanded') === 'false') {
          answer.hidden = true;
        }
      }, 260);
      return;
    }

    answer.hidden = false;
    requestAnimationFrame(() => {
      item.classList.add('is-open');
    });
  });
});
