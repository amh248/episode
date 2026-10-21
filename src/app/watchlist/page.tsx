import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function WatchlistRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) redirect("/sign-in");
  redirect(`/member/${session.user.username}/watchlist`);
}
