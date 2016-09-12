import React from 'react';

import Background from './component/Background';
import ChordLayer from './component/ChordLayer';
import OperationPanel from './component/OperationPanel';

import style from '../css/style.css';

let layoutStyle = {
	width: "465px",
    height: "176px"
};

export default class Guitar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
        	<div className={style.containerLayout} style={layoutStyle}>
        		<Background/>
        		<ChordLayer width={layoutStyle.width} height={layoutStyle.height}/>
                <OperationPanel/>
        	</div>
		);
    }
}