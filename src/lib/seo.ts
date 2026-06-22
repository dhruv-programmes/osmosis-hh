/** Shared SEO constants for osmosishq.xyz — reused in index.html injection, sitemap, and JSON-LD. */

export const SITE_URL = "https://osmosishq.xyz";

export const SITE = {
  name: "Osmosis Hacker House",
  shortName: "Osmosis",
  title: "Osmosis Hacker House · Whitefield, Bangalore",
  description:
    "Osmosis Hacker House — July 25–26, 2026 in Whitefield, Bangalore. Two days of building, connecting, and creating.",
  url: SITE_URL,
  locale: "en_IN",
  themeColor: "#080809",
  ogImage: "/house.png",
  ogImageWidth: 1920,
  ogImageHeight: 1280,
  email: "hello@osmosis.dev",
  applyUrl: "https://luma.com/u5hrkyxf",
} as const;

export function externalLinkProps(url: string) {
  return url.startsWith("http")
    ? ({ href: url, target: "_blank", rel: "noopener noreferrer" } as const)
    : ({ href: url } as const);
}

export const EVENT = {
  name: "Osmosis Hacker House",
  startDate: "2026-07-25",
  endDate: "2026-07-26",
  locationName: "Zo House",
  addressLocality: "Whitefield",
  addressRegion: "Karnataka",
  addressCountry: "IN",
} as const;

export const ORGANIZATION = {
  name: "Osmosis",
  logo: `${SITE_URL}/osmosis.png`,
  email: SITE.email,
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENT.name,
    description: SITE.description,
    startDate: EVENT.startDate,
    endDate: EVENT.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [absoluteUrl(SITE.ogImage)],
    url: SITE.url,
    location: {
      "@type": "Place",
      name: EVENT.locationName,
      address: {
        "@type": "PostalAddress",
        addressLocality: EVENT.addressLocality,
        addressRegion: EVENT.addressRegion,
        addressCountry: EVENT.addressCountry,
      },
    },
    organizer: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: SITE.url,
      email: ORGANIZATION.email,
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    url: SITE.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
  };
}

export function getSeoHeadHtml(): string {
  const ogImage = absoluteUrl(SITE.ogImage);
  const jsonLd = [getEventJsonLd(), getOrganizationJsonLd()];

  return `
    <meta name="description" content="${SITE.description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${SITE.url}/" />
    <meta name="theme-color" content="${SITE.themeColor}" />
    <meta property="og:title" content="${SITE.title}" />
    <meta property="og:description" content="${SITE.description}" />
    <meta property="og:url" content="${SITE.url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="${SITE.ogImageWidth}" />
    <meta property="og:image:height" content="${SITE.ogImageHeight}" />
    <meta property="og:locale" content="${SITE.locale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${SITE.title}" />
    <meta name="twitter:description" content="${SITE.description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `.trim();
}
