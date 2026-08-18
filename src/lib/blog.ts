import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMetadata } from '@/types/blog';

const POSTS_PATH = path.join(process.cwd(), 'content/posts');

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '').replace(/[#*`_~\[\]]/g, '');
  const wordCount = cleanContent.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_PATH)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_PATH)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(POSTS_PATH, `${slug}.mdx`);
  const mdPath = path.join(POSTS_PATH, `${slug}.md`);

  let filePath = '';
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const metadata: PostMetadata = {
    title: data.title || 'Untitled Post',
    description: data.description || '',
    date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
    tags: Array.isArray(data.tags) ? data.tags : [],
    slug: slug,
    readingTime: calculateReadingTime(content),
    published: data.published !== undefined ? Boolean(data.published) : true,
    coverImage: data.coverImage || undefined,
    featured: Boolean(data.featured),
  };

  return {
    metadata,
    content,
  };
}

export function getAllPosts(): PostMetadata[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && post.metadata.published)
    .map((post) => post.metadata)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getFeaturedPosts(limit = 3): PostMetadata[] {
  const allPosts = getAllPosts();
  const featured = allPosts.filter((post) => post.featured);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }
  // Fill remaining slots with latest posts
  const remaining = allPosts.filter((post) => !post.featured);
  return [...featured, ...remaining].slice(0, limit);
}

export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
