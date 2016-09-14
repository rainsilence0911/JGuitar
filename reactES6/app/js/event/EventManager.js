
let eventMapper = {};

export default class EventManager {

    static register(eventName, handler) {

        if (!eventMapper[eventName]) {
            eventMapper[eventName] = [];
        }

        eventMapper[eventName].push(handler);
    }

    static deregister(eventName, handler) {

        var eventHandlers = eventMapper[eventName];

        if (!eventHandlers) {
            return;
        }

        for (var i = 0; i < eventHandlers.length; i++) {
            if (eventHandlers[i] === handler) {
                eventHandlers.splice(i, 1);
                break;
            }
        }
    }

    static fire(eventName, params) {

        if (!eventMapper[eventName]) {
            return;
        }

        let handlers = eventMapper[eventName];

        for (let i = 0; i < handlers.length; i++) {
            handlers[i](params);
        }

    }
}
