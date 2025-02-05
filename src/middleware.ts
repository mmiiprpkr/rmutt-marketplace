import {
   convexAuthNextjsMiddleware,
   createRouteMatcher,
   isAuthenticatedNextjs,
   nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRoutes = createRouteMatcher(["/auth"]);
const isPublicRoutes = createRouteMatcher(["/api/uploadthing"]);

export default convexAuthNextjsMiddleware((request) => {
   // Allow public routes to pass through
   if (isPublicRoutes(request)) {
      return;
   }

   if (!isAuthRoutes(request) && !isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/auth");
   }

   if (isAuthRoutes(request) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/");
   }
});

export const config = {
   // The following matcher runs middleware on all routes
   // except static assets.
   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
