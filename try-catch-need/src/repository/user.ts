import { Result, ResultAsync } from "neverthrow";
import { Simplify } from "type-fest";
import { UserData, UserID, UsersData } from "@/types/user";
import {
  AuthorizationError,
  AuthorizationErrorData,
  ErrorPattern,
  ErrorPatterns,
  ErrorTypePatterns,
  NotExistsError,
  NotExistsErrorData,
  RepositoryErrorData,
  ValidationError,
  ValidationErrorData,
} from "@/repository/common";
import { Session } from "@/types/session";

const data = [
  {
    id: 1,
    name: "Cowboy",
  },
  {
    id: 2,
    name: "Bebop",
  },
];

type NeatType = Simplify<UserID & Session>;
type NeatType2 = Simplify<Session>;

interface UserRepository {
  findById: ({
    userId,
    token,
  }: NeatType) => Promise<Result<UserData, RepositoryErrorData>>;
  listUp: ({
    token,
  }: NeatType2) => Promise<Result<UsersData, RepositoryErrorData>>;
}

export class UserFactory implements UserRepository {
  private errorPatterns: ErrorPatterns = [
    {
      AuthorizationError: false,
      ValidationError: false,
      NotExistsError: false,
    },
    {
      AuthorizationError: false,
      ValidationError: true,
      NotExistsError: false,
    },
    {
      AuthorizationError: true,
      ValidationError: false,
      NotExistsError: false,
    },
    {
      AuthorizationError: true,
      ValidationError: true,
      NotExistsError: false,
    },
  ];

  private factoryMode: ErrorPattern = {
    AuthorizationError: false,
    ValidationError: false,
    NotExistsError: false,
  };

  constructor({ seed = 0 }: { seed: number }) {
    this.factoryMode = this.errorPatterns[seed];
  }

  getFactoryMode(errorType: ErrorTypePatterns) {
    return this.factoryMode[errorType];
  }

  checkExists({ userId }: UserID): Promise<NotExistsErrorData> {
    return new Promise((resolve, reject) => {
      const isExists = data.find((d) => d.id === userId) ? true : false;
      if (!isExists) {
        reject(
          new NotExistsError(`該当データは存在しません`, {
            cause: new Error("Something went wrong..."),
          })
        );
      }
      resolve(null);
    });
  }

  checkAuthorized(): Promise<AuthorizationErrorData> {
    return new Promise((resolve, reject) => {
      if (this.getFactoryMode("AuthorizationError")) {
        reject(
          new AuthorizationError(`ログインしてください`, {
            cause: new Error("Something went wrong..."),
          })
        );
      }
      resolve(null);
    });
  }

  validateArgument(): Promise<ValidationErrorData> {
    return new Promise((resolve, reject) => {
      if (this.getFactoryMode("ValidationError")) {
        reject(
          new ValidationError(`引数が不正です`, {
            cause: new Error("Something went wrong..."),
          })
        );
      }
      resolve(null);
    });
  }

  async doListUp(): Promise<UsersData> {
    return new Promise(async (resolve, reject) => {
      try {
        const resultCheckAuthorized = await this.checkAuthorized();
        const resultValidateArgument = await this.validateArgument();
        if (!resultValidateArgument && !resultCheckAuthorized) {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async doFindById({ userId }: UserID): Promise<UserData> {
    return new Promise(async (resolve, reject) => {
      try {
        const resultCheckAuthorized = await this.checkAuthorized();
        const resultValidateArgument = await this.validateArgument();
        const resultCheckExists = await this.checkExists({ userId });
        if (
          !resultValidateArgument &&
          !resultCheckAuthorized &&
          !resultCheckExists
        ) {
          resolve(data.find((d) => d.id === userId));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async findById({
    userId,
    token,
  }: NeatType): Promise<Result<UserData, RepositoryErrorData>> {
    return ResultAsync.fromPromise<UserData, RepositoryErrorData>(
      this.doFindById({ userId }),
      (e) => e as RepositoryErrorData
    ).map((v) => v);
  }
  async listUp({
    token,
  }: NeatType2): Promise<Result<UsersData, RepositoryErrorData>> {
    return ResultAsync.fromPromise<UsersData, RepositoryErrorData>(
      this.doListUp(),
      (e) => e as RepositoryErrorData
    ).map((v) => v);
  }
}
