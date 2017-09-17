var speed_Decay = 0.97;
var car_Power = 0.15;
var car_Reverce = 0.1;
var car_TurnRate = 0.05;
var min_speed_to_turn = 0.5;

function Car() {
    this.x = 75;
    this.y = 75;
    this.speed = 0;
    this.angle = 0;
    this.img;
    this.name = "unTitle";

    this.key_hold = {
        up: 0,
        down: 0,
        left: 0,
        right: 0
    }

    this.controlKey = {
        up: null,
        down: null,
        left: null,
        right: null
    }

    this.setInputSetup = function (up, down, left, right) {
        this.controlKey.up = up;
        this.controlKey.down = down;
        this.controlKey.left = left;
        this.controlKey.right = right;
    }

    this.move = function () {
        this.speed *= speed_Decay;
        if (Math.abs(this.speed) > min_speed_to_turn) {
            if (this.key_hold.left) {
                this.angle -= car_TurnRate;
            }
            if (this.key_hold.right) {
                this.angle += car_TurnRate;
            }
        }
        if (this.key_hold.up) {
            this.speed += car_Power;
        }
        if (this.key_hold.down) {
            this.speed -= car_Reverce;
        }

        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        // 牆壁反彈
        if (this.x < 0 && this.speedX < 0)
            this.speedX *= -1;
        if (this.x > width && this.speedX > 0)
            this.speedX *= -1;

        if (this.y < 0 && this.speedY < 0)
            this.speedY *= -1;
        if (this.y > height && this.speedY > 0)
            this.speedY *= -1;

        carTrackHandling(this);
    }
    this.draw = function () {
        drawBmaCenterWidthRotation(this.img, this.x, this.y, this.angle);
    }
    this.reset = function (carImg, carName) {
        this.img = carImg;
        this.name = carName;
        this.speed = 0;

        for (var row = 0; row < track_rows; row++) {
            for (var col = 0; col < track_cols; col++) {
                var arrIndex = rowColToArrayIndex(col, row);
                if (trackGrid[arrIndex] == TRACK_PLAYERSTART) {
                    trackGrid[arrIndex] = TRACK_ROAD;
                    this.x = col * track_width + track_width / 2;
                    this.y = row * track_height + track_height / 2;
                    this.angle = -Math.PI / 2;

                    return;
                }
            }
        }

        console.log("No Player Start Found");
    }
}