var car1Img = new Image();
var car2Img = new Image();
var trackImgs = [];

var imgToLoad = 0;

function loadImages() {
    var imageList = [
        { varName: car1Img, fileName: "resource/player1car.png" },
        { varName: car2Img, fileName: "resource/player2car.png" },
        { trackType: TRACK_ROAD, fileName: "resource/track_road.png" },
        { trackType: TRACK_WALL, fileName: "resource/track_wall.png" },
        { trackType: TRACK_TREE, fileName: "resource/track_tree.png" },
        { trackType: TRACK_GOAL, fileName: "resource/track_goal.png" },
        { trackType: TRACK_FLAG, fileName: "resource/track_flag.png" }
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

function loadImgForTrackType(trackType, fileName){
    trackImgs[trackType] = new Image();
    LoadingImg(trackImgs[trackType], fileName);
}