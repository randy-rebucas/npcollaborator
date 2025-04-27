import memberstackAdmin from "@memberstack/admin";

export const memberstack = memberstackAdmin.init(process.env.MEMBERSTACK_SECRET_KEY!);
