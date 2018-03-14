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

// This takes input from Form and searches RecipeAPI, then displays recipes
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

    // Pushing search criteria to firebase
    searchCounter ++;    
        
    firebase.database().ref().push({
        searchCount:searchCounter,
        ingredients:ingredients,
        diet:diet,
        health:health,
        dateAdded:firebase.database.ServerValue.TIMESTAMP
    });
    
    // Sends the queryURL to recipe API and returns JSON
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "jsonp"
      }).then(function(response) {        
        var results = response.hits;
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
    $('input[name="ingredient"]').val('');    
})

// Firebase is tracking amount of recipe searches
firebase.database().ref().on('child_added', function(snap) {
    $("#searchNum").text(snap.val().searchCount);
    searchCounter = snap.val().searchCount;
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});