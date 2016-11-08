import eventOptionsKey from './eventOptionsKey';

export default class TargetEventHandlers {
  constructor(target) {
    this.target = target;
    this.events = {};
  }

  getEventHandlers(eventName, options) {
    const key = `${eventName} ${eventOptionsKey(options)}`;

    if (!this.events[key]) {
      this.events[key] = {
        size: 0,
        index: 0,
        handlers: {},
        handleEvent: undefined,
      };
    }
    return this.events[key];
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

  add(eventName, listener, options) {
    // options has already been normalized at this point.
    const eventHandlers = this.getEventHandlers(eventName, options);

    if (eventHandlers.size === 0) {
      eventHandlers.handleEvent = this.handleEvent.bind(this, eventName);

      this.target.addEventListener(
        eventName,
        eventHandlers.handleEvent,
        options
      );
    }

    eventHandlers.size += 1;
    eventHandlers.index += 1;
    eventHandlers.handlers[eventHandlers.index] = listener;
    return eventHandlers.index;
  }

  delete(eventName, index, options) {
    // options has already been normalized at this point.
    const eventHandlers = this.getEventHandlers(eventName, options);
    delete eventHandlers.handlers[index];
    eventHandlers.size -= 1;

    if (eventHandlers.size === 0) {
      this.target.removeEventListener(
        eventName,
        eventHandlers.handleEvent,
        options
      );

      eventHandlers.handleEvent = undefined;
    }
  }
}
