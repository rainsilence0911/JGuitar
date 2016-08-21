import React from 'react';

import Background from './component/Background';
import ChordLayer from './component/ChordLayer';
import OperationPanel from './component/OperationPanel';
import AudioPlayer from './component/AudioPlayer';


let layoutStyle = {
	width: "465px",
    height: "176px",
    position: "relative",
    border: "solid 1px black"
};


export default class Guitar extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
        	<div style={layoutStyle}>
        		<Background/>
        		<ChordLayer width={layoutStyle.width} height={layoutStyle.height}/>
                <OperationPanel/>
                <AudioPlayer/>
        	</div>
		);
    }
}