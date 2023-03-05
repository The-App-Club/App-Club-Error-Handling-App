import { z } from "zod";

export class AuthorizationError extends Error {
  override readonly name = "AuthorizationError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

export class ValidationError extends Error {
  override readonly name = "ValidationError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

export class NotExistsError extends Error {
  override readonly name = "NotExistsError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

const AuthorizationErrorDataSchema = z.custom<AuthorizationError>().nullish();
const ValidationErrorDataSchema = z.custom<ValidationError>().nullish();
const NotExistsErrorDataSchema = z.custom<NotExistsError>().nullish();

export type AuthorizationErrorData = z.infer<
  typeof AuthorizationErrorDataSchema
>;
export type ValidationErrorData = z.infer<typeof ValidationErrorDataSchema>;
export type NotExistsErrorData = z.infer<typeof NotExistsErrorDataSchema>;

// https://blog.ojisan.io/my-new-error/
export type RepositoryErrorData =
  | AuthorizationErrorData
  | ValidationErrorData
  | NotExistsErrorData;

export type ErrorTypePatterns =
  | "AuthorizationError"
  | "ValidationError"
  | "NotExistsError";
export type ErrorPattern = { [K in ErrorTypePatterns]: boolean };
export type ErrorPatterns = ErrorPattern[];
