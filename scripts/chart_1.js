d3.dsv(";","data/147_18-24_agosto.csv")
  .then(data => {
    // Mostrar el contenido del archivo CSV en la consola
    console.log(data);

    // Filtrar los datos por fecha y hora

    var fechas = ["18/08/2021", "19/08/2021", "20/08/2021", "21/08/2021", "22/08/2021", "23/08/2021", "24/08/2021"];
    var horas = ["00", "04", "08", "12", "16", "20", "23"];
    
    var denunciasPorFechaHora= fechas.map(function(fecha) {
        return horas.map(function(hora) {
          return data.filter(function(d) {

            return d.fecha_ingreso === fecha && d.hora_ingreso.startsWith(hora);
          });
        });
    });

    var denunciasPorFechaHoraTotales = denunciasPorFechaHora.map( function(dia){
        return dia.map(function(hora){ return hora.length })
    })

    var colores = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 230, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(180, 255, 47, 1)'];

    // Convertir datos a formato compatible con Chart.js
    var labels = horas;
    var datasets = denunciasPorFechaHoraTotales.map(function(denunciasPorHora, index) {
      return {
        label: fechas[index],
        data: denunciasPorHora,
        borderColor: colores[index],
        backgroundColor: colores[index],
        tension: 0.2
      };
    });

    // Configurar opciones de gráfico
    var options = {
      responsive: true,
      scales: {
        x: {
          type: 'category',
          labels: labels
        },
        y: {
          beginAtZero: true,
          max: Math.max(...denunciasPorFechaHoraTotales.flat()) + 1
        }
      }
    };

    // Crear gráfico de líneas
    var ctx = document.getElementById('chart_1').getContext('2d'); 
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: options
    });
  })
  .catch(error => {
    // Manejar errores si los hubiera
    console.error("Error al cargar el archivo CSV:", error);
  });
