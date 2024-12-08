'use client';

import { Button } from "@/components/common/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const RootPage = () => {
  const { signOut } = useAuthActions();

  return (
    <div>
      Rmutt Marketplace
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
};

export default RootPage;