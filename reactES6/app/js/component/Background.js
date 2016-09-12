import style from '../../css/style.css';

import React from 'react';

export default class Background extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className={style.background}></div>
        );
    }
}