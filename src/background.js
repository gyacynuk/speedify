import { getStorageData, setStorageData } from './modules/utils';


chrome.runtime.onInstalled.addListener(function () {
  setStorageData({ tabData: {} });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type == 'tab_id_req') {
    sendResponse({ type: 'tab_id_res', id: sender.tab.id });
  }
});

chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {
  if (removeInfo.isWindowClosing) return;
  let { tabData } = await getStorageData('tabData');
  let id = tabId || 0;
  let { [id]: omit, ...rest } = tabData;
  setStorageData({ tabData: rest })
})

chrome.windows.onRemoved.addListener(function (windowid) {
  setStorageData({ tabData: {} });
})