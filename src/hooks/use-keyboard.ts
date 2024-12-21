import { useState, useEffect } from "react";

const useIsKeyboardOpen = () => {
   const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         const viewportHeight = window.innerHeight;
         const isOpen = viewportHeight < window.screen.height - 100; // ตรวจสอบว่าความสูงของ viewport ลดลงหรือไม่
         setIsKeyboardOpen(isOpen);
      };

      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return isKeyboardOpen;
};

export default useIsKeyboardOpen;
