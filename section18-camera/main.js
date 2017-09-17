var ctx,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    DeltaTime = 0,
    loop = true;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#000";
var keys = {},
    mousePos = {};

window.onload = function () {
    ctx = CreateDisplay("myCanvas", 1200, 900);//8,6
    width = ctx.canvas.width; height = ctx.canvas.height;


    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mouseup", mouseup, false);
    document.addEventListener("mousemove", mousemove, false);

    main();
}

// ----------------------------------------------------------

var camW = 800;
var camH = 600;
var camPanX = 0.0;
var camPanY = 0.0;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X = 150;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y = 100;

var ballX = 75;
var ballY = 75;
var ballSpeed = 5;

var brick_width = 60;
var brick_height = 60;
var brick_cols = 20;
var brick_rows = 15;
var brick_gap = 1;
var brickGrid = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1,
    1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var brick_left = 0;

function main() {
    console.log("Start");

    ballReset();

    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}


function update(dt) {
    ballMove();
    //cameraFollow();
    instantCamFollow();
}


function draw(ctx) {
    ctx.save();

    //ctx.translate(-camPanX, -camPanY);

    drawBrick();
    drawBrickOnScrean()

    colorCircle(ballX, ballY, 10, "#FFF");

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FF0";
    ctx.strokeRect(camPanX, camPanY, camW, camH);

    ctx.restore();



    colorText(mousePos.x + ", " + mousePos.y,
        mousePos.x, mousePos.y, "#FF0");
}

function ballMove() {
    var nextX = ballX;
    var nextY = ballY;
    if (keys[37]) {
        nextX -= ballSpeed;
    }
    if (keys[39]) {
        nextX += ballSpeed;
    }
    if (keys[38]) {
        nextY -= ballSpeed;
    }
    if (keys[40]) {
        nextY += ballSpeed;
    }

    if (isBrickAtPos(nextX, nextY) == 0) {
        ballX = nextX;
        ballY = nextY;
    }
}

function brickTileToIndex(col, row) {
    return col + brick_cols * row;
}
function getBrickAtTile(col, row) {
    return brickGrid[brickTileToIndex(col, row)];
}
function isBrickAtPos(posX, posY) {
    var col = Math.floor(posX / brick_width);
    var row = Math.floor(posY / brick_height);

    if (col < 0 || col >= brick_cols ||
        row < 0 || row >= brick_rows) {
        return 1;
    }

    return brickGrid[brickTileToIndex(col, row)];
}

function instantCamFollow() {
    camPanX = ballX - camW / 2;
    camPanY = ballY - camH / 2;
}
function cameraFollow() {
    var cameraFocusCenterX = camPanX + width / 2;
    var cameraFocusCenterY = camPanY + height / 2;

    var playerDistFromCameraFocusX = Math.abs(ballX - cameraFocusCenterX);
    var playerDistFromCameraFocusY = Math.abs(ballY - cameraFocusCenterY);

    if (playerDistFromCameraFocusX > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X) {
        if (cameraFocusCenterX < ballX) {
            camPanX += ballSpeed;
        } else {
            camPanX -= ballSpeed;
        }
    }
    if (playerDistFromCameraFocusY > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y) {
        if (cameraFocusCenterY < ballY) {
            camPanY += ballSpeed;
        } else {
            camPanY -= ballSpeed;
        }
    }

    // instantCamFollow();

    // this next code blocks the game from showing out of bounds
    // (this isn't required, if you don't mind seeing beyond edges)
    if (camPanX < 0) {
        camPanX = 0;
    }
    if (camPanY < 0) {
        camPanY = 0;
    }
    var maxPanRight = brick_cols * brick_width - width;
    var maxPanTop = brick_rows * brick_height - height;

    if (camPanX > maxPanRight) {
        camPanX = maxPanRight;
    }
    if (camPanY > maxPanTop) {
        camPanY = maxPanTop;
    }
}

function drawBrick() {
    for (var row = 0; row < brick_rows; row++) {
        for (var col = 0; col < brick_cols; col++) {

            if (getBrickAtTile(col, row)) {
                colorRect(brick_width * col, brick_height * row, brick_width - brick_gap, brick_height - brick_gap, "rgba(100,136,153,0.3)");
            }
        }
    }
}
function drawBrickOnScrean() {
    var cameraStartX = Math.floor(Math.max(0, camPanX / brick_width + 0));
    var cameraStartY = Math.floor(Math.max(0, camPanY / brick_height + 0));

    var cameraEndX = Math.floor(Math.min((camW + camW / 2) / brick_width, (camPanX + camW) / brick_width + 1));
    var cameraEndY = Math.floor(Math.min((camH + camH / 2) / brick_height, (camPanY + camH) / brick_height + 1));
    // width/2 is camera pos

    for (var row = cameraStartY; row < cameraEndY; row++) {
        for (var col = cameraStartX; col < cameraEndX; col++) {

            if (getBrickAtTile(col, row)) {
                colorRect(brick_width * col, brick_height * row, brick_width - brick_gap, brick_height - brick_gap, "rgba(100,136,153,1)");
            }
        }
    }
}

function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
}




function colorRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function colorCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}
function colorText(showText, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillText(showText, x, y);
}

//---loop---

function mainLoop(timestamp) {
    Timesub = timestamp - lastTime;// get sleep
    DeltaTime = Timesub / 1000;
    lastTime = timestamp;
    //Clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, width, height);
    //--------Begin-----------

    update(DeltaTime);
    draw(ctx);

    //--------End---------------
    let str1 = "Fps: " + 1000 / Timesub, str2 = "Timesub: " + Timesub, str3 = "DeltaTime: " + DeltaTime;
    drawString(ctx, str1 + "\n" + str2 + "\n" + str3,
        0, height - 31,
        "#FFF", 10, "consolas",
        0, 0, 0);
    if (loop) {
        animation = window.requestAnimationFrame(mainLoop);
    } else {
        // over
    }
}
//---evnt---
function keydown(e) {
    keys[e.keyCode] = true;

    if (e.keyCode == "P".charCodeAt(0)) {
        if (loop)
            loop = false;
        else {
            window.requestAnimationFrame(mainLoop);
            loop = true;
        }
    }

}

function keyup(e) {
    delete keys[e.keyCode];
}

function mousedown(e) {
}

function mouseup(e) {

}

function mousemove(e) {
    mousePos.x = e.clientX - ctx.canvas.offsetLeft
    mousePos.y = e.clientY - ctx.canvas.offsetTop;
    //--------
}

//----tool-------
function toRadio(angle) {
    return angle * Math.PI / 180;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}

//---------------------
function CreateDisplay(id, width, height) {
    let canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    canvas.style.cssText = [
        "display: block;",
        "margin: 0 auto;",
        "background: #FFF;",
        "border:1px solid #000;"
    ].join("");
    document.body.appendChild(canvas);

    return canvas.getContext("2d");
}