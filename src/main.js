import { Tray, ipcMain, BrowserWindow, dialog } from 'electron'; // eslint-disable-line
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

const menubar = Menubar({
  dir: `${__dirname}/renderer`,
  width: 200,
  height: 50,
  preloadWindow: true,
  resizable: false,
  icon: path.join(__dirname, 'assets/iconTemplate.png'),
  vibrancy: getVibrancy(),
});

let preferencesWindow = null;

const openPreferencesWindow = () => {
  if (preferencesWindow) {
    return preferencesWindow.show();
  }

  preferencesWindow = new BrowserWindow({
    width: 250,
    height: 100,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
  });

  preferencesWindow.on('close', () => {
    preferencesWindow = null;
  });

  preferencesWindow.loadURL(`file://${__dirname}/renderer/preferences.html`);
  return preferencesWindow.on('ready-to-show', preferencesWindow.show);
};

const init = async () => {
  ipcMain.on(EVENTS.REQUEST_INITIAL_VALUE, async (event) => {
    const value = parseValue(await brightness.get(), 'library');

    event.sender.send(EVENTS.GET_INITIAL_VALUE, value);
  });

  ipcMain.on(EVENTS.CHANGE_VALUE, (event, brightnessValue) =>
    brightness.set(parseValue(brightnessValue)));

  ipcMain.on(EVENTS.OPEN_PREFERENCES_WINDOW, () => openPreferencesWindow());

  ipcMain.on(EVENTS.TOGGLE_OPEN_LOGIN, (event, isEnabled) => {
    if (isEnabled) {
      settings.set('shouldOpenOnLogin', true);
      return autoLauncher.enable();
    }

    settings.set('shouldOpenOnLogin', false);
    return autoLauncher.disable();
  });

  ipcMain.on(EVENTS.QUIT, () => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: `Quit ${pkg.productName}`,
      message: `Are you sure you want to close ${pkg.productName}?`,
    }, (response) => {
      if (response === 0) {
        return menubar.app.quit();
      }
    });
  });

  settings.set('isDarkMode', osxPrefs.isDarkMode());

  osxPrefs.onDarkModeChanged(() => {
    menubar.window.setVibrancy(getVibrancy());
    settings.set('isDarkMode', osxPrefs.isDarkMode());
  });

  // First opening should enable auto-launch on login
  if (!settings.has('shouldOpenOnLogin')) {
    const isAutolauncherEnabled = await autoLauncher.isEnabled();
    if (!isAutolauncherEnabled) {
      autoLauncher.enable();
    }

    return settings.set('shouldOpenOnLogin', isAutolauncherEnabled);
  }

  const shouldOpenOnLogin = await autoLauncher.isEnabled();
  return settings.set('shouldOpenOnLogin', shouldOpenOnLogin);
};

init();
