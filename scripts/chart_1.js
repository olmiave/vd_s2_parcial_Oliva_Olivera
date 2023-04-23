const ctx = document.getElementById('myChart').getContext('2d');

// Cargar los datos usando d3
d3.dsv(";", "data/147_ruidos_molestos.csv")

.then(data => {
    console.log(data);
  // // Filtrar los datos para obtener solo las denuncias de ruidos molestos y vibraciones en los barrios requeridos
  const filteredData = data.filter(d => d.prestacion === "RUIDOS MOLESTOS Y VIBRACIONES");

  // Obtener los nombres de los barrios para usarlos como etiquetas del gráfico
  const barrios = ["PALERMO", "RECOLETA", "BELGRANO", "CABALLITO"];

  // Funciones para obtener la cantidad de denuncias cerradas y abiertas para cada barrio
  const Cerrado = d => d.estado_del_contacto === "Cerrado" ? 1 : 0;
  const Abierto = d=> d.estado_del_contacto === "Abierto" ? 1 : 0;
 // const AbiertoData = [];
 // Abierto.forEach(element => AbiertoData.push(element & -1));

  // Obtener la cantidad de denuncias cerradas y abiertas para cada barrio
  const cerradoPorBarrio = barrios.map(barrio => {
    return filteredData.reduce((sum, d) => {
      if (d.domicilio_barrio === barrio) {
        return sum + Cerrado(d);
      } else {
        return sum;
      }
    }, 0);
  });
  
  const abiertoPorBarrio = barrios.map(barrio => {
    return Math.abs(filteredData.reduce((sum, d) => {
      if (d.domicilio_barrio === barrio) {
        return sum + Abierto(d);
      } else {
        return sum;
      }
    }, 0));
  });

  // Crear la configuración del gráfico
  const config = {
    type: 'bar',
    data: {
      labels: barrios,
      datasets: [
        {
          label: "Cerrado",
          backgroundColor: "#4d6d9a",
          data: cerradoPorBarrio,
          barPercentage: 1,
          //categoryPercentage: 0.5,
        },
        {
          label: "Abierto",
          backgroundColor: "#fc4445",
          data: abiertoPorBarrio,
          barPercentage: 1,
          //width: 100,
        },
      ],
      
    },
   
    options: {
      indexAxis: 'y', 
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#333",
            },
          },
        ],
      },
      plugins: {
        title: {
          display: true,
          text: 'Bar Chart'
        },
        legend: {
          position: 'right',
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  };

  const myChart = new Chart(ctx, config);

});
