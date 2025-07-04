import { HomePage } from "@/components/organisms/HomePage/HomePage";
import { CollectionsProvider } from "@/contexts/collectionsContext";

export const metadata = {
  title: "Luxor Code Challenge",
  description: "A simple app to manage collections",
};

export default function Home() {
  return (
    <CollectionsProvider>
      <HomePage />
    </CollectionsProvider>
  );
}
