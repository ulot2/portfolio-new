import React from "react";
import { tagInk } from "@/lib/tag-ink";

/** A post's topics as "A / B / C", each topic in its own pen. */
export const TagList = ({ tags }: { tags: string[] }) => (
  <>
    {tags.map((tag, i) => (
      <React.Fragment key={tag}>
        {i > 0 && " / "}
        <span className="tag-ink" style={{ "--tag-ink": tagInk(tag) } as React.CSSProperties}>
          {tag}
        </span>
      </React.Fragment>
    ))}
  </>
);

export default TagList;
