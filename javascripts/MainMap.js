
var map = L.map('map').setView([13.65, -89.17], 9);

var tiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution:
        ' | Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    }).addTo(map);

/*let logo = L.control( {
    position: "bottomleft"
});
logo.onAdd = map => {
    let div = L.DomUtil.create("div","info");
    div.innerHTML +=
    '<h2><img src="">Control de Aire de El Salvador</h2>';
    return div;
}; logo.addTo(map);*/

// control that shows state info on hover
var info = L.control();

let mainLayer = "";

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

const selectedLayer = (data) => {
    //console.log(data);
    const labels = mainLayer.split(" ");
    const year_label = labels.length - 1;
    console.log(labels);
    return (data[`${labels[2]}_${labels[year_label]}`])
};

info.update = function (props) {
    const selLayer = props && selectedLayer(props);
    this._div.innerHTML = `<h4>${mainLayer  }</h4>` +  (props ?
        '<b>' + props.name + '</b><br />' + selLayer + ' μg / m<sup>3</sup>' : 'Coloque el cursor sobre el Departamento');
};

info.addTo(map);

//let colors = ["#0d99a3","#dade0b","#e0570d","#941f04","#be21cc","#3d0342"]
// get color depending on the ozone level
function getColor(d) {
    console.log(d);
    return d >= 150  ? '#be21cc' :
        d >= 100  ? '#941f04' :
        d >= 50  ? '#e0570d' :
        d >= 20   ? '#dade0b' :
        d >= 0   ? '#0d99a3' : '#FFEDA0';
}

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

var geojson, geoAux;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

/* global statesData */
geojson = L.geoJson(departamentos, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.on("baselayerchange", ({layer}) => {
    mainLayer = document.querySelector("input[class=leaflet-control-layers-selector]:checked + span")
    .innerHTML.trim();
    layer.setStyle(style);
});

geoAux = L.geoJson(departamentos, {
    style: style,
    onEachFeature: onEachFeature
});

let years_labels = [];

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

L.control.layers.tree(years_labels).addTo(map);

info.addTo(map);

map.attributionControl.addAttribution('ACA-SIG Project - Group 4');

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend');
    let grades = [0, 20, 50, 100, 150, 250];
    let labels = ["<h3><strong>Rangos</Strong></h3><br>"];
    let colors = ["#0d99a3","#dade0b","#e0570d","#941f04","#be21cc","#3d0342"]
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

legend.addTo(map);

let legend_scale = L.control({ position: "bottomright"});

legend_scale.onAdd = (map) => {
    let div = L.DomUtil.create('div', 'info legend_scale');
    let labels = ['<h3><strong>Escala de Calidad de Aire</Strong></h3><br>'];

    labels.push(
        "<span> " +
        "Excelente" +
        "</span> " +
        "<span> " +
        "Buena" +
        "</span> " +
        "<span> " +
        "Mala" +
        "</span> " +
        "<span> " +
        "Poco Saludable" +
        "</span> " +
        "<span> " +
        "Muy Poco Saludable" +
        "</span> " +
        "<span> " +
        "Peligrosa" +
        "</span>"
    );
    div.innerHTML = labels.join("<br>");

    return div;
};

legend_scale.addTo(map);