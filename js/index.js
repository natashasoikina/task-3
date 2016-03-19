(function () {
    var WORKER_COUNT = 4;

    var workers = [];
    var video = document.querySelector('.camera__video');
    var canvas = document.querySelector('.camera__canvas');
    var canvasContext = canvas.getContext('2d');
    var backCanvas = document.createElement('canvas');
    var backCanvasContext = backCanvas.getContext('2d');
    var canvasWidth;
    var canvasHeight;
    var filterControl = document.querySelector('.controls__filter');

    function getVideoStream(callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function(e) {
                        video.play();

                        callback();
                    };
                },
                function(err) {
                    console.log("The following error occured: " + err.name);
                }
            );
            initWorkers();
        } else {
            console.log("getUserMedia not supported");
        }
    }

    function handleMessage(e) {
        var data = e.data;

        canvasContext.putImageData(data.imageData, data.left, data.top);
    }

    function handleError(e) {
        console.log("The following error occured: " + e.message);
    }

    function initWorkers() {
        var worker;

        if (window.Worker) {
            for (var i = 0; i < WORKER_COUNT; i++) {
                worker = new Worker('js/filterWorker.js');

                worker.addEventListener('message', handleMessage, false);
                worker.addEventListener('error', handleError, false);
                workers[i] = worker;
            }
        } else {
            console.log("Web Workers not supported");
        }
    }

    function sendFilterTasks(filter) {
        var worker;
        var imageData;
        var blockSize = canvasHeight / WORKER_COUNT;

        for (var i = 0; i < WORKER_COUNT; i++) {
            worker = workers[i];
            imageData = backCanvasContext.getImageData(0, blockSize * i, canvasWidth, blockSize);

            worker.postMessage({
                filter: filter,
                imageData: imageData,
                top: blockSize * i,
                left: 0
            });
        }
    }

    function applyFilter() {
        var filterName = filterControl.value;

        if (window.Worker) {
            sendFilterTasks(filterName);
        } else {
            var imageData = backCanvasContext.getImageData(0, 0, canvasWidth, canvasHeight);

            filters[filterName](imageData.data);
            canvasContext.putImageData(imageData, 0, 0);
        }
    }

    function captureFrame() {
        backCanvasContext.drawImage(video, 0, 0);
        applyFilter();
        requestAnimationFrame(captureFrame);
    }

    function setCanvasSize(width, height) {
        canvasWidth = width;
        canvasHeight = height;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        backCanvas.width = canvasWidth;
        backCanvas.height = canvasHeight;
    }

    getVideoStream(function() {
        setCanvasSize(video.videoWidth, video.videoHeight);
        captureFrame();
    });
})();
