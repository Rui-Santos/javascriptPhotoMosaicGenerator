function generateMosaic(tileWidth, tileHeight) {
    if (tileWidth === 0 || tileHeight === 0) {
        throw "The width or height of a tile can not be 0 (>#.#<)";
    }

    //disable buttons
    $('#s1').removeClass('complete');
    $('#s2').removeClass('complete');
    $('#s3').removeClass('complete');
    $('#btnPreviousStep').prop('disabled', true);

    $('#btnGenerateMosaic').prop('disabled', true);

    $(".step3").show();

    disableCanvasZoom();


    g_tileW = $('#inputW').val();
    g_tileH = $('#inputH').val();

    g_canvasGeneratedMosaic = document.getElementById('canvasGeneratedMosaic');
    g_canvasGeneratedMosaicContext = g_canvasGeneratedMosaic.getContext('2d');

    g_canvasGeneratedMosaic.width = SCALE_FACTOR * g_imgInput.naturalWidth;
    g_canvasGeneratedMosaic.height = SCALE_FACTOR * g_imgInput.naturalHeight;

    smallestTileWidth = g_canvasGeneratedMosaic.width % (tileWidth * SCALE_FACTOR);
    smallestTileHeight = g_canvasGeneratedMosaic.height % (tileHeight * SCALE_FACTOR);

    numTilesHor = Math.floor(g_canvasGeneratedMosaic.width / (tileWidth * SCALE_FACTOR));
    numTilesVer = Math.floor(g_canvasGeneratedMosaic.height / (tileHeight * SCALE_FACTOR));


    bEqualTilesWidth = true;
    if (smallestTileWidth != 0) {
        numTilesHor++;
        bEqualTilesWidth = false;
    }
    bEqualTilesHeight = true;
    if (smallestTileHeight != 0) {
        numTilesVer++;
        bEqualTilesHeight = false;
    }

    arr2d = new Array();
    for (var i = 0; i < numTilesHor; i++) {
        arr2d[i] = new Array();
    }
    for (var x = 0; x < numTilesHor; x++) {
        width = tileWidth;
        if (x === (numTilesHor - 1) && !(bEqualTilesWidth)) {
            width = smallestTileWidth;
        }
        for (var y = 0; y < numTilesVer; y++) {
            height = tileHeight;
            if (y === (numTilesVer - 1) && !(bEqualTilesHeight)) {
                height = smallestTileHeight;
            }
            arr2d[x][y] = [];
        }
    }

    g_canvasGeneratedMosaicContext.clearRect(0, 0, g_canvasGeneratedMosaic.width, g_canvasGeneratedMosaic.height); //clears whole canvas

    g_canvasGeneratedMosaic.width = g_imgInput.naturalWidth;
    g_canvasGeneratedMosaic.height = g_imgInput.naturalHeight;
    g_canvasGeneratedMosaicContext.drawImage(g_imgInput, 0, 0);

    for (var x = 0; x < numTilesHor; x++) {
        curTileWidth = tileWidth;
        if (!(bEqualTilesWidth) && x === (numTilesHor - 1)) {
            curTileWidth = smallestTileWidth;
        }
        for (var y = 0; y < numTilesVer; y++) {
            curTileHeight = tileHeight;
            if (!(bEqualTilesHeight) && y === (numTilesVer - 1)) {
                curTileHeight = smallestTileHeight;
            }
            var imgData = g_canvasGeneratedMosaicContext.getImageData(x * tileWidth, y * tileHeight, curTileWidth, curTileHeight);
            avgRed = 0;
            avgGreen = 0;
            avgBlue = 0;
            avgAlpha = 0;
            for (var i = 0; i < imgData.data.length; i += 4) {
                avgRed += imgData.data[i];
                avgGreen += imgData.data[i + 1];
                avgBlue += imgData.data[i + 2];
//                avgAlpha += imgData.data[i + 3]; //we dont use alpha
            }
            var divider = imgData.data.length / 4;
            avgRed /= divider;
            avgGreen /= divider;
            avgBlue /= divider;
//            avgAlpha /= divider; //we dont use alpha
            avgRed = Math.round(avgRed);
            avgGreen = Math.round(avgGreen);
            avgBlue = Math.round(avgBlue);
//            avgAlpha = Math.round(avgAlpha); //we dont use alpha
//            arr2d[x][y].push(avgRed, avgGreen, avgBlue, avgAlpha);
            arr2d[x][y].push(avgRed, avgGreen, avgBlue);
        }
    }
    g_canvasGeneratedMosaicContext.clearRect(0, 0, g_canvasGeneratedMosaic.width, g_canvasGeneratedMosaic.height); //clears whole canvas

    //////// BEGINNING OF FARBWERTE AUS BILDERN AUSLESEN //////////////
    imagesToBeUsedAsTilesWithAverageColors = [];
    imagesToBeUsedAsTilesWithAverageColorsIndex = 0;
    for (var i = 0; i < g_imagesToBeUsedAsTiles.length; i++) {
        imagesToBeUsedAsTilesWithAverageColors[imagesToBeUsedAsTilesWithAverageColorsIndex] = getAverageColourAsRGB(g_imagesToBeUsedAsTiles[i]);
        imagesToBeUsedAsTilesWithAverageColorsIndex++; // this variable is used in getAverageColourAsRGB => do not increment before calling that function
    }

//////// BEGINNING OF PASSENDE BILDER AUSSUCHEN UND INS CANVAS MALEN//////////////

    kdTree = new KDTree(imagesToBeUsedAsTilesWithAverageColors, 3);
    kdTree.init();

    g_canvasGeneratedMosaic.width = SCALE_FACTOR * g_imgInput.naturalWidth;
    g_canvasGeneratedMosaic.height = SCALE_FACTOR * g_imgInput.naturalHeight;

    for (var x = 0; x < numTilesHor; x++) {
        curTileWidth = tileWidth * SCALE_FACTOR;
        if (x === (numTilesHor - 1) && !(bEqualTilesWidth)) {
            curTileWidth = smallestTileWidth * SCALE_FACTOR;
        }
        for (var y = 0; y < numTilesVer; y++) {

            curTileHeight = tileHeight * SCALE_FACTOR;
            if (y === (numTilesVer - 1) && !(bEqualTilesHeight)) {
                curTileHeight = smallestTileHeight * SCALE_FACTOR;
            }
            var newPoint = [arr2d[x][y][0], arr2d[x][y][1], arr2d[x][y][2]];
            drawTileWithTimeout(x, y, newPoint, curTileWidth, curTileHeight);
        }
    }

// draw main image with some transparency to improve the effect
    g_canvasGeneratedMosaicContext.globalAlpha = g_$inputAlphaBlending.val();
    g_canvasGeneratedMosaicContext.drawImage(g_imgInput, 0, 0, g_imgInput.naturalWidth * SCALE_FACTOR, g_imgInput.naturalHeight * SCALE_FACTOR);
    g_canvasGeneratedMosaicContext.stroke();
    g_canvasGeneratedMosaicContext.globalAlpha = 1.0; //reset in case another mozaic gets generated


    setTimeout(function finished() {
        initCanvasZoom();
        $('#downloadAs').show();
        $('#btnGenerateMosaic').prop('disabled', false);
    }, 100 * numTilesHor + g_timeout * numTilesVer);
}

function drawTileWithTimeout(x, y, newPoint, curTileWidth, curTileHeight) {
    setTimeout(function myDraw() {
        var closestPoint = kdTree.findNearestNeighbor(newPoint);
        g_canvasGeneratedMosaicContext.drawImage(
            g_imagesToBeUsedAsTiles[closestPoint[3]],
                x * g_tileW * SCALE_FACTOR, y * g_tileH * SCALE_FACTOR, curTileWidth, curTileHeight);
    }, 100 * x + g_timeout * y);
}

function drawPreviewTilesCanvas(canvas, context, tileWidth, tileHeight) {
    context.clearRect(0, 0, canvas.width, canvas.height); //clears whole canvas

    var smallestTileWidth = g_imgInput.naturalWidth % tileWidth;
    var smallestTileHeight = g_imgInput.naturalHeight % tileHeight;
    var numTilesHor = Math.floor(g_imgInput.naturalWidth / tileWidth);
    var numTilesVer = Math.floor(g_imgInput.naturalHeight / tileHeight);

    tileWidth = SCALE_FACTOR * tileWidth;
    tileHeight = SCALE_FACTOR * tileHeight;

    var bEqualTilesWidth = true;
    if (smallestTileWidth != 0) {
        numTilesHor++;
        bEqualTilesWidth = false;
    }
    var bEqualTilesHeight = true;
    if (smallestTileHeight != 0) {
        numTilesVer++;
        bEqualTilesHeight = false;
    }

    canvas.width = (SCALE_FACTOR * g_imgInput.naturalWidth) + numTilesHor + 1;
    canvas.height = (SCALE_FACTOR * g_imgInput.naturalHeight) + numTilesVer + 1;

    var curTileWidth = 0;
    var curTileHeight = 0;
    for (var x = 0; x < numTilesHor; x++) {
        if (x === (numTilesHor - 1) && !(bEqualTilesWidth)) {
            curTileWidth = smallestTileWidth;
        } else {
            curTileWidth = tileWidth;
        }
        for (var y = 0; y < numTilesVer; y++) {
            if (y === (numTilesVer - 1) && !(bEqualTilesHeight)) {
                curTileHeight = smallestTileHeight;
            } else {
                curTileHeight = tileHeight;
            }
            context.drawImage(g_imgInput, x * tileWidth / SCALE_FACTOR, y * tileHeight / SCALE_FACTOR,
                    curTileWidth / SCALE_FACTOR, curTileHeight / SCALE_FACTOR,
                    x * tileWidth + x + 1, y * tileHeight + y + 1,
                curTileWidth, curTileHeight);
        }
        context.stroke();
    }

    //reenable buttons
    $('#s1').addClass('complete');
    $('#s2').addClass('complete');
    $('#s3').addClass('complete');
    $('#btnPreviousStep').prop('disabled', false);
}

function getAverageColourAsRGB(img) {
//        pixelInterval = 5, // Rather than inspect every single pixel in the image inspect every 5th pixel
    var arrRGB = [0, 0, 0, imagesToBeUsedAsTilesWithAverageColorsIndex], // Set a base colour as a fallback for non-compliant browsers
        count = 0,
        i = -4,
        data, length;

//    var height = g_canvasForGettingAvgColor.height = img.naturalHeight || img.offsetHeight || img.height,
//        width = g_canvasForGettingAvgColor.width = img.naturalWidth || img.offsetWidth || img.width;
    var height = g_canvasForGettingAvgColor.height = img.naturalHeight,
        width = g_canvasForGettingAvgColor.width = img.naturalWidth;

    g_canvasForGettingAvgColorContext.drawImage(img, 0, 0);
    data = g_canvasForGettingAvgColorContext.getImageData(0, 0, width, height);

    data = data.data;
    length = data.length;

//    while ((i += pixelInterval * 4) < length) {
    while ((i += 4) < length) {
        count++;
        arrRGB[0] += data[i];
        arrRGB[1] += data[i + 1];
        arrRGB[2] += data[i + 2];
    }
    // floor the average values to give correct rgb values (ie: round number values)
    arrRGB[0] = Math.floor(arrRGB[0] / count);
    arrRGB[1] = Math.floor(arrRGB[1] / count);
    arrRGB[2] = Math.floor(arrRGB[2] / count);

    return arrRGB;
}
