

export default class GraphHelper {

	constructor(canvas) {
		this.canvas = canvas;
		this.width = parseInt(this.canvas.width, 10);
		this.height = parseInt(this.canvas.height, 10);
	}

	getCtx() {
		if (!this.ctx) {
			this.ctx = this.canvas.getContext("2d");
		}
		return this.ctx;
	}

	clear() {
		var ctx = this.getCtx();
		ctx.clearRect(0, 0, this.width, this.height);
	}

	drawChord(x1, x2, y, cpX, cpY, strokeStyle, dValue, lineWidth) {

		var ctx = this.getCtx();

		if (!ctx) {
			return null;
		}

		ctx.shadowColor = "rgba(0, 0, 0, 0.19)";
		ctx.shadowBlur = 3;
		ctx.shadowOffsetY = 4;
		ctx.shadowOffsetX = 1;
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.lineCap = "round";
		ctx.moveTo(x1, y);
		ctx.strokeStyle = String(strokeStyle);
		if (cpY === y) {
			ctx.lineTo(x2, y);
		} else {
			ctx.bezierCurveTo(cpX - dValue, cpY, cpX + dValue, cpY, x2, y);
		}
		ctx.stroke();
	}
}