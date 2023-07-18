const modal = document.querySelector('#modal');
const modalShow = document.querySelector('#show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on Inputs on the Form
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Function - Storing the Bookmarks
function storeBookmark(e) {
  // Stopping the Page from Reloading
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  bookmarks.push({ name: nameValue, url: urlValue });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  bookmarkForm.reset();
  websiteNameEl.focus();
  buildBookmarks();
}

// Function - Validation Form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please provide both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('please provide a valid web address');
    return false;
  }
  return true;
}

// Fethcing the BookMarks
function fetch() {
  // If available then fetch the bookmarks
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    return false;
  }
  buildBookmarks();
}

// Buidling the Bookmarks
function buildBookmarks() {
  bookmarksContainer.innerHTML = '';
  // Build our Items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Creating a Div Element
    const item = document.createElement('div');
    item.classList.add('item');
    // Close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon - Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute(
      'src',
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');
    //Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Append Bookmarks Container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Deleting a bookmarks
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  //   Update Bookmarks Array to reflect that we removed the item
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetch();
}

// Event Listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
});
window.addEventListener('click', (e) => {
  e.target === modal ? modal.classList.remove('show-modal') : false;
});
bookmarkForm.addEventListener('submit', storeBookmark);

// Running the Function
fetch();
