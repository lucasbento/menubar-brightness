import { Tray, ipcMain } from 'electron'; // eslint-disable-line
import Menubar from 'menubar';
import path from 'path';
import osxPrefs from 'electron-osx-appearance';
import settings from 'electron-settings';
import brightness from 'brightness';

import EVENTS from './events';

const getVibrancy = () => (osxPrefs.isDarkMode() ? 'ultra-dark' : 'light');
const parseValue = (value, origin = 'range') => ((origin === 'range') ? value / 100 : value * 100);

const menubar = Menubar({
  dir: __dirname,
  width: 200,
  height: 50,
  preloadWindow: true,
  icon: path.join(__dirname, 'iconTemplate.png'),
  vibrancy: getVibrancy(),
});

const init = () => {
  settings.set('isDarkMode', osxPrefs.isDarkMode());

  osxPrefs.onDarkModeChanged(() => {
    menubar.window.setVibrancy(getVibrancy());
    settings.set('isDarkMode', osxPrefs.isDarkMode());
  });

  ipcMain.on(EVENTS.REQUEST_INITIAL_VALUE, async (event) => {
    const value = parseValue(await brightness.get(), 'library');

    event.sender.send(EVENTS.GET_INITIAL_VALUE, value);
  });

  ipcMain.on(EVENTS.CHANGE_VALUE, (event, brightnessValue) =>
    brightness.set(parseValue(brightnessValue)));
};

init();
