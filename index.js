var center = require('turf-center');
var point = require('turf-point');
var linestring = require('turf-linestring');
var _ = require('underscore');
var priceTemplate = _.template('91 Lead at <%= price %> at <%= address %>');

//auto detect location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Your browser doesn't support your location")
    }
}

function getPriceInfo() {
    document.getElementById('priceinfo').innerText = priceTemplate({
        price: '131.9',
        address: 'Cnr Amherst Rd & Nicholson Rd, CANNING VALE'
    });
}

function showPosition(position) {
    console.log(position)
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var markerlat = -37.8333;
    var markerlon = 145.0000;

    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map').setView([lat,lon], 13);
    var line = linestring([[ lat, lon ], [ markerlat, markerlon ]]);
    var c = center(line);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //map markers
    var marker = L.marker([-37.8333, 145.0000]).addTo(map);

    // add center point marker
    // L.marker(c.geometry.coordinates).addTo(map);

    //add circle
    var circle = L.circle([lat, lon], 100, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 1
    }).addTo(map);

    //add comment (needs work)
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
}

switch (location.pathname) {
    case '/map.html': {
        getLocation();
        break;
    }

    default: {
        getPriceInfo();
    }
}

