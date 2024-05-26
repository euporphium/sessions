import type { SocketConnection } from '@sessions/web-types';
import type { Logger } from './logger';

export class InMemoryConnectionStore {
  logger: Logger;
  connections: Map<string, SocketConnection>;

  constructor(logger: Logger) {
    this.logger = logger;
    this.logger.verbose('initializing in-memory connection store');
    this.connections = new Map();
  }

  createConnection() {
    const newId = crypto.randomUUID();
    this.saveConnection(newId, { id: newId, connected: false });
    this.logger.verbose(`creating connection: ${newId}`);
    return newId;
  }

  findConnection(id: string) {
    return this.connections.get(id);
  }

  saveConnection(connectionId: string, connection: SocketConnection) {
    this.connections.set(connectionId, connection);

    this.logger.debug(this.findAllConnections());
  }

  updateConnection(
    connectionId: string,
    connection: Partial<Omit<SocketConnection, 'id'>>,
  ) {
    const currentConnection = this.connections.get(connectionId);

    if (!currentConnection) {
      this.logger.error(
        `Failed to connection ${connectionId} - it does not exist`,
      );
    }

    this.connections.set(connectionId, { ...currentConnection, ...connection });
  }

  findAllConnections() {
    return [...this.connections.values()];
  }
}
