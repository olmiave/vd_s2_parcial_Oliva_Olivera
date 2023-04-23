d3.dsv(";", "data/147_ruidos_molestos.csv")

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
  

    //lollipopChart plugin
    const lollipopChart = {
        id: 'lollipopChart',
        afterDatasetsDraw(chart, args, options) {
          const { ctx } = chart;
      
          ctx.save();
          for (let i = 0; i < chart.getDatasetMeta(0).data.length; i++) {
            const x = chart.getDatasetMeta(0).data[i].x;
            const y = chart.getDatasetMeta(0).data[i].y;
            
            let borderColor;
            if (chart.isDatasetVisible(0) === true) {
              borderColor = chart.getDatasetMeta(0)._dataset.borderColor[i];
            } else {
              borderColor = 'transparent';
            }
      
            circle(x, y, borderColor);
          }
      
    
    
          function circle(xPosition, yPosition, color) {
            const angle = Math.PI / 180;
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(xPosition, yPosition, 10, angle *0, angle *360, false);
            ctx.fill();
            //ctx.fillRect(xPosition - 5, yPosition, 10, chart.getDatasetMeta(0)._parsed[index].y - yPosition);
            ctx.closePath();
            ctx.restore();
      
          }
        },
      }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'App BA 147',
        data: appData.map(d => d.count),
        backgroundColor: 'rgba(99, 27, 242)',
        borderColor: 'rgba(99, 27, 242)',
        barPercentage: 0.05,
      },
      {
        label: 'GCS Web',
        data: webData.map(d => d.count),
        backgroundColor:
            'rgba(254, 102, 78)',
            borderColor:
                'rgba(254, 102, 78)',
            barPercentage: 0.05,
            },
            ],
            backgroundColorCircle: [
                'rgba(99, 27, 242)',
                'rgba(254, 102, 78)',
              ],
            };
;
  

// config
const config = {
    type: 'bar',
    data: chartData,
    options: {
    plugins: {
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
    
    // render init block
    const myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
    })
    .catch(err => console.log(err));

  