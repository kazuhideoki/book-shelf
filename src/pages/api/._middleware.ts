import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { AuthContext } from "../../server/helper/auth-context";
import { collection, toData } from "../../server/service/server_firebase";
import { AppUser } from "../../type/model/firestore-user.type";

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log(`⭐ middleware`);

  if (!req.url.includes(`/drive/`)) {
    const userId = (req.headers as any).userid;

    console.log({ userId });
    try {
      const appUser = await toData<AppUser>(
        collection("users").doc(userId).get()
      ).catch((e) => {
        console.log({ e });

        console.log(`error occurred in fetch appUser: ${e}`);
      });

      console.log(`Fetched appUser: ${appUser}`);

      if (appUser) {
        AuthContext.set(appUser);
      }
    } catch (error) {}
  }

  const res = NextResponse.next();
  return res;
}
