import Link from "next/link";

export default function BuyButton({ label = "GET INSTANT ACCESS", className = "" }: { label?: string; className?: string }) {
  return (
    <Link className={`buyButton ${className}`} href="/buy">
      <span>{label}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
