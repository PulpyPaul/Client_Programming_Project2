var locationData;
var degreeData;
var minorData;
var aboutData;
var map;

function init() {
  initMap();
  createMarkers();
  createMajor();
}

function initMap() {
  var locOfCity = {lat: 39.8283, lng: -98.5795};
  map = new google.maps.Map(
  document.getElementById('map'), {zoom: 3, center: locOfCity});

  var marker = new google.maps.Marker({position: locOfCity, map: map})
}

$(document).ready(function(){

  $("#accordionMajors").accordion({
    collapsible: true,
    active: false,
    heightStyle: "content"
  });

  myXhr('get',{path:'/location'},'#about').done(function(json){
      locationData = json;
  });

  myXhr('get', {path:'/degrees'}, '#about').done(function(json){
    degreeData = json;
  });

  myXhr('get', {path:'/minors'}, '#about').done(function(json){
    minorData = json;
  });

  myXhr('get', {path:'/about'}, '#about').done(function(json){
    aboutData = json;
    $('#aboutTitle').html("<p>" +aboutData.title+ "</p>");
    $('#aboutDescription').html("<p>" +aboutData.description+ "</p>");

    console.dir(aboutData);
  });

});

function createMajor() {
  
}

function createMarkers() {
  for (var i = 0; i < locationData.length; i++) {
    var coords = { lat: parseFloat(locationData[i].latitude), lng: parseFloat(locationData[i].longitude) };
    var marker = new google.maps.Marker({position: coords, map: map});
  }  
}

function myXhr(t, d, id){
    return $.ajax({
	    type:t,
	    url:'http://serenity.ist.rit.edu/~plgics/proxy.php',
	    dataType:'json',
    	data:d,
    	cache:false,
    	async:true,
    	beforeSend:function(){
	    	//PLEASE - get your own spinner that 'fits' your site.
	    	$(id).append('<img src="gears.gif" class="spin"/>');
	    }
  	}).always(function(){
    	//kill spinner
  		$(id).find('.spin').fadeOut(5000,function(){
  			$(this).remove();
  		});
  	}).fail(function(){
  		//handle failure
  	});
}

window.onload = init;