

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
        // var proj_m = ortho(-4, 4, -4, 4, -200, 200);
        var proj_m  = perspective(this.fovy, this.aspect, this.near, this.far)
        this.camera_matrix = mult(proj_m, camera_m);
    }

}





   

