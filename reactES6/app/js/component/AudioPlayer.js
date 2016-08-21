import React from 'react';

import configs from '../config/ChordConfig';

import EventManager from '../util/EventManager';
import Events from '../util/Events';

export default class AudioPlayer extends React.Component {
	constructor() {
        super();
        let list = [];
        for (let i = 0; i < configs.length; i++) {
        	list.push(configs[i].audio);
        }
        this.soundList = list;

        EventManager.register(Events.PLAY_SOUND, this.handlePlay.bind(this));
    }

    handlePlay(e) {

    	let id = e.id.replace("chord-", "sound-");

    	let audioTag = this.refs[id];

    	if (audioTag.paused) {
			audioTag.play();
		} else {
			audioTag.currentTime = 0;
		}
    }

    getKey(index) {
    	return `sound-${index}`;
    }

    render() {
    	return (
    		<div id="audioContainer">
    			{
    				this.soundList.map(function(soundUrl, index) {
    					let key = this.getKey(index);
    					return (<audio src={soundUrl} key={key} ref={key}></audio>);
    				}, this)
    			}
    		</div>
    	);
    }
}