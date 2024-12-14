import { useEffect, useState } from "react";

export const useKeyboardVisibility = () => {
   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         // ตรวจสอบความสูงของ viewport
         const isKeyboardOpen = window.innerHeight < 600; // ปรับค่าตามความสูงที่เหมาะสม
         setIsKeyboardVisible(isKeyboardOpen);
      };

      window.addEventListener("resize", handleResize);
      // เรียกใช้ handleResize เมื่อ component ถูก mount
      handleResize();

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return isKeyboardVisible;
};
