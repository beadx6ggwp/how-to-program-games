function drawBmaCenterWidthRotation(img, x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(img, - img.width / 2, - img.height / 2);
    ctx.restore();
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