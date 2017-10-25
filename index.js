import { ipcRenderer, remote } from 'electron'; // eslint-disable-line
import noUiSlider from 'nouislider';

import EVENTS from './events';

const el = document.getElementById('range');

const requestBrightnessValue = () => ipcRenderer.send(EVENTS.REQUEST_INITIAL_VALUE);

const handleChangeBrightness = (values, handle) => {
  ipcRenderer.send(EVENTS.CHANGE_VALUE, values[handle]);
};

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

remote.getCurrentWindow().on('show', () => requestBrightnessValue());

ipcRenderer.on(EVENTS.GET_INITIAL_VALUE, (event, value) => updateSlider(value));

requestBrightnessValue();

el.addEventListener('input', handleChangeBrightness);
