window.addEventListener("load", function() {
  setCanvasDimensions();
  defaultDraw();
})


window.addEventListener("resize", function() {
  setCanvasDimensions();
  defaultDraw();
})

canvas.addEventListener('mousedown', function(event) {
  markDraggableRectangle(event); 
})

canvas.addEventListener('mousemove', function(event) {
  moveRectangle(event);
})

canvas.addEventListener('mouseup', function() {
  stopMovingRectangle();  
})