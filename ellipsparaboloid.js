Surfaces.prototype.ellipsparaboloid = (point = new Point(), size = 4, a = 1, b = 2, c = 1, count = 20, color = "#FF00FF") => {
    function halfellips(point, size, anglex = 0, count = 20, a, b, c) {
        for (let i = 0; i <= count; i++) {
            p.push(new Point(
                point.x + (size * Math.cos(Math.PI * 2 * (i / count / 2)) * Math.cos(anglex / 180 * Math.PI)) * a,
                point.y + (size * Math.sin(Math.PI * 2 * (i / count / 2))) * b,
                point.z + (size * Math.cos(Math.PI * 2 * (i / count / 2)) * Math.sin(anglex / 180 * Math.PI)) * c, 
                1
            ));
        }
    }

    function circlexy(point, size, angley = 0, count = 20) {
        for (let i = 0; i < count; i++) {
            p.push(new Point(
                point.x + size * Math.sin(Math.PI * 2 * (i / count)) * Math.sin(angley / 180 * Math.PI),
                point.y + size * Math.sin(Math.PI * 2 * (i / count)) * Math.cos(angley / 180 * Math.PI),
                point.z + size * Math.cos(Math.PI * 2 * (i / count)), 
                2
            ));
        }
    }

    const p = [], e = [], poly = [];

    //точки
    for(let i = 0; i < count; i++){
        halfellips(point, size, 180 * i / count, count, a, b, c);
    }

    for(let i = 0; i <= size; i++){
        circlexy(new Point(point.x, p[p.length - 1].y, point.z), i, 90, count * 2);
    }
    
    //рёбра
    for(let i = 0; i < count; i++){
        for(let j = 0; j < count; j++){
            e.push(new Edge((count + 1) * i + j, (count + 1) * i + j + 1));
        }
    }

    for(let i = 0; i <= size * 2; i++){
        for(let j = 0; j < count; j++){
            e.push(new Edge(count * (count + 1 + i) + j, count * (count + 2 + i) + j));
        }
    }

    for(let i = 0; i < count; i++){
        for (let j = 0; j < count + 1; j++){
            if ((i + 1) % (count) != 0) {
                e.push(new Edge(i * (count + 1) + j, (i + 1) * (count + 1) + j));
            } else {
                e.push(new Edge((i) * (count + 1) + j, count - j));
            }
        }
    }

    //полигоны 
    for(let i = 0; i < count; i++){
        for(let j = 0; j < count; j++){
            if ((i + 1) % (count) != 0) {
                poly.push(new Polygon([
                    i * (count + 1) + j, 
                    i * (count + 1) + j + 1,
                    (i + 1) * (count + 1) + j + 1,
                    (i + 1) * (count + 1) + j
                ], color));
            } else {
                poly.push(new Polygon([
                    i * (count + 1) + j, 
                    i * (count + 1) + j + 1,
                    count - j - 1,
                    count - j
                ], color));
            }
        }
    }

    for(let i = 0; i <= size * 2; i++) {
        for (let j = 0; j < count; j++){
            if((j + 1) % count != 0){
                poly.push(new Polygon([
                    count * (count + 1) + i * count + j, 
                    count * (count + 1) + i * count + j + 1, 
                    count * (count + 1) + (i + 1) * count + j + 1, 
                    count * (count + 1) + (i + 1) * count + j, 
                ], color));
            } else {
                poly.push(new Polygon([
                    count * (count + 1) + i * count + j, 
                    count * (count + 1) + i * count, 
                    count * (count + 1) + (i + 1) * count + j, 
                    count * (count + 1) + (i + 1) * count, 
                ], color));
            }
        }
    }

    return new Subject(p, e, poly);

}