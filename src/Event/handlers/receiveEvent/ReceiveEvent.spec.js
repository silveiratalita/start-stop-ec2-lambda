const Handler = require('./ReceiveEvent');

describe('Testing ReceiveEvent.js  -> constructor', () => {
  let config = null;
  let AWS = null;
  beforeEach(() => {
    config = jasmine.createSpyObj('config', ['region', 'apiVersion']);
    AWS = jasmine.createSpyObj('EC2', ['describeInstances']);
  });

  it('Constructor Without Args', () => {
    expect(() => new Handler()).toThrowError();
  });

  it('Constructor with 2 Correct Args', () => {
    expect(() => new Handler(config, AWS)).not.toThrowError();
  });
});

describe('Testing handler.js Handler-> start', () => {
  const event = {
    'id': '53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa',
    'detail-type': 'Scheduled Event',
    'source': 'aws.events',
    'account': '123456789012',
    'time': '2019-10-08T16:53:06Z',
    'region': 'us-east-1',
    'resources': ['arn:aws:events:us-east-1:123456789012:rule/MyScheduledRule'],
    'action': 'Stop',
    'msg': 'Estamos ligando as maquinas do ambiente de dev',
    'detail': {},
  };

  let instance = null;
  let AWS = null;
  let config = null;
  beforeEach(() => {
    config = jasmine.createSpyObj('config', ['region', 'apiVersion']);
    AWS = jasmine.createSpyObj('aws', [
      'describeInstances',
      'startIntance',
      'stopInstance',
    ]);
    instance = new Handler(config, AWS);
  });

  it('Execution without Params', async(finish) => {
    try {
      await instance.start();
      expect().toThrowError();
      fail('FAIL: Execution without Params');
    } catch (error) {
      console.log(error);
      finish();
    }
  });

  it('Execution with event invalid ', async(finish) => {
    const newEvent = 'teste';
    try {
      await instance.start(newEvent);
      expect().toThrowError();
      fail('FAIL: Event invalid');
    } catch (error) {
      finish();
    }
  });

  it('Execution with Event Valid ', async(finish) => {
    try {
      await instance.start(event);
      finish();
    } catch (error) {
      fail('FAIL: Event invalid');
    }
  });
});
