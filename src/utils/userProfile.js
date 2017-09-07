export function setProfile(profile) {
    sessionStorage.setItem(SCHOOLPAL_CONFIG.SESSION_STORAGE_KYENAME, JSON.stringify(profile));
}

export function getProfile() {
    if (sessionStorage.getItem(SCHOOLPAL_CONFIG.SESSION_STORAGE_KYENAME)) {
        return JSON.parse(sessionStorage.getItem(SCHOOLPAL_CONFIG.SESSION_STORAGE_KYENAME))
    } else {
        return null;
    }
}

export function clearProfile() {
    sessionStorage.removeItem(SCHOOLPAL_CONFIG.SESSION_STORAGE_KYENAME);
}