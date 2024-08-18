async function getVersion() {
    try {
        const version = await window.electronAPI.getVersion();
        return version;
    } catch (error) {
        console.error("Error fetching version:", error);
        throw error;
    }
}

export default getVersion;
