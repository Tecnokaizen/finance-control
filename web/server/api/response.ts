import { NextResponse } from "next/server";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    init,
  );
}

export function fail(code: string, message: string, details?: unknown, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  );
}

export function internalError(error: unknown, fallbackMessage: string) {
  return fail("INTERNAL_ERROR", getUserFacingErrorMessage(error, fallbackMessage), undefined, 500);
}
