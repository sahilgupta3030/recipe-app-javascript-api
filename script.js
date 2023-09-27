const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipe_container = document.querySelector(".recipe_container");

const recipe_close_btn = document.querySelector(".recipe_close_btn");
const recipe_details_content = document.querySelector(
  ".recipe_details_content"
);

const fetchRecipes = async (query) => {
  // get recipes from TheMealDB api
  recipe_container.innerHTML = "<h3>Fetching recipes...</h3>";

  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipe_container.innerHTML = "";

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span> Dish</p>
    <p>Belongs to <span>${meal.strCategory}</span> Category</p>

    `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      // adding eventListener to recipe button
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipe_container.appendChild(recipeDiv);
    });
  } catch (error) { 
    recipe_container.innerHTML = "<h2>Error in fetching recipes.</h2>";
  }
};

const fetchIngredients = (meal) => {
  let ingredientList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientList;
};

const openRecipePopup = (meal) => {
  recipe_details_content.innerHTML = `
<h2 class="recipeName">${meal.strMeal}</h2>
<h3>Ingredients:</h3><br>
<ul class="ingredientList">${fetchIngredients(meal)}</ul>
<div class="recipeInstructions">
  <h3>Instructions:</h3>
  <p>${meal.strInstructions}</p>
</div>
`;
  recipe_details_content.parentElement.style.display = "block";
};

recipe_close_btn.addEventListener("click", () => {
  recipe_details_content.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  // to avoid auto refresh while clicking
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipe_container.innerHTML = `<h2>Type the meal in the Search box!</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});
