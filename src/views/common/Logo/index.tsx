import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  redirect?: string;
}

export default function Logo({ redirect = "/home" }: LogoProps) {
  return <Link href={redirect}></Link>;
}
