"use client";

import { uploadFiles } from "@/lib/uploadthing";
import { useState } from "react";

const TestPage = () => {
   const [files, setFiles] = useState<File[]>([]);

   const handleUpload = async () => {
      try {
         const res = await uploadFiles("imageUploader", {
            files: files,
         });
         console.log("Upload success:", res);
         setFiles([]); // clear files after successful upload
      } catch (error) {
         console.error("Upload failed:", error);
      }
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         setFiles(Array.from(e.target.files));
      }
   };

   return (
      <div className="p-4">
         <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="mb-4"
         />
         <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
         >
            Upload Files
         </button>

         <div className="mt-4">Selected files: {files.length}</div>
      </div>
   );
};

export default TestPage;
