import { useEffect } from 'react';

export default function SEO({ title, description, image, url, type = 'website', recipe }) {
  useEffect(() => {
    // Update document title
    const fullTitle = title ? `${title} — Recipe Royale` : 'Recipe Royale — Discover the World, One Recipe at a Time';
    document.title = fullTitle;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title ? `${title} — Recipe Royale` : 'Recipe Royale');
    if (ogDesc && description) ogDesc.setAttribute('content', description);
    if (ogImage && image) ogImage.setAttribute('content', image);
    if (ogType) ogType.setAttribute('content', type);

    // Cleanup
    return () => {
      document.title = 'Recipe Royale — Discover the World, One Recipe at a Time';
    };
  }, [title, description, image, url, type]);

  // Add Recipe structured data
  useEffect(() => {
    if (!recipe) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      description: recipe.description,
      image: recipe.coverImage,
      author: recipe.author ? {
        '@type': 'Person',
        name: `${recipe.author.firstName} ${recipe.author.lastName}`,
      } : undefined,
      prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
      cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
      totalTime: recipe.totalTime ? `PT${recipe.totalTime}M` : undefined,
      recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
      recipeCategory: recipe.category?.name,
      recipeCuisine: recipe.cuisine,
      keywords: recipe.tags?.join(', '),
      nutrition: recipe.nutrition ? {
        '@type': 'NutritionInformation',
        calories: recipe.nutrition.calories ? `${recipe.nutrition.calories} calories` : undefined,
        proteinContent: recipe.nutrition.protein ? `${recipe.nutrition.protein}g` : undefined,
        carbohydrateContent: recipe.nutrition.carbs ? `${recipe.nutrition.carbs}g` : undefined,
        fatContent: recipe.nutrition.fat ? `${recipe.nutrition.fat}g` : undefined,
      } : undefined,
      recipeIngredient: recipe.ingredients?.map((ing) =>
        `${ing.amount ? `${ing.amount} ${ing.unit || ''}`.trim() : ''} ${ing.name}`.trim()
      ),
      recipeInstructions: recipe.instructions?.map((inst) => ({
        '@type': 'HowToStep',
        text: inst.description,
      })),
      aggregateRating: recipe.rating > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: recipe.rating,
        reviewCount: recipe.reviewCount || 0,
      } : undefined,
    };

    // Remove undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema));

    let script = document.getElementById('recipe-schema');
    if (script) {
      script.textContent = JSON.stringify(cleanSchema);
    } else {
      script = document.createElement('script');
      script.id = 'recipe-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(cleanSchema);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('recipe-schema');
      if (el) el.remove();
    };
  }, [recipe]);

  return null;
}
