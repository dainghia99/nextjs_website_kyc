import { redirect } from "next/navigation";
// import { mockKYCAccounts, mockUser } from "@/constants/mock-data";

export default function Home() {
    // You would normally verify auth status here
    // For now, let's simulate always redirecting to login
    redirect("/auth/sign-in");

    return null;
}
