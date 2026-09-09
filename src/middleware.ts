import { NextResponse, type NextRequest } from "next/server";
import { BLOG_URL } from "@/lib/site";
import { COOKIE, verifySession } from "@/lib/jobs-auth";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // jobs.<domain> is the private dashboard. Gate it before any rewrite, so an
  // unauthenticated request never reaches the page that renders the roles.
  if (host.startsWith("jobs.")) {
    const path = pathname === "/" ? "/jobs" : `/jobs${pathname}`;

    if (pathname === "/login") {
      return NextResponse.rewrite(new URL("/jobs/login", req.url));
    }
    if (!(await verifySession(req.cookies.get(COOKIE)?.value))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.rewrite(new URL(path, req.url));
  }

  // Reaching /jobs on the apex would serve the dashboard off the wrong host,
  // where the login redirect above never runs. Send it to the subdomain.
  if (pathname === "/jobs" || pathname.startsWith("/jobs/")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

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
