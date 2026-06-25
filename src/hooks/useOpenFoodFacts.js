import {useState} from 'react';

// ── Helpers
// ───────────────────────────────────────────────────────────────────

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

function getNutrientValue(arr, num) {
  return arr.find((n) => n.nutrientNumber === num)?.value ?? 0;
}

function mapUSDAItem(item) {
  const n = item.foodNutrients || [];
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

// ── Hook
// ──────────────────────────────────────────────────────────────────────

export function useOpenFoodFacts() {
  const [results, setResults] = useState([]);  // all results
  const [selectedIndex, setSelectedIndex] =
      useState(0);  // which one is in focus
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState(null);

  // The focused result — what NutritionCard shows
  const result = results[selectedIndex] ?? null;

  async function lookup(query) {
    const food = query.trim();
    if (!food) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSelectedIndex(0);
    setSource(null);

    const allResults = [];

    // ── Step 1: Open Food Facts
    // ───────────────────────────────────────────────
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
        const valid = (data.products || [])
                          .filter(
                              (p) => p.product_name &&
                                  (p.nutriments?.['energy-kcal_100g'] > 0));
        allResults.push(...valid.map(mapOFFProduct));
      }
    } catch { /* fall through */
    }

    // ── Step 2: USDA via serverless proxy
    // ─────────────────────────────────────
    try {
      const res =
          await fetch(`/api/nutrition?query=${encodeURIComponent(food)}`);

      if (res.ok) {
        const data = await res.json();
        const valid =
            (data.foods || [])
                .filter(
                    (f) => f.description &&
                        getNutrientValue(f.foodNutrients || [], '208') > 0);
        allResults.push(...valid.map(mapUSDAItem));
      }
    } catch { /* fall through */
    }

    if (allResults.length === 0) {
      setError(
          `No results found for "${food}". Try a different name or spelling.`);
      setLoading(false);
      return;
    }

    // Best result: prefer OFF with calories, then anything with calories
    const bestIndex = allResults.findIndex(
        (r) => r.source === 'openfoodfacts' && r.calories > 0);
    setSelectedIndex(bestIndex >= 0 ? bestIndex : 0);
    setResults(allResults);
    setSource(allResults[bestIndex >= 0 ? bestIndex : 0].source);
    setLoading(false);
  }

  function selectResult(index) {
    setSelectedIndex(index);
    setSource(results[index]?.source ?? null);
  }

  return {
    result,
    results,
    selectedIndex,
    selectResult,
    loading,
    error,
    source,
    lookup
  };
}