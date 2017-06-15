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
        handlers: [],
        handleEvent: undefined,
      };
    }

    return this.events[key];
  }

  handleEvent(eventName, options, event) {
    const { handlers } = this.getEventHandlers(eventName, options);
    handlers.forEach((handler) => {
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

    if (eventHandlers.handlers.length === 0) {
      eventHandlers.handleEvent = this.handleEvent.bind(this, eventName, options);

      this.target.addEventListener(
        eventName,
        eventHandlers.handleEvent,
        options,
      );
    }

    eventHandlers.handlers.push(listener);

    let isSubscribed = true;
    const unsubscribe = () => {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      const index = eventHandlers.handlers.indexOf(listener);
      eventHandlers.handlers.splice(index, 1);

      if (eventHandlers.handlers.length === 0) {
        // All event handlers have been removed, so we want to remove the event
        // listener from the target node.

        if (this.target) {
          // There can be a race condition where the target may no longer exist
          // when this function is called, e.g. when a React component is
          // unmounting. Guarding against this prevents the following error:
          //
          //   Cannot read property 'removeEventListener' of undefined
          this.target.removeEventListener(
            eventName,
            eventHandlers.handleEvent,
            options,
          );
        }

        eventHandlers.handleEvent = undefined;
      }
    };
    return unsubscribe;
  }
}
