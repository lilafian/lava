export function createSidebar(id, content) {
    if (getActiveSidebar()) {
        removeSidebar(getActiveSidebar());
    }

    let sidebar = document.createElement("div");
    sidebar.id = id;
    sidebar.classList.add("sidebar");
    sidebar.innerHTML = content;
    sidebar.style.transform = "translateX(100%)";
    document.body.appendChild(sidebar);
    
    sidebar.offsetHeight;
    
    sidebar.style.transform = "translateX(0)";
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            removeSidebar(sidebar);
        }
    });

    return sidebar;
}

export function removeSidebar(sidebar) {
    sidebar.style.transform = "translateX(100%)";
    
    setTimeout(() => {
        sidebar.remove();
        document.removeEventListener("click", sidebar.handleClick);
    }, 725);
}

export function getActiveSidebar() {
    return document.querySelector(".sidebar");
}
