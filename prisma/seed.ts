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
      whatsapp: "9779855040326",
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
        phone: "9844608775",
        photo: "/assets/teacher_sunny_deol_patel.jpg",
        order: 1,
      },
      {
        name: "Randir Kumar Sah",
        position: "Vice-Principal",
        subject: "Computer",
        phone: "9865137594",
        photo: "/assets/teacher_randir_kumar_sah.jpg",
        order: 2,
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
      },
      {
        title: "Admission Open 2083",
        description:
          "Admissions are now open for Nursery to Grade 8 for the academic session 2083. Contact the school office for details.",
      },
      {
        title: "Parents-Teachers Meeting",
        description:
          "A parents-teachers meeting has been scheduled for the coming Saturday. All guardians are requested to attend.",
      },
    ],
  });

  await prisma.result.deleteMany();
  await prisma.result.createMany({
    data: [
      {
        title: "First Terminal Examination 2083 - Grade 8",
        driveLink: "https://drive.google.com/drive/folders/example",
      },
      {
        title: "First Terminal Examination 2083 - Grade 6 & 7",
        driveLink: null,
      },
    ],
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: [
      { imagePath: "/assets/cover1.png", title: "School Building" },
      { imagePath: "/assets/cover2.png", title: "Students in Class" },
      { imagePath: "/assets/cover3.png", title: "Annual Day Celebration" },
      { imagePath: "/assets/cover4.png", title: "Sports Day" },
      { imagePath: "/assets/cover5.png", title: "Cultural Program" },
      { imagePath: "/assets/cover6.png", title: "Awards Ceremony" },
    ],
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Sita Devi Sah",
        message:
          "Janak English Boarding School has given my children the confidence and discipline they needed. The teachers are truly dedicated.",
      },
      {
        name: "Ramesh Prasad Gupta",
        message:
          "The best decision we made was enrolling our kids here. English medium education with strong moral values - exactly what a child needs.",
      },
      {
        name: "Gita Kumari Yadav",
        message:
          "I am impressed by the individual attention my child receives. The school feels like a second home for our family.",
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
