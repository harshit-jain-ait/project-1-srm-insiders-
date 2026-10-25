import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import {
  isValidSlugFormat,
  isReservedSlug,
  normalizeSlug,
} from "@/lib/schema/portfolio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug");
    const excludeId = searchParams.get("excludeId") || undefined;

    if (!rawSlug || rawSlug.trim() === "") {
      return NextResponse.json(
        { available: false, error: "Slug parameter is required." },
        { status: 400 }
      );
    }

    const normalized = normalizeSlug(rawSlug);
    const isValid = isValidSlugFormat(normalized);

    if (!isValid) {
      return NextResponse.json({
        available: false,
        isValid: false,
        isReserved: false,
        normalizedSlug: normalized,
        error: "Slug must be 3-48 characters, lowercase letters, numbers, and hyphens without consecutive hyphens.",
      });
    }

    const isReserved = isReservedSlug(normalized);
    if (isReserved) {
      return NextResponse.json({
        available: false,
        isValid: false,
        isReserved: true,
        normalizedSlug: normalized,
        error: `Slug "${normalized}" is reserved by the platform.`,
      });
    }

    const isAvailable = await portfolioRepository.isSlugAvailable(normalized, excludeId);

    return NextResponse.json({
      available: isAvailable,
      isValid: true,
      isReserved: false,
      normalizedSlug: normalized,
      error: isAvailable ? undefined : `Slug "${normalized}" is already taken.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error validating slug.";
    return NextResponse.json(
      { available: false, error: errorMsg },
      { status: 500 }
    );
  }
}
