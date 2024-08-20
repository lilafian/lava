import { createTab } from "./tabs.js";

export let PI_back = document.getElementById("go-back");
export let PI_forward = document.getElementById("go-forward");
export let PI_refresh = document.getElementById("refresh");

export function setupPageInteractionButtons() {
    PI_back.addEventListener("click", () => {
        let webContents = document.querySelector(".webcontent");
        webContents.goBack();
    });

    PI_forward.addEventListener("click", () => {
        let webContents = document.querySelector(".webcontent");
        webContents.goForward();
    });

    PI_refresh.addEventListener("click", () => {
        let webContents = document.querySelector(".webcontent");
        webContents.reload();
    });
}

export let TI_new = document.getElementById("newtab-btn");

export function setupTabInteractionButtons() {
    TI_new.addEventListener("click", () => {
        createTab("https://www.google.com");
    });
}