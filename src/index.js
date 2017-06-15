// @flow
import { isObject, size, toUpper } from 'lodash';
import moment from 'moment';

function _log(category: string, level: string, ...args: Array<any>) {
  const now = moment().format();
  console.log(`${now} ${level} [${category}]`, ...args); // eslint-disable-line no-console
}

export default function Logger(category: string) {
  this.category = category;
}

Logger.prototype.trace = function trace(...args: Array<any>) {
  _log(this.category, 'TRACE', ...args);
};

Logger.prototype.info = function info(...args: Array<any>) {
  _log(this.category, 'INFO ', ...args);
};

Logger.prototype.warn = function warn(...args: Array<any>) {
  _log(this.category, 'WARN ', ...args);
};

Logger.prototype.error = function error(...args: Array<any>) {
  _log(this.category, 'ERROR', ...args);
};

Logger.prototype.log = function log(level: string, ...args: Array<any>) {
  if (size(args) === 1 && isObject(args[0])) {
    _log(this.category, toUpper(level), JSON.stringify(args[0]));
    return;
  }

  _log(this.category, toUpper(level), ...args);
};
