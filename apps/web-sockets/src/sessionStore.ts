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
    const newId = crypto.randomUUID();
    this.saveSession(newId, { id: newId, connected: false });
    this.logger.verbose(`creating session with id: ${newId}`);
    return newId;
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(sessionId: string, session: SocketSession) {
    this.sessions.set(sessionId, session);

    this.logger.debug(this.findAllSessions());
  }

  updateSession(
    sessionId: string,
    session: Partial<Omit<SocketSession, 'id'>>,
  ) {
    const currentSession = this.sessions.get(sessionId);

    if (!currentSession) {
      throw new Error(`Session with ID ${sessionId} does not exist.`);
    }

    this.sessions.set(sessionId, { ...currentSession, ...session });
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
