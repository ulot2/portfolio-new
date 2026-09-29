import { NextResponse, type NextRequest } from "next/server";
import { BLOG_URL } from "@/lib/site";
import { COOKIE, verifySession } from "@/lib/jobs-auth";

const PRIVATE_APPS = ["jobs", "prep"];

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // jobs.<domain> and prep.<domain> are private apps behind one passphrase.
  // Gate them before any rewrite, so an unauthenticated request never reaches
  // a page that renders private data. Both share the jobs login page.
  const app = PRIVATE_APPS.find((name) => host.startsWith(`${name}.`));
  if (app) {
    if (pathname === "/login") {
      return NextResponse.rewrite(new URL("/jobs/login", req.url));
    }
    if (!(await verifySession(req.cookies.get(COOKIE)?.value))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const path = pathname === "/" ? `/${app}` : `/${app}${pathname}`;
    return NextResponse.rewrite(new URL(path, req.url));
  }

  // Reaching /jobs or /prep on the apex would serve the app off the wrong host,
  // where the login redirect above never runs.
  if (PRIVATE_APPS.some((name) => pathname === `/${name}` || pathname.startsWith(`/${name}/`))) {
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
  // Preview images are skipped so /blog/<slug>/opengraph-image is served on
  // the apex, where metadataBase points, instead of redirecting to blog.*.
  matcher: ["/((?!api|_next|.*[.]|.*opengraph-image).*)"],
};
