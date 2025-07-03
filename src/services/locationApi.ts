// Utility functions to fetch states and cities from online APIs
// Only states and cities are fetched dynamically; countries remain static

// export async function fetchCountries() {
//   const res = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
//   const data = await res.json();
//   if (data.data) {
//     return data.data.map((c: any) => c.name);
//   }
//   return [];
// }

export async function fetchStates(country: string) {
  const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country })
  });
  const data = await res.json();
  if (data.data && data.data.states) {
    return data.data.states.map((s: any) => s.name);
  }
  return [];
}

export async function fetchCities(country: string, state: string) {
  const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, state })
  });
  const data = await res.json();
  if (data.data) {
    return data.data;
  }
  return [];
}
