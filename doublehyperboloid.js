Surfaces.prototype.doublehyperboloid = (point = new Point(), h = 2, width = 2, coeff = 1, count = 20, color = "#FF0000") => {

    function parabola(point, coeff, h, width, angle = 0){
        for(let i = -width; i <= width; i+= 0.25){
            p.push(new Point(
                point.x + i * Math.cos(angle / 180 * Math.PI),
                point.y + h + Math.pow(i, 2) * coeff,
                point.z + i * Math.sin(angle / 180 * Math.PI)
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
        parabola(point, coeff, h, width, 90 + i / count * 360);
    }

    number1 = p.length/count;

    for(let i = 0; i <= width/coeff; i++){
        circlexy(new Point(point.x, point.y + h + Math.pow(width, 2), point.z), width/coeff - i, 270, count);
    }
    
    //рёбра
    

    for(let i = 0; i < count - 1; i++){
        for(let j = 0; j < number1; j++){
            e.push(new Edge(number1 * i + j, number1 * (i + 1) + j));
        }
    }

    for(let i = 0; i < width/coeff; i++) {
        for(let j = 0; j < count; j++){
            if((i + 1) % count != 0){
                e.push(new Edge((number1 + i) * count + j, (number1 + 1 + i) * count + j ));
            }
        }
    }
    
    for(let i = 0; i < number1 * count ; i++){
        if((i + 1) % number1 !== 0){
            e.push(new Edge(i, i + 1));
        }
    }

    //полигончики
    
    for(let i = 0; i < count - 1; i++){
        for (let j = 0; j < number1 - 1; j++){
            if ((i + 1) % number1 != 0){
                poly.push(new Polygon([i * number1 + j,
                                       i * number1 + 1 + j,
                                       (i + 1) * number1 + j + 1,
                                       (i + 1) * number1 + j], 
                                       color));
            }

        }
    }

    for(let i = 0; i < p.length / count - number1 - 1; i++) {
        for(let j = 0; j < count; j++){
            if((j + 1) % count != 0){
                poly.push(new Polygon([
                    (number1 + i) * count + j, 
                    (number1 + i) * count + 1 + j,
                    (number1 + i + 1) * count + 1 + j,
                    (number1 + i + 1) * count + j
                ], color));
            } else {
                poly.push(new Polygon([
                    (number1 + i) * count + j, 
                    (number1 + i) * count,
                    (number1 + i + 1) * count,
                    (number1 + i + 1) * count + j
                ], color));
            }
        }
    }


    const halfpoints = p.length;

    //ещё точки О_0
    for(let i = 0; i < count; i++){
        parabola(point, -coeff, -h, width, 90 + i / count * 360);
    } 

    for(let i = 0; i <= width/coeff; i++){
        circlexy(new Point(point.x, point.y - h - Math.pow(width, 2), point.z), width/coeff - i, 270, count);
    }

    //ЕЩЁ РЁБРА

    for(let i = 0; i < count - 1; i++){
        for(let j = 0; j < number1; j++){
            e.push(new Edge(halfpoints + number1 * i + j, halfpoints + number1 * (i + 1) + j));
        }
    }

    for(let i = 0; i < width/coeff; i++) {
        for(let j = 0; j < count; j++){
            if((i + 1) % count != 0){
                e.push(new Edge(halfpoints + (number1 + i) * count + j, halfpoints + (number1 + 1 + i) * count + j ));
            }
        }
    }
    
    for(let i = 0; i < number1 * count; i++){
        if((i + 1) % number1 !== 0){
            e.push(new Edge(halfpoints + i, halfpoints + i + 1));
        }
    }

    // БОЛЬШЕ ПОЛИГОНОВ!! ヽ( `д´*)ノ
    for(let i = 0; i < count - 1; i++){
        for (let j = 0; j < number1 - 1; j++){
            if ((i + 1) % number1 != 0){
                poly.push(new Polygon([halfpoints + i * number1 + j,
                                       halfpoints + i * number1 + 1 + j,
                                       halfpoints + (i + 1) * number1 + j + 1,
                                       halfpoints + (i + 1) * number1 + j], 
                                       color));
            }

        }
    }

    for(let i = 0; i < (p.length - halfpoints) / count - number1 - 1; i++) {
        for(let j = 0; j < count; j++){
            if((j + 1) % count != 0){
                poly.push(new Polygon([
                    halfpoints + (number1 + i) * count + j, 
                    halfpoints + (number1 + i) * count + 1 + j,
                    halfpoints + (number1 + i + 1) * count + 1 + j,
                    halfpoints + (number1 + i + 1) * count + j
                ], color));
            } else {
                poly.push(new Polygon([
                    halfpoints + (number1 + i) * count + j, 
                    halfpoints + (number1 + i) * count,
                    halfpoints + (number1 + i + 1) * count,
                    halfpoints + (number1 + i + 1) * count + j
                ], color));
            }
        }
    }


    return new Subject(p, e, poly);
}