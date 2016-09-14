export default {
    getIterator: function(arr) {
        if (window.Symbol) {
            return arr[Symbol.iterator]();
        }

        var currentIndex = 0;

        return {
            next: function() {

                if (currentIndex === arr.length) {
                    return {
                        done: true,
                        value: null
                    };
                }

                return {
                    value: arr[currentIndex++],
                    done: false
                };
            }
        }
    },

    addEventListener: (function() {

        if (window.addEventListener) {
            return function(target, eventName, handler) {
                target.addEventListener(eventName, handler, false);
            };
        } else if (window.attachEvent) {
            return function(target, eventName, handler) {
                target.attachEvent('on' + eventName, handler);
            };
        } else {
            return function(target, eventName, handler) {
                target['on' + eventName] = handler;
            };
        }
    })(),

    removeEventListener: (function() {
        if (window.addEventListener) {
            return function(target, eventName, handler) {
                target.removeEventListener(eventName, handler);
            };
        } else if (window.attachEvent) {
            return function(target, eventName, handler) {
                target.detachEvent('on' + eventName, handler);
            };
        }
    })()
};
