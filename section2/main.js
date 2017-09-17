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
    ctx_backColor = "#777";
var keys = {},
    mousePos = {};

window.onload = function () {
    ctx = CreateDisplay("myCanvas", 800, 600);
    width = ctx.canvas.width; height = ctx.canvas.height;


    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mouseup", mouseup, false);
    document.addEventListener("mousemove", mousemove, false);

    main();
}

// ----------------------------------------------------------
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

var paddle_dist_form_edge = 60;
var paddle_width = 100;
var paddle_height = 10;
var paddleX;
var paddleY;

var brick_width = 100;
var brick_height = 50;
var brick_count = 8;
var brickGrid = new Array(brick_count);

function main() {
    console.log("Start");
    paddleX = 400;
    paddleY = height - paddle_dist_form_edge;
    brickReset();

    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}


function update(dt) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 牆壁反彈
    if (ballX < 0)
        ballSpeedX *= -1;
    if (ballX > width)
        ballSpeedX *= -1;

    if (ballY < 0)
        ballSpeedY *= -1;
    if (ballY > height)
        ballReset();

    // 板子的4個邊
    var paddleTopEdgeY = paddleY;
    var paddleBottomEdgeY = paddleY + paddle_height;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleX + paddle_width;
    // 檢查碰撞
    if (ballX > paddleLeftEdgeX && ballX < paddleRightEdgeX &&
        ballY > paddleTopEdgeY && ballY < paddleBottomEdgeY) {
        ballSpeedY *= -1;
        // 根據球在板子上的距離決定速度
        var centerOfPaddle = paddleX + paddle_width / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddle;

        ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    }
}

function draw(ctx) {
    colorCircle(ballX, ballY, 10, "#FFF");

    colorRect(paddleX, paddleY,
        paddle_width, paddle_height,
        "#FFF");

    colorText(mousePos.x + ", " + mousePos.y, mousePos.x, mousePos.y, "#FF0");

    drawBrick();
}

function drawBrick() {
    for (var i = 0; i < brickGrid.length; i++) {
        if (brickGrid[i]) {
            colorRect(brick_width * i, 0, brick_width - 2, brick_height - 2, "#00F");
        }
    }
}

function brickReset() {
    for (var i = 0; i < brick_count; i++) {
        brickGrid[i] = 1;
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

    paddleX = mousePos.x - paddle_width / 2;

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