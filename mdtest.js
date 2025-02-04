function parseRecipe(markdown) {
    const recipe = {
        name: '',
        description: '',
        ingredients: [],
        steps: [],
        additional_info: ''
    };

    // Split the markdown by lines
    const lines = markdown.split('\n');

    let currentSection = '';

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('### Recipe Name:')) {
            recipe.name = line.replace('### Recipe Name:', '').trim();
        } else if (line.startsWith('1) **Description**:')) {
            currentSection = 'description';
            recipe.description = line.replace('1) **Description**:', '').trim();
        } else if (line.startsWith('2) **Ingredients**:')) {
            currentSection = 'ingredients';
        } else if (line.startsWith('3) **Steps**:')) {
            currentSection = 'steps';
        } else if (line.startsWith('4) **Extra Information**:')) {
            currentSection = 'additional_info';
        } else if (currentSection === 'ingredients' && line.startsWith('- ')) {
            recipe.ingredients.push(line.replace('- ', '').trim());
        } else if (currentSection === 'steps' && line.match(/^\d+\.\s*/)) {
            recipe.steps.push(line.replace(/^\d+\.\s*/, '').trim());
        } else if (currentSection === 'additional_info') {
            recipe.additional_info += line + ' ';
        }
    });

    // Clean up any trailing spaces in the additional_info field
    recipe.additional_info = recipe.additional_info.trim();

    return { Recipes: [recipe] };
}
const markdownInput = `### Recipe Name: Chicken Mole

1) **Description**: A rich and flavorful traditional Mexican dish featuring tender chicken smothered in a savory, slightly sweet mole sauce.

2) **Ingredients**:
   - 4 chicken thighs
   - 2 cups mole sauce (store-bought or homemade)
   - 1 tablespoon vegetable oil
   - 1 cup chicken broth
   - 1 teaspoon sesame seeds (for garnish)
   - Salt and pepper to taste
   - Tortillas (for serving)
   - Lime wedges (for serving)
   - Fresh cilantro (for garnish)

3) **Steps**:
   1. In a large skillet, heat the vegetable oil over medium heat. Season the chicken thighs with salt and pepper, then add them to the skillet, browning each side for about 5 minutes.
   2. Pour in the mole sauce and chicken broth, ensuring the chicken is covered. Bring to a simmer, then reduce the heat to low and cover the skillet. Cook for 25-30 minutes, or until the chicken is fully cooked and tender.
   3. Once cooked, remove the chicken and let it rest for a few minutes. Serve the chicken on a plate, drizzled with the mole sauce. Garnish with sesame seeds, lime wedges, and fresh cilantro.

4) **Extra Information**:
   - Serve with warm tortillas to scoop up the mole sauce and chicken.
   - For a spicier mole, add chopped chipotle peppers or a dash of cayenne pepper.
   - Pair with Mexican rice or beans for a complete meal.`;

const recipeJson = parseRecipe(markdownInput);

console.log(JSON.stringify(recipeJson, null, 2))