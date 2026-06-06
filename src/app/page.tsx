import { Button } from "@/components/ui/button";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
            <Button variant="outline" size="lg">
              hello
            </Button>

    </HydrateClient>
  );
}
