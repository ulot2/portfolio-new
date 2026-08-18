"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Tag } from "lucide-react";
import { PostMetadata } from "@/types/blog";
import { BlogCard } from "./BlogCard";

interface BlogListClientProps {
  posts: PostMetadata[];
  tags: { tag: string; count: number }[];
}

export const BlogListClient = ({ posts, tags }: BlogListClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTag =
        !selectedTag ||
        post.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        );

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <div className="blog-list-container">
      {/* Search & Tag Filter Controls */}
      <div className="blog-controls">
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic, or keyword..."
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        {tags.length > 0 && (
          <div className="tags-filter-bar">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`tag-filter-btn ${selectedTag === null ? "active" : ""}`}
            >
              All ({posts.length})
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`tag-filter-btn ${selectedTag === tag ? "active" : ""}`}
              >
                <Tag size={11} className="tag-btn-icon" />
                <span>{tag}</span>
                <span className="tag-count">({count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article Results Count */}
      <div className="posts-count-label">
        <span>
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          {selectedTag ? ` in "${selectedTag}"` : ""}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </span>
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <div className="blog-posts-grid">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-posts-state">
          <p className="empty-title">No articles found</p>
          <p className="empty-desc">
            Try adjusting your search query or removing active tag filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag(null);
            }}
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogListClient;
