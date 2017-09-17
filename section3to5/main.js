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
var ballSpeedX = 2.5;
var ballSpeedY = 3.5;

var paddle_dist_form_edge = 60;
var paddle_width = 100;
var paddle_height = 10;
var paddleX;
var paddleY;

var brick_width = 80;
var brick_height = 20;
var brick_cols = 10;
var brick_rows = 14;
var brick_gap = 2;
var brickGrid = new Array(brick_cols * brick_rows);
var hide_line = 3;
var brick_left = 0;

function main() {
    console.log("Start");
    paddleX = 400;
    paddleY = height - paddle_dist_form_edge;

    brickReset();
    ballReset();

    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}


function update(dt) {
    ballMove();

    ballBrickHandling();

    ballPaddleHandling();
}
function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // 牆壁反彈
    if (ballX < 0 && ballSpeedX < 0)
        ballSpeedX *= -1;
    if (ballX > width && ballSpeedX > 0)
        ballSpeedX *= -1;

    if (ballY < 0 && ballSpeedY < 0)
        ballSpeedY *= -1;
    if (ballY > height && ballSpeedY > 0)
        ballReset();
}
function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX / brick_width);
    var ballBrickRow = Math.floor(ballY / brick_height);

    var ballBrickIndex = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    if (ballBrickCol >= 0 && ballBrickCol < brick_cols &&
        ballBrickRow >= 0 && ballBrickRow < brick_rows) {
        if (isBrickAtRowCol(ballBrickCol, ballBrickRow)) {
            brickGrid[ballBrickIndex] = false;
            brick_left--;

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / brick_width);
            var prevBrickRow = Math.floor(prevBallY / brick_height);

            var bothTestsFailed = true;

            if (prevBrickCol != ballBrickCol) {
                if (isBrickAtRowCol(prevBrickCol, ballBrickRow) == 0) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow != ballBrickRow) {
                if (isBrickAtRowCol(ballBrickCol, prevBrickRow) == 0) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }

            if (bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }
    }
}
function ballPaddleHandling() {
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

        if (brick_left <= 0) {
            brickReset();
        }
    }
}


function draw(ctx) {
    colorCircle(ballX, ballY, 10, "#FFF");

    colorRect(paddleX, paddleY,
        paddle_width, paddle_height,
        "#FFF");

    drawBrick();


    colorText(mousePos.x + ", " + mousePos.y,
        mousePos.x, mousePos.y, "#FF0");

}

function drawBrick() {
    for (var row = 0; row < brick_rows; row++) {
        for (var col = 0; col < brick_cols; col++) {

            var arrIndex = brick_cols * row + col;
            if (brickGrid[arrIndex]) {
                colorRect(brick_width * col, brick_height * row, brick_width - brick_gap, brick_height - brick_gap, "#00F");
            }
        }
    }
}

function brickReset() {
    for (var i = 0; i < brick_cols * hide_line; i++) {
        brickGrid[i] = 0;
    }
    for (var i = brick_cols * hide_line; i < brick_cols * brick_rows; i++) {
        brickGrid[i] = 1;
        brick_left++;
    }
}
function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
}
function rowColToArrayIndex(col, row) {
    return row * brick_cols + col;
}
function isBrickAtRowCol(col, row) {
    if (col >= 0 && col < brick_cols &&
        row >= 0 && row < brick_rows) {
        return brickGrid[rowColToArrayIndex(col, row)];
    }
    else {
        return 0
    }
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
    if (loop)
        loop = false;
    else {
        window.requestAnimationFrame(mainLoop);
        loop = true;
    }
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