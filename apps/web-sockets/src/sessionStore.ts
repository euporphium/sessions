import type { SocketSession } from '@sessions/web-types';
import type { Logger } from './logger';

export class InMemorySessionStore {
  logger: Logger;
  sessions: Map<string, SocketSession>;

  constructor(logger: Logger) {
    this.logger = logger;
    this.logger.verbose('initializing in-memory session store');

    this.sessions = new Map();
  }

  createSession() {
    this.logger.verbose('creating session');

    const newId = crypto.randomUUID();
    this.saveSession(newId, { id: newId, connected: true });
    return newId;
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(sessionId: string, session: SocketSession) {
    this.sessions.set(sessionId, session);

    this.logger.debug(this.findAllSessions());
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
