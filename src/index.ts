import { isError, isObject, isString, map, size, toUpper } from 'lodash';
import moment from 'moment';
import { inspect } from 'util';

const logLevels = {
  ERROR: 'ERROR',
  INFO: 'INFO',
  TRACE: 'TRACE',
  WARN: 'WARN',
};

/** Output json formatted messages on production  */
const JSON_MODE = process.env.NODE_ENV === 'production';

let globalEnabled: boolean = true;

/**
 * Log messages to process console in JSON or plain-text format
 */
export default class Logger {

  /**
   * Globally disable futher output for all logger instances
   */
  public static disable(): void {
    globalEnabled = false;
  }

  /**
   * Globally enable output for all logger instances
   */
  public static enable(): void {
    globalEnabled = true;
  }

  private loggingEnabled: boolean = true;

  private category: string;

  private requestId: string;

  /**
   * Create a logger for the desired category
   * @param category required category for this logger
   * @param requestId optional request identifier for the current web request
   */
  constructor(category: string, requestId?: string) {
    this.category = category;
    this.requestId = requestId;
  }

  /**
   * Disable futher output until enable is invoked
   */
  public disable(): void {
    this.loggingEnabled = false;
  }

  /**
   * Enable output from this logger
   */
  public enable(): void {
    this.loggingEnabled = true;
  }
  /**
   * Output error message to the process error stream
   * @param args any messages to output
   */
  public error(...args: any[]): void {
    this.log(logLevels.ERROR, ...args);
  }

  /**
   * Output info message to the process standard output
   * @param args any messages to output
   */
  public info(...args: any[]): void {
    this.log(logLevels.INFO, ...args);
  }

  /**
   * Output trace message to the process standard output
   * @param args any messages to output
   */
  public trace(...args: any[]): void {
    this.log(logLevels.TRACE, ...args);
  }

  /**
   * Output warn message to the process standard output
   * @param args any messages to output
   */
  public warn(...args: any[]): void {
    this.log(logLevels.WARN, ...args);
  }

  private log(level: string, ...args: any[]): void {
    if (!globalEnabled || !this.loggingEnabled) {
      return;
    }

    const base = {
      _category: this.category,
      _level: toUpper(level),
      _requestId: this.requestId,
      _ts: moment().format(),
    };

    let ll;

    if (size(args) === 1 && isError(args[0])) {
      const e = args[0] as Error;
      ll = {
        ...base,
        error: {
          message: e.message,
          name: e.name,
          stack: inspect(e),
        },
      };
    } else if (size(args) === 1 && isObject(args[0])) {
      ll = {
        ...base,
        ...args[0],
      };
    } else {
      ll = {
        ...base,
        message: map(args, (x: any): string => {
          if (isString(x)) {
            return x;
          }
          return inspect(x);
        }).join(' '),
      };
    }

    // tslint:disable-next-line: no-console
    const output = level === logLevels.ERROR ? console.error : console.log;

    if (JSON_MODE) {
      return output(JSON.stringify(ll));
    }

    return output(`${ll._ts} ${ll._level} [${ll._category}]`, ...args);
  }
}
