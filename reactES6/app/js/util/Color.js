
export var ColorConstant = {
	R: "r",
	G: "g",
	B: "b"
};

export class SingleColor {

	constructor(type, value) {
		this.type = type;
		this.value = value;
		this.defaultColor = "rgba(" + value + ", " + value + ", " + value + ", 1)";
	}
};