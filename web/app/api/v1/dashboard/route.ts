import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getDashboardSummary } from "@/server/services/dashboard/get-dashboard-summary";

function getDefaultRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));

  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
}

export async function GET(request: Request) {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const { searchParams } = new URL(request.url);

    const defaults = getDefaultRange();
    const from = searchParams.get("from") ?? defaults.from;
    const to = searchParams.get("to") ?? defaults.to;

    return ok(await getDashboardSummary(businessId, { from, to }));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }

    return internalError(error, "Could not fetch dashboard summary");
  }
}
