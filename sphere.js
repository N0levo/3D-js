Surfaces.prototype.sphere = (size = 7,  point = new Point(0, 0, 0), color = '#FF0000', animation, count = 16) => {
    function circlexz(point, size, anglex = 0, count = 20) {
        for (let i = 0; i < count; i++) {
            p.push(new Point(
                point.x + size * Math.cos(Math.PI * 2 * (i / count)) * Math.cos(anglex / 180 * Math.PI),
                point.y + size * Math.sin(Math.PI * 2 * (i / count)),
                point.z + size * Math.cos(Math.PI * 2 * (i / count)) * Math.sin(anglex / 180 * Math.PI), 
                2
            ))
        }
    }

    const p = [], e = [], poly = [];

    for(let i = 0; i < count; i++) {
        circlexz(point, size, (180 / count) * i, count);
    }

    for(let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            if(i < count - 1) {
                e.push(new Edge((count * i + j), count * (i + 1) + j));
            } else {
                if (j <= count/2){
                    e.push(new Edge((count * i + j), count / 2 - j));
                } else {
                    e.push(new Edge(count * i + j, count * 3 / 2 - j))
                }
            }
        }
    }

    for (let i = 0; i < count; i++){
        for(let j = 0; j < count - 1; j++) {
            e.push(new Edge(count * i + j, count * i + j + 1));
            if (j == count - 2) {
                e.push(new Edge(count * i + j + 1, count * i));
            }
        }
    }

    for (let i = 0; i < count - 1; i++) {
        
        const number1 = count * i;
        const number2 = count * (i + 1);
        
        for(let j = 0; j < count - 1; j++) {
            poly.push(new Polygon([number1 + j, number1 + j + 1,number2 + j + 1, number2 + j], color));
        }
        poly.push(new Polygon([number1 + count - 1 , number1, number2, number2 + count - 1], color));

        if (i == count - 2){
            for(let j = 0; j < count - 1; j++){
                if (j < count/2){
                    poly.push(new Polygon([number2 + j, number2 + j + 1, count/2 - j - 1, count / 2 - j], color));
                } else {
                    poly.push(new Polygon([number2 + j, number2 + j + 1, count * 3 / 2 - j - 1, count * 3 / 2 - j], color));
                }
            }
            poly.push(new Polygon([number2 + count - 1 , number2, count/2, count/2 + 1], color));
        }
    }

    p.push(point);

    return new Subject(p, e, poly, animation);
}