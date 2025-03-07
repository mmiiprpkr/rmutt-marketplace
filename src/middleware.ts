import {
   convexAuthNextjsMiddleware,
   createRouteMatcher,
   isAuthenticatedNextjs,
   nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRoutes = createRouteMatcher(["/auth"]);
const isPublicRoutes = createRouteMatcher(["/api/uploadthing"]);

export default convexAuthNextjsMiddleware(
   async (request, { convexAuth }) => {
      const isAuth = await convexAuth.isAuthenticated();

      // Allow public routes to pass through
      if (isPublicRoutes(request)) {
         return;
      }

      if (!isAuthRoutes(request) && !isAuth) {
         return nextjsMiddlewareRedirect(request, "/auth");
      }

      if (isAuthRoutes(request) && isAuth) {
         return nextjsMiddlewareRedirect(request, "/");
      }
   },
   { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } },
);

export const config = {
   // The following matcher runs middleware on all routes
   // except static assets.
   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
