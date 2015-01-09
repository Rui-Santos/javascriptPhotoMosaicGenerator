function useDefaultPicture() {
    var image = new Image();

    image.src = PATH_TO_DEFAULT_IMAGE;

    image.id = 'imgInput';
    image.width = 300; // a fake resize
    holder.innerHTML = ""; //removes old image. allows choosing only one image
    holder.appendChild(image);

    mainPictureSelected();
}

function useDefaultPictures() {

    document.getElementById("holderMulti").style.height = "auto"; // let images inside the holder control the height


    var image1 = new Image();
    image1.src = document.getElementById("defaultGalleryImage1").src;
    image1.id = g_imagesToBeUsedAsTilesIndex; //set id in order to get it fast later if we want to delete/rotate the image

    var spanTag = document.createElement("span");
    spanTag.id = g_imagesToBeUsedAsTilesIndex;
    spanTag.className = "label label-success";
    spanTag.innerHTML = "DefaultImage1.jpg";
    setupLightboxTrigger(spanTag);
    document.getElementById("labelWrapper").appendChild(spanTag);
    g_imagesToBeUsedAsTiles[g_imagesToBeUsedAsTilesIndex++] = image1;
/////////////////////////////////////////////////////////
    var image2 = new Image();
    image2.src = document.getElementById("defaultGalleryImage2").src;
    image2.id = g_imagesToBeUsedAsTilesIndex; //set id in order to get it fast later if we want to delete/rotate the image

    var spanTag = document.createElement("span");
    spanTag.id = g_imagesToBeUsedAsTilesIndex;
    spanTag.className = "label label-success";
    spanTag.innerHTML = "DefaultImage2.jpg";
    setupLightboxTrigger(spanTag);
    document.getElementById("labelWrapper").appendChild(spanTag);
    g_imagesToBeUsedAsTiles[g_imagesToBeUsedAsTilesIndex++] = image2;
    /////////////////////////////////////////////////////////
    var image3 = new Image();
    image3.src = document.getElementById("defaultGalleryImage3").src;
    image3.id = g_imagesToBeUsedAsTilesIndex; //set id in order to get it fast later if we want to delete/rotate the image

    var spanTag = document.createElement("span");
    spanTag.id = g_imagesToBeUsedAsTilesIndex;
    spanTag.className = "label label-success";
    spanTag.innerHTML = "DefaultImage3.jpg";
    setupLightboxTrigger(spanTag);
    document.getElementById("labelWrapper").appendChild(spanTag);
    g_imagesToBeUsedAsTiles[g_imagesToBeUsedAsTilesIndex++] = image3;
}

function isImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}

////////// MAIN IMAGE //////////
document.getElementById("uploadMulti").addEventListener("change", function () {
    readfilesMulti(this.files);
}, false);

var holder = document.getElementById('holder'),
    tests = {
        dnd: 'draggable' in document.createElement('span')
    },
    acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };


function previewfile(file) {
    if (tests.filereader === true && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var image = new Image();

            //check for corrupted image firefox
            if ($.browser.mozilla) {
                image.onerror = function (evt) {
                    $('.bottom-right').notify({
                        type: 'warning',
                        message: { text: "File:" + file.name + " seems to be corrupted!" }
                    }).show();
                    image = null;
                    $(".btn-next").attr("disabled", "disabled");
                    document.getElementById("holder").innerHTML = ""; //remove corrupted image
                    document.getElementById("holder").style.height = "300px"; //reset height
                    return;
                }
            }

            image.src = event.target.result;

            //check for corrupted image other browsers
            if (!$.browser.mozilla) {
                if (!isImageOk(image)) {
                    $('.bottom-right').notify({
                        type: 'warning',
                        message: { text: "File:" + file.name + " seems to be corrupted!" }
                    }).show();
                    image = null;
                    $(".btn-next").attr("disabled", "disabled");
                    return;
                }
            }

            image.onload = function (evt) {
                mainPictureSelected();
            };

            image.id = 'imgInput';
            image.width = 400; // a fake resize
            holder.innerHTML = ""; //removes old image. allows choosing only one image
            holder.appendChild(image);

            holder.style.height = ($(image).height() + 22) + "px"; //set height => border is around whole image
        }
        ;
        reader.readAsDataURL(file);
    }
    else {
        $('.bottom-right').notify({
            type: 'warning',
            message: { text: "File:" + file.name + " not supported!" }
        }).show();
    }
}

if (tests.dnd) {
    holder.ondragover = function () {
        this.className = 'hover';
        return false;
    };
    holder.ondragend = function () {
        this.className = '';
        return false;
    };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();
//        if (document.getElementById('upload').files.length > 1) {
//            alert("You can only choose one main picture!");
//        }
        previewfile(e.dataTransfer.files[0]);
    }
}
else {
//    fileupload.className = 'hidden';
//    fileupload.querySelector('input').onchange = function () {
//        if (this.files.length > 1) {
//            alert("You can only choose one main picture!");
//        }
    previewfile(this.files[0]);
//        readfiles(this.files);
//    };
}

/////////////////////////BEGINN UPLOAD OF IMAGES USED FOR TILES /////////////////////
var holderMulti = document.getElementById('holderMulti'),
    tests = {
        filereader: typeof FileReader != 'undefined',
        dnd: 'draggable' in document.createElement('span')
    },
//    support = {
//        filereader: document.getElementById('filereader')
//    },
    acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };

var labelWrapper = document.createElement('p');
labelWrapper.id = "labelWrapper";
holderMulti.appendChild(labelWrapper);

function previewfileMulti(file) {

    if (tests.filereader === true && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function (event) {

            var image = new Image();

            image.onload = function () {

                $(".btn-next").attr("disabled", "disabled");
                $(".btn-prev").attr("disabled", "disabled");

                var progressBar = document.getElementById("imageProgress");
                var percentProgress = (100 / (g_numNewImages / g_numReadImages));
                progressBar.style.width = percentProgress + "%";
                progressBar.innerHTML = "<b>" + g_numReadImages + " / " + g_numNewImages + "</b>";
                if (percentProgress == 100) {
                    $(".btn-next").removeAttr('disabled');
                    $(".btn-prev").removeAttr('disabled');

                    progressBar.className = "progress-bar progress-bar-striped active progress-bar-success";
                    $(".btn-next").removeAttr('disabled');
                    $('.bottom-right').notify({
                        type: 'success',
                        message: { text: "Loaded all images successfully." }
                    }).show();
                    $(progressBar).removeClass("active");
                } else {
                    progressBar.className = "progress-bar progress-bar-striped active";
                }
            };


            //check for corrupted image firefox
            if ($.browser.mozilla) {
                image.onerror = function (evt) {
                    $('.bottom-right').notify({
                        type: 'warning',
                        message: { text: "File:" + file.name + " seems to be corrupted!" }
                    }).show();

//                    document.getElementById("holder").innerHTML = ""; //remove corrupted image
//                    document.getElementById("holder").style.height = "300px"; //reset height
                    var ele = document.getElementById(image.id);
                    ele.parentNode.removeChild(ele);

//    delete g_imagesToBeUsedAsTiles[g_currentActiveLightboxImg.id]; //vll mehr performance wenn delete statt splice
                    g_imagesToBeUsedAsTiles.splice(image.id, 1);
                    g_imagesToBeUsedAsTilesIndex--;

                    if (g_imagesToBeUsedAsTilesIndex === 0) {
                        document.getElementById("holderMulti").style.height = "300px";
                    }

                    image = null;

                    return;
                }
            }

            image.src = event.target.result; //triggers .onload


            //check for corrupted image other browsers
            if (!$.browser.mozilla) {
                if (!isImageOk(image)) {

                    $('.bottom-right').notify({
                        type: 'warning',
                        message: { text: "File:" + file.name + " seems to be corrupted!" }
                    }).show();
                    image = null;

                    g_numNewImages--;

                    if (g_numNewImages !== 0) {
                        var progressBar = document.getElementById("imageProgress");
                        var percentProgress = (100 / (g_numNewImages / g_numReadImages));
                        progressBar.style.width = percentProgress + "%";
                        progressBar.innerHTML = "<b>" + g_numReadImages + " / " + g_numNewImages + "</b>";
                        if (percentProgress == 100) {
                            progressBar.className = "progress-bar progress-bar-striped active progress-bar-success";
                            $(".btn-next").removeAttr('disabled');
                            $('.bottom-right').notify({
                                type: 'success',
                                message: { text: "Loaded all images successfully." }
                            }).show();
                            $(progressBar).removeClass("active");
                        } else {
                            progressBar.className = "progress-bar progress-bar-striped active";
                        }
                    }
                    return;
                }
            }

            if (!g_MaximumDifferenceActive) {
                image.id = g_imagesToBeUsedAsTilesIndex; //set id in order to get it fast later if we want to delete/rotate the image

                var spanTag = document.createElement("span");
                spanTag.id = g_imagesToBeUsedAsTilesIndex;
                spanTag.className = "label label-success";
                spanTag.innerHTML = file.name;
                setupLightboxTrigger(spanTag);
                document.getElementById("labelWrapper").appendChild(spanTag);

                g_imagesToBeUsedAsTiles[g_imagesToBeUsedAsTilesIndex++] = image;
//                }
            }
            //only allow nearly quadratic images to be used as images for tiles
            else if (g_MaximumDifferenceBetweenWandH >= Math.abs(image.naturalWidth - image.naturalHeight)) {
//                image.width = 350; // a fake resize
//                image.className += "lightbox_trigger";
                image.id = g_imagesToBeUsedAsTilesIndex; //set id in order to get it fast later if we want to delete/rotate the image

                var spanTag = document.createElement("span");
                spanTag.id = g_imagesToBeUsedAsTilesIndex;
                spanTag.className = "label label-success";
                spanTag.innerHTML = file.name;
                setupLightboxTrigger(spanTag);
                document.getElementById("labelWrapper").appendChild(spanTag);

                g_imagesToBeUsedAsTiles[g_imagesToBeUsedAsTilesIndex++] = image;
            }
        };

        reader.readAsDataURL(file);
    }
    else {
        $('.bottom-right').notify({
            type: 'warning',
            message: { text: "File:" + file.name + " not supported!" }
        }).show();
    }
}


function readfilesMulti(files) {

    g_files = files;
    g_numNewImages = files.length;
    g_numNewImagesForLoop = g_numNewImages; //required because if we detect corrupted image we g_numNewImages--

    g_numReadImages = 0;

    document.getElementById("holderMulti").style.height = "auto"; // let images inside the holder control the height

    doChunk();
}

function doChunk() {
    var loopVar = g_LOOPS_BEFORE_UPDATE_UI;
    while (loopVar-- && g_numReadImages < g_numNewImagesForLoop) {
        previewfileMulti(g_files[g_numReadImages]);
        g_numReadImages++;
    }

    if (g_numReadImages < g_numNewImagesForLoop) {

        setTimeout(doChunk, g_LOOP_DELAY); // 500ms seems to be good a value even on slower hardware
    }
}

if (tests.dnd) {
    holderMulti.ondragover = function () {
        this.className = 'hover';
        return false;
    };
    holderMulti.ondragend = function () {
        this.className = '';
        return false;
    };
    holderMulti.ondrop = function (e) {
        this.className = '';
        e.preventDefault();
        readfilesMulti(e.dataTransfer.files);
    }
} else {
    fileupload.className = 'hidden';
    fileupload.querySelector('input').onchange = function () {
        readfilesMulti(this.files);
    };
}