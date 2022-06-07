export default function markup(data) {
    return data
      .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
    <div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b class="name-text">Likes: <b class="description-text">${likes}</b></b>
        </p>
        <p class="info-item">
          <b class="name-text">Views: <b class="description-text">${views}</b></b>
        </p>
        <p class="info-item">
          <b>Comments: <b class="description-text">${comments}</b></b>
        </p>
        <p class="info-item">
          <b>Downloads: <b class="description-text">${downloads}</b></b>
        </p>
      </div>
    </div>`;
      })
      .join('');
  }