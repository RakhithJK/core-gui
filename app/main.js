/**
 * @module drivshare-gui/main
 */

'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./lib/electron_boilerplate/env_config');
var windowStateKeeper = require('./lib/electron_boilerplate/window_state');

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
  width: 620,
  height: 720
});

app.on('ready', function () {

  var mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }

  mainWindow.loadUrl('file://' + __dirname + '/driveshare.html');

  if (env.showDevTools) {
    mainWindow.openDevTools();
  }

  mainWindow.on('close', function () {
    mainWindowState.saveState(mainWindow);
  });
});

app.on('window-all-closed', function () {
  app.quit();
});
