export { emailSet, emailHttpEndpoints } from './email-set.js';
export { emailPlugin } from './plugins/runtime/plugin.js';
export { createEmailBackend } from './plugins/runtime/backend.js';
export { EMAIL_MIGRATIONS } from './plugins/runtime/migrations.js';
export type { Email, EmailFolder, AddEmailInput, EmailPatch } from './types/email.js';
export type { EmailImplementation } from './types/implementation.js';
