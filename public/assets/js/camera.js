const cameraWidth = 1080;
const cameraHeight = (cameraWidth * 3) / 4;

const screenWidth = getWidth();
const screenHeight = (screenWidth * 4) / 3;

const canvasWidth = getWidth() * 4;
const canvasHeight = (canvasWidth * 4) / 3;

let video = document.getElementById("video");
let videoBg = document.getElementById("video_bg");

let canvas = document.getElementById("canvas");
let photo = document.getElementById("photo");
let output = document.getElementById("camera__output");
let startButton = document.getElementById("camera__takaPicture");
let cancelButton = document.querySelector(".cancel");
let publishButton = document.querySelector(".publish");
let constraints = {
    audio: false,
    video: {
        width: { min: cameraWidth, max: cameraWidth },
        height: { min: cameraHeight, max: cameraHeight },
        facingMode: "environment",
    },
};
let imageData64 = "";

if (typeof navigator.mediaDevices === "undefined") {
    navigator.mediaDevices = {};
}
if (typeof navigator.mediaDevices.getUserMedia === "undefined") {
    navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia =
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
    if ("srcObject" in videoBg) {
        videoBg.srcObject = requestedStream;
    } else {
        // Avoid using this in new browsers, as it is going away.
        videoBg.src = window.URL.createObjectURL(stream);
    }

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

    videoBg.onloadedmetadata = function (e) {
        videoBg.setAttribute("width", getWidth());
        videoBg.setAttribute("height", getHeigth());
        videoBg.play();
    };
}
function clearphoto() {
    let context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL("image/png");
    imageData64 = data;
    photo.setAttribute("src", data);
}

function takepicture() {
    let context = canvas.getContext("2d");
    if (screenHeight && screenWidth) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

        let data = canvas.toDataURL("image/png");

        displayOutput(data);
    } else {
        clearphoto();
    }
}

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
function getHeigth() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function displayOutput(src) {
    output.style.display = "flex";
    output.style.zIndex = "10";
    output.style.height = screenHeight + "px";
    photo.setAttribute("src", src);
}
function hideOutput() {
    output.style.display = "none";
    output.style.zIndex = "-1";
    output.style.height = "0px";
    photo.removeAttribute("src");
}

function ajaxPost(pos, img) {
    // let data = {
    //     lat: pos.lat,
    //     lon: pos.lon,
    //     img: 345,
    // };

    // console.log(JSON.stringify(data, true));

    // let request = new XMLHttpRequest();
    // request.open("POST", window.location.href, true);
    // request.setRequestHeader(
    //     "Content-Type",
    //     "application/x-www-form-urlencoded; charset=UTF-8"
    // );
    // request.send(JSON.stringify(data, true));

    let httpRequest = new XMLHttpRequest();
    let data = new FormData();

    data.append("lat", pos.lat);
    data.append("lon", pos.lon);
    data.append("img", img);

    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText); // Display the result inside result element.
        }
    };

    httpRequest.open("POST", window.location.href);
    httpRequest.send(data);
}

startButton.addEventListener("click", () => {
    takepicture();
});

cancelButton.addEventListener("click", () => {
    hideOutput();
});

publishButton.addEventListener("click", () => {
    postPicture();
});

function postPicture() {
    function success(position) {
        let geoloc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
        console.log(window.location.href);
        let img = canvas.toDataURL("image/png");
        ajaxPost(geoloc, img);
    }

    function error() {
        console.log("error");
    }

    if (!navigator.geolocation) {
        console.log("You broser does not support geoloc");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
