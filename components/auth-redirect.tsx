import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const pathname = (await headers()).get("x-pathname");

  if (!user && pathname?.startsWith("/app")) {
    redirect("/sign-up");
  }

  if (
    user &&
    (pathname?.startsWith("/sign-up") || pathname?.startsWith("/sign-in"))
  ) {
    redirect("/app");
  }

  if (user && !pathname?.startsWith("/onboarding") && user.publicMetadata.onboarded !== true) {
    redirect("/onboarding");
  }

  if (user && pathname?.startsWith("/onboarding") && user.publicMetadata.onboarded === true) {
    redirect("/app");
  }

  return children;
}
