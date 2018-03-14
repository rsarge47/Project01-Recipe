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
        var recipeDiv = $("<div class='displayRecipe'>");

        for (var i = 0; i < results.length; i++) {
                        
            var recipeName = $("<h3 class='recipeName'>").text(results[i].recipe.label);            
            var recipeImage = $("<img class='recipeImage'>").attr("src", results[i].recipe.image).attr("alt", results[i].recipe.label);
            var recipeIng = $("<p class='recipeIng'>").text(results[i].recipe.ingredientLines);
            // why is this link loooking for url on my hard drive?
            var recipeLink = $('<a class="recipeLink">').text(results[i].recipe.url).attr('href', '"' + results[i].recipe.url + '"').attr("target", "_blank");

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
})