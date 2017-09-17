var world_width = 50;
var world_height = 50;
var world_cols = 16;
var world_rows = 12;
var world_gap = 0;



const WORLD_ROAD = 0;
const WORLD_WALL = 1;
const WORLD_PLAYERSTART = 2;
const WORLD_GOAL = 3;
const WORLD_KEY = 4;
const WORLD_DOOR = 5;

var level1 = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
    1, 0, 4, 0, 4, 0, 1, 0, 2, 0, 1, 0, 1, 4, 4, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 5, 1, 5, 1, 1,
    1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
    1, 0, 5, 0, 5, 0, 5, 0, 3, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];


function worldReset() {
    for (var i = 0; i < world_cols * world_rows; i++) {
        worldGrid[i] = 1;
    }
}

function rowColToArrayIndex(col, row) {
    return row * world_cols + col;
}
function getTileTypeAtRowCol(col, row) {
    if (col >= 0 && col < world_cols &&
        row >= 0 && row < world_rows) {
        return worldGrid[rowColToArrayIndex(col, row)];
    }
    else {
        return WORLD_WALL;
    }
}
function getIndexAtPos(posX, posY) {
    var col = Math.floor(posX / world_width);
    var row = Math.floor(posY / world_height);
    return rowColToArrayIndex(col, row);
}

function tileTypeHasTransparency(checkTileType) {
    return (checkTileType == WORLD_GOAL ||
        checkTileType == WORLD_KEY ||
        checkTileType == WORLD_DOOR);
}

function drawWorld() {
    var arrIndex = 0;
    var drawTileX = 0, drawTileY = 0;
    for (var row = 0; row < world_rows; row++) {
        for (var col = 0; col < world_cols; col++) {
            var tileType = worldGrid[arrIndex];
            var useImg = worldImgs[tileType];

            if (tileTypeHasTransparency(tileType)) {
                ctx.drawImage(worldImgs[WORLD_ROAD], drawTileX, drawTileY);
            }

            ctx.drawImage(useImg, drawTileX, drawTileY);

            arrIndex++;
            drawTileX += world_width;
        }
        drawTileX = 0;
        drawTileY += world_height;
    }
}
