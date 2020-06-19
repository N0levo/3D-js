class Graph3D {
    constructor({WINDOW}) {
        this.WINDOW = WINDOW;
        this.math = new Math3D();
    }
    xS(point) {
        const zS = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        const x0 = this.WINDOW.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zS - z0) + x0;
    }
    yS(point) {
        const zS = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        const y0 = this.WINDOW.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zS - z0) + y0;
    }

    zoomMatrix(delta) {
        this.math.transformMatrix([this.math.zoomMatrix(delta)]);
    }

    moveMatrix(sx, sy, sz) {
        this.math.transformMatrix([this.math.moveMatrix(sx, sy, sz)]);
    }

    rotateOxMatrix(alpha) {
        this.math.transformMatrix([this.math.rotateOxMatrix(alpha)]);
    }

    rotateOyMatrix(alpha) {
        this.math.transformMatrix([this.math.rotateOyMatrix(alpha)]);
    }

    rotateOzMatrix(alpha) {
        this.math.transformMatrix([this.math.rotateOzMatrix(alpha)]);
    }

    transform(point){
        this.math.transform(point);
    }

    animateMatrix(x1, y1, z1, key, alpha, x2, y2, z2) {
        this.math.transformMatrix ([
            this.math.moveMatrix(x1, y1, z1),
            this.math[`${key}Matrix`](alpha),
            this.math.moveMatrix(x2, y2, z2)
        ]);
    }

    //посчитать центры всех полигонов объекта
    calcCenters(subject) {
        for (let i = 0; i < subject.polygons.length; i++) {
            const polygon = subject.polygons[i];
            const points = polygon.points;
            let x = 0, y = 0, z = 0;
            for (let j = 0; j < points.length; j++) {
                x += subject.points[points[j]].x;
                y += subject.points[points[j]].y;
                z += subject.points[points[j]].z;
            }
            polygon.center.x = x / points.length;
            polygon.center.y = y / points.length;
            polygon.center.z = z / points.length;
        }
    }

    calcDistance(subject, endPoint, name) {
        for (let i = 0; i < subject.polygons.length; i++) {
            if(subject.polygons[i].visible) {
                subject.polygons[i][name] = Math.sqrt(
                    Math.pow((endPoint.x - subject.polygons[i].center.x), 2) + 
                    Math.pow((endPoint.y - subject.polygons[i].center.y), 2) +
                    Math.pow((endPoint.z - subject.polygons[i].center.z), 2)
                );
            }
        }
    }

    calcIllumination(distance, lumen) {
        let illum = (distance) ? lumen / (distance * distance) : 1;
        //console.log(illum);
        return (illum > 1) ? 1 : illum;
    }

    calcShadow(polygon, subject, SCENE, LIGHT) {

        const M1 = polygon.center;
        const s = this.math.calcVector(M1, LIGHT);

        for(let i = 0; i < SCENE.length; i++) {
            if(subject.id != SCENE[i].id){
                for (let j = 0; j < SCENE[i].polygons.length; j++) {
                    const polygon2 = SCENE[i].polygons[j];
                    if(polygon2.visible){
                        const M0 = polygon2.center;
    
                        if (M1.x === M0.x && M1.y === M0.y && M1.z === M0.z) {
                            continue;
                        }
        
                        if (polygon2.lumen > polygon.lumen) {
                            continue;
                        }
        
                        const dark = this.math.calcVectorModule(this.math.vectorProd(this.math.calcVector(M0, M1), s)) 
                        / this.math.calcVectorModule(s);
                        if(dark < 0.5) {
                            return {
                                isShadow: true,
                                dark: dark / 10
                            }
                        }
                    }  
                }
            }   
        }

        return {
            isShadow: false,
            dark: 1
        }
    }

    calcGorner(subject, endPoint){
        const viewVector = this.math.calcVector(endPoint, new Point(0, 0, 0));
        const perpendicular = Math.cos(Math.PI / 2);
        for (let i = 0; i < subject.polygons.length; i++){
            const points = subject.polygons[i].points;
            const vector1 = this.math.calcVector(subject.points[points[0]], subject.points[points[1]]);
            const vector2 = this.math.calcVector(subject.points[points[0]], subject.points[points[2]]);
            const vector3 = this.math.vectorProd(vector1, vector2);
            subject.polygons[i].visible = this.math.calcGorner(viewVector, vector3) <= perpendicular;
        }
    }

    calcPlaneEquatiation () {
        this.math.calcPlaneEquatiation(this.WINDOW.CAMERA,  this.WINDOW.CENTER);
    }

    getProection(point) {
        const M = this.math.getProection(point);
        const P2M = this.math.calcVector(this.WINDOW.P2, M);
        const cosa = this.math.calcGorner(this.P1P2, M);
        const cosb = this.math.calcGorner(this.P2P3, M);
        const module = this.math.calcVectorModule(P2M);
        return {
            x: cosa * module,
            y: cosb * module
        }
    }

    calcWindowVectors() {
        this.P1P2 = this.math.calcVector(this.WINDOW.P2, this.WINDOW.P1);
        this.P2P3 = this.math.calcVector(this.WINDOW.P3, this.WINDOW.P2);
    }
}