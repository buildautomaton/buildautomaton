export type EmailFolder = 'inbox' | 'sent' | 'draft' | 'archive';

export type Email = {
  id: string;
  fromAddr: string;
  toAddr: string;
  subject: string;
  body: string;
  folder: EmailFolder;
  read: boolean;
  createdAt: string;
};

export type AddEmailInput = {
  fromAddr: string;
  toAddr: string;
  subject?: string;
  body?: string;
  folder?: EmailFolder;
};

export type EmailPatch = {
  folder?: EmailFolder;
  read?: boolean;
  subject?: string;
  body?: string;
};
