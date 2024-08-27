import { setVersionStatus } from "./status.js";
import { setupPageInteractionButtons, setupTabInteractionButtons } from "./buttons.js";
import { createTab } from "./tabs.js"
import { loadAllClientExtensions } from "./extensions.js";

setVersionStatus();
setupPageInteractionButtons();
setupTabInteractionButtons();
createTab("https://www.google.com");

function isUrlOrSearchTerm(input) {
    input = input.trim();

    if (/^https?:\/\//.test(input)) {
        try {
            new URL(input);
            return "httpUrl";
        } catch (_) {
            return "search";
        }
    }

    const urlRegex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}(\/[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
    if (urlRegex.test(input)) {
        try {
            new URL(`http://${input}`);
            return "url";
        } catch (_) {
            return "search";
        }
    }

    return "search";
}


let urlBar = document.getElementById('url-input');

urlBar.addEventListener('keydown', function(e) {
    if (e.code === "Enter") {
        if (isUrlOrSearchTerm(urlBar.value) === "httpUrl") {
            document.querySelector(".webcontent").loadURL(urlBar.value);
        } else if (isUrlOrSearchTerm(urlBar.value) === "url") {
            document.querySelector(".webcontent").loadURL("http://" + urlBar.value);
        } else {
            document.querySelector(".webcontent").loadURL("https://www.google.com/search?q=" + urlBar.value);
        }
        
    }
});

document.addEventListener("keydown", (e) => {
    if (e.code === "F11") {
        e.preventDefault();
        let webview = document.querySelector(".webcontent");
        let header = document.querySelector(".header");

        if (!document.fullscreenElement) {
            webview.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
            header.classList.add('header-hidden');
        } else {
            document.exitFullscreen().catch(err => {
                console.error(`Error attempting to exit fullscreen mode: ${err.message}`);
            });
            header.classList.remove('header-hidden');
        }
    }
});

loadAllClientExtensions();