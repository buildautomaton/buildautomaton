import type { AddEmailInput, Email, EmailFolder, EmailPatch } from './email.js';

export type EmailImplementation = {
  listEmails(folder?: EmailFolder): Email[];
  getEmail(id: string): Email | null;
  addEmail(input: AddEmailInput): Email;
  updateEmail(id: string, patch: EmailPatch): Email | null;
  deleteEmail(id: string): boolean;
};
