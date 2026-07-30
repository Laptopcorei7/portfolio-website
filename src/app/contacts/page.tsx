import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/page-title";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact-form";
import { MessageBox, SupportBox } from "@/components/sections/contact-boxes";
import { platformIcons } from "@/components/ui/icons";
import { DotGrid, OutlineSquare } from "@/components/ui/decor";
import { contactsBlurb, profile, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacts",
  description: `Get in touch with ${profile.name}.`,
};

export default function ContactsPage() {
  return (
    <div className="container-page relative pt-8 pb-8">
      {/* Sits beside the form, clear of the contact panels above it. */}
      <OutlineSquare size={110} className="top-[30rem] -right-24 hidden lg:block" />
      <DotGrid cols={3} rows={3} className="top-72 -left-20 hidden lg:grid" />

      <PageTitle title="contacts" subtitle="Who am i?" />

      <section className="flex flex-col justify-between gap-10 pb-20 lg:flex-row">
        <p className="max-w-md text-base">{contactsBlurb}</p>

        <div className="flex flex-wrap gap-4">
          {/* Pass a value to show the "Support me here" panel from the mockup,
              e.g. a card number, Ko-fi handle or crypto address. */}
          <SupportBox />
          <MessageBox />
        </div>
      </section>

      <section className="pb-20" aria-labelledby="message-heading">
        <SectionHeading title="send-a-message" id="message-heading" />
        <ContactForm />
      </section>

      <section aria-labelledby="all-media-heading">
        <SectionHeading title="all-media" id="all-media-heading" />

        <ul className="flex flex-wrap gap-8">
          {socials.map((social) => {
            const Icon = platformIcons[social.platform];
            const content = (
              <>
                <Icon className="text-line/70 h-5 w-5" />
                {social.handle}
              </>
            );

            return (
              <li key={social.platform}>
                {social.href ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent flex items-center gap-3 text-base transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  /* No profile URL to link to — show the handle as text. */
                  <span className="flex items-center gap-3 text-base">{content}</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
