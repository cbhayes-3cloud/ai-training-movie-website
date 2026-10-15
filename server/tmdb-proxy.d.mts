import type { IncomingMessage, ServerResponse } from 'node:http';

export interface TmdbCredentials {
  accessToken?: string;
  apiKey?: string;
}

export function createTmdbProxy(credentials: TmdbCredentials): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export function credentialsFromEnv(env: Record<string, string | undefined>): TmdbCredentials;
