import { ipcRenderer } from 'electron';
import settings from 'electron-settings';

import EVENTS from '../events';

const shouldOpenOnLogin = document.getElementById('shouldOpenOnLogin');
const buttonQuitApp = document.getElementById('quitApp');

const handleSetInitialShouldOpenOnLogin = () =>
  handleSetShouldOpenOnLogin(settings.get('shouldOpenOnLogin'));

const handleSetShouldOpenOnLogin = (isChecked) => {
  shouldOpenOnLogin.checked = isChecked;
};

const init = () => {
  handleSetInitialShouldOpenOnLogin();

  settings.watch('shouldOpenOnLogin', handleSetShouldOpenOnLogin);

  shouldOpenOnLogin.addEventListener('change', ({ target }) =>
    ipcRenderer.send(EVENTS.TOGGLE_OPEN_LOGIN, target.checked));

  buttonQuitApp.addEventListener('click', () => ipcRenderer.send(EVENTS.QUIT));
};

document.addEventListener('DOMContentLoaded', init);
