

class Camera {
    constructor(){
        this.eye = vec3(0, 0.0 , 4);
        this.at = vec3(0.0, 0.0, 0.0)
        this.up = vec3(0.0, 1.0, 0.0);
        this.fovy = 60
        this.aspect = 1
        this.near = 1
        this.far = 100

        this.rotation_speed =  0.5;
        this.zoom_step = 0.1;
        this.camera_matrix = null;
        this.radius = 4;
        this.theta = 0;
        this.phi = 0;
        this.setup_camera_matrix();
        
    }

    move_camera(){
        this.eye = vec3(this.radius*Math.sin(this.theta)*Math.cos(this.phi), this.radius*Math.sin(this.theta)*Math.sin(this.phi), this.radius*Math.cos(this.theta));
        this.setup_camera_matrix();
    }
    setup_camera_matrix(){
        var camera_m =  lookAt(this.eye, this.at, this.up);
        var proj_m = perspective(this.fovy, this.aspect, this.near, this.far)
        this.camera_matrix = mult(proj_m, camera_m);
    }

}



var Texture = {};
Texture.HandleLoadedTexture2D = function( image, texture, flipY ) {
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    if ( flipY != undefined && flipY == true )
      gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.bindTexture( gl.TEXTURE_2D, null );
    return texture;
}
Texture.LoadTexture2D = function( name ) {
    var texture = gl.createTexture();
    texture.image = new Image(64,64);
    texture.image.setAttribute('crossorigin', 'anonymous');
    texture.image.onload = function () {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height = 256;
        var context = canvas.getContext( '2d' );
        context.drawImage( texture.image, 0, 0, canvas.width, canvas.height );
        Texture.HandleLoadedTexture2D( canvas, texture, true )
    }
    texture.image.src = name;
    return texture;
}



   

