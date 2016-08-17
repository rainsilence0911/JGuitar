
import imageUrl from '../../images/guitar.png';

import React from 'react';

const recordButtonStyle = {
    backgroundImage: 'url(' + imageUrl + ')',
    zIndex: 3,
    position: 'absolute',
    cursor: "pointer",
    left: "208px",
    top: "126px",
    width: "62px",
    height: "35px"
};

const statusBoardStyle = {
    position: "absolute",
    left: "110px",
    top: "136px",
    width: "162px",
    height: "35px",
    fontFamily: "georgia",
    fontSize: "12px",
    zIndex: 2
};

const keyboardSupportStyle = {
    position: "absolute",
    left: "276px",
    top: "128px",
    width: "62px",
    height: "35px",
    backgroundImage: "url('" + imageUrl + "')",
    cursor: "pointer",
    zIndex: 9
};


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

        let recordStyle = Object.assign({
            backgroundPosition: this.state.isRecording ? this.onPosition : this.offPosition
        }, recordButtonStyle);

        let keyboardStyle = Object.assign({
            backgroundPosition: this.state.isKeyBoardMode ? this.onKeyPosition : this.offKeyPosition
        }, keyboardSupportStyle);

        return (
            <div>
                <div style={recordStyle} onClick={this.onRecordClick.bind(this)}></div>
                <div style={statusBoardStyle} ref="statusBoard"></div>
                <div style={keyboardStyle} onClick={this.onKeyboardSupportClick.bind(this)}></div>
            </div>
        );
    }
}