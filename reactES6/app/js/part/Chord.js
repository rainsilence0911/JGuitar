
import Task from '../util/Task';

import {ColorConstant} from '../util/Color';
import ESUtil from '../util/ESUtil';

class ShakeTask extends Task {

    constructor(chord, cpy, color) {
        super();
        this.chord = chord;
        this.cpy = cpy;
        this.color = color;
    }

    execute() {
        this.chord.draw(this.cpy, this.color);
    }
}


export default class Chord {

    constructor(id, graphHelper, config, timer) {
        this.limitValue = 5;
        this.id = "chord-" + id;
        this.x1 = config.x1;
        this.x2 = config.x2;
        this.middleX = (config.x2 - config.x1) / 2;
        this.y = config.y;
        this.lineWidth = config.lineWidth;
        this.colorInfo = config.color;
        this.graphHelper = graphHelper;
        this.timer = timer;
        this.isPlaying = false;
    }

    draw(cpY, color) {

        cpY = cpY || 0;
        color = color || this.colorInfo.defaultColor;

        this.graphHelper.drawChord(this.x1,
                                    this.x2,
                                    this.y,
                                    (this.x1 + this.x2) / 2,
                                    cpY + this.y, color,
                                    (this.x1 + this.x2) / 10,
                                    this.lineWidth);
    }

    hitTest(lastY, mouseX, mouseY) {
        if (lastY > mouseY) {
            return this.y >= mouseY && this.y < lastY &&
                    mouseX >= this.x1 && mouseX <= this.x2;
        } else {
            return this.y > lastY && this.y <= mouseY &&
                    mouseX >= this.x1 && mouseX <= this.x2;
        }
    }

    play(isReverse, currentX) {

        let percent = 1 - Math.abs((currentX - this.x1) - this.middleX) / this.middleX;
        let cpyList = this.createCpy(Math.ceil(percent * this.limitValue), .5, isReverse);
        let colorList = this.createColor(this.colorInfo, cpyList.length);

        let taskList = [];

        this.isPlaying = true;

        for (let i = 0; i < cpyList.length; i++) {

            var task = new ShakeTask(this, cpyList[i], colorList[i]);
            if (i === cpyList.length - 1) {
                task.addCompleteListener((function() {
                    this.isPlaying = false;
                }).bind(this));
            }
            taskList.push(task);
        }

        let timer = this.timer;
        timer.addTask(this.id, ESUtil.getIterator(taskList));
        timer.start();
    }

    createCpy(maxStep, step, isMinus) {
        let cpyList = [];
        while (maxStep != 0) {

            for (let index = maxStep; index > -(maxStep - step); index --) {
                cpyList.push(index * (isMinus ? -1 : 1));
            }

            maxStep = -(maxStep - step);

            for (let index = maxStep; index < -(maxStep + step); index++) {
                cpyList.push(index * (isMinus ? -1 : 1));
            }
            maxStep = -(maxStep + step);

            if (maxStep < 0) {
                maxStep = 0;
            }
        }

        if (cpyList[0] != 0) {
            cpyList.push(0);
        }

        return cpyList;
    }

    createColor(singleColor, count) {
        let offsetValue = singleColor.value / count;
        let colorList = [];

        for (let index = 1; index <= count; index++) {

            let color = "rgba(";

            if (singleColor.type == ColorConstant.R) {
                color += singleColor.value + ",";
            } else {
                color += Math.ceil(offsetValue * index) + ",";
            }

            if (singleColor.type == ColorConstant.G) {
                color += singleColor.value + ",";
            } else {
                color += Math.ceil(offsetValue * index) + ",";
            }

            if (singleColor.type == ColorConstant.B) {
                color += singleColor.value + ",";
            } else {
                color += Math.ceil(offsetValue * index) + ",";
            }

            color += "1)";
            colorList.push(color);
        }

        return colorList;
    }

}