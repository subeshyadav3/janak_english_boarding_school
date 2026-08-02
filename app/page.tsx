import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import HeroSlider from "@/app/components/HeroSlider";
import NoticeTicker from "@/app/components/NoticeTicker";
import AdmissionCta from "@/app/components/sections/AdmissionCta";
import AboutSection from "@/app/components/sections/AboutSection";
import StatsSection from "@/app/components/sections/StatsSection";
import FacilitiesSection from "@/app/components/sections/FacilitiesSection";
import TeachersSection from "@/app/components/sections/TeachersSection";
import NoticesResultsSection from "@/app/components/sections/NoticesResultsSection";
import TestimonialsSection from "@/app/components/sections/TestimonialsSection";
import GallerySection from "@/app/components/sections/GallerySection";
import EventsSection from "@/app/components/sections/EventsSection";
import FaqSection from "@/app/components/sections/FaqSection";
import ContactSection from "@/app/components/sections/ContactSection";
import LocationSection from "@/app/components/sections/LocationSection";
import {
  getSettings,
  getTeachers,
  getNoticesPublic,
  getResults,
  getGallery,
  getTestimonials,
  getEvents,
} from "@/lib/data";
import { SITE_URL, SCHOOL_COORDS } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, teachers, notices, results, gallery, testimonials, events] =
    await Promise.all([
      getSettings(),
      getTeachers(),
      getNoticesPublic(),
      getResults(),
      getGallery(),
      getTestimonials(),
      getEvents(),
    ]);

  const covers = [
    settings.cover1,
    settings.cover2,
    settings.cover3,
    settings.cover4,
    settings.cover5,
    settings.cover6,
  ].filter((c): c is string => Boolean(c));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "School",
        "@id": `${SITE_URL}/#school`,
        name: settings.schoolName,
        url: SITE_URL,
        image: settings.logo ? [settings.logo, settings.cover1].filter(Boolean) : undefined,
        logo: settings.logo || undefined,
        telephone: settings.phone,
        email: settings.email,
        description: settings.tagline,
        slogan: settings.motto,
        foundingDate: settings.establishedYear ? String(settings.establishedYear) : undefined,
        sameAs: [settings.facebook].filter(Boolean),
        address: {
          "@type": "PostalAddress",
          streetAddress: "Gaur-3",
          addressLocality: "Gaur",
          addressRegion: "Rautahat",
          postalCode: "44500",
          addressCountry: "NP",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SCHOOL_COORDS.lat,
          longitude: SCHOOL_COORDS.lng,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "16:00",
          },
        ],
        areaServed: "Gaur, Rautahat, Nepal",
      },
      {
        "@type": "WebSite",
        url: SITE_URL,
        name: settings.schoolName,
        description: settings.tagline,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the best boarding school in Gaur, Rautahat?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Janak English Boarding School Pvt. Ltd. is one of the oldest, most respected, and top-rated boarding schools in Gaur, Rautahat, known for quality education and high discipline.",
            },
          },
          {
            "@type": "Question",
            name: "Where is Janak English Boarding School located?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Janak English Boarding School is located in Gaur-3, Rautahat, Nepal.",
            },
          },
          {
            "@type": "Question",
            name: "What classes does Janak English Boarding School offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Janak English Boarding School offers English-medium education from Nursery to Grade 8.",
            },
          },
          {
            "@type": "Question",
            name: "How can I contact Janak English Boarding School?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can call the school or send a message through WhatsApp or the contact form on the website.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar settings={settings} />
      <HeroSlider
        covers={covers}
        schoolName={settings.schoolName}
        tagline={settings.tagline}
        motto={settings.motto}
        address={settings.address}
        phone={settings.phone}
      />
      <NoticeTicker notices={notices} />
      <main className="flex-1">
        <AboutSection />
        <StatsSection />
        <AdmissionCta
          phone={settings.phone}
          whatsapp={settings.whatsapp}
          title={settings.admissionTitle}
          text={settings.admissionText}
          callLabel={settings.admissionCallLabel}
          whatsappLabel={settings.admissionWhatsappLabel}
          enabled={settings.admissionEnabled}
        />
        <FacilitiesSection />
        <TeachersSection teachers={teachers} />
        <NoticesResultsSection notices={notices} results={results} />
        <EventsSection events={events} />
        <TestimonialsSection testimonials={testimonials} />
        <GallerySection items={gallery} />
        <FaqSection />
        <ContactSection
          settings={{
            email: settings.email,
            phone: settings.phone,
            whatsapp: settings.whatsapp,
          }}
        />
        <LocationSection address={settings.address} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
