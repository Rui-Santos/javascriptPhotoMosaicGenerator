//CONFIG BEGIN
TIMEOUT_LOADING_PICTURES = 50; // 50ms seems to be good a value even on slower hardware

SCALE_FACTOR = 1.0;

MINIMUM_PIXEL_TILE_W = 4;
MAXIMUM_PIXEL_TILE_W = 100;
MINIMUM_PIXEL_TILE_H = 4;
MAXIMUM_PIXEL_TILE_H = 100;
//CONFIG END

g_bQuadraticTiles = false;

////////////////////////////////////////////////////////////////
///////////GLOBAL VARIABLES ////////////////////////////////////
////////////////////////////////////////////////////////////////
g_canvasForGettingAvgColor = document.getElementById("canvasForGettingAvgColor");
g_canvasForGettingAvgColorContext = g_canvasForGettingAvgColor.getContext('2d');

g_imagesToBeUsedAsTiles = [];
g_imagesToBeUsedAsTilesIndex = 0;

g_numReadImages = 0;
g_numAlreadyProcessedImages = 0;

g_totalNumberOfImages = document.getElementById("totalNumberOfImages");

g_MaximumDifferenceActive = false;
g_MaximumDifferenceBetweenWandH = 100;

g_EstimatingNumCoresRunning = false;

g_automaticallyGeneratePreviewAfterTilesSizeChanged = false;

g_$inputAlphaBlending = $("#inputAlphaBlending");

g_timeout = $("#inputTimeout").val();

//--------------------------------------------------
// Multi file import
//--------------------------------------------------
// 500ms delay per picture
var g_LOOPS_BEFORE_UPDATE_UI = 1;
var g_LOOP_DELAY = 500; //500ms


//--------------------------------------------------
// wizardLogic
//--------------------------------------------------
g_s1 = document.getElementById("s1");
g_s2 = document.getElementById("s2");
g_s3 = document.getElementById("s3");
g_s4 = document.getElementById("s4");
g_s5 = document.getElementById("s5");

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////CONFIG BEGIN
TIMEOUT_LOADING_PICTURES = 50; // 50ms seems to be good a value even on slower hardware

SCALE_FACTOR = 1.0;

MINIMUM_PIXEL_TILE_W = 4;
MAXIMUM_PIXEL_TILE_W = 100;
MINIMUM_PIXEL_TILE_H = 4;
MAXIMUM_PIXEL_TILE_H = 100;
//CONFIG END

////////////////////////////////////////////////////////////////
///////////GLOBAL VARIABLES ////////////////////////////////////
////////////////////////////////////////////////////////////////
g_canvasForGettingAvgColor = document.getElementById("canvasForGettingAvgColor");
g_canvasForGettingAvgColorContext = g_canvasForGettingAvgColor.getContext('2d');

g_imagesToBeUsedAsTiles = [];
g_imagesToBeUsedAsTilesIndex = 0;

g_numReadImages = 0;
g_numAlreadyProcessedImages = 0;

g_totalNumberOfImages = document.getElementById("totalNumberOfImages");

g_MaximumDifferenceActive = false;
g_MaximumDifferenceBetweenWandH = 100;

g_automaticallyGeneratePreviewAfterTilesSizeChanged = false;

g_$inputAlphaBlending = $("#inputAlphaBlending");

//--------------------------------------------------
// Multi file import
//--------------------------------------------------

// 500ms delay per picture
var g_LOOPS_BEFORE_UPDATE_UI = 1;
var g_LOOP_DELAY = 500; //500ms

//--------------------------------------------------
// wizardLogic
//--------------------------------------------------
g_s1 = document.getElementById("s1");
g_s2 = document.getElementById("s2");
g_s3 = document.getElementById("s3");
g_s4 = document.getElementById("s4");
g_s5 = document.getElementById("s5");

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

$(document).ready(function () {
    PATH_TO_DEFAULT_IMAGE = document.getElementById("defaultImage").src;
});