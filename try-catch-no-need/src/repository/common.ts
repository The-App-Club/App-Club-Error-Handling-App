import { z } from "zod";

export interface CustomErrorData {}

export class AuthorizationError extends Error implements CustomErrorData {
  override readonly name = "AuthorizationError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

export class ValidationError extends Error implements CustomErrorData {
  override readonly name = "ValidationError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

export class NotExistsError extends Error implements CustomErrorData {
  override readonly name = "NotExistsError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

export class SystemError extends Error implements CustomErrorData {
  override readonly name = "SystemError" as const;
  constructor(message: string, options?: { cause: unknown }) {
    super(message, options);
    this.cause = options?.cause;
  }
}

export type ValidationData = {
  isOk: boolean;
};

const AuthorizationErrorDataSchema = z.custom<AuthorizationError>();
const ValidationErrorDataSchema = z.custom<ValidationError>();
const NotExistsErrorDataSchema = z.custom<NotExistsError>();
const SystemErrorDataSchema = z.custom<SystemError>();

export type AuthorizationErrorData = z.infer<
  typeof AuthorizationErrorDataSchema
>;
export type ValidationErrorData = z.infer<typeof ValidationErrorDataSchema>;
export type NotExistsErrorData = z.infer<typeof NotExistsErrorDataSchema>;
export type SystemErrorData = z.infer<typeof SystemErrorDataSchema>;

// https://blog.ojisan.io/my-new-error/
export type RepositoryErrorData =
  | AuthorizationErrorData
  | ValidationErrorData
  | NotExistsErrorData
  | SystemErrorData;

export type ErrorTypePatterns =
  | "AuthorizationError"
  | "ValidationError"
  | "NotExistsError"
  | "SystemError";
export type ErrorPattern = { [K in ErrorTypePatterns]: boolean };
export type ErrorPatterns = ErrorPattern[];
