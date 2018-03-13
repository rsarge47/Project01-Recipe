function displayRecipe(){
    // need to solve bug created with spaces between words in ingredient input
    var ingredient1 = $('#ingredient1').val().trim();
    var ingredient2 = $('#ingredient2').val().trim();
    var ingredient3 = $('#ingredient3').val().trim();
    var ingredients = ingredient1 + "+" + ingredient2 + "+" + ingredient3;
    console.log("ingredient: " + ingredients);
   
    var diet = document.querySelector('input[name="diet"]:checked').value;
    console.log("Diet: " + diet);
    
    // This is making an array of the checkbox's that have been checked
    var allergy = [];
    $(':checkbox:checked').each(function(i){
        allergy[i] = $(this).val();
    });
    // This is taking the array and displaying it with +'s in between each value
    var allergies = allergy.join("+");
    console.log("allergies: " + allergies);

    var base = "https://api.edamam.com/search?";
    var appId = "&app_id=bcfc903e";
    var appKey = "&app_key=1878067c0d9fc8775b5834269ffb3bed";
    // This isn't fixed, and it breaks the URL
    var health = "&health=" + diet + "+" + allergies;
    var search = "q=" + ingredients;
    var queryURL = base + search + appId + appKey;
    
    console.log("queryURL: " + queryURL);
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        var results = response.hits[0].recipe.label;
        $('.name').text(results);
        console.log(results);
      });
};