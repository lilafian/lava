import { createSidebar } from './sidebars.js';
import { createTab } from './tabs.js';

let bookmarkButton = document.getElementById('bookmarks');

export async function openBookmarksSidebar() {
    let bookmarks = await window.electronAPI.getBookmarks(true);
    bookmarks = bookmarks.bookmarks; // wtf

    function createBookmarkElement(bookmark) {
        let title = bookmark.title;
        let url = bookmark.url;

        let iconElement = document.createElement('img');
        iconElement.classList.add("bookmark-icon");
        iconElement.src = "https://www.google.com/s2/favicons?domain=" + url;

        let titleElement = document.createElement('p');
        titleElement.classList.add("bookmark-title");
        titleElement.textContent = title;

        let bookmarkElement = document.createElement('div');
        bookmarkElement.classList.add("bookmark");
        bookmarkElement.appendChild(iconElement);
        bookmarkElement.appendChild(titleElement);
        bookmarkElement.setAttribute("data-url", url);

        bookmarkElement.addEventListener('click', () => {
            createTab(url);
        });
        

        return bookmarkElement;
    }

    let sidebar = createSidebar("bookmarks", `
        <h1><i class="fa-solid fa-star"></i> Bookmarks</h1>
    `);
    
    for (let bookmark of bookmarks) {
        sidebar.appendChild(createBookmarkElement(bookmark));
    }
}

export async function initBookmarks() {
    let bookmarks = await window.electronAPI.getBookmarks(true);
    bookmarks = bookmarks.bookmarks; // wtf

    console.log(bookmarks);
    
    bookmarkButton.addEventListener('click', async () => {
        openBookmarksSidebar();
    });
}
