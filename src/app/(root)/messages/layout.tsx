import { Sidebar } from "./sidebar";

type MessageLayoutProps = {
   children: React.ReactNode;
};

const MessageLayout = ({
   children,
}: MessageLayoutProps) => {

   return (
      <div className="relative">
         <Sidebar />
         <main className="lg:ml-64">
            {children}
         </main>
      </div>
   );
};

export default MessageLayout;