

var numDivisions = 5;

var index = 0;

var points = [];
var normals = [];
textureArray = [];

//initial Parameters
var uRange_min = -14;
var uRange_max = 14;
var vRange_min = -37;
var vRange_max = 37;
var uSegments = 56;
var vSegments = 74;
var aa = .4;


var modelViewMatrix = [];
var projectionMatrix = [];

var Theta = new Array(3);

var axis =0;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
theta = [0, 0, 0];

var program;
mode = 'MESH';

var flag = false;
camera = new Camera();

bezier = function(u) {
    var b =new Array(4);
    var a = 1-u;
    b[3] = a*a*a;
    b[2] = 3*a*a*u;
    b[1] = 3*a*u*u;
    b[0] = u*u*u;
    return b;
}

breather = function(u,v,aa) {
    var w = Math.sqrt(1-aa*aa);
    var denom = aa*(Math.pow(w*cosh(aa*u),2) + Math.pow(aa*Math.sin(w*v),2));
    var x = -u + 2*(1 - aa*aa) * cosh(aa*u) * Math.sin(aa*u) / denom;
    var y = (2*w*cosh(aa*u)/denom) * (-w * Math.cos(v) * Math.cos(w*v) - Math.sin(v) * Math.sin(w*v) );
    var z = (2*w*cosh(aa*u)/denom) * (-w * Math.sin(v) * Math.cos(w*v) + Math.cos(v) * Math.sin(w*v) );

    return vec4(x, y, z, 1.0);

}


onload = function init()  {
    
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

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
    var uRange_min_Slider = document.getElementById("uRangeMin");
    uRange_min_Slider.oninput = function() {
            uRange_min = parseFloat(this.value);
            ReCalculate();
    }
    var uRange_max_Slider = document.getElementById("uRangeMax");
    uRange_max_Slider.oninput = function() {
            uRange_max = parseFloat(this.value);
            ReCalculate();

    }
    var vRange_min_Slider = document.getElementById("vRangeMin");
    vRange_min_Slider.oninput = function() {
            vRange_min = parseFloat(this.value);
            ReCalculate();

    }
    var vRange_max_Slider = document.getElementById("vRangeMax");
    vRange_max_Slider.oninput = function() {
            vRange_max = parseFloat(this.value);
            ReCalculate();


    }
    var uSegments_Slider = document.getElementById("uSlices");
    uSegments_Slider.oninput = function() {
            uSegments = parseFloat(this.value);
            ReCalculate();


    }
    var vSegments_Slider = document.getElementById("vSlices");
    vSegments_Slider.oninput = function() {
            vSegments = parseFloat(this.value);
            ReCalculate();


    }
    var aa_Slider = document.getElementById("aa_Slider");
    aa_Slider.oninput = function() {
            aa = parseFloat(this.value);
            ReCalculate()
    }

    var radioButtons = document.querySelectorAll('input[name="renderType"]');

    // Add change event listener to each radio button
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener("change", function() {
            // Check which radio button is checked
            if (this.checked) {
                // Get the value of the checked radio button
                mode = this.value;
                if (mode == 'MESH'){
                    initMesh();
                }else if (mode == 'Gouraud' || mode == 'Phong'){
                    initPerVertex();
                }else if (mode == 'Texture'){
                    initTexture();
                }

            }
        });
    });

        

    generatePoints();
    // console.log(normals);
    // console.log(normals[0][0]*normals[0][0] + normals[0][1]*normals[0][1] + normals[0][2]*normals[0][2]);
    // console.log(indices);
   
    customScale();


    if (mode == 'MESH'){
        initMesh();
    }else if (mode == 'Gouraud' || mode == 'Phong'){
        initPerVertex();
    }else if (mode == 'Texture'){
        initTexture();
    }

    world_scale_val = .8;
    var world_scale = scale4(world_scale_val,world_scale_val,world_scale_val);
    var world_translation = translate(0.0, -1.0, 0.0);
    world_matrix = mult(world_translation, world_scale);

    render();
}

var render = function(){
            gl.enable(gl.DEPTH_TEST); 
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            if(flag) theta[axis] += 0.5;
            
            modelViewMatrix = mat4();
 
            modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
            modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
            modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));
            projectionMatrix = mult( camera.camera_matrix, world_matrix);
            gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
            gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix) );

            normalMatrix = [
                vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
                vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
                vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
            ];




            if (mode == 'MESH'){
                for(var i=0; i<index; i+=4) gl.drawArrays( gl.LINE_LOOP, i, 4 );
            }else if (mode == 'Gouraud' || mode == 'Phong' || mode == 'Texture'){
                gl.uniformMatrix3fv(gl.getUniformLocation( program, "normalMatrix" ), false, flatten(normalMatrix) );
                for(var i=0; i<index; i+=4) gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
            }
            requestAnimFrame(render);
        }



function cosh(x) {
            return (Math.exp(x) + Math.exp(-x)) / 2;
        }





generatePoints = function() {

    console.log(uRange_min, uRange_max, vRange_min, vRange_max, uSegments, vSegments)
    var delta1 = (uRange_max - uRange_min) / uSegments;
    var delta2 = (vRange_max - vRange_min) / vSegments;

    for(var i=uRange_min; i<uRange_max; i+=delta1){
        for(var j=vRange_min; j<vRange_max; j+=delta2) {

        a = breather(i,j,aa);
        b = breather(i+delta1,j,aa);
        c = breather(i+delta1,j+delta2,aa);
        d = breather(i,j+delta2,aa);

        points.push(a);
        points.push(b);
        points.push(c);
        points.push(d);

        // points.push(d);
        if (i>-3 && i<2){
            normals.push(vec4(normalize(cross(subtract(d,a),subtract(b,a))),0))
            normals.push(vec4(normalize(cross(subtract(a,b),subtract(c,b))),0))
            normals.push(vec4(normalize(cross(subtract(b,c),subtract(d,c))),0))
            normals.push(vec4(normalize(cross(subtract(c,d),subtract(a,d))),0))
        }else{
            normals.push(vec4(normalize(cross(subtract(b,a),subtract(d,a))),0))
            normals.push(vec4(normalize(cross(subtract(c,b),subtract(a,b))),0))
            normals.push(vec4(normalize(cross(subtract(d,c),subtract(b,c))),0))
            normals.push(vec4(normalize(cross(subtract(a,d),subtract(c,d))),0))
        }

        textureArray.push( vec2(1,0));
        textureArray.push( vec2(1,1));
        textureArray.push( vec2(0,1));
        textureArray.push( vec2(0,0));

        index += 4;
    }
}

}



function checkPoints() {
    for(var i=0; i<points.length; i++) {
        for(var j=0; j<3; j++) {
            if(points[i][j] > 1 || points[i][j] < -1) console.log("error");
        }
    }
}

function customScale(){
    for(var i=0; i<points.length; i++) {
        for (var j = 0; j < 4; j++) {
            points[i][j] = points[i][j]/5;
            if(j == 3) points[i][j] = 1;
        }
    }
}

function initMesh(){
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function initPerVertex(){
    if (mode == 'Gouraud'){
        program = initShaders( gl, "Gouraud-vertex-shader", "Gouraud-fragment-shader" );
    }else if (mode == 'Phong'){
        console.log("phong")
        program = initShaders( gl, "Phong-vertex-shader", "Phong-fragment-shader" );
    }
    gl.useProgram( program ); 
       
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
  
    var lightPosition = vec4(0.0, 0.0, 20.0, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vec4( .2, 1.0, .2, 1.0 );
    var materialDiffuse = vec4( 0.0, 0.8, 0.0, 1.0 );
    var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
    var materialShininess = 10.0;
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition ));
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}


function initTexture(){
    // program = initShaders( gl, "texture-vertex-shader", "texture-fragment-shader" );
    program = initShaders( gl, "vertex-shader-texture", "fragment-shader-texture" );

    gl.useProgram( program ); 
       
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );


    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureArray), gl.STATIC_DRAW);
    let vTexCoordLoc = gl.getAttribLocation(program, "vTexcoord");
    gl.vertexAttribPointer(vTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoordLoc);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    let image = new Image();
    image.src = "/images/grass.png";
    image.addEventListener('load', function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);
        });
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 8, 0 );
    gl.enableVertexAttribArray( vNormal);

    
    var lightPosition = vec4(0.0, 0.0, -20, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vec4( 1.0, 1.0, .9, 1.0 );
    var materialDiffuse = vec4( 1.0, 0.8, 0.9, 1.0 );
    var materialSpecular = vec4( 1.0, 0.9, 0.8, 1.0 );
    var materialShininess = 10.0;
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));	
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition ));
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );


}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
 }

 function ReCalculate(){
    points = [];
    normals = [];
    textureArray = [];
    index = 0;
    generatePoints();
    customScale();
    if (mode == 'MESH'){
        initMesh();
    }else if (mode == 'Gouraud' || mode == 'Phong'){
        initPerVertex();
    }else if (mode == 'Texture'){
        initTexture();
    }
 }