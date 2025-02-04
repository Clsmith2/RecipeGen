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

module.exports = parseRecipe;
