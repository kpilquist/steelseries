
import {
rgbToHsl, 
doc,
} from "./tools";

var lightbulb = function(canvas, parameters) {
  parameters = parameters || {};
  var mainCtx,
    // parameters
    width = (undefined === parameters.width ? 0 : parameters.width),
    height = (undefined === parameters.height ? 0 : parameters.height),
    glowColor = (undefined === parameters.glowColor ? '#ffff00' : parameters.glowColor),
    //
    size, imageWidth, imageHeight,
    initialized = false,
    lightOn = false,
    alpha = 1,
    offBuffer = doc.createElement('canvas'),
    offCtx = offBuffer.getContext('2d'),
    onBuffer = doc.createElement('canvas'),
    onCtx = onBuffer.getContext('2d'),
    bulbBuffer = doc.createElement('canvas'),
    bulbCtx = bulbBuffer.getContext('2d');
  // End of variables

  // Get the canvas context and clear it
  mainCtx = document.getElementById(canvas).getContext('2d');

  // Has a size been specified?
  if (width === 0) {
    width = mainCtx.canvas.width;
  }
  if (height === 0) {
    height = mainCtx.canvas.height;
  }

  // Get the size
  mainCtx.canvas.width = width;
  mainCtx.canvas.height = height;
  size = width < height ? width : height;
  imageWidth = size;
  imageHeight = size;

  function drawToBuffer(width, height, drawFunction) {
    var buffer = doc.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    drawFunction(buffer.getContext('2d'));
    return buffer;
  }

  var getColorValues = function(color) {
    var colorData,
      lookupBuffer = drawToBuffer(1, 1, function(ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(0, 0, 1, 1);
        ctx.fill();
      });

    colorData = lookupBuffer.getContext('2d').getImageData(0, 0, 2, 2).data;
    return [colorData[0], colorData[1], colorData[2]];
  };

  offBuffer.width = imageWidth;
  offBuffer.height = imageHeight;

  onBuffer.width = imageWidth;
  onBuffer.height = imageHeight;

  bulbBuffer.width = imageWidth;
  bulbBuffer.height = imageHeight;

  var drawOff = function(ctx) {
    var glassOffFill;

    ctx.save();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0.289473 * imageWidth, 0.438596 * imageHeight);
    ctx.bezierCurveTo(0.289473 * imageWidth, 0.561403 * imageHeight, 0.385964 * imageWidth, 0.605263 * imageHeight, 0.385964 * imageWidth, 0.745614 * imageHeight);
    ctx.bezierCurveTo(0.385964 * imageWidth, 0.745614 * imageHeight, 0.587719 * imageWidth, 0.745614 * imageHeight, 0.587719 * imageWidth, 0.745614 * imageHeight);
    ctx.bezierCurveTo(0.587719 * imageWidth, 0.605263 * imageHeight, 0.692982 * imageWidth, 0.561403 * imageHeight, 0.692982 * imageWidth, 0.438596 * imageHeight);
    ctx.bezierCurveTo(0.692982 * imageWidth, 0.324561 * imageHeight, 0.605263 * imageWidth, 0.228070 * imageHeight, 0.5 * imageWidth, 0.228070 * imageHeight);
    ctx.bezierCurveTo(0.385964 * imageWidth, 0.228070 * imageHeight, 0.289473 * imageWidth, 0.324561 * imageHeight, 0.289473 * imageWidth, 0.438596 * imageHeight);
    ctx.closePath();
    glassOffFill = ctx.createLinearGradient(0, 0.289473 * imageHeight, 0, 0.701754 * imageHeight);
    glassOffFill.addColorStop(0, '#eeeeee');
    glassOffFill.addColorStop(0.99, '#999999');
    glassOffFill.addColorStop(1, '#999999');
    ctx.fillStyle = glassOffFill;
    ctx.fill();
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.008771 * imageWidth;
    ctx.strokeStyle = '#cccccc';
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  };

  var drawOn = function(ctx) {
    var glassOnFill,
      data = getColorValues(glowColor),
      red = data[0],
      green = data[1],
      blue = data[2],
      hsl = rgbToHsl(red, green, blue);

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0.289473 * imageWidth, 0.438596 * imageHeight);
    ctx.bezierCurveTo(0.289473 * imageWidth, 0.561403 * imageHeight, 0.385964 * imageWidth, 0.605263 * imageHeight, 0.385964 * imageWidth, 0.745614 * imageHeight);
    ctx.bezierCurveTo(0.385964 * imageWidth, 0.745614 * imageHeight, 0.587719 * imageWidth, 0.745614 * imageHeight, 0.587719 * imageWidth, 0.745614 * imageHeight);
    ctx.bezierCurveTo(0.587719 * imageWidth, 0.605263 * imageHeight, 0.692982 * imageWidth, 0.561403 * imageHeight, 0.692982 * imageWidth, 0.438596 * imageHeight);
    ctx.bezierCurveTo(0.692982 * imageWidth, 0.324561 * imageHeight, 0.605263 * imageWidth, 0.228070 * imageHeight, 0.5 * imageWidth, 0.228070 * imageHeight);
    ctx.bezierCurveTo(0.385964 * imageWidth, 0.228070 * imageHeight, 0.289473 * imageWidth, 0.324561 * imageHeight, 0.289473 * imageWidth, 0.438596 * imageHeight);
    ctx.closePath();

    glassOnFill = ctx.createLinearGradient(0, 0.289473 * imageHeight, 0, 0.701754 * imageHeight);

    if (red === green && green === blue) {
      glassOnFill.addColorStop(0, 'hsl(0, 60%, 0%)');
      glassOnFill.addColorStop(1, 'hsl(0, 40%, 0%)');
    } else {
      glassOnFill.addColorStop(0, 'hsl(' + hsl[0] * 255 + ', ' + hsl[1] * 100 + '%, 70%)');
      glassOnFill.addColorStop(1, 'hsl(' + hsl[0] * 255 + ', ' + hsl[1] * 100 + '%, 80%)');
    }
    ctx.fillStyle = glassOnFill;

    // sets shadow properties
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 30;
    ctx.shadowColor = glowColor;

    ctx.fill();

    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.008771 * imageWidth;
    ctx.strokeStyle = 'rgba(' + red + ', ' + green + ', ' + blue + ', 0.4)';
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  };

  var drawBulb = function(ctx) {
    var highlight, winding, winding1, contactPlate;

    ctx.save();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0.350877 * imageWidth, 0.333333 * imageHeight);
    ctx.bezierCurveTo(0.350877 * imageWidth, 0.280701 * imageHeight, 0.412280 * imageWidth, 0.236842 * imageHeight, 0.5 * imageWidth, 0.236842 * imageHeight);
    ctx.bezierCurveTo(0.578947 * imageWidth, 0.236842 * imageHeight, 0.640350 * imageWidth, 0.280701 * imageHeight, 0.640350 * imageWidth, 0.333333 * imageHeight);
    ctx.bezierCurveTo(0.640350 * imageWidth, 0.385964 * imageHeight, 0.578947 * imageWidth, 0.429824 * imageHeight, 0.5 * imageWidth, 0.429824 * imageHeight);
    ctx.bezierCurveTo(0.412280 * imageWidth, 0.429824 * imageHeight, 0.350877 * imageWidth, 0.385964 * imageHeight, 0.350877 * imageWidth, 0.333333 * imageHeight);
    ctx.closePath();
    highlight = ctx.createLinearGradient(0, 0.245614 * imageHeight, 0, 0.429824 * imageHeight);
    highlight.addColorStop(0, '#ffffff');
    highlight.addColorStop(0.99, 'rgba(255, 255, 255, 0)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlight;
    ctx.fill();
    ctx.restore();

    //winding
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0.377192 * imageWidth, 0.745614 * imageHeight);
    ctx.bezierCurveTo(0.377192 * imageWidth, 0.745614 * imageHeight, 0.429824 * imageWidth, 0.728070 * imageHeight, 0.491228 * imageWidth, 0.728070 * imageHeight);
    ctx.bezierCurveTo(0.561403 * imageWidth, 0.728070 * imageHeight, 0.605263 * imageWidth, 0.736842 * imageHeight, 0.605263 * imageWidth, 0.736842 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.763157 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.780701 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.798245 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.815789 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.833333 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.850877 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.868421 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.885964 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.894736 * imageHeight);
    ctx.bezierCurveTo(0.605263 * imageWidth, 0.894736 * imageHeight, 0.570175 * imageWidth, 0.956140 * imageHeight, 0.535087 * imageWidth, 0.991228 * imageHeight);
    ctx.bezierCurveTo(0.526315 * imageWidth, 0.991228 * imageHeight, 0.517543 * imageWidth, imageHeight, 0.5 * imageWidth, imageHeight);
    ctx.bezierCurveTo(0.482456 * imageWidth, imageHeight, 0.473684 * imageWidth, imageHeight, 0.464912 * imageWidth, 0.991228 * imageHeight);
    ctx.bezierCurveTo(0.421052 * imageWidth, 0.947368 * imageHeight, 0.394736 * imageWidth, 0.903508 * imageHeight, 0.394736 * imageWidth, 0.903508 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.894736 * imageHeight);
    ctx.lineTo(0.385964 * imageWidth, 0.885964 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.868421 * imageHeight);
    ctx.lineTo(0.385964 * imageWidth, 0.850877 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.833333 * imageHeight);
    ctx.lineTo(0.385964 * imageWidth, 0.815789 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.798245 * imageHeight);
    ctx.lineTo(0.377192 * imageWidth, 0.789473 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.771929 * imageHeight);
    ctx.lineTo(0.377192 * imageWidth, 0.763157 * imageHeight);
    ctx.lineTo(0.377192 * imageWidth, 0.745614 * imageHeight);
    ctx.closePath();
    winding = ctx.createLinearGradient(0.473684 * imageWidth, 0.728070 * imageHeight, 0.484702 * imageWidth, 0.938307 * imageHeight);
    winding.addColorStop(0, '#333333');
    winding.addColorStop(0.04, '#d9dad6');
    winding.addColorStop(0.19, '#e4e5e0');
    winding.addColorStop(0.24, '#979996');
    winding.addColorStop(0.31, '#fbffff');
    winding.addColorStop(0.4, '#818584');
    winding.addColorStop(0.48, '#f5f7f4');
    winding.addColorStop(0.56, '#959794');
    winding.addColorStop(0.64, '#f2f2f0');
    winding.addColorStop(0.7, '#828783');
    winding.addColorStop(0.78, '#fcfcfc');
    winding.addColorStop(1, '#666666');
    ctx.fillStyle = winding;
    ctx.fill();
    ctx.restore();

    // winding
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0.377192 * imageWidth, 0.745614 * imageHeight);
    ctx.bezierCurveTo(0.377192 * imageWidth, 0.745614 * imageHeight, 0.429824 * imageWidth, 0.728070 * imageHeight, 0.491228 * imageWidth, 0.728070 * imageHeight);
    ctx.bezierCurveTo(0.561403 * imageWidth, 0.728070 * imageHeight, 0.605263 * imageWidth, 0.736842 * imageHeight, 0.605263 * imageWidth, 0.736842 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.763157 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.780701 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.798245 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.815789 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.833333 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.850877 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.868421 * imageHeight);
    ctx.lineTo(0.596491 * imageWidth, 0.885964 * imageHeight);
    ctx.lineTo(0.605263 * imageWidth, 0.894736 * imageHeight);
    ctx.bezierCurveTo(0.605263 * imageWidth, 0.894736 * imageHeight, 0.570175 * imageWidth, 0.956140 * imageHeight, 0.535087 * imageWidth, 0.991228 * imageHeight);
    ctx.bezierCurveTo(0.526315 * imageWidth, 0.991228 * imageHeight, 0.517543 * imageWidth, imageHeight, 0.5 * imageWidth, imageHeight);
    ctx.bezierCurveTo(0.482456 * imageWidth, imageHeight, 0.473684 * imageWidth, imageHeight, 0.464912 * imageWidth, 0.991228 * imageHeight);
    ctx.bezierCurveTo(0.421052 * imageWidth, 0.947368 * imageHeight, 0.394736 * imageWidth, 0.903508 * imageHeight, 0.394736 * imageWidth, 0.903508 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.894736 * imageHeight);
    ctx.lineTo(0.385964 * imageWidth, 0.885964 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.868421 * imageHeight);
    ctx.lineTo(0.385964 * imageWidth, 0.850877 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.833333 * imageHeight);
    ctx.lineTo(0.385964 * imageWidth, 0.815789 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.798245 * imageHeight);
    ctx.lineTo(0.377192 * imageWidth, 0.789473 * imageHeight);
    ctx.lineTo(0.394736 * imageWidth, 0.771929 * imageHeight);
    ctx.lineTo(0.377192 * imageWidth, 0.763157 * imageHeight);
    ctx.lineTo(0.377192 * imageWidth, 0.745614 * imageHeight);
    ctx.closePath();
    winding1 = ctx.createLinearGradient(0.377192 * imageWidth, 0.789473 * imageHeight, 0.605263 * imageWidth, 0.789473 * imageHeight);
    winding1.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    winding1.addColorStop(0.15, 'rgba(0, 0, 0, 0.32)');
    winding1.addColorStop(0.85, 'rgba(0, 0, 0, 0.33)');
    winding1.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = winding1;
    ctx.fill();
    ctx.restore();

    // contact plate
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0.421052 * imageWidth, 0.947368 * imageHeight);
    ctx.bezierCurveTo(0.438596 * imageWidth, 0.956140 * imageHeight, 0.447368 * imageWidth, 0.973684 * imageHeight, 0.464912 * imageWidth, 0.991228 * imageHeight);
    ctx.bezierCurveTo(0.473684 * imageWidth, imageHeight, 0.482456 * imageWidth, imageHeight, 0.5 * imageWidth, imageHeight);
    ctx.bezierCurveTo(0.517543 * imageWidth, imageHeight, 0.526315 * imageWidth, 0.991228 * imageHeight, 0.535087 * imageWidth, 0.991228 * imageHeight);
    ctx.bezierCurveTo(0.543859 * imageWidth, 0.982456 * imageHeight, 0.561403 * imageWidth, 0.956140 * imageHeight, 0.578947 * imageWidth, 0.947368 * imageHeight);
    ctx.bezierCurveTo(0.552631 * imageWidth, 0.938596 * imageHeight, 0.526315 * imageWidth, 0.938596 * imageHeight, 0.5 * imageWidth, 0.938596 * imageHeight);
    ctx.bezierCurveTo(0.473684 * imageWidth, 0.938596 * imageHeight, 0.447368 * imageWidth, 0.938596 * imageHeight, 0.421052 * imageWidth, 0.947368 * imageHeight);
    ctx.closePath();
    contactPlate = ctx.createLinearGradient(0, 0.938596 * imageHeight, 0, imageHeight);
    contactPlate.addColorStop(0, '#050a06');
    contactPlate.addColorStop(0.61, '#070602');
    contactPlate.addColorStop(0.71, '#999288');
    contactPlate.addColorStop(0.83, '#010101');
    contactPlate.addColorStop(1, '#000000');
    ctx.fillStyle = contactPlate;
    ctx.fill();
    ctx.restore();
    ctx.restore();
  };

  var clearCanvas = function(ctx) {
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Restore the transform
    ctx.restore();
  };

  var init = function() {
    initialized = true;
    drawOff(offCtx);
    drawOn(onCtx);
    drawBulb(bulbCtx);
  };

  // **************   P U B L I C   M E T H O D S   ********************************
  this.setOn = function(on) {
    lightOn = !!on;
    this.repaint();
    return this;
  };

  this.isOn = function() {
    return lightOn;
  };

  this.setAlpha = function(a) {
    alpha = a;
    this.repaint();
    return this;
  };

  this.getAlpha = function() {
    return alpha;
  };

  this.setGlowColor = function(color) {
    glowColor = color;
    init();
    this.repaint();
    return this;
  };

  this.getGlowColor = function() {
    return glowColor;
  };

  // Component visualization
  this.repaint = function() {
    if (!initialized) {
      init();
    }

    clearCanvas(mainCtx);

    mainCtx.save();

    mainCtx.drawImage(offBuffer, 0, 0);

    mainCtx.globalAlpha = alpha;
    if (lightOn) {
      mainCtx.drawImage(onBuffer, 0, 0);
    }
    mainCtx.globalAlpha = 1;
    mainCtx.drawImage(bulbBuffer, 0, 0);
    mainCtx.restore();
  };

  this.repaint();

  return this;
};

export default lightbulb;