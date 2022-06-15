/*
 * L.Control.ZoomDisplay shows the current map zoom level
 */
L.Control.ZoomDisplay = L.Control.extend({
    options: {
        position: 'bottomright'
    },

    onAdd: function (map) {
        this._map = map;
        this._container = L.DomUtil.create('div', 'leaflet-control-zoom-display leaflet-bar-part leaflet-bar');
        this.updateMapZoom(map.getZoom());
        map.on('zoomend', this.onMapZoomEnd, this);
        return this._container;
    },

    onRemove: function (map) {
        map.off('zoomend', this.onMapZoomEnd, this);
    },

    onMapZoomEnd: function (e) {
        this.updateMapZoom(this._map.getZoom());
    },

    updateMapZoom: function (zoom) {
        this._container.innerHTML = zoom;
    }
});

L.Map.mergeOptions({
    zoomDisplayControl: true
});

L.Map.addInitHook(function () {
    if (this.options.zoomDisplayControl) {
        this.zoomDisplayControl = new L.Control.ZoomDisplay();
        this.addControl(this.zoomDisplayControl);
    }
});

L.control.zoomDisplay = function (options) {
    return new L.Control.ZoomDisplay(options);
};


var map, featureList, finish_area_poiSearch = [], course_poiSearch = [], support_poiSearch = [], start_area_poiSearch = [], d3_poiSearch = [], dangers_poiSearch =[];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(area_polygon.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], layer.feature.properties.zoom); //her kontrollerer du zoom-nivå ved klikk på objekt i sidebar
  // layer.fire("click"); // skru denne på viss du vil opne dialogen når du klikker, eller om du berre vil zoome til POI
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}


function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through course_poi layer and add only features which are in the map bounds */
  course_poi.eachLayer(function (layer) {
    if (map.hasLayer(course_poiLayer)) {
      // if (map.getBounds().contains(layer.getLatLng()))  /* XXX - denne gjer at berre dei som er innafor kartområdet vert med i lista
		  {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/sg' + layer.feature.properties.icon_subgroup + '.png"></td><td class="feature-name">' + 
		layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through support_poi layer and add only features which are in the map bounds */
  support_poi.eachLayer(function (layer) {
    if (map.hasLayer(support_poiLayer)) {
      // if (map.getBounds().contains(layer.getLatLng())) 
	  {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/sg' + layer.feature.properties.icon_subgroup + '.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through start_area_poi layer and add only features which are in the map bounds */
  start_area_poi.eachLayer(function (layer) {
    if (map.hasLayer(start_area_poiLayer)) {
      // if (map.getBounds().contains(layer.getLatLng())) 
	  {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/sg' + layer.feature.properties.icon_subgroup + '.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
    /* Loop through finish_area_poi layer and add only features which are in the map bounds */
   finish_area_poi.eachLayer(function (layer) {
    if (map.hasLayer(finish_area_poiLayer)) {
      // if (map.getBounds().contains(layer.getLatLng())) 
	  {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/sg' + layer.feature.properties.icon_subgroup + '.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
     /* Loop through d3_poi layer and add only features which are in the map bounds */
   d3_poi.eachLayer(function (layer) {
    if (map.hasLayer(d3_poiLayer)) {
      // if (map.getBounds().contains(layer.getLatLng())) 
	  {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/sg' + layer.feature.properties.icon_subgroup + '.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  }); 
    /* Loop through dangers_poi layer and add only features which are in the map bounds */
   dangers_poi.eachLayer(function (layer) {
    if (map.hasLayer(dangers_poiLayer)) {
      // if (map.getBounds().contains(layer.getLatLng())) 
	  {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/sg' + layer.feature.properties.icon_subgroup + '.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  }); 
  
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
	
// var mapquestUT_G = L.tileLayer("https://dntutnotilesprod.cloudapp.net/tilestache/ut_topo_light/{z}/{x}/{y}.jpg", {
  // maxZoom: 16,
  // minZoom: 1,
  // attribution: 'Tiles courtesy of <a href="https://www.ut.no/" target="_blank">UT.NO</a>">'
// });

// https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities

var Kartverket0 = L.tileLayer("https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?&format=image/png&layers=topo2graatone&zoom={z}&x={x}&y={y}", {
  maxZoom: 18,
  zIndex: 1,
  attribution: 'Tiles <a href="https://www.kartverket.no/" target="_blank">Kartverket</a>'
});
// https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities

var Kartverket1 = L.tileLayer("https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?&layer=topo4graatone&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3857%3A{z}&TileCol={x}&TileRow={y}", {
  maxZoom: 18,
  zIndex: 1,
  attribution: 'Tiles <a href="https://www.kartverket.no/" target="_blank">Kartverket</a>' + '. Icons <a href="https://www.flaticon.com/" target="_blank">Flaticon</a>'
});


var NXTRI_MapBox = L.tileLayer("https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoibm9yc2VtYW4iLCJhIjoiYjlHNG1oYyJ9.s8Rz8bK8IgA9GfzApWtjdA", {
  maxZoom: 18,
  subdomains: ["a", "b"],
  zIndex: 1,
  attribution: 'Tiles <a href="https://www.mapbox.com/" target="_blank">MapBox</a>"' + '. Icons <a href="https://www.flaticon.com/" target="_blank">Flaticon</a>'
});

var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>' + '. Icons <a href="https://www.flaticon.com/" target="_blank">Flaticon</a>'
});

// External wms-layers
// https://openwms.statkart.no/skwms1/wms.topo3.graatone?request=GetCapabilities&Service=WMS
// https://openwms.statkart.no/skwms1/wms.kartdata2?request=GetCapabilities&Service=WMS
// https://openwms.statkart.no/skwms1/wms.topo2?request=GetCapabilities&Service=WMS

var Kartverket2 = L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.topo3.graatone?", {
    layers: 'topo3_graatone_WMS',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    // attribution: "Kartverket.no"
});

var ml_2 = L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.kartdata2?", {
    layers: 'Vannflate,Elver,Arealdekkeflate',
    format: 'image/png',
    transparent: true,
	zIndex: 2,
	opacity: 0.2,
    version: '1.1.1',
    // attribution: "Kartverket.no"
});

var KA_ar5_overlay = L.tileLayer.kartverket('topo2graatone', {
    layers: 'Vannflate,Elver,Arealdekkeflate',
	format: 'image/png',
    transparent: true,
});



// var ml_3 = L.tileLayer.wms("https://wms.nibio.no/cgi-bin/ar50?", {
    // layers: 'Skogbonitet',
    // format: 'image/png',
    // transparent: true,
	// opacity: 0.2,
    // version: '1.1.1',
    // attribution: "www.nibio.no"
// });

// var ml_3 = L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.kartdata2?", {
    // layers: 'Arealdekkeflate',
    // format: 'image/png',
    // transparent: true,
	// opacity: 0.2,
    // version: '1.1.1',
    // attribution: "Kartverket.no"
// });

var ml_4 = L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.kartdata2?", {
    layers: 'Tekst,Stedsnavn',
    format: 'image/png',
    transparent: true,
    zIndex: 3,
	version: '1.1.1',
    // attribution: "Kartverket.no"
});

var ml_5 = L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.topo2?", {
    layers: 'topo2_wms',
    format: 'image/png',
    transparent: true,
	opacity: 1.0,
    version: '1.1.1',
    // attribution: "Kartverket.no"
});

var color_overlay = L.layerGroup([

L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.kartdata2?", {
    layers: 'Vannflate,Elver,Arealdekkeflate',
    format: 'image/png',
    transparent: true,
	opacity: 0.2,
	zIndex: 2,
    version: '1.1.1',
    // attribution: "Kartverket.no"
})
, 
L.tileLayer.wms("https://openwms.statkart.no/skwms1/wms.topo3.graatone?", {
    layers: 'Tekst,Stedsnavn',
    format: 'image/png',
    transparent: true,
    opacity: 0.99,
	zIndex: 3,
	version: '1.1.1',
    // attribution: "Kartverket.no"
})
]);



// var print_overlay = L.layerGroup ([Kartverket2,ml_2,ml_4]);
// var print_overlay = L.layerGroup ([ml_5]);


// Google Streetview
 

 // var googleLayer = new L.Google('ROADMAP');
      // map.addLayer(googleLayer);
// var fenway = new google.maps.LatLng(42.345573,-71.098326);
  // var panoramaOptions = {
    // position: fenway,
    // pov: {
      // heading: 34,
      // pitch: 10
    // }
  // };
  // var panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'),panoramaOptions);
  // map.setStreetView(panorama);
  
//*****************************************************

// Load KML //

// var kmlLayer = new L.KML("../resources/data/knudhillers.kml", {async: true});
                                                              
         // kmlLayer.on("loaded", function(e) { 
            // map.fitBounds(e.target.getBounds());
         // });
                                                
         // map.addLayer(kmlLayer);
		 
// function setupKML(map) {
    // //create the layer, do not feed it data
    // var KML = L.geoJson(null, {
      // style: function (feature) {
    // return {
      // color: "black",
      // fill: false,
      // opacity: 0.5,
      // clickable: false,
      // weight: 2
    // };
  // },  
    // });

    // //add the layer to the map
    // KML.addTo(map);

    // //function to actually fetch data
    // function fetchKML() {
        // var url = 'https://share.delorme.com/feed/Share/knudhillers';
        // $.KML(url, function(KMLData) {

            // //clear the current features from the map, add new data
            // KML.clearLayers().addData(KMLData);
        // });
    // }

    // //set this to run every 20000 ms
    // setInterval(fetchKML, 20000); //20000

    // //and run immediately
    // fetchKML();
// }

/* Overlay Layers - Dynamic */

// var ais_h;
// function update_ais_h() {
// $.getJSON('https://dl.dropboxusercontent.com/u/43845668/ais/ais_hazard.json', function(data) {
    // var geojson = L.geoJson(data, {
    
	  // pointToLayer: function (feature, latlng) {
		// return L.marker(latlng, {
      // icon: L.icon({
        // iconUrl: "../resources/img/ais_generell.png",
        // iconSize: [32, 28],
        // iconAnchor: [12, 28],
        // popupAnchor: [0, -25]
      // }),
      // title: feature.properties.ship_name,
      // riseOnHover: true
    // });
  // },
	  // onEachFeature: function (feature, layer) {
        // layer.bindPopup(feature.properties.ship_name +
						// " -> " +
						// feature.properties.destination +
						// "<br>" + 
						// "Fart = " +
						// feature.properties.speed + " knob" +
						// "<br>" + 
						// "Type = " + 
						// feature.properties.ship_type +
						// "<br>" + 
						// "Last = " + 
						// feature.properties.cargo
						
						// );
      // }
	// });
	// if (!ais_h) {
             // geojson.addTo(map);
             
				// }
   
	
	// setTimeout(update_ais_h, 20000);
	
  // });

// };
// update_ais_h();
 
// ISS dynamic layer - start //


// var myIcon = L.icon({
		// iconUrl: "../resources/img/Norseman_sponsor_logo_2018.png",
       // iconSize: [89, 33], 
 
// });



 // var iss;
// function update_position() {
    // $.getJSON('https://open-notify-api.herokuapp.com/iss-now.json?callback=?', function(data) {
        // var latitude = data["iss_position"]["latitude"];
        // var longitude = data["iss_position"]["longitude"];
        // if (!iss) {
            // iss = L.marker([latitude,longitude], {icon: myIcon}).bindPopup("Can you guess what this represents?").addTo(map);
        // }
        // iss.setLatLng([latitude,longitude]).update();
        // setTimeout(update_position, 20000);
    // });
// }
// update_position();
  
// ISS dynamic layer - stop //


// /* Overlay Layers - Static */

// $.getJSON("../resources/data/kommune.json", function (data) {
  // kommune.addData(data);
// });

//*****************************************************

var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: true,
  weight: 4.0,
  color:"#2b8cbe",
  opacity: 0.7,
  fillColor: "#FFFFFF",
  fillOpacity: 0.5,
  radius: 20
};

var area_polygon = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      weight: 0.5,
      fill: true,
      fillColor: "#42bdff",
	  opacity: 0.9,
      fillOpacity: 0.5,
	  clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
  layer.bindPopup(feature.properties.info);}
		
 });
$.getJSON("../resources/data/area_polygon.json", function (data) {
  area_polygon.addData(data);
  map.addLayer(area_polygon);
});

var dangerLines = L.geoJson(null, {
  style: function (feature) {
 	 if (feature.properties.cbb_index = "Extreme danger") {
      return {
        color: "#FF0000",
        weight: 10,
        opacity: 0.8,
		// title: feature.properties.title,
		// riseOnHover: true
      };
    }
},
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  "<tr><th>Name</th><td>" + feature.properties.title + "</td></tr>" + 
		"<tr><th>Info</th><td>" + feature.properties.info + "</td></tr>" + 
		// "<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.link_high + 
		// "' target='_blank'>3D profil for løypa (høg kvalitet)</a></td></tr>" +
	  "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.title);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
        }
		
      });
    }
    layer.on({
      mouseover: function (e) {
        
		var layer = e.target;
        layer.setStyle({
          weight: 10,
          color: "#FF0000",
          opacity: 1,
		  title: feature.properties.title,
      });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        dangerLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("../resources/data/danger_line.json", function (data) {
  dangerLines.addData(data);
  map.addLayer(dangerLines);
});

var courseLines = L.geoJson(null, {
  style: function (feature) {
    if (feature.properties.paintrule == "1") {
      return {
        color: "#00aaff", 
        weight: 3,
        opacity: 1.0
      };
    }
    if (feature.properties.paintrule == "2") {
      return {
        color: "#4daf4a",
        weight: 3,
        opacity: 0.8
      };
    }
    if (feature.properties.paintrule == "3") {
      return {
        color: "#000000",
        weight: 4,
        opacity: 0.8
      };
    }
		if (feature.properties.paintrule == "4") {
      return {
        color: "#000000",
        weight: 4,
        opacity: 0.8
      };
    }
	if (feature.properties.paintrule == "5") {
      return {
        color: "#000000",
        weight: 4,
        opacity: 0.8
      };
    }
	if (feature.properties.paintrule == "6") {
      return {
        color: "#000000",
        weight: 4,
        opacity: 1.0
      };
    }
	
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.title + "</td></tr>" + 
		"<tr><th>Info</th><td>" + feature.properties.info + "</td></tr>"
		// + 
	    // "<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.link_low + 
		// "' target='_blank'>3D profil for løypa (låg kvalitet)</a></td></tr>" + 
	  "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.title);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 4,
          color: "#000000",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        courseLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("../resources/data/course_line2.json", function (data) {
  courseLines.addData(data);
  map.addLayer(courseLines);
});

var route_h_catLines = L.geoJson(null, {
  style: function (feature) {
    
	if (feature.properties.h_cat == "0") {
      return {
        color: "#4daf4a", 
        weight: 3,
        opacity: 1.0
      };
    }
    if (feature.properties.h_cat == "500") {
      return {
        color: "#ff7f00",
        weight: 3,
        opacity: 1.0
      };
    }
    if (feature.properties.h_cat == "1000") {
      return {
        color: "#ff2b00",
        weight: 3,
        opacity: 1.0
      };
    }
    
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
     var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  "<tr><th>Height above mean sea level: </th><td>" + feature.properties.h_cat + " m" + "</td></tr>" +
	  "<tr><th>Legend</th><td>" + '<img src="../resources/img/h_cat.png" alt="no picture" height="53" width="109">' + "</td></tr>" 
	   "<table>";
	 layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        
		var layer = e.target;
        layer.setStyle({
          weight: 4,
          color: "#000000",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        courseLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("../resources/data/route_h_cat_ver1.json", function (data) {
  route_h_catLines.addData(data);
  // map.addLayer(route_h_catLines);
});



/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true, // xxx - markering av omsluttende polygon for dei punktene som ligg i ein cluster
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16 // xxx - her definerer du målestokk for der clustering skal deaktiverast
});

/* Empty layer placeholder to add to layer control for listening when to add/remove stigning to markerClusters layer */

var course_poiLayer = L.geoJson(null);
var course_poi = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: '../resources/img/sg' + feature.properties.icon_subgroup + '.png',
	    iconSize: [feature.properties.icon_w, feature.properties.icon_h], 
        iconAnchor: [feature.properties.icon_w/ 2, feature.properties.icon_h / 2], // xxx - halvparten av iconsize for å sikre at ikonet plasserast rett over punkt
        popupAnchor: [0, -32] //
      }),
      rotationAngle: feature.properties.icon_r,
	  title: feature.properties.keyword_search,
 	  riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.text_link) {
   var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" + "<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.text_link + "' target='_blank'>The www</a></td></tr>" 
		 
  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  	  
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      course_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "course_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	else  if (feature.properties) {
   var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" 
  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      course_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "course_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	
  }
});
$.getJSON("../resources/data/course_poi.json", function (data) {
  course_poi.addData(data);
  map.addLayer(course_poiLayer);
});

//********************************

var finish_area_poiLayer = L.geoJson(null);
var finish_area_poi = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: '../resources/img/sg' + feature.properties.icon_subgroup + '.png',
        iconSize: [feature.properties.icon_w, feature.properties.icon_h], 
         iconAnchor: [feature.properties.icon_w/ 2, feature.properties.icon_h / 2], // xxx - halvparten av iconsize for å sikre at ikonet plasserast rett over punkt
        popupAnchor: [0, -32] //
      }),
     rotationAngle: feature.properties.icon_r,
	  title: feature.properties.keyword_search,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.text_link) {
     var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" + "</td></tr>"+
		"<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.text_link + "' target='_blank'>The www</a></td></tr>" 
  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	    
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      finish_area_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "finish_area_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }	
else     if (feature.properties) {
      var content = 
	  "<table class='table table-striped table-bordered table-condensed'>" + 
	  "<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" + 
  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      finish_area_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "finish_area_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }	
	
	
  }
});
$.getJSON("../resources/data/finish_area_poi.json", function (data) {
  finish_area_poi.addData(data);
  map.addLayer(finish_area_poiLayer);
});



//********************************

var start_area_poiLayer = L.geoJson(null);
var start_area_poi = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
         iconUrl: '../resources/img/sg' + feature.properties.icon_subgroup + '.png',
	    iconSize: [feature.properties.icon_w, feature.properties.icon_h], 
        iconAnchor: [feature.properties.icon_w/ 2, feature.properties.icon_h / 2], // xxx - halvparten av iconsize for å sikre at ikonet plasserast rett over punkt
        popupAnchor: [0, -32] //
      }),
     rotationAngle: feature.properties.icon_r,
	  title: feature.properties.keyword_search,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.text_link) {
    var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" +
		"<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.text_link + "' target='_blank'>The www</a></td></tr>" 
  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	    
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      start_area_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "start_area_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	else if (feature.properties) {
      var content = 
	  "<table class='table table-striped table-bordered table-condensed'>" + 
	  
	  "<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" 
	    + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  ;
	  
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      start_area_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "start_area_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	
	
  }
});
$.getJSON("../resources/data/start_area_poi.json", function (data) {
  start_area_poi.addData(data);
  map.addLayer(start_area_poiLayer);
});


/* Empty layer placeholder to add to layer control for listening when to add/remove top to markerClusters layer */
var support_poiLayer = L.geoJson(null);
var support_poi = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: '../resources/img/sg' + feature.properties.icon_subgroup + '.png',
	    iconSize: [feature.properties.icon_w, feature.properties.icon_h], 
        iconAnchor: [feature.properties.icon_w/ 2, feature.properties.icon_h / 2],
        popupAnchor: [0, -36]
      }),
     rotationAngle: feature.properties.icon_r,
	  title: feature.properties.keyword_search,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.text_link) {
    var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" + "</td></tr>"+
		"<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.text_link + "' target='_blank'>The www</a></td></tr>" 
  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      support_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "support_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	else   if (feature.properties) {
    var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>"
				    + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      support_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "support_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	
	
  }
});
$.getJSON("../resources/data/support_poi.json", function (data) {
  support_poi.addData(data);
  map.addLayer(support_poiLayer);
});

// var myIcon = L.icon({
	// iconUrl: 'my-icon.png',
	// iconSize: [20, 20],
	// iconAnchor: [10, 10],
	// labelAnchor: [6, 0] // as I want the label to appear 2px past the icon (10 + 2 - 6)
// });
// L.marker([-37.7772, 175.2606], {
	// icon: myIcon
// }).bindLabel('My label', {
	// noHide: true,
	// direction: 'auto'
// });

var d3_poiLayer = L.geoJson(null);
var d3_poi = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
         iconUrl: '../resources/img/sg' + feature.properties.icon_subgroup + '.png',
	    iconSize: [feature.properties.icon_w, feature.properties.icon_h], 
         iconAnchor: [feature.properties.icon_w/ 2, feature.properties.icon_h / 2], // xxx - halvparten av iconsize for å sikre at ikonet plasserast rett over punkt
        popupAnchor: [0, -32] //
      }),
     rotationAngle: feature.properties.icon_r,
	  title: feature.properties.keyword_search,
 	  riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
   var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" + "</td></tr>"+
		"<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.text_link + "' target='_blank'>3D extravagante!</a></td></tr>" 
		 
	  + '<br>' + "<table>" + 
	  '<br>'+ '<img src="../resources/pictures/Gaustatoppen_3d_medium.jpg" alt="no picture" height="200" width="440">'
	  
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g6_d3.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      d3_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "d3_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("../resources/data/d3_poi.json", function (data) {
  d3_poi.addData(data);
  map.addLayer(d3_poiLayer);
});

var dangers_poiLayer = L.geoJson(null);
var dangers_poi = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
         iconUrl: '../resources/img/sg' + feature.properties.icon_subgroup + '.png',
	    iconSize: [feature.properties.icon_w, feature.properties.icon_h], 
        iconAnchor: [feature.properties.icon_w/ 2, feature.properties.icon_h / 2],// xxx - halvparten av iconsize for å sikre at ikonet plasserast rett over punkt
        popupAnchor: [0, -32] //
      }),
     rotationAngle: feature.properties.icon_r,
	  title: feature.properties.keyword_search,
 	  riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties.text_link) {
   var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" + "</td></tr>"+
		"<tr><th>Link</th><td><a class='url-break' href='" + feature.properties.text_link + "' target='_blank'>The www</a></td></tr>" 
	  + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      dangers_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "dangers_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	else  if (feature.properties) {
   var content = "<table class='table table-striped table-bordered table-condensed'>" + 
	  	  	"<tr><th>Name</th><td>" + feature.properties.keyword_search + "</td></tr>" 
	    + '<br>' + "<table>" + 
	  '<br>'+ feature.properties.picture_link 
	  ;
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.keyword_search);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="24" height="24" src="../resources/img/g4_dangers.png"></td><td class="feature-name">' + layer.feature.properties.keyword_search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      dangers_poiSearch.push({
        name: layer.feature.properties.keyword_search,
        source: "dangers_poi",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
	
  }
});
$.getJSON("../resources/data/dangers_poi.json", function (data) {
  dangers_poi.addData(data);
  map.addLayer(dangers_poiLayer);
});


// *** K's markers ***
var k_markersLayer = L.geoJson(null);
var k_markers = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "../resources/img/k_markers.png",
        iconSize: [25, 25], 
        iconAnchor: [12, 12], // xxx - halvparten av iconsize for å sikre at ikonet plasserast rett over punkt
        popupAnchor: [0, 0] //
      })
	  // ,
	  // title: "Dist " + feature.properties.dist_akk + " km, TO GO: " + feature.properties.dist_to_go + " km / " + feature.properties.climb_to_go + " m",
      // riseOnHover: true
    }).bindLabel(
	'Dist ' + feature.properties.dist_akk + ' km, TO GO: ' + feature.properties.dist_to_go + ' km / ' + feature.properties.climb_to_go + ' m'
	, { noHide: true });
  },
  // START - Dette er den vanlege popup boksen som man lyt klikke på close for å lukke
  
   // onEachFeature: function (feature, layer) {
    // if (feature.properties) {
      // var content = 
	  // "<table class='table table-striped table-bordered table-condensed'>" + 
	  // "<tr><th>Distanse</th><td>" + feature.properties.dist_akk + " km" + "</td></tr>" + 
	  // "<tr><th>Distanse to go</th><td>" + feature.properties.dist_to_go + " km" +
	  // "<tr><th>Climbed</th><td>" + feature.properties.s_akk_sum_h_up + " m" +  
	  // "<tr><th>Climb to go</th><td>" + feature.properties.climb_to_go + " m" + 
		// "<table>";
      // layer.on({
        // click: function (e) {
          // $("#feature-title").html(feature.properties.title);
          // $("#feature-info").html(content);
          // $("#featureModal").modal("show");
          // highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        // }
      // });
	  // // layer.on er nyttig dersom du vil vise noko fyrste gongen eit kartlag vert aktivert. Ikkje aktuelt for dei som er på som Default.
	  // // layer.on({
		  // // add: function (e) {
          // // $("#feature-title").html(feature.properties.title);
          // // $("#feature-info").html(content);
          // // $("#featureModal").modal("show");
          // // highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        // // }
      // // });
           
    // }
  // }
  // STOPP - Dette er den vanlege popup boksen som man lyt klikke på close for å lukke
  
  // START - Denne vil gi ein boks som vert ståande på skjermen inntil man klikkar
  onEachFeature: function (feature, layer) {

                var myLayer = layer;

                {
                    myLayer.bindPopup(
						'<b>Distance:</b> ' + feature.properties.dist_akk + ' km' + '<br >' +
                        '<b>Distance to go:</b> ' + feature.properties.dist_to_go + ' km' + '<br >' +
                        '<b>Climbed:</b> ' + feature.properties.s_akk_sum_h_up + ' m' +'<br >' +
                        '<b>Climb to go:</b> ' + feature.properties.climb_to_go + ' m');
						// + '<br >'+ '<br >' + '<img src="../resources/img/k_markers.png" alt="Smiley face" height="42" width="42">' );
                // Denne vil gi deg moglegheit for å vise eit bilete!!
				}

                return myLayer;
            }
		// STOP - Denne vil gi ein boks som vert ståande på skjermen inntil man klikkar	
			
});
$.getJSON("../resources/data/k_markers.json", function (data) {
  k_markers.addData(data);
  map.addLayer(k_markersLayer);
});

map = L.map("map", {
  zoom: 12,
  center: [60.15, 7.77],
  layers: [Kartverket1,markerClusters, highlight],
  // layers: [mapquestKA2, kommune, markerClusters, highlight],
  // layers: [ml_1, ml_2,markerClusters, highlight],
  zoomControl: false,
  attributionControl: true,
 
});

	 
/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === course_poiLayer) {
    markerClusters.addLayer(course_poi);

    syncSidebar();
  }
  if (e.layer === support_poiLayer) {
    markerClusters.addLayer(support_poi);
    syncSidebar();
  }
  if (e.layer === start_area_poiLayer) {
    markerClusters.addLayer(start_area_poi);

    syncSidebar();
  }
    if (e.layer === finish_area_poiLayer) {
    markerClusters.addLayer(finish_area_poi);

    syncSidebar();
  }
  if (e.layer === d3_poiLayer) {
    markerClusters.addLayer(d3_poi);

    syncSidebar();
  }
   if (e.layer === dangers_poiLayer) {
    markerClusters.addLayer(dangers_poi);

    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === course_poiLayer) {
    markerClusters.removeLayer(course_poi);
    syncSidebar();
  }
  if (e.layer === support_poiLayer) {
    markerClusters.removeLayer(support_poi);
    syncSidebar();
  }
   if (e.layer === start_area_poiLayer) {
    markerClusters.removeLayer(start_area_poi);
    syncSidebar();
  }
   if (e.layer === finish_area_poiLayer) {
    markerClusters.removeLayer(finish_area_poi);
    syncSidebar();
  }
  if (e.layer === d3_poiLayer) {
    markerClusters.removeLayer(d3_poi);
    syncSidebar();
  }
    if (e.layer === dangers_poiLayer) {
    markerClusters.removeLayer(dangers_poi);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

// L.easyPrint({
	// // title: 'Clean print',
	// // position: 'bottomright',
	// elementsToHide: 'meta,title'
	// // elementsToHide: 'table,h3,button,h4,input,title'
// }).addTo(map)



// Målestokk, denne er nedst da denne er før zoomcontroll og locatecontroll
// L.control.scale({
  // position: "bottomright"
// }).addTo(map);

// +/- knappane
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);


/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "Locate me!",
    popup: "Located!",
    outsideMapBoundsMsg: "You are off limits!"
  },
  locateOptions: {
    maxZoom: 13,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  
  "Kartverket.no":Kartverket1,
  "MapBox.com":NXTRI_MapBox,
  "OSM CartoDB":cartoLight
};

var groupedOverlays = {
  "POI": {
    "<img src='../resources/img/g1_course.png' width='32' height='32'>": course_poiLayer,
	"<img src='../resources/img/g2_start_area.png' width='32' height='32'>": start_area_poiLayer,
	"<img src='../resources/img/g3_support.png' width='32' height='32'>": support_poiLayer,
	"<img src='../resources/img/g4_dangers.png' width='32' height='32'>": dangers_poiLayer,
	"<img src='../resources/img/g5_finish_area.png' width='32' height='32'>": finish_area_poiLayer,
	"<img src='../resources/img/g6_d3.png' width='32' height='32'>": d3_poiLayer,
	},

  "Map": {
    "Course": courseLines,
	"Area": area_polygon,
	"Danger": dangerLines,
	"K-markers":k_markers,
	"H-CAT":route_h_catLines,
	"Kartverket Color":ml_2,
	// "Kartverket2":KA_ar5_overlay,
  },
};


var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed,
  autoZIndex: true
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to area_polygon bounds */
  map.fitBounds(area_polygon.getBounds()); 
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var finish_area_poiBH = new Bloodhound({
    name: "finish_area_poi",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: finish_area_poiSearch,
    limit: 10
  });

  var course_poiBH = new Bloodhound({
    name: "course_poi",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: course_poiSearch,
    limit: 10
  });

   var start_area_poiBH = new Bloodhound({
    name: "start_area_poi",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: start_area_poiSearch,
    limit: 10
  });
  
  var support_poiBH = new Bloodhound({
    name: "support_poi",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: support_poiSearch,
    limit: 10
  });

    var d3_poiBH = new Bloodhound({
    name: "d3_poi",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: d3_poiSearch,
    limit: 10
  });

     var dangers_poiBH = new Bloodhound({
    name: "dangers_poi",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: dangers_poiSearch,
    limit: 10
  });
  
  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "https://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=NO&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  finish_area_poiBH.initialize();
  course_poiBH.initialize();
  start_area_poiBH.initialize();
  support_poiBH.initialize();
  d3_poiBH.initialize();
  dangers_poiBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 2,
    highlight: true,
    hint: false
  }, 
 
  {
    name: "course_poi",
    displayKey: "name",
    source: course_poiBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/g1_course.png' width='24' height='24'></h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;"].join(""))
    }
  },
  
  {
    name: "start_area_poi",
    displayKey: "name",
    source: start_area_poiBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/g2_start_area.png' width='24' height='24'></h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;"].join(""))
    }
  },
  {
    name: "support_poi",
    displayKey: "name",
    source: support_poiBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/g3_support.png' width='24' height='24'></h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;"].join(""))
    }
  },
 
  {
    name: "finish_area_poi",
    displayKey: "name",
    source: finish_area_poiBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/g5_finish_area.png' width='24' height='24'></h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;"].join(""))
    }
  },
  {
    name: "d3_poi",
    displayKey: "name",
    source: d3_poiBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/g6_d3.png' width='24' height='24'></h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;"].join(""))
    }
  },  
  {
    name: "dangers_poi",
    displayKey: "name",
    source: dangers_poiBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/g4_dangers.png' width='24' height='24'></h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;"].join(""))
    }
  },  
  {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='../resources/img/globe.png' width='25' height='24'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "area_polygon") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "course_poi") {
      if (!map.hasLayer(course_poiLayer)) {
        map.addLayer(course_poiLayer);
      }
      map.setView([datum.lat, datum.lng], 14);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	    if (datum.source === "start_area_poi") {
      if (!map.hasLayer(start_area_poiLayer)) {
        map.addLayer(start_area_poiLayer);
      }
      map.setView([datum.lat, datum.lng], 14);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "support_poi") {
      if (!map.hasLayer(support_poiLayer)) {
        map.addLayer(support_poiLayer);
      }
      map.setView([datum.lat, datum.lng], 14);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "finish_area_poi") {
      if (!map.hasLayer(finish_area_poiLayer)) {
        map.addLayer(finish_area_poiLayer);
      }
      map.setView([datum.lat, datum.lng], 14);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	if (datum.source === "d3_poi") {
      if (!map.hasLayer(d3_poiLayer)) {
        map.addLayer(d3_poiLayer);
      }
      map.setView([datum.lat, datum.lng], 14);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	
	if (datum.source === "dangers_poi") {
      if (!map.hasLayer(finish_area_poiLayer)) {
        map.addLayer(dangers_poiLayer);
      }
      map.setView([datum.lat, datum.lng], 14);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	
	
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
