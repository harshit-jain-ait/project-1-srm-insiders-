import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";
import {
  submitContactMessage,
  listContactSubmissions,
} from "@/lib/contact/contact-service";

/**
 * Public visitor message submission handler.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await submitContactMessage({
      portfolioId: id,
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      honeypot: body.honeypot || body.website,
      ip,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to submit message." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
      submissionId: result.submissionId,
      notificationStatus: result.notification?.status,
    });
  } catch (err: unknown) {
    console.error("[Contact POST Error]:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while sending your message." },
      { status: 500 }
    );
  }
}

/**
 * Authorized owner inbox listing handler.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = getAuthContext(req);

    const ownership = await portfolioRepository.getOwnership(id);
    if (!ownership) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    if (!canModifyPortfolio(ownership, auth)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to access portfolio inbox" },
        { status: 403 }
      );
    }

    const filter = req.nextUrl.searchParams.get("status") as
      | "unread"
      | "read"
      | "archived"
      | undefined;

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const submissions = listContactSubmissions(id, effectiveUserId, filter);

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load messages";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
