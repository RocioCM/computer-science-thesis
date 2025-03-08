import cn from './classNames';
import log from './logger';
import getEndpointUrl from './url';
import {
  formatStringToNumber,
  parseFixed,
  formatNumberToLocal,
} from './formatters';

describe('cn function', () => {
  it('joins multiple class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('filters out invalid values', () => {
    expect(cn('btn', null, undefined, false, 'active')).toBe('btn active');
  });

  it('returns an empty string if no valid classes are provided', () => {
    expect(cn(undefined, null, false)).toBe('');
  });
});

describe('logger', () => {
  it('should not log anything when DEBUG_ENABLED is false', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    log.error('Error message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should not display debug messages when DEBUG_ENABLED is false', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    log.debug('Debug message');
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('getEndpointUrl', () => {
  it('constructs URL with given endpoint array', () => {
    const url = getEndpointUrl('http://api.test', {
      endpoint: ['users', '123'],
    });
    expect(url).toBe('http://api.test/users/123');
  });

  it('adds query parameters if provided', () => {
    const url = getEndpointUrl('http://api.test', {
      endpoint: ['users'],
      foo: 'bar',
    });
    expect(url).toBe('http://api.test/users?foo=bar');
  });

  it('returns base url if no params', () => {
    const url = getEndpointUrl('http://api.test', {});
    expect(url).toBe('http://api.test');
  });
});

describe('formatters', () => {
  describe('formatStringToNumber', () => {
    it('parses string to number', () => {
      expect(formatStringToNumber('1.234')).toBe(1234);
      expect(formatStringToNumber('1,234')).toBe(1.234);
      expect(formatStringToNumber('1.234,56')).toBe(1234.56);
    });

    it('returns 0 if value is falsy', () => {
      expect(formatStringToNumber('')).toBe(0);
      expect(formatStringToNumber(null as any)).toBe(0);
      expect(formatStringToNumber(undefined as any)).toBe(0);
    });

    it('returns the number if value is already a number', () => {
      expect(formatStringToNumber(1234)).toBe(1234);
    });
  });

  describe('parseFixed', () => {
    it('returns a number with specified decimals', () => {
      expect(parseFixed('1.2345')).toBe(1.23);
      expect(parseFixed(1.2345)).toBe(1.23);
      expect(parseFixed('1.2345', 3)).toBe(1.234);
    });

    it('returns NaN for invalid value', () => {
      expect(parseFixed('abc')).toBeNaN();
    });
  });

  describe('formatNumberToLocal', () => {
    it('formats a valid number correctly', () => {
      expect(formatNumberToLocal('1234.56')).toBe('1.234,56');
      expect(formatNumberToLocal(1234.56)).toBe('1.234,56');
      expect(formatNumberToLocal('1234.5', 3)).toBe('1.234,5'); // Returns up to 3-decimal places but without trailing zeros
      expect(formatNumberToLocal('1234.54321', 3)).toBe('1.234,543');
    });

    it('returns empty string for invalid value', () => {
      expect(formatNumberToLocal('abc')).toBe('');
      expect(formatNumberToLocal(null)).toBe('');
      expect(formatNumberToLocal(undefined)).toBe('');
    });
  });
});
