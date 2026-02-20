import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const ARTICLES_PATH = path.join(process.cwd(), "content/articles");

export interface ArticleMeta {
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  urlToImage: string;
  slug: string;
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

function getSlugFromPath(filePath: string): string {
  const fileName = path.basename(filePath, ".md");
  return fileName;
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const dir = await fs.readdir(ARTICLES_PATH).catch(() => []);
  
  const articles: ArticleMeta[] = [];
  
  for (const file of dir) {
    if (!file.endsWith(".md")) continue;
    
    try {
      const filePath = path.join(ARTICLES_PATH, file);
      const fileContent = await fs.readFile(filePath, "utf8");
      const { data } = matter(fileContent);
      
      articles.push({
        title: data.title || "",
        description: data.description || "",
        publishedAt: data.publishedAt || "",
        category: data.category || "",
        urlToImage: data.urlToImage || "",
        slug: getSlugFromPath(file),
      });
    } catch (error) {
      console.error(`Error reading article ${file}:`, error);
    }
  }
  
  return articles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticle(slugSegments: string[]): Promise<Article | null> {
  const slug = slugSegments.join("/");
  const filePath = path.join(ARTICLES_PATH, `${slug}.md`);
  
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);
    
    return {
      meta: {
        title: data.title || "",
        description: data.description || "",
        publishedAt: data.publishedAt || "",
        category: data.category || "",
        urlToImage: data.urlToImage || "",
        slug,
      },
      content,
    };
  } catch (error) {
    return null;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return getArticle(slug.split("/"));
}
