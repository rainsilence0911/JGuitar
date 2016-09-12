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
    }
};