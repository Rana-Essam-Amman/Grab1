export interface ChatMessage {
  readonly id: string;
  readonly text: string;
  readonly fromBuyer: boolean;
  readonly timestamp: string;
}

export interface CreateMessageInput {
  text: string;
  fromBuyer: boolean;
}

export const MAX_MESSAGE_LENGTH = 2000;
