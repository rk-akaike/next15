export const fetchDummyReviews = async () => {
  try {
    // Fetch data from a public API (JSONPlaceholder) with a query parameter for English language
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_lang=en"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dummy reviews");
    }

    const data = await response.json();

    // Transform the data to match your application format
    const reviews = data.slice(0, 100).map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.body,
    }));

    return reviews;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function fetchDummyData(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}
