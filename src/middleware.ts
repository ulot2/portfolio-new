import { NextResponse, type NextRequest } from "next/server";
import { BLOG_URL } from "@/lib/site";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // blog.<domain> serves the /blog route tree at its root
  if (host.startsWith("blog.")) {
    return NextResponse.rewrite(
      new URL(pathname === "/" ? "/blog" : `/blog${pathname}`, req.url)
    );
  }

  // one canonical home for posts: apex /blog/* -> blog subdomain
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    return NextResponse.redirect(
      new URL(pathname.slice("/blog".length) || "/", BLOG_URL),
      308
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*[.]).*)"],
};
