export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  readingTime: string;
  published: boolean;
  coverImage?: string;
  featured?: boolean;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}
