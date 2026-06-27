// Interactive Leaflet Map for SpaceX Launch Sites
document.addEventListener("DOMContentLoaded", function() {
    let map = L.map('leafletMap').setView([29.559, -95.083], 4);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    let launchSites = {
        "CCAFS LC-40": [28.562302, -80.577356],
        "KSC LC-39A": [28.573255, -80.646895],
        "VAFB SLC-4E": [34.632834, -120.610746]
    };

    // Plot Launch Sites
    for (let site in launchSites) {
        let coords = launchSites[site];
        
        // Add Circle
        L.circle(coords, {
            color: '#ff3b30',
            fillColor: '#ff3b30',
            fillOpacity: 0.15,
            radius: 1500
        }).addTo(map);
        
        // Add Marker
        let marker = L.marker(coords).addTo(map);
        marker.bindPopup(`<b>${site}</b><br>Latitude: ${coords[0]}<br>Longitude: ${coords[1]}`);
    }
});
