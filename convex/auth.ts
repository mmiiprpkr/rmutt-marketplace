import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";

export const { auth, signIn, signOut, store } = convexAuth({
   providers: [ResendOTP],
   callbacks: {
      async afterUserCreatedOrUpdated(ctx, args) {
         if (args.existingUserId) {
            return;
         }

         let profile_imgs_name_list = [
            "George",
            "Chase",
            "Andrea",
            "Jameson",
            "Katherine",
            "Sadie",
            "Mason",
            "Luis",
            "Oliver",
            "Eden",
            "Ryan",
            "Riley",
            "Sawyer",
            "Adrian",
            "Nolan",
            "Emery",
            "Jude",
            "Aidan",
            "Christian"
         ];

         let profile_imgs_collections_list = ["adventurer-neutral"];

         const generateImageURL = "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Aidan";

         return ctx.db.patch(args.userId, {
            image: generateImageURL,
         });
      },

   }
});
