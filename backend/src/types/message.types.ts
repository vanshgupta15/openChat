export interface Message {
  _id: string;
  roomId: string;
  userId: string;
  displayName: string;
  photoURL: string;
  message: string;
  createdAt: Date;
}

export interface CreateMessageRequest {
  roomId: string;
  userId: string;
  displayName: string;
  photoURL: string;
  message: string;
}

