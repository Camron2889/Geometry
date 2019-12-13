//requires: vector.js

//class
(function() {
    "use strict";
    
    //shortcuts
    const Vector = geometry.Vector;

    //constructor
    const LinearTransformation = function(xx = 1, xy = 0, yx = 0, yy = 1) {
        this.x = new Vector(xx, xy);
        this.y = new Vector(yx, yy);
    };
    
    const proto = LinearTransformation.prototype;
    
    proto.applyTo = function(vec) {
        const transX = this.x.x * vec.x + this.y.x * vec.y;
        const transY = this.x.y * vec.x + this.y.y * vec.y;
        vec.x = transX;
        vec.y = transY;
    };
    
    proto.rotate = function(t) {
        this.x.rotate(t);
        this.y.rotate(t);

        return this;
    };
    
    proto.scale = function(s) {
        this.x.scale(s);
        this.y.scale(s);
        
        return this;
    };
    
    proto.reset = function() {
        this.x.x = 1;
        this.x.y = 0;
        this.y.x = 0;
        this.y.y = 1;
        
        return this;
    };
    
    geometry.LinearTransformation = LinearTransformation;
})();