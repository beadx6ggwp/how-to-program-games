var warriorImg = new Image();
var worldImgs = [];

var imgToLoad = 0;

function loadImages() {
    var imageList = [
        { varName: warriorImg, fileName: "resource/warrior.png" },
        { trackType: WORLD_ROAD, fileName: "resource/world_ground.png" },
        { trackType: WORLD_WALL, fileName: "resource/world_wall.png" },
        { trackType: WORLD_KEY, fileName: "resource/world_key.png" },
        { trackType: WORLD_GOAL, fileName: "resource/world_goal.png" },
        { trackType: WORLD_DOOR, fileName: "resource/world_door.png" }
    ];

    imgToLoad = imageList.length;

    for (var i = 0; i < imageList.length; i++) {
        var obj = imageList[i];
        if (obj.varName) {
            LoadingImg(obj.varName, obj.fileName);
        }
        else {
            loadImgForTrackType(obj.trackType, obj.fileName);
        }
    }
}

function countLoadedImage() {
    imgToLoad--;
    if (imgToLoad <= 0) {
        main();// start
    }
}

function LoadingImg(img, fileName) {
    img.onload = countLoadedImage;
    img.src = fileName;
}

function loadImgForTrackType(trackType, fileName) {
    worldImgs[trackType] = new Image();
    LoadingImg(worldImgs[trackType], fileName);
}