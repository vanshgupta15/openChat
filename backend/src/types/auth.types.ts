export interface AuthenticatedUser {
  uid: string;
  email?: string;
  displayName: string;
  photoURL: string;
}

export interface FirebaseToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}
