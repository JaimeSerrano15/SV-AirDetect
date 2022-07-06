/*
    Archivo JavaScript el cual posee toda la lógica relacional a la renderización del mapa y sus diferentes capas. 
    Cada una de estas funciones se basa en la libreria de Leaflet: https://leafletjs.com/
*/

//  Inicialización del componente que contiene al mapa, indicando las coordenadas para visualizar a El Salvador y su zoom inicial.
var map = L.map('map').setView([13.65, -89.17], 9);

//  Agregando la capa del mapa a utilizar, en este caso 'CARDOCDN'.
var tiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution:
        ' | Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    }).addTo(map);

// Un control que se encarga de renderizar la información de cada uno de los departamentos cuando se coloca el cursor sobre ellos.
var info = L.control();

//  Definiendo la capa principal que se utilizará para cambiar de año y elemento a analizar.
let mainLayer = "";

//  Función que se encarga de agregar/actualizar el controlador "info" la información relacionada a los departamentos.
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

//  Función que se encarga de definir la información a mostrar, dependiendo del año y elemento seleccionado.
const selectedLayer = (data) => {
    //console.log(data);
    const labels = mainLayer.split(" ");
    const year_label = labels.length - 1;
    console.log(labels);
    return (data[`${labels[2]}_${labels[year_label]}`])
};

//  Función que se encarga de actualizar el cuadro informativo de cada departamento en relación a la capa seleccionada.
info.update = function (props) {
    const selLayer = props && selectedLayer(props);
    this._div.innerHTML = `<h4>${mainLayer}</h4>` +  (props ?
        '<b>' + props.name + '</b><br />' + (selLayer ? selLayer : 'X') + ' μg / m<sup>3</sup>' : 'Coloque el cursor sobre el Departamento');
};

//  Agregando controlador de información de capas al mapa
info.addTo(map);

//  Función que se encarga de "pintar" a un departamento en función del elemento seleccionado.
function getColor(d) {
    console.log(d);
    return d >= 150  ? '#be21cc' :
        d >= 100  ? '#941f04' :
        d >= 50  ? '#e0570d' :
        d >= 20   ? '#dade0b' :
        d >= 0   ? '#0d99a3' : '#FFEDA0';
}

//  Función que se encarga de agregarle el estilo a los departamentos.
function style({properties}) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(selectedLayer(properties))
    };
}

//  Función que se encarga de resaltar el departamento cuando se le coloca el cursor encima del mismo.
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

//  Declarando variables que contendran la información de las capas, en base al archivo geoJSON denominado como departamente.js
var geojson, geoAux;

//  Función que se encarga de devolver a un departamento a su estilo original.
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

//  Función que se encarga de hacer que resalte el departamento.
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//  Función que asigna a cada departamento el evento de resaltado y zoom sobre el mapa.
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//  Extrayendo información geográfica de cada departamento del archivo geoJSON.
geojson = L.geoJson(departamentos, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

//  Definiendo el evento que cuando una capa cambie los elementos del mapa cambien con ella.
map.on("baselayerchange", ({layer}) => {
    mainLayer = document.querySelector("input[class=leaflet-control-layers-selector]:checked + span")
    .innerHTML.trim();
    layer.setStyle(style);
});

//  Variable auxiliar para almacenar la información geográfica de cada departamento del archivo geoJSON.
geoAux = L.geoJson(departamentos, {
    style: style,
    onEachFeature: onEachFeature
});

//  Declarando arreglo que contendrá los años a analizar
let years_labels = [];

//  Colocando cada capa con su respectivo año, y los hijos relacionados a cada elemento a analizar.
for (let year = 2018; year <= 2022; year++) {
    years_labels.push({
        label: `${year}`,
        collapsed: true,
        children: [
            {label: `Nivel de Ozono ${year}`, layer: geoAux},
            {label: `Nivel de Particula Fina ${year}`, layer: geoAux},
            {label: `Nivel de Materia Particulada ${year}`, layer: geoAux},
            {label: `Nivel de Monoxido de Carbono ${year}`, layer: geoAux},
        ],
    });
}

//  Agregando cada capa al controlador principal.
L.control.layers.tree(years_labels).addTo(map);

//  Actualizando el mapa.
info.addTo(map);

//  Agregando etiqueta del proyecto.
map.attributionControl.addAttribution('ACA-SIG Project - Group 7');

//  Definiendo componente para la leyenda que contendrá los rangos de análisis.
var legend = L.control({position: 'bottomleft'});

//  Función que se encarga de agregar cada rango a la leyenda.
legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend');
    let grades = [0, 20, 50, 100, 150, 250];
    let labels = ["<h3><strong>Rangos</Strong></h3><br>"];
    let colors = ["#0d99a3","#dade0b","#e0570d","#941f04","#be21cc","#3d0342"];
    let from, to;

    for (let i = 0; i < grades.length - 1; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            `<i class="material-icons icon" style="font-size:25px;color:${colors[i]};text-shadow:2px 2px 4px #000000;">cloud</i>`
            + "<p> " + from + (to ? ' &ndash; ' + to : '+') + "</p> " + " <br> ");
    }

    div.innerHTML = labels.join('');
    return div;
};

//  Agregando la leyenda al mapa.
legend.addTo(map);

//  Definiendo la leyenda a las escalas de los elementos a analizar.
let legend_scale = L.control({ position: "bottomright"});

// Función que se encarga de agregar cada escala a su respectiva leyenda.
legend_scale.onAdd = (map) => {
    let div = L.DomUtil.create('div', 'info legend_scale');
    let labels = ['<h3><strong>Escala de Calidad de Aire</Strong></h3><br>'];
    let colors = ["#0d99a3","#dade0b","#e0570d","#941f04","#be21cc","#3d0342"];

    labels.push(
        `<span style="color:#0d99a3;font-weight: bolder;">` +
        "Excelente" +
        "</span> " +
        `<span style="color:#787a06;font-weight: bolder;">` +
        "Buena" +
        "</span> " +
        `<span style="color:#e0570d;font-weight: bolder;">` +
        "Mala" +
        "</span> " +
        `<span style="color:#941f04;font-weight: bolder;">` +
        "Poco Saludable" +
        "</span> " +
        `<span style="color:#be21cc;font-weight: bolder;">` +
        "Muy Poco Saludable" +
        "</span> " +
        `<span style="color:#3d0342;font-weight: bolder;">` +
        "Peligrosa" +
        "</span>"
    );
    div.innerHTML = labels.join("<br>");

    return div;
};

//  Agregando leyenda de escala al mapa.
legend_scale.addTo(map);
