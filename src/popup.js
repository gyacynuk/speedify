/**
 * This file defines logic used in the popup window. It is referenced in the popup.html HTML header.
 *
 * @author Griffin Yacynuk
 * @since  1.0.0
 */
import { getStorageData, setStorageData, getCurrentTab } from './modules/utils';å


// Define locally used constants
const MAX_SPEED = 300;
const MIN_SPEED = 10;
const NORMAL_SPEED = 100;
const SPEED_INCREMENT = 10;

/**
 * Sets wheter the UI is in a disabled state or not.
 *
 * @param {boolean} state true if the UI should be disabled, false otherwise.
 */
const setDisabled = state => {
  if (state) {
    document.querySelectorAll('.enabled').forEach(el => (el.className = el.className.replace('enabled', 'disabled')));
  } else {
    document.querySelectorAll('.disabled').forEach(el => (el.className = el.className.replace('disabled', 'enabled')));
  }
}

/**
 * Sends a message to the active Chrome tab to adjust the playback speed of the HTML5 video elements currently in the
 * DOM.
 *
 * @param {Number} playbackSpeed the desired playback speed represented as a percentage.
 */
const sendPlaybackSpeedMessage = playbackSpeed => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'setPlaybackSpeed', playbackSpeed: playbackSpeed }, null);
    }
  });
}

/**
 * Creates a callback which handles the click event when a user tries to increase or decrease the playback speed.
 *
 * @param {HTMLElement} label a reference to the text field/label which displays the current playback speed.
 * @param {Number} increment the increment that this handler should increase the playback speed by in percentage points.
 */
const handleAdjustPlaybackSpeed = (label, increment) => async function (e) {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : NORMAL_SPEED;

  // If the extension is not currently active, then return immediately so that clicking buttons has no effect.
  if (!isActive) return;

  // Compute the new playback speed, ensuring it is withing the interval of valid speeds.
  let newSpeed = playbackSpeed + increment
  if (newSpeed < MIN_SPEED) newSpeed = MIN_SPEED;
  if (newSpeed > MAX_SPEED) newSpeed = MAX_SPEED;

  setStorageData({ tabData: { ...tabData, [id]: { playbackSpeed: newSpeed, isActive: isActive } } });
  label.innerHTML = newSpeed + '%'
  sendPlaybackSpeedMessage(newSpeed);
}

/**
 * Callback which handles when the slider is clicked, enabling or disabling the extension. 
 * 
 * @param {Event} e the click event from the slider.
 */
async function handleIsActiveSlider(e) {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : NORMAL_SPEED;

  setStorageData({ tabData: { ...tabData, [id]: { playbackSpeed: playbackSpeed, isActive: !isActive } } });
  sendPlaybackSpeedMessage(isActive ? NORMAL_SPEED : playbackSpeed);
  setDisabled(isActive);
}

/*
 * Listen for when the popup DOM has finished loading, and then attach event listeners to all interactive components.
 */
document.addEventListener('DOMContentLoaded', async function () {
  const { id } = await getCurrentTab();
  const { tabData } = await getStorageData('tabData');
  let isActive = tabData[id] ? tabData[id]['isActive'] : false;
  let playbackSpeed = tabData[id] ? tabData[id]['playbackSpeed'] : NORMAL_SPEED;

  let playbackSpeedLabel = document.getElementById('playbackSpeedLabel');
  playbackSpeedLabel.innerHTML = playbackSpeed + '%'

  let minusButton = document.getElementById('minus');
  minusButton.addEventListener('click', handleAdjustPlaybackSpeed(playbackSpeedLabel, -SPEED_INCREMENT));
  let plusButton = document.getElementById('plus');
  plusButton.addEventListener('click', handleAdjustPlaybackSpeed(playbackSpeedLabel, SPEED_INCREMENT));

  let toggle = document.getElementById('toggle');
  let toggleLabel = document.getElementById('toggleLabel');
  toggle.checked = isActive;
  setDisabled(!isActive);
  toggleLabel.addEventListener('click', handleIsActiveSlider);
});