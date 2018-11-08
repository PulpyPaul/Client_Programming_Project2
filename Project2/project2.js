var locationData;
var degreeData;
var minorData;
var aboutData;
var employmentData;
var map;

function init() {
  initMap();
  createMarkers();
}

function initMap() {
  var locOfCity = {lat: 39.8283, lng: -98.5795};
  map = new google.maps.Map(
  document.getElementById('map'), {zoom: 5, center: locOfCity});

  var marker = new google.maps.Marker({position: locOfCity, map: map})
}

$(document).ready(function(){

  myXhr('get',{path:'/location'},'#about').done(function(json){
      locationData = json;
  });

  myXhr('get', {path:'/degrees'}, '#about').done(function(json){
    degreeData = json;
    for (var i = 0; i < degreeData.undergraduate.length; i++) {
      $('#UNDdegrees').append('<div class="degree"><h2>' +degreeData.undergraduate[i].title+ '</h2><p>' +degreeData.undergraduate[i].description+ '</p></div>');
    }

    for (var i = 0; i < degreeData.graduate.length - 1; i++) {
      $('#GRDdegrees').append('<div class="degree"><h2>' +degreeData.graduate[i].title+ '</h2><p>' +degreeData.graduate[i].description+ '</p></div>');
    }
  });

  myXhr('get', {path:'/minors'}, '#about').done(function(json){
    minorData = json;
    for (var i = 0; i < minorData.UgMinors.length; i++) {
      $(accordionMinors).append("<h3>" +minorData.UgMinors[i].title+ "</h3>");

      var divContent = "<div>Description<br><br> " +minorData.UgMinors[i].description+ "<br><br>Courses<br><br>";
      
      for (var j = 0; j < minorData.UgMinors[i].courses.length; j++) {
        divContent += (minorData.UgMinors[i].courses[j]+ "<br>"); 
      }

      divContent += "</div>";
    
      $(accordionMinors).append(divContent);
    }

    $("#accordionMinors").accordion({
      collapsible: true,
      active: false,
      heightStyle: "content"
    });
  });

  myXhr('get', {path:'/about'}, '#about').done(function(json){
    aboutData = json;
    $('#aboutTitle').html("<h1>" +aboutData.title+ "</h1>");
    $('#aboutDescription').html("<p>" +aboutData.description+ "</p>");
    $('#aboutQuote').html('<p>"' +aboutData.quote+ '"</p>');
    $('#aboutAuthor').html("<p>" +aboutData.quoteAuthor+ "</p>");    
  });

  myXhr('get', {path:'/employment'}, null).done(function(json){
    employmentData = json;
    var htmlContent = "<h2>" +employmentData.introduction.title+ "</h2>";
    $('#employment').append(htmlContent);

    htmlContent = "<p>" +employmentData.introduction.content[0].description+ "</p>";
    $('#employment').append(htmlContent);

    htmlContent = "<h2>" +employmentData.introduction.content[1].title+ "</h2>";
    $('#employment').append(htmlContent);

    htmlContent = "<p>" +employmentData.introduction.content[1].description+ "</p>";
    $('#employment').append(htmlContent);

    htmlContent = "<h2>" +employmentData.careers.title+ "</h2>";
    $('#employment').append(htmlContent);

    htmlContent = "";

    for (var i = 0; i < employmentData.careers.careerNames.length; i++) {
      htmlContent += "<p>" +employmentData.careers.careerNames[i]+ "</p>";
    }

    $('#employment').append(htmlContent);

    htmlContent = "<h2>" +employmentData.employers.title+ "</h2>";
    $('#employment').append(htmlContent);

    htmlContent = "";

    for (var i = 0; i < employmentData.employers.employerNames.length; i++) {
      htmlContent += "<p>" +employmentData.employers.employerNames[i]+ "</p>";
    }

    $('#employment').append(htmlContent);
    
    htmlContent = "<h2>" +employmentData.degreeStatistics.title+ "<h2>";
    $('#employment').append(htmlContent);

    htmlContent = "";

    for (var i = 0; i < employmentData.degreeStatistics.statistics.length; i++) {
      htmlContent += "<p>" +employmentData.degreeStatistics.statistics[i].value+ " - " +employmentData.degreeStatistics.statistics[i].description+ "</p>";
    }

    $('#employment').append(htmlContent);

    htmlContent = "<h2>" +employmentData.employmentTable.title+ "</h2>";
    $('#employment').append(htmlContent);

    var currTable = employmentData.employmentTable.professionalEmploymentInformation;
    
    htmlContent = "";
    for (var i = 0; i < employmentData.employmentTable.professionalEmploymentInformation.length; i++) {
      htmlContent += "<tr><td>" +currTable[i].employer+ "</td><td>" +currTable[i].degree+ "</td><td>" +currTable[i].city+ "</td><td>" +currTable[i].title+ "</td><td>" +currTable[i].startDate+ "</td></tr>";
    }

    $('#employTableData').append(htmlContent);

    console.dir(employmentData);
  });
});

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