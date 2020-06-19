class Canvas {
    constructor ({id, width, height, WINDOW, callbacks = {}}) {
        if (id) {
            this.canvas = document.getElementById(id);
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(this.canvas);
        }
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;

        //виртуальный канвас 
        this.canvasV = document.createElement('canvas');
        this.contextV = this.canvasV.getContext('2d');
        this.canvasV.width = width;
        this.canvasV.height = height;

        this.WINDOW = WINDOW;
        this.PI2 = 2 * Math.PI;
        //callbacks
        const wheel = (callbacks.wheel instanceof Function) ? callbacks.wheel : function () {};
        const mouseup = (callbacks.mouseup instanceof Function) ? callbacks.mouseup : function () {};
        const mousedown = (callbacks.mousedown instanceof Function) ? callbacks.mousedown : function () {};
        const mousemove = (callbacks.mousemove instanceof Function) ? callbacks.mousemove : function () {};
        const mouseleave = (callbacks.mouseleave instanceof Function) ? callbacks.mouseleave : function () {};
        this.canvas.addEventListener('wheel', wheel);
        this.canvas.addEventListener('mousedown', mousedown);
        this.canvas.addEventListener('mouseup', mouseup);
        this.canvas.addEventListener('mousemove', mousemove);
        this.canvas.addEventListener('mouseleave', mouseleave);
    }

    xs(x) {
        return (x - this.WINDOW.LEFT) * (this.canvas.width / this.WINDOW.WIDTH);
    }

    ys(y) {
        return (y - this.WINDOW.BOTTOM) * (this.canvas.height / this.WINDOW.HEIGHT);
    }

    xsPolygon(x) {
        return  this.canvas.width / 2 + x * (this.canvas.width / this.WINDOW.WIDTH);
    }

    ysPolygon(y) {
        return this.canvas.height / 2 +  y * (this.canvas.height / this.WINDOW.HEIGHT);
    }

    sx(x){
        return x * this.WINDOW.WIDTH / this.canvas.width;
    }
    sy(y){
        return -y * this.WINDOW.HEIGHT / this.canvas.height;
    }


    point(x, y, color = '#f00', size = 2) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.arc(this.xsPolygon(x), this.ysPolygon(y), size, 0, this.PI2);
        this.contextV.stroke();
    }

    line(x1, y1, x2, y2, color = '#0f0', width = 2) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.moveTo(this.xsPolygon(x1), this.ysPolygon(y1));
        this.contextV.lineTo(this.xsPolygon(x2), this.ysPolygon(y2));
        this.contextV.stroke();
    }

    clear = function () {
        this.contextV.fillStyle = '#101010';
        this.contextV.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    text(x, y, text, font = '30px bold Arial', color = 'white') {
        this.contextV.fillStyle = color;
        this.contextV.font = font;
        this.contextV.fillText(text, this.xs(x), this.ys(y));
    }

    polygon(points, color = "#008800BB") {
        this.contextV.fillStyle = color;
        this.contextV.fillStroke = color;
        this.contextV.beginPath();
        this.contextV.moveTo(this.xsPolygon(points[0].x), this.ysPolygon(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.contextV.lineTo(this.xsPolygon(points[i].x), this.ysPolygon(points[i].y));
        }
        this.contextV.closePath();
        this.contextV.fill()
    }

    render() {
        this.context.drawImage(this.canvasV, 0, 0);
    }
}