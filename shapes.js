//requires: Polygon

(function() {
    "use strict";
    
    //shortcuts
    const Vector = geometry.Vector;
    const LineSegment = geometry.LineSegment;
    const Polygon = geometry.Polygon;
    
    //constructor
    const Shapes = {};

    Shapes.rectangle = function(x, y, w, h) {
        const verts = [];
        verts.push(new Vector(x, y));
        verts.push(new Vector(x + w, y));
        verts.push(new Vector(x + w, y + h));
        verts.push(new Vector(x, y + h));
        return new Polygon(verts);
    };
    
    Shapes.regularPolygon = function(centerX, centerY, radius, sides, angleOffset = 0) {        
        let angle = angleOffset;
        let verts = [];
        const apexAngle = Math.PI * 2 / sides;
        for (let i = 0; i < sides; i++) {
            let x = Math.cos(angle) * radius + centerX;
            let y = Math.sin(angle) * radius + centerY;
            
            verts.push(new Vector(x, y));
            
            angle += apexAngle;
        }
        
        return new Polygon(verts);
    };
    
    Shapes.circle = function(centerX, centerY, radius, targetDist, angleOffset = 0) {
        const n = -2 * radius * radius;
        const targetAngle = Math.acos((targetDist * targetDist + n) / n);
        const sides = Math.round(Math.PI * 2 / targetAngle);
        return this.regularPolygon(centerX, centerY, radius, sides, angleOffset);
    };

    //attach class to namespace
    geometry.Shapes = Shapes;
})();