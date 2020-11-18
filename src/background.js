/**
 * This file defines a background script for the Chrome extension. This is used to hook into lifecycle events, or events
 * that transcend the logical scope of a single Chrome tab.
 *
 * @author Griffin Yacynuk
 * @since  1.0.0
 */
import { getStorageData, setStorageData } from './modules/utils';


/*
 * Listen for the install event, and setup the schema used for local data storage.
 */
chrome.runtime.onInstalled.addListener(function () {
  setStorageData({ tabData: {} });
});

/*
 * A message listener which allows a content script to determine the ID of the tab in which it is executing in.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type == 'tab_id_req') {
    sendResponse({ type: 'tab_id_res', id: sender.tab.id });
  }
});

/*
 * Listen for when a Chrome tab is closed, and free all memory associated with it. 
 */
chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {
  // If this boolean is set to true, then the entire window is closing. Take no action here, as all data will be freed
  // in the `windows.onRemoved` event listener.
  if (removeInfo.isWindowClosing) return;

  let { tabData } = await getStorageData('tabData');
  let id = tabId || 0;
  let { [id]: omit, ...rest } = tabData;
  setStorageData({ tabData: rest })
})

/*
 * Listen for when the Chrome window is closed, and free all stored data.
 */
chrome.windows.onRemoved.addListener(function (windowid) {
  setStorageData({ tabData: {} });
})