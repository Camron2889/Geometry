//requires: Vector LineSegment

(function() {
    "use strict";
    
    //shortcuts
    const Vector = geometry.Vector;
    const LineSegment = geometry.LineSegment;
    
    //constructor
    const Polygon = function(verts) {
        this.vertices = verts || [];
        this.edges = [];
        for (let i = 0; i < this.vertices.length; i++) {
            const v0 = this.vertices[i];
            const v1 = this.vertices[(i + 1) % this.vertices.length];
            this.edges.push(new LineSegment(v0, v1));
        }
    };

    const proto = Polygon.prototype;

    proto.clone = function(target) {
        target = target || new Polygon();
        target.vertices = [];
        for (let i = 0; i < this.vertices.length; i++) {
            target.vertices.push(this.vertices[i].clone());
        }
        for (let i = 0; i < target.vertices.length; i++) {
            const v0 = target.vertices[i];
            const v1 = target.vertices[(i + 1) % target.vertices.length];
            target.edges.push(new LineSegment(v0, v1));
        }
        
        return target;
    };
    
    proto.translate = function(vec) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].add(vec);
        }
        
        return this;
    };
    
    proto.scale = function(s) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].scale(s);
        }
        
        return this;
    };
    
    proto.rotate = function(t) {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].rotate(t);
        }
        
        return this;
    };
    
    proto.getMidpoint = function() {
        const midPoint = new Vector();
        for (let i = 0; i < this.vertices.length; i++) {
            midPoint.add(this.vertices[i]);
        }
        midPoint.scale(1 / this.vertices.length);
        return midPoint;
    };

    //attach class to namespace
    geometry.Polygon = Polygon;
})();