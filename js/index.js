function mainPictureSelected() {

    g_imgInput = document.getElementById("imgInput");

    $('#downloadAs').hide(); //hide download button
    $(".step3").hide(); //falls schon ein mosaic generiert wurde

    // Es wird im voraus ueberprueft ob das zu inkludierende Hauptbild exportierbar ist
    var exportCanvas = new ExportCanvas();
    try {
        exportCanvas.isImgExportable("imgInput");
    } catch (Exception) {
        $('.bottom-right').notify({
            type: 'warning',
            message: { text: Exception }
        }).show();
    }

    MAXIMUM_PIXEL_TILE_W = g_imgInput.naturalWidth;
    MAXIMUM_PIXEL_TILE_H = g_imgInput.naturalHeight;

    MINIMUM_NUM_TILES_W = Math.ceil(g_imgInput.naturalWidth / MAXIMUM_PIXEL_TILE_W);
    MAXIMUM_NUM_TILES_W = Math.floor(g_imgInput.naturalWidth / MINIMUM_PIXEL_TILE_W);
    MINIMUM_NUM_TILES_H = Math.ceil(g_imgInput.naturalHeight / MAXIMUM_PIXEL_TILE_H);
    MAXIMUM_NUM_TILES_H = Math.floor(g_imgInput.naturalHeight / MINIMUM_PIXEL_TILE_H);

    g_$inputNumW.on('input', function () {
        inputNumWValueChanged($(this).val());
    }).attr({
        "max": g_imgInput.naturalWidth / MINIMUM_PIXEL_TILE_W,
        "value": Math.ceil(g_imgInput.naturalWidth / 16 / MINIMUM_PIXEL_TILE_W)
    });


    g_$inputW.on('input', function () {
        inputWValueChanged($(this).val());
    }).attr({
        "min": MINIMUM_PIXEL_TILE_W,
        "max": g_imgInput.naturalWidth,
        "value": g_imgInput.naturalWidth / g_$inputNumW.val()
    });


    g_$inputNumH.on('input', function () {
        inputNumHValueChanged($(this).val());
    }).attr({
        "max": g_imgInput.naturalHeight / MINIMUM_PIXEL_TILE_H,
        "value": Math.ceil(g_imgInput.naturalHeight / 16 / MINIMUM_PIXEL_TILE_H)
    });


    g_$inputH.on('input', function () {
        inputHValueChanged($(this).val());
    }).attr({
        "min": MINIMUM_PIXEL_TILE_H,
        "max": g_imgInput.naturalHeight,
        "value": g_imgInput.naturalHeight / g_$inputNumH.val()
    });

    if (g_automaticallyGeneratePreviewAfterTilesSizeChanged) {
        drawPreviewTilesCanvas(document.getElementById("canvasTilesPreview"), document.getElementById("canvasTilesPreview").getContext("2d")
            , g_$inputW.val(), g_$inputH.val());
    }

    updateTotalNumTiles();
    $("#howToReplaceImage").show();
    $(".step2").show();
    $(".btn-next").removeAttr('disabled');
}

$(document).ready(function () {

//    <input class="btn btn-default" id="uploadMain" type="file">
    document.getElementById("insertInputFile").innerHTML = '<input class="btn btn-default" id="uploadMain" type="file">';
    document.getElementById("uploadMain").addEventListener("change", function () {
        previewfile(this.files[0]);
    }, false);

    $(".btn-next").attr("disabled", "disabled");

    $('#downloadAs').hide();

    initLightbox();

    $("#inputTimeout").on('input', function () {
        g_timeout = $(this).val();
    });


    $("#inputNumMaxDiffWnH").on('input', function () {
        g_MaximumDifferenceBetweenWandH = $(this).val();
    });

    $(".integerOnly").on('keypress', function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    g_$inputNumW = $("#inputNumW");
    g_$inputW = $("#inputW");
    g_$inputNumH = $("#inputNumH");
    g_$inputH = $("#inputH");
});

function inputNumWValueChanged(newValue) {
    if (newValue < MINIMUM_NUM_TILES_W) {
        g_$inputW.val(MINIMUM_NUM_TILES_W);
    }
    else if (newValue > MAXIMUM_NUM_TILES_W) {
        g_$inputW.val(MAXIMUM_NUM_TILES_W);
    }

    var v = g_imgInput.naturalWidth / newValue;
    g_$inputW.val(v);

    if (g_bQuadraticTiles) {
        g_$inputH.val(v);

        v = Math.ceil(g_imgInput.naturalHeight / g_$inputH.val());
        g_$inputNumH.val(v);
    }

    updateTotalNumTiles();

    if (g_automaticallyGeneratePreviewAfterTilesSizeChanged) {
        drawPreviewTilesCanvas(document.getElementById("canvasTilesPreview"), document.getElementById("canvasTilesPreview").getContext("2d")
            , g_$inputW.val(), g_$inputH.val());
    }
}

function inputWValueChanged(newValue) {
    if (newValue < MINIMUM_PIXEL_TILE_W) {
        newValue = MINIMUM_PIXEL_TILE_W;
        g_$inputW.val(newValue);
    }
    else if (newValue > MAXIMUM_PIXEL_TILE_W) {
        newValue = MAXIMUM_PIXEL_TILE_W;
        g_$inputW.val(newValue);
    }

    if (g_bQuadraticTiles) {
        g_$inputH.val(newValue);
        var v = Math.ceil(g_imgInput.naturalHeight / g_$inputH.val());
        g_$inputNumH.val(v);
    }


    var v = Math.ceil(g_imgInput.naturalWidth / g_$inputW.val());
    g_$inputNumW.val(v);


    updateTotalNumTiles();

    if (g_automaticallyGeneratePreviewAfterTilesSizeChanged) {
        drawPreviewTilesCanvas(document.getElementById("canvasTilesPreview"), document.getElementById("canvasTilesPreview").getContext("2d")
            , g_$inputW.val(), g_$inputH.val());
    }
}

function inputNumHValueChanged(newValue) {
    if (newValue < MINIMUM_NUM_TILES_H) {
        g_$inputH.val(MINIMUM_NUM_TILES_H);
    }
    else if (newValue > MAXIMUM_NUM_TILES_H) {
        g_$inputH.val(MAXIMUM_NUM_TILES_H);
    }

    var v = g_imgInput.naturalHeight / newValue;
    g_$inputH.val(v);

    if (g_bQuadraticTiles) {
        g_$inputW.val(v);

        v = Math.ceil(g_imgInput.naturalWidth / g_$inputW.val());
        g_$inputNumW.val(v);
    }


    updateTotalNumTiles();

    if (g_automaticallyGeneratePreviewAfterTilesSizeChanged) {
        drawPreviewTilesCanvas(document.getElementById("canvasTilesPreview"), document.getElementById("canvasTilesPreview").getContext("2d")
            , g_$inputW.val(), g_$inputH.val());
    }
}

function inputHValueChanged(newValue) {
    if (newValue < MINIMUM_PIXEL_TILE_H) {
        newValue = MINIMUM_PIXEL_TILE_H;
        g_$inputH.val(newValue);
    }
    else if (newValue > MAXIMUM_PIXEL_TILE_H) {
        newValue = MAXIMUM_PIXEL_TILE_H;
        g_$inputH.val(newValue);
    }

    if (g_bQuadraticTiles) {
        g_$inputW.val(newValue);
        var v = Math.ceil(g_imgInput.naturalWidth / g_$inputW.val());
        g_$inputNumW.val(v);
    }


    updateTotalNumTiles();

    var v = Math.ceil(g_imgInput.naturalHeight / g_$inputH.val());
    g_$inputNumH.val(v);

    if (g_automaticallyGeneratePreviewAfterTilesSizeChanged) {
        drawPreviewTilesCanvas(document.getElementById("canvasTilesPreview"), document.getElementById("canvasTilesPreview").getContext("2d")
            , g_$inputW.val(), g_$inputH.val());
    }
}

function updateTotalNumTiles() {
    document.getElementById("totalNumTiles").innerHTML = g_$inputNumW.val() * g_$inputNumH.val();
}