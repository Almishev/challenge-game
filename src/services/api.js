const API_BASE_URL = process.env.REACT_APP_API_URL;

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function getChallengesByCategory(category) {
  const res = await fetch(`${API_BASE_URL}/challenges/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error('Failed to load challenges');
  return res.json();
}


