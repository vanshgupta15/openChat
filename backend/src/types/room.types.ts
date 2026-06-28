export interface Room {
  _id: string;
  roomName: string;
  createdAt: Date;
}

export interface CreateRoomRequest {
  roomName: string;
}
