import { siteMeta, social } from "@/lib/content";

const groups = [
  {
    heading: "Find us",
    links: [
      { label: "Instagram", href: social.instagram },
      { label: "Meetup", href: social.meetup },
      { label: "WhatsApp Channel", href: social.whatsappChannel },
      { label: `Chat ${siteMeta.whatsapp}`, href: social.whatsapp },
      { label: `Chat ${siteMeta.whatsappAlt}`, href: social.whatsappAlt },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { label: "Suggest a Topic", href: social.suggestTopic },
      { label: "Partner as a Venue", href: social.partnerVenue },
      { label: "Contact", href: social.contact },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="ground-deep pt-20 pb-32 lg:pb-20">
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display text-[2rem] leading-none">
              Social Nerds<span className="text-sage">.</span>
            </p>
            <p className="mt-5 max-w-[24rem] text-[0.9375rem] leading-relaxed text-ivory/55">
              {siteMeta.description}
            </p>
          </div>

          {groups.map((group) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="lg:col-span-3"
            >
              <p className="eyebrow text-sage">{group.heading}</p>
              <ul className="mt-6 flex flex-col gap-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[0.9375rem] text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-8">
          <p className="eyebrow text-ivory/35">
            © {new Date().getFullYear()} Social Nerds · {siteMeta.city}
          </p>
          <a
            href={social.privacy}
            className="eyebrow text-ivory/35 transition-colors hover:text-ivory/70"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
