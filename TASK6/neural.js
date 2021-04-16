//neural net with one hidden layer
function nn(data, w12, bias2, w23, bias3) {
    // compute layer2 output
    var out2 = [];

    for (var i = 0; i < w12.length; i++) {

        out2[i] = bias2[i];

        for (var j = 0; j < w12[i].length; j++) {
            out2[i] += data[j] * w12[i][j];
        }

        out2[i] = 1 / (1 + Math.exp(-out2[i]));
    }

    //compute layer3 activation
    var out3 = [];

    for (var i = 0; i < w23.length; i++) {

        out3[i] = bias3[i];

        for (var j = 0; j < w23[i].length; j++) {
            out3[i] += out2[j] * w23[i][j];
        }
    }

    // compute layer3 output
    var max3 = out3.reduce(function (p, c) {
        return Math.max(p, c);
    });
    var nominators = out3.map(function (e) {
        return Math.exp(e - max3);
    });
    var denominator = nominators.reduce(function (p, c) {
        return p + c;
    });
    var output = nominators.map(function (e) {
        return e / denominator;
    });

    return output;
}

// given grayscale image, find bounding rectangle of digit defined
// by above-threshold surrounding
function getBoundingRectangle(img, threshold) {
    var rows = img.length;
    var columns = img[0].length;
    var minX = columns;
    var minY = rows;
    var maxX = -1;
    var maxY = -1;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if (img[y][x] < threshold) {
                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
    }

    return {
        minY: minY,
        minX: minX,
        maxY: maxY,
        maxX: maxX
    };
}

// computes center of mass of digit, for centering
function centerImage(img) {
    var meanX = 0;
    var meanY = 0;
    var rows = img.length;
    var columns = img[0].length;
    var sumPixels = 0;

    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            var pixel = (1 - img[y][x]);
            sumPixels += pixel;
            meanY += y * pixel;
            meanX += x * pixel;
        }
    }

    meanX /= sumPixels;
    meanY /= sumPixels;

    var dY = Math.round(rows / 2 - meanY);
    var dX = Math.round(columns / 2 - meanX);

    return {
        transX: dX,
        transY: dY
    };
}

//convert canvas to grayscale. 
function imageToGrayscale(imgData) {

    var grayscaleImg = [];

    for (var y = 0; y < imgData.height; y++) {

        grayscaleImg[y] = [];

        for (var x = 0; x < imgData.width; x++) {

            var offset = y * 4 * imgData.width + 4 * x;
            var alpha = imgData.data[offset + 3];

            if (alpha == 0) {
                imgData.data[offset] = 255;
                imgData.data[offset + 1] = 255;
                imgData.data[offset + 2] = 255;
            }

            imgData.data[offset + 3] = 255;

            grayscaleImg[y][x] = imgData.data[y * 4 * imgData.width + x * 4 + 0] / 255;
        }
    }
    return grayscaleImg;
}

function recognize() {
    //convert RGBA image to a grayscale array, then compute bounding rectangle and center of mass  
    var imgData = ctx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageToGrayscale(imgData);
    var boundingRectangle = getBoundingRectangle(grayscaleImg, 0.01);
    var trans = centerImage(grayscaleImg);

    //copy image to hidden canvas, translate to center-of-mass, then
    //scale to fit into a 200x200 box
    var canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;

    var copyCtx = canvasCopy.getContext("2d");
    var brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
    var brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
    var scaling = 190 / Math.max(brW, brH);
    //scale
    copyCtx.translate(canvas.width / 2, canvas.height / 2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width / 2, -canvas.height / 2);
    //translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);
    //default take image from original canvas
    copyCtx.drawImage(ctx.canvas, 0, 0);


    //bin image into 18x18 blocks (giving a 28x28 image)
    imgData = copyCtx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageToGrayscale(imgData);

    var nnInput = new Array(784);

    for (var y = 0; y < 28; y++) {
        for (var x = 0; x < 28; x++) {

            var mean = 0;

            for (var v = 0; v < 10; v++) {
                for (var h = 0; h < 10; h++) {
                    mean += grayscaleImg[y * 10 + v][x * 10 + h];
                }
            }

            mean = (1 - mean / 100);                                    //average and invert
            nnInput[x * 28 + y] = (mean - 0.5) / 0.5;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(copyCtx.canvas, 0, 0);

    for (var y = 0; y < 28; y++) {
        for (var x = 0; x < 28; x++) {
            var block = ctx.getImageData(x * 10, y * 10, 10, 10);
            var newVal = 255 * (0.5 - nnInput[x * 28 + y] / 2);
            for (var i = 0; i < 4 * 10 * 10; i += 4) {
                block.data[i] = newVal;
                block.data[i + 1] = newVal;
                block.data[i + 2] = newVal;
                block.data[i + 3] = 255;
            }
            ctx.putImageData(block, x * 10, y * 10);
        }
    }

    //processing neural network
    var maxIndex = 0;
    var nnOutput = nn(nnInput, w12, bias2, w23, bias3);

    nnOutput.reduce(function (p, c, i) {
        if (p < c) {
            maxIndex = i;
            return c;
        }
        else {
            return p;
        }
    });

    document.getElementById("number").innerHTML = maxIndex;
}