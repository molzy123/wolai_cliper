export const EventService = {
  eventMap: {},

  registerEvent(eventName, callback) {
    if (this.eventMap[eventName] === undefined) {
      this.eventMap[eventName] = [];
    }

    this.eventMap[eventName].push(callback);
    return () => {
      this.unregisterEvent(eventName, callback);
    };
  },

  unregisterEvent(eventName, callback) {
    if (this.eventMap[eventName] === undefined) {
      return;
    }

    const callbacks = this.eventMap[eventName];
    const index = callbacks.indexOf(callback);
    if (index !== undefined && index !== -1) {
      callbacks.splice(index, 1);
    }
  },

  dispatchEvent(eventName, ...args) {
    if (this.eventMap[eventName] === undefined) {
      return;
    }
    const callbacks = this.eventMap[eventName];
    callbacks.forEach((callback) => {
      callback(...args);
    });
  },
};
