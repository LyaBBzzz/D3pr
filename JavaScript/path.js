function createPathN() {
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    //центр
    const cx = width / 2;
    const cy = height / 2;

    //парамы цветка
    const petalRadius = 100;    
    const flowerRadius = 100;  
    const arcAngle = 240;       
    const stepsPerArc = 60;

    const points = []; //массив для хранения точек пути

    //создание 3 лепестктв
    for (let p = 0; p < 3; p++) {
        const baseAngle = p * 120;
        const angle = baseAngle * Math.PI / 180;

        const pcx = cx + flowerRadius * Math.cos(angle);
        const pcy = cy + flowerRadius * Math.sin(angle);

        const startAngle = baseAngle - arcAngle / 2;

        for (let i = 0; i <= stepsPerArc; i++) {
            const theta = (startAngle + i * arcAngle / stepsPerArc) * Math.PI / 180;
            const x = pcx + petalRadius * Math.cos(theta);
            const y = pcy + petalRadius * Math.sin(theta);
            points.push({ x, y });
        }
    }

    return points;
}

//функция для рисования пути на основе точек
let drawPath = (color) => {

    const dataPoints = createPathN();

    const line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y);
    const svg = d3.select("svg")

    const path = svg.append('path')
        .attr('d', line(dataPoints))
        .attr('stroke', color)
        .attr('fill', 'none')

    return path;
}

//для создания анимации перемещения вдоль пути
function translateAlong(path, time, data) {
    const length = path.getTotalLength();
    const xDiff = (data[1] - data[0]);
    const yDiff = (data[3] - data[2]);
    const angleDiff = (data[5] - data[4]);

    return function() {
        return function(t) {
            //текущая точку на пути
            const {x, y} = path.getPointAtLength(t * length); //точки на пути
            // дата - начальное состояние, дифф - разница до конечного
            const xscale = data[0] + xDiff*t; 
            const yscale = data[2] + yDiff*t;
            const angle = data[4] + angleDiff*t;

            return `translate(${x},${y}) scale(${xscale}, ${yscale}) rotate(${angle})`;
        }
    }
}