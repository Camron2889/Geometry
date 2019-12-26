//requires: vector.js

//singleton
(function() {
    "use strict";
    
    //shortcuts
    const Vector = geometry.Vector;
    const LineSegment = geometry.LineSegment;
    
    const HitTests = {};
    
    //function borrowed from https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
    HitTests.checkSegmentSegment = function(seg1, seg2) {
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
        
        const o1 = orientation(seg0.p0, seg0.p1, seg1.p0);
        const o2 = orientation(seg0.p0, seg0.p1, seg1.p1);
        const o3 = orientation(seg1.p0, seg1.p1, seg0.p0);
        const o4 = orientation(seg1.p0, seg1.p1, seg0.p1);
        
         // General case 
        if (o1 !== o2 && o3 !== o4) 
            return true; 
      
        // Special Cases 
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
        if (o1 === 0 && onSegment(seg0.p0, seg1.p0, seg0.p1)) return true; 
      
        // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
        if (o2 === 0 && onSegment(seg0.p0, seg1.p1, seg0.p1)) return true; 
      
        // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
        if (o3 === 0 && onSegment(seg1.p0, seg0.p0, seg1.p1)) return true; 
      
         // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
        if (o4 === 0 && onSegment(seg1.p0, seg0.p1, seg1.p1)) return true; 
      
        return false; // Doesn't fall in any of the above cases
    };
    
    HitTests.segmentSegment = function(seg0, seg1) {
        const slopeInt0 = seg0.getSlopeIntercept();
        const slopeInt1 = seg1.getSlopeIntercept();
        const a = slopeInt0.slope;
        const b = slopeInt1.slope;
        const c = slopeInt0.yIntercept;
        const d = slopeInt1.yIntercept;
        
        const interceptX = (d - c) / (a - b);
        const interceptY = (a * d - b * c) / (a - b);
        
        return new Vector(interceptX, interceptY);
    };
    
    HitTests.rayCast = function(raySeg, segments) {
        const candidates = [];
        for (let i = 0; i < segments.length; i++) {
            const targetSeg = segments[i];
            
            const testSeg = targetSeg.clone();
            testSeg.translate(raySeg.p0.clone().invert());
            const angle = raySeg.getAngle();
            testSeg.rotateGlobal(-angle);
            
            const sign0 = (testSeg.p0.y >= 0) ? 1 : -1;
            const sign1 = (testSeg.p1.y >= 0) ? 1 : -1;
            
            if (sign0 !== sign1) {
                const length = testSeg.getRoot();
                if (length > 0.000001) {
                    candidates.push([length, targetSeg]);
                }
            }
        }
        
        if (candidates.length === 0) return null;
        
        let closest = candidates[0];
        for (let i = 1; i < candidates.length; i++) {
            const currentCand = candidates[i];
            if (currentCand[0] < closest[0]) {
                closest = currentCand;
            }
        }
        
        return closest;
    };
    
    HitTests.rayBounce = function(raySeg, segments) {
        const cast = HitTests.rayCast(raySeg, segments);
        if (!cast) return null;
        
        const path = raySeg.clone().normalize().scale(cast[0]);
        
        const rayAngle = raySeg.getAngle();
        const wallAngle = cast[1].getAngle();
        const reflectionAngle = 2 * wallAngle - rayAngle;
        
        const reflectionVector = new Vector(1, 0);
        reflectionVector.rotate(reflectionAngle);
        const newRay = new LineSegment(path.p1, path.p1.clone().add(reflectionVector));
        return newRay;
    };
    
    geometry.HitTests = HitTests;
})();