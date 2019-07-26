'use strict';

const dnode = require('dnode');
const { ipcRenderer: ipc } = require('electron');
const { EventEmitter } = require('events');
const UserData = require('./lib/userdata');
const VueRouter = require('vue-router');
const BootstrapVue = require('bootstrap-vue');

window.UserData = UserData.toObject();
window.Vue = require('./node_modules/vue/dist/vue.common.js');
window.ViewEvents = new EventEmitter(); // NB: For view-to-view communication
window.Vue.use(VueRouter);
window.Vue.use(BootstrapVue);

// NB: When settings change, notify the main process
UserData.on('settingsUpdated', (updatedSettings) => {
  ipc.send('appSettingsChanged', updatedSettings);
});

window.daemonSocket = dnode.connect(45015, (rpc) => {

  // NB: Add global reference to the daemon RPC
  window.daemonRpc = rpc;

  // Set up any required view-model store instances
  window.Store = {
    shareList: new (require('./stores/share_list'))(rpc),
    newShare: new (require('./stores/share'))()
  }
  window.app = new window.Vue(require('./xApp'));

  // NB: Check user data for application settings and signal appropriate
  // NB: messages to the main process
  if (!window.UserData.appSettings.silentMode) {
    ipc.send('showApplicationWindow');
  }
});