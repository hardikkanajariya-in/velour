import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";

// POST /api/auth/forgot-password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = result.data;

    // Check if user exists (don't reveal if not found for security)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      // In production, generate a token, save it, and send a real reset email.
      // For now, we log and return success to avoid exposing user existence.
      console.log(
        `[forgot-password] Reset requested for: ${email} (user: ${user.id})`,
      );

      // TODO: Implement real password reset flow:
      // 1. Generate a secure random token
      // 2. Store token with expiry in DB
      // 3. Send email with reset link using sendEmail()
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message:
        "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("[forgot-password] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
