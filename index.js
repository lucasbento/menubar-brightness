'use strict';
const electron = require('electron');
const menubar = require('menubar');

const app = electron.app;
const menu = menubar();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	menu.app.on('closed', onClosed);

	return menu.app;
}

menu.app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

menu.app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

menu.app.on('ready', () => {
	mainWindow = createMainWindow();
});
