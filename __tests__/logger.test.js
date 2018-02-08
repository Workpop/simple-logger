import sinon from 'sinon';
import { expect } from 'chai';
import Logger from '../src';

const simpleLogging = new Logger('SIMPLE');
const requestIdLogger = new Logger('SIMPLE', '234923423');

describe('Logger', function () {

  describe('simple logging', function () {

    let sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('logs errors', function () {
      simpleLogging.error('SUP');
      requestIdLogger.error('SUP');
    });

    it('logs only one line when request ID is included', function () {
      const logSpy = sandbox.spy(console, 'log');
      requestIdLogger.info('log line text');
      expect(logSpy.callCount).to.equal(1);
    });

  });

});
