import { NextResponse } from "next/server";

export const saveScreenMode = (mode: string) => {
  const response = NextResponse.json({ success: true });
  response.cookies.set("mode", mode, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
};
