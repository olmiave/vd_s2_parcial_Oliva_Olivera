const mapaFetch = d3.json('data/barrios-caba.geojson')
const dataFetch = d3.dsv(';', 'data/147_18-24_agosto.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  
  /* Agrupamos reclamos x barrio */
  const reclamosPorBarrio = d3.group(
    data.filter(d=>(d.subcategoria=="RESIDUOS VOLUMINOSOS")), 
    d => d.domicilio_barrio) // crea un Map
  console.log('reclamosPorBarrio', reclamosPorBarrio)
  
  /* A cada feature del mapa le agregamos la prop DENUNCIAS */
  barrios.features.forEach(d => {
    let nombreBarrio = d.properties.BARRIO
    let cantReclamos =  reclamosPorBarrio.get(nombreBarrio).length
    d.properties.DENUNCIAS = cantReclamos

    console.log(nombreBarrio + ': ' + cantReclamos)
  })


  /* Mapa Coroplético */
  let chartMap2 = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
    },
    color: {
      // Quantize continuo (cant. denuncias) -> discreto (cant. colores)
      type: 'quantize', 
      n: 10,
      scheme: 'ylgn', //burd
      label: 'Cantidad de denuncias por residuos voluminosos',
      legend: true,
    },
    marks: [
      Plot.geo(barrios, {
        fill: d => d.properties.DENUNCIAS ,
        stroke: 'gray',
        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias por residuos voluminosos`,
      }),
      Plot.text(
        barrios.features,
        Plot.centroid({
          text: (d) => d.properties.BARRIO,
          fill: "currentColor",
          stroke: "white",
          textAnchor: "center",
          dx: 4,
          filter: (d) => d.properties.DENUNCIAS > 120
        })
      )
    ],
  })

  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart_2').append(() => chartMap2)


})
