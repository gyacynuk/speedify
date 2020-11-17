import { getStorageData, setStorageData, getCurrentTab } from './modules/utils';


const setDisabled = state => {
  if (state) {
    document.querySelectorAll('.enabled').forEach(el => (el.className = el.className.replace('enabled', 'disabled')));
  } else {
    document.querySelectorAll('.disabled').forEach(el => (el.className = el.className.replace('disabled', 'enabled')));
  }
}

const sendPlaybackSpeedMessage = playbackSpeed => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'setPlaybackSpeed', playbackSpeed: playbackSpeed }, null);
    }
  });
}

const adjustPlaybackSpeed = (label, increment) => async function (e) {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : 100;

  if (!isActive) return;

  let newSpeed = playbackSpeed + increment
  if (newSpeed < 10) newSpeed = 10;
  if (newSpeed > 300) newSpeed = 300;

  setStorageData({ tabData: { ...tabData, [id]: { playbackSpeed: newSpeed, isActive: isActive } } });
  label.innerHTML = newSpeed + '%'
  sendPlaybackSpeedMessage(newSpeed);
}

const toggleIsActive = () => async function (e) {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : 100;

  setStorageData({ tabData: { ...tabData, [id]: { playbackSpeed: playbackSpeed, isActive: !isActive } } });
  sendPlaybackSpeedMessage(isActive ? 100 : playbackSpeed);
  setDisabled(isActive);
}

document.addEventListener('DOMContentLoaded', async function () {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : 100;

  let playbackSpeedLabel = document.getElementById('playbackSpeedLabel');
  playbackSpeedLabel.innerHTML = playbackSpeed + '%'

  let minusButton = document.getElementById('minus');
  minusButton.addEventListener('click', adjustPlaybackSpeed(playbackSpeedLabel, -10));
  let plusButton = document.getElementById('plus');
  plusButton.addEventListener('click', adjustPlaybackSpeed(playbackSpeedLabel, 10));

  let toggle = document.getElementById('toggle');
  let toggleLabel = document.getElementById('toggleLabel');
  toggle.checked = isActive;
  setDisabled(!isActive);
  toggleLabel.addEventListener('click', toggleIsActive());
});