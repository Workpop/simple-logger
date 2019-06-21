import { expect } from 'chai';
import sinon from 'sinon';
import Logger from '../src';

describe('Logger', () => {

  describe('simple logging', () => {

    const simpleLogging = new Logger('SIMPLE');
    const requestIdLogger = new Logger('SIMPLE', '234923423');

    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      Logger.enable();  // ensure logger is enabled at the start of each test
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('logs trace', () => {
      const logSpy = sandbox.spy(console, 'log');
      const errorSpy = sandbox.spy(console, 'error');
      simpleLogging.trace('SUP');
      requestIdLogger.trace('SUP');
      expect(logSpy.callCount).to.equal(2);
      expect(errorSpy.callCount).to.equal(0);
    });

    it('logs info', () => {
      const logSpy = sandbox.spy(console, 'log');
      const errorSpy = sandbox.spy(console, 'error');
      simpleLogging.info('SUP');
      requestIdLogger.info('SUP');
      expect(logSpy.callCount).to.equal(2);
      expect(errorSpy.callCount).to.equal(0);
    });

    it('logs warn', () => {
      const logSpy = sandbox.spy(console, 'log');
      const errorSpy = sandbox.spy(console, 'error');
      simpleLogging.warn('SUP');
      requestIdLogger.warn('SUP');
      expect(logSpy.callCount).to.equal(2);
      expect(errorSpy.callCount).to.equal(0);
    });

    it('logs errors', () => {
      const logSpy = sandbox.spy(console, 'log');
      const errorSpy = sandbox.spy(console, 'error');
      simpleLogging.error('SUP');
      requestIdLogger.error('SUP');
      expect(logSpy.callCount).to.equal(0);
      expect(errorSpy.callCount).to.equal(2);
    });

    it('logs only one line when request ID is included', () => {
      const logSpy = sandbox.spy(console, 'log');
      requestIdLogger.info('log line text');
      expect(logSpy.callCount).to.equal(1);
    });

    it('should NOT log anything regardless of instance when Logger.disable() called', () => {
      const logSpy = sandbox.spy(console, 'log');
      Logger.disable();
      simpleLogging.info('SUP');
      requestIdLogger.info('log line text');
      expect(logSpy.callCount).to.equal(0);
    });

    it('should log when Logger.disable() called followed by Logger.enable()', () => {
      const logSpy = sandbox.spy(console, 'log');
      Logger.disable();
      Logger.enable();
      simpleLogging.info('SUP');
      requestIdLogger.info('log line text');
      expect(logSpy.callCount).to.equal(2);
    });

    it('should NOT log anything when disable() called', () => {
      const logSpy = sandbox.spy(console, 'log');
      simpleLogging.disable();
      simpleLogging.info('SUP');
      requestIdLogger.info('log line text');
      expect(logSpy.callCount).to.equal(1);
    });

    it('should log when disable() called followed by enable()', () => {
      const logSpy = sandbox.spy(console, 'log');
      simpleLogging.disable();
      simpleLogging.enable();
      simpleLogging.info('SUP');
      requestIdLogger.info('log line text');
      expect(logSpy.callCount).to.equal(2);
    });

  });

});
