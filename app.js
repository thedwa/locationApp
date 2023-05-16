let map;
let marker;
let location = { lat: 51.505, lng: -0.09 }; // Default location

// Initialize the map
function initMap() {
    map = L.map('mapid').setView([location.lat, location.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([location.lat, location.lng], {draggable: true}).addTo(map);
    marker.on('dragend', function (e) {
        location = marker.getLatLng();
    });
}

// Function to get location from browser
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setView([location.lat, location.lng]);
            marker.setLatLng([location.lat, location.lng]);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to handle button click
async function handleClick(buttonNum) {
    // Send a request to your backend with the selected location and buttonNum
    const response = await fetch('/api/call-openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, buttonNum }),
    });

    const data = await response.json();
    console.log(data);
}

document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    getLocation();

    // Add event listeners to buttons
    document.querySelectorAll('.btn').forEach((button) => {
        button.addEventListener('click', (event) => handleClick(event.target.dataset.num));
    });
});
