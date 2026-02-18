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
  tags: string[];
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface NewsResponse {
  category?: string;
  articles: NewsArticle[];
  count: number;
}

export interface PaginatedNewsResponse {
  category: string;
  articles: NewsArticle[];
  pagination: PaginationInfo;
}

export interface TagInfo {
  name: string;
  count: number;
}

export interface TagsResponse {
  tags: TagInfo[];
}

/**
 * Get paginated news by category
 */
export async function getNewsPaginated(
  category: string = "general",
  page: number = 1,
  pageSize: number = 20,
  getToken: () => Promise<string | null>
): Promise<PaginatedNewsResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/news?category=${category}&page=${page}&page_size=${pageSize}`,
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
 * Get news by category (legacy - for backward compatibility)
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
    `${API_URL}/news?category=${category}&page=1&page_size=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data: PaginatedNewsResponse = await response.json();
  return {
    category: data.category,
    articles: data.articles,
    count: data.pagination.total_count,
  };
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

/**
 * Get popular tags with article counts
 */
export async function getPopularTags(
  limit: number = 20,
  getToken: () => Promise<string | null>
): Promise<TagsResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/news/tags?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }

  return response.json();
}
