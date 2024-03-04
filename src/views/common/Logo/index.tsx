import Image from "next/image";
import Link from "next/link";
import LogoImg from "@/public/logo_conclave_completo.png";

interface LogoProps {
  redirect?: string;
}

export default function Logo({ redirect = "/home" }: LogoProps) {
  return (
    <Link href={redirect}>
      <Image alt="Conclave logo" src={LogoImg} width={200} />
    </Link>
  );
}
