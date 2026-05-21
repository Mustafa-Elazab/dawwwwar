export const createRequestController = () => new AbortController();

export const withAbort = <T>(promise: Promise<T>, controller: AbortController): Promise<T> => {
  return promise.finally(() => controller.abort());
};
