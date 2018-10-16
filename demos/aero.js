/****************************
 * Game implementation
 * Backgrounds
 ****************************/

"use strict";

/**
 * @class Background game implementation
 * @extends Engine

 */
function AeroGame() {

    /**
     * Super constructor
     */
    Engine.call(this);


    /**
     * Simulated world
     * @field
     * @type World
     * @default undefined

     */
    var rigidBodyWorld = undefined;
    var worldRenderer;

    var plane = undefined;
    var wind = math.v2.create();
    var baseTensor = math.m2.create();
    var minTensor = math.m2.create();
    var maxTensor = math.m2.create();
    var controlPos = math.v2.create();
    var planePos = math.v2.create();
    var planeStructure = [
        math.v3.create(),
        math.v3.create([20, 0, 0]),
        math.v3.create([0, 5, 0])
    ];

    /**
     * Globals
     */
    var ppm = 5;
    var FPS = 64;

    /**
     * @global Vector2
     * Last mouse move screen planePosition
     */
    var lastMouseMoveScreen = math.v2.create();

    /**
     * @global Vector2
     * Last mouse move world planePosition
     */
    var lastMouseMoveWorld = math.v2.create();

    /**
     * @eventHandler
     * Mouse move handler
     */
    this.onmousemove = function(e) {
        var x = e.offsetX;
        var y = e.offsetY;

        lastMouseMoveScreen[0] = x;
        lastMouseMoveScreen[1] = y;

        lastMouseMoveWorld[0] = x;
        lastMouseMoveWorld[1] = Y(y);

        this.renderGame();
    };


    this.onmousemove = function(e) {
        if (e.wheelDelta > 0) {
            ppm *= 2;
        } else {
            ppm /= 2;
        } // if
        this.renderGame();
    }

    this.initGame = function() {
        rigidBodyWorld = new World();
        worldRenderer = new WorldRenderVisitor(this.ctx);

        bind("change", planePos, "x", document.getElementById("txtPlanePosX"), "value", false, Number);
        bind("change", planePos, "y", document.getElementById("txtPlanePosY"), "value", false, Number);
        bind("change", controlPos, "x", document.getElementById("txtControlPosX"), "value", false, Number);
        bind("change", controlPos, "y", document.getElementById("txtControlPosY"), "value", false, Number);
        bind("change", wind, "x", document.getElementById("txtWindX"), "value", false, Number);
        bind("change", wind, "y", document.getElementById("txtWindY"), "value", false, Number);
        // bind("change", baseTensor.e, "0", document.getElementById("txtTensor1"), "value", false, Number);
        // bind("change", baseTensor.e, "1", document.getElementById("txtTensor2"), "value", false, Number);
        // bind("change", baseTensor.e, "2", document.getElementById("txtTensor3"), "value", false, Number);
        // bind("change", baseTensor.e, "3", document.getElementById("txtTensor4"), "value", false, Number);

        plane = new RigidBody(1, 1);
        plane.pos = planePos;
        plane.angularDamping = 0.5;
        plane.calculateDerivedData();

        rigidBodyWorld.addRigidBody(plane);
        var aeroForceGenerator = new AeroControlForceGenerator(baseTensor, minTensor, maxTensor, controlPos, wind);
        rigidBodyWorld.forceRegistry.add(plane, aeroForceGenerator);

        ForceGeneratorFactory.createGravity(
            rigidBodyWorld.forceRegistry, plane
        );

        this.renderGame();
        var that = this;
        for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
            var input = document.getElementsByTagName("input").item(i);
            input.onchange = function () {
                plane.calculateDerivedData();
                that.renderGame();
            };
        }
    }

    /**
     * Update all game elements
     * @function
     * @param {int} delta Delta time since last update
     * @returns {void}

     */
    this.updateGame = function(delta) {
        rigidBodyWorld.update(delta);
    }

    /**
     * Render a single frame
     * @function
     * @returns {void}

     */
    this.renderGame = function() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var t1 = worldToWindow(plane.getPointInWorldSpace(planeStructure[0]));
        var t2 = worldToWindow(plane.getPointInWorldSpace(planeStructure[1]));
        var t3 = worldToWindow(plane.getPointInWorldSpace(planeStructure[2]));

        ctx.save();
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(t1[0], t1[1]);
        ctx.lineTo(t2[0], t2[1]);
        ctx.lineTo(t3[0], t3[1]);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        //Renderer.instance.renderWorld(rigidBodyWorld);
        rigidBodyWorld.accept(worldRenderer);

        if (this.debug) {
            ctx.fillText("Global Forces: " + rigidBodyWorld.globalForceGenerators, 10, Y(80));
            ctx.fillText("Num Rigid Bodies: " + rigidBodyWorld.rigidBodies.length, 10, Y(70));
            ctx.fillText("Num Force Generators: " + rigidBodyWorld.forceRegistry.entries.length, 10, Y(60));
            ctx.fillText("Mouse Screen: (" + lastMouseMoveScreen[0] + "," + lastMouseMoveScreen[1] + ")", 10, Y(50));
            ctx.fillText("Mouse World: (" + lastMouseMoveWorld[0] + "," + lastMouseMoveWorld[1] + ")", 10, Y(40));
            ctx.fillText("Pixels Per Meter: " + ppm, 10, Y(30));
            ctx.fillText("FPS: " + this.avgFps, 10, Y(20));
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.translate(10, Y(10));

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -3);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(ppm, 0);
            ctx.lineTo(ppm, -3);
            ctx.stroke();
            ctx.restore();

            ctx.moveTo(0, 0);
            ctx.lineTo(ppm, 0);
            ctx.stroke();
            ctx.restore();
        } // if

    }
}

AeroGame.prototype = new Engine();
EngineInstance = new AeroGame();

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        EngineInstance.engineInit();
    } // if
};