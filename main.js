//PSEUDO CODE
    //Pseudo code idea - Cian
    // Pseudo code for MVP
    //FIRST CREATE APP OBJECT
        // For Namespacing
    const app = {};
    app.apiKey = 'c29c1aea1bc9d6b87f4f2175fcbf13c4';
    app.apiId = '8423c766';
    app.apiUrl = 'https://api.yummly.com/v1/api/recipes';
    
    app.recipesArray = [];
    // document ready function with init() function called within
    $(function(){
        app.init();  
    });

    // init function declaration
    app.init = function(){
       // declare initial object variables
        $('.user-input').on('submit', function(e){
            // event listener on button to call random recipe
            e.preventDefault();
            query = $('#search-recipe').val();
            queryType = typeof(query);
            if (query === ''){
                alert('Please, enter an ingredient.');
                // Add error handling message - no input
            } else {
                app.getRecipe(query);
                $('#search-recipe').val('');
                $('main').removeClass('display-none');           
            }
            $('#recipe-clicked').hide();
        });
        
        app.timeOfDay();
        // create event listener on "show recipes" button to call .getRecipte() function
    };

    // recipe function
            // ajax call to query Yummly api
            // randomly select recipe
            // chain .then() function to show response response on our site
    app.getRecipe = function(query){
        // adding select meal based on time of day
        mealType = app.timeOfDay();
        course = `course^course-${mealType}`;
        $.ajax({
            // api urls
            url: app.apiUrl,
            method:'GET',
            dataType:'json',
            data: {
             // api keys
                _app_key: app.apiKey,
                _app_id: app.apiId,
                format:'json',
                q: query,
                allowedCourse: course,
                maxResult: 100,
                requirePictures: true
            },

        }).then(function(results){
            $('.gallery').empty();
            if(results.matches.length === 0) {
                // Add error handling message - no results
                alert("Sorry, there's no results for your search. Try another ingredient.");
            } else {
                let responseArray = results.matches;
                let recipeArray = [];
                for(i = 0; i < 3; i++){
                    let index = Math.floor(Math.random() * 100);
                    recipeArray.push(responseArray[index]);           
                }
                app.displayRecipes(recipeArray);
            }
        }).fail(function(error){
            alert("Server error. Please, try again later.")
        });
    }
    
    // print results in the dom
    app.displayRecipes = function(array){
        app.recipesArray = [];
        let i = 0;
        array.forEach(function(item) {
            const title = item.recipeName;
            const image = item.imageUrlsBySize;
            // api returns 90px x 90px image
            // manipulate url to return a larger (700px x 700px) image than supplied by api
            const bigImage = image[90].slice(0, image[90].length -4) + "700-c";
            const ingredients = item.ingredients;
            const time = item.totalTimeInSeconds;
            const recipeid =  item.id;
            $('.gallery')
                .append(`<div class="photo-box"><a id="${i}" href="#recipe-clicked"><div class="gallery-title"><h2>${title}</h2></div><img src="${bigImage}" alt="${title}"></a></div>`);

            const recipe = {
                title:title,
                image:bigImage,
                ingredients:ingredients,
                time:time,
                recipeid:recipeid,
            };
            app.recipesArray.push(recipe);
            i++;
        }); 
        app.displaySelected(this); 
    }

    app.selectedRecipe = {}; 
    app.displaySelected = function(selectedRecipe){
        $('a').on('click', function () {
            const i = $(this).attr(`id`);

            $('#recipe-clicked').show();
            $('.recipe-title').html(app.recipesArray[i].title);
            $('.selected-image').attr('src', app.recipesArray[i].image);

            $('.ingredient-list').html('');
            app.recipesArray[i].ingredients.forEach(function(item){
                $('.ingredient-list').append(`<li>${item}</li>`);
            });
           
            $('.cooktime').html(app.recipesArray[i].time / 60 + " minutes");
            app.selectedRecipeCall(app.recipesArray[i].recipeid);

            $('.recipe-clicked h2').removeClass('display-none'); 
            $('.recipe-clicked').removeClass('display-none');  
            $('.wrapper').removeClass('display-none');  

        });
    };

    app.selectedRecipeCall = function(url){
        $.ajax({
            url: `https://api.yummly.com/v1/api/recipe/${url}`,
            method:'GET',
            dataType:'json',
            data: {
             // api keys
                _app_key: app.apiKey,
                _app_id: app.apiId,
                format:'json',
            }
        }).then(function(result){
            let externalLink = result.source.sourceRecipeUrl;
            $('.button-holder').html(`<a href="${externalLink}" target="_blank"><button>Check the instructions</button></a>`);
        });
    };

    //FUNCTION TO DETERMINE TIME OF DAY TO HELP RECOMMEND RECIPE
    app.timeOfDay = function(){
        let date = new Date();
        let hour = date.getHours();
        if (5 < hour && hour <= 11) {
            return "Breakfast";
        } else if (11 < hour && hour <= 15) {
            return "Lunch";
        } else if (15 < hour && hour <= 17) {
            return "Side Dishes";
        } else if (17 < hour && hour <= 20) {   
            return "Main Dishes";      
        } else if (20 < hour || hour <= 5) {
            return "Snacks";
        }

    }




// STRETCH GOALS
    //PICK A RECIPE BASED ON INGREDIENTS IN FRIDGE
    //PICK FOOD BASED ON COOKTIME ?
    //WEATHER API PICKS A FOOD BASED ON WEATHER
    //WEATHER API ASLO HAS THE TIME SO ADD IN TIME TO CRITERIA FOR FOOD CHOICE
    //OPTION FOR MOOD MUSIC TO PLAY WHILE COOKING FROM SPOTIFY API
