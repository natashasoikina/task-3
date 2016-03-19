var filters = {
    invert: function (data) {
        for (var i = 0, length = data.length; i < length; i +=4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }

        return data;
    },
    grayscale: function (data) {
        for (var i = 0, length = data.length; i < length; i +=4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            data[i] = data[i + 1] = data[i + 2] = v;
        }

        return data;
    },
    threshold: function (data) {
        for (var i = 0, length = data.length; i < length; i +=4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;

            data[i] = data[i + 1] = data[i + 2] = v;
        }

        return data;
    }
};
