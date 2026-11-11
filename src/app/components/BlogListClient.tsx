"use client";

import React, { useState, useMemo } from "react";
import { PostMetadata } from "@/types/blog";
import { BlogCard } from "./BlogCard";
import { CrossIcon, RULE, Rule, SearchIcon, Underline } from "./ink";

interface BlogListClientProps {
  posts: PostMetadata[];
  tags: { tag: string; count: number }[];
}

export const BlogListClient = ({ posts, tags }: BlogListClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesTag =
        !selectedTag ||
        post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const filtering = searchQuery.trim() !== "" || selectedTag !== null;
  const reset = () => {
    setSearchQuery("");
    setSelectedTag(null);
  };

  return (
    <div className="bl-index">
      <div className="bl-controls hero-rise" style={{ "--i": 0 } as React.CSSProperties}>
        {/* A line to write on, rather than a box: it inks over in yellow on focus. */}
        <label className="bl-search">
          <span className="visually-hidden">Search writing</span>
          <SearchIcon className="bl-search-icon" />
          <input
            type="text"
            enterKeyHint="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, topic or keyword"
            className="bl-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="bl-search-clear"
              aria-label="Clear search"
            >
              <CrossIcon className="bl-search-clear-icon" />
            </button>
          )}
          <Rule className="bl-search-line">
            <path className="ink-line bl-search-trace" pathLength={1} vectorEffect="non-scaling-stroke" d={RULE} />
          </Rule>
        </label>

        {tags.length > 0 && (
          <div className="bl-tags" role="group" aria-label="Filter by topic">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="bl-tag"
              aria-pressed={selectedTag === null}
            >
              All
              <Underline className="bl-tag-underline" />
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className="bl-tag"
                aria-pressed={selectedTag === tag}
              >
                {tag}
                <sup className="bl-tag-count">
                  <span className="visually-hidden">, </span>
                  {count}
                  <span className="visually-hidden"> {count === 1 ? "piece" : "pieces"}</span>
                </sup>
                <Underline className="bl-tag-underline" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Only speaks up once something is being filtered. */}
      <p className="bl-count" aria-live="polite">
        {filtering && filteredPosts.length > 0 && (
          <>
            {filteredPosts.length} {filteredPosts.length === 1 ? "piece" : "pieces"}
            {selectedTag ? ` on ${selectedTag}` : ""}
            {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ""}
          </>
        )}
      </p>

      {filteredPosts.length > 0 ? (
        <ul className="bl-list">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index + 1} />
          ))}
        </ul>
      ) : (
        <div className="bl-empty">
          <SearchIcon className="bl-empty-icon" />
          <p className="bl-empty-title">Nothing written on that yet.</p>
          <p className="bl-empty-desc">Try another word, or go back to everything.</p>
          <button type="button" onClick={reset} className="bl-empty-reset">
            Show all writing
            <Underline className="bl-empty-underline" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogListClient;
