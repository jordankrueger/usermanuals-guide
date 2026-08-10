export interface FormConfig { enabled: boolean; toEmail: string; n8nWebhook?: string }
export interface LinkItem { label: string; href: string }
export interface SiteConfig {
  domain: string; title: string; description: string;
  themeColor: string; accentColor: string; analyticsId?: string;
  hero: { heading: string; subheading?: string; image?: string };
  links?: LinkItem[];
  cta?: { label: string; href: string };
  bio?: { heading?: string; body: string; image?: string };
  form?: FormConfig;
  socials?: LinkItem[];
}
export const site: SiteConfig = { domain: "example.com", title: "Example", description: "A starter site.", themeColor: "#1c2230", accentColor: "#f97316", hero: { heading: "Hello" } };
