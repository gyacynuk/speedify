export const getStorageData = key =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)))

export const setStorageData = data =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.set(data, () =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve()))

export const getCurrentTab = () =>
    new Promise((resolve, reject) =>
        chrome.tabs.query({ active: true, currentWindow: true }, result =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result[0])))

export const getCurrentTabFromBackgroundScript = () =>
    new Promise((resolve, reject) =>
        chrome.runtime.sendMessage({ type: "tab_id_req" }, res =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(res)))
