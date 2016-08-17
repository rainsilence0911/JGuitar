

export default class Timer {

    constructor(frameCount) {
        this.frameCount = frameCount || 8;
        this.iteratorList = {};
        this.preActions = [];
    }

    addTask(name, task) {
        this.iteratorList[name] = task;
    }

    run() {

        this.preActions.forEach(function(handler) {
            handler();
        });

        let copiedIter = copyIterator(this.iteratorList);

        for (let prop in copiedIter) {
            let iter = copiedIter[prop];

            let taskInfo = iter.next();

            let task = taskInfo.value;

            if (task != null) {
                task.execute();
                task.fireComplete();
            }

            if (taskInfo.done) {
                this.iteratorList[prop] = null;
                delete this.iteratorList[prop];
            }
        }

        let hasNext = false;
        for (let prop in this.iteratorList) {
            let target = this;
            setTimeout(function() {
                target.run();
            }, this.frameCount);
            hasNext = true;
            break;
        }
        this.isRunning = hasNext;

        if (this.isRunning === false && this.onComplete) {
            this.onComplete();
        }

        function copyIterator(target) {
            let copiedIter = {};
            for (let prop in target) {
                copiedIter[prop] = target[prop];
            }
            return copiedIter;
        }
    }

    start(delay) {
        if (this.isRunning) {
            return;
        }
        let target = this;
        setTimeout(function() {
            target.run();
        }, delay || 1);
        this.isRunning = true;
    }

    addPreAction(handler) {
        this.preActions.push(handler);
    }
}