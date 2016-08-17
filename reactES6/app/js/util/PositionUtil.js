
export default class PositionUtil {

    static getMousePosition(e) {
        var event = e || window.event;
        if (event.pageX || event.pageY) {
            return {x:event.pageX, y:event.pageY};
        }
        return {
            x:event.clientX + document.body.scrollLeft - document.body.clientLeft,
            y:event.clientY + document.body.scrollTop - document.body.clientTop
        };
    }

    static getNodePosition(target) {
        var left = 0, top = 0;
        do {
            left += (target.offsetLeft || 0) + (target.clientLeft || 0);
            top += (target.offsetTop || 0) + (target.clientTop || 0);
            target = target.offsetParent;
        } while(target);
        return {
            left: left,
            top: top
        };
    }

    static getLayerXY(e, target) {

        if (e.layerX != null && e.layerY != null) {
            return {
                x: e.layerX,
                y: e.layerY
            };
        }

        var pos = PositionUtil.getMousePosition(e);
        var targetPos = PositionUtil.getNodePosition(target);

        return {
            x: pos.x - targetPos.left,
            y: pos.y - targetPos.top
        };
    }
}