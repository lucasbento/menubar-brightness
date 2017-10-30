import { Tray, ipcMain } from 'electron'; // eslint-disable-line
import AutoLaunch from 'auto-launch';
import Menubar from 'menubar';
import path from 'path';
import osxPrefs from 'electron-osx-appearance';
import settings from 'electron-settings';
import brightness from 'brightness';

import pkg from '../package.json';
import EVENTS from './events';

const getVibrancy = () => (osxPrefs.isDarkMode() ? 'ultra-dark' : 'light');
const parseValue = (value, origin = 'range') => ((origin === 'range') ? value / 100 : value * 100);

const autoLauncher = new AutoLaunch({
  name: pkg.productName,
});

// TODO: find out about small icon in login items
const menubar = Menubar({
  dir: `${__dirname}/renderer`,
  width: 200,
  height: 50,
  preloadWindow: true,
  resizable: false,
  icon: path.join(__dirname, 'icons/iconTemplate.png'),
  vibrancy: getVibrancy(),
});

const init = async () => {
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

  const isAutolauncherEnabled = await autoLauncher.isEnabled();
  if (!isAutolauncherEnabled) {
    autoLauncher.enable();
  }
};

init();
