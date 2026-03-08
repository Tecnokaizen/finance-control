import { getCurrentBusiness } from "@/server/services/businesses/get-current-business";

export async function requireCurrentBusinessId(userId: string) {
  const business = await getCurrentBusiness(userId);
  return business.id;
}
