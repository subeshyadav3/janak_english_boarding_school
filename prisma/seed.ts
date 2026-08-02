import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
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

  await prisma.notice.createMany({
    data: [
      {
        title: "Result publication",
        description:
          "The results of 1st terminal Examination 2083 is going to be published on 2083/04/10 Sunday",
      },
    ],
  });

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, name: "Administrator" },
  });

  console.log("Seed complete. Admin login:", username, "/", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
