class StatusError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createError = (message: string, statusCode: number) => {
  const error = new StatusError(message, statusCode);

  throw error;
};

export default createError;
