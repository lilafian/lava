import { createSidebar } from './sidebars.js';

let infoButton = document.getElementById("info");

export async function openInfoSidebar() {
    let sidebar = createSidebar("info", `
        <h1><i class="fa-solid fa-circle-info"></i> Info / Changelog</h1>
        <img src="imgs/logo-type.png" alt="Lava logo"/>
        <p class="sidebar-center-text-bold">by</p>
        <img class="sidebar-logo-img-small" src="imgs/smslogo.png" alt="Strawberry Milk Software logo"/>
        <hr>
        <p class="sidebar-center-text-bold">Lava is developed by Strawberry Milk Software under the MIT license. It is open-source software, and collects no data outside of saved settings and/or bookmarks.</p>
        <hr>
        <p class="sidebar-center-text-bold">lava v1.0.0</p>
        <hr>
        <p>No changelog yet...</p>
        <p>I KNOW THIS PAGE IS UGLY OK ILL FIX IT NEXT VERSION</p>
    `);
}

export async function initInfoSidebar() {
    infoButton.addEventListener("click", () => {
        openInfoSidebar();
    });
}