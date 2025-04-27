import { AppError } from './errors';

export async function handleAsync<T>(
  promise: Promise<T>
): Promise<[T | null, AppError | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    if (error instanceof AppError) {
      return [null, error];
    }
    // Convert unknown errors to AppError
    return [null, new AppError(error instanceof Error ? error.message : 'An unknown error occurred', 500)];
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }
  
  return new AppError('An unknown error occurred', 500);
} 