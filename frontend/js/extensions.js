export async function getExtensions() {
    const extensions = await window.electronAPI.getExtensions(false);
    return extensions;
}

export async function loadAllClientExtensions() {
    const extensions = await getExtensions();
    const clientExtensions = extensions.client;
    for (const extensionId in clientExtensions) {
        const extension = clientExtensions[extensionId];
        console.log(`Loading extension ${extension.name} (ID ${extension.id})`);
        try {
            const executeExtension = new Function(extension.exec);
            executeExtension();
        } catch (err) {
            console.error(`An error occurred loading extension ${extension.name} (ID ${extension.id}):\n${err}`)
        }
    }
}