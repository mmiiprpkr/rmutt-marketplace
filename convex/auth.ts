import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
   providers: [ResendOTP],
   callbacks: {
      async afterUserCreatedOrUpdated(ctx, args) {
         // save token when create user
      },
   },
   jwt: {
      durationMs: 1000 * 60 * 60 * 24 * 30,
   },
   session: {
      inactiveDurationMs: 1000 * 60 * 60 * 24 * 30,
      totalDurationMs: 1000 * 60 * 60 * 24 * 30,
   },
});
