// Create a class for the canvas, including attributes for the id, // draw boolean, and coordinates
class Canvas {
    constructor(canvas_id, draw, coord) {          
        this.canvas_id = canvas_id; 
        this.draw = draw;
        this.coord = coord
    }
    // Sets draw to true and gets the mouse coordinates on the event
    startDrawing(event) {
        this.draw = true;
        let canvas = document.getElementById(this.canvas_id); 
        this.coord.x = (event.clientX - canvas.getBoundingClientRect().left)/(canvas.getBoundingClientRect().height/24);
        this.coord.y = (event.clientY - canvas.getBoundingClientRect().top)/(canvas.getBoundingClientRect().height/24);
    }
    // The actual function that will draw on event (mousemove)
drawSketch(event) {
// If the draw boolean isn't true, terminate the function early
if (!this.draw) {
    return 0;
}
        // Select the canvas and get its context
        let canvas = document.getElementById(this.canvas_id);
        let ctx = canvas.getContext('2d');
    // Start the line
    ctx.beginPath();

    // Pull from the color and width from the associated 
    // controls. The line cap is hardcoded to be rounded,
    // because it looks more natural for a drawing application
    ctx.strokeStyle = document.getElementById("penColor").value;
    ctx.lineWidth = document.getElementById("lineWidth").value;
    ctx.lineCap = "rounded";

            // Start moving to the coordinates determined by mouse 
// movement. The position is updated as the cursor moves
ctx.moveTo(this.coord.x, this.coord.y);
this.coord.x = (event.clientX - canvas.getBoundingClientRect().left)/(canvas.getBoundingClientRect().height/24);
this.coord.y = (event.clientY - canvas.getBoundingClientRect().top)/(canvas.getBoundingClientRect().height/24);

// Specify where the line ends
ctx.lineTo(this.coord.x , this.coord.y);

// Draw the line
ctx.stroke();
}
// Sets draw to false on event (mouseup)
stopDrawing(event) {
    this.draw = false;
}
}

function clear(canvas){
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}


// Write the main function that will execute on load
function main() {
// Initialize the main object, canvas
let canvas = new Canvas("sketchCanvas", false, {x:0 , y:0});


// Add event listeners for the mousedown, mouseup, and 
// mousemove. 
document.addEventListener('mousedown', function(e){
canvas.startDrawing(e);
});
document.addEventListener('mouseup', function(e){
canvas.stopDrawing(e);
});
document.addEventListener('mousemove', function(e){
canvas.drawSketch(e);
});

const button = document.getElementById("clearCanvas");

button.addEventListener('click',function(){clear(document.getElementById("sketchCanvas"))})



}


// Wait until the page is loaded before applying the main function
window.addEventListener("DOMContentLoaded", ()=>{        
main();
});

