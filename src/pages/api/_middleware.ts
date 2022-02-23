import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// 色々活用法ある？
export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  const res = NextResponse.next();
  return res;
}
