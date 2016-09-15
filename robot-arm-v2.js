/**
 * The robot arm constructor
 * 
 * @param {HTMLCanvasElement} canvas The canvas element used for drawing the robot arm on.
 */
var RobotArm = function (canvas) {
    // So we can reference this when we are inside other functions
    var self = this;
    // This wont be visible to the consumers of the RobotArm instance
    var local = {};
    // The map of blocks to calculate the animations -> [["blue", "red"], ["green"]]
    local.map = null;
    // The Canvas2DContext we can draw with
    var ctx = canvas.getContext("2d");

    // The amount of columns to use
    self.columns = 10;
    // The amount of rows to use
    self.rows = 8;
    // The speed of which the animations go
    self.speed = 1;

    // Handles the arm
    local.arm = {};
    // The position of the arm
    local.arm.position = 0;
    // Arm Rendering properties
    local.arm.horizontalOffset = 0;
    local.arm.verticalOffset = 0;
    local.arm.height = 25;
    local.arm.hookHeight = 10;

    // Handles the floor
    local.floor = {};
    // The height of the column separator, set to 0 to remove separators
    local.floor.columnSeparatorHeight = 10;
    // The padding between the blocks and the separators
    local.floor.columnSeparatorPadding = 3;

    // Handles the blocks
    local.blocks = {};
    //local.blocks

    // Handles the settings
    local.settings = {};
    // The background color of the robot arm canvas
    local.settings.backgroundColor = "#EEE";

    /**
     * The function that is always called when some operation is called.
     * 
     * @param {function} sender The operation that was called.
     */
    // local.mainMovementFunc = function (sender) {
    //     // If the operation has not been run before
    //     if (!sender.hasRunBefore) {
    //         // If the map is not filled yet throw an error
    //         if (!local.map) throw new Error("Please load or generate a map first before doing any operations");
            
    //         // Set the has run before so this piece of code won't run again
    //         sender.hasRunBefore = true;
    //     }
    // };

    /**
     * Renders all of the robot arm
     */
    local.render = function () {
        var startTime = new Date().getTime();
        // Clear surface to start a new frame
        ctx.beginPath();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Draw the background
        ctx.fillStyle = local.settings.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Render all
        local.renderFloor();
        local.renderArm();
        local.renderBlocks();

        // Draw everything
        ctx.stroke();
        ctx.stroke();

        while (new Date().getTime() - startTime < 17) {}
    };

    local.renderFloor = function () {
        // Save state and restore after rendering
        ctx.save();
        // Set line color to black
		ctx.strokeStyle = "#000";
		// Draw line beneath
		ctx.moveTo(0, ctx.canvas.height);
		ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
		// Draw column separators
		var columnWidth = ctx.canvas.width / self.columns;
		for (var i = 0; i < self.columns + 1; i++) {
			ctx.moveTo(i * columnWidth, ctx.canvas.height);
			ctx.lineTo(i * columnWidth, ctx.canvas.height - local.floor.columnSeparatorHeight);
		}
        // Restore after rendering arm
        ctx.restore();
    };

    local.renderArm = function () {
        // Save state and restore after rendering
        ctx.save();
        // Set drawing color to black
        ctx.strokeStyle = "#000";

        var columnWidth = ctx.canvas.width / self.columns;
		var columnXPosForCurrentColumn = local.arm.position * columnWidth;
		var blockWidth = (ctx.canvas.width / self.columns) - local.floor.columnSeparatorPadding * 2;

		ctx.moveTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + columnWidth / 2, 0);
		ctx.lineTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + columnWidth / 2, local.arm.height + local.arm.verticalOffset);

		ctx.moveTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + local.floor.columnSeparatorPadding, local.arm.height + local.arm.verticalOffset);
		ctx.lineTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + columnWidth - local.floor.columnSeparatorPadding, local.arm.height + local.arm.verticalOffset);

		ctx.moveTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + local.floor.columnSeparatorPadding, local.arm.height + local.arm.verticalOffset);
		ctx.lineTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + local.floor.columnSeparatorPadding, local.arm.height + local.arm.hookHeight + local.arm.verticalOffset);

		ctx.moveTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + columnWidth - local.floor.columnSeparatorPadding, local.arm.height + local.arm.verticalOffset);
		ctx.lineTo(local.arm.horizontalOffset + columnXPosForCurrentColumn + columnWidth - local.floor.columnSeparatorPadding, local.arm.height + local.arm.hookHeight + local.arm.verticalOffset);

        // Restore after rendering arm
        ctx.restore();
    };

    local.renderBlocks = function () {
        // Save state and restore after rendering
        ctx.save();
        // Restore after rendering arm
        ctx.restore();
    };

    local.moveRightAnimation = function () {
        local.arm.horizontalOffset += self.speed;

        local.render();
        if (local.arm.horizontalOffset <= ctx.canvas.width / self.columns) {
            local.moveRightAnimation();
        }

        local.arm.horizontalOffset = 0;
    };

    /**
     * Moves the robot arm one position to the right if possible
     * 
     * @returns
     */
    self.moveRight = function () {
        // Don't do anything if we would move out of the columns
        if (local.arm.position + 1 > self.columns) return;
        local.moveRightAnimation();
        local.arm.position++;
    };
    /**
     * Moves the robot arm one position to the left if possible
     */
    self.moveLeft = function () {
    };
    /**
     * Returns the color of the held block, if any
     * @returns {null|string} The name of the color of the block that is being held 
     */
    self.scan = function () {
    };
    /**
     * Grabs a block from beneath, if possible
     */
    self.grab = function () {
    };
    /**
     * Drops a block beneath, if possible
     */
    self.drop = function () {
    };
    /**
     * Waits for a certain amount of time.
     */
    // self.wait = function () {
    //     local.mainMovementFunc(this);
    // };

    // Render first frame
    requestAnimationFrame(local.render);
};