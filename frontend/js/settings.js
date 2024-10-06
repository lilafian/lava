import { createSidebar } from './sidebars.js';

let menuButton = document.getElementById("menu");

export async function getSettings() {
    return window.electronAPI.getSettings(true);
}

export async function openSettingsSidebar() {
    let settings = await getSettings();
    
    let sidebar = createSidebar("settings", `
        <h1><i class="fa-solid fa-gear"></i> Settings</h1>
        <h2><i class="fa-solid fa-paintbrush"></i> Theme</h2>
        <p class="code">Theme settings are not yet implemented.</p>
        <h2><i class="fa-solid fa-code"></i> Developer Options</h2>
        <p class="code" id="settingsJson">Click to reveal settings JSON...</p>
    `);

    document.getElementById("settingsJson").addEventListener("click", () => {
        document.getElementById("settingsJson").innerText = JSON.stringify(settings);
    });

}

export async function initSettingsSidebar() {
    menuButton.addEventListener("click", () => {
        openSettingsSidebar();
    });
}