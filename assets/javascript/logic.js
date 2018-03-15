// Firebase config and initialization
var config = {
    apiKey: "AIzaSyD1KKJPWXtJjBrQsi6oR6rgLVNw5ckKnOE",
    authDomain: "recipeapi-c3e05.firebaseapp.com",
    databaseURL: "https://recipeapi-c3e05.firebaseio.com",
    projectId: "recipeapi-c3e05",
    storageBucket: "recipeapi-c3e05.appspot.com",
    messagingSenderId: "585051342056"
    };
firebase.initializeApp(config);

var searchCounter = 0;

// Firebase is displaying last 5 search terms and tracking number of searches
firebase.database().ref().limitToLast(5).on('child_added', function(snap) {
    $("#searchNum").text(snap.val().searchCount);
    $(".searchTab").prepend("<tr><td> " +
        snap.val().diet + " </td><td> " +
        snap.val().ing1 + " </td><td> " +
        snap.val().ing2 + " </td><td> " +
        snap.val().ing3 + "</td><td> " +
        snap.val().health + "</td></tr>");
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// Start of first API (edamam)

function displayRecipe(){
    var ingredient1 = $('#ingredient1').val().trim();
    var ingredient2 = $('#ingredient2').val().trim();
    var ingredient3 = $('#ingredient3').val().trim();
    var ingredients = ingredient1 + "+" + ingredient2 + "+" + ingredient3;
    console.log("ingredients: " + ingredients);
    var search = "q=" + ingredients;
   
    var diet = document.querySelector('input[name="diet"]:checked').value;
    console.log("Diet: " + diet);
    diet = "&diet=" + diet;
    
    var health = document.querySelector('input[name="health"]:checked').value;
    console.log("Health: " + health);
    health = "&health=" + health;

    var base = "https://api.edamam.com/search?";
    var appId = "&app_id=bcfc903e";
    var appKey = "&app_key=1878067c0d9fc8775b5834269ffb3bed";
    
    var queryURL = base + search + appId + appKey + diet + health;    
    console.log("queryURL: " + queryURL);
    
    // Sends the queryURL to recipe API and returns JSON
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "jsonp"
      }).then(function(response) {        
        var results = response.hits;


        if (!response.more) {
            var noResponse = $("<h3 class='noResponse'>").text("Sorry, no recipes for " + ingredient1 + ", " + ingredient2 + ", " + ingredient3);
            $("#recipeDisplay").prepend(noResponse);
            console.log(noResponse);
        }

        var recipeDiv = $("<div class='displayRecipe'>");
        for (var i = 0; i < results.length; i++) {

            var recipeName = $("<h3 class='recipeName'>").text(results[i].recipe.label);            
            var recipeImage = $("<img class='recipeImage'>").attr("src", results[i].recipe.image).attr("alt", results[i].recipe.label);
            var recipeIng = $("<p class='recipeIng'>").text(results[i].recipe.ingredientLines);
            // why is this link loooking for url on my hard drive?
            var recipeLink = $('<a class="recipeLink">').text(results[i].recipe.url).attr('href', results[i].recipe.url).attr("target", "_blank");
            var infoDiv = $("<div class='recipe'>").append(recipeImage, recipeName, recipeIng, recipeLink);
            recipeDiv.append(infoDiv);      
         
        };
        $("#recipeDisplay").prepend(recipeDiv);
      });
};
  
// When you click submit button a search is performed in the recipe API
$('#submit').on('click', function(event) {
    event.preventDefault();
    displayRecipe();
});



//start of wiki API
//----------------------------------------------------------------------------


function displayWiki(){
        var wikiSearch = $('#wikiSearch').val().trim();
        console.log(wikiSearch);

    function validateForm() {
        if (wikiSearch == "") {
            $("#alert").html("Search must be filled out");
            return false;
        } else {
            $("#alert").html("");
            return true;
        }
     }

	if(!validateForm()) {
          return;
        }


        var wikiqueryURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + wikiSearch + "&limit=1&namespace=0&format=json";
        console.log(wikiqueryURL);
    
    $.ajax({
        url: wikiqueryURL,
        method: "GET",
        dataType: 'jsonp'
      }).then(function(response) {
        var results = response;

        console.log(results);

        var wikiDiv = $("<div class='displayWiki'>");
        var wikiName = $("<h3 class='wikiName'>").text(results[1]);
        var wikiDescription = $("<p class='wikiDescription'>").text(results[2]);
        var wikiURL = $("<a class='wikiURL'>").text(results[3]).attr('href', results[3]).attr("target", "_blank");
        $("#wikiDisplay").prepend(wikiName, wikiDescription, wikiURL);

      });

    }
    
    $('#wikiSubmit').on('click', function(event) {
        event.preventDefault();
        displayWiki();
        $('#wikiSearch').val('');
    });

    $("#wikiClear").on('click', function(event) {
        event.preventDefault();
        $("#wikiDisplay").empty();
    });

