//requires: Vector

(function() {
    "use strict";
    
    //shortcuts
    const Vector = geometry.Vector;
    
    //constructor
    const LineSegment = function(p0, p1) {
        p0 = p0 || new Vector();
        p1 = p1 || new Vector();
        this.p0 = p0;
        this.p1 = p1;
    };

    const proto = LineSegment.prototype;

    //public static
    proto.set = function(x0, y0, x1, y1) {
        this.p0.x = x0;
        this.p0.y = y0;
        this.p1.x = x1;
        this.p1.y = y1;
        
        return this;
    };

    proto.clone = function(target) {
        target = target || new LineSegment();
        this.p0.clone(target.p0);
        this.p1.clone(target.p1);
        
        return target;
    };
    
    proto.translate = function(x, y) {
        this.p0.add(x, y);
        this.p1.add(x, y);
    };
    
    proto.rotateGlobal = function(t) {
        this.p0.rotate(t);
        this.p1.rotate(t);
        
        return this;
    };
    
    proto.rotateCenter = function(t) {
        const mid = this.getMidpoint();
        this.translate(-mid.x, -mid.y);
        this.rotateGlobal(t);
        this.translate(mid.x, mid.y);
        
        return this;
    };
    
    proto.getLength = function() {
        const diffX = this.p1.x - this.p0.x;
        const diffY = this.p1.y - this.p1.y;
        
        return Math.sqrt(diffX * diffX + diffY * diffY);
    };
    
    proto.getMidpoint = function() {
        const diffX = this.p1.x - this.p0.x;
        const diffY = this.p1.y - this.p1.y;
        const midX = diffX / 2 + this.p0.x;
        const midY = diffY / 2 + this.p0.y;
        
        return new Vector(midX, midY);
    };
    
    proto.getSlope = function() {
        const diffX = this.p1.x - this.p0.x;
        const diffY = this.p1.y - this.p1.y;
        
        return diffY / diffX;
    };
    
    proto.getAngle = function() {
        const diffX = this.p1.x - this.p0.x;
        const diffY = this.p1.y - this.p1.y;
        
        let angle = Math.atan(diffY / diffX);
        
        if (diffX >= 0) {
            if (diffY < 0) {
                angle += 2 * Math.PI;
            }
        } else {
            angle += Math.PI;
        }
        
        return angle;
    };
    
    proto.getSlopeIntercept = function() {
        const diffX = this.p1.x - this.p0.x;
        const diffY = this.p1.y - this.p0.y;
        const slope = diffY / diffX;
        const intercept = this.p0.y - slope * this.p0.x;
        
        return [slope, intercept];
    };
    
    proto.getIntersectionWith = function(otherSegment) {
        const seg0 = this.getSlopeIntercept();
        const seg1 = otherSegment.getSlopeIntercept();
        const a = seg0[0];
        const b = seg1[0];
        const c = seg0[1];
        const d = seg1[1];
        
        const interceptX = (d - c) / (a - b);
        const interceptY = (a * d - b * c) / (a - b);
        
        return new Vector(interceptX, interceptY);
    };
    
    //function borrowed from https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
    proto.intersectsWith = function(otherSegment) {
        
        const onSegment = function(p, q, r) {
            if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
                q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
                return true;
            };
            return false;
        };
        const orientation = function(p, q, r) {
            const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
            
            if (val === 0) return 0; //colinear
            return (val > 0) ? 1 : 2; //clock or counterclockwise
        };
        
        const o1 = orientation(this.p0, this.p1, otherSegment.p0); 
        const o2 = orientation(this.p0, this.p1, otherSegment.p1); 
        const o3 = orientation(otherSegment.p0, otherSegment.p1, this.p0); 
        const o4 = orientation(otherSegment.p0, otherSegment.p1, this.p1);
        
         // General case 
        if (o1 !== o2 && o3 !== o4) 
            return true; 
      
        // Special Cases 
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
        if (o1 === 0 && onSegment(this.p0, otherSegment.p0, this.p1)) return true; 
      
        // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
        if (o2 === 0 && onSegment(this.p0, otherSegment.p1, this.p1)) return true; 
      
        // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
        if (o3 === 0 && onSegment(otherSegment.p0, this.p0, otherSegment.p1)) return true; 
      
         // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
        if (o4 === 0 && onSegment(otherSegment.p0, this.p1, otherSegment.p1)) return true; 
      
        return false; // Doesn't fall in any of the above cases
    };

    //attach class to namespace
    geometry.LineSegment = LineSegment;
})();