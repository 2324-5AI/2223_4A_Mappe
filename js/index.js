var map;

var comuni = [
    "Fossano",
    "Cuneo",
    "Torino",
    "Asti",
    "Alba",
    "Bra",
    "Saluzzo",
    "Mondovì",
    "Savigliano",
    "Cherasco"
];

window.onload = async function(){
    let busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city="+comuni[0]);
    let vet = await busta.json(); 
    let coord = [parseFloat(vet[0].lon), parseFloat(vet[0].lat)];

    //Definisco una mappa
    map = new ol.Map(
        {
            target:"map", /* id dell'oggetto html */
            /* Definisco il livello base (mappa globale completa) */
            layers:[
                new ol.layer.Tile({source:new ol.source.OSM()})
            ],
            /*caratteristiche visive (zoom, centro, ...) della mappa creata */
            view:new ol.View({
                /* Array di float: coordinate (lon, lat)  */
                center: ol.proj.fromLonLat(coord),
                zoom:15
            })
    });

    //Path rispetto alla cartella principale del progetto (non come se fossi il js)
    let layer1 = aggiungiLayer(map, "img/marker.png");

    for(let comune of comuni){
        let promise = fetch("https://nominatim.openstreetmap.org/search?format=json&city="+comune);
        promise.then(async function(busta){
            let vet = await busta.json(); 
            let coord = [parseFloat(vet[0].lon), parseFloat(vet[0].lat)];
            aggiungiMarker(layer1, comune, coord[0], coord[1]);
           //DOM1 RICHIAMATO QUANDO VIENE MANDATO IN ESECUZIONE THEN
        });
        //DOM2 FUORI DAL THEN 
    }
    //DOM3 -> Non è detto che siano arrivate tutte le coordinate dei comuni

    //Gestione del click
    map.on("click", function (evento){
        /*
            forEachFeatureAtPixel -> Lavora in modo simile a comuni.forEach, perciò processa tutte 
            le feature presenti la mappa e filtra quelle cliccate

            evento.pixel -> pixel cliccati con il mouse
        */

        let marker = map.forEachFeatureAtPixel(evento.pixel, function(feature){return feature});
        alert(marker.name);
        
    });
}

/*
    Creazione di un nuovo layer
*/
function aggiungiLayer(mappa, pathImg){
    let layer = new ol.layer.Vector({
        /* Il sorgente dello strato visivo che si vuole aggiungere (es. altra mappa) */
        source:new ol.source.Vector(),
        /* 
            Permette di specificare delle caratteristiche 
            grafiche del layer 
        */
        style: new ol.style.Style({
            image: new ol.style.Icon({
                /* Coordinate dell'immagine rispetto alle coordinate del punto */
                anchor:[0.5, 1],
                src:pathImg
            })
        }) 
    });
    mappa.addLayer(layer);
    return layer;
}

/**
 * Aggiunge un nuovo marker in un layer
 * @param {*} layer 
 * @param {*} nome Testo da visualizzare 
 * @param {*} lon:float Longitudine 
 * @param {*} lat:float Latitudine
 */
function aggiungiMarker(layer, nome, lon, lat){
    let punto = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
    let marker = new ol.Feature(punto);
    marker.name = nome;

    //Inserisce il marker nel layer passato per parametro 
    layer.getSource().addFeature(marker);
}