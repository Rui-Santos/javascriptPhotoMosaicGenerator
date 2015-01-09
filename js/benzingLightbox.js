function initLightbox() {
    $('#lightbox').live('click', function (e) {

        if ($(e.target).is('button')) {
            e.preventDefault();
            return;
        }
        $('#lightbox').hide();
    });

    g_currentActiveLightboxImgWidth = 0;
    g_currentActiveLightboxImgHeight = 0;
}

function createMarkup() {
    //create HTML markup for lightbox window
    var lightbox =
        '<div id="lightbox">' +
        '<p><span class="glyphicon glyphicon-remove"></span> Click to close</p>' +
        '<button class="btn btn-primary" onclick="rotate90degCounterClockwise();">Rotate counter clockwise</button>' +
        '<button class="btn btn-primary" onclick="rotate90degClockwise();">Rotate clockwise</button>' +
        '<button class="btn btn-danger" onclick="deleteImg();">Delete</button>' +
        '<div id="content">' +
        '<canvas id="lightboxCanvas"></canvas>' +
        '</div>' +
        '</div>';

    $('body').append(lightbox);

    g_lightboxCanvas = document.getElementById('lightboxCanvas');
    g_lightboxCanvasContext = g_lightboxCanvas.getContext('2d');
}

function deleteImg() {
    if (confirm('Are you sure you want delete this image?')) {
        var ele = document.getElementById(g_currentActiveLightboxImg.id);
        ele.parentNode.removeChild(ele);

        $('#lightbox').hide();

//    delete g_imagesToBeUsedAsTiles[g_currentActiveLightboxImg.id]; //todo vll mehr performance wenn delete statt splice
        g_imagesToBeUsedAsTiles.splice(g_currentActiveLightboxImg.id, 1);
        g_imagesToBeUsedAsTilesIndex--;


        if (g_imagesToBeUsedAsTilesIndex === 0) {
            document.getElementById("holderMulti").style.height = "300px";
        }
    }
}

function rotate90degCounterClockwise() {

    var newImg = document.createElement("img");
    newImg.src = g_lightboxCanvas.toDataURL();

    var newHeight = g_lightboxCanvas.width;
    var cx = g_lightboxCanvas.width * (-1);
    g_lightboxCanvas.width = g_lightboxCanvas.height;
    g_lightboxCanvas.height = newHeight;

    g_lightboxCanvasContext.rotate(270 * Math.PI / 180);
    g_lightboxCanvasContext.drawImage(newImg, cx, 0);

    newImg.src = g_lightboxCanvas.toDataURL();

    //change image in DOM (and gallery) // only required if we use a img-tag instead of a span-tag
//    document.getElementById(g_currentActiveLightboxImg.id).src = newImg.src;

    //change image in datastructure for mosaic generation
    g_imagesToBeUsedAsTiles[g_currentActiveLightboxImg.id] = newImg;
    newImg = null;

	/*
    if (g_lightboxCanvas.width >= $(window).width()) {
        g_lightboxCanvas.style.width = '60%';
        g_lightboxCanvas.style.height = 'auto';
    }
    else if (g_lightboxCanvas.height >= $(window).height()) {
        g_lightboxCanvas.style.width = 'auto';
        g_lightboxCanvas.style.height = '60%';
    }
	*/
}
function rotate90degClockwise() {

    var newImg = document.createElement("img");
    newImg.src = g_lightboxCanvas.toDataURL();

    var newHeight = g_lightboxCanvas.width;
    var cy = g_lightboxCanvas.height * (-1);
    g_lightboxCanvas.width = g_lightboxCanvas.height;
    g_lightboxCanvas.height = newHeight;

    g_lightboxCanvasContext.rotate(90 * Math.PI / 180);
    g_lightboxCanvasContext.drawImage(newImg, 0, cy);

    newImg.src = g_lightboxCanvas.toDataURL();

    //change image in DOM (and gallery) // only required if we use a img-tag instead of a span-tag
//    document.getElementById(g_currentActiveLightboxImg.id).src = newImg.src;

    //change image in datastructure for mosaic generation
    g_imagesToBeUsedAsTiles[g_currentActiveLightboxImg.id] = newImg;
    newImg = null;

	/*
    if (g_lightboxCanvas.width >= $(window).width()) {
        g_lightboxCanvas.style.width = '60%';
        g_lightboxCanvas.style.height = 'auto';
    }
    else if (g_lightboxCanvas.height >= $(window).height()) {
        g_lightboxCanvas.style.width = 'auto';
        g_lightboxCanvas.style.height = '60%';
    }
	*/
}

function setupLightboxTrigger(element) {

    $(element).click(function (e) {

        /*
         If the lightbox window HTML already exists in document,
         change the img src to to match the href of whatever link was clicked

         If the lightbox window HTML doesn't exists, create it and insert it.
         (This will only happen the first time around)
         */

//        if ($(element).is("img")) {
//            g_currentActiveLightboxImg = this;
//        } else {
        g_currentActiveLightboxImg = g_imagesToBeUsedAsTiles[element.id];
//        }


//		g_currentActiveLightboxImgWidth = g_currentActiveLightboxImg.naturalWidth;
//		g_currentActiveLightboxImgHeight = g_currentActiveLightboxImg.naturalHeight;
        g_currentActiveLightboxImgWidth = g_imagesToBeUsedAsTiles[element.id].naturalWidth;
        g_currentActiveLightboxImgHeight = g_imagesToBeUsedAsTiles[element.id].naturalHeight;


        if ($('#lightbox').length > 0) { // #lightbox exists

            g_lightboxCanvas.setAttribute('width', g_currentActiveLightboxImgWidth);
            g_lightboxCanvas.setAttribute('height', g_currentActiveLightboxImgHeight);

            g_lightboxCanvasContext.drawImage(g_currentActiveLightboxImg, 0, 0);
            $('#lightbox').show();
        } else { //#lightbox does not exist - create and insert (runs 1st time only)

            createMarkup();

            g_lightboxCanvas.setAttribute('width', g_currentActiveLightboxImgWidth);
            g_lightboxCanvas.setAttribute('height', g_currentActiveLightboxImgHeight);

            g_lightboxCanvasContext.drawImage(g_currentActiveLightboxImg, 0, 0);
        }

        if (g_currentActiveLightboxImgWidth >= $(window).width()) {
            g_lightboxCanvas.style.width = '60%';
            g_lightboxCanvas.style.height = 'auto';
        }
        else if (g_currentActiveLightboxImgHeight >= $(window).height()) {
            g_lightboxCanvas.style.width = 'auto';
            g_lightboxCanvas.style.height = '60%';
        }
    });
}

