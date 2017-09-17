

function Warrior() {
    this.x = 75;
    this.y = 75;
    this.speed = 5;
    this.angle = 0;
    this.img;
    this.name = "unTitle";
    this.keysHode = 0;

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
        var nextX = this.x;
        var nextY = this.y;
        if (this.key_hold.left) {
            nextX -= this.speed;
        }
        if (this.key_hold.right) {
            nextX += this.speed;
        }
        if (this.key_hold.up) {
            nextY -= this.speed;
        }
        if (this.key_hold.down) {
            nextY += this.speed;
        }

        var walkIntoTileIndex = getIndexAtPos(nextX, nextY);
        var walkIntoTileType = worldGrid[walkIntoTileIndex];
        switch (walkIntoTileType) {
            case WORLD_ROAD:
                this.x = nextX;
                this.y = nextY;
                break;
            case WORLD_GOAL:
                console.log(this.name + " WINS!");
                loadLevel(level1);
                break;
            case WORLD_DOOR:
                if (this.keysHode > 0) {
                    this.keysHode -= 1;
                    worldGrid[walkIntoTileIndex] = WORLD_ROAD;
                }
                break
            case WORLD_KEY:
                this.keysHode += 1;
                console.log("Keys:" + this.keysHode);
                worldGrid[walkIntoTileIndex] = WORLD_ROAD;
                break
        }
    }
    this.draw = function () {
        drawBmaCenterWidthRotation(this.img, this.x, this.y, this.angle);
    }
    this.reset = function (warriorImg, warriorName) {
        this.img = warriorImg;
        this.name = warriorName;

        for (var row = 0; row < world_rows; row++) {
            for (var col = 0; col < world_cols; col++) {
                var arrIndex = rowColToArrayIndex(col, row);
                if (worldGrid[arrIndex] == WORLD_PLAYERSTART) {
                    worldGrid[arrIndex] = WORLD_ROAD;
                    this.x = col * world_width + world_width / 2;
                    this.y = row * world_height + world_height / 2;
                    this.angle = 0;

                    return;
                }
            }
        }

        console.log("No Player Start Found");
    }
}