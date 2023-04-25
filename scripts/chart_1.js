const mapaFetch = d3.json('https://olmiave.github.io/vd_s2_parcial_Oliva_Olivera/data/barrios-caba.geojson')
const dataFetch = d3.dsv(';', 'https://olmiave.github.io/vd_s2_parcial_Oliva_Olivera/data/147_ruidos_molestos.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  
  /* Agrupamos reclamos x barrio */
  const reclamosPorBarrio = d3.group(
    data.filter(d=>(d.prestacion==="RUIDOS MOLESTOS Y VIBRACIONES")), 
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
  let chartMap = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
      
    },
    color: {
      // Quantize continuo (cant. denuncias) -> discreto (cant. colores)
      
     
      type: 'quantize', 
      n: 5,
      scheme: 'RdPu', //burd
      domain: [10,250],
      label: 'Cantidad de denuncias por ruidos molestos',
      legend: true,
    
      
      
    },
    marks: [
      Plot.geo(barrios, {
        fill: d => d.properties.DENUNCIAS , 
        
        stroke: '#D8D8D8',
       

        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias por ruidos molestos`,
      }),
      Plot.text(
        barrios.features,
        Plot.centroid({
          text: (d) => d.properties.BARRIO,
          fill: "white",
          textAnchor: "center",
          dx: 4,
          
          filter: (d) => d.properties.DENUNCIAS > 200
        })
      )
    ],

    style: {

      background: '#1d011e',
   
    },
  })

  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart_1').append(() => chartMap)
})
