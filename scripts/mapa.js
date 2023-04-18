
const { json, select, selectAll, geoOrthographic, geoPath, geoGraticule } = d3

let geojson, globe, projection, path, graticule, infoPanel, isMouseDown = false, rotation = { x: 0, y: 0 }

const globeSize = {
    w: window.innerWidth / 2,
    h: window.innerHeight
}

json('https://assets.codepen.io/911796/custom.geo.json').then(data => init(data))

const init = data => {
    geojson = data
    drawGlobe()
    drawGraticule()
    renderInfoPanel()
    createHoverEffect()
    createDraggingEvents()
}

const drawGlobe = () => {

    globe = select('body')
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)

    projection = geoOrthographic()
        .fitSize([globeSize.w, globeSize.h], geojson)
        .translate([window.innerWidth /2, window.innerHeight / 2]);
        //- globeSize.w / 2, window.innerHeight / 2])

    path = geoPath().projection(projection)

    globe
        .selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', '#008A8A')
        .style('stroke', '#3E9C9C')
        .attr('class', 'country')
}


const drawGraticule = () => {

    graticule = geoGraticule()

    globe
        .append('path')
        .attr('class', 'graticule')
        .attr('d', path(graticule()))
        .attr('fill', 'none')
        .attr('stroke', '#2323')

}

const renderInfoPanel = () => infoPanel = select('body').append('article').attr('class', 'info')

const createHoverEffect = () => {

    globe
        .selectAll('.country')
        .on('mouseover', function (e, d) {
           // const { formal_en, economy } = d.properties
            //infoPanel.html(`<h1>${formal_en}</h1><hr><p>${economy}</p>`)
            globe.selectAll('.country').style('fill', '#008A8A').style('stroke', '$')
            select(this).style('fill', 'navy').style('stroke', 'white')
        })
}


const createDraggingEvents = () => {
  
    const rotateInterval = d3.interval(() => {
      rotation.x += 1; // Ajusta la velocidad de rotación en el eje x
      //rotation.y += 0.1; // Ajusta la velocidad de rotación en el eje y
  
      projection.rotate([rotation.x, rotation.y]);
      selectAll('.country').attr('d', path);
      selectAll('.graticule').attr('d', path(graticule()));
    }, 10); // Ajusta el intervalo de tiempo (en milisegundos) para controlar la velocidad de rotación
  }

  


