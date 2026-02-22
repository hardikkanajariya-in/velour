import { redirect } from "next/navigation";

// /wishlist → redirect to /account/wishlist
export default function WishlistPage() {
  redirect("/account/wishlist");
}
