'use strict';
const fs = require('fs');
const path = require('path');
const Transform = require('stream').Transform;

class Logs extends Transform {
  constructor(opts, share) {
    this.super(opts);

    this.share = share;
    this.separator = '\n';
    this.logPath = path.normalize(this.share.config.loggerOutputFile);

    this.errors = [];
    this.actions = {};

    this.actions.read = this._read;

    this.actions.clearErrors = () => {
      this.errors = [];
    };
  }

  _read(size) {
    //this._flush

  }

  _write(chunk, encoding, callback) {

  }
}

module.exports = Share;
