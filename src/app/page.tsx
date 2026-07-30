import { Hero } from "@/components/sections/hero";
import { QuoteBlock } from "@/components/sections/quote-block";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Skills } from "@/components/sections/skills";
import { AboutPreview } from "@/components/sections/about-preview";
import { ContactsPreview } from "@/components/sections/contacts-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuoteBlock />
      <FeaturedProjects />
      <Skills withDecor />
      <AboutPreview />
      <ContactsPreview />
    </>
  );
}
