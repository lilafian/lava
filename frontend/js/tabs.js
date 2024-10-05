import { generateID } from "./math.js";
import { startMonitors } from "./wvMonitoring.js";

export const tabContainer = document.getElementById('tab-container');

let scrollAmount = 0;
let isScrolling = false;

function smoothScroll() {
    if (scrollAmount !== 0) {
        tabContainer.scrollLeft += scrollAmount;
        scrollAmount = 0;
    }
    isScrolling = false;
}

tabContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollAmount += (e.shiftKey ? e.deltaY : (e.deltaX || e.deltaY)) * 0.5;

    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
    }
}, { passive: false });

export function createTab(url) {
    if (document.querySelector(".tab-current")) {
        document.querySelector(".tab-current").classList.remove("tab-current");
    }

    let currentWV = document.querySelector(".webcontent")
    if (currentWV) {
        currentWV.classList.remove("webcontent");
        currentWV.classList.add("wv-inactive");
    }
    

    console.log("Creating tab");
    let tabID = generateID(6);
    let newTab = document.createElement("div");
    newTab.classList.add("tab");
    newTab.classList.add("tab-current");
    newTab.id = `${tabID}-tab`;
    newTab.innerHTML = `
                    <div class="tab-name">
                        <img class="tab-icon" src="imgs/logo.ico">
                        <p class="tab-title">New Tab</p>
                    </div>
                    <i class="fa-solid fa-xmark button-tab-close button-hdr"></i>
    `;
    newTab.setAttribute("data-tab-id", tabID);

    newTab.addEventListener('click', () => {
        setCurrentTab(newTab);
    });
    

    let newWebview = document.createElement("webview");
    newWebview.classList.add("webcontent");
    newWebview.id = `${tabID}-web`;
    newWebview.src = url;
    newWebview.setAttribute('allowpopups', '');
    newWebview.setAttribute('data-aos', 'fade-up');
    newWebview.setAttribute('data-aos-duration', '1500');
    newWebview.addEventListener("did-finish-load", () => {
        let currentTab = document.querySelector(".tab-current");
        document.title = newWebview.getTitle() + " - Lava";
        let tabName = currentTab.querySelector(".tab-name");
        tabName.querySelector(".tab-title").textContent = newWebview.getTitle();
        tabName.querySelector(".tab-icon").src = `https://s2.googleusercontent.com/s2/favicons?domain=${newWebview.src}`;
        let urlBar = document.querySelector("#url-input");
        urlBar.value = newWebview.src;
    });
    

    newTab.querySelector(".button-tab-close").addEventListener('click', (event) => {
        event.stopPropagation();
        newWebview.remove();
        newTab.remove();
        let newCurrentTab = document.querySelector(".tab");
        if (newCurrentTab) {
            setCurrentTab(newCurrentTab);
        } else {
            window.electronAPI.quit();
        }
    });

    tabContainer.appendChild(newTab);
    document.body.appendChild(newWebview);
    console.log("Tab created with ID " + tabID);
    newWebview.addEventListener("dom-ready", () => {
        startMonitors(newWebview);
    });
}

export function setCurrentTab(tab) {
    if (!tab) return;
    let currentTab = document.querySelector(".tab-current");
    let currentWV = document.querySelector(".webcontent")

    let tabWV = document.querySelector(`#${tab.getAttribute("data-tab-id")}-web`);
    if (tab === currentTab) {
        return;
    }

    if (currentTab) {
        currentTab.classList.remove("tab-current");
    }
    tab.classList.add("tab-current");

    if (currentWV) {
        currentWV.classList.remove("webcontent");
        currentWV.classList.add("wv-inactive");
    }

    tabWV.classList.add("webcontent");
    tabWV.classList.remove("wv-inactive");
    tabWV.removeAttribute("data-aos");
    tabWV.removeAttribute("data-aos-duration");
    document.title = tabWV.getTitle() + " - Lava";
    let urlBar = document.querySelector("#url-input");
    urlBar.value = tabWV.src;
}