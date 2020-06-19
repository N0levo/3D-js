Surfaces.prototype.hypercylinder = (point = new Point(), width = 5, height = 6, coeff = 1, color = "#00AA33") => {
    const p =[], e = [], poly = [];

    //точки левой ветви
    for(let i = 0; i < height; i++) {
        for(let j = -width; j <= 0; j+= 0.1){
            if(Math.abs(coeff / j) < width){
                p.push(new Point(point.x + j, -(point.y + coeff/j), point.z + i));
            }
        }
    }

    //рёбра левой ветви
    const number1 = p.length / height; // <- число точек
    
    for(let i = 0; i < height - 1; i++){
        for(let j = 0; j < number1; j++){
                e.push(new Edge(i * number1 + j, (i + 1) * number1 + j));
        }
    }

    for(let i = 0; i < p.length; i++) {
        if((i + 1) % number1 != 0 ){
            e.push(new Edge(i, i + 1));
        }
    }

    //полигоны левой ветви

    for(i = 0; i < height - 1; i++){
        for(j = 0; j < number1; j++) {
            if ((j + 1) % number1 !== 0) {
                poly.push(new Polygon([number1 * i + j,
                                       number1 * i + j + 1, 
                                       number1 * (i + 1) + j + 1, 
                                       number1 * (i + 1) + j], 
                                       color));
            } 
        }
    }

    //точки правой ветви
    const halfpoints = p.length;

    for(let i = 0; i < height; i++) {
        for(let j = 0; j <= width; j+= 0.1){
            if(Math.abs(coeff / j) < 8){
                p.push(new Point(point.x + j, -(point.y + coeff/j), point.z + i));
            }
        }
    }

    const number2 = (p.length - halfpoints) / height;

    //рёбра левой ветви
    
    for(let i = 0; i < height - 1; i++){
        for(let j = 0; j < number2; j++){
               e.push(new Edge(halfpoints + i * number2 + j, halfpoints + (i + 1) * number2 + j));
        }
    }

    for(let i = halfpoints; i < p.length; i++) {
        if((i + 1) % number2 != 0 ){
           e.push(new Edge(i, i + 1));
        }
    }

    //полигоны правой ветви

    for(i = 0; i < height - 1; i++){
        for(j = 0; j < number2; j++) {
            if ((j + 1) % number2 !== 0) {
                poly.push(new Polygon([halfpoints + number2 * i + j,
                                       halfpoints + number2 * i + j + 1, 
                                       halfpoints + number2 * (i + 1) + j + 1, 
                                       halfpoints + number2 * (i + 1) + j], 
                                       color));
            } 
        }
    }

    return new Subject(p, e, poly);
}