import {useState} from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapOFFProduct(product) {
  const n = product.nutriments || {};
  return {
    name: product.product_name || '',
    brand: product.brands || '',
    serving: product.serving_size || '100g',
    calories: Math.round(n['energy-kcal_100g'] ?? n['energy-kcal'] ?? 0),
    protein: +(n['proteins_100g'] ?? n['proteins'] ?? 0).toFixed(1),
    fat: +(n['fat_100g'] ?? n['fat'] ?? 0).toFixed(1),
    carbs: +(n['carbohydrates_100g'] ?? n['carbohydrates'] ?? 0).toFixed(1),
    fiber: +(n['fiber_100g'] ?? n['fiber'] ?? 0).toFixed(1),
    sugar: +(n['sugars_100g'] ?? n['sugars'] ?? 0).toFixed(1),
    salt: +(n['salt_100g'] ?? n['salt'] ?? 0).toFixed(2),
    saturatedFat:
        +(n['saturated-fat_100g'] ?? n['saturated-fat'] ?? 0).toFixed(1),
    nutriScore: product.nutrition_grades?.toUpperCase() || null,
    novaGroup: product.nova_group || null,
    imageUrl: product.image_front_url || product.image_url || null,
    ingredients: product.ingredients_text || null,
    allergens: product.allergens_tags?.map((t) => t.replace(/^en:/, ''))
                   .filter(Boolean) ||
        [],
    source: 'openfoodfacts',
  };
}

function getNutrientValue(nutrientsArray, nutrientNumber) {
  return nutrientsArray.find((n) => n.nutrientNumber === nutrientNumber)
             ?.value ??
      0;
}

function mapUSDAItem(item) {
  const n = item.foodNutrients || [];
  // USDA nutrient numbers: 208=calories, 203=protein, 204=fat,
  // 205=carbs, 291=fiber, 269=sugar, 307=sodium, 606=saturated fat
  return {
    name: item.description || '',
    brand: item.brandOwner || '',
    serving: '100g',
    calories: Math.round(getNutrientValue(n, '208')),
    protein: +getNutrientValue(n, '203').toFixed(1),
    fat: +getNutrientValue(n, '204').toFixed(1),
    carbs: +getNutrientValue(n, '205').toFixed(1),
    fiber: +getNutrientValue(n, '291').toFixed(1),
    sugar: +getNutrientValue(n, '269').toFixed(1),
    // USDA gives sodium (mg), convert to salt (g): sodium * 2.5 / 1000
    salt: +((getNutrientValue(n, '307') * 2.5) / 1000).toFixed(2),
    saturatedFat: +getNutrientValue(n, '606').toFixed(1),
    nutriScore: null,
    novaGroup: null,
    imageUrl: null,
    ingredients: null,
    allergens: [],
    source: 'usda',
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useOpenFoodFacts(usdaApiKey = '') {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState(null);  // "openfoodfacts" | "usda"

  async function lookup(query) {
    const food = query.trim();
    if (!food) return;

    setLoading(true);
    setError('');
    setResult(null);
    setSource(null);

    // ── Step 1: Try Open Food Facts ─────────────────────────────────────────
    try {
      const params = new URLSearchParams({
        search_terms: food,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 10,
        fields: [
          'product_name',
          'brands',
          'serving_size',
          'nutriments',
          'nutrition_grades',
          'nova_group',
          'image_front_url',
          'image_url',
          'ingredients_text',
          'allergens_tags',
        ].join(','),
      });

      const res = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?${params}`,
          {headers: {'User-Agent': 'NutriLook/1.0 (contact@nutrilook.app)'}});

      if (res.ok) {
        const data = await res.json();
        const product = data.products?.find(
                            (p) => p.nutriments?.['energy-kcal_100g'] > 0) ||
            data.products?.[0];

        // Use OFF result only if it has a name AND calories
        if (product?.product_name &&
            product?.nutriments?.['energy-kcal_100g'] > 0) {
          const mapped = mapOFFProduct(product);
          setResult(mapped);
          setSource('openfoodfacts');
          setLoading(false);
          return;
        }
      }
    } catch {
      // OFF failed silently — fall through to USDA
    }

    // ── Step 2: Fall back to USDA FoodData Central ──────────────────────────
    if (!usdaApiKey.trim()) {
      setError(`No packaged product found for "${
          food}". Add your USDA API key to search whole foods like chicken breast, rice, or tofu.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search` +
          `?query=${encodeURIComponent(food)}` +
          `&api_key=${usdaApiKey.trim()}` +
          `&pageSize=5` +
          `&dataType=Foundation,SR%20Legacy`  // whole foods only, no branded
                                              // duplicates
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || `USDA API error ${res.status}`);
      }

      const data = await res.json();

      if (!data.foods?.length) {
        throw new Error(
            `No results found for "${food}". Try a different name.`);
      }

      // Prefer results whose description closely matches the query
      const scored = data.foods.map(
          (f) => ({
            food: f,
            score: f.description.toLowerCase().includes(food.toLowerCase()) ?
                1 :
                0,
          }));
      const best = scored.sort((a, b) => b.score - a.score)[0].food;

      setResult(mapUSDAItem(best));
      setSource('usda');
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return {result, loading, error, source, lookup};
}