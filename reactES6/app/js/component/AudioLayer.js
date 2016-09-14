import React from 'react';

import configs from '../config/ChordConfig';

import EventManager from '../event/EventManager';
import Events from '../event/Events';

export default class AudioLayer extends React.Component {

    componentDidMount() {
        EventManager.register(Events.PLAY_AUDIO, this.onPlayAudio.bind(this));
    }

    onPlayAudio(e) {
        var audioTag = this.refs[e.id];

        if (audioTag == null) {
            return;
        }

        if (window.HTMLAudioElement) {
            if (audioTag.paused) {
                audioTag.play();
            } else {
                audioTag.currentTime = 0;
            }
        }
    }

    render() {
        return (
            <div>
            {
                configs.map(function(config) {
                    return <audio key={config.id} ref={config.id} src={config.audio} ></audio>;
                })
            }
            </div>
        );
    }
}
