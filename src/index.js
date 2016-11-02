import canUsePassiveEventListeners from './canUsePassiveEventListeners';

const EVENT_OPTIONS = canUsePassiveEventListeners ? { passive: true } : undefined;

class TargetEventHandlers {
  constructor(target) {
    this.target = target;
    this.events = {};
  }

  getEventHandlers(eventName) {
    if (!this.events[eventName]) {
      this.events[eventName] = {
        size: 0,
        index: 0,
        handlers: {},
        handleEvent: undefined,
      };
    }
    return this.events[eventName];
  }

  handleEvent(eventName, event) {
    const { handlers } = this.getEventHandlers(eventName);
    Object.keys(handlers).forEach((index) => {
      const handler = handlers[index];
      if (handler) {
        // We need to check for presence here because a handler function may
        // cause later handlers to get removed. This can happen if you for
        // instance have a waypoint that unmounts another waypoint as part of an
        // onEnter/onLeave handler.
        handler(event);
      }
    });
  }

  add(eventName, listener) {
    const eventHandlers = this.getEventHandlers(eventName);

    if (eventHandlers.size === 0) {
      eventHandlers.handleEvent = this.handleEvent.bind(this, eventName);

      this.target.addEventListener(
        eventName,
        eventHandlers.handleEvent,
        EVENT_OPTIONS
      );
    }

    eventHandlers.size += 1;
    eventHandlers.index += 1;
    eventHandlers.handlers[eventHandlers.index] = listener;
    return eventHandlers.index;
  }

  delete(eventName, index) {
    const eventHandlers = this.getEventHandlers(eventName);
    delete eventHandlers.handlers[index];
    eventHandlers.size -= 1;

    if (eventHandlers.size === 0) {
      this.target.removeEventListener(
        eventName,
        eventHandlers.handleEvent,
        EVENT_OPTIONS
      );

      eventHandlers.handleEvent = undefined;
    }
  }
}

const EVENT_HANDLERS_KEY = '__react_waypoint_event_handlers__';

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
