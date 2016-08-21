import React from 'react';

import backgroundImageUrl from './images/guitar.png';

export default class Guitar extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
			<div style={{backgroundImage: 'url(' + backgroundImageUrl + ')'}}>1234</div>
		);
    }
}