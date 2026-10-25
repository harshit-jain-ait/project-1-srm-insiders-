import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { getAuthContext, canModifyPortfolio } from "@/lib/auth/auth-service";
import {
  updateSubmissionStatus,
  deleteContactSubmission,
} from "@/lib/contact/contact-service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  try {
    const { id, messageId } = await params;
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
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const status = body.status;
    if (!status || !["unread", "read", "archived"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const ok = updateSubmissionStatus(messageId, effectiveUserId, status);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update submission";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  try {
    const { id, messageId } = await params;
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
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const effectiveUserId = auth.userId || ownership.userId || "anonymous";
    const ok = deleteContactSubmission(messageId, effectiveUserId);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete submission";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
