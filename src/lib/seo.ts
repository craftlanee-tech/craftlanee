import type { Metadata } from 'next';
import { getContent } from './content';

const content = getContent();

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://craftlanee.com';
export const siteName = content.siteTitle;
export const defaultOgImage = '/images/Hero.png';

type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
};

function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({ title, description, path = '/', keywords = [], image = defaultOgImage }: SeoConfig): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...content.meta.keywords, ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      images: [
        {
          url: imageUrl,
          alt: `${siteName} digital marketing and IT services`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createOrganizationJsonLd() {
  const emailDetail = content.contact.details.find((detail) => detail.label.toLowerCase().includes('email'));
  const phoneDetail = content.contact.details.find((detail) => {
    const label = detail.label.toLowerCase();
    return label.includes('phone') || label.includes('mobile');
  });
  const locationDetail = content.contact.details.find((detail) => detail.label.toLowerCase().includes('location'));

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl('/images/Craftlanee_logo.png'),
    image: absoluteUrl(defaultOgImage),
    description: content.meta.description,
    email: emailDetail?.values[0],
    telephone: phoneDetail?.values[0],
    address: locationDetail?.values[0]
      ? {
          '@type': 'PostalAddress',
          addressLocality: locationDetail.values[0],
          addressCountry: 'IN',
        }
      : undefined,
    areaServed: ['India', 'Hyderabad', 'Bengaluru'],
    serviceType: content.services.groups.flatMap((group) => group.items),
    sameAs: [],
  };
}

export function createWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: content.meta.description,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/Craftlanee_logo.png'),
      },
    },
  };
}

export function createServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteName} services`,
    itemListElement: content.services.groups.map((group, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: group.category,
        description: group.description,
        provider: {
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
        },
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: group.category,
          itemListElement: group.items.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service,
            },
          })),
        },
      },
    })),
  };
}
