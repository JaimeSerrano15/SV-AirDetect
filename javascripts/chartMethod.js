// setup 
const year_2018 = [
    {x: 'Nivel de Ozono', y:100},
    {x: 'Nivel de Particula Fina', y:200},
    {x: 'Nivel de Materia Particulada', y:300},
    {x: 'Nivel de Monoxido de Carbono', y:400},
];

const year_2019 = [
    {x: 'Nivel de Ozono', y:50},
    {x: 'Nivel de Particula Fina', y:150},
    {x: 'Nivel de Materia Particulada', y:250},
    {x: 'Nivel de Monoxido de Carbono', y:350},
];

const year_2020 = [
    {x: 'Nivel de Ozono', y:75},
    {x: 'Nivel de Particula Fina', y:175},
    {x: 'Nivel de Materia Particulada', y:275},
    {x: 'Nivel de Monoxido de Carbono', y:375},
];

const year_2021 = [
    {x: 'Nivel de Ozono', y:125},
    {x: 'Nivel de Particula Fina', y:225},
    {x: 'Nivel de Materia Particulada', y:325},
    {x: 'Nivel de Monoxido de Carbono', y:425},
];

const year_2022 = [
    {x: 'Nivel de Ozono', y:150},
    {x: 'Nivel de Particula Fina', y:250},
    {x: 'Nivel de Materia Particulada', y:350},
    {x: 'Nivel de Monoxido de Carbono', y:450},
];

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

  // config 
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

  // render init block
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
);

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