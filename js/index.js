var map;

window.onload = async function(){
    let busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city=Fossano");
    let vet = await busta.json(); 
    console.log(vet);
    
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
    aggiungiMarker(layer1,"Fossano", coord[0], coord[1]);
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