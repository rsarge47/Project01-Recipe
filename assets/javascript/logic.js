function displayRecipe(){
    // need to solve bug created with spaces between words in ingredient input
    var ingredient1 = $('#ingredient1').val().trim();
    var ingredient2 = $('#ingredient2').val().trim();
    var ingredient3 = $('#ingredient3').val().trim();
    var ingredients = ingredient1 + "+" + ingredient2 + "+" + ingredient3;
    console.log("ingredient: " + ingredients);

    var base = "https://api.edamam.com/search?";
    var appId = "&app_id=bcfc903e";
    var appKey = "&app_key=1878067c0d9fc8775b5834269ffb3bed";
    var health = "&health=";
    var search = "q=" + ingredients;
    var queryURL = base + search + appId + appKey;
    
    console.log("queryURL: " + queryURL);
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        var results = response.hits[0].recipe.label;
        console.log(results);
      });
};