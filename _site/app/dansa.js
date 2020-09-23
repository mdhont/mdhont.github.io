function getElementsByClass(className) {

  var all = document.all ? document.all : document.getElementsByTagName('*');
  var elements = new Array();
  for (var e = 0; e < all.length; e++) {
    var classes = all[e].className.split(/\s/g);
    for (var c = 0; c < classes.length; c++) {
      var cl = classes[c].split(/_| /);
      for (var x in cl) {
        if (cl[x] == className) {
          elements[elements.length] = all[e];
        }
      }
    }
  }
  return elements;
}

function set_rgb_array(w, h, d) {
  var r = [];
  var g = [];
  var b = [];
  var a = [];
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      r[x + "," + y] = d[((w * y) + x) * 4];
      g[x + "," + y] = d[((w * y) + x) * 4 + 1];
      b[x + "," + y] = d[((w * y) + x) * 4 + 2];
      a[x + "," + y] = d[((w * y) + x) * 4 + 3];
    }
  }
  return new Array(r, g, b, a);
}

function next(w, h, d, r, g, b, a, algo) {

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {

      switch(algo){
        case "mirror":
          var x1 = calc_180(x, w);
          var y1 = calc_180(y, w);
          break;
        case "clone":
          var x1 = calc_00(x, w);
          var y1 = calc_00(y, w);
          break;
        case "triple":
          var x1 = calc_3(x, w);
          var y1 = calc_3(y, w);
          break;
        case "twist":
          var pos_arr = calc_90(x, y, w);
          var x1 = pos_arr[0];
          var y1 = pos_arr[1];
          break;
      }

      d[((w * y1) + x1) * 4] = r[x + "," + y];
      d[((w * y1) + x1) * 4 + 1] = g[x + "," + y]
      d[((w * y1) + x1) * 4 + 2] = b[x + "," + y]
      d[((w * y1) + x1) * 4 + 3] = a[x + "," + y]
    }
  }
}

function color(w, h, d, r, g, b, a, algo) {


  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {

      var r = d[((w * y) + x) * 4];
      var g = d[((w * y) + x) * 4 + 1];
      var b = d[((w * y) + x) * 4 + 2];

      if (algo == "clone") {
        d[((w * y) + x) * 4] = calc_00(r, 256);
        d[((w * y) + x) * 4 + 1] = calc_00(g, 256);
        d[((w * y) + x) * 4 + 2] = calc_00(b, 256);
      }
      if (algo == "triple") {
        d[((w * y) + x) * 4] = calc_3(r, 256);
        d[((w * y) + x) * 4 + 1] = calc_3(g, 256);
        d[((w * y) + x) * 4 + 2] = calc_3(b, 256);
      }

      if (algo == "mirror") {
        d[((w * y) + x) * 4] = calc_180(r, 256);
        d[((w * y) + x) * 4 + 1] = calc_180(g, 256);
        d[((w * y) + x) * 4 + 2] = calc_180(b, 256);
      }

    }
  }
}

function back(w, h, d, r, g, b, a, algo) {


  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {

      switch(algo){
        case "mirror":
          var x1 = calc_180(x, w);
          var y1 = calc_180(y, w);
          break;
        case "clone":
          var x1 = calc_00(x, w);
          var y1 = calc_00(y, w);
          break;
        case "triple":
          var x1 = calc_3(x, w);
          var y1 = calc_3(y, w);
          break;
        case "twist":
          var pos_arr = calc_90(x, y, w);
          var x1 = pos_arr[0];
          var y1 = pos_arr[1];
          break;
      }

      d[((w * y) + x) * 4] = r[x1 + "," + y1];
      d[((w * y) + x) * 4 + 1] = g[x1 + "," + y1]
      d[((w * y) + x) * 4 + 2] = b[x1 + "," + y1]
      d[((w * y) + x) * 4 + 3] = a[x1 + "," + y1]
    }
  }


}

function calc_90($x, $y, $w) {
  if ($x % 2) {
    $evenx = false;
  } else {
    $evenx = true;
  }
  if ($y % 2) {
    $eveny = false;
  } else {
    $eveny = true;
  }
  if ((!($evenx)) && (!($eveny))) {
    $x1 = ($x - 1) / 2;
    $y1 = ($y - 1) / 2;
  }
  if (($eveny) && (!($evenx))) {
    $x1 = ($w - 1) - ($y / 2);
    $y1 = ($x - 1) / 2;
  }
  if ($evenx && $eveny) {
    $x1 = ($w - 1) - ($x / 2);
    $y1 = ($w - 1) - ($y / 2);
  }
  if (($evenx) && (!($eveny))) {
    $x1 = ($y - 1) / 2;
    $y1 = ($w - 1) - ($x / 2)
  }
  return new Array($x1, $y1);
}

function calc_180($x, $w) {

  if ($x % 2 == 0) {
    var Newx = $w - ($x / 2);

    return Newx - 1;

  } else {
    var Newx = (($x + 1) / 2);
    return Newx - 1;


  }

}

function calc_3($x, $w) {

  if ($x % 3 == 0) {
    var Newx = (Math.round($w / 3) * 2) - Math.round($x / 3);
    return Newx;

  }
  if ($x % 3 == 1) {
    var Newx = (Math.round($w / 3) * 1) - Math.round($x / 3);
    return Newx;

  }
  if ($x % 3 == 2) {
    var Newx = $w - Math.round($x / 3);
    return Newx;
  }

}


function calc_00($x, $w) {

  if ($x % 2 == 0) {
    var Newx = ($w / 2) + ($x / 2);
    return Newx;

  } else {
    var Newx = ($x - 1) / 2;
    return Newx;
  }

}


function drawImg(canvas, image) {

  var context = canvas.getContext('2d');
  var r = [];
  var g = [];
  var b = [];
  var h = image.height;
  var w = image.width;
  context.drawImage(image, 0, 0, w, h);

};

function drawNewImg(canvas, image, mode, algo, rgbMode) {

  var context = canvas.getContext('2d');
  var h = image.height;
  var w = image.width;
  var imageData = context.getImageData(0, 0, w, h);
  var d = imageData.data;
  var rgb_array = set_rgb_array(w, h, d);
  r = rgb_array[0];
  g = rgb_array[1];
  b = rgb_array[2];
  a = rgb_array[3];
  if (mode == "next") {

    if (rgbMode=="rgb") {
      color(w, h, d, r, g, b, a, algo);

    }
    if (rgbMode=="position") {
      next(w, h, d, r, g, b, a, algo);

    }

  }

  if (mode == "back") {
    back(w, h, d, r, g, b, a, algo);
  }
  imageData.data = imageData;
  context.putImageData(imageData, 0, 0);
}

$(document).ready(function() {
  var img = new Image();
  var canvas = document.getElementById('screen')
  var context = canvas.getContext('2d');
  var shuffleMode = "clone";
  var rgbMode = "position";

  img.onload = function() {
    drawImg(canvas, this)
  }

  img.src = "/images/sunflower.jpg";
  $(".next").click(function() {
    drawNewImg(canvas, img, "next", shuffleMode, rgbMode)
  });

  $(".back").click(function() {
    drawNewImg(canvas, img, "back", shuffleMode, rgbMode)

  });

  $('input:radio[name="flav"]').change(function() {
    shuffleMode = $('input:radio[name="flav"]:checked').attr("id")
  });
  $('input:radio[name="typ"]').change(function() {
    rgbMode = $('input:radio[name="typ"]:checked').attr("id")
  });
});
