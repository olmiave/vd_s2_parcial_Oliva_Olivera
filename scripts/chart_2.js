d3.dsv(";", "../data/147_ruidos_molestos.csv")

.then(data => {

const labels = ['PALERMO', 'CABALLITO', 'RECOLETA', 'BELGRANO'];

  const filteredData = data.filter(d => 
    (d.domicilio_barrio === "PALERMO" ||
     d.domicilio_barrio === "RECOLETA" ||
     d.domicilio_barrio === "BELGRANO" ||
     d.domicilio_barrio === "CABALLITO") &&
    (d.prestacion === "RUIDOS MOLESTOS Y VIBRACIONES") &&
      (d.canal === "App BA 147" || d.canal === "GCS Web")
  );

  const groupedData = d3.group(filteredData, d => d.domicilio_barrio.toUpperCase());
  const appData = labels.map(barrio => {
    const count = (groupedData.get(barrio) || []).filter(d => d.canal === 'App BA 147').length;
    return { barrio, count };
  });
  const webData = labels.map(barrio => {
    const count = (groupedData.get(barrio) || []).filter(d => d.canal === 'GCS Web').length;
    return { barrio, count };
  });
  

  const lollipopChart = {
    id: 'lollipopChart',
    afterDatasetsDraw(chart, args, options) {
      const { ctx } = chart;

      ctx.save();
      const appCoords = [];
      const webCoords = [];
      for (let i = 0; i < chart.getDatasetMeta(0).data.length; i++) {
        const appX = chart.getDatasetMeta(0).data[i].x;
        const appY = chart.getDatasetMeta(0).data[i].y;
        const webX = chart.getDatasetMeta(1).data[i].x;
        const webY = chart.getDatasetMeta(1).data[i].y;

        appCoords.push({ x: appX, y: appY });
        webCoords.push({ x: webX, y: webY });
      }

      drawCircles(appCoords, 'App BA 147', '#F768A1');
      drawCircles(webCoords, 'GCS Web', '#7A0177');

      function drawCircles(coords, canal, color) {
        const angle = Math.PI / 180;
        for (let i = 0; i < coords.length; i++) {
          ctx.beginPath();
          ctx.arc(coords[i].x, coords[i].y, 10, angle * 0, angle * 360, false);
          ctx.closePath();

          if (filteredData[i].canal === canal) {
            ctx.fillStyle = color;
          } else {
            ctx.fillStyle = color;
          }
          ctx.fill();
        }
      }
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'App BA 147',
        data: appData.map(d => d.count),
        backgroundColor: '#F768A1',
        borderColor: '#F768A1',
        barPercentage: 0.05,
      },
      {
        label: 'GCS Web',
        data: webData.map(d => d.count),
        backgroundColor:"#7A0177",
        borderColor:"#7A0177",
        barPercentage: 0.05,
            },
            ],
          }
// config
const config = {
    type: 'bar',
    data: chartData,
    options: {
    plugins: {
      title: {
        display: true,
        text: 'Canal utilizado '
      },
    tooltip:{
    yAlign:'bottom'
    }
    },
    indexAxis: 'x',
    scales: {
    y: {
    beginAtZero: true
    }
    }
    },
    plugins: [lollipopChart]
    };
    
   
    const chart_2 = new Chart(
    document.getElementById('chart_2'),
    config
    );


});
   


  