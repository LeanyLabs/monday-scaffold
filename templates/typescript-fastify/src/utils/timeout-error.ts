export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeError';
  }
}

