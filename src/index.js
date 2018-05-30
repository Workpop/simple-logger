// @flow
import { isString, map, size, isObject, toUpper, partial } from 'lodash';
import moment from 'moment';
import { inspect } from 'util';

const logLevels = {
  TRACE: 'TRACE',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};
const JSON_MODE = process.env.NODE_ENV === 'production';

let IS_ENABLED = true;

export default function Logger(category: string, requestId: string) {
  this.category = category;
  this.requestId = requestId;
}

Logger.prototype.log = function log(level: string, ...args: Array<any>): void {
  if (!IS_ENABLED) {
    return;
  }


  const base = {
    _ts: moment().format(),
    _level: toUpper(level),
    _category: this.category,
    _requestId: this.requestId,
  };

  let ll;

  if (size(args) === 1 && isObject(args[0])) {
    ll = {
      ...base,
      ...args[0],
    };
  } else {
    ll = {
      ...base,
      message: map(args, (x: any): String => {
        if (isString(x)) {
          return x;
        }
        return inspect(x);
      }).join(' '),
    };
  }


  const stream = level === logLevels.ERROR ? console.error : console.log;  //eslint-disable-line no-console

  if (JSON_MODE) {
    return stream(JSON.stringify(ll));
  }

  return stream(`${ll._ts} ${ll._level} [${ll._category}]`, ...args);
};

Logger.disable = function () {
  IS_ENABLED = false;
};

Logger.enable = function () {
  IS_ENABLED = true;
};

Logger.prototype.trace = partial(Logger.prototype.log, logLevels.TRACE);

Logger.prototype.info = partial(Logger.prototype.log, logLevels.INFO);

Logger.prototype.warn = partial(Logger.prototype.log, logLevels.WARN);

Logger.prototype.error = partial(Logger.prototype.log, logLevels.ERROR);

