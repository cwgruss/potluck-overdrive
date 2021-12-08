export interface UserFirestoreEntity {
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  joined: number;
  photoURL: string;
  role: string;
  isEmailVerified: boolean;
  uid?: string;
}
