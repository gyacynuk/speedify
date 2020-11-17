import { getStorageData, setStorageData, getCurrentTab } from './modules/utils';


const MAX_SPEED = 300;
const MIN_SPEED = 10;
const NORMAL_SPEED = 100;
const SPEED_INCREMENT = 10;

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
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : NORMAL_SPEED;

  if (!isActive) return;

  let newSpeed = playbackSpeed + increment
  if (newSpeed < MIN_SPEED) newSpeed = MIN_SPEED;
  if (newSpeed > MAX_SPEED) newSpeed = MAX_SPEED;

  setStorageData({ tabData: { ...tabData, [id]: { playbackSpeed: newSpeed, isActive: isActive } } });
  label.innerHTML = newSpeed + '%'
  sendPlaybackSpeedMessage(newSpeed);
}

const toggleIsActive = () => async function (e) {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : NORMAL_SPEED;

  setStorageData({ tabData: { ...tabData, [id]: { playbackSpeed: playbackSpeed, isActive: !isActive } } });
  sendPlaybackSpeedMessage(isActive ? NORMAL_SPEED : playbackSpeed);
  setDisabled(isActive);
}

document.addEventListener('DOMContentLoaded', async function () {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : NORMAL_SPEED;

  let playbackSpeedLabel = document.getElementById('playbackSpeedLabel');
  playbackSpeedLabel.innerHTML = playbackSpeed + '%'

  let minusButton = document.getElementById('minus');
  minusButton.addEventListener('click', adjustPlaybackSpeed(playbackSpeedLabel, -SPEED_INCREMENT));
  let plusButton = document.getElementById('plus');
  plusButton.addEventListener('click', adjustPlaybackSpeed(playbackSpeedLabel, SPEED_INCREMENT));

  let toggle = document.getElementById('toggle');
  let toggleLabel = document.getElementById('toggleLabel');
  toggle.checked = isActive;
  setDisabled(!isActive);
  toggleLabel.addEventListener('click', toggleIsActive());
});