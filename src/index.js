import TargetEventHandlers from './TargetEventHandlers';

const EVENT_HANDLERS_KEY = '__consolidated_events_handlers__';

export function addEventListener(target, eventName, listener) {
  if (!target[EVENT_HANDLERS_KEY]) {
    // eslint-disable-next-line no-param-reassign
    target[EVENT_HANDLERS_KEY] = new TargetEventHandlers(target);
  }
  return target[EVENT_HANDLERS_KEY].add(eventName, listener);
}

export function removeEventListener(target, eventName, index) {
  if (target) {
    // At the time of unmounting, the target might no longer exist. Guarding
    // against this prevents the following error:
    //
    //   Cannot read property 'removeEventListener' of undefined
    target[EVENT_HANDLERS_KEY].delete(eventName, index);
  }
}

export default {};
