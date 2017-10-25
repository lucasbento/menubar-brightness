import { ipcMain } from 'electron'; // eslint-disable-line
import menubar from 'menubar';
import brightness from 'brightness';

import EVENTS from './events';

menubar({
  dir: __dirname,
  width: 200,
  height: 50,
  preloadWindow: true,
  // width: 500,
  // height: 500,
});

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({
  // showDevTools: true,
});

const parseValue = (value, origin = 'range') => ((origin === 'range') ? value / 100 : value * 100);

ipcMain.on(EVENTS.REQUEST_INITIAL_VALUE, async (event) => {
  const value = parseValue(await brightness.get(), 'library');

  event.sender.send(EVENTS.GET_INITIAL_VALUE, value);
});

ipcMain.on(EVENTS.CHANGE_VALUE, (event, brightnessValue) =>
  brightness.set(parseValue(brightnessValue)));
