
document.addEventListener('dragstart', function(event) {
  let targetWidth = event.target.getAttribute('data-width');
  // event.target.classList.add('drag-item');
  // let rectangle = document.createElement('p');
  // rectangle.className = "drag-item";
  // document.body.append(rectangle);
  // rectangle.style.cssText = "color: blue; border: 1px solid black, width: "+targetWidth+", height: 30px, "; 


  console.log('DRAG ---', event.pageX, event.pageY)

})




// TODO - это тестовая версия с Канвасом, удалю закомиченный код, когда разберусь как отрисовать 
// прямоугольники по задаче
window.onload = draw();

function draw(){
  var canvas = document.getElementById('test');

  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    console.log('CANVAS ----', getComputedStyle(canvas).width, getComputedStyle(canvas).height)

    // ctx.fillStyle = "red";
    // ctx.fillRect(10, 10, 21, 11);
    // ctx.clearRect(11,11,19,9);
    // ctx.fillStyle = "red";
    // ctx.fillRect(11, 11, 19, 9);

    // ctx.beginPath();
    // ctx.moveTo(75,50);
    // ctx.lineTo(100,75);
    // ctx.lineTo(100,25);
    // ctx.fillStyle = "red";
    // ctx.fill()
    

    // let rectangle = new Path2D();

    // rectangle.fillStyle = "red";
    // rectangle.rect(10, 10, 21, 11);
    // ctx.stroke(rectangle)


    // ctx.imageSmoothingEnabled = false;
    // ctx.fillStyle = "red";
    // // ctx.lineWidth = 5;
    // // // ctx.strokeStyle = "blue";
    // ctx.fillRect(10, 10, 21, 11);
   
    // ctx.strokeStyle = "blue";
    // ctx.beginPath();
    // ctx.moveTo(10);
    // ctx.lineTo(11);
    // ctx.stroke();

    // for (var i = 0; i < 10; i++){
    //   ctx.lineWidth = 5;
    //   ctx.beginPath();
    //   ctx.moveTo(5+i*14,5);
    //   ctx.lineTo(5+i*14,140);
    //   ctx.stroke();
    // }

    // var img = new Image();
    // ctx.drawImage(img, 20, 10)
    // img.style.color = 'blue';





  }
}