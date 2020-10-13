// TODO
// 1. code refactoring -DRY/YAGNI/KISS
// 2. create constants for colors
// 3. code spliting on functions
// 4. 



const canvas = document.getElementById('test');

const rectangles=[
  {
    x: 10,
    y: 10,
    color: "grey",
    width: 100,
    height: 30,
    isDraggable: false,
    idx: 0,
  },
  {
    x: 10,
    y: 50,
    color: "grey",
    width: 50,
    height: 30,
    isDraggable: false,
    idx: 1,
  },
  {
    x: 10,
    y: 90,
    color: "grey",
    width: 25,
    height: 30,
    isDraggable: false,
    idx: 2,
  },
];

let dragItemDefault={};

window.addEventListener("load", function() {
  setCanvasDimensions();
  draw();
})

function setCanvasDimensions(){
  let canvasWrapper = document.querySelector('.canvas-wrap');
  let canvasWrapperRect = canvasWrapper.getBoundingClientRect();  

  canvas.setAttribute("width", Math.round(canvasWrapperRect.width - 10));
  canvas.setAttribute("height", Math.round(canvasWrapperRect.height - 10));
}


canvas.addEventListener('mousedown', function(event) {

  let canvasRect = canvas.getBoundingClientRect(); 
  let mouseX = Math.round(event.clientX - canvasRect.left);
  let mouseY = Math.round(event.clientY - canvasRect.top);

  rectangles.forEach((item, index)=>{
    let xItemMaxPos = item.x+item.width
    let yItemMaxPos = item.y+item.height
    if(mouseX > item.x && mouseX < xItemMaxPos && mouseY > item.y && mouseY < yItemMaxPos ){
      rectangles[index].isDraggable = true;
    } else{
      rectangles[index].isDraggable = false;
    }
  })

  let dragItem = rectangles.find(item => item.isDraggable)
  

  if(dragItem){
    dragItemDefault = dragItem;
  
    let ctx = canvas.getContext('2d');

    ctx.clearRect(dragItem.x, dragItem.y, dragItem.width, dragItem.height);
    ctx.fillStyle = "orange";
    ctx.fillRect(dragItem.x, dragItem.y, dragItem.width, dragItem.height);
  }
  
})


canvas.addEventListener('mousemove', function(event) {
  let dragItem = rectangles.find(item => item.isDraggable)
  


  if(dragItem){    
   
    let canvasRect = canvas.getBoundingClientRect(); 
    let ctx = canvas.getContext('2d');
    ctx.clearRect(dragItem.x, dragItem.y, dragItem.width, dragItem.height);

    let xPos = Math.round(event.clientX - canvasRect.left) - dragItem.width/2;
    let yPos = Math.round(event.clientY - canvasRect.top) - dragItem.height/2;

    let newRectangle = {
        x: xPos,
        y: yPos,
        color: "orange",
        width: dragItem.width,
        height: dragItem.height,
        isDraggable: true,
        idx: dragItem.idx,
    }

    rectangles[dragItem.idx] = newRectangle;



    // checking the crossings of rectanges

    rectangles.forEach(dragItem=>{
      const noDraggableItems = rectangles.filter(item=> !item.isDraggable)
 
      if(dragItem.isDraggable){
        noDraggableItems.forEach(noDragItem => {
          if (dragItem.x < noDragItem.x + noDragItem.width &&
            dragItem.x + dragItem.width > noDragItem.x &&
            dragItem.y < noDragItem.y + noDragItem.height &&
            dragItem.height + dragItem.y > noDragItem.y) {
              rectangles[dragItem.idx].color="red"
              rectangles[noDragItem.idx].color="red"
          } else {
            rectangles[noDragItem.idx].color="grey"
          }
        })
      }
   
    })

    // snapping

    rectangles.forEach(dragItem=>{
      const noDraggableItems = rectangles.filter(item=> !item.isDraggable)
    

      if(dragItem.isDraggable){
        noDraggableItems.forEach(noDragItem => {
          if (dragItem.x <= noDragItem.x + noDragItem.width + 10 &&
              dragItem.x + dragItem.width >= noDragItem.x - 10 &&
              dragItem.y <= noDragItem.y + noDragItem.height + 10 &&
              dragItem.height + dragItem.y >= noDragItem.y - 10) {
              console.log('we can do SNAPPING ---', dragItem.x, dragItem.y, noDragItem.x, noDragItem.y)
              
              if(dragItem.x > noDragItem.x + dragItem.width){
                if(dragItem.y + dragItem.height < noDragItem.y - 10){
                  rectangles[dragItem.idx].x = noDragItem.x;
                  rectangles[dragItem.idx].y = noDragItem.y - noDragItem.height
                }
                if(dragItem.y + dragItem.height > noDragItem.y + noDragItem.height + 10){
                  rectangles[dragItem.idx].x = noDragItem.x + noDragItem.width;
                  rectangles[dragItem.idx].y = noDragItem.y + noDragItem.height
                }
                if(dragItem.y + dragItem.height < noDragItem.y + noDragItem.height + 10 && dragItem.y + dragItem.height > noDragItem.y -10 ){
                  rectangles[dragItem.idx].x = noDragItem.x + noDragItem.width;
                  rectangles[dragItem.idx].y = noDragItem.y;
                }
              }

          } 
   
        })
      }
   
    })




    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach(item =>{   
      drawRectangle(ctx, item)
    })  
  }
})

canvas.addEventListener('mouseup', function(event) {
  let dragItem = rectangles.find(item => item.isDraggable);

  const isCrossing = rectangles.some(item=>item.color==="red")


  if(isCrossing){
     rectangles[dragItemDefault.idx] = dragItemDefault
  }


  if(dragItem){
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach(item =>{ 
      item.isDraggable = false;  
      item.color = "grey"
      drawRectangle(ctx, item)
    })
  }
})


function drawRectangle(canvas, item){  
  canvas.fillStyle = item.color;
  canvas.fillRect(item.x, item.y, item.width, item.height);
}

function draw(){

  if (canvas.getContext){
    let ctx = canvas.getContext('2d');

    rectangles.forEach(item =>{   
      drawRectangle(ctx, item)
    })   
  

  }
}