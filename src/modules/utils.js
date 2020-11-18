/**
 * This file provides utility functions.
 *
 * @author Griffin Yacynuk
 * @since  1.0.1
 */

/**
 * Read stored data from local storage. Converts the default callback style into a Promise.
 *
 * @param {any} key the key of the stored datum.
 */
export const getStorageData = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)))

/**
 * Save data to local storage. Converts the default callback style into a Promise.
 *
 * @param {any} data the data to be stored.
 */
export const setStorageData = data =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(data, () =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve()))

/**
 * Get the current tab. Converts the default callback style into a Promise.
 */
export const getCurrentTab = () =>
    new Promise((resolve, reject) =>
        chrome.tabs.query({ active: true, currentWindow: true }, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result[0])))

/**
 * Get the current tab as reported by the background script. Converts the default callback style into a Promise.
 */
export const getCurrentTabFromBackgroundScript = () =>
    new Promise((resolve, reject) =>
        chrome.runtime.sendMessage({ type: "tab_id_req" }, res =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(res)))
