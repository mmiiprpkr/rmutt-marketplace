"use client";

import { MessageSquare } from "lucide-react";

const MessagePage = () => {
   return (
      <div className="hidden lg:flex flex-col items-center justify-center h-screen bg-gradient-to-b from-background to-muted/30">
         <div className="text-center max-w-md p-8 rounded-xl bg-card shadow-sm border">
            <div className="mb-6 bg-primary/10 p-4 rounded-full inline-block">
               <MessageSquare className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Select a Conversation</h1>

            <p className="text-muted-foreground mb-6">
               Choose a conversation from the sidebar to start messaging
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
               {[1, 2, 3].map((i) => (
                  <div
                     key={i}
                     className="h-16 rounded-md bg-muted/50 border border-border/50 flex items-center justify-center"
                  >
                     <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default MessagePage;
