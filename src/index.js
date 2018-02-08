// @flow
import { isObject, size, toUpper } from 'lodash';
import moment from 'moment';

const logLevels = {
  TRACE: 'TRACE',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

let IS_ENABLED = true;

function _log(category: string, level: string, ...args: Array<any>): void {
  if (!IS_ENABLED) {
    return;
  }

  const now = moment().format();

  if (level === logLevels.ERROR) {
    return console.error(`${now} ${level} [${category}]`, ...args); // eslint-disable-line no-console
  }

  return console.log(`${now} ${level} [${category}]`, ...args); // eslint-disable-line no-console
}

export default function Logger(category: string, requestId: string) {
  this.category = category;
  this.requestId = requestId;
}

Logger.disable = function () {
  IS_ENABLED = false;
};

Logger.enable = function () {
  IS_ENABLED = true;
};

function createLogLevel(level: string): Function {
  return function logWithLevel(...args: Array<any>) {
    if (this.requestId) {
      _log(this.category, level, `RequestId: ${this.requestId}`,  ...args);
      return;
    }
    _log(this.category, level, ...args);
  };
}

Logger.prototype.trace = createLogLevel(logLevels.TRACE);

Logger.prototype.info = createLogLevel(logLevels.INFO);

Logger.prototype.warn = createLogLevel(logLevels.WARN);

Logger.prototype.error = createLogLevel(logLevels.ERROR);

Logger.prototype.log = function log(level: string, ...args: Array<any>) {
  if (size(args) === 1 && isObject(args[0])) {
    _log(this.category, toUpper(level), JSON.stringify(args[0]));
    return;
  }

  _log(this.category, toUpper(level), ...args);
};
