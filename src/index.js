import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  clearGalleryContent,
  onRenderSearchMarkup,
} from './js/RenderSearchMarkup';
import { initLightBox } from './js/initLightBox';
import { jumpUp } from './js/jumpUp';
import { addHiddenLoader, removeHiddenLoader } from './js/loadMore';
import { searchPhotoApi } from './js/pixabay-api';

const elements = {
  form: document.querySelector('.search-form'),
  upBtn: document.querySelector('.up-btn'),
  load: document.querySelector('.load'),
  loadMore: document.querySelector('.loader'),
};

const { searchQuery } = elements.form.elements;

const errorMessage =
  'Sorry, there are no images matching your search query. Please try again.';
const endResult = "We're sorry, but you've reached the end of search results.";
const enterValue = 'Please enter a search value';
let inputValue = null;
let shownPage = 1;
let totalPages = 0;

let options = {
  root: null,
  rootMargin: '50px',
  threshold: 0.5,
};

const handlerSubmit = async event => {
  event.preventDefault();
  inputValue = searchQuery.value.trim();
  shownPage = 1;

  if (!inputValue) {
    return Notify.failure(enterValue);
  }
  removeHiddenLoader();
  try {
    const response = await searchPhotoApi(inputValue, shownPage);

    if (response.totalHits < 1) {
      return Notify.failure(errorMessage);
    }
    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    jumpUp();
    addHiddenLoader();
    clearGalleryContent();
    onRenderSearchMarkup(response);
    initLightBox();
    observer.observe(elements.load);

    totalPages = Math.ceil(response.totalHits / 40);
    if (totalPages > 1) {
      removeHiddenLoader();
    }
  } catch (error) {
    Notify.failure(error.message);
  }
};

const handlerOnloadMore = async () => {
  removeHiddenLoader();
  try {
    shownPage += 1;
    const response = await searchPhotoApi(inputValue, shownPage);
    addHiddenLoader();
    onRenderSearchMarkup(response);
    initLightBox();

    if (shownPage === totalPages) {
      Notify.failure(endResult);
    }
  } catch (error) {
    Notify.failure(error.message);
  }
};

const onInfiniteScroll = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (shownPage === totalPages) {
        addHiddenLoader();
        observer.unobserve(elements.load);
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      handlerOnloadMore();
    }
  });
};

elements.form.addEventListener('submit', handlerSubmit);
elements.upBtn.addEventListener('click', jumpUp);
let observer = new IntersectionObserver(onInfiniteScroll, options);
