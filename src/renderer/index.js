import { ipcRenderer, remote } from 'electron'; // eslint-disable-line
import settings from 'electron-settings';
import noUiSlider from 'nouislider';

import EVENTS from '../events';

const { body } = document;
const el = document.getElementById('range');

const handleDarkMode = isDarkMode =>
  (isDarkMode ?
    body.classList.add('dark-mode') :
    body.classList.remove('dark-mode')
  );

const requestBrightnessValue = () => ipcRenderer.send(EVENTS.REQUEST_INITIAL_VALUE);

const handleChangeBrightness = (values, handle) => {
  ipcRenderer.send(EVENTS.CHANGE_VALUE, values[handle]);
};

const openPreferencesWindow = () => ipcRenderer.send(EVENTS.OPEN_PREFERENCES_WINDOW);

const updateSlider = (value) => {
  if (el.noUiSlider) {
    return el.noUiSlider.set(value);
  }

  noUiSlider.create(el, {
    start: value,
    behaviour: 'drag',
    connect: [true, false],
    range: {
      min: 0,
      max: 100,
    },
  });

  el.noUiSlider.on('update', handleChangeBrightness);
};

const init = () => {
  handleDarkMode(settings.get('isDarkMode'));
  requestBrightnessValue();

  settings.watch('isDarkMode', isDarkMode => handleDarkMode(isDarkMode));
  remote.getCurrentWindow().on('show', () => requestBrightnessValue());

  ipcRenderer.on(EVENTS.GET_INITIAL_VALUE, (event, value) => updateSlider(value));

  el.addEventListener('input', handleChangeBrightness);

  window.addEventListener('keydown', ({ code, metaKey }) =>
    (metaKey && code.toLowerCase() === 'comma') && openPreferencesWindow());
};

init();
