import { listenForStatus } from "./status.js";
import { createTab } from "./tabs.js";

let isGlobalNTListenerSet = false;
function setupGlobalNewWindowListener() {
    if (!isGlobalNTListenerSet) {
        window.electronAPI.onInterceptedUrl((event, url) => {
            console.log('Intercepted URL:', url);
            createTab(url);
        });
        isGlobalNTListenerSet = true;
    }
}


export function startNewTabMonitor(webview) {
    console.log("Setting up new-window event listener for webview:", webview.id);
    
    setupGlobalNewWindowListener();

    webview.addEventListener('new-window', (event) => {
        event.preventDefault();
        console.log('New window prevented for URL:', event.url);
        createTab(event.url);
    });
}

export function startFullscreenMonitor(webview) {
    console.log("Started fullscreen event listener for webview:", webview.id);

    const header = document.querySelector(".header");

    webview.addEventListener("enter-html-full-screen", () => {
        if (header) header.classList.add("hidden");
    });

    webview.addEventListener("leave-html-full-screen", () => {
        if (header) header.classList.remove("hidden");
    });
}

export function startMonitors(webview) {
    console.log("Started monitoring webview " + webview.id);

    webview.addEventListener('dom-ready', () => {
        console.log("Webview DOM is ready for " + webview.id);
        listenForStatus(webview);
        console.log("About to call startNewTabMonitor for " + webview.id);
        startNewTabMonitor(webview);
        console.log("About to call startFullscreenMonitor for " + webview.id);
        startFullscreenMonitor(webview);
        console.log("Finished setting up monitors for " + webview.id);
    });
}
