import {
   generateUploadButton,
   generateUploadDropzone,
} from "@uploadthing/react";
import { genUploader } from "uploadthing/client";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { uploadFiles } = genUploader<OurFileRouter>({
   package: "uploadthing",
   url: `${process.env.SITE_URL!}/api/uploadthing`,
});
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
