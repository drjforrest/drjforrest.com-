import { ContactForm } from "@/components/contact-form";
import { Mail, Linkedin } from "lucide-react";
import { Icons } from "@/components/icons";
import { SOCIAL_LINKS } from "@/lib/constants";

const contactDetails = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    text: "james.forrest@ubc.ca",
    href: "mailto:james.forrest@ubc.ca",
  },
  {
    icon: <Linkedin className="h-6 w-6 text-primary" />,
    text: "LinkedIn Profile",
    href: SOCIAL_LINKS.linkedin,
  },
  {
    icon: <Icons.orcid className="h-6 w-6 text-primary" />,
    text: "ORCID Profile",
    href: SOCIAL_LINKS.orcid,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-secondary py-16">
        <div className="container text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Contact & Collaborate
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            I am always open to new ideas, partnerships, and conversations.
            Whether you are a researcher, a potential funder, a student, or
            from the press, I look forward to hearing from you.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="font-headline text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-lg text-muted-foreground">
                  Use the form to send me a message directly, or connect with me
                  through the channels below.
                </p>
              </div>
              <div className="space-y-6">
                {contactDetails.map((detail) => (
                  <a
                    key={detail.text}
                    href={detail.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 group p-4 rounded-lg border border-accent-950/20 bg-accent-950/5 hover:bg-accent-950/10 hover:border-accent-950/30 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-950/10 group-hover:bg-accent-950/20 transition-colors">
                      {detail.icon}
                    </div>
                    <span className="font-medium text-lg group-hover:text-primary transition-colors">
                      {detail.text}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
