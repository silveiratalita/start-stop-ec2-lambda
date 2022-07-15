const Handler = require('../receiveEvent/ReceiveEvent');
const config = require('../../../../config/config');
const AWS = require('aws-sdk');
let instance = null;
AWS.config.update({region: config.region});

const _init = () => {
  instance = new Handler(config, AWS);
};

const handler = (event, context) => {
  if (!instance) {
    _init();
  }
  instance.start(event, context);
};

exports.handler = handler;
