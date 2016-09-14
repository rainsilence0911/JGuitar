
import React from 'react';

import style from '../../css/style.css';

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
