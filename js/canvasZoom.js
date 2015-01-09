//CONFIG //
g_scaleFactorCanvasZoom = 1.1;
//CONFIG END //

var imageTobeZoomed = new Image;

function resetCanvasZoom() {
    g_canvasGeneratedMosaic.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
    g_canvasGeneratedMosaic.getContext('2d').drawImage(imageTobeZoomed, 0, 0);
}

function disableCanvasZoom() {
    if (typeof(g_canvasGeneratedMosaic) !== "undefined") { // if initCanvasZoom has been called at least once
        g_canvasGeneratedMosaic.removeEventListener('mousedown', mousedownCanvasZoom, false);

        g_canvasGeneratedMosaic.removeEventListener('mousemove', mousemoveCanvasZoom, false);

        g_canvasGeneratedMosaic.removeEventListener('mouseup', mouseupCanvasZoom, false);

        g_canvasGeneratedMosaic.removeEventListener('DOMMouseScroll', handleScrollCanvasZoom, false);
        g_canvasGeneratedMosaic.removeEventListener('mousewheel', handleScrollCanvasZoom, false);
    }
}

//init or reenables CanvasZoom
function initCanvasZoom() {

    imageTobeZoomed.src = g_canvasGeneratedMosaic.toDataURL();

    g_canvasZoomContext = g_canvasGeneratedMosaic.getContext('2d');
    trackTransforms(g_canvasZoomContext);

    lastX = g_canvasGeneratedMosaic.width / 2;
    lastY = g_canvasGeneratedMosaic.height / 2;

    dragStart = false;
    dragged = false;


    g_canvasGeneratedMosaic.addEventListener('mousedown', mousedownCanvasZoom, false);

    g_canvasGeneratedMosaic.addEventListener('mousemove', mousemoveCanvasZoom, false);

    g_canvasGeneratedMosaic.addEventListener('mouseup', mouseupCanvasZoom, false);

    g_canvasGeneratedMosaic.addEventListener('DOMMouseScroll', handleScrollCanvasZoom, false);
    g_canvasGeneratedMosaic.addEventListener('mousewheel', handleScrollCanvasZoom, false);
};

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function () {
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };

    var translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function (x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}

function redraw() {
    // Clear the entire canvas
    var p1 = g_canvasZoomContext.transformedPoint(0, 0);
    var p2 = g_canvasZoomContext.transformedPoint(g_canvasGeneratedMosaic.width, g_canvasGeneratedMosaic.height);

    g_canvasZoomContext.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    g_canvasZoomContext.save();
    g_canvasZoomContext.setTransform(1, 0, 0, 1, 0, 0);

    g_canvasZoomContext.clearRect(0, 0, g_canvasGeneratedMosaic.width, g_canvasGeneratedMosaic.height);

    g_canvasZoomContext.restore();

    g_canvasZoomContext.drawImage(imageTobeZoomed, 0, 0);
}

//var zoom = function (clicks) {
function zoom(clicks) {
    var pt = g_canvasZoomContext.transformedPoint(lastX, lastY);
    g_canvasZoomContext.translate(pt.x, pt.y);
    var factor = Math.pow(g_scaleFactorCanvasZoom, clicks);
    g_canvasZoomContext.scale(factor, factor);
    g_canvasZoomContext.translate(-pt.x, -pt.y);
    redraw();
};

///////////// Event callback functions

function mousedownCanvasZoom(evt) {
    if (evt.which === 3) { // Right mouse button was clicked!
        return;
    }
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    lastX = evt.offsetX || (evt.pageX - g_canvasGeneratedMosaic.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - g_canvasGeneratedMosaic.offsetTop);
    dragStart = g_canvasZoomContext.transformedPoint(lastX, lastY);
    dragged = false;
}

function mousemoveCanvasZoom(evt) {
    lastX = evt.offsetX || (evt.pageX - g_canvasGeneratedMosaic.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - g_canvasGeneratedMosaic.offsetTop);
    dragged = true;
    if (dragStart) {
        var pt = g_canvasZoomContext.transformedPoint(lastX, lastY);
        g_canvasZoomContext.translate(pt.x - dragStart.x, pt.y - dragStart.y);
        redraw();
    }
}

function mouseupCanvasZoom(evt) {
    dragStart = null;
    if (!dragged) {
        zoom(evt.shiftKey ? -1 : 1);
    }
}

function handleScrollCanvasZoom(evt) {
    var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
    return evt.preventDefault() && false;
};

