// 1  获取画布
var canvasname = document.getElementById("canvas")
if (canvasname.getContext) {
  var context = canvasname.getContext('2d')
}

// 2  全屏幕画布，ps：最好不要用css，会出bug 
setCanvasSize()
window.onresize = function () {
  setCanvasSize()
} // 这句的用处是在用户拖动屏幕的时候，宽度会重新全屏幕。但是会有刚刚画的东西丢失的bug

// 3  特性检测，检测设备是否可触碰。
lisenToUser(canvas)
function lisenToUser(canvas) {
  // 使用document.body.ontouchstart!==undefined或者in方法ontouchstart in document.body都行。
  if (document.body.ontouchstart !== undefined) {
    lisenToTouch(canvas)
  } else {
    lisenToMouse(canvas)
  }
}

// 4  设置一个橡皮擦和画笔清除下载按钮
var usingEraser = false
var toolList = [brush, clear, download, eraser]
eraser.onclick = function () {
  usingEraser = true
  addActive(eraser, toolList, "activesvg")
}
brush.onclick = function () {
  usingEraser = false
  addActive(brush, toolList, "activesvg")
}
clear.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height)
  addActive(clear, toolList, "activesvg")
}
download.onclick = function () {
  var url = canvas.toDataURL('image/png')
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'my pic'
  a.target = "_blank"
  a.click()
  addActive(download, toolList, "activesvg")
}

// 7  添加有颜色的画笔 注意classList中间的L不要小写
var colorList = [red, yellow, green, blue]
colors.onclick = function (e) { 
  context.strokeStyle = e.target.id
  context.fillStyle = e.target.id
  addActive(e.target, colorList, "activecol")
}

// 画笔的粗细 
var lineWidth;
var brushList = [thin, thin2, thick, thick2]
sizes.onclick = function (e) {
  brushList.forEach((value, index) => {
    if(value == e.target) {
      lineWidth = (index + 1) * 2
    }
  });
  addActive(e.target, brushList, "activesize")
}





/*****函数部分,不要看👀*****/
// 添加 class active 状态
function addActive(addPart, removePart, className) {
  for(let i = 0; i < removePart.length; i++) { 
    removePart[i].classList.remove(className)
  }
  addPart.classList.add(className)
}

// 全屏幕画布函数
function setCanvasSize() {
  var pageWidth = document.documentElement.clientWidth;
  var pageHeight = document.documentElement.clientHeight;
  canvas.width = pageWidth;
  canvas.height = pageHeight
}

// 监听触摸事件的函数
function lisenToTouch(canvas) {
  var lastPoint = { x: undefined, y: undefined }
  var usingBrush = false
  canvas.ontouchstart = function (e) {
    var x = e.touches[0].clientX   
    var y = e.touches[0].clientY
    if (usingEraser) {
      context.clearRect(x - 10, y - 10, 20, 20)
    } else {
      usingBrush = true
      lastPoint = { "x": x, "y": y }
    }
  }
  canvas.ontouchmove = function (e) {
    var x = e.touches[0].clientX
    var y = e.touches[0].clientY
    if (usingEraser) {
      context.clearRect(x - 10, y - 10, 20, 20)
    } else {
      if (usingBrush) {
        var newPoint = { "x": x, "y": y }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
  }
  canvas.ontouchup = function () {
    usingBrush = false
    usingEraser = false
  }
}

// 监听鼠标事件的函数
function lisenToMouse(canvas) {
  var lastPoint = { x: undefined, y: undefined }
  var usingBrush = false
  canvas.onmousedown = function (e) {
    var x = e.clientX
    var y = e.clientY
    if (usingEraser) {
      context.clearRect(x - 10, y - 10, 20, 20)
    } else {
      usingBrush = true
      lastPoint = { "x": x, "y": y }
    }
  }
  canvas.onmousemove = function (e) {
    var x = e.clientX
    var y = e.clientY
    if (usingEraser) {
      context.clearRect(x - 10, y - 10, 20, 20)
    } else {
      if (usingBrush) {
        var newPoint = { "x": x, "y": y }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
  }
  canvas.onmouseup = function () {
    usingBrush = false
    usingEraser = false
  }
}

// 画一个圆
function drawCircle(x, y, radius) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}
// 画一个直线
function drawLine(x1, y1, x2, y2) {
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()   
  context.closePath()
  context.lineWidth = lineWidth
}