import { AppUser } from "../model/firestore-user.type";

export type RegisterAppUser = Pick<AppUser, "driveAuth" | "userAuth">;
