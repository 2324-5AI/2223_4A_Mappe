var map;

var comuni = [
    {nome:"Fossano", desc:"«Quasi nel centro del Piemonte e in bellissima posizione sorge la città di Fossano posta sopra agevole poggio. Dolcemente essa guarda al levante un delizioso teatro di sparse e ben svariate collinette e una vasta pianura. La vista si spazia per un'ampia zona di terra fino alle più remote Alpi elvetiche avendosi, alla sinistra, le nevose balze del saluzzese con il Re di Pietra Monviso e, a destra, le ubertose pendici dell'Appennino.» "},
    {nome:"Cuneo", desc:"La città è sorta presso la confluenza dei corsi d'acqua Stura e Gesso, su un cùneo la cui caratteristica conformazione ne ha ispirato il nome[6][7]. Il nucleo più antico, e centro storico, è caratterizzato da un impianto a scacchiera che, partendo dal vertice dell'immaginario cuneo scorre lungo una via mediana che sbocca sull'ampia piazza Galimberti: la città fu infatti plasmata come cittadella militare antifrancese dai Savoia, ed è uno dei pochi capoluoghi dell'Italia settentrionale ad avere origini moderne e non romane[8][9]. "},
    {nome:"Torino", desc:"Quarto comune italiano per popolazione e cuore di un'area metropolitana che conta circa 1,7 milioni di abitanti, Torino è il terzo complesso economico-produttivo del Paese (insieme a Milano e Genova componeva il triangolo industriale, centro dell'industrializzazione su larga scala dell'economia italiana alla fine del XIX secolo, e durante gli anni del boom economico) e costituisce uno dei maggiori poli universitari, artistici, turistici, scientifici e culturali d'Italia. Nel suo territorio sono inoltre presenti aree ed edifici inclusi in due beni protetti dall'UNESCO: alcuni palazzi e zone facenti parte del circuito di residenze sabaude in Piemonte (patrimonio dell'umanità[8]) e l'area delle colline del Po (riserva della biosfera). "}
];

window.onload = async function(){
    let busta = await fetch("https://nominatim.openstreetmap.org/search?format=json&city="+comuni[0].nome);
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
        let promise = fetch("https://nominatim.openstreetmap.org/search?format=json&city="+comune.nome);
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
        console.log(marker.dati);
        alert(marker.dati.nome + "\n" + marker.dati.desc);
        
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
 * @param {*} dati Dati legati al marker
 * @param {*} lon:float Longitudine 
 * @param {*} lat:float Latitudine
 */
function aggiungiMarker(layer, dati,  lon, lat){
    let punto = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
    let marker = new ol.Feature(punto);

    dati.lon = lon;
    dati.lat = lat;
    marker.dati = dati;

    //Inserisce il marker nel layer passato per parametro 
    layer.getSource().addFeature(marker);
}