import getVersion from "./version.js";
import { createTab } from "./tabs.js";

let lavaVersion = await getVersion();

export function getStatusElement() {
    return document.getElementById("status-text");
}

export function updateStatus(statusText) {
    const statusElement = getStatusElement();
    statusElement.textContent = statusText;
}

export function setVersionStatus() {
    updateStatus(`Lava v${lavaVersion}`);
}

export function listenForStatus(wv) {
    wv.addEventListener("did-finish-load", () => {
        updateStatus(`Lava v${lavaVersion}`);
    });

    wv.addEventListener("did-start-loading", () => {
        updateStatus("Loading...");
    });

    wv.addEventListener("did-stop-loading", () => {
        updateStatus(`Lava v${lavaVersion}`);
    });

    wv.addEventListener("new-window", (event, url) => {
        event.preventDefault();
        createTab(url);
    });
}