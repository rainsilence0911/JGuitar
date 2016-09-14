import React from 'react';

import GraphHelper from '../util/GraphHelper';
import PositionUtil from '../util/PositionUtil';
import Timer from '../util/Timer';

import configs from '../config/ChordConfig';

import Chord from '../part/Chord';
import EventManager from '../event/EventManager';
import Events from '../event/Events';

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

        for (let i = 0; i < configs.length; i++) {
            var chord = new Chord(graphHelper, configs[i], timer);
            chord.draw();
            this.chords.push(chord);
        }
    }

    handleMouseMove(e) {

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
                chord.play(this.lastY > mouseY, mouseX);
                EventManager.fire(Events.PLAY_AUDIO, {
                    id: chord.id
                });
            }
        }

        this.lastY = mouseY;
    }

    render() {
        return (
            <canvas ref="canvas" className={style.chordPanel}
                onMouseMove={this.handleMouseMove.bind(this)}
                width={this.state.width} height={this.state.height}></canvas>
        );
    }
}
