var center = require('turf-center');
var point = require('turf-point');
var linestring = require('turf-linestring');
var request = require('hyperquest');
var _ = require('underscore');
var JSONStream = require('JSONStream');
var priceTemplate = _.template('91 Lead is cheapest at <%= price %> in <%= address %>');

var pageActions = {
  home: [ getPriceInfo ],
  map: [ getLocation ]
};

//auto detect location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Your browser doesn't support your location")
    }
}

function getPriceInfo() {
    var req = request(location.origin + '/sample.json');

    req.pipe(JSONStream.parse('*')).on('data', function(item) {
        displayPrice(item);
        req.end();
    });
}

function displayPrice(data) {
    var title = data.title;
    var parts = title.split(/\:\s?/);

    document.getElementById('priceinfo').innerText = priceTemplate({
        price: parts[0],
        address: parts[1]
    });
}


function loadCurrentPage() {
  var section = location.hash.slice(1) || 'home';
  var actions = pageActions[section] || [];

  actions.forEach(function(action) {
    action();
  });
}

function showPosition(position) {
    console.log(position)
    // var lat = position.coords.latitude;
    // var lon = position.coords.longitude;

    var lat = -32.082959700000000000;
    var lon = 115.839983299999870000;

    var markerlat = -32.070959800000000000;
    var markerlon = 115.843883299999970000;

    // create a map in the "map" div, set the view to a given place and zoom
    var line = linestring([[ lat, lon ], [ markerlat, markerlon ]]);
    var c = center(line);
    var map = L.map('map').setView(c.geometry.coordinates, 15);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //map markers
    var marker = L.marker([-32.070959800000000000, 115.843883299999970000]).addTo(map);

    // add center point marker
    // L.marker(c.geometry.coordinates).addTo(map);

    //add circle
    var circle = L.circle([lat, lon], 40, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 1
    }).addTo(map);

    //add comment
    marker.bindPopup("<b>Your Destination!</b><br>Cnr Amherst Rd & Nicholson Rd, CANNING VALE </br> <b>Estimated Time:</b> 3 mins").openPopup();
}

loadCurrentPage();
window.addEventListener('hashchange', loadCurrentPage);
