import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  explore: [
    { href: "/villas", label: "Villas" },
    { href: "/cafe", label: "Moonlight Cafe" },
    { href: "/orchard", label: "The Orchard" },
    { href: "/gallery", label: "Gallery" },
  ],
  info: [
    { href: "/about", label: "Our Story" },
    { href: "/booking", label: "Reservations" },
    { href: "/contact", label: "Contact Us" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0B1120] text-[#B8CCE0]">
      <div className="mx-auto max-w-[var(--container-page)] px-6 pb-8 pt-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="text-[#7EB8E5]"
                aria-hidden="true"
              >
                <path
                  d="M14 2C13 2 8 6 8 14C8 22 13 26 14 26C15 26 20 22 20 14C20 6 15 2 14 2Z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="14"
                  cy="14"
                  r="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <span className="text-xl font-semibold text-[#D6E4F0]">
                LunaMachi
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#7A9BBB]">
              A home in nature. Experience eco-luxury living under the
              moonlight, where peaceful elegance meets the natural world.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D6E4F0]">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A9BBB] transition-colors hover:text-[#7EB8E5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D6E4F0]">
              Information
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A9BBB] transition-colors hover:text-[#7EB8E5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D6E4F0]">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm text-[#7A9BBB]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#7EB8E5]" />
                <span>Moonlight Valley, Nature District, Serenity 78000</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#7A9BBB]">
                <Phone size={16} className="shrink-0 text-[#7EB8E5]" />
                <span>+66 98 765 4321</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#7A9BBB]">
                <Mail size={16} className="shrink-0 text-[#7EB8E5]" />
                <span>stay@lunamachi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#1E2D45] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-[#5A7A96]">
              &copy; {new Date().getFullYear()} LunaMachi Moonlight Retreat.
              All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-xs text-[#5A7A96] hover:text-[#7EB8E5]">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-[#5A7A96] hover:text-[#7EB8E5]">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
