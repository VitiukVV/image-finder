const upBtn = document.querySelector('.up-btn');

export const jumpUp = () => {
  const scrollTop = document.documentElement.scrollHeight;
  window.scrollBy({
    top: -scrollTop,
    behavior: 'smooth',
  });
};

setInterval(() => {
  const scrolledDistance = window.scrollY;

  scrolledDistance >= 600
    ? upBtn.classList.remove('is-hidden')
    : upBtn.classList.add('is-hidden');
}, 1000);
