/**
 * News Service
 * Fetches financial news from the backend API
 */

const API_URL = "https://api.zecant.com";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  category: string[];
}

export interface NewsResponse {
  category?: string;
  articles: NewsArticle[];
  count: number;
}

/**
 * Get news by category
 */
export async function getNewsByCategory(
  category: string = "general",
  maxResults: number = 10,
  getToken: () => Promise<string | null>
): Promise<NewsResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/news?category=${category}&max_results=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
}

/**
 * Get latest financial news headlines
 */
export async function getLatestNews(
  maxResults: number = 20,
  getToken: () => Promise<string | null>
): Promise<NewsResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/news/latest?max_results=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch latest news");
  }

  return response.json();
}
