import { MobileSidebar } from "@/components/common/mobile-sidebar";
import { Navbar } from "@/components/common/navbar";
import { SideBar } from "@/components/common/side-bar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="min-h-screen">
         <div className="hidden md:block w-[300px] fixed top-0 left-0 inset-y-0 border-r border-secondary">
            <SideBar />
         </div>
         <MobileSidebar />
         <main className="md:pl-[300px]">
            <Navbar />
            {children}
         </main>
      </div>
   );
};

export default RootLayout;