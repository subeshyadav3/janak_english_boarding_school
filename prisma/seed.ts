import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.setting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      schoolName: "Janak English Boarding School Pvt. Ltd.",
      tagline: "Shaping Young Minds for a Brighter Tomorrow",
      motto: "Quality Education is Our Motto",
      address: "Gaur-3, Rautahat, Nepal",
      phone: "9845378869",
      email: "janakenglishboardingschool@gmail.com",
      facebook: "https://www.facebook.com/share/1BQYpmXLmM/",
      whatsapp: "9779845378869",
      establishedYear: 1996,
      mapUrl: "https://maps.app.goo.gl/UiTVMWV77H1VESez8",
      logo: "/assets/logo.png",
      cover1: "/assets/cover1.png",
      cover2: "/assets/cover2.png",
      cover3: "/assets/cover3.png",
      cover4: "/assets/cover4.png",
      cover5: "/assets/cover5.png",
      cover6: "/assets/cover6.png",
    },
  });

  await prisma.teacher.deleteMany();
  await prisma.teacher.createMany({
    data: [
      {
        name: "Sunny Deol Patel",
        position: "Co-ordinator",
        subject: "Mathematics",
        qualification: "M.A. Mathematics, B.Ed.",
        email: "sunnydeol@janakschool.edu.np",
        phone: "9844608775",
        photo: "/assets/teacher_sunny_deol_patel.jpg",
        order: 1,
        active: true,
        joinedAt: new Date("2018-04-12"),
      },
      {
        name: "Randir Kumar Sah",
        position: "Vice-Principal",
        subject: "Computer",
        qualification: "M.Sc. Computer Science",
        email: "randir@janakschool.edu.np",
        phone: "9865137594",
        photo: "/assets/teacher_randir_kumar_sah.jpg",
        order: 2,
        active: true,
        joinedAt: new Date("2015-02-01"),
      },
    ],
  });

  await prisma.notice.deleteMany();
  await prisma.notice.createMany({
    data: [
      {
        title: "Result publication",
        description:
          "The results of 1st terminal Examination 2083 is going to be published on 2083/04/10 Sunday",
        category: "exam",
        filePath: "/uploads/grade8-result-sample.pdf",
        published: true,
      },
      {
        title: "Admission Open 2083",
        description:
          "Admissions are now open for Nursery to Grade 8 for the academic session 2083. Contact the school office for details.",
        category: "admission",
        published: true,
      },
      {
        title: "Parents-Teachers Meeting",
        description:
          "A parents-teachers meeting has been scheduled for the coming Saturday. All guardians are requested to attend.",
        category: "meeting",
        published: true,
      },
    ],
  });

  await prisma.result.deleteMany();
  await prisma.result.createMany({
    data: [
      {
        title: "First Terminal Examination 2083 - Grade 8",
        filePath: "/uploads/grade8-result-sample.pdf",
        driveLink: null,
      },
      {
        title: "First Terminal Examination 2083 - Grade 6 & 7",
        driveLink: null,
      },
    ],
  });

  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      {
        title: "Annual Sports Day",
        description: "Inter-house sports competition and athletic events for all grades.",
        date: new Date("2026-09-15T09:00:00"),
        time: "9:00 AM",
        location: "School Playground",
      },
      {
        title: "Parents-Teachers Meeting",
        description: "Meet your child's teachers to discuss academic progress.",
        date: new Date("2026-09-22T10:00:00"),
        time: "10:00 AM",
        location: "School Hall",
      },
      {
        title: "Dashain Tihar Break",
        description: "School remains closed for the festive break.",
        date: new Date("2026-10-01T00:00:00"),
        time: "All Day",
        location: "School",
      },
      {
        title: "Annual Day Celebration",
        description: "Annual cultural program and prize distribution ceremony.",
        date: new Date("2026-12-25T14:00:00"),
        time: "2:00 PM",
        location: "Main Auditorium",
      },
    ],
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: [
      { imagePath: "/assets/cover1.png", title: "School Building", album: "Campus" },
      { imagePath: "/assets/cover2.png", title: "Students in Class", album: "Classroom" },
      { imagePath: "/assets/cover3.png", title: "Annual Day Celebration", album: "Events" },
      { imagePath: "/assets/cover4.png", title: "Sports Day", album: "Events" },
      { imagePath: "/assets/cover5.png", title: "Cultural Program", album: "Events" },
      { imagePath: "/assets/cover6.png", title: "Awards Ceremony", album: "Events" },
    ],
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Sita Devi Sah",
        message:
          "Janak English Boarding School has given my children the confidence and discipline they needed. The teachers are truly dedicated.",
        role: "parent",
        rating: 5,
      },
      {
        name: "Ramesh Prasad Gupta",
        message:
          "The best decision we made was enrolling our kids here. English medium education with strong moral values - exactly what a child needs.",
        role: "parent",
        rating: 5,
      },
      {
        name: "Gita Kumari Yadav",
        message:
          "I am impressed by the individual attention my child receives. The school feels like a second home for our family.",
        role: "parent",
        rating: 4,
      },
      {
        name: "Aarav Sah",
        message:
          "Studying here has helped me grow both academically and personally. The teachers always support us.",
        role: "student",
        rating: 5,
      },
    ],
  });

  await prisma.enquiry.deleteMany();

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, name: "Administrator" },
  });

  for (const u of [{ username: "teacher", password, name: "Demo Teacher", role: "teacher" }]) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.adminUser.upsert({
      where: { username: u.username },
      update: { passwordHash: hash, name: u.name, role: u.role },
      create: {
        username: u.username,
        passwordHash: hash,
        name: u.name,
        role: u.role,
      },
    });
  }

  console.log("Seed complete.");
  console.log("  Admin login:  ", username, "/", password);
  console.log("  Teacher login:", "teacher", "/", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
