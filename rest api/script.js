const url = "https://nominatim.openstreetmap.org/search?format=json&q=Roermond";


const esriStraten = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles &copy; Esri", maxZoom: 19 }
);

const esriSatelliet = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles &copy; Esri", maxZoom: 19 }
);

const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
});

async function init() {
  const map = L.map("map", { layers: [esriStraten] }).setView([51.19, 5.99], 12);

  L.control
    .layers({
      "Esri straten": esriStraten,
      "Esri satelliet": esriSatelliet,
      "OpenStreetMap (via server)": osm,
    })
    .addTo(map);

  try {

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Onverwachte status: " + response.status);
    }

    const results = await response.json();
    if (results.length === 0) {
      throw new Error("Geen resultaten gevonden");
    }


    const place = results[0];
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    console.log(place.display_name, lat, lon);

    map.setView([lat, lon], 13);
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(place.display_name)
      .openPopup();
  } catch (error) {
    console.error(error);
    alert("Er ging iets mis: " + error.message);
  }
}

init();