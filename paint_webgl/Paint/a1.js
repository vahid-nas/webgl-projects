theColor1 = vec4(1,1,0,1.0);
theColor2 = vec4(.5,1,0,1.0);
theColor3 = vec4(.5,.5,.5,1.0);
var colors1 = [
          theColor1,
          theColor1,
          theColor1
      ];

      var colors2 = [

                theColor2,
                theColor2,
                theColor2
            ];
            var colors3 = [
                      theColor3,
                      theColor3,
                      theColor3
                  ];

flatten_color1 = flatten(colors1);
flatten_color2 = flatten(colors2);
flatten_color3 = flatten(colors3);

// var vertices = new Float32Array([-.5, -.5, 0, .5, .5, -.5,-.8, -.8, -.5, 0, 0, -.5]);
// var vertices = new Float32Array([-.5, -.5,-1, 0, .5,-1, .5, -.5,-1,-.8, -.8,0, -.5, 0,0, 0, -.5,0]);

            const vertices1 = new Float32Array([-.5, -.5, 0, .5, .5, -.5]);
            const vertices2 = new Float32Array([-.8, -.8, -.5, 0, 0, -.5]);
            const vertices3 = new Float32Array([-.7, -.9, -.3, -.2, 0, -.5]);































let stopRendering = false;


var all_loaded_data;

var canvas;
var gl;

var numberOfSquares = 30;
var maxNumTriangles = 3600;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var type = "BRUSH";


let selectedColor;
let rgbArray;
theColor = vec4(0,0,0,1.0);
var colors = [
          theColor,
          theColor,
          theColor
      ];
var redraw = false;

let strokeHistory = [];
let colorHistory = [];
let undoHistory_color = [];
let redoHistory_color = [];
let undoHistory = [];
let redoHistory = [];
var undoFlag = false;
resetUndoflag = false;


var wholeVertices = [];
var wholeColors = [];



//global variables of zooming part
var cameraPosition = [0,0];
var zoomFactor = 1.0; // Initial zoom factor (1.0 means no zoom)


// Selecting Moving Part variables
rec_theColor = vec4(0,0,0,1.0);
var rec_colors = [rec_theColor,rec_theColor,rec_theColor,rec_theColor];
let rec_startX, rec_startY, rec_endX, rec_endY;
var selected_area_triangles_vertices;
var selected_area_triangles_colors;
let lastMouseX;
let lastMouseY;
var delta_x = 0;
var delta_y = 0;
var rec_last_x;
var rec_last_y;
var rec2_last_x;
var rec2_last_y;


//global variables of 3-layered
var setOf_whole_vertices = [];
var setOf_whole_colors = [];
setOf_whole_vertices =[wholeVertices,wholeVertices,wholeVertices];
setOf_whole_colors= [wholeColors,wholeColors,wholeColors];
var Layers_stack = [2,1,0];
var selectedLayer = 0;

var flag_move_mode = false;



window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    const canvas_rect = canvas.getBoundingClientRect();
    console.log("rect",canvas_rect);
    console.log("rectleft",canvas_rect.left);

    // saveArrayToFile();

    document.addEventListener('click', function(event) {
      const clickedElement = event.target;

      // Check if the clicked element is a button and not the excluded one
    if (clickedElement.tagName === 'BUTTON' && clickedElement !== zoomButton && clickedElement !== loadButton && clickedElement !== drawLoadedButton && clickedElement !== moveButton && clickedElement !== copyButton && clickedElement !== eraseButton) {
      cameraPosition = [0,0];
      zoomFactor = 1.0;
      buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
      render();
        }
      });

      saveButton = document.getElementById('saveButton');
      saveButton.addEventListener('click', function() {

        undoHistory = [];
        undoHistory_color = [];
        setOf_whole_vertices[selectedLayer] = wholeVertices;
        setOf_whole_colors[selectedLayer] = wholeColors;
        saveArrayToFile([setOf_whole_vertices[0],setOf_whole_vertices[1],setOf_whole_vertices[2],setOf_whole_colors[0],setOf_whole_colors[1],setOf_whole_colors[2]],index);


          });

      loadButton = document.getElementById('loadButton');
      loadButton.addEventListener('click', function() {

          // loadData();
          loadFile();

          // undoFlag = true;
          console.log("setOf_whole_vertices",setOf_whole_vertices);
          // buffersDefinition(gl,vBuffer,cBuffer,setOf_whole_vertices[0],setOf_whole_colors[0]);
          // render();

      });

      drawLoadedButton = document.getElementById('drawLoadedButton');
      drawLoadedButton.addEventListener('click', function() {

          undoFlag = true;
          setOf_whole_vertices[0] = all_loaded_data[0];
          setOf_whole_vertices[1] = all_loaded_data[1];
          setOf_whole_vertices[2] = all_loaded_data[2];
          setOf_whole_colors[0] = all_loaded_data[3];
          setOf_whole_colors[1] = all_loaded_data[4];
          setOf_whole_colors[2] = all_loaded_data[5];

          gl.clearColor( 1, 1,1, 1.0 );


          buffersDefinition(gl,vBuffer,cBuffer,setOf_whole_vertices[0],setOf_whole_colors[0]);
          render();
          // render();

      });


    document.getElementById('selectLayer').addEventListener('change', function() {

      undoHistory = [];
      undoHistory_color = [];
      setOf_whole_vertices[selectedLayer] = wholeVertices;
      setOf_whole_colors[selectedLayer] = wholeColors;
      selectedLayer = parseInt(this.value);
      Layers_stack = Layers_stack.filter(item => item != selectedLayer);
      Layers_stack.push(selectedLayer);
      wholeVertices = setOf_whole_vertices[selectedLayer];
      wholeColors = setOf_whole_colors[selectedLayer];
      undoFlag = true;
      buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
      render();
    });


    undoButton = document.getElementById('undoButton');
    undoButton.addEventListener('click', function() {
      if (resetUndoflag) {
        undoHistory.length = 0;
      }
        if(undoHistory.length > 0){
          undoFlag = true;
          gl.clearColor(1, 1,1, 1.0 );

          data = undoHistory.pop();
          data_color = undoHistory_color.pop();
          redoHistory.push(data);
          redoHistory_color.push(data_color);

          update_whole_vertices_and_colors();
          buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
        }

      });

    redoButton = document.getElementById('redoButton');
    redoButton.addEventListener('click', function() {
          if(redoHistory.length > 0){
            undoFlag = true;
            gl.clearColor( 1, 1,1, 1.0 );

            data = redoHistory.pop();
            data_color = redoHistory_color.pop();
            undoHistory.push(data);
            undoHistory_color.push(data_color);

            update_whole_vertices_and_colors();
            buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
          }
        });

    eraseButton = document.getElementById('eraseButton');
    eraseButton.addEventListener('click', function(){
      type= "ERASE"
      resetUndoflag =true;
      stopRendering = false;
      redoHistory = [];
      redoHistory_color = [];
      redoHistory.forEach(subArray => subArray.splice(0, subArray.length));
      redoHistory_color.forEach(subArray => subArray.splice(0, subArray.length));
      undoFlag = false;
      buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
      undoFlag = true;
      buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
      render();
    });


    brushButton = document.getElementById('brushButton');
    brushButton.addEventListener('click', function(){
      type= "BRUSH";
      stopRendering = false;
      resetUndoflag = false;
      // vBuffer = gl.createBuffer();
      // cBuffer = gl.createBuffer();
      buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
      if (wholeVertices.length>0) {
        undoFlag = true;
      }
      buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
      render();

    });


    zoomButton = document.getElementById('zoomButton');
    zoomButton.addEventListener('click', function(){

      undoFlag = true;
      type = "ZOOM"
    });


    selectButton = document.getElementById('selectButton');
    selectButton.addEventListener('click', function() {
      type = "SELECT";
      // undoFlag = true;
      stopRendering = true;

        });

    moveButton = document.getElementById('moveButton');
    moveButton.addEventListener('click', function() {
        type = "MOVE";
        // undoFlag = true;
        var selected_area_triangles = extractSelectedData(rec_startX, rec_startY, rec_endX, rec_endY);
        selected_area_triangles_vertices = new Float32Array(selected_area_triangles[0]);
        selected_area_triangles_colors = new Float32Array(selected_area_triangles[1]);
        });


    copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', function() {
        type = "COPY";
        // undoFlag = true;
        var selected_area_triangles = extractSelectedData(rec_startX, rec_startY, rec_endX, rec_endY);
        selected_area_triangles_vertices = new Float32Array(selected_area_triangles[0]);
        selected_area_triangles_colors = new Float32Array(selected_area_triangles[1]);
        });

    document.getElementById('colorPicker').addEventListener('change', function() {
      selectedColor = this.value;
      rgbArray = hexToRgb(selectedColor);
      theColor = vec4(rgbArray['r']/255,rgbArray['g']/255,rgbArray['b']/255,1.0);
      colors = [
          theColor,
          theColor,
          theColor
      ];
    });

    canvas.addEventListener("mousedown", function(event){
      redraw = true;
      strokeHistory = [];
      colorHistory = [];

      //Selecting Moving Part
      delta_x = 0;
      delta_y = 0;
      lastMouseX = 2*(event.clientX - canvas_rect.left)/canvas.width-1;
      lastMouseY = 2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1;
      if (type == "SELECT") {
        rec_startX = 2*(event.clientX - canvas_rect.left)/canvas.width-1;
        rec_startY = 2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1;
      }
    });

    canvas.addEventListener("mouseup", function(event){
      redraw = false;
      if (type == "BRUSH") {
        undoHistory.push(strokeHistory);
        undoHistory_color.push(colorHistory);
        update_whole_vertices_and_colors();
      }


      //Selecting and Moving Part
      if(type=="SELECT"){
        rec_endX = 2*(event.clientX - canvas_rect.left)/canvas.width-1;
        rec_endY = 2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1;

      }
      modify_x_y();
      if (type == "MOVE" || type == "COPY") {
        if(rec_startX<rec_endX){
          rec2_last_x = rec_startX;
        }else{
          rec2_last_x = rec_endX;
        }
        if(rec_startY>rec_endY){
          rec2_last_y = rec_startY;
        }else{
          rec2_last_y = rec_endY;
        }
        t_vec_x = rec2_last_x - rec_last_x;
        t_vec_y = rec2_last_y - rec_last_y;
        update_all_after_move(t_vec_x,t_vec_y);

        buffersDefinition_static(gl,wholeVertices,wholeColors);
      }


    });
    canvas.addEventListener("mousemove", function(event){
      if (type=="BRUSH") {
        if(redraw) {
          redoHistory =[];
          redoHistory_color = [];
          gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
          console.log("brushleft",canvas_rect.left);
          var t = vec2(2*(event.clientX - canvas_rect.left)/canvas.width-1,
          2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1);
          selecet_triangle = find_triangle(30,t);
          strokeHistory.push(selecet_triangle);
          colorHistory.push(colors);
          gl.bufferSubData(gl.ARRAY_BUFFER, 24*index, flatten(selecet_triangle));
          gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 48*index, flatten(colors));
          index++;
      }
      }
      else if (type == "ZOOM") {
        if (redraw) {
          var rect = canvas.getBoundingClientRect();
          var mouseX = (event.clientX ) - rect.left;
          var mouseY = (event.clientY ) - rect.top;
          var canvasX = (mouseX / canvas.width) * 2 - 1;
          var canvasY = 1 - (mouseY / canvas.height) * 2;
          cameraPosition = vec2(canvasX, canvasY);
          buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
          render();
        }

      }
      else if (type == "ERASE") {
        if(redraw) {
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        var t = vec2(2*(event.clientX - canvas_rect.left)/canvas.width-1,
        2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1);
        selecet_triangle = find_triangle(30,t);
        findPatternIndices(selecet_triangle);

        undoFlag = true;

        buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
        render();
      }
      }
      else if (type == "SELECT") {
        if(redraw) {
          rec_endX = 2*(event.clientX - canvas_rect.left)/canvas.width-1;
          rec_endY = 2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1;
          buffersDefinition_static(gl,wholeVertices,wholeColors);


          if(rec_startX<rec_endX){
            rec_last_x = rec_startX;
          }else{
            rec_last_x = rec_endX;
          }
          if(rec_startY>rec_endY){
            rec_last_y = rec_startY;
          }else{
            rec_last_y = rec_endY;
          }
          drawSelectionRectangle(rec_startX, rec_startY, rec_endX, rec_endY);
      }
    }
      else if (type == "MOVE" || type == "COPY") {
        if (redraw) {
          if (typeof lastMouseX !== 'undefined' && typeof lastMouseY !== 'undefined') {
              delta_x = (2*(event.clientX - canvas_rect.left)/canvas.width-1) - lastMouseX;
              delta_y = (2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1) - lastMouseY;

              }
          lastMouseX = 2*(event.clientX - canvas_rect.left)/canvas.width-1;
          lastMouseY = 2*(canvas.height-(event.clientY - canvas_rect.top))/canvas.height-1;
          buffersDefinition_static(gl,wholeVertices,wholeColors);
          update_triangles_of_selected_area(delta_x,delta_y);
          draw_selected_area_triangles();
          rec2_last_x = rec_startX;
          rec2_last_y = rec_startY;
          drawSelectionRectangle(rec_startX,rec_startY,rec_endX,rec_endY);
        }
      }
    } );

    canvas.addEventListener("wheel", function(event) {
        if (event.deltaY < 0) {
            zoomIn(); // Zoom in when scrolling up
        } else {
            zoomOut(); // Zoom out when scrolling down
        }
    });

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1, 1,1, 1.0 );


    //
    //  Load shaders and initialize attribute buffers
    //

    var vBuffer = gl.createBuffer();
    var cBuffer = gl.createBuffer();

    // draw(gl,vBuffer,cBuffer);

    buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
    render();

}

// function customBufferDef(gl,vBuffer,cBuffer,undoHistoryFlattened,undoHistoryFlattened_color){
//   var program = initShaders( gl, "vertex-shader", "fragment-shader" );
//   gl.useProgram( program );
//   // var vBuffer = gl.createBuffer();
//   gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
//   gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
//   gl.bufferSubData(gl.ARRAY_BUFFER, 0, undoHistoryFlattened);
//
//   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
//   gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
//   gl.bufferSubData(gl.ARRAY_BUFFER, 0, undoHistoryFlattened_color);
//
//   var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
//   var viewMatrix = updateViewMatrix();
//   gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
//   gl.drawArrays( gl.TRIANGLES, 0, index*3);
//
//
// }

function buffersDefinition(gl,vBuffer,cBuffer,undoHistoryFlattened,undoHistoryFlattened_color) {
  if (undoFlag) {
    // gl.deleteBuffer(vBuffer);
    console.log("setOf_whole_vertices[0]",setOf_whole_vertices[Layers_stack[0]]);
    console.log("setOf_whole_vertices[1]",setOf_whole_vertices[Layers_stack[1]]);
    console.log("setOf_whole_vertices[2]",setOf_whole_vertices[Layers_stack[2]]);
    console.log("setOf_whole_colors[0]",setOf_whole_colors[Layers_stack[0]]);
    console.log("setOf_whole_colors[1]",setOf_whole_colors[Layers_stack[1]]);
    console.log("setOf_whole_colors[2]",setOf_whole_colors[Layers_stack[2]]);
    var all_layers_vertices = new Float32Array([...setOf_whole_vertices[Layers_stack[0]], ...setOf_whole_vertices[Layers_stack[1]], ...undoHistoryFlattened]);
    var all_layers_colors = new Float32Array([...setOf_whole_colors[Layers_stack[0]], ...setOf_whole_colors[Layers_stack[1]], ...undoHistoryFlattened_color]);
    console.log("second mode of render vertices",all_layers_vertices);
    console.log("second mode of render colors",all_layers_colors);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    // var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER,3* 8*maxNumVertices, gl.STATIC_DRAW );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, all_layers_vertices);

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,3* 16*maxNumVertices, gl.STATIC_DRAW );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, all_layers_colors);

    var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    var viewMatrix = updateViewMatrix();
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
  }
  else {
    // gl.deleteBuffer(vBuffer);
    console.log("initial mode of render");

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    // var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER,3* 8*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,3* 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    var viewMatrix = updateViewMatrix();
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    render();
  }


}


function buffersDefinition_static(gl,undoHistoryFlattened,undoHistoryFlattened_color) {
  // gl.clearColor( .9, .9,.9, 1.0 );

  //
  var all_layers_vertices = new Float32Array([...setOf_whole_vertices[Layers_stack[0]], ...setOf_whole_vertices[Layers_stack[1]], ...undoHistoryFlattened]);
  var all_layers_colors = new Float32Array([...setOf_whole_colors[Layers_stack[0]], ...setOf_whole_colors[Layers_stack[1]], ...undoHistoryFlattened_color]);
    gl.deleteBuffer(vBuffer);
    gl.deleteBuffer(cBuffer);
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, all_layers_vertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, all_layers_colors, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //
    var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    var viewMatrix = updateViewMatrix();
    gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

    // gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, all_layers_vertices.length);
}

function render() {
    if (stopRendering) {
      return; // Exit the render loop
    }
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, index*3);
    // if (type == 'SELECT') {
    //   gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw rectangle as a line loop
    // }
    window.requestAnimFrame(render);

}


function find_triangle(n_squares,t){
  square_length = 2/n_squares;
  i = Math.floor(t[1]/square_length)+15;
  j = Math.floor(t[0]/square_length)+15;
  square_bottom = (i)*square_length-1;
  square_left = (j)*square_length-1;
  square_top = (i+1) * square_length-1;
  square_right = (j+1) * square_length-1;


  //selecting the TRIANGLES
  selected_triangle = indexOfMin([Math.abs(square_bottom-t[1]),Math.abs(square_left-t[0]),Math.abs(square_top-t[1]),Math.abs(square_right-t[0])]);
  var p1;
  var p2;
  p3 = vec2((j)*square_length+(square_length/2) -1 ,(i)*square_length+(square_length/2) -1);

  switch (selected_triangle) {
    case 0:
      p1 = vec2 ((j)*square_length -1,(i)*square_length -1) ;
      p2 = vec2 ((j+1)*square_length -1 ,(i)*square_length -1) ;
      break;
    case 1:
      p1= vec2 ((j)*square_length -1 , (i+1)*square_length -1) ;
      p2= vec2 ((j)*square_length -1,(i)*square_length -1);
      break;
  case 2:
    p1= vec2 ((j)*square_length -1 ,(i+1) * square_length -1) ;
    p2= vec2 ((j+1)*square_length -1 ,(i+1) * square_length -1) ;
    break;
  case 3:
    p1= vec2 ((j+1) * square_length -1 ,(i+1)*square_length -1) ;
    p2= vec2 ((j+1) * square_length -1,(i)*square_length -1) ;
    break;

}
var vertices = [
    p1,
    p2,
    p3
];

return vertices;
}



function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


function findPatternIndices(selected_triangle) {
    var triangleVertices = flatten(selected_triangle);
    var vertice_indices = [];
    var color_indices = [];

    for (let i = 0; i < wholeVertices.length - 6; i+=6) {
        if (wholeVertices[i] == triangleVertices[0] && wholeVertices[i + 1] == triangleVertices[1] && wholeVertices[i + 2] == triangleVertices[2] && wholeVertices[i + 3] == triangleVertices[3] && wholeVertices[i + 4] == triangleVertices[4] && wholeVertices[i + 5] == triangleVertices[5]) {
            vertice_indices.push(i,i+1,i+2,i+3,i+4,i+5);
            x = 2*i
            color_indices.push(x,x+1,x+2,x+3,x+4,x+5,x+6,x+7,x+8,x+9,x+10,x+11);
        }
    }

    var i = 0
    while(i < undoHistory.length){
      var j = (undoHistory[i].length) - 1;
      while(j >= 0){
        temp = flatten(undoHistory[i][j]);
        if (temp[0] == triangleVertices[0] && temp[1] == triangleVertices[1] && temp[2] == triangleVertices[2] && temp[3] == triangleVertices[3] && temp[4] == triangleVertices[4] && temp[5] == triangleVertices[5]){
          undoHistory[i] = undoHistory[i].filter((_, index) => index !== j);
          undoHistory_color[i] = undoHistory_color[i].filter((_, index) => index !== j);
        }
        j--;
      }
      i++;
    }
    wholeVertices = wholeVertices.filter((_, index) => !vertice_indices.includes(index));
    wholeColors = wholeColors.filter((_, index) => !color_indices.includes(index));
    // return([new_wholeVertices,new_wholeColors])
}




function update_whole_vertices_and_colors(){
  var flattened_data = []
  for (var k = 0; k < undoHistory.length; k++) {
    for(i=0;i<undoHistory[k].length;i++){
      flattened_data = flattened_data.concat(flatten(undoHistory[k][i]))
    }
  }
  let concatenatedArray = [];
  for (let i = 0; i < flattened_data.length; i++) {
    concatenatedArray = concatenatedArray.concat(Array.from(flattened_data[i]));
  }
  wholeVertices = new Float32Array(concatenatedArray);



  var flattened_data_color = []
  for (var k = 0; k < undoHistory_color.length; k++) {
    for(i=0;i<undoHistory_color[k].length;i++){
      flattened_data_color = flattened_data_color.concat(flatten(undoHistory_color[k][i]))
    }
  }
  let concatenatedArray_color = [];
  for (let i = 0; i < flattened_data_color.length; i++) {
    concatenatedArray_color = concatenatedArray_color.concat(Array.from(flattened_data_color[i]));
  }
  wholeColors = new Float32Array(concatenatedArray_color);

}


function zoomIn(vBuffer,cBuffer) {
    zoomFactor *= 1.1; // Increase zoom factor (adjust the factor as needed)
    var vBuffer = gl.createBuffer();
    var cBuffer = gl.createBuffer();
    buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
    render();
}

// Function to zoom out
function zoomOut(vBuffer,cBuffer) {
    zoomFactor /= 1.1; // Decrease zoom factor (adjust the factor as needed)
    var vBuffer = gl.createBuffer();
    var cBuffer = gl.createBuffer();
    buffersDefinition(gl,vBuffer,cBuffer,wholeVertices,wholeColors);
    render();
}


function updateViewMatrix() {
    var viewMatrix = mat4();

    // Apply the zoom factor to the view matrix (scale by 1/zoomFactor)
    var ort=ortho( -1 / zoomFactor, 1 / zoomFactor, -1 / zoomFactor, 1 / zoomFactor, -1, 1);
    viewMatrix = mult(viewMatrix,ort);
    // Translate the view to the camera position
    translateArray = vec3(cameraPosition[0],cameraPosition[1],0);

    t = translate(translateArray[0],translateArray[1],translateArray[2]);
    viewMatrix = mult(viewMatrix,t);

    return viewMatrix;
}



function drawSelectionRectangle(rec_startX, rec_startY, rec_endX, rec_endY){
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram(program); // Use fixed-function pipeline for drawing the rectangle

  const rectVertices = new Float32Array([
      rec_startX, rec_endY, // Bottom-left corner
      rec_endX, rec_endY, // Bottom-right corner
      rec_endX, rec_startY, // Top-right corner
      rec_startX, rec_startY, // Top-left corner
  ]);

  const rectBuffer = gl.createBuffer();
  const rectColorBuffer =gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, rectVertices, gl.STATIC_DRAW);

  const vPosition = gl.getAttribLocation(gl.getParameter(gl.CURRENT_PROGRAM), "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);


  gl.bindBuffer( gl.ARRAY_BUFFER, rectColorBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(rec_colors), gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
  var viewMatrix = updateViewMatrix();
  gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

  gl.lineWidth(2.0); // Set line width
  gl.drawArrays(gl.LINE_LOOP, 0, 4); // Draw rectangle as a line loop



  gl.deleteBuffer(rectBuffer); // Clean up
  gl.deleteBuffer(rectColorBuffer); // Clean up
}

function extractSelectedData(x1, y1, x2, y2) {
  var vertice_indices = [];
  var color_indices = [];

  for (var i = 0; i < wholeVertices.length; i+=6) {
    if (wholeVertices[i] < x2 && wholeVertices[i+2] < x2 && wholeVertices[i+4] < x2 && wholeVertices[i] > x1 && wholeVertices[i+2] > x1 && wholeVertices[i+4] > x1 && wholeVertices[i+1] > y2 && wholeVertices[i+3] > y2 && wholeVertices[i+5] > y2 && wholeVertices[i+1] < y1 && wholeVertices[i+3] < y1 && wholeVertices[i+5] < y1) {
      vertice_indices.push(i,i+1,i+2,i+3,i+4,i+5);
      x = 2*i
      color_indices.push(x,x+1,x+2,x+3,x+4,x+5,x+6,x+7,x+8,x+9,x+10,x+11);
    }
  }

  var   selected_triangles_list_vertices = getElementsAtIndex(wholeVertices,vertice_indices);
  var   selected_triangles_list_colors = getElementsAtIndex(wholeColors,color_indices);

  if (type == "MOVE") {
    wholeVertices = wholeVertices.filter((_, index) => !vertice_indices.includes(index));
    wholeColors = wholeColors.filter((_, index) => !color_indices.includes(index));
  }

  return [selected_triangles_list_vertices,selected_triangles_list_colors];
}


function update_triangles_of_selected_area(delta_x,delta_y){
  for (var i = 0; i < selected_area_triangles_vertices.length; i+=2) {
    selected_area_triangles_vertices[i] = selected_area_triangles_vertices[i] + delta_x;
    selected_area_triangles_vertices[i+1] = selected_area_triangles_vertices[i+1] + delta_y;
  }
  rec_startX += delta_x;
  rec_endX += delta_x;
  rec_startY += delta_y;
  rec_endY += delta_y;
}

function draw_selected_area_triangles(){
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // Load the data into the GPU

  var areaBuffer = gl.createBuffer();

  gl.bindBuffer( gl.ARRAY_BUFFER, areaBuffer );
  gl.bufferData( gl.ARRAY_BUFFER,selected_area_triangles_vertices, gl.STATIC_DRAW );

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
  // gl.clear( gl.COLOR_BUFFER_BIT );


  var areaColorBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, areaColorBuffer );
  gl.bufferData( gl.ARRAY_BUFFER,selected_area_triangles_colors, gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  var viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
  var viewMatrix = updateViewMatrix();
  gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, selected_area_triangles_vertices.length );

  gl.deleteBuffer(areaBuffer); // Clean up
  gl.deleteBuffer(areaColorBuffer); // Clean up
}

function getElementsAtIndex(arr, indices) {
  return indices.map(index => arr[index]);
}


function  modify_x_y(){
  if(rec_startX > rec_endX){
    var temp = rec_startX;
    rec_startX = rec_endX;
    rec_endX = temp;
  }
  if (rec_startY < rec_endY) {
    var temp = rec_startY;
    rec_startY = rec_endY;
    rec_endY =temp;
  }
}


function update_all_after_move(delta_x_sum,delta_y_sum){
  let each_unit = 2/numberOfSquares;

  var transform_x = delta_x_sum - ((Math.floor(delta_x_sum/each_unit))*each_unit);
  var transform_y = delta_y_sum - ((Math.floor(delta_y_sum/each_unit))*each_unit);



  for (var i = 0; i < selected_area_triangles_vertices.length; i+= 2) {
    selected_area_triangles_vertices[i] = selected_area_triangles_vertices[i] - transform_x;
    selected_area_triangles_vertices[i+1] = selected_area_triangles_vertices[i+1] - transform_y;
  }

  wholeVertices = new Float32Array([...wholeVertices, ...selected_area_triangles_vertices]);
  wholeColors = new Float32Array([...wholeColors, ...selected_area_triangles_colors]);
  selected_area_triangles_vertices = [];
  selected_area_triangles_colors = [];
}


function draw(gl,vBuffer,cBuffer){
  gl.clearColor( 1, 1,1, 1.0 );
  // console.log("layer",wholeVertices);
  for (var i = 0; i < 3; i++) {
    var newVertices;
    var newFlattenColor;
    if (selectedLayer == Layers_stack[i]) {
      newVertices = wholeVertices;
      newFlattenColor = wholeColors;
      if (flag_move_mode) {
        continue;
      }
      buffersDefinition(gl,vBuffer,cBuffer,newVertices,newFlattenColor);
      render();

    }
    else{
      var newVertices = setOf_whole_vertices[Layers_stack[i]];
      var newFlattenColor = setOf_whole_colors[Layers_stack[i]];
      buffersDefinition_static(gl,newVertices,newFlattenColor);
    }


  }

}




// Load function




function saveArrayToFile(float32Arrays,intNumber) {
    // const float32Arrays = [new Float32Array([1.1, 2.2, 3.3]), new Float32Array([4.4, 5.5, 6.6])];
    // const intNumber = 42;
    const dataArray = [float32Arrays, intNumber];

    const jsonData = JSON.stringify(dataArray);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function loadFile() {
    const fileInput = document.getElementById('fileInput');


    fileInput.addEventListener('change', function() {
      const file = fileInput.files[0];

      if (file) {
          const reader = new FileReader();

          reader.onload = function(e) {
            const jsonData = e.target.result;
            const loadedArray = JSON.parse(jsonData);

            const loadedFloat32Arrays = loadedArray[0].map(obj => {
                const values = Object.values(obj);
                return new Float32Array(values);
            });

            all_loaded_data = loadedFloat32Arrays;
            index = parseInt(loadedArray[1]);

            console.log('Loaded Float32Arrays:', loadedFloat32Arrays);
            console.log('Loaded Int Number:', index);
          }

          reader.readAsText(file);
      }
    });
    fileInput.click();
}
