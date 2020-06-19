Surfaces.prototype.bublik = (size1 = 8, size2 = 9, size3 = 1, point = new Point(0, 0, 0), color = "#FFFF00", xy = 1, animation, count = 20, count2 = 15) => {
    function circlexz(point, size, anglex = 0, count = 20) {
        for (let i = 0; i < count; i++) {
            p.push(new Point(
                point.x + size * Math.cos(Math.PI * 2 * (i / count)) * Math.cos(anglex / 180 * Math.PI),
                point.y + size * Math.sin(Math.PI * 2 * (i / count)),
                point.z + size * Math.cos(Math.PI * 2 * (i / count)) * Math.sin(anglex / 180 * Math.PI), 
                2
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

    const p = [];
    const e = [];
    const poly = [];

    //основной круг
    switch (xy) {
        case 0: {
            circlexz(point, (size1 + size2)/2, 0, count);
            for(let i = 0; i < count; i++){
                circlexy(p[i], size3, 90 - 360 * i / count, count2);
            }
            break;
        }
        case 1:{
            circlexy(point, (size1 + size2)/2, 90, count);
            for(let i = 0; i < count; i++){
                circlexz(p[i], size3, (90 - 360 * i / count), count2);
            }
            break;
        }
        case 2:{
            circlexy(point, (size1 + size2)/2, 90, count);
            for(let i = 0; i < count; i++){
                circlexy(p[i], size3, 90, count2);
            }
            break;
        }
        
    }

    for(let i = 0; i < count; i++) {
        for (let j = 0; j < count2; j++) {
            if(i < count - 1) {
                e.push(new Edge((count + count2 * i + j), (count + count2 * (i + 1) + j)));
            } else {
                e.push(new Edge((count + count2 * i + j), count + j));
            }
        }  
    }
    for (let i = 0; i < count - 1; i++) {
        
        const number1 = count + count2 * i;
        const number2 = count + count2 * (i + 1);
        
        for(let j = 0; j < count2 - 1; j++) {
            poly.push(new Polygon([number1 + j, number1 + j + 1,number2 + j + 1, number2 + j], color));
        }
        poly.push(new Polygon([number1 + count2 - 1 , number1, number2, number2 + count2 - 1], color));

        if (i == count - 2){
            for(let j = 0; j < count2 - 1; j++){
                poly.push(new Polygon([number2 + j, number2 + j + 1, count + 1 + j, count + j], color));
            }
            poly.push(new Polygon([number2 + count2 - 1 , number2, count, count + count2 - 1], color));
        }
    }

    return new Subject(p, e, poly, animation);
}