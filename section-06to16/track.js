var track_width = 40;
var track_height = 40;
var track_cols = 20;
var track_rows = 15;
var track_gap = 2;



const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;

var level1 = [
    4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
    4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
    4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 1,
    1, 0, 0, 1, 1, 0, 0, 1, 4, 4, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 5, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 5, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1,
    1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    0, 3, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
    0, 3, 0, 0, 0, 0, 1, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4];


function trackReset() {
    for (var i = 0; i < track_cols * track_rows; i++) {
        trackGrid[i] = 1;
    }
}

function rowColToArrayIndex(col, row) {
    return row * track_cols + col;
}
function getTileTypeAtRowColl(col, row) {
    if (col >= 0 && col < track_cols &&
        row >= 0 && row < track_rows) {
        return trackGrid[rowColToArrayIndex(col, row)];
    }
    else {
        return TRACK_WALL;
    }
}

function carTrackHandling(car) {
    var carTrackCol = Math.floor(car.x / track_width);
    var carTrackRow = Math.floor(car.y / track_height);

    var carTrackIndex = rowColToArrayIndex(carTrackCol, carTrackRow);

    if (carTrackCol >= 0 && carTrackCol < track_cols &&
        carTrackRow >= 0 && carTrackRow < track_rows) {
        var tileHere = getTileTypeAtRowColl(carTrackCol, carTrackRow);
        if (tileHere == TRACK_GOAL) {
            loadLevel(level1);
            console.log(car.name + ",WIN");
        }
        else if (tileHere != TRACK_ROAD) {
            // prevPos
            car.x -= car.speed * Math.cos(car.angle);
            car.y -= car.speed * Math.sin(car.angle);

            car.speed *= -0.2;
        }
    }
}

function drawtrack() {
    var arrIndex = 0;
    var drawTileX = 0, drawTileY = 0;
    for (var row = 0; row < track_rows; row++) {
        for (var col = 0; col < track_cols; col++) {
            var tileType = trackGrid[arrIndex];
            var useImg = trackImgs[tileType];

            ctx.drawImage(useImg, drawTileX, drawTileY);

            arrIndex++;
            drawTileX += track_width;
        }
        drawTileX = 0;
        drawTileY += track_height;
    }
}
