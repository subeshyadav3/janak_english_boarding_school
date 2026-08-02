export type SiteSettings = {
  schoolName: string;
  tagline: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  facebook?: string | null;
  whatsapp?: string | null;
  logo?: string | null;
  cover1?: string | null;
  cover2?: string | null;
  cover3?: string | null;
  cover4?: string | null;
  cover5?: string | null;
  cover6?: string | null;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  schoolName: "Janak English Boarding School Pvt. Ltd.",
  tagline: "Shaping Young Minds for a Brighter Tomorrow",
  motto: "Quality Education is Our Motto",
  address: "Gaur-3, Rautahat, Nepal",
  phone: "9845378869",
  email: "janakenglishboardingschool@gmail.com",
  facebook: "https://www.facebook.com/share/1BQYpmXLmM/",
  whatsapp: "9779855040326",
  logo: "/assets/logo.png",
  cover1: "/assets/cover1.png",
  cover2: "/assets/cover2.png",
  cover3: "/assets/cover3.png",
  cover4: "/assets/cover4.png",
  cover5: "/assets/cover5.png",
  cover6: "/assets/cover6.png",
};

export const DEFAULT_TEACHERS = [
  {
    id: "t1",
    name: "Sunny Deol Patel",
    position: "Co-ordinator",
    subject: "Mathematics",
    phone: "9844608775",
    photo: "/assets/teacher_sunny_deol_patel.jpg",
    order: 1,
  },
  {
    id: "t2",
    name: "Randir Kumar Sah",
    position: "Vice-Principal",
    subject: "Computer",
    phone: "9865137594",
    photo: "/assets/teacher_randir_kumar_sah.jpg",
    order: 2,
  },
];

export const DEFAULT_NOTICES = [
  {
    id: "n1",
    title: "Result publication",
    description:
      "The results of 1st terminal Examination 2083 is going to be published on 2083/04/10 Sunday",
    filePath: null,
  },
];

export const STATS = [
  { number: 1996, suffix: "", label: "Established (B.S.)" },
  { number: 8, suffix: "", label: "Grade Levels (Nursery-8)" },
  { number: 100, suffix: "%", label: "English Medium" },
  { number: 1, suffix: "st", label: "Trusted Institution in Gaur" },
];

export const FACILITIES = [
  { title: "Qualified Teachers", desc: "Experienced and dedicated teaching staff" },
  { title: "English Medium", desc: "Full English medium instruction" },
  { title: "Discipline Focus", desc: "Strong moral values and discipline" },
  { title: "Individual Attention", desc: "Personal care for every student" },
  { title: "Co-curricular Activities", desc: "Sports, arts and extracurricular programs" },
  { title: "Safe Environment", desc: "Friendly and secure learning space" },
];

export const ABOUT_PARAGRAPHS = [
  "Janak English Boarding School Pvt. Ltd. is one of the oldest and most respected educational institutions in Gaur, Rautahat. For many years, the school has earned the trust of parents and the community through its commitment to academic excellence, discipline, and character building. The school is listed as a private institution in Gaur Municipality and provides education from Nursery to Grade 8.",
  "We believe that education is not only about achieving excellent academic results but also about developing responsible, confident, and compassionate individuals. Our experienced and dedicated teachers create a safe, caring, and motivating learning environment where every child is encouraged to discover their full potential.",
];

export const MISSION_TEXT =
  "Our mission is to nurture knowledgeable, disciplined, and socially responsible students who are prepared to meet future challenges with confidence and integrity. We strive to build a strong foundation for lifelong learning, creativity, and success.";

export const FEATURES = [
  "Quality English-medium education",
  "Strong discipline and moral values",
  "Student-centered teaching and learning",
  "Individual attention for every child",
  "Co-curricular and extracurricular activities",
  "Personality development and leadership skills",
  "A safe, friendly, and inspiring school environment",
];

export const MAP_EMBED = "https://www.google.com/maps?q=26.7659182,85.2689964&z=17&output=embed";
export const MAP_DIRECTIONS =
  "https://www.google.com/maps/place/Janak+English+boarding+school+Gaur,+Rautahat+Nepal/@26.7659182,85.2689964,623m";
export const MAP_SHORT = "https://maps.app.goo.gl/F29y7MG6Th8KEr3U9";
