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
    ctx = CreateDisplay("myCanvas", 800, 600);
    width = ctx.canvas.width; height = ctx.canvas.height;


    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mouseup", mouseup, false);
    document.addEventListener("mousemove", mousemove, false);

    colorRect(0, 0, width, height, "#000");
    colorText("LOADING IMAGES", width / 2 - 40, height / 2, "#FFF");
    loadImages();
}


// ----------------------------------------------------------
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_W = 87;
const KEY_S = 83;
const KEY_D = 68;
const KEY_A = 65;

var trackGrid = [];

var blueCar, greenCar;

function main() {
    console.log("Start");

    greenCar = new Car();
    blueCar = new Car();

    loadLevel(level1);

    blueCar.setInputSetup(KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT);
    greenCar.setInputSetup(KEY_W, KEY_S, KEY_A, KEY_D);

    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}

function loadLevel(level) {
    trackGrid = level.slice();
    greenCar.reset(car2Img, "Green Car");
    blueCar.reset(car1Img, "Blue Car");
}


function update(dt) {
    blueCar.move();
    greenCar.move();

}


function draw(ctx) {
    drawtrack();

    blueCar.draw();
    greenCar.draw();


    colorText(mousePos.x + ", " + mousePos.y,
        mousePos.x, mousePos.y, "#FF0");

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
        drawString(ctx, "Pause",
            width / 2 - 80, height / 2 - 30,
            "#FFF", 60, "consolas",
            0, 0, 0);
    }
}
//---evnt---
function keydown(e) {
    keys[e.keyCode] = true;
    setKey(e, blueCar, 1);
    setKey(e, greenCar, 1);

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
    setKey(e, blueCar, 0);
    setKey(e, greenCar, 0);
}

function setKey(e, car, status) {
    for (var i in car.controlKey) {
        if (e.keyCode == car.controlKey[i]) {
            car.key_hold[i] = status;
        }
    }
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