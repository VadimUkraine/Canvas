const GREY = "grey";
const ORANGE = "orange";
const RED = "red";
const INDENT = 10;
const SNAPPING_AREA = 10;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const rectangles=[
  {
    x: 10,
    y: 10,
    color: GREY,
    width: 100,
    height: 30,
    isDraggable: false,
    idx: 0,
  },
  {
    x: 10,
    y: 60,
    color: GREY,
    width: 50,
    height: 30,
    isDraggable: false,
    idx: 1,
  },
  {
    x: 10,
    y: 110,
    color: GREY,
    width: 25,
    height: 30,
    isDraggable: false,
    idx: 2,
  },
];

let dragItemDefault = null;
let dragItem = null;

function setCanvasDimensions(){
  const canvasWrapper = document.querySelector(".canvas-wrap");
  const canvasWrapperRect = canvasWrapper.getBoundingClientRect();  
  canvas.setAttribute("width", Math.round(canvasWrapperRect.width - INDENT));
  canvas.setAttribute("height", Math.round(canvasWrapperRect.height - INDENT));
}

function defaultDraw(){
  if (ctx){
    rectangles.forEach(item =>{drawRectangle(ctx, item)});   
  } 
}

function drawRectangle(ctx, item){ 
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.width, item.height);
  ctx.lineWidth = 1;
  ctx.strokeRect(item.x + ctx.lineWidth, item.y + ctx.lineWidth, item.width - ctx.lineWidth, item.height - ctx.lineWidth);
}

function markDraggableRectangle(event){  
  rectangles.forEach((item)=>{
    if(hasMouseInsideRectangle(event, item)){
      rectangles[item.idx].isDraggable = true;
      rectangles[item.idx].color = ORANGE;
      dragItemDefault = rectangles[item.idx]
      drawRectangle(ctx, dragItemDefault);     
    }     
  })
}

function hasMouseInsideRectangle(event, item){
  const canvasRect = canvas.getBoundingClientRect(); 
  const mouseX = Math.round(event.clientX - canvasRect.left);
  const mouseY = Math.round(event.clientY - canvasRect.top);
  const xItemMaxPos = item.x + item.width;
  const yItemMaxPos = item.y + item.height;

  return mouseX > item.x && mouseX < xItemMaxPos && mouseY > item.y && mouseY < yItemMaxPos;  
}

function isOverlappingRectangles(noDragItem, item){
  return item.x < noDragItem.x + noDragItem.width - 2 &&
     item.x + item.width > noDragItem.x + 2 &&
     item.y < noDragItem.y + noDragItem.height - 2 &&
     item.height + item.y > noDragItem.y + 2;
}

function markOverlappingRectangles(noDraggableItems, dragItem){
  noDraggableItems.forEach(noDragItem => {
    if (isOverlappingRectangles(noDragItem, dragItem)) {
        rectangles[dragItem.idx].color = RED;
        rectangles[noDragItem.idx].color = RED;
    } else {
      rectangles[noDragItem.idx].color = GREY;
    }
  });
}

function isRectangesNearRightTop (noDragItem, dragItem){
  return dragItem.y + dragItem.height > noDragItem.y - SNAPPING_AREA && dragItem.y + dragItem.height < noDragItem.y;
}

function isRectangesNearRightBottom (noDragItem, dragItem){
  return dragItem.y + dragItem.height > noDragItem.y + noDragItem.height + SNAPPING_AREA;
}

function isRectangesNearRight (noDragItem, dragItem){
  return dragItem.y + dragItem.height < noDragItem.y + noDragItem.height + SNAPPING_AREA  && dragItem.y + dragItem.height > noDragItem.y - SNAPPING_AREA  && dragItem.x < noDragItem.x + noDragItem.width + SNAPPING_AREA;
}

function checkSnappingRectangle(noDragItem, dragItem){
  return dragItem.x <= noDragItem.x + noDragItem.width + SNAPPING_AREA &&
    dragItem.x + dragItem.width >= noDragItem.x - SNAPPING_AREA &&
    dragItem.y <= noDragItem.y + noDragItem.height + SNAPPING_AREA &&
    dragItem.height + dragItem.y >= noDragItem.y - SNAPPING_AREA;
}

function snapRectangles(noDragItem, dragItem, noDraggableItems){
  if(dragItem.x > noDragItem.x && dragItem.x < noDragItem.x + noDragItem.width){
    if(isRectangesNearRightTop(noDragItem, dragItem)){
      rectangles[dragItem.idx].x = noDragItem.x;
      rectangles[dragItem.idx].y = noDragItem.y - noDragItem.height + ctx.lineWidth;
    }
    if(isRectangesNearRightBottom(noDragItem, dragItem)){
      rectangles[dragItem.idx].x = noDragItem.x;
      rectangles[dragItem.idx].y = noDragItem.y + noDragItem.height - ctx.lineWidth;
    }           
  }

  if(dragItem.x > noDragItem.x + noDragItem.width){
    if(isRectangesNearRight(noDragItem, dragItem)){
      rectangles[dragItem.idx].x = noDragItem.x + noDragItem.width - ctx.lineWidth;
      rectangles[dragItem.idx].y = noDragItem.y;
    }
  }

  if(dragItem.x < noDragItem.x - SNAPPING_AREA){
    rectangles[dragItem.idx].x = noDragItem.x - dragItem.width + ctx.lineWidth;
    rectangles[dragItem.idx].y = noDragItem.y;
  }
  markOverlappingRectangles(noDraggableItems,dragItem );
}

function snapping(){
  rectangles.forEach(dragItem=>{
    const noDraggableItems = rectangles.filter(item=> !item.isDraggable);  
    if(dragItem.isDraggable){
      noDraggableItems.forEach(noDragItem => {
        if (checkSnappingRectangle(noDragItem, dragItem)) {      
          snapRectangles(noDragItem, dragItem, noDraggableItems);              
        }  
      })
    } 
  })
}

function moveRectangle(event){
  dragItem = rectangles.find(item => item.isDraggable);
  if(dragItem){       
    const canvasRect = canvas.getBoundingClientRect(); 
    const xPos = Math.round(event.clientX - canvasRect.left) - dragItem.width / 2;
    const yPos = Math.round(event.clientY - canvasRect.top) - dragItem.height / 2;
    const newRectangle = {
        x: xPos,
        y: yPos,
        color: ORANGE,
        width: dragItem.width,
        height: dragItem.height,
        isDraggable: true,
        idx: dragItem.idx,
    };
    rectangles[dragItem.idx] = newRectangle;
    snapping();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(item =>{   
      drawRectangle(ctx, item)
    })  
  }
}

function hasRectanglesIntersection(dragItem){
  const isRestanglesCrossing = rectangles.some(item=>item.color === RED);
  const isRectangleOutsideCanvas = dragItem && (dragItem.x < 0 || dragItem.y < 0 || dragItem.x + dragItem.width > canvas.width || dragItem.y + dragItem.height > canvas.height);
  return isRestanglesCrossing || isRectangleOutsideCanvas;
}

function stopMovingRectangle(){
  dragItem = rectangles.find(item => item.isDraggable); 
  if(hasRectanglesIntersection(dragItem)){
    rectangles[dragItemDefault.idx] = dragItemDefault;
  }
  if(dragItem){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    rectangles.forEach(item =>{ 
      item.isDraggable = false;  
      item.color = GREY;
      drawRectangle(ctx, item)
    })   
  }
}