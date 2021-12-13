export interface UserFirestoreEntity {
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateJoined: Date;
  photoURL: string;
  role: string;
  isEmailVerified: boolean;
  uuid?: string;
}
