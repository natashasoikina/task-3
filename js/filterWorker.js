importScripts('filters.js');

function handleMessage(e) {
    var data = e.data;
    var imageData = data.imageData;
    
    filters[data.filter](imageData.data);

    postMessage({
        imageData: imageData,
        top: data.top,
        left: data.left
    });
}

addEventListener('message', handleMessage, false);
