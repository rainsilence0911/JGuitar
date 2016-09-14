
import {SingleColor, ColorConstant} from '../util/Color';
import audio3n from '../../music/3n.ogg';

var configs = [
    {
        x1: 30,
        x2: 105,
        y: 23,
        lineWidth: 2,
        color: new SingleColor(ColorConstant.R, 190),
        audio: audio3n,
        keyCode: 49
    },
    {
        x1: 30,
        x2: 105,
        y: 37,
        lineWidth: 2,
        color: new SingleColor(ColorConstant.G, 190),
        audio: audio3n,
        keyCode: 50
    },
    {
        x1: 65,
        x2: 318,
        y: 66,
        lineWidth: 2,
        color: new SingleColor(ColorConstant.B, 150),
        audio: audio3n,
        keyCode: 51
    },
    {
        x1: 30,
        x2: 281,
        y: 81,
        lineWidth: 2,
        color: new SingleColor(ColorConstant.R, 160),
        audio: audio3n,
        keyCode: 52
    },
    {
        x1: 30,
        x2: 281,
        y: 96,
        lineWidth: 2,
        color: new SingleColor(ColorConstant.G, 190),
        audio: audio3n,
        keyCode: 53
    },
    {
        x1: 30,
        x2: 105,
        y: 111,
        lineWidth: 1,
        color: new SingleColor(ColorConstant.B, 190),
        audio: audio3n,
        keyCode: 54
    },
    {
        x1: 360,
        x2: 434,
        y: 66,
        lineWidth: 1,
        color: new SingleColor(ColorConstant.R, 100),
        audio: audio3n,
        keyCode: 55
    },
    {
        x1: 360,
        x2: 434,
        y: 81,
        lineWidth: 1,
        color: new SingleColor(ColorConstant.G, 110),
        audio: audio3n,
        keyCode: 56
    },
    {
        x1: 330,
        x2: 404,
        y: 95,
        lineWidth: 1,
        color: new SingleColor(ColorConstant.B, 99),
        audio: audio3n,
        keyCode: 57
    },
    {
        x1: 360,
        x2: 434,
        y: 111,
        lineWidth: 1,
        color: new SingleColor(ColorConstant.R, 90),
        audio: audio3n,
        keyCode: 48
    }
]

// create id
configs.forEach(function(config) {
    config.id = String(config.x1) + String(config.x2) + String(config.y);
});

export default configs;
