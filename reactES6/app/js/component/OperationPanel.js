
import style from '../../css/style.css';

import React from 'react';

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
    }

    onRecordClick(event) {

        let isRecording = this.state.isRecording;
        this.refs.statusBoard.innerHTML = isRecording ? "" : "Recording";

        this.setState({
            isRecording: !isRecording
        });
    }

    onKeyboardSupportClick(event) {
        this.setState({
            isKeyBoardMode: !this.state.isKeyBoardMode
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