//1  获取画布
var canvasname=document.getElementById("canvas");
if(canvasname.getContext){
    var context=canvasname.getContext('2d');
}

//2  全屏幕画布，ps：最好不要用css，会出bug 
setCanvasSize();
window.onresize=function(){
    setCanvasSize();
}; //这句的用处是在用户拖动屏幕的时候，宽度会重新全屏幕。但是会有刚刚画的东西丢失的bug

//3  特性检测，检测设备是否可触碰。
lisenToUser(canvas)
function lisenToUser(canvas){
    //使用document.body.ontouchstart!==undefined或者in方法ontouchstart in document.body都行。
    if(document.body.ontouchstart!==undefined){
        lisenToTouch(canvas);
    }else{
        lisenToMouse(canvas);
    }
}
 
//4  设置一个橡皮擦和画笔清除下载按钮   没变化诶
var usingEraser=false;
eraser.onclick=function(){
    usingEraser=true;
    eraser.classList.add("activesvg")     //classList，则使在原来的class的基础上再加一个classname，但是如果使用x.classname=""，则会将原来的classname那么换成重新定义的名字
    brush.classList.remove("activesvg")
    clear.classList.remove("activesvg")
    download.classList.remove("activesvg")
}
brush.onclick=function(){
    usingEraser=false;
    brush.classList.add("activesvg")
    eraser.classList.remove("activesvg")
    clear.classList.remove("activesvg")
    download.classList.remove("activesvg")
}
clear.onclick=function(){
    context.clearRect(0,0,canvas.width,canvas.height);
    eraser.classList.remove("activesvg")
    brush.classList.remove("activesvg")
    clear.classList.add("activesvg")
    download.classList.remove("activesvg")
}
download.onclick = function(){
    var url = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'my pic';
    a.target="_blank"
    a.click();
    eraser.classList.remove("activesvg")
    brush.classList.remove("activesvg")
    clear.classList.remove("activesvg")
    download.classList.add("activesvg")
}

//7  添加有颜色的画笔 注意classList中间的L不要小写
red.onclick=function(){
    context.strokeStyle="red"; 
    context.fillStyle="red"; 
    red.classList.add("activecol")
    yellow.classList.remove("activecol")
    green.classList.remove("activecol")
    blue.classList.remove("activecol")
}
yellow.onclick=function(){
    context.strokeStyle="yellow"; 
    context.fillStyle="yellow"; 
    red.classList.remove("activecol")
    yellow.classList.add("activecol")
    green.classList.remove("activecol")
    blue.classList.remove("activecol")
}
green.onclick=function(){
    context.strokeStyle="green"; 
    context.fillStyle="green"; 
    red.classList.remove("activecol")
    yellow.classList.remove("activecol")
    green.classList.add("activecol")
    blue.classList.remove("activecol")
}
blue.onclick=function(){
    context.strokeStyle="blue"; 
    context.fillStyle="blue"; 
    red.classList.remove("activecol")
    yellow.classList.remove("activecol")
    green.classList.remove("activecol")
    blue.classList.add("activecol")
}
//画笔的粗细   ???????????????
var lineWidth;
thin.onclick=function(){
    lineWidth=2;
    thin.classList.add("activesize")
    thin2.classList.remove("activesize")
    thick.classList.remove("activesize")
    thick2.classList.remove("activesize")
}
thin2.onclick=function(){
    lineWidth=4;
    thin.classList.remove("activesize")
    thin2.classList.add("activesize")
    thick.classList.remove("activesize")
    thick2.classList.remove("activesize")
}
thick.onclick=function(){
    lineWidth=6;
    thin.classList.remove("activesize")
    thin2.classList.remove("activesize")
    thick.classList.add("activesize")
    thick2.classList.remove("activesize")
}
thick2.onclick=function(){
    lineWidth=8;
    thin.classList.remove("activesize")
    thin2.classList.remove("activesize")
    thick.classList.remove("activesize")
    thick2.classList.add("activesize")

}



/*****函数部分,不要看👀*****/
//全屏幕画布函数
function setCanvasSize(){
    var pageWidth=document.documentElement.clientWidth;
    var pageHeight=document.documentElement.clientHeight;
    canvas.width=pageWidth;
    canvas.height=pageHeight;
}
//监听触摸事件的函数
function lisenToTouch(canvas){
    var lastPoint={x:undefined,y:undefined};
    var usingBrush=false;
    canvas.ontouchstart=function(aaa){
      console.log(aaa)  //打印出touchevent
      var x=aaa.touches[0].clientX;     //因为clientX/clientY的在Touch event的touchs下面的0数组中，所以。。。
      var y=aaa.touches[0].clientY;
      console.log(x,y)   //打印出坐标
      if(usingEraser){
          context.clearRect(x-10,y-10,20,20)
      }else{
     usingBrush=true;
        lastPoint={"x":x,"y":y};
        //drawCircle(x,y,3);
    }
    };
    canvas.ontouchmove=function(aaa){
      var x=aaa.touches[0].clientX;
      var y=aaa.touches[0].clientY;
      if(usingEraser){
          context.clearRect(x-10,y-10,20,20)
      }else{
        if (usingBrush){
        var newPoint={"x":x,"y":y};
        //drawCircle(x,y,3);
        drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y);
        lastPoint=newPoint;
        }
     }
    };
    canvas.ontouchup=function(){
      usingBrush=false;
      usingEraser=false;
    };
}

//监听鼠标事件的函数
function lisenToMouse(canvas){
    var lastPoint={x:undefined,y:undefined};
    var usingBrush=false;
    canvas.onmousedown=function(aaa){
      var x=aaa.clientX;
      var y=aaa.clientY;
      if(usingEraser){
          context.clearRect(x-10,y-10,20,20)
      }else{
     usingBrush=true;
        lastPoint={"x":x,"y":y};
        //drawCircle(x,y,3);
    }
    };
    canvas.onmousemove=function(aaa){
      var x=aaa.clientX;
      var y=aaa.clientY;
      if(usingEraser){
          context.clearRect(x-10,y-10,20,20)
      }else{
        if (usingBrush){
        var newPoint={"x":x,"y":y};
        //drawCircle(x,y,3);
        drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y);
        lastPoint=newPoint;
        }
     }
    };
    canvas.onmouseup=function(){
      usingBrush=false;
      usingEraser=false;
    };
}

//画一个圆
function drawCircle(x,y,radius){
    context.beginPath();
    context.arc(x,y,radius,0,Math.PI*2);
    context.fill();
}  
//画一个直线
function drawLine(x1,y1,x2,y2){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();     //画直线不能用fill()
    context.closePath();
    context.lineWidth=lineWidth;
}