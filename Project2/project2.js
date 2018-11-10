var locationData;
var degreeData;
var minorData;
var aboutData;
var employmentData;
var peopleData;
var researchData;
var footerData;
var newsData;
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
      $('#UNDdegrees').append('<div class="degree"><h3>' +degreeData.undergraduate[i].title+ '</h3><p>' +degreeData.undergraduate[i].description+ '</p></div>');
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

    var currTable = employmentData.employmentTable.professionalEmploymentInformation;
    
    htmlContent = "";
    for (var i = 0; i < currTable.length; i++) {
      htmlContent += "<tr><td>" +currTable[i].employer+ "</td><td>" +currTable[i].degree+ "</td><td>" +currTable[i].city+ "</td><td>" +currTable[i].title+ "</td><td>" +currTable[i].startDate+ "</td></tr>";
    }
    $('#employTableData').append(htmlContent);

    var currTable = employmentData.coopTable.coopInformation;

    htmlContent = "";
    for (var i = 0; i < currTable.length; i++) {
      htmlContent += "<tr><td>" +currTable[i].employer+ "</td><td>" +currTable[i].degree+ "</td><td>" +currTable[i].city+ "</td><td>" +currTable[i].term+ "</td><tr>";
    }

    $('#coopTableData').append(htmlContent);
   });

   myXhr('get', {path:'/people'}, null).done(function(json){
      peopleData = json;

      $('#peopleContainer').append("<h1>" +peopleData.title+ "</h1>");
      $('#peopleContainer').append("<h3>" +peopleData.subTitle+ "<h3>");

      for (var i = 0; i < peopleData.faculty.length; i++) {
        var personBox = '<div class="personBox"><h2>' +peopleData.faculty[i].name+ '</h2><p>' +peopleData.faculty[i].title+ '</p></div>';
        $('#peopleContainer').append(personBox);
      }

      for (var i = 0; i < peopleData.staff.length; i++) {
        var personBox = '<div class="personBox"><h2>' +peopleData.staff[i].name+ '</h2><p>' +peopleData.staff[i].title+ '</p></div>';
        $('#peopleContainer').append(personBox);
      }

      $('#modalPopup').dialog({
        modal: true,
        autoOpen: false
      });

      $('.personBox').each(function(i) {
        this.onclick = function() { openPersonModal(i) };
      });
   });

   myXhr('get', {path:'/research'}, null).done(function(json){
      researchData = json;
      
      htmlContent = "<ul>";

      for (var i = 0; i < researchData.byInterestArea.length; i++) {
        htmlContent += '<li><a href="#fragment'+i+'">'+researchData.byInterestArea[i].areaName+'</a></li>';
      }
    
      htmlContent += "</ul>";

      $('#researchTabs').append(htmlContent);

      htmlContent = "";

      for (var i = 0; i < researchData.byInterestArea.length; i++) {
        htmlContent += '<div id="fragment'+i+'">';

        var currArea = researchData.byInterestArea[i].citations;

        for (var j = 0; j < currArea.length; j++) {
          htmlContent += '<br>' +currArea[j]+ '<br>';
        }

        htmlContent += '</div>';
      }

      $('#researchTabs').append(htmlContent);
      

      $('#researchTabs').tabs({
        active: 0,
        collapsible: true
      });
  });

  myXhr('get', {path:'/footer'}, null).done(function(json){
    footerData = json;

    for (var i = 0; i < footerData.quickLinks.length; i++) {
      $('#links').append('<p><a href="'+footerData.quickLinks[i].href+'">'+footerData.quickLinks[i].title+'</a></p>');
    }

    $('#copyright').append("<h3>Copyright</h3>" +footerData.copyright.html);

    $('#socialMedia').append('<p><a href="'+footerData.social.facebook+'">Facebook</a></p>');
    $('#socialMedia').append('<p><a href="'+footerData.social.twitter+'">Twitter</a></p>');
  });

  myXhr('get', {path:'/news'}, null).done(function(json){
    console.dir(json);
  });
});

function openPersonModal(personDataIndex) {

  var personData;

  if (personDataIndex > 33) {
    personData = peopleData.staff[personDataIndex - 34];
  } else {
    personData = peopleData.faculty[personDataIndex];
  }
 
  $('#modalPopup').empty();
  $('#modalPopup').dialog({
    title: personData.name
  });
  $('#modalPopup').append('<img src="' +personData.imagePath+ '"></img>');
  $('#modalPopup').append('<p>Title: '+personData.title+ '</p><p>Email: ' +personData.email+ '</p><p>Office: ' +personData.office+ '</p><p>Phone: ' +personData.phone+ '</p><p>Username: ' +personData.username+ '</p>');
  $('#modalPopup').dialog("open");
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