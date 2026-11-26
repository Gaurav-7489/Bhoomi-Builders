import { contactSchema } from "@/lib/forms";
import { handleFormPost } from "@/lib/handle-form";

export async function POST(request: Request) {
  return handleFormPost(request, contactSchema, "contact");
}
