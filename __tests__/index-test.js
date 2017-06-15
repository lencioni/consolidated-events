import { addEventListener, removeEventListener, EVENT_HANDLERS_KEY } from '../src';
import TargetEventHandlers from '../src/TargetEventHandlers';

class MockTarget {
  constructor() {
    this.addEventListener = jest.fn();
    this.removeEventListener = jest.fn();
  }
}

describe('addEventListener()', () => {
  it('initializes an instance of TargetEventHandlers on new targets', () => {
    const target = new MockTarget();
    addEventListener(target, 'scroll', () => {});
    expect(target[EVENT_HANDLERS_KEY]).toBeInstanceOf(TargetEventHandlers);
    expect(target[EVENT_HANDLERS_KEY].target).toBe(target);
  });

  it('normalizes event options', () => {
    const target = new MockTarget();
    addEventListener(target, 'scroll', () => {}, { capture: true });

    expect(target.addEventListener)
      .toHaveBeenCalledWith('scroll', jasmine.any(Function), true);
  });

  it('returns an unsubscribe function', () => {
    const target = new MockTarget();
    const remove = addEventListener(target, 'scroll', () => {}, { capture: true });

    expect(typeof remove).toBe('function');
  });
});

describe('removeEventListener()', () => {
  it('removes event listeners that were previously registered', () => {
    const target = new MockTarget();
    const unsubscribe = addEventListener(target, 'scroll', () => {});
    removeEventListener(unsubscribe);

    expect(target.removeEventListener)
      .toHaveBeenCalledWith('scroll', jasmine.any(Function), undefined);
  });

  it('ignores event listeners it does not know about', () => {
    const target = new MockTarget();
    addEventListener(target, 'scroll', () => {});
    removeEventListener(() => {});
    removeEventListener(() => {});

    expect(target.removeEventListener).toHaveBeenCalledTimes(0);
  });

  it('normalizes event options', () => {
    const target = new MockTarget();
    const unsubscribe = addEventListener(target, 'scroll', () => {}, { capture: true });
    removeEventListener(unsubscribe);

    expect(target.removeEventListener)
      .toHaveBeenCalledWith('scroll', jasmine.any(Function), true);
  });
});
