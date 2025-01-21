export const fetchDummyReviews = async (): Promise<
  { id: number; title: string; content: string }[]
> => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_lang=en"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dummy reviews");
    }

    const data = await response.json();

    return data
      .slice(0, 100)
      .map((item: { id: number; title: string; body: string }) => ({
        id: item.id,
        title: item.title,
        content: item.body,
      }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function fetchDummyData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}
