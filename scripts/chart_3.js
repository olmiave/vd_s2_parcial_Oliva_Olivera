const mapaFetch3 = d3.json('data/palermo.geojson')
const dataFetch3 = d3.dsv(';','data/147_18-24_agosto.csv', d3.autoType)
Promise.all([mapaFetch3, dataFetch3]).then(([palermo, data]) => {
    //Filtro reclamos de PALERMO y RESIDUOS VOLUMINOSOS
    const reclamosPalermoResVolum = data.filter(d=>(d.domicilio_barrio=="PALERMO" && d.subcategoria == "RESIDUOS VOLUMINOSOS"))
    //Agrupo por género (Femenino/Masculino)
    const reclamosPorGenero = d3.group(reclamosPalermoResVolum, d => d.genero)
    //Del agrupamiento anterior me fijo la cantidad de Femenino
    const cantidadReclFem = reclamosPorGenero.get("Femenino").length
    //Del agrupamiento anterior me fijo la cantidad de Masculino
    const cantidadReclMasc = reclamosPorGenero.get("Masculino").length

  // Mapa Coroplético 
  let chartMap3 = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: palermo, // Objeto GeoJson a encuadrar
    },
    color: {
      legend: true,
      range: ["#fc4445" , "#86b3d1"],  //, "#159947"
    },
    marks: [
      Plot.geo(palermo, {
        fill: 'transparent',
        stroke: 'grey',
        title: d => `${d.properties.BARRIO}\n Femenino: ${cantidadReclFem} denuncias\n Masculino: ${cantidadReclMasc} denuncias`,
      }),
      Plot.dot(
        reclamosPalermoResVolum,
        {
        x: 'lon',
        y: 'lat',
        r: 7,
        stroke: 'none',
        fill: 'genero',
      }),
    ],
  })
  // Agregamos al DOM la visualización chartMap
  d3.select('#chart_3').append(() => chartMap3)
})