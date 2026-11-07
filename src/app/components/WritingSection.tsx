import { getFeaturedPosts } from "@/lib/blog";
import { BLOG_URL } from "@/lib/site";
import { ArrowIcon, OutArrowIcon, Underline } from "./ink";
import { SectionHeading } from "./SectionHeading";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const WritingSection = () => {
  const posts = getFeaturedPosts(3);
  if (!posts || posts.length === 0) return null;

  return (
    <section className="section" id="writing">
      <SectionHeading word="writing" label="Writing" />

      <ul className="wr-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <a className="wr-link" href={`${BLOG_URL}/${post.slug}`}>
              <span className="wr-meta">
                {formatDate(post.date)} · {post.readingTime}
              </span>
              <span className="wr-head">
                <span className="wr-title">
                  {post.title}
                  <Underline className="wr-underline" />
                </span>
                <OutArrowIcon className="wr-out" />
              </span>
              {post.description && <span className="wr-desc">{post.description}</span>}
            </a>
          </li>
        ))}
      </ul>

      <a className="wr-all" href={BLOG_URL}>
        All writing
        <ArrowIcon className="wr-all-icon" />
      </a>
    </section>
  );
};

export default WritingSection;
