/**
 * 
 */
(function() {
	
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	var isIE9 = /msie 9/i.test(navigator.userAgent);
	
	var addEventListener = function() {
		if (window.addEventListener) {
			return function(control, eventName, fn) {
				control.addEventListener(eventName, fn, false);
			};
		} else if (window.attachEvent) {
			return function(control, eventName, fn) {
				control.attachEvent('on' + eventName, function(e) {fn.call(control, e);});
			};
		} else {
			return function(control, eventName, fn) {
				control['on' + eventName] = fn;
			};
		}
	}();
	
	function mousePosition(e) {
		var event = e || window.event;
		if (event.pageX || event.pageY) {
			return {x:event.pageX, y:event.pageY};
		}
		return {
			x:event.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:event.clientY + document.body.scrollTop - document.body.clientTop
		};
	}
	
	function getPosition(target) {
		var left = 0, top = 0;
		do {
			left += target.offsetLeft || 0;
			top += target.offsetTop || 0;
			target = target.offsetParent;
		} while(target);
		return {
			left: left,
			top: top
		};
	}
	
	function createElement(tagName, props, styles) {
		
		props = props || {};
		
		styles = styles || {};
		
		var tag = document.createElement(tagName);
		
		for (var propName in props) {
			tag[propName] = props[propName];
		}
		
		for (var styleName in styles) {
			tag.style[styleName] = styles[styleName];
		}
		
		return tag;
	}
	
	var Class = (function() {  
      
        /** 
         * Initialze object from class. 
         * @param class object. 
         */  
        var initializeClass = (function() {  
            if (Object.create) {  
                return Object.create;  
            } else {  
                return function(o) {  
                    function F() {}    
                    F.prototype = o;    
                    return new F();  
                };  
            }  
        })();  
  
        /** 
         * The main function of Class. 
         *  
         * @param classContent 
         * @param superClass 
         */  
        return function() {  
  
            var classPrototype = arguments[arguments.length - 1] || {};  
  
            for (var index = 0; index < arguments.length - 1; index++) {  
  
                var superClass = arguments[index];  
                  
                if (typeof superClass["initialize"] == "function") {  
                    classPrototype.superclass = superClass["initialize"];  
                } else {  
                    classPrototype.superclass = function() {};  
                }  
                  
                for (var prop in superClass) {  
  
                    if (prop == "initialize" || prop == "newInstance") {  
                        continue;  
                    }  
                      
                    if (classPrototype.hasOwnProperty(prop)) {  
                        if (typeof superClass[prop] == "function") {  
                            classPrototype.superclass[prop] = superClass[prop];  
                        }  
                    } else {  
                        classPrototype[prop] = superClass[prop];  
                    }  
                }  
            }  
            classPrototype.newInstance = function() {  
                var instance = initializeClass(this);  
                if (instance["initialize"]) {  
                    instance["initialize"].apply(instance, arguments);  
                }  
                return instance;  
            };  
            return classPrototype;  
        };  
    })();
	
	var Iterator = Class({
		next: function() {},
		hasNext: function() {}
	});
	
	var SoundIterator = Class({
		soundList: [],
		recordHelper: null,
		initialize: function(recordHelper) {
			var soundList = recordHelper.soundList;
			for (var index = soundList.length - 1; index >= 0; index--) {
				this.soundList.push(soundList[index]);
			}
			this.recordHelper = recordHelper;
		},
		next: function() {
			return this.soundList.pop();
		},
		hasNext: function() {
			
			if (this.soundList.length > 0) {
				return true;
			}
			this.recordHelper.onComplete();
			return false;
		}
	});
	
	var ProcessorIterator = Class(Iterator, {
		processList: [],
		
		initialize: function(processList) {
			this.processList = [];
			for (var index = processList.length - 1; index >= 0; index--) {
				this.processList.push(processList[index]);
			}
		},
		next: function() {
			return this.processList.pop();
		},
		hasNext: function() {
			return this.processList.length > 0;
		}
	});
	
	var Process = Class({
		initialize: function() {
		},
		execute: function() {
		}
	});
	
	var Timer = Class({
		
		iteratorList: null,
		
		frameCount: 8,
		
		preProcess: null,
		
		onComplete: null,
		
		isRunning: false,
		
		initialize: function(frameCount) {
			this.frameCount = frameCount || 8;
			this.iteratorList = {};
		},
		
		addProcess: function(name, process) {
			this.iteratorList[name] = process;
		},
		
		run: function() {
			
			if (this.preProcess) {
				this.preProcess();
			}
			
			var copiedIter = copyIterator(this.iteratorList);
			
			for (var prop in copiedIter) {
				var iter = copiedIter[prop];
				
				if (iter.hasNext()) {
					var process = iter.next();
					process.execute();
				}
				
				if (iter.hasNext() == false) {
					this.iteratorList[prop] = null;
					delete this.iteratorList[prop];
				}
			}
			
			var hasNext = false;
			for (var prop in this.iteratorList) {
				var target = this;
				setTimeout(function() {target.run();}, this.frameCount);
				hasNext = true;
				break;
			}
			this.isRunning = hasNext;
			
			if (this.isRunning == false && this.onComplete) {
				this.onComplete();
			}
			
			function copyIterator(target) {
				var copiedIter = {};
				for (var prop in target) {
					copiedIter[prop] = target[prop];
				}
				return copiedIter;
			}
		},
		
		start: function(delay) {
			if (this.isRunning) {
				return;
			}
			var target = this;
			setTimeout(function() {
				target.run();
			}, delay || 1);
			this.isRunning = true;
		}
	});

	var GraphHelper = Class({
		container: null,
		width: null,
		height: null,
		ctx: null,
		
		initialize: function(containerId, width, height) {
			this.container = document.getElementById(containerId);
			this.container.style.width = width + "px";
			this.container.style.height = height + "px";
			this.width = width;
			this.height = height;
		},
		

		getCtx: function() {
			if (!this.ctx) {
				var cvs = document.createElement('canvas');
				
				cvs.id = "canvas_" + new Date().getTime();
				cvs.width = this.width;
				cvs.height = this.height;
				cvs.style.borderStyle = "solid";
				cvs.style.borderWidth = "1px";
				cvs.style.position = 'absolute';
				
				this.container.appendChild(cvs);
				if (isIE && !isIE9) {
					G_vmlCanvasManager.initElement(cvs);
					cvs = document.getElementById(cvs.id);
				}
				this.canvas = cvs;
				this.ctx = cvs.getContext('2d');
			}
			return this.ctx;
		},

		clear: function() {
			var ctx = this.getCtx();
			ctx.clearRect(0, 0, this.width, this.height);
		},

		addEventListener: function(event, fn) {
			this.getCtx();
			addEventListener(this.canvas, event, fn);
		},

		setStyle: function(props) {
			for (var prop in props) {
				this.canvas.style[prop] = props[prop];
			}
		},
		drawImage: function(image, srcLeft, srcTop, srcWidth, srcHeight, descLeft, descTop, descWidth, descHeight) {
			
			var ctx = this.getCtx();
			
			if (!ctx) {
				return null;
			}
			ctx.drawImage(image, srcLeft, srcTop, srcWidth, srcHeight, descLeft, descTop, descWidth, descHeight);
			
		},
		drawChord: function(x1, x2, y, cpX, cpY, strokeStyle, dValue, lineWidth) {
			
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
			if (cpY == y) {
				ctx.lineTo(x2, y);
			} else {
				ctx.bezierCurveTo(cpX - dValue, cpY, cpX + dValue, cpY, x2, y);
			}
			ctx.stroke();
		}
		
	});

	var RecordHelper = Class({
		
		recordBoard: null,
		
		displayBoard: null,
		
		onPosition: "-474px 35px",
		
		offPosition: "-270px 51px",
		
		isRecording: false,
		
		isReplying: false,
		
		soundList: [],
		
		processor: null,
		
		initialize: function(containerId, imageUrl, processor) {
			var container = document.getElementById(containerId);
			var pos = getPosition(container);
			this.processor = processor;
			this.initSoundList();
			this.initRecord(pos.left, pos.top, imageUrl);
			this.initEvent();
		},
		
		initRecord: function(containerLeft, containerTop, imageUrl) {
			
			this.recordBoard = createElement("div", null, {
				position: "absolute",
				left: (containerLeft + 208) + "px",
				top: (containerTop + 126) + "px",
				width: "62px",
				height: "35px",
				backgroundImage: "url('" + imageUrl + "')",
				cursor: "pointer",
				backgroundPosition: this.offPosition,
				zIndex: 9
			});
			
			this.displayBoard = createElement("div", null, {
				position: "absolute",
				left: (containerLeft + 110) + "px",
				top: (containerTop + 136) + "px",
				width: "162px",
				height: "35px",
				fontFamily: "georgia",
				fontSize: "12px",
				zIndex: 9
			});
			
			this.isRecording = false;
			document.body.appendChild(this.displayBoard);
			document.body.appendChild(this.recordBoard);
		},
		
		initEvent: function() {
			var target = this;
			this.recordBoard.onclick = function() {
				
				if (target.isRecording) {
					target.recordBoard.style.backgroundPosition = target.offPosition;
					target.isRecording = false;
					target.isReplying = true;
					target.displayBoard.innerHTML = "Replying...";
					target.processor.playRecord();
				} else {
					target.recordBoard.style.backgroundPosition = target.onPosition;
					target.isRecording = true;
					target.displayBoard.innerHTML = "Recording...";
					target.initSoundList();
				}
			};
		},
		
		initSoundList: function() {
			this.soundList = [];
		},
		
		addSound: function(chordId, time, mouseX) {
			if (this.isReplying) {
				return;
			}
			this.soundList.push({chordId: chordId, time: time, x: mouseX});
		},
		
		iterator: function() {
			return SoundIterator.newInstance(this);
		},
		
		onComplete: function() {
			var target = this.processor;
			target.timer.onComplete = function() {
				target.recordHelper.isReplying = false;
				target.recordHelper.displayBoard.innerHTML = "";
			};
		}
	});
	
	var KeyboardHelper = Class({
		
		processor: null,
		
		keyboard: null,
		
		isOpen: false,
		
		keyMap: [],
		
		onPosition: "79px -4px",
		
		offPosition: "79px -43px",
		
		initialize: function(containerId, imageUrl, processor) {
			
			var container = document.getElementById(containerId);
			var pos = getPosition(container);
			
			this.keyboard = createElement("div", null, {
				position: "absolute",
				left: (pos.left + 276) + "px",
				top: (pos.top + 128) + "px",
				width: "62px",
				height: "35px",
				backgroundImage: "url('" + imageUrl + "')",
				cursor: "pointer",
				backgroundPosition: this.offPosition,
				zIndex: 9
			});
			
			document.body.appendChild(this.keyboard);
			
			this.processor = processor;
			this.initEvent();
			this.initKeyMap();
			
		},
		
		initEvent: function() {
			
			var targetThis = this;
			
			this.keyboard.onclick = function() {
				if (targetThis.isOpen) {
					targetThis.isOpen = false;
					targetThis.keyboard.style.backgroundPosition = targetThis.offPosition;
				} else {
					targetThis.isOpen = true;
					targetThis.keyboard.style.backgroundPosition = targetThis.onPosition;
				}
			};
			
			document.onkeydown = function(e) {
				if (!targetThis.isOpen) {
					return;
				}
				
				var event = e || window.event;
				var keyCode = event.keyCode;
				if (keyCode < targetThis.keyMap[0].keyCode || 
						keyCode > targetThis.keyMap[targetThis.keyMap.length - 1].keyCode) {
					return;
				}
				
				for (var index = 0; index < targetThis.keyMap.length; index++) {
					
					var currentKey = targetThis.keyMap[index];
					if (keyCode != currentKey.keyCode) {
						continue;
					}
					
					var chordId = currentKey.chordId;
					
					for (var partIndex = 0; partIndex < targetThis.processor.partList.length; partIndex++) {
						var part = targetThis.processor.partList[partIndex];
						if (part.id == chordId) {
							var mouseX = Math.ceil((part.x1 + part.x2) / 2);
							part.play(true, targetThis.processor.timer, mouseX);
							part.isPlaying = true;
							targetThis.processor.timer.start();
							targetThis.processor.recordHelper.addSound(chordId, +new Date, mouseX);
							break;
						}
					}
					break;
				}
			};
		},
		
		initKeyMap: function() {
			
			var ascii = 49;
			
			for (var partIndex = 0; partIndex < this.processor.partList.length; partIndex++) {
				var part = this.processor.partList[partIndex];
				if (part.id == null) {
					continue;
				}
				this.keyMap.push({keyCode: ascii, chordId: part.id});
				ascii++;
			}
		}
	});
	
	
	var ChordProcess = Class(Process, {
		
		initialize: function(chord, cpyValue, color) {
			this.chord = chord;
			this.cpyValue = cpyValue;
			this.color = color;
		},
		
		execute: function() {
			this.chord.draw(this.cpyValue, this.color);
			
			if (this.postProcess) {
				this.postProcess();
			}
			
		},
		
		postProcess: null
	});
	
	var Chord = Class({
		limitValue: 5,
		x1: null,
		x2: null,
		y: null,
		lineWidth: null,
		colorInfo: null,
		graphHelper: null,
		audioHelper: null,
		isPlaying: false,
		id: null,
		initialize: function(id, x1, x2, y, lineWidth, colorInfo, graphHelper, audioPath) {
			this.id = "chord-" + id;
			this.x1 = x1;
			this.x2 = x2;
			this.middleX = (x2 - x1) / 2;
			this.y = y;
			this.lineWidth = lineWidth;
			this.colorInfo = colorInfo;
			this.graphHelper = graphHelper;
			this.initAudio(audioPath);
		},

		draw: function(cpY, color) {
			
			color = color || this.colorInfo.defaultColor;
			
			this.graphHelper.drawChord(this.x1, 
										this.x2, 
										this.y, 
										(this.x1 + this.x2) / 2, 
										cpY + this.y, color, 
										(this.x1 + this.x2) / 10, 
										this.lineWidth);
		},
		
		initAudio: function(audioPath) {
			
			if (isIE && !isIE9) {
				return;
			}
			this.audioHelper = document.createElement("audio");
			this.audioHelper.src = audioPath;
			document.body.appendChild(this.audioHelper);
		},
		
		play: function(isMinus, timer, currentX) {
			
			var target = this;
			var percent = 1 - Math.abs((currentX - this.x1) - this.middleX) / this.middleX;
			var cpyList = initCpy(Math.ceil(percent * this.limitValue), .5);
			var colorWorker = ColorWorker.newInstance(this.colorInfo, cpyList.length);
			var colorIterator = colorWorker.iterator();
			
			function initCpy(maxStep, step) {
				
				var cpyList = [];
				while (maxStep != 0) {
					
					for (var index = maxStep; index > -(maxStep - step); index --) {
						cpyList.push(index * (isMinus ? -1 : 1));
					}
					
					maxStep = -(maxStep - step);
					
					for (var index = maxStep; index < -(maxStep + step); index++) {
						cpyList.push(index * (isMinus ? -1 : 1));
					}
					maxStep = -(maxStep + step);
					
					if (maxStep < 0) {
						maxStep = 0;
					}
				}
				
				if (cpyList[0] != 0) {
					cpyList.push(0);
				}
				
				return cpyList;
			}
			
			var processList = [];
			for (var cpIndex = 0; cpIndex < cpyList.length; cpIndex++) {
				var process = ChordProcess.newInstance(target, cpyList[cpIndex], colorIterator.next());
				if (cpIndex == cpyList.length - 1) {
					process.postProcess = function() {
						this.chord.isPlaying = false;
					};
				}
				processList.push(process);
			}
			
			if (window.HTMLAudioElement) {
				if (this.audioHelper.paused) {
					this.audioHelper.play();
				} else {
					this.audioHelper.currentTime = 0;
				}
			}
			timer.addProcess(this.id, ProcessorIterator.newInstance(processList));
		}
		
	});
	
	var ColorWorker = Class({
		
		ColorIterator: Class(Iterator, {
			
			colorList: [],
			
			initialize: function(colorList) {
				this.colorList = colorList;
			},
			
			next: function() {
				
				if (this.colorList.length > 0) {
					return this.colorList.splice(0, 1);
				}
				return null;
			},
			
			hasNext: function() {
				return this.colorList.length > 0;
			}
		}),
		
		iterator: function() {
			return this.ColorIterator.newInstance(this.colorList);
		},
		
		initialize: function(singleColor, count) {
			
			var offsetValue = singleColor.value / count;
			
			for (var index = 1; index <= count; index++) {
				
				var color = "rgba(";
				
				if (singleColor.type == ColorConstant.R) {
					color += singleColor.value + ",";
				} else {
					color += Math.ceil(offsetValue * index) + ",";
				}
				
				if (singleColor.type == ColorConstant.G) {
					color += singleColor.value + ",";
				} else {
					color += Math.ceil(offsetValue * index) + ",";
				}
				
				if (singleColor.type == ColorConstant.B) {
					color += singleColor.value + ",";
				} else {
					color += Math.ceil(offsetValue * index) + ",";
				}
				
				color += "1)";
				this.colorList.push(color);
			}
		},
		
		colorList: []
	});
	
	var ColorConstant = {
		R: "r",
		G: "g",
		B: "b"
	};
	
	var SingleColor = Class({
		value: 0,
		type: null,
		initialize: function(type, value) {
			this.type = type;
			this.value = value;
			this.defaultColor = "rgba(" + value + ", " + value + ", " + value + ", 1)";
		}
	});
	
	var GuitarBoard = Class({
		
		initialize: function(graphHelper, image) {
			this.image = image;
			this.graphHelper = graphHelper;
		},
		
		draw: function() {
			this.graphHelper.drawImage(this.image, 0, 0, 465, 176, 0, 0, 465, 176);
		}
	});
	
	var GuitarProcessor = Class({
		
		timer: Timer.newInstance(),
		
		partList: [],
		
		recordHelper: null,
		
		lastY: null,
		
		initialize: function(containerId, width, height) {
			
			var graphHelper = GraphHelper.newInstance(containerId, width, height);
			
			var targetThis = this;
			
			this.recordHelper = RecordHelper.newInstance(containerId, guitarConfig.background, targetThis);
			
			var bgImage = this.loadImage(guitarConfig.background, function() {
				
				var board = GuitarBoard.newInstance(graphHelper, bgImage);
				board.draw();
				targetThis.addPart(board);
				for (var index = 0; index < guitarConfig.chords.length; index++) {
					var chordConfig = guitarConfig.chords[index];
					var chord = Chord.newInstance(index, 
												chordConfig.x1, 
												chordConfig.x2, 
												chordConfig.y, 
												chordConfig.lineWidth, 
												chordConfig.color, 
												graphHelper, 
												chordConfig.audio);
					chord.draw(0);
					targetThis.addPart(chord);
				}
				
				targetThis.initEvent(graphHelper);
				
				targetThis.timer.preProcess = function() {
					
					graphHelper.clear();
					
					for (var index = 0; index < targetThis.partList.length; index++) {
						
						var part = targetThis.partList[index];
						
						if (GuitarBoard.isPrototypeOf(part)) {
							part.draw();
							continue;
						}
						
						if (part.isPlaying == false) {
							part.draw(0);
						}
					}
				};
				
				KeyboardHelper.newInstance(containerId, guitarConfig.background, targetThis);
			});
			
		},
		
		loadImage: function(bgPath, fn) {
			var target = this;
			var image = new Image();
			image.onload = function() {
				fn();
			};
			image.src = bgPath;
			return image;
		},
		
		addPart: function(part) {
			this.partList.push(part);
		},
		
		initEvent: function(graphHelper) {
			
			var target = this;
			var canvasInfo = getPosition(graphHelper.container);
			
			graphHelper.addEventListener("mousemove", function(e) {
				
				if (target.recordHelper.isReplying) {
					return;
				}
				
				var pos = mousePosition(e);
				var mouseX = pos.x - canvasInfo.left;
				var mouseY = pos.y - canvasInfo.top;
				
				if (!target.lastY) {
					target.lastY = mouseY;
				}
				
				if (target.lastY == mouseY) {
					return;
				}
				
				if (target.lastY > mouseY) {
					
					for (var index = 0; index < target.partList.length; index++) {
						var chordPart = target.partList[index];
						if (chordPart.y >= mouseY && chordPart.y < target.lastY &&
								mouseX >= chordPart.x1 && mouseX <= chordPart.x2) {
							chordPart.play(true, target.timer, mouseX);
							chordPart.isPlaying = true;
							target.timer.start();
							target.recordHelper.addSound(chordPart.id, +new Date, mouseX);
						}
						
					}
				} else {
					for (var index = target.partList.length - 1; index >= 0; index--) {
						var chordPart = target.partList[index];
						if (chordPart.y > target.lastY && chordPart.y <= mouseY &&
								mouseX >= chordPart.x1 && mouseX <= chordPart.x2) {
							chordPart.play(false, target.timer, mouseX);
							chordPart.isPlaying = true;
							target.timer.start();
							target.recordHelper.addSound(chordPart.id, +new Date, mouseX);
						}
					}
				}
				
				target.lastY = mouseY;
			});
		},
		
		playRecord: function() {
			var targetThis = this;
			var soundIter = targetThis.recordHelper.iterator();
			
			if (soundIter.hasNext()) {
				dispatchPlay(soundIter.next());
			} else {
				targetThis.recordHelper.displayBoard.innerHTML = "";
				targetThis.recordHelper.isReplying = false;
			}
			
			function dispatchPlay(soundInfo) {
				
				for (var partIndex = 0; partIndex < targetThis.partList.length; partIndex++) {
					if (soundInfo.chordId == targetThis.partList[partIndex].id) {
						targetThis.partList[partIndex].play(false, targetThis.timer, soundInfo.x);
						targetThis.partList[partIndex].isPlaying = true;
						targetThis.timer.start();
						break;
					}
				}
				
				if (soundIter.hasNext() == false) {
					return;
				}
				var nextSound = soundIter.next();
				
				var delay = nextSound.time - soundInfo.time;
				
				setTimeout(function() {
					dispatchPlay(nextSound);
				}, delay);
			}
		}
	});
	
	var guitarConfig = {
		background: "images/guitar.png",
		chords:[
		    {
		    	x1: 30,
		    	x2: 105,
		    	y: 23,
		    	lineWidth: 2,
		    	color: SingleColor.newInstance(ColorConstant.R, 190),
		    	audio: "music/3n.ogg"
		    },
		    {
		    	x1: 30,
		    	x2: 105,
		    	y: 37,
		    	lineWidth: 2,
		    	color: SingleColor.newInstance(ColorConstant.G, 190),
		    	audio: "music/3n.ogg"
		    },
		    {
		    	x1: 65,
		    	x2: 318,
		    	y: 66,
		    	lineWidth: 2,
		    	color: SingleColor.newInstance(ColorConstant.B, 150),
		    	audio: "music/3n.ogg"
		    },
		    {
		    	x1: 30,
		    	x2: 281,
		    	y: 81,
		    	lineWidth: 2,
		    	color: SingleColor.newInstance(ColorConstant.R, 160),
		    	audio: "music/3n.ogg"
		    },
		    {
		    	x1: 30,
		    	x2: 281,
		    	y: 96,
		    	lineWidth: 2,
		    	color: SingleColor.newInstance(ColorConstant.G, 190),
		    	audio: "music/3n.ogg"
		    },
		    {
		    	x1: 30,
		    	x2: 105,
		    	y: 111,
		    	lineWidth: 1,
		    	color: SingleColor.newInstance(ColorConstant.B, 190),
		    	audio: "music/3n.ogg"
		    }
		]
	};
	
	Guitar = function(containerId, width, height) {
		GuitarProcessor.newInstance(containerId, width, height);
	};
})();