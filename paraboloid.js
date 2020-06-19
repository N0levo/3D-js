Surfaces.prototype.paraboloid = (count = 20) => {
    const points = [];
    const edges = [];
    const polygons = [];
    //расставить точки
    const size = 10;
    const delta = size / count;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const x = i * delta - size / 2;
            const y = j * delta - size / 2;
            const z = x * x - y * y;
            points.push(new Point(x, y, z));
        }
    };

    // провести ребра
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }

    //провести полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], '#FF0000'));
        }
    }
    console.log(points, polygons);

    return new Subject(points, edges, polygons);
}