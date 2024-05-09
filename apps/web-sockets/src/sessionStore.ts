import type { SocketSession } from '@sessions/web-types';

/* abstract */ class SessionStore {
  createSession() {
    const id = crypto.randomUUID();
    this.saveSession({ id });
    return id;
  }

  findSession(id: string) {}
  saveSession(session: SocketSession) {}
  findAllSessions() {}
}

export class InMemorySessionStore extends SessionStore {
  sessions: Map<string, SocketSession>;

  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(session: SocketSession) {
    this.sessions.set(session.id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
