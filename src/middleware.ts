import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const cookies = req.cookies;

  // Ou com o getAll()
  const cookies2 = req.cookies.getAll();
}
