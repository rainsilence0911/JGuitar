
import React from 'react';

import GraphHelper from '../util/GraphHelper';
import PositionUtil from '../util/PositionUtil';
import Timer from '../util/Timer';
import ESUtil from '../util/ESUtil';

import Chord from '../part/Chord';

import EventManager from '../event/EventManager';
import Events from '../event/Events';

import configs from '../config/ChordConfig';

import style from '../../css/style.css';

export default class ChordLayer extends React.Component {
    constructor(param) {
        super();
        this.state = {
            width: param.width,
            height: param.height
        };
        this.lastY = null;
        this.chords = [];
        this.keyMapper = {};
        this.soundList = [];
        this.isReplaying = false;
        this.isRecording = false;
    }

    componentDidMount() {
        let graphHelper = new GraphHelper(this.refs.canvas);

        let timer = new Timer();

        timer.addPreAction((function() {
            graphHelper.clear();

            this.chords.forEach(function(chord) {
                if (chord.isPlaying === false) {
                    chord.draw();
                }
            });

        }).bind(this));

        timer.onComplete = this.onFrameComplete.bind(this);

        for (let i = 0; i < configs.length; i++) {
            var config = configs[i];
            var chord = new Chord(graphHelper, config, timer);
            chord.draw();
            this.chords.push(chord);
            this.keyMapper[config.keyCode] = i;
        }

        EventManager.register(Events.KEY_DOWN, this.handleKeyDown.bind(this));
        EventManager.register(Events.RECORD_AUDIO, this.handleRecordAudio.bind(this));
        EventManager.register(Events.REPLAY_AUDIO, this.handleReplayAudio.bind(this));
    }

    handleMouseMove(e) {

        if (this.isReplaying) {
            return;
        }

        let event = e.nativeEvent;

        let {x: mouseX, y: mouseY} = PositionUtil.getLayerXY(event, this.refs.canvas);

        if (!this.lastY) {
            this.lastY = mouseY;
        }

        if (this.lastY === mouseY) {
            return;
        }

        let chords = this.chords;

        for (let i = 0; i < chords.length; i++) {

            let chord = chords[i];

            if (chord.hitTest(this.lastY, mouseX, mouseY)) {
                this.playAudio(i, this.lastY > mouseY, mouseX);
            }
        }

        this.lastY = mouseY;
    }

    handleKeyDown(e) {

        if (this.isReplaying) {
            return;
        }

        let index = this.keyMapper[e.keyCode];

        if (index == null) {
            return;
        }

        this.playAudio(index, false);
    }

    handleRecordAudio() {
        this.isRecording = true;
        this.soundList = [];
    }

    handleReplayAudio(e) {

        this.isRecording = false;
        this.isReplaying = true;
        let soundIter = ESUtil.getIterator(this.soundList);

        let current = soundIter.next();

        if (current.done) {
            EventManager.fire(Events.REPLAY_FINISHED);
            this.isReplaying = false;
            return;
        }

        this.replayAudio(soundIter, current.value);
    }

    onFrameComplete() {

        // if last sound and timer complete, it will trigger isReplaying = false
        if (this.isReplaying === false ||
            this.soundList.length !== 0) {
            return;
        }

        this.isReplaying = false;
        EventManager.fire(Events.REPLAY_FINISHED);
    }

    replayAudio(soundIter, currentSound) {

        this.playAudio(currentSound.index, currentSound.isReverse, currentSound.mouseX);

        let next = soundIter.next();

        if (next.done) {
            this.soundList = [];
            return;
        }

        let nextSound = next.value;
        let elapse = nextSound.time - currentSound.time;
        setTimeout((function() {
            this.replayAudio(soundIter, nextSound);
        }).bind(this), elapse);
    }

    playAudio(index, isReverse, mouseX) {
        let chord = this.chords[index];
        chord.play(isReverse, mouseX);
        EventManager.fire(Events.PLAY_AUDIO, {
            id: chord.id
        });
        if (this.isRecording) {
            this.soundList.push({
                index: index,
                isReverse: isReverse,
                time: new Date().getTime(),
                mouseX: mouseX
            });
        }
    }

    render() {
        return (
            <canvas ref="canvas" className={style.chordPanel}
                onMouseMove={this.handleMouseMove.bind(this)}
                width={this.state.width} height={this.state.height}></canvas>
        );
    }
}
