import { setVersionStatus, listenForStatus } from "./status.js";
import { setupPageInteractionButtons, setupTabInteractionButtons } from "./buttons.js";
import { createTab } from "./tabs.js";

setVersionStatus();
setupPageInteractionButtons();
setupTabInteractionButtons();
createTab();

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

    const domainRegex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
    if (domainRegex.test(input)) {
        return "url";
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

listenForStatus(document.querySelector(".webcontent"));