const util = require('util');

/** Handler START STOP */
class Handler {
  /**
   * @param {*} config
   * @param {object} AWS
   */
  constructor(config, AWS) {
    if (!config || !AWS) {
      throw new Error('Invalid Constructor Args');
    }
    this._config = config;
    this._aws = AWS;
  }

  /**
   * @param {object} ec2
   */
  async getRunningIntances(ec2) {
    const params = {
      Filters: [
        {
          Name: 'instance-state-name',
          Values: ['running'],
        },
      ],
    };
    const paramsToStartEc2 = {
      InstanceIds: [],
      DryRun: true,
    };
    const stopInstance = this.stopInstance.bind();
    await ec2.describeInstances(params, async function(err, data) {
      if (err) {
        console.log(err.stack);
      } else {
        data.Reservations.forEach((e) => {
          e.Instances.forEach((el) => {
            paramsToStartEc2.InstanceIds.push(el.InstanceId);
          });
        });
        await stopInstance(ec2, paramsToStartEc2);
      }
    });
  }

  /**
   * @param {object} ec2
   */
  async getStoppedIntances(ec2) {
    const params = {
      Filters: [
        {
          Name: 'instance-state-name',
          Values: ['stopped'],
        },
      ],
    };
    const paramsToStartEc2 = {
      InstanceIds: [],
      DryRun: true,
    };
    const startInstance = this.startInstance.bind();
    await ec2.describeInstances(params, async function(err, data) {
      if (err) {
        console.log(err.stack);
      } else {
        data.Reservations.forEach((e) => {
          e.Instances.forEach((el) => {
            paramsToStartEc2.InstanceIds.push(el.InstanceId);
          });
        });
        await startInstance(ec2, paramsToStartEc2);
      }
    });
  }

  /**
   * @param {Object} event
   * @return {Object} objeto
   */
  async defineStopOrStart(event) {
    const config = this._config;
    console.log('Started to process event');
    try {
      const ec2 = new this._aws.EC2({apiVersion: config.apiVersion});
      if (event.action.toUpperCase() === 'START') {
        await this.getStoppedIntances(ec2);
      } else if (event.action.toUpperCase() === 'STOP') {
        await this.getRunningIntances(ec2);
      }
    } catch (e) {
      throw new Error(`Invalid Event Payload:
      ${util.inspect(event, false, null)}`);
    }
  }

  /**
   * @param {Object} ec2
   * @param {Object} params
   */
  async startInstance(ec2, params) {
    ec2.startInstances(params, function(err, data) {
      if (err && err.code === 'DryRunOperation') {
        params.DryRun = false;
        ec2.startInstances(params, function(err, data) {
          if (err) {
            console.log('Error', err);
          } else if (data) {
            console.log('Success', data.StartingInstances);
          }
        });
      } else {
        console.log('You don\'t have permission to start instances.');
      }
    });
  }

  /**
   * @param {object} ec2
   * @param {object} params
   */
  async stopInstance(ec2, params) {
    ec2.stopInstances(params, function(err, data) {
      if (err && err.code === 'DryRunOperation') {
        params.DryRun = false;
        ec2.stopInstances(params, function(err, data) {
          if (err) {
            console.log('Error', err);
          } else if (data) {
            console.log('Success', data.StoppingInstances);
          }
        });
      } else {
        console.log('You don\'t have permission to stop instances');
      }
    });
  }

  /**
   * Start Method
   * @param {*} event
   */
  async start(event) {
    if (!event) {
      throw new Error(`Invalid Validate Args - : ${event}  `);
    }
    try {
      await this.defineStopOrStart(event);
    } catch (err) {
      console.error(err);
    }

    return true;
  }
}

module.exports = Handler;
