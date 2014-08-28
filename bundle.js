(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var center = require('turf-center');
var point = require('turf-point');
var linestring = require('turf-linestring');

//auto detect location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Your browser doesn't support your location")
    }
}

function showPosition(position) {
    console.log(position)
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var markerlat = -37.8333;
    var markerlon = 145.0000;

    // create a map in the "map" div, set the view to a given place and zoom
    var line = linestring([[ lat, lon ], [ markerlat, markerlon ]]);
    var c = center(line);
    var map = L.map('map').setView(c.geometry.coordinates, 13);

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
}

getLocation();

},{"turf-center":2,"turf-linestring":5,"turf-point":6}],2:[function(require,module,exports){
var extent = require('turf-extent')

module.exports = function(layer, done){
  var ext = extent(layer)
  var x = (ext[0] + ext[2])/2
  var y = (ext[1] + ext[3])/2
  var center = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [x, y]
    }
  }
  return center
}
},{"turf-extent":3}],3:[function(require,module,exports){
var flatten = require('flatten')

module.exports = function(layer){
  var xmin = Infinity,
      ymin = Infinity,
      xmax = -Infinity,
      ymax = -Infinity
  if(layer.type === 'FeatureCollection'){
    for(var i in layer.features){
      var coordinates 
      switch(layer.features[i].geometry.type){
        case 'Point':
          coordinates = [layer.features[i].geometry.coordinates]
          break
        case 'LineString':
          coordinates = layer.features[i].geometry.coordinates
          break
        case 'Polygon':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = flatCoords(coordinates)
          break
        case 'MultiPoint':
          coordinates = layer.features[i].geometry.coordinates
          break
        case 'MultiLineString':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = flatCoords(coordinates)
          break
        case 'MultiPolygon':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = flatCoords(coordinates)
          break
      }
      if(!layer.features[i].geometry && layer.features[i].properties){
        return new Error('Unknown Geometry Type')
      }
      
      for(var n in coordinates){
        if(xmin > coordinates[n][0]){
          xmin = coordinates[n][0]
        }
        if(ymin > coordinates[n][1]){
          ymin = coordinates[n][1]
        }
        if(xmax < coordinates[n][0]){
          xmax = coordinates[n][0]
        }
        if(ymax < coordinates[n][1]){
          ymax = coordinates[n][1]
        }
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    return bbox
  }
  else{
    var coordinates 
    var geometry
    if(layer.type === 'Feature'){
      geometry = layer.geometry
    }
    else{
      geometry = layer
    }
    switch(geometry.type){
      case 'Point':
        coordinates = [geometry.coordinates]
        break
      case 'LineString':
        coordinates = geometry.coordinates
        break
      case 'Polygon':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
      case 'MultiPoint':
        coordinates = geometry.coordinates
        break
      case 'MultiLineString':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
      case 'MultiPolygon':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
    }
    if(!geometry){
      return new Error('No Geometry Found')
    }
    
    for(var n in coordinates){
      if(xmin > coordinates[n][0]){
        xmin = coordinates[n][0]
      }
      if(ymin > coordinates[n][1]){
        ymin = coordinates[n][1]
      }
      if(xmax < coordinates[n][0]){
        xmax = coordinates[n][0]
      }
      if(ymax < coordinates[n][1]){
        ymax = coordinates[n][1]
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    return bbox
  }
}

function flatCoords(coords){
  var newCoords = []
  coords = flatten(coords)
  coords.forEach(function(c, i){
    if(i % 2 == 0) // if is even
    newCoords.push([c, coords[i+1]])
  })
  return newCoords
}
},{"flatten":4}],4:[function(require,module,exports){
module.exports = function flatten(list, depth) {
  depth = (typeof depth == 'number') ? depth : Infinity;

  return _flatten(list, 1);

  function _flatten(list, d) {
    return list.reduce(function (acc, item) {
      if (Array.isArray(item) && d < depth) {
        return acc.concat(_flatten(item, d + 1));
      }
      else {
        return acc.concat(item);
      }
    }, []);
  }
};

},{}],5:[function(require,module,exports){
module.exports = function(coordinates, properties){
  if(!coordinates) return new Error('No coordinates passed')
  var linestring = { 
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": coordinates
    },
    "properties": properties
  }
  return linestring
}

},{}],6:[function(require,module,exports){
module.exports = function(x, y, properties){
  if(isNaN(x) || isNaN(y)) throw new Error('Invalid coordinates')
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [x, y]
    },
    properties: properties || {}
  }
}

},{}]},{},[1]);
