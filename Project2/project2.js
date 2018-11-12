var locationData;      // These variables reference different data pulled from the API
var degreeData;
var minorData;
var aboutData;
var employmentData;
var peopleData;
var researchData;
var footerData;
var newsData;
var studentDegrees;

var ctx;              // Context of the canvas
var chart;            // chart obj
var map;              // Google API map obj
var chartData;        // data used to populate the chart

// This function is called on window.load, used for various initialization
function init() {

  // Initialize jQuery UI buttons
  $('#doughBtn').button({});
  $('#pieBtn').button({});
  $('#barBtn').button({});
  $('#radarBtn').button({});

  // Gets the context of the canvas
  ctx = document.getElementById("chart").getContext('2d');

  // Populates chart data that is used to build various kinds of charts
  chartData = {
    labels: ["WMC-BS", "CMIT-BS", "INFOTEC-BS", "ANSA-BS", "NETSYS-BS", "MEDINFO-BS", "HCIN-MS", "NETSYS-MS", "INFOTEC-MS", "MEDINFO-MS"],
    datasets: [{
        label: "Student Degrees",
        backgroundColor: [
          "blue",
          "red",
          "green",
          "purple",
          "black",
          "orange",
          "gold",
          "white",
          "pink"
        ],
        data: [
          studentDegrees.WMC_BS, 
          studentDegrees.CMIT_BS, 
          studentDegrees.INFOTEC_BS, 
          studentDegrees.ANSA_BS, 
          studentDegrees.NETSYS_BS, 
          studentDegrees.MEDINFO_BS,
          studentDegrees.HCIN_MS,
          studentDegrees.NETSYS_MS,
          studentDegrees.INFOTEC_MS,
          studentDegrees.MEDINFO_MS],
    }]
  };

  // Initializes a new chart based on the data
  chart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {}
});

  // Creates the Google API map
  initMap();

  // Creates the markers for the Google Map
  createMarkers();
}

// Intializes the Google API Map
function initMap() {

  // Coordinates of the center of the continental US
  var UScenter = {lat: 39.8283, lng: -98.5795};

  // Creates a new Google Map obj
  map = new google.maps.Map(
  document.getElementById('map'), {zoom: 5, center: UScenter});

  // Creates a new marker on the map
  var marker = new google.maps.Marker({position: UScenter, map: map})
}

// Used to populate certain values in the chartData object
function formatChartData(dataArray) {

  // Creates an object to hold a count of each type of student degree
  studentDegrees = {
    'WMC_BS': 0,
    'CMIT_BS': 0,
    'INFOTEC_BS': 0,
    'ANSA_BS': 0,
    'NETSYS_BS': 0,
    'MEDINFO_BS': 0,
    'HCIN_MS': 0,
    'NETSYS_MS': 0,
    'INFOTEC_MS': 0,
    'MEDINFO_MS': 0,
    'other': 0
  };

  // Increments the count of a specific degree based on its string value
  for (var i = 0; i < dataArray.length; i++) {
    switch(dataArray[i].degree) {
      case 'WMC-BS':
        studentDegrees.WMC_BS++;
        break;
      case 'CMIT-BS':
        studentDegrees.CMIT_BS++;
        break;
      case 'INFOTEC-BS':
        studentDegrees.INFOTEC_BS++;
        break;
      case 'ANSA-BS':
        studentDegrees.ANSA_BS++;
        break;
      case 'MEDINFO-BS':
        studentDegrees.MEDINFO_BS++;
        break;
      case 'NETSYS-BS':
        studentDegrees.NETSYS_BS++;
        break;
      case 'HCIN-MS':
        studentDegrees.HCIN_MS++;
        break;
      case 'NETSYS-MS':
        studentDegrees.NETSYS_MS++;
        break;
      case 'INFOTEC-MS':
        studentDegrees.INFOTEC_MS++;
        break;
      case 'MEDINFO-MS':
        studentDegrees.MEDINFO_MS++;
        break;
      default:
        studentDegrees.other++;
        break;
    }
  }
}

// Creates a pie chart
function createPieChart() {
  chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: chartData,
    options: {}
  });
}

// Creates a doughnut chart
function createDoughnutChart() {
  chart.destroy();
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: {}
  });
}

// Creates a radar chart
function createRadarChart() {
  chart.destroy();
  chart = new Chart(ctx, {
    type: 'radar',
    data: chartData,
    options: {}
  });
}

// Creates a bar chart
function createBarChart() {
  chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {}
  });
}

// This function is called when the document is ready, handles AJAX calls to get data from the API
$(document).ready(function(){

  // Gets the location data and stores it
  myXhr('get',{path:'/location'},'#about').done(function(json){
      locationData = json;
  });

  // Gets the about data, stores it, and dynamically creates HTML based on data
  myXhr('get', {path:'/degrees'}, '#about').done(function(json){
    
    // Stores the API data
    degreeData = json;

    // Loops through all undergraduate degrees and creates html elements to display them
    for (var i = 0; i < degreeData.undergraduate.length; i++) {
      $('#UNDdegrees').append('<div class="degree"><h2>' +degreeData.undergraduate[i].title+ '</h2><p>' +degreeData.undergraduate[i].description+ '</p></div>');
    }

    // Loops through all graduate degrees and creates html elements to display them
    for (var i = 0; i < degreeData.graduate.length - 1; i++) {
      $('#GRDdegrees').append('<div class="degree"><h2>' +degreeData.graduate[i].title+ '</h2><p>' +degreeData.graduate[i].description+ '</p></div>');
    }
  });

  // Gets the minor data and dynamically creates html elements to display it
  myXhr('get', {path:'/minors'}, '#about').done(function(json){
    
    // Stores the API data
    minorData = json;

    // Loops through all minors
    for (var i = 0; i < minorData.UgMinors.length; i++) {

      // Creates a title for each minor
      $(accordionMinors).append("<h3>" +minorData.UgMinors[i].title+ "</h3>");

      // Creates a description for each minor
      var divContent = "<div>Description<br><br> " +minorData.UgMinors[i].description+ "<br><br>Courses<br><br>";
      
      // Loops through all the courses for a specific minor and adds the content to get appeneded
      for (var j = 0; j < minorData.UgMinors[i].courses.length; j++) {
        divContent += (minorData.UgMinors[i].courses[j]+ "<br>"); 
      }

      // Adds a closing div tag
      divContent += "</div>";
    
      // Appends all the html content to the accordion object
      $(accordionMinors).append(divContent);
    }

    // Intializes the jQuery accordion obj
    $("#accordionMinors").accordion({
      collapsible: true,
      active: false,
      heightStyle: "content"
    });
  });

  // Gets the about data from the API
  myXhr('get', {path:'/about'}, '#about').done(function(json){
    
    // Stores the API data
    aboutData = json;

    // Creates a title
    $('#aboutTitle').html("<h1>" +aboutData.title+ "</h1>");

    // Creates a description
    $('#aboutDescription').html("<p>" +aboutData.description+ "</p>");

    // Creates a quote
    $('#aboutQuote').html('<p>"' +aboutData.quote+ '"</p>');

    // Creates the author
    $('#aboutAuthor').html("<p>" +aboutData.quoteAuthor+ "</p>");    
  });

  // Gets the employment data from the API
  myXhr('get', {path:'/employment'}, null).done(function(json){
    
    // Stores the API data
    employmentData = json;

    // Creates an introduction title and appends it to the document
    var htmlContent = "<h2>" +employmentData.introduction.title+ "</h2>";
    $('#employment').append(htmlContent);

    // Creates a description and appends it to the document
    htmlContent = "<p>" +employmentData.introduction.content[0].description+ "</p>";
    $('#employment').append(htmlContent);

    // Creates another content title and appends it to the document
    htmlContent = "<h2>" +employmentData.introduction.content[1].title+ "</h2>";
    $('#employment').append(htmlContent);

    // Creates another content description and appends it to the document
    htmlContent = "<p>" +employmentData.introduction.content[1].description+ "</p>";
    $('#employment').append(htmlContent);

    // Creates a div, header2, and unordered list for new content 
    htmlContent = '<div id="careers">';
    htmlContent += "<h2>" +employmentData.careers.title+ "</h2>";
    htmlContent += "<ul>";
   
    // Loops through all career names and adds them to the unordered list
    for (var i = 0; i < employmentData.careers.careerNames.length; i++) {
      htmlContent += "<li>" +employmentData.careers.careerNames[i]+ "</li>";
    }

    // Closes the unordered list and appends the content to the document
    htmlContent += '</ul></div>';
    $('#employment').append(htmlContent);

    // Creates a div, header2, and unordered list for the employers content
    htmlContent = '<div id="employers">';
    htmlContent += "<h2>" +employmentData.employers.title+ "</h2>";
    htmlContent += "<ul>"
    
    // Loops through all employers and adds the content to the unordered list
    for (var i = 0; i < employmentData.employers.employerNames.length; i++) {
      htmlContent += "<li>" +employmentData.employers.employerNames[i]+ "</li>";
    }

    // Closes the div and unordered list and appends content to the document
    htmlContent += '</ul></div>';
    $('#employment').append(htmlContent);
    
    // Adds a title for the degree statistics and appends it to the document
    htmlContent = "<h2>" +employmentData.degreeStatistics.title+ "<h2>";
    $('#employment').append(htmlContent);

    // Starts a new unordered list
    htmlContent = "<ul>";

    // Loops through all statistics and adds it to the unordered list
    for (var i = 0; i < employmentData.degreeStatistics.statistics.length; i++) {
      htmlContent += "<li>" +employmentData.degreeStatistics.statistics[i].value+ " - " +employmentData.degreeStatistics.statistics[i].description+ "</li>";
    }

    // Closes the unordered list and appends it to the document
    htmlContent += "</ul>";
    $('#employment').append(htmlContent);

    // Gets reference to the current employment table to work with
    var currTable = employmentData.employmentTable.professionalEmploymentInformation;

    // Formats Chart data based on the professional Employment Table information
    formatChartData(employmentData.employmentTable.professionalEmploymentInformation);
    
    // Clears the htmlContent obj
    htmlContent = "";

    // Loops through all the employment table content and creates a table entry for each value
    for (var i = 0; i < currTable.length; i++) {
      htmlContent += "<tr><td>" +currTable[i].employer+ "</td><td>" +currTable[i].degree+ "</td><td>" +currTable[i].city+ "</td><td>" +currTable[i].title+ "</td><td>" +currTable[i].startDate+ "</td></tr>";
    }

    // Appends all the employment table data to the document
    $('#employTableData').append(htmlContent);

    // Gets reference to the coop table data
    var currTable = employmentData.coopTable.coopInformation;

    // Clears the htmlContent obj
    htmlContent = "";

    // Loops through all the coop table content and creates a table entry for each table
    for (var i = 0; i < currTable.length; i++) {
      htmlContent += "<tr><td>" +currTable[i].employer+ "</td><td>" +currTable[i].degree+ "</td><td>" +currTable[i].city+ "</td><td>" +currTable[i].term+ "</td><tr>";
    }

    // Appends the coop table data to the document
    $('#coopTableData').append(htmlContent);
   });

   // Gets the people data from the API
   myXhr('get', {path:'/people'}, null).done(function(json){
      
      // Stores the API data
      peopleData = json;

      // Appends a title and subtitle for the people section
      $('#peopleContainer').append("<h1>" +peopleData.title+ "</h1>");
      $('#peopleContainer').append("<h3>" +peopleData.subTitle+ "<h3>");

      // Loops through all the faculty and creates a box that holds their name and title, then appends to document
      for (var i = 0; i < peopleData.faculty.length; i++) {
        var personBox = '<div class="personBox"><h2>' +peopleData.faculty[i].name+ '</h2><p>' +peopleData.faculty[i].title+ '</p></div>';
        $('#peopleContainer').append(personBox);
      }

      // Loops through all the staff and creates a box that holds their name and title, then appends to document
      for (var i = 0; i < peopleData.staff.length; i++) {
        var personBox = '<div class="personBox"><h2>' +peopleData.staff[i].name+ '</h2><p>' +peopleData.staff[i].title+ '</p></div>';
        $('#peopleContainer').append(personBox);
      }

      // Initializes a modal popup obj in jQuery
      $('#modalPopup').dialog({
        modal: true,
        autoOpen: false
      });

      // Creates an onclick event for each person box that opens a modal with their information
      $('.personBox').each(function(i) {
        this.onclick = function() { openPersonModal(i) };
      });
   });

   // Gets the research data from the API
   myXhr('get', {path:'/research'}, null).done(function(json){
      
      // Stores the data from the API
      researchData = json;
      
      // Starts an unordered list
      htmlContent = "<ul>";

      // Loops through all the interest areas and creates a 'tab title' for each one
      for (var i = 0; i < researchData.byInterestArea.length; i++) {
        htmlContent += '<li><a href="#fragment'+i+'">'+researchData.byInterestArea[i].areaName+'</a></li>';
      }
    
      // Closes the unordered list
      htmlContent += "</ul>";

      // Appends the object to the document
      $('#researchTabs').append(htmlContent);

      // Clears the htmlContent obj
      htmlContent = "";

      // Loops through all the publications of the interest areas
      for (var i = 0; i < researchData.byInterestArea.length; i++) {
       
        // Creates a new div for each entry
        htmlContent += '<div id="fragment'+i+'">';

        // Gets reference to all the citations for each entry
        var currArea = researchData.byInterestArea[i].citations;

        // Creates an object for each citation
        for (var j = 0; j < currArea.length; j++) {
          htmlContent += '<br>' +currArea[j]+ '<br>';
        }

        // Closes the div
        htmlContent += '</div>';
      }

      // Appends all data to the document
      $('#researchTabs').append(htmlContent);
      
      // Intializes the jQuery tab element
      $('#researchTabs').tabs({
        active: 9,
        collapsible: true
      });
  });

  // Gets the footer data from the API
  myXhr('get', {path:'/footer'}, null).done(function(json){
    
    // Stores the data from the API
    footerData = json;

    // Loops through all the links in the footer and appends them to the document
    for (var i = 0; i < footerData.quickLinks.length; i++) {
      $('#links').append('<p><a href="'+footerData.quickLinks[i].href+'">'+footerData.quickLinks[i].title+'</a></p>');
    }

    // Appends the copyright object to the page
    $('#copyright').append("<h3>Copyright</h3>" +footerData.copyright.html);

    // Appends the social media objects to the page
    $('#socialMedia').append('<p><a href="'+footerData.social.facebook+'">Facebook</a></p>');
    $('#socialMedia').append('<p><a href="'+footerData.social.twitter+'">Twitter</a></p>');
  });
});

// This function is called when a user clicks on a person box, it creates a modal object that contains all the relevant data about that person
function openPersonModal(personDataIndex) {

  // Holds data about that specific person
  var personData;

  // Gets the data about the person based on the index of the object the user clicked on
  if (personDataIndex > 33) {
    personData = peopleData.staff[personDataIndex - 34];
  } else {
    personData = peopleData.faculty[personDataIndex];
  }

  // Clears the data inside the mmodal
  $('#modalPopup').empty();

  // Creates a title for that person inside the modal
  $('#modalPopup').dialog({
    title: personData.name
  });

  // Creates an image for the person
  $('#modalPopup').append('<img src="' +personData.imagePath+ '"></img>');

  // Creates a title, email, office, phoneNumber, and username for each person
  $('#modalPopup').append('<p>Title: '+personData.title+ '</p><p>Email: ' +personData.email+ '</p><p>Office: ' +personData.office+ '</p><p>Phone: ' +personData.phone+ '</p><p>Username: ' +personData.username+ '</p>');

  // Opens the modal object
  $('#modalPopup').dialog("open");
}

// Used to create markers for the Google Map
function createMarkers() {

  // Loops through all the locations from the API data and creates a markers based on the given coordinates
  for (var i = 0; i < locationData.length; i++) {

    // Creates a coordinate object
    var coords = { lat: parseFloat(locationData[i].latitude), lng: parseFloat(locationData[i].longitude) };

    // Creates a marker based on the coordinate data
    var marker = new google.maps.Marker({position: coords, map: map});
  }  
}

// Basic function used to make an AJAX call to the API using the proxy
function myXhr(t, d, id){
    return $.ajax({
	    type:t,
	    url:'http://serenity.ist.rit.edu/~plgics/proxy.php',
	    dataType:'json',
    	data:d,
    	cache:false,
    	async:true,
    });
}

// Hooks up the init function to the window.onload event
window.onload = init;