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
        name: settings.schoolName,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Gaur-3",
          addressRegion: "Rautahat",
          addressCountry: "NP",
        },
        telephone: settings.phone,
        email: settings.email,
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
