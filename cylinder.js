Surfaces.prototype.cylinder = (point = new Point(0, 0, 0), color = '#FFFF00', size = 3, h = 5, count = 20) => {
    function circlexy(point, size, angley = 0, count = 20) {
        for (let i = 0; i < count; i++) {
            p.push(new Point(
                point.x + size * Math.sin(Math.PI * 2 * (i / count)) * Math.sin(angley / 180 * Math.PI),
                point.y + size * Math.sin(Math.PI * 2 * (i / count)) * Math.cos(angley / 180 * Math.PI),
                point.z + size * Math.cos(Math.PI * 2 * (i / count)), 
                2
            ))
        }
    }

    const p = [], e = [], poly = [];

    //точки

    for(let i = 0; i < size; i++) {
        circlexy(new Point(point.x, point.y - h, point.z), i, 90, count);
    }

    for (let i = -h; i <= h; i++) {
        circlexy(new Point(point.x, point.y + i, point.z), size, 90);
    }

    for(let i = 0; i < size; i++) {
        circlexy(new Point(point.x, point.y + h, point.z), i, 90, count);
    }

    //рёбра


    for(let i = 0; i < h * 2 + size * 2; i++){
        for(let j = 0; j < count; j++){
            e.push(new Edge(count * i + j, count * (i + 1) + j));
        }
    }

    for(let i = 0; i < p.length - 1; i++){
        if((i + 1) % count !== 0){
            e.push(new Edge(i, i + 1));
        } else {
            e.push(new Edge(i, i - count + 1));
        }
        if(i === p.length - 2){
            e.push(new Edge(p.length - 1, p.length - count));
        }
    }

    //полигоны
    for(i = 0; i < h * 2 + size * 2; i++){
        for(j = 0; j < count; j++) {
            if ((j + 1) % count !== 0) {
                poly.push(new Polygon([count * i + j, count * i + j + 1, count * (i + 1) + j + 1, count * (i + 1) + j], color));
            } else {
                poly.push(new Polygon([count * i, count * (i + 1) - 1, count * (i + 2) - 1, count * (i + 1)], color));
            }
        }
    }
    
    return new Subject(p, e, poly);
}