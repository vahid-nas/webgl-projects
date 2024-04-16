
var Demo = false;

var keyFrameDeltaSpeed = 0.01;
var animation_timer = 0;
var animate = false;
var time = 0;
var normalsArray = [];
textureArray = [];

var index = 0;
points = [];
var numDivisions = 3;

var texture_program;
var light_program;
var canvas;
var gl;
var program;
var picking_program;

var world_matrix
var projectionMatrix; 
var modelViewMatrix;
var current_obj_Id = 0;
var selected_obj_Id = 0;
var instanceMatrix;

var modelViewMatrixLoc;

var mouseX;
var mouseY;
isClicked = false;
camera = new Camera();


var vertices = [
    //front
    vec4(-0.3 , 0.3, 0.5 , 1.0),
    vec4(-0.3, -0.3, 0.5 , 1.0),
    vec4(0.3 , -0.3 , 0.5 , 1.0),
    vec4(0.3 , 0.3, 0.5 , 1.0),

    //right
    vec4(0.5 , 0.3, 0.3 , 1.0),
    vec4(0.5, -0.3, 0.3 , 1.0),
    vec4(0.5, -0.3 , -0.3 , 1.0),
    vec4(0.5 , 0.3, -0.3 , 1.0),

    //left
    vec4(-0.5 , 0.3, -0.3 , 1.0),
    vec4(-0.5, -0.3 , -0.3 , 1.0),
    vec4(-0.5, -0.3, 0.3 , 1.0),
    vec4(-0.5 , 0.3, 0.3 , 1.0),

    //top
    vec4(-0.3, 0.5, -0.3 , 1.0),
    vec4(-0.3 , 0.5, 0.3 , 1.0),
    vec4(0.3 , 0.5, 0.3 , 1.0),
    vec4(0.3 , 0.5 , -0.3 , 1.0),

    //bottom
    vec4(-0.3 , -0.5, 0.3 , 1.0),
    vec4(-0.3, -0.5, -0.3 , 1.0),
    vec4(0.3 , -0.5 , -0.3 , 1.0),
    vec4(0.3 , -0.5, 0.3 , 1.0),

    //back
    vec4(0.3 , 0.3, -0.5 , 1.0),
    vec4(0.3 , -0.3 , -0.5 , 1.0),
    vec4(-0.3, -0.3, -0.5 , 1.0),
    vec4(-0.3 , 0.3, -0.5 , 1.0),

    //front to bottm
    vec4(-0.3, -0.3, 0.5 , 1.0),
    vec4(-0.3 , -0.5, 0.3 , 1.0),
    vec4(0.3 , -0.5, 0.3 , 1.0),
    vec4(0.3 , -0.3, 0.5 , 1.0),

    //left to bottom
    vec4(-0.5, -0.3, 0.3 , 1.0),
    vec4(-0.5, -0.3 , -0.3 , 1.0),
    vec4(-0.3, -0.5, -0.3 , 1.0),
    vec4(-0.3 , -0.5, 0.3 , 1.0),

    //intersection triangle of fron to bottom and left to bottom
    vec4(-0.3 , -0.5, 0.3 , 1.0),
    vec4(-0.3, -0.3, 0.5 , 1.0),
    vec4(-0.5, -0.3 , 0.3 , 1.0),
    vec4(-0.5, -0.3 , 0.3 , 1.0),

    //right to bottom
    vec4(0.5, -0.3, 0.3 , 1.0),
    vec4(0.3 , -0.5, 0.3 , 1.0),
    vec4(0.3 , -0.5, -0.3 , 1.0),
    vec4(0.5 , -0.3, -0.3 , 1.0),

    //intersection triangle of fron to bottom and right to bottom
    vec4(0.3 , -0.3, 0.5 , 1.0),
    vec4(0.3 , -0.5, 0.3 , 1.0),
    vec4(0.5, -0.3, 0.3 , 1.0),
    vec4(0.5 , -0.3, 0.3 , 1.0),

    //front to top
    vec4(-0.3 , 0.5, 0.3 , 1.0),
    vec4(-0.3, 0.3, 0.5 , 1.0),
    vec4(0.3 , 0.3, 0.5 , 1.0),
    vec4(0.3 , 0.5, 0.3 , 1.0),
    
    
    

    //intersection triangle of front to top and left to top
    vec4(-0.3, 0.5, 0.3 , 1.0),
    vec4(-0.5, 0.3, 0.3 , 1.0),
    vec4(-0.3 , 0.3, 0.5 , 1.0),
    vec4(-0.5, 0.3, 0.3 , 1.0),

    //left to top
    vec4(-0.3 , 0.5, -0.3 , 1.0),
    vec4(-0.5, 0.3, -0.3 , 1.0),
    vec4(-0.5, 0.3, 0.3 , 1.0),
    vec4(-0.3, 0.5, 0.3 , 1.0),

    //intersection triangle of front to top and right to top
    vec4(0.5, 0.3, 0.3 , 1.0),
    vec4(0.3 , 0.5, 0.3 , 1.0),
    vec4(0.3 , 0.3, 0.5 , 1.0),
    vec4(0.5, 0.3, 0.3 , 1.0),

    //right to top
    vec4(0.5, 0.3, 0.3 , 1.0),
    vec4(0.5 , 0.3, -0.3 , 1.0),
    vec4(0.3 , 0.5, -0.3 , 1.0),
    vec4(0.3 , 0.5, 0.3 , 1.0),

    //back to top
    vec4(-0.3, 0.3, -0.5 , 1.0),
    vec4(-0.3 , 0.5, -0.3 , 1.0),
    vec4(0.3 , 0.5, -0.3 , 1.0),
    vec4(0.3 , 0.3, -0.5 , 1.0),

    //back to bottom
    vec4(0.3 , -0.3, -0.5 , 1.0),
    vec4(0.3 , -0.5, -0.3 , 1.0),
    vec4(-0.3 , -0.5, -0.3 , 1.0),
    vec4(-0.3, -0.3, -0.5 , 1.0),

    //back to left
    vec4(-0.3, 0.3, -0.5 , 1.0),
    vec4(-0.3 , -0.3, -0.5 , 1.0),
    vec4(-0.5, -0.3, -0.3 , 1.0),
    vec4(-0.5, 0.3, -0.3 , 1.0),

    //back to right
    vec4(0.5, 0.3, -0.3 , 1.0),
    vec4(0.5, -0.3, -0.3 , 1.0),
    vec4(0.3 , -0.3, -0.5 , 1.0),
    vec4(0.3, 0.3, -0.5 , 1.0),

    //front to left
    vec4(-0.5, 0.3, 0.3 , 1.0),
    vec4(-0.5, -0.3, 0.3 , 1.0),
    vec4(-0.3, -0.3, 0.5 , 1.0),
    vec4(-0.3, 0.3, 0.5 , 1.0),

    //front to right
    vec4(0.3, 0.3, 0.5 , 1.0),
    vec4(0.3, -0.3, 0.5 , 1.0),
    vec4(0.5, -0.3, 0.3 , 1.0),
    vec4(0.5, 0.3, 0.3 , 1.0),

    //intersection triangle of right to bottom and back to right and back to bottom
    vec4(0.3, -0.5, -0.3 , 1.0),
    vec4(0.3, -0.3, -0.5 , 1.0),
    vec4(0.5, -0.3, -0.3 , 1.0),
    vec4(0.5, -0.3, -0.3 , 1.0),


    //intersection triangle of back to right and back to top and right to top
    vec4(0.3, 0.3, -0.5 , 1.0),
    vec4(0.3, 0.5, -0.3 , 1.0),
    vec4(0.5, 0.3, -0.3 , 1.0),
    vec4(0.5, 0.3, -0.3 , 1.0),

    //intersection triangle of back to left and back to top and left to top
    vec4(-0.3, 0.5, -0.3 , 1.0),
    vec4(-0.3, 0.3, -0.5 , 1.0),
    vec4(-0.5, 0.3, -0.3 , 1.0),
    vec4(-0.5, 0.3, -0.3 , 1.0),

    //intersection triangle of left to bottom and back to left and back to bottom
    vec4(-0.3, -0.3, -0.5 , 1.0),
    vec4(-0.3, -0.5, -0.3 , 1.0),
    vec4(-0.5, -0.3, -0.3 , 1.0),
    vec4(-0.5, -0.3, -0.3 , 1.0)







];
var number_of_pre =26 ;

var time_degree =0;
var test_x = 0;
var test_y = 0;
var test_z = 0;

var torsoId = 0;


var leg11Id = 1;
var leg12Id = 2;
var leg13Id = 3;
var leg14Id = 4;
var leg15Id = 5;
var leg16Id = 6;
var leg17Id = 7;
var leg18Id = 8;
var leg21Id = 9;
var leg22Id = 10;
var leg23Id = 11;
var leg24Id = 12;
var leg25Id = 13;
var leg26Id = 14;
var leg27Id = 15;
var leg28Id = 16;
var leg31Id = 17;
var leg32Id = 18;
var leg33Id = 19;
var leg34Id = 20;
var leg35Id = 21;
var leg36Id = 22;
var leg37Id = 23;
var leg38Id = 24;


var list_of_node_Ids = [torsoId, leg11Id, leg12Id, leg13Id, leg14Id, leg15Id, leg16Id, leg17Id, leg18Id, leg21Id, leg22Id, leg23Id, leg24Id, leg25Id, leg26Id, leg27Id, leg28Id, leg31Id, leg32Id, leg33Id, leg34Id, leg35Id, leg36Id, leg37Id, leg38Id];

var torsoHeight = 3;
var torsoWidth = 3;

var leg1Height = 2.2;
var leg2Height = 1.6;
var leg3Height = 1.2;


var leg1Width = .5;
var leg2Width = .4;
var leg3Width = .3;


var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var numNodes = 25;
var numAngles = 26;
var angle = 0;

var theta = [0, 180, 180, 180, 180, 180, 180, 180, 180, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var phi = [0, -45,0,45,-90,90,-135,180,135,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var gamma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var keyFrameStack = [];


var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

var uniform_id_list = [];
for (var obj_id of list_of_node_Ids){
    uniform_id =  vec4(
        ((obj_id+1)/50),0,0,0)
    uniform_id_list.push(uniform_id);
}
//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
    case torsoId:
    
        m = translate(0, test_x, 0);
        m = mult(m, rotate(gamma[torsoId], 0, 0, 1));
        m = mult(m, rotate(phi[torsoId], 0, 1, 0));
        m = mult(m, rotate(theta[torsoId], 1, 0, 0 ));
        figure[torsoId] = createNode( m, torso, null, leg11Id );
        break;

    
    case leg11Id:
        m = translate(-(torsoWidth/3+leg1Width/2), 2*leg1Width, (torsoWidth/2) - leg1Width);
        m = mult(m, rotate(gamma[leg11Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg11Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg11Id], 1, 0, 0));
        figure[leg11Id] = createNode( m, leg1, leg12Id, leg21Id );
        break;
    
    case leg12Id:
        m = translate(-(0),2*leg1Width, (torsoWidth/2) - leg1Width);
        m = mult(m, rotate(gamma[leg12Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg12Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg12Id], 1, 0, 0));
        figure[leg12Id] = createNode( m, leg1, leg13Id, leg22Id );
        break;

    case leg13Id:
        m = translate((leg1Width/2)+torsoWidth/3,2*leg1Width,(torsoWidth/2) - leg1Width);
        m = mult(m, rotate(gamma[leg13Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg13Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg13Id], 1, 0, 0));
        figure[leg13Id] = createNode( m, leg1, leg14Id, leg23Id );
        break;

    case leg14Id:
        m = translate(-(torsoWidth/3+leg1Width/2),2*leg1Width, 0);
        m = mult(m, rotate(gamma[leg14Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg14Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg14Id], 1, 0, 0));
        figure[leg14Id] = createNode( m, leg1, leg15Id, leg24Id );
        break;

    case leg15Id:
        m = translate((leg1Width/2)+torsoWidth/3,2*leg1Width,0);
        m = mult(m, rotate(gamma[leg15Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg15Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg15Id], 1, 0, 0));
        figure[leg15Id] = createNode( m, leg1, leg16Id, leg25Id );
        break;

    case leg16Id:
        m = translate(-(torsoWidth/3+leg1Width/2), 2*leg1Width, -(torsoWidth/2) + leg1Width);
        m = mult(m, rotate(gamma[leg16Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg16Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg16Id], 1, 0, 0));
        figure[leg16Id] = createNode( m, leg1, leg17Id, leg26Id );
        break;

    case leg17Id:
        m = translate(-(0),2*leg1Width, -(torsoWidth/2) + leg1Width);
        m = mult(m, rotate(gamma[leg17Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg17Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg17Id], 1, 0, 0));
        figure[leg17Id] = createNode( m, leg1, leg18Id, leg27Id );
        break;

    case leg18Id:
        m = translate((leg1Width/2)+torsoWidth/3,2*leg1Width,-(torsoWidth/2) + leg1Width);
        m = mult(m, rotate(gamma[leg18Id], 0, 0, 1));
        m = mult(m, rotate(phi[leg18Id], 0, 1, 0));
        m = mult(m, rotate(theta[leg18Id], 1, 0, 0));
        figure[leg18Id] = createNode( m, leg1, null, leg28Id );
        break;

    case leg21Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg21Id], 1, 0, 0));
        figure[leg21Id] = createNode( m, leg2, null, leg31Id );
        break;

    case leg22Id:
        m = translate(0,(leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg22Id], 1, 0, 0));
        figure[leg22Id] = createNode( m, leg2, null, leg32Id );
        break;
    
    case leg23Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg23Id], 1, 0, 0));
        figure[leg23Id] = createNode( m, leg2, null, leg33Id );
        break;

    case leg24Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg24Id], 1, 0, 0));
        figure[leg24Id] = createNode( m, leg2, null, leg34Id );
        break;

    case leg25Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg25Id], 1, 0, 0));
        figure[leg25Id] = createNode( m, leg2, null, leg35Id );
        break;
    
    case leg26Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg26Id], 1, 0, 0));
        figure[leg26Id] = createNode( m, leg2, null, leg36Id );
        break;

    case leg27Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg27Id], 1, 0, 0));
        figure[leg27Id] = createNode( m, leg2, null, leg37Id );
        break;

    case leg28Id:
        m = translate(0, (leg2Height)*4/3, 0);
        m = mult(m, rotate(theta[leg28Id], 1, 0, 0));
        figure[leg28Id] = createNode( m, leg2, null, leg38Id );
        break;

    case leg31Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg31Id], 1, 0, 0));
        figure[leg31Id] = createNode( m, leg3, null, null );
        break;

    case leg32Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg32Id], 1, 0, 0));
        figure[leg32Id] = createNode( m, leg3, null, null );
        break;

    case leg33Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg33Id], 1, 0, 0));
        figure[leg33Id] = createNode( m, leg3, null, null );
        break;

    case leg34Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg34Id], 1, 0, 0));
        figure[leg34Id] = createNode( m, leg3, null, null );
        break;

    case leg35Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg35Id], 1, 0, 0));
        figure[leg35Id] = createNode( m, leg3, null, null );
        break;

    case leg36Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg36Id], 1, 0, 0));
        figure[leg36Id] = createNode( m, leg3, null, null );
        break;

    case leg37Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg37Id], 1, 0, 0));
        figure[leg37Id] = createNode( m, leg3, null, null );
        break;

    case leg38Id:
        m = translate(0, (leg3Height)*4/3, 0);
        m = mult(m, rotate(theta[leg38Id], 1, 0, 0));
        figure[leg38Id] = createNode( m, leg3, null, null );
        break;

    }

}

function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelViewMatrix);
   current_obj_Id = Id;
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

function torso() {
    var current_program = gl.getParameter(gl.CURRENT_PROGRAM)
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));



    var modelViewMatrixLoc = gl.getUniformLocation(current_program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    if ( current_program == picking_program){
        var uniform_id_loc = gl.getUniformLocation(current_program, "u_id")
        gl.uniform4f(uniform_id_loc, uniform_id_list[current_obj_Id][3], uniform_id_list[current_obj_Id][2], uniform_id_list[current_obj_Id][1], uniform_id_list[current_obj_Id][0]);
    }
    for(var i =0; i<number_of_pre; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leg1() {
    var current_program = gl.getParameter(gl.CURRENT_PROGRAM)

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*leg1Height, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( leg1Width, leg1Height, leg1Width));
    var modelViewMatrixLoc = gl.getUniformLocation(current_program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    if ( current_program == picking_program){
        var uniform_id_loc = gl.getUniformLocation(current_program, "u_id")
        gl.uniform4f(uniform_id_loc, uniform_id_list[current_obj_Id][3], uniform_id_list[current_obj_Id][2], uniform_id_list[current_obj_Id][1], uniform_id_list[current_obj_Id][0]);
    }
    for(var i =0; i<number_of_pre; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}

function leg2() {
    var current_program = gl.getParameter(gl.CURRENT_PROGRAM)

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*leg2Height, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( leg2Width, leg2Height, leg2Width));
    var modelViewMatrixLoc = gl.getUniformLocation(current_program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    if ( current_program == picking_program){
        var uniform_id_loc = gl.getUniformLocation(current_program, "u_id")
        gl.uniform4f(uniform_id_loc, uniform_id_list[current_obj_Id][3], uniform_id_list[current_obj_Id][2], uniform_id_list[current_obj_Id][1], uniform_id_list[current_obj_Id][0]);
    }

    for(var i =0; i<number_of_pre; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);   
    }

function leg3() {
    var current_program = gl.getParameter(gl.CURRENT_PROGRAM)

    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*leg3Height, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( leg3Width, leg3Height, leg3Width));

    var modelViewMatrixLoc = gl.getUniformLocation(current_program, "modelViewMatrix");

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        if ( current_program == picking_program){
        var uniform_id_loc = gl.getUniformLocation(current_program, "u_id")
        gl.uniform4f(uniform_id_loc, uniform_id_list[current_obj_Id][3], uniform_id_list[current_obj_Id][2], uniform_id_list[current_obj_Id][1], uniform_id_list[current_obj_Id][0]);
    }

    for(var i =0; i<number_of_pre; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);  
    }


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     pointsArray.push(vertices[b]); 
     pointsArray.push(vertices[c]);     
     pointsArray.push(vertices[d]);  
  
     var t2 = subtract(vertices[b], vertices[a]);
     var t1 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);

     normalsArray.push(normal);    
     normalsArray.push(normal);    
     normalsArray.push(normal);    
     normalsArray.push(normal);

     textureArray.push( vec2(0,1));
     textureArray.push( vec2(0,0));
     textureArray.push( vec2(1,0));
     textureArray.push( vec2(1,1));
}



window.onload = function init() {
    var initialKeyFrame = {};
    initialKeyFrame.theta = [];
    initialKeyFrame.phi = [];
    initialKeyFrame.gamma = [];
    initialKeyFrame.time = time;
    initialKeyFrame.deltaSpeed = keyFrameDeltaSpeed;
    for (var i=0; i<numNodes; i++){
        initialKeyFrame.theta.push(theta[i]);
        initialKeyFrame.phi.push(phi[i]);
        initialKeyFrame.gamma.push(gamma[i]);
    }
    keyFrameStack.push(initialKeyFrame);

    canvas = document.getElementById( "gl-canvas" );
    // const img = document.getElementById("ocean");
    // ctx.drawImage(img, 10, 10);
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
 
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);


    
    
    //
    //  Load shaders and initialize attribute buffers
    //
    cube();
    // createData();

    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();

    picking_shader_init();
    // init_backround_shader();
    // light_shader_init();
    // program = light_program;
    init_texture_shader();
    program = texture_program;



    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
    



    canvas.addEventListener("mousedown", function(event){
        canvasRect = event.target.getBoundingClientRect();
        mouseX = event.x - canvasRect.left;
        mouseY = 512 -(event.y - canvasRect.top);
        isClicked = true;

      });
  
    document.getElementById("thetaAngle").onchange = function() {
        theta[selected_obj_Id] = event.srcElement.value;
        initNodes(selected_obj_Id);
    };

    document.getElementById("phiAngle").onchange = function() {
         phi[selected_obj_Id] = event.srcElement.value;
         initNodes(selected_obj_Id);
    };

    document.getElementById("gammaAngle").onchange = function() {
         gamma[selected_obj_Id] =  event.srcElement.value;
         initNodes(selected_obj_Id);
    };

    // Camera Settings
    var camera_Y = document.getElementById("thetaSlider");
        camera_Y.oninput = function() {
            camera.theta = this.value *  Math.PI/180.0
            camera.move_camera();
            modelViewMatrix =  mult( camera.camera_matrix, world_matrix);
            // modelViewMatrix =  mult( camera.camera_matrix, modelViewMatrix);

    }
    var camera_X = document.getElementById("phiSlider");
        camera_X.oninput = function() {
            camera.phi = this.value *  Math.PI/180.0
            camera.move_camera();
            modelViewMatrix =  mult( camera.camera_matrix, world_matrix);
            // modelViewMatrix =  mult( camera.camera_matrix, modelViewMatrix);

    }
    var radius_Slider = document.getElementById("radiusSlider");
    radius_Slider.oninput = function() {
            camera.radius = this.value;
            camera.move_camera();
            modelViewMatrix =  mult( camera.camera_matrix, world_matrix);
            // modelViewMatrix =  mult( camera.camera_matrix, modelViewMatrix);

    }
    var add_keyframe_button = document.getElementById("add_keyframe_button");
        add_keyframe_button.onclick = function() {
            time += 1;
            var keyFrame = {};
            keyFrame.theta = [];
            keyFrame.phi = [];
            keyFrame.gamma = [];
            keyFrame.time = time;
            keyFrame.deltaSpeed = keyFrameDeltaSpeed;
            for (var i=0; i<numNodes; i++){
                keyFrame.theta.push(theta[i]);
                keyFrame.phi.push(phi[i]);
                keyFrame.gamma.push(gamma[i]);
            }

            keyFrameStack.push(keyFrame);

    }

    var animate_button = document.getElementById("animate_button");
        animate_button.onclick = function() {

            animate = true;
    }

    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function() {


      saveArrayToFile(keyFrameStack,index);


        });

    var loadButton = document.getElementById('loadButton');
    loadButton.addEventListener('click', function() {

        loadFile();


    });

    var speed_slider = document.getElementById("speed_change");
    document.getElementById("animation_speed").onchange = function() {
        speed_slider.innerHTML = event.srcElement.value;
        keyFrameDeltaSpeed = parseInt(event.srcElement.value) *5 / 10000;

    }

    var radioButtons = document.querySelectorAll('input[name="renderType"]');

    // Add change event listener to each radio button
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener("change", function() {
            // Check which radio button is checked
            if (this.checked) {
                // Get the value of the checked radio button
                if (this.value == 'light'){
                    light_shader_init();
                    program = light_program;
                    
                }
                else if (this.value == 'texture'){
                    init_texture_shader();
                    program = texture_program;
                }

                // Perform actions based on the selected value

                // You can add your custom logic here
            }
        });
    });


    document.getElementById("DemoButton").onclick = function() {
        if(Demo == false){
            Demo = true;
        }else{
            Demo = false;
        }
    }



    // for(i=0; i<numNodes; i++) initNodes(i);  // According to the changes that are done using the sliders, the nodes are initialized.
    let subset = list_of_node_Ids.slice(0, 26);
    for (let id of subset){
        initNodes(id); 
    }


    world_scale_val = 0.2;
    var world_scale = scale4(world_scale_val,world_scale_val,world_scale_val);
    var world_translation = translate(0.0, -1.0, 0.0);
    world_matrix = mult(world_translation, world_scale);
    modelViewMatrix =  mult( camera.camera_matrix, world_matrix);

    render();
}


var render = function() {
        updateWindow();
        Animate();
        CustomAnimate();
        requestAnimFrame(render);
}





function toRadians (angle) {
    return angle * (Math.PI / 180);
  }



function light_shader_init(){
    light_program = initShaders(gl, "vertex-shader-light", "fragment-shader-light");
    gl.useProgram(light_program);
    // Setup light
    let lightPosition = vec4(-0, -8.0, 4.0, 0.0 );
    let lightAmbient = vec4(0.5, 0.25, 0.25, 1.0 );
    let lightDiffuse = vec4( 1.5, 1.5, 1.5, 1.0 );
    let lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    // Setup material properties
    let materialAmbient = vec4( 0.8, 0.0, 0.0, 1.0 );
    let materialDiffuse = vec4( 0.5, 0.0, 0.0, 1.0);
    let materialSpecular = vec4( 0.6 , 0.23, 0.0, 1.0 );
    let materialShininess = 300.0;
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    // Buffer data
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    let vPositionLoc = gl.getAttribLocation( light_program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );
    // Buffer Normals
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    let vNormalLoc = gl.getAttribLocation( light_program, "vNormal" );
    gl.vertexAttribPointer( vNormalLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormalLoc );
    // Send Uniforms
    gl.uniform4fv(gl.getUniformLocation(light_program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(light_program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(light_program, "specularProduct"), flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(light_program, "lightPosition"), flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(light_program, "shininess"),materialShininess);


}


function Animate(){
    if(Demo == true){
    time_degree += 3;
    test_x += Math.abs(Math.sin(toRadians(time_degree))/50);
    phi[0] -= 0.2;
    for(i=1; i<9; i++) theta[i] -= (Math.sin(toRadians(time_degree))/(1/2));
    for(i=9; i<17; i++) theta[i] -= (Math.cos(toRadians(time_degree))/(1/2));
    for(i=17; i<25; i++) theta[i] -= (Math.cos(toRadians(time_degree))/(1/2));
    for(i=0; i<numNodes; i++) initNodes(i);
    }
}

function CustomAnimate(){
    if (animate){
        if (keyFrameStack.length > 1){
            let keyFrame1 = keyFrameStack[0];
            let keyFrame2 = keyFrameStack[1];
            // let temp_time = keyFrame1.time;
            let theta1 = keyFrame1.theta;
            let theta2 = keyFrame2.theta;
            let phi1 = keyFrame1.phi;
            let phi2 = keyFrame2.phi;
            let gamma1 = keyFrame1.gamma;
            let gamma2 = keyFrame2.gamma;
            for (var i=0; i<numNodes; i++){
                theta[i] = parseInt(theta1[i]) + (parseInt(theta2[i]) - parseInt(theta1[i])) * animation_timer;
                phi[i] = parseInt(phi1[i]) + (parseInt(phi2[i]) - parseInt(phi1[i])) * animation_timer;             
                gamma[i] = parseInt(gamma1[i]) + (parseInt(gamma2[i]) - parseInt(gamma1[i])) * animation_timer;
            }
            // theta = add(theta1, multiply_scalar(subtract(theta2,theta1),animation_timer));
            // phi = add(phi1, multiply_scalar(subtract(phi2,phi1),animation_timer));
            // gamma = add(gamma1, multiply_scalar(subtract(gamma2,gamma1),animation_timer));

            animation_timer += keyFrame2.deltaSpeed;
            if ((keyFrame1.time + animation_timer)  > keyFrame2.time){
                keyFrameStack.shift();
                animation_timer = 0;
                // theta = keyFrame2.theta;
            }
            for(i=0; i<numNodes; i++) initNodes(i);

        }
        else{
            animate = false;
        }
    }
}



function picking_shader_init(){
    picking_program = initShaders(gl, "pick-vertex-shader", "pick-fragment-shader");
    gl.useProgram(picking_program);
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPositionLoc = gl.getAttribLocation( picking_program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );
} 


function updateWindow() {

    gl.useProgram(picking_program);
    gl.clearColor(0 , 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    traverse(torsoId);
    select_with_mouse();

    // init_backround_shader();
    // gl.clear( gl.DEPTH_BUFFER_BIT );
    // gl.enable( gl.DEPTH_TEST );

    
    gl.useProgram(program);
    gl.clearColor(0.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    traverse(torsoId);

}




function select_with_mouse(){
    if (isClicked){

        var idout = document.getElementById("idout");

        const data = new Uint8Array(4)
        gl.readPixels(
            mouseX,            // x
            mouseY,            // y
            1,                 // width
            1,                 // height
            gl.RGBA,           // format
            gl.UNSIGNED_BYTE,  // type
            data);             
        
        var obj_id = getid(data[0], data[1], data[2], data[3]);
        obj_id = Math.floor(obj_id/5) -1;
        isClicked = false;
        idout.innerHTML = obj_id;
        selected_obj_Id = obj_id;
    }
}



const pow24 = Math.pow(2, 24)
const pow16 = Math.pow(2, 16)
const pow8= Math.pow(2, 8)
// var selectedObj = null;
var obj_previous_color = null;
const selection_color = vec4(1,0.749,0,1);
var canvasRect;
function getid(r,g,b,a) {
  
    return ( r * pow24
           + g * pow16
           + b * pow8
           + a );
  };



function cube()
{
    for(var i=0; i<26; i++) quad(i*4, i*4+1, i*4+2, i*4+3);
    // quad( 0, 1, 2, 3 );
    // quad( 4, 5, 6, 7 );
    // quad( 8, 9, 10, 11 );
    // quad( 12, 13, 14, 15 );
    // quad( 16, 17, 18, 19 );
    // quad( 20, 21, 22, 23 );
    // quad( 24, 25, 26, 27 );
    // quad( 28, 29, 30, 31 );
    // quad( 32, 33, 34, 35 );
    // quad( 36, 37, 38, 39 );
    // quad( 40, 41, 42, 43 );
    // quad( 44, 45, 46, 47 );
    // quad( 48, 49, 50, 51 );
    // quad( 52, 53, 54, 55 );
    // quad( 56, 57, 58, 59 );
    // quad( 60, 61, 62, 63 );
    // quad( 64, 65, 66, 67 );
    // quad( 68, 69, 70, 71 );
    // quad( 72, 73, 74, 75 );
    // quad( 76, 77, 78, 79 );
    // quad( 80, 81, 82, 83 );
    // quad( 84, 85, 86, 87 );
    // quad( 88, 89, 90, 91 );
    // quad( 92, 93, 94, 95 );
    // quad( 96, 97, 98, 99 );
    // quad( 100, 101, 102, 103 );

}


function multiply_scalar(vector, scalar){
    var result = [];
    for (var i=0; i<vector.length; i++){
        result.push(vector[i]*scalar);
    }
    return result;
}



function saveArrayToFile(keyFrameStack_data,intNumber) {
    // const float32Arrays = [new Float32Array([1.1, 2.2, 3.3]), new Float32Array([4.4, 5.5, 6.6])];
    // const intNumber = 42;
    const dataArray = [keyFrameStack_data, intNumber];

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

            const loadedKeyFrameStack = loadedArray[0].map(obj => {
                const values = Object.values(obj);
                const temp = {};
                temp.theta = values[0];
                temp.phi = values[1];
                temp.gamma = values[2];
                temp.time = values[3];
                temp.deltaSpeed = values[4];
                return temp;
            });

            keyFrameStack = loadedKeyFrameStack;
            index = parseInt(loadedArray[1]);


          }

          reader.readAsText(file);
      }
    });
    fileInput.click();
}


function init_texture_shader(){
    texture_program = initShaders(gl, "vertex-shader-texture", "fragment-shader-texture");
    gl.useProgram(texture_program);
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    let vPositionLoc = gl.getAttribLocation( texture_program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureArray), gl.STATIC_DRAW);
    let vTexCoordLoc = gl.getAttribLocation(texture_program, "vTexcoord");
    gl.vertexAttribPointer(vTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoordLoc);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 255, 255, 255]));
    let image = new Image();
    image.src = "/images/oct5.png";
    image.addEventListener('load', function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);
        });
}



function init_backround_shader(){
    background_Program = initShaders(gl, "background-shader-vs", "background-shader-fs");
    bufRect = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, bufRect );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ -1, -1, 1, -1, 1, 1, -1, 1 ] ), gl.STATIC_DRAW );

    textureObj = Texture.LoadTexture2D( "ocean.png" );



    gl.disable( gl.DEPTH_TEST );

    var texUnit = 1;
    gl.activeTexture( gl.TEXTURE0 + texUnit );
    gl.bindTexture( gl.TEXTURE_2D, textureObj );
    var tex_loc = gl.getUniformLocation( background_Program, "u_texture" );
    gl.useProgram( progBG );
    gl.uniform1i( tex_loc, texUnit );
    
    var v_attr_inx = gl.getAttribLocation( background_Program, "inPos" );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufRect );
    gl.vertexAttribPointer( v_attr_inx, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( v_attr_inx );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.disableVertexAttribArray( v_attr_inx );  
}