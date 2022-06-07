
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix';

import "simplelightbox/dist/simple-lightbox.min.css";

import ServiceAPI from './service-api';
import markup from './markup';

const searchForm = document.querySelector('.search-form');
const searchButton = document.querySelector('[type=submit]');
const gallery = document.querySelector('.gallery');



const options = {
  simpleLightBox: {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  },
  intersectionObserver: {
    root: null,
    threshold: 1,
  },
};

const loadService = new ServiceAPI();

// Array.observe() - використовується для асинхронного огляду змін в масивах, подібно до того, як метод Object.observe() використовується для тих же цілей для об'єктів. Він надає потік змін в порядку їх виникнення.
// The IntersectionObserver method unobserve() instructs the IntersectionObserver to stop observing the specified target element.
// Observer pattern. Он позволяет делать связи один ко многим между компонентами.


searchForm.addEventListener('submit', onFormSubmit);

const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    observer.unobserve(entries[0].target);
    loadPictures();
  }
};
const observer = new IntersectionObserver(callback, options.intersectionObserver);

let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function onFormSubmit(e) {
  e.preventDefault();

  const isFilled = e.currentTarget.elements.searchQuery.value;
  if (isFilled) {
    searchButton.disabled = true;
    loadService.searchQuery = isFilled;
    loadService.resetPage();
    gallery.innerHTML = '';
    loadPictures();
  }
}

function loadPictures() {
  loadService
    .getPictures()
    .then(dataProcessing)
    .catch(error => {
      console.log(error);
      Notify.failure('Something went wrong, please try again...');
    });
}

function dataProcessing(data) {
  searchButton.disabled = false;
  if (data.data.totalHits === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  if (data.data.totalHits !== 0 && data.data.hits.length === 0) {
    Notify.warning(`We're sorry, but you've reached the end of search results.`);
    return;
  }

  gallery.insertAdjacentHTML('beforeend', markup(data.data.hits));

  galleryLightBox.refresh();

  if (loadService.pageNumber === 2) {
    Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
  } 
  
  else {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2 + 120,
      behavior: 'smooth',
    });
  }
  observer.observe(gallery.lastElementChild);
}



// const loadMoreBtn = document.querySelector(".load-more");
// let currentItem = 6;

// onloadMore.onclick = () =>{
//    let boxes = document.querySelector('.photo-card');
//    for (const i = currentItem; i < currentItem + 6; i++){
//       boxes[i].style.display = 'inline-block';
//    }
//    currentItem += 6;

//    if(currentItem >= boxes.length){
//       loadMoreBtn.style.display = 'none';
//    }
// }

