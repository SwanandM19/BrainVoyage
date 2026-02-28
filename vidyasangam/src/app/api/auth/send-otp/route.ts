// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { generateOTP } from "@/lib/utils";
// import { sendOTPEmail } from "@/lib/mail";
// import { z } from "zod";

// const schema = z.object({ email: z.string().email() });

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email } = schema.parse(body);

//     // Delete old unused OTPs for this email
//     await prisma.oTPToken.deleteMany({
//       where: { email, used: false },
//     });

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     await prisma.oTPToken.create({
//       data: { email, token: otp, expiresAt },
//     });

//     // For dev: console.log the OTP. In prod: send email
//     if (process.env.NODE_ENV === "development") {
//       console.log(`🔐 OTP for ${email}: ${otp}`);
//     } else {
//       await sendOTPEmail(email, otp);
//     }

//     return NextResponse.json({ success: true, message: "OTP sent to your email" });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = await req.json();
    if (!rawEmail) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const email = String(rawEmail).trim().toLowerCase();

    // Delete old OTPs
    await prisma.oTPToken.deleteMany({ where: { email } });

    // Always create dummy OTP: 000000
    await prisma.oTPToken.create({
      data: {
        email,
        token: "000000",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
