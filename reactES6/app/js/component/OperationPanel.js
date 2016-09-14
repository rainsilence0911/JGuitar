
import React from 'react';

import ESUtil from '../util/ESUtil';

import EventManager from '../event/EventManager';
import Events from '../event/Events';

import style from '../../css/style.css';

export default class OperationPanel extends React.Component {
    constructor() {
        super();
        this.offPosition = "-270px 51px";
        this.onPosition = "-474px 35px";
        this.onKeyPosition = "79px -4px",
        this.offKeyPosition = "79px -43px",

        this.state = {
            isRecording: false,
            isKeyBoardMode: false
        };

        this.keydownHandlerProxy = this.keyDownHandler.bind(this);

        EventManager.register(Events.REPLAY_FINISHED, this.onReplayFinished.bind(this));
    }

    onRecordClick(event) {

        let isRecording = this.state.isRecording;
        this.refs.statusBoard.innerHTML = isRecording ? "Replaying" : "Recording";

        if (isRecording) {
            EventManager.fire(Events.REPLAY_AUDIO);
        } else {
            EventManager.fire(Events.RECORD_AUDIO);
        }

        this.setState({
            isRecording: !isRecording
        });
    }

    onKeyboardSupportClick(event) {

        var isKeyBoardMode = this.state.isKeyBoardMode;

        if (isKeyBoardMode) {
            ESUtil.removeEventListener(document, 'keydown', this.keydownHandlerProxy);
        } else {
            ESUtil.addEventListener(document, 'keydown', this.keydownHandlerProxy);
        }

        this.setState({
            isKeyBoardMode: !isKeyBoardMode
        });
    }

    onReplayFinished() {
        this.refs.statusBoard.innerHTML = "";
    }

    keyDownHandler(e) {
        var event = e || window.event;
        var keyCode = event.keyCode;
        EventManager.fire(Events.KEY_DOWN, {
            keyCode: keyCode
        });
    }

    render() {

        let recordStyle = {
            backgroundPosition: this.state.isRecording ? this.onPosition : this.offPosition
        };

        let keyboardStyle = {
            backgroundPosition: this.state.isKeyBoardMode ? this.onKeyPosition : this.offKeyPosition
        };

        return (
            <div>
                <div style={recordStyle} className={style.recordButton} onClick={this.onRecordClick.bind(this)}></div>
                <div className={style.statusBoard} ref="statusBoard"></div>
                <div style={keyboardStyle} className={style.keyboardSupport} onClick={this.onKeyboardSupportClick.bind(this)}></div>
            </div>
        );
    }
}
