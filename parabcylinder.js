Surfaces.prototype.parabcylinder = (point = new Point(), height = 5 , width = 3, coeff = 1, color = "#FFFF00") => {
    const p =[], e = [], poly = [];

    //точки
    for(let i = 0; i <= height; i++) {
        for(let j = -width; j <= width; j+= 0.25){
            p.push(new Point(point.x + j / coeff, -(point.y + Math.pow(j, 2)), point.z + i));
        }
    }

    //рёбра
    for(let i = 0; i < height; i++){
        for(let j = 0; j <= width * 8; j++){
            e.push(new Edge((width * 8 + 1) * i + j, (width * 8 + 1) * (i + 1) + j));
        }
    }

    for(let i = 0; i < p.length - 1; i++){
        if((i + 1) % (width * 8 + 1) !== 0){
            e.push(new Edge(i, i + 1));
        }
    }

    //полигоны

    for(i = 0; i < height; i++){
        for(j = 0; j < (width * 8 + 1); j++) {
            if ((j + 1) % (width * 8 + 1) !== 0) {
                poly.push(new Polygon([(width * 8 + 1) * i + j,
                                       (width * 8 + 1) * i + j + 1, 
                                       (width * 8 + 1) * (i + 1) + j + 1, 
                                       (width * 8 + 1) * (i + 1) + j], 
                                       color));
            } 
        }
    }

    return new Subject(p, e, poly);
}