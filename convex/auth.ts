import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";

export const { auth, signIn, signOut, store } = convexAuth({
   providers: [ResendOTP],
   callbacks: {
      async afterUserCreatedOrUpdated(ctx, args) {
         // save token when create user
      },
   }
});
