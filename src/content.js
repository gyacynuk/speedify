import { getStorageData, getCurrentTabFromBackgroundScript } from './modules/utils';


const setPlaybackSpeed = playbackSpeed => {
  document.querySelectorAll('video').forEach(video => video.playbackRate = playbackSpeed/100);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!sender.tab  && request.type == "setPlaybackSpeed") {
    setPlaybackSpeed(request.playbackSpeed);
  }
});

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