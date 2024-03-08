const elements = {
  loadMore: document.querySelector('.loader'),
};

const addHiddenLoader = () => {
  elements.loadMore.classList.add('is-hidden');
};
const removeHiddenLoader = () => {
  elements.loadMore.classList.remove('is-hidden');
};

export { addHiddenLoader, removeHiddenLoader };
