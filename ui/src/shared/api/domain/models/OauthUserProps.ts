import { EmailAddress } from "./EmailAddress";

export interface OAuthUserProps {
  uid: string;
  emailAddress: EmailAddress;
  displayName: string | null;
  photoURL: string | null;
}
