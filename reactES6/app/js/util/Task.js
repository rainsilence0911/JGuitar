
export default class Task {

    constructor() {
        this.handlers = [];
    }

    execute() {}

    addCompleteListener(handler) {
        this.handlers.push(handler);
    }

    fireComplete() {
        this.handlers.forEach(function(handler) {
            handler();
        });
    }
}