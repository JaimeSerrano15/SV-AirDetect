/*
    Aquí se encuentra definida la lógica para la creación, población y renderización del gráfico de barras que contiene
    la información resumida de los diferentes elementos analizados con el pasar de los años. Esto fue posible gracias a
    la librería ChartJS (https://www.chartjs.org/).
*/

//  Definiendo la información de cada año de los elementos analizados.
const year_2018 = [
    {x: 'Nivel de Ozono', y:210},
    {x: 'Nivel de Particula Fina', y:252},
    {x: 'Nivel de Materia Particulada', y:255},
    {x: 'Nivel de Monoxido de Carbono', y:1},
];

const year_2019 = [
    {x: 'Nivel de Ozono', y:225},
    {x: 'Nivel de Particula Fina', y:249},
    {x: 'Nivel de Materia Particulada', y:257},
    {x: 'Nivel de Monoxido de Carbono', y:1},
];

const year_2020 = [
    {x: 'Nivel de Ozono', y:227},
    {x: 'Nivel de Particula Fina', y:255},
    {x: 'Nivel de Materia Particulada', y:260},
    {x: 'Nivel de Monoxido de Carbono', y:1},
];

const year_2021 = [
    {x: 'Nivel de Ozono', y:231},
    {x: 'Nivel de Particula Fina', y:259},
    {x: 'Nivel de Materia Particulada', y:257},
    {x: 'Nivel de Monoxido de Carbono', y:1},
];

const year_2022 = [
    {x: 'Nivel de Ozono', y:232},
    {x: 'Nivel de Particula Fina', y:257},
    {x: 'Nivel de Materia Particulada', y:259},
    {x: 'Nivel de Monoxido de Carbono', y:1},
];

//  Definiendo la data que contendrá el gráfico: Sus labels, la información base, colores, entre otras.
const data = {
    datasets: [{
      label: 'Cantidad en el Aire',
      data: year_2018,
      backgroundColor: [
        'rgba(255, 26, 104, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 26, 104, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1
    }]
  };

  //    Definiendo la configuración del gráfico.
  const config = {
    type: 'bar',
    data,
    options: {
      scales: {
        x: {
            type: 'category',
        },
        y: {
          beginAtZero: true
        }
      }
    }
  };

  //    Renderización del gráfico.
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
);

//  Función que se encarga de tomar el año seleccionado por el usuario y actualizar el gráfico con la información de dicho año.
function updateYear() {
    let year = document.getElementById("selected-year").value;

    if (year === 'year_2018') {
        myChart.config.data.datasets[0].data = year_2018;
    }
    if (year === 'year_2019') {
        myChart.config.data.datasets[0].data = year_2019;
    }
    if (year === 'year_2020') {
        myChart.config.data.datasets[0].data = year_2020;
    }
    if (year === 'year_2021') {
        myChart.config.data.datasets[0].data = year_2021;
    }
    if (year === 'year_2022') {
        myChart.config.data.datasets[0].data = year_2022;
    }

    myChart.update();
}
