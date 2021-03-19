const cameraWidth = 720;
const cameraHeight = (cameraWidth * 3) / 4;

const screenWidth = getWidth();
const screenHeight = (screenWidth * 4) / 3;

const canvasWidth = getWidth() * 4;
const canvasHeight = (canvasWidth * 4) / 3;

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

video = document.getElementById("video");
canvas = document.getElementById("canvas");
photo = document.getElementById("photo");
output = document.getElementById("camera__output");
startbutton = document.getElementById("camera__takaPicture");

var constraints = {
    audio: false,
    video: {
        width: { min: cameraWidth, max: cameraWidth },
        height: { min: cameraHeight, max: cameraHeight },
        facingMode: "environment",
    },
};

if (typeof navigator.mediaDevices === "undefined") {
    navigator.mediaDevices = {};
}
if (typeof navigator.mediaDevices.getUserMedia === "undefined") {
    navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
            );
        }
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    };
}

navigator.mediaDevices
    .getUserMedia(constraints)
    .then(initSuccess)
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });

function initSuccess(requestedStream) {
    // Older browsers may not have srcObject
    if ("srcObject" in video) {
        video.srcObject = requestedStream;
    } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
    }

    video.onloadedmetadata = function (e) {
        video.setAttribute("width", screenWidth);
        video.setAttribute("height", screenHeight);
        video.play();
    };
}
function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
}

function takepicture() {
    var context = canvas.getContext("2d");
    if (screenHeight && screenWidth) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

        var data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
        output.style.display = "flex";
    } else {
        clearphoto();
    }
}

startbutton.addEventListener("click", () => {
    takepicture();
});

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
