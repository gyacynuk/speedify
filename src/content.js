/**
 * This file defines a content script injected into the DOM of any Chrome tab. It is used to modify the playback speed
 * of any HTML5 video elements on the page.
 *
 * @author Griffin Yacynuk
 * @since  1.0.0
 */
import { getStorageData, getCurrentTabFromBackgroundScript } from './modules/utils';


/**
 * Sets the playback speed of all HTML5 video elements currently in the DOM.
 *
 * @param {Number} playbackSpeed playback speed represented as a percentage.
 */
const setPlaybackSpeed = playbackSpeed => {
  document.querySelectorAll('video').forEach(video => video.playbackRate = playbackSpeed/100);
}

/*
 * Add a message listener which listens for playback speed updates from the popup.js file, and applies them to all HTML5
 * video elements currently in the DOM. 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!sender.tab  && request.type == "setPlaybackSpeed") {
    setPlaybackSpeed(request.playbackSpeed);
  }
});

/*
 * When the current page loads, check to see if the user has any active playback speed modifications associated with the
 * current tab. If so, apply them. This enables the user's preferred playback speed to persist across page reloads, as
 * well as page navigation.
 */
document.addEventListener('DOMContentLoaded', async function () {
  const { id } = await getCurrentTabFromBackgroundScript();
  const { tabData } = await getStorageData('tabData');
  if (tabData[id]) {
    const { playbackSpeed, isActive } = tabData[id];
    if (isActive) {
      setPlaybackSpeed(playbackSpeed);
    } else {
      setPlaybackSpeed(100);
    }
  }  
});