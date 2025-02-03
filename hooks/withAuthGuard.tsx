import { useUser, useClerk, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const withAuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function AuthGuardWrapper(props: P) {
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      if (isSignedIn === undefined) return; // Wait for Clerk to load

      if (!isSignedIn) {
        console.log("🔴 User not signed in, redirecting...");
        setAuthorized(false);
        return;
      }

      const email = user?.primaryEmailAddress?.emailAddress || "";

      if (!email.endsWith("@akaiketech.com")) {
        console.log("🔴 Unauthorized email, signing out...");
        signOut();
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    }, [isSignedIn, user, signOut]);

    if (authorized === null) {
      return (
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Loading...
        </div>
      );
    }

    if (authorized === false) {
      return <RedirectToSignIn />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthGuard;
