import { DotGrid } from "@/components/ui/decor";
import { SectionHeading } from "@/components/ui/section-heading";
import { MessageBox } from "@/components/sections/contact-boxes";
import { contactsBlurb } from "@/content/site";

/** The `#contacts` block at the foot of the home page. */
export function ContactsPreview() {
  return (
    <section className="container-page relative pb-24" aria-labelledby="contacts-heading">
      <SectionHeading title="contacts" id="contacts-heading" />

      {/* Sits in the gutter left of the container, as in the mockup. */}
      <DotGrid cols={3} rows={5} className="top-24 -left-20 hidden lg:grid" />

      <div className="flex flex-col justify-between gap-8 sm:flex-row">
        <p className="max-w-md text-base">{contactsBlurb}</p>
        <MessageBox />
      </div>
    </section>
  );
}
