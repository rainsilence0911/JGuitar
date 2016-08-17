import backgroundImageUrl from '../../images/guitar.png';

import React from 'react';

const backgroundStyle = {
	backgroundImage: 'url(' + backgroundImageUrl + ')',
	backgroundRepeat: 'no-repeat',
	zIndex: 0,
	position: 'absolute',
	width: '100%',
	height: '100%'
};

export default class Background extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
			<div style={backgroundStyle}></div>
		);
    }
}