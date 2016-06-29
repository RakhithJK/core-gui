/**
 * @module storjshare-gui/fslogs
 */

'use strict';

var fs = require('fs');
var assert = require('assert');
// var app = require('app');

/**
 * Creates a logger and bind to view
 * @constructor
 */
function FsLogger(logfolder) {
  if (!(this instanceof FsLogger)) {
    return new FsLogger(logfolder);
  }

  //need to set defaults
  this._loglevel = 1;
  this._logfolder = '/Users/alexleitner/Desktop/workcode';
  // this._logfolder = logfolder ? logfolder : app.getPath('exe');

  assert(fs.existsSync(this._logfolder), 'Invalid data directory');

  // Create log if no log exists
  if (!(this._doesFileExist(this._logfolder+'/'+this._builddate()+'.log'))) {
    this._newfile(this._logfolder);
  }

}

/**
 * Create new Log File
 * #_newfile
 * @return {Boolean} Returns false if log couldn't be created; true if success
 */
FsLogger.prototype._newfile = function() {

  var today = this._builddate();
  var logname = this._logfolder + '/' + today;
  var filetype = '.log';
  var counter = 0;
  var log = logname + filetype;

  let check = this._doesFileExist(log);

  while (check === true) {
    counter++;
    log = logname + ' (' + counter + ')' + filetype;
    check = this._doesFileExist(log);
  }

  if (check === false) {
    fs.writeFileSync(log, '['+new Date().getTime()+'] Log file created.');
    this._logfile = log;
    return true;
  }

  return false;

};

/**
 * Check if file exists
 * #_builddate
 * @return {String} String of date in the format of 1337-06-66
 */
FsLogger.prototype._builddate = function() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  return year + '-' + month + '-' + day;
};

/**
 * Check if file exists
 * #_newfile
 * @param {String} log - full path of log file
 * @return {Boolean} True if file exists; false if not.
 */
FsLogger.prototype._doesFileExist = function(log) {
  try {
    fs.statSync(log);
  } catch(err) {
    this.debug('error :' + err);
    return !(err && err.code === 'ENOENT');
  }

  return true;
};

/**
 * Log trace Mesage
 * #trace
 * @param {String} message - Message to be logged
 * @return {Void}
 */
FsLogger.prototype.trace = function(message) {
  if (!(this._doesFileExist(this._logfile))){
    this._newfile();
  }
  if (this._checkLogLevel() >= 5) {
    fs.writeFileSync(this._logfile, message);
  }
};

/**
 * Log debug Mesage
 * #debug
 * @param {String} message - Message to be logged
 * @return {Void}
 */
FsLogger.prototype.debug = function(message) {
  if (!(this._doesFileExist(this._logfile))){
    this._newfile();
  }
  if (this._checkLogLevel() >= 4) {
    fs.writeFileSync(this._logfile, message);
  }
};

/**
 * Log info Mesage
 * #info
 * @param {String} message - Message to be logged
 * @return {Void}
 */
FsLogger.prototype.info = function(message) {
  if (!(this._doesFileExist(this._logfile))){
    this._newfile();
  }
  if (this._checkLogLevel() >= 3) {
    fs.writeFileSync(this._logfile, message);
  }
};

/**
 * Log warn Mesage
 * #warn
 * @param {String} message - Message to be logged
 */
FsLogger.prototype.warn = function(message) {
  if (!(this._doesFileExist(this._logfile))){
    this._newfile();
  }
  if (this._checkLogLevel() >= 2) {
    fs.writeFileSync(this._logfile, message);
  }
};

/**
 * Log error Mesage
 * #error
 * @param {String} message - Message to be logged
 * @return {Void}
 */
FsLogger.prototype.error = function(message) {
  if (!(this._doesFileExist(this._logfile))){
    this._newfile();
  }
  if (this._checkLogLevel() >= 1) {
    fs.writeFileSync(this._logfile, message);
  }
};

/**
 * Check log level settings
 * #_checkLogLevel
 * @return {Number} Return current log level setting
 */
FsLogger.prototype._checkLogLevel = function() {
  // Get log level from settings
  return this._loglevel;
};

module.exports = FsLogger;
