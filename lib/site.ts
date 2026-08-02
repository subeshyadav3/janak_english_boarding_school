export const SITE_URL =
  process.env.SITE_URL || "https://janak-english-boarding-school.vercel.app";

export const SCHOOL_COORDS = { lat: 26.7659182, lng: 85.2689964 };

export const GEO_TAGS = {
  "geo.region": "NP-2",
  "geo.placename": "Gaur, Rautahat, Nepal",
  "geo.position": `${SCHOOL_COORDS.lat};${SCHOOL_COORDS.lng}`,
  ICBM: `${SCHOOL_COORDS.lat}, ${SCHOOL_COORDS.lng}`,
};
