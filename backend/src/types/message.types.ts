export interface Message {
  _id: string;
  roomId: string;
  username: string;
  message: string;
  createdAt: Date;
}

export interface CreateMessageRequest {
  roomId: string;
  username: string;
  message: string;
}
