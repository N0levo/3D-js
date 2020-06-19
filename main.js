window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        P1: new Point (-5, 5, -30),// левый верхний угол
        P2: new Point(-5, -5, -30),// левый нижний угол
        P3: new Point (5, -5, -30),//правый нижний угол
        CENTER: new Point(0, 0, 0),
        CAMERA: new Point(0, 0, -30)
    }

    let canPrint = {
        points: false,
        edges: false,
        polygons: true
    };

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;

    const sur = new Surfaces;
    const canvas = new Canvas({ width: 570, height: 570, WINDOW, callbacks: { wheel, mouseup, mousedown, mouseleave, mousemove } });
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons } });

    // сцена
    const SCENE =  [
        sur.sphere(0.5 ,  new Point(0,0,0), '#FFE000'), // sun
        sur.sphere(0.05,  new Point(0, -1.2,0), '#808080', {rotateOx: WINDOW.CENTER, speed: 4}),//mercury
        sur.sphere(0.1,   new Point(0, -2  ,0), '#FF8000', {rotateOx: WINDOW.CENTER, speed: 1.5}),//venera
        sur.sphere(0.1,   new Point(0, -3.5,0), '#4241FF', {rotateOx: WINDOW.CENTER, speed: 1}),//earth
        sur.sphere(0.05,  new Point(0, -5.0,0), '#AA0000', {rotateOx: WINDOW.CENTER, speed: 0.52}),//mars
        sur.sphere(0.25,  new Point(0, -7  ,0), '#FF9000', {rotateOx: WINDOW.CENTER, speed: 0.1}),//upiter
        sur.sphere(0.2,   new Point(0, -9  ,0), '#FFA000', {rotateOx: WINDOW.CENTER, speed: 0.03}),//saturn
        sur.bublik(0.25, 0.6, 0.1, new Point(0, -9, 0), '#909090', xy = 2, {rotateOy: WINDOW.CENTER, speed: 0.03}),
        sur.sphere(0.12, new Point(0, -11,0), '#4241FF', {rotateOx: WINDOW.CENTER, speed: 0.012}),//PREPARE URANUS
        sur.sphere(0.12, new Point(0, -13,0), '#000088', {rotateOx: WINDOW.CENTER, speed: 0.0088}),//neptun*/
        //sur.bublik(3,4,1,new Point(), "#FF0000", xy = 2)
    ]; 
    SCENE.push(sur.sphere(0.05, new Point(0, -0.03, -3.8), '#808080', {rotateOy: WINDOW.CENTER, rotateOx: SCENE[3].points[SCENE[3].points.length - 1],speed: 1}));
    const LIGHT = new Light(-20, 10, -10, 1000);

    let canRotate = false;
    // каллбэки //
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_OUT : ZOOM_IN;
        graph3D.zoomMatrix(delta);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }

    /* 
    SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.transform(point))
            if(subject.animation){
                for(let key in subject.animation){
                    if (key === 'rotateOx' || key === 'rotateOy' || key === 'rotateOz'){
                        graph3D.transform(subject.animation[key]);
                    }
                }
            }
        });
    */

    //checkbox

    function printPoints(value) {
        canPrint.points = value;
    }
    function printEdges(value) {
        canPrint.edges = value;
    }
    function printPolygons(value) {
        canPrint.polygons = value;
    }

    function printAllPolygons() {
        if (canPrint.polygons) {
            const polygons = [];
            //предварительный расчёт освещённости полигона и его проекции на экран
            SCENE.forEach(subject => {
                //graph3D.calcGorner(subject, WINDOW.CAMERA);//отсечение невидимых граней
                graph3D.calcCenters(subject);
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');//расстояние до камеры
                graph3D.calcDistance(subject, LIGHT, 'lumen'); // освещённость
            });

            SCENE.forEach(subject => {
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = graph3D.getProection(subject.points[polygon.points[0]]);
                        const point2 = graph3D.getProection(subject.points[polygon.points[1]]);
                        const point3 = graph3D.getProection(subject.points[polygon.points[2]]);
                        const point4 = graph3D.getProection(subject.points[polygon.points[3]]);
                        let { r, g, b } = polygon.color;
                        const { isShadow , dark } = graph3D.calcShadow(polygon, subject, SCENE, LIGHT);
                        const lumen = (isShadow) ? dark : graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                }                
            });
            //console.log(polygons);
            // отрисовка ВСЕХ полигонов
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => 
                canvas.polygon(polygon.points, polygon.color));
        }
    }

    //cb

    function mouseup() {
        canRotate = false;
    }
    function mouseleave() {
        mouseup();
    }
    function mousedown() {
        canRotate = true;
    }

    function mousemove(event) {
        if (canRotate) {
            if (event.movementX) {
                const alpha = canvas.sx(event.movementX) * 20 / WINDOW.CAMERA.z;
                graph3D.rotateOxMatrix(-alpha);
                graph3D.transform(WINDOW.CAMERA);
                graph3D.transform(WINDOW.CENTER);
                graph3D.transform(WINDOW.P1);
                graph3D.transform(WINDOW.P2);
                graph3D.transform(WINDOW.P3);
                
            }
            if (event.movementY) {
                const alpha = canvas.sy(event.movementY) * 20 / -WINDOW.CAMERA.z;
                graph3D.rotateOyMatrix(alpha);
                graph3D.transform(WINDOW.CAMERA);
                graph3D.transform(WINDOW.CENTER);
                graph3D.transform(WINDOW.P1);
                graph3D.transform(WINDOW.P2);
                graph3D.transform(WINDOW.P3);
            }
        }
    }

    function move(direction) {
        switch (direction) {
            case 'up':    graph3D.rotateOyMatrix(-Math.PI / 90); break;
            case 'down':  graph3D.rotateOyMatrix(Math.PI / 90); break;
            case 'left':  graph3D.rotateOxMatrix(-Math.PI / 90); break;
            case 'right': graph3D.rotateOxMatrix(Math.PI / 90); break;
        }

        graph3D.transform(WINDOW.CAMERA);
        graph3D.transform(WINDOW.CENTER);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }


    function clear() {
        canvas.clear();
    }

    function printSubject(subject) {
        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edge = subject.edges[i];
                const point1 = graph3D.getProection(subject.points[edge.p1]);
                const point2 = graph3D.getProection(subject.points[edge.p2]);
                canvas.line(point1.x, point1.y, point2.x, point2.y);
            }
        }
        if (canPrint.points) {
            for (let i = 0; i < subject.points.length; i++) {
                const points = graph3D.getProection(subject.points[i]);
                canvas.point(points.x, points.y , '#f00', 2);
            }
        }
    }

    function render() {
        clear();
        printAllPolygons();
        SCENE.forEach(subject => {
            printSubject(subject);
        });
        canvas.text(-4.5, -4, `FPS: ${FPSout}`);
        canvas.render();
    }

    const interval = setInterval (() => {
       
    }, 1000);

    function animation() {
        SCENE.forEach(subject => {
            if(subject.animation){
                for(let key in subject.animation){
                    //колдунство
                    if (key === 'rotateOx' || key === 'rotateOy' || key === 'rotateOz'){
                        const {x, y, z} = subject.animation[key];
                        const xn = WINDOW.CENTER.x - x;
                        const yn = WINDOW.CENTER.y - y;
                        const zn = WINDOW.CENTER.z - z;
                        const alpha = Math.PI/180 * subject.animation.speed * 3;
                        graph3D.animateMatrix(xn, yn, zn, key, -alpha, -xn, -yn, -zn);
                        subject.points.forEach(point => graph3D.transform(point));

                    }
                }
            }
        });
    }

    setInterval(animation, 30);
    
    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new Date()).getTime();
    (function animloop() {
        //считаем фпс 
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }
        //рисуем сцену
        graph3D.calcPlaneEquatiation(); //плоскость экрана
        graph3D.calcWindowVectors(); //вычислить вектора экрана
        render();
        requestAnimFrame(animloop);
    })()
}