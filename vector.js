//namespace
this.geometry = this.geometry || {};

//class
(function() {
    "use strict";

    //constructor
    const Vector = function(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    };
    
    const proto = Vector.prototype;
    
    proto.set = function(x, y) {
        this.x = x;
        this.y = y;
        
        return this;
    }
    
    proto.rotate = function(t) {
        const cosT = Math.cos(t);
        const sinT = Math.sin(t);

        const x1 = this.x * cosT - this.y * sinT;
        const y1 = this.x * sinT + this.y * cosT;
        this.x = x1;
        this.y = y1;

        return this;
    };
    
    proto.clone = function(target) {
        target = target || new Vector();
        target.x = this.x;
        target.y = this.y;
        
        return target;
    };
    
    proto.add = function(otherV3) {
        this.x += otherV3.x;
        this.y += otherV3.y;
        
        return this;
    };
    
    proto.subtract = function(otherV3) {
        this.x -= otherV3.x;
        this.y -= otherV3.y;
        
        return this;
    };
    
    proto.scale = function(s) {
        this.x *= s;
        this.y *= s;
        
        return this;
    };
    
    proto.normalize = function() {
        const magnitude = this.getMagnitude();
        this.scale(1 / magnitude);
        return this;
    };
    
    proto.getMagnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    
    proto.getUnitVector = function() {
        return this.clone().normalize();
    };
    
    geometry.Vector = Vector;
})();