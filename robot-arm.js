// Written by Dennis Kievits
var robotArm = (function(){
	var robotArm = {};
	robotArm.speed = 50;
	robotArm.rows = 8;
	robotArm.columns = 10;
	robotArm.blockColors = ["red", "blue", "green", "white"];

	// pd for private data
	var pd = {};
	pd.hasInitialized = false;
	pd.canvas = null;
	pd.ctx = null;
	pd.baseColumnSeparatorHeight = 10;
	pd.robotArmHeight = 25;
	pd.robotArmHookHeight = 10;
	pd.baseColumnSeparatorBlockPadding = 5;
	pd.armCurrentColumn = 0;
	pd.blockMap = null;
	pd.currentHeldBlock = null;
	pd.animationList = [];
	pd.hasAnimatedFrame = false;
	pd.armAnimationName = null;
	pd.armMovingDown = null;
	pd.armAnimationProgress = 0;
	// State calculating
	pd.state = {
		blockMap: null,
		currentHeldBlock: null,
		armCurrentColumn: 0
	};

	/**
	 * Initializes the robot arm for use.
	 * @param  {Canvas Element} canvas The canvas used to draw the robot arm on.
	 * @return {void}
	 */
	robotArm.initialize = function (canvas) {
		// Canvas is undefined or null
		if (canvas == null || canvas == undefined) {
			throw new Error("Canvas parameter is null or undefined");
		}
		// Element is not a canvas
		if (canvas.nodeName != "CANVAS") {
			throw new Error("Element is not of type canvas");
		}
		// Set the canvas
		pd.canvas = canvas;
		pd.ctx = canvas.getContext("2d");

		pd.hasInitialized = true;
	};

	robotArm.loadLevel = function (levelName) {
		switch (levelName) {
			case "exercise 1":
				pd.blockMap = [
					["blue", "red"],
					["blue"],
					["green"],
					["white", "green", "red"]
				];
				pd.state.blockMap = [
					["blue", "red"],
					["blue"],
					["green"],
					["white", "green", "red"]
				];
				break;
			case "exercise 2":
				pd.blockMap = [
					["blue", "red", "green", "green", "green", "green"],
					["blue", "green", "green"],
					["green", "green", "green"],
					["red", "green", "green", "green"]
				];
				pd.state.blockMap = [
					["blue", "red", "green", "green", "green", "green"],
					["blue", "green", "green"],
					["green", "green", "green"],
					["red", "green", "green", "green"]
				];
				break;
			default:
				throw new Error("Invalid level name: " + levelName);
		}
	};

	robotArm.randomLevel = function (columns, rows) {
		columns = columns ? columns : robotArm.columns;
		rows = rows ? rows : robotArm.rows;

		var map = [];
		for (var c = 0; c < columns; c++) {
			map[c] = [];
			var rh = Math.floor(Math.random() * rows - 1);
			for (var r = 0; r < rh; r++) {
				map[c][r] = robotArm.blockColors[Math.floor(Math.random() * robotArm.blockColors.length)];
			}
		}
		pd.blockMap = map.slice();
		var map2 = [];
		for (var i = 0; i < map.length; i++) map2.push(map[i].slice());
		pd.state.blockMap = map2;
	};

	robotArm.moveRight = function () {
		if (pd.state.armCurrentColumn + 1 < robotArm.columns) {
			pd.state.armCurrentColumn++;
		}
		pd.animationList.push(function (dt, mayAnimate) {
			if (!mayAnimate) return;
			if (pd.armCurrentColumn + 1 >= robotArm.columns) return true;
			pd.armAnimationName = "moveRight";

			if (pd.armAnimationProgress <= pd.canvas.width / robotArm.columns) {
				pd.armAnimationProgress += robotArm.speed / dt;
			} else {
				pd.armCurrentColumn++;
				pd.armAnimationName = null;
				pd.armAnimationProgress = 0;
				return true;
			}

			pd.hasAnimatedFrame = true;
		});
	};

	robotArm.moveLeft = function () {
		if (pd.state.armCurrentColumn - 1 >= 0) {
			pd.state.armCurrentColumn--;
		}
		pd.animationList.push(function (dt, mayAnimate) {
			if (!mayAnimate) return;
			if (pd.armCurrentColumn - 1 < 0) return true;
			pd.armAnimationName = "moveLeft";
			
			if (pd.armAnimationProgress <= pd.canvas.width / robotArm.columns) {
				pd.armAnimationProgress += robotArm.speed / dt;
			} else {
				pd.armCurrentColumn--;
				pd.armAnimationName = null;
				pd.armAnimationProgress = 0;
				return true;
			}

			pd.hasAnimatedFrame = true;

		});
	};

	robotArm.grab = function () {
		if (pd.state.currentHeldBlock == null &&  pd.state.blockMap[pd.state.armCurrentColumn] && pd.state.blockMap[pd.state.armCurrentColumn].length > 0) {
			pd.state.currentHeldBlock = pd.state.blockMap[pd.state.armCurrentColumn][pd.state.blockMap[pd.state.armCurrentColumn].length - 1];
			pd.state.blockMap[pd.state.armCurrentColumn].splice(pd.state.blockMap[pd.state.armCurrentColumn].length - 1, 1);
		}
		pd.animationList.push(function (dt, mayAnimate) {
			if (!mayAnimate) return;
			if (!this.notFirstRun) {
				if ((pd.currentHeldBlock != null && pd.armMovingDown) || pd.armCurrentColumn >= pd.blockMap.length || pd.blockMap[pd.armCurrentColumn].length <= 0) return true;
			}
			pd.hasAnimatedFrame = true;
			pd.armAnimationName = "grab";
			if (pd.armMovingDown || pd.armMovingDown == null) {
				pd.armMovingDown = true;

				if (!pd.blockMap[pd.armCurrentColumn]) {
					pd.blockMap[pd.armCurrentColumn] = [];
				}
				var rowsForCurrentColumn = pd.blockMap[pd.armCurrentColumn].length + (pd.currentHeldBlock != null ? 1 : 0);
				var blockHeight = pd.getAvailableTotalRowsHeight(canvas) / robotArm.rows;
				var distanceToTravel =  pd.canvas.height - rowsForCurrentColumn * blockHeight - 6;
				
				if (distanceToTravel >= pd.armAnimationProgress + pd.robotArmHeight) {
					pd.armAnimationProgress += robotArm.speed * 2 / dt;
				} else {
					pd.armMovingDown = false;
					if (pd.currentHeldBlock == null) {
						pd.currentHeldBlock = pd.blockMap[pd.armCurrentColumn][pd.blockMap[pd.armCurrentColumn].length - 1];
						pd.blockMap[pd.armCurrentColumn].splice(pd.blockMap[pd.armCurrentColumn].length - 1, 1);
					}
				}

			} else {
				if (0 < pd.armAnimationProgress) {
					pd.armAnimationProgress -= robotArm.speed / dt;
				} else {
					pd.armAnimationProgress = 0;
					pd.armAnimationName = null;
					pd.armMovingDown = null;
					return true;
				}
			}
			this.notFirstRun = true;
		});
	};

	robotArm.drop = function () {
		if (pd.state.currentHeldBlock != null) {
			if (pd.state.blockMap[pd.state.armCurrentColumn] == undefined)
			{
				pd.state.blockMap[pd.state.armCurrentColumn] = [];
			}
			pd.state.blockMap[pd.state.armCurrentColumn].push(pd.state.currentHeldBlock);
			pd.state.currentHeldBlock = null;
		}
		pd.animationList.push(function (dt, mayAnimate) {
			if (!mayAnimate) return;
			pd.hasAnimatedFrame = true;
			pd.armAnimationName = "drop";

			if (pd.armMovingDown || pd.armMovingDown == null) {
				pd.armMovingDown = true;

				var rowsForCurrentColumn = (pd.blockMap[pd.armCurrentColumn] != undefined ? pd.blockMap[pd.armCurrentColumn] : []).length;
				var blockHeight = pd.getAvailableTotalRowsHeight(canvas) / robotArm.rows;
				var distanceToTravel =  pd.canvas.height - (rowsForCurrentColumn + 1) * blockHeight - 6;
				
				if (distanceToTravel >= pd.armAnimationProgress + pd.robotArmHeight) {
					pd.armAnimationProgress += robotArm.speed * 2 / dt;
				} else {
					pd.armMovingDown = false;
					if (pd.blockMap[pd.armCurrentColumn] == undefined) pd.blockMap[pd.armCurrentColumn] = [];
					if (pd.currentHeldBlock != null) {
						pd.blockMap[pd.armCurrentColumn].push(pd.currentHeldBlock);
					}
					pd.currentHeldBlock = null;
				}

			} else {
				if (0 < pd.armAnimationProgress) {
					pd.armAnimationProgress -= robotArm.speed / dt;
				} else {
					pd.armAnimationProgress = 0;
					pd.armAnimationName = null;
					pd.armMovingDown = null;
					return true;
				}
			}

		});
	};

	robotArm.scan = function () {
		return pd.state.currentHeldBlock;
	};

	var runTime;
	robotArm.run = function () {
		var now = new Date().getTime();
		var dt = now - (runTime || now);
		pd.hasAnimatedFrame = false;
		pd.ctx.clearRect(0, 0, pd.canvas.width, pd.canvas.height);
		pd.ctx.beginPath();
		pd.ctx.fillStyle = "lightgrey";
		pd.ctx.fillRect(0,0,canvas.width,canvas.height);
		pd.drawBase(pd.canvas, pd.ctx);
		pd.drawBlocks(pd.canvas, pd.ctx, pd.blockMap);
		pd.drawArm(pd.canvas, pd.ctx);

		var finishedActions = [];
		for (var i =  0; i < pd.animationList.length; i++) {
			// If finished action
			if (pd.animationList[i](dt != 0 ? dt : 9999999, !pd.hasAnimatedFrame)) {
				finishedActions.push(i);
			}
		}
		for (var i = finishedActions.length - 1; i >= 0; i--) {
			pd.animationList.splice(finishedActions[i], 1);
		}
		pd.ctx.stroke();

		runTime = now;
		requestAnimationFrame(robotArm.run);
	};

	pd.getAvailableTotalRowsHeight = function (canvas) {
		return canvas.height - pd.robotArmHeight - pd.robotArmHookHeight;
	};

	/**
	 * Draws the base of the robot arm ground.
	 * @param  {Canvas Element} canvas The canvas to draw on.
	 * @param  {Canvas 2d Context} ctx The drawing context.
	 * @return {void}
	 */
	pd.drawBase = function (canvas, ctx) {
		if (robotArm.columns <= 0) {
			throw new Error("Robot arm columns can't be less than or equal to 0");
		}
		// Set line color
		ctx.strokeStyle = "#000";
		// Draw line beneath
		ctx.moveTo(0, canvas.height);
		ctx.lineTo(canvas.width, canvas.height);
		// Draw column separators
		var columnWidth = canvas.width / robotArm.columns;
		for (var i = 0; i < robotArm.columns + 1; i++) {
			ctx.moveTo(i * columnWidth, canvas.height);
			ctx.lineTo(i * columnWidth, canvas.height - pd.baseColumnSeparatorHeight);
		}
	};

	/**
	 * Draws all blocks on the map for the given blockMap
	 * @param  {Canvas Element} canvas   The canvas to we are working with
	 * @param  {Canvas2dContext} ctx     The drawing context
	 * @param  {array of arrays of strings} blockMap The blockMap to be used, the format is like this. [["blue", "red"], ["green"]]
	 * @return {void}
	 */
	pd.drawBlocks = function (canvas, ctx, blockMap) {
		// Blockmap must be valid
		if (typeof(blockMap) != "object") {
			throw new Error("blockMap must be of type array");
		}
		// Needs atleast 1 column
		if (robotArm.columns <= 0) {
			throw new Error("Robot arm columns can't be less than or equal to 0");
		}
		pd.blockMap = blockMap;

		// Calculate some values to know where to draw and how large
		var columnWidth = canvas.width / robotArm.columns;
		var blockHeight = pd.getAvailableTotalRowsHeight(canvas) / robotArm.rows;
		var blockWidth = (canvas.width / robotArm.columns) - pd.baseColumnSeparatorBlockPadding * 2;

		// For every block do
		for (var column = 0; column < blockMap.length; column++) {
			var col = blockMap[column];
			if (!col) continue;
			for (var row = 0; row < col.length; row++) {
				//console.log("Column: " + column + " Row: " + row + " has color " + blockMap[column][row]);
				// Base position of the column we are working with (used for calculating the padding)
				var columnXPosForCurrentColumn = column * columnWidth;
				// Drawing the inner color of the rectangle
				ctx.fillStyle = blockMap[column][row];
				ctx.fillRect(columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding + 1,
					canvas.height - blockHeight * (row + 1) - 1,
					blockWidth,
					blockHeight - 1);

				// Set the stroke color to black
				ctx.strokeStyle = "#000";
				// Drawing the outer rectangle
				ctx.rect(columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding,
					canvas.height - blockHeight * (row + 1) - 1,
					blockWidth,
					blockHeight);
			}
		}
	};

	/**
	 * Draws the arm
	 * @param  {Canvas Element} canvas The canvas we are working with
	 * @param  {CanvasContext2D} ctx   Drawing context
	 * @return {void}
	 */
	pd.drawArm = function (canvas, ctx) {
		ctx.strokeStyle = "#000";

		var columnWidth = canvas.width / robotArm.columns + 2;
		var columnXPosForCurrentColumn = pd.armCurrentColumn * columnWidth;
		var blockWidth = (canvas.width / robotArm.columns) - pd.baseColumnSeparatorBlockPadding * 2;

		var horizontalOffset = 0;
		var verticalOffset = 0;

		if (pd.armAnimationName != null) {
			switch (pd.armAnimationName) {
				case "moveRight":
					horizontalOffset = pd.armAnimationProgress;
					break;
				case "moveLeft":
					horizontalOffset = -pd.armAnimationProgress;
					break;
				case "grab":
					verticalOffset = pd.armAnimationProgress;
					break;
				case "drop":
					verticalOffset = pd.armAnimationProgress;
					break;
			}
		}

		horizontalOffset -= (2 * pd.armCurrentColumn + 1);

		ctx.moveTo(horizontalOffset + columnXPosForCurrentColumn + columnWidth / 2, 0);
		ctx.lineTo(horizontalOffset + columnXPosForCurrentColumn + columnWidth / 2, pd.robotArmHeight + verticalOffset);

		ctx.moveTo(horizontalOffset + columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding, pd.robotArmHeight + verticalOffset);
		ctx.lineTo(horizontalOffset + columnXPosForCurrentColumn + columnWidth - pd.baseColumnSeparatorBlockPadding, pd.robotArmHeight + verticalOffset);

		ctx.moveTo(horizontalOffset + columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding, pd.robotArmHeight + verticalOffset);
		ctx.lineTo(horizontalOffset + columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding, pd.robotArmHeight + pd.robotArmHookHeight + verticalOffset);

		ctx.moveTo(horizontalOffset + columnXPosForCurrentColumn + columnWidth - pd.baseColumnSeparatorBlockPadding, pd.robotArmHeight + verticalOffset);
		ctx.lineTo(horizontalOffset + columnXPosForCurrentColumn + columnWidth - pd.baseColumnSeparatorBlockPadding, pd.robotArmHeight + pd.robotArmHookHeight + verticalOffset);

		if (pd.currentHeldBlock != null) {
				var blockHeight = pd.getAvailableTotalRowsHeight(canvas) / robotArm.rows;
				// Drawing the inner color of the rectangle
				ctx.fillStyle = pd.currentHeldBlock;
				ctx.fillRect(horizontalOffset + columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding + 2,
					pd.robotArmHeight + 1 + verticalOffset,
					blockWidth - 1,
					blockHeight - 1);

				// Set the stroke color to black
				ctx.strokeStyle = "#000";
				// Drawing the outer rectangle
				ctx.rect(horizontalOffset + columnXPosForCurrentColumn + pd.baseColumnSeparatorBlockPadding + 1,
					pd.robotArmHeight + 1 + verticalOffset,
					blockWidth,
					blockHeight);
		}
	};
	return robotArm;
})();

var requestAnimationFrame =  
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
          return setTimeout(callback, 1);
        };