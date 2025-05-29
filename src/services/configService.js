let configCache = null;

export async function loadAppConfig() {
    if (configCache) return configCache;

    const res = await fetch("/config.json");
    if (!res.ok) throw new Error("Failed to load config");

    configCache = await res.json();
    return configCache;
}
