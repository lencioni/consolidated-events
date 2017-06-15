import normalizeEventOptions from './normalizeEventOptions';
import TargetEventHandlers from './TargetEventHandlers';

// Export to make testing possible.
export const EVENT_HANDLERS_KEY = '__consolidated_events_handlers__';

export function addEventListener(target, eventName, listener, options) {
  if (!target[EVENT_HANDLERS_KEY]) {
    // eslint-disable-next-line no-param-reassign
    target[EVENT_HANDLERS_KEY] = new TargetEventHandlers(target);
  }
  const normalizedEventOptions = normalizeEventOptions(options);
  return target[EVENT_HANDLERS_KEY].add(eventName, listener, normalizedEventOptions);
}

// Deprecated
export function removeEventListener(unsubscribeFn) {
  unsubscribeFn();
}
