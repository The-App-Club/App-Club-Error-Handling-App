import { Err, Ok, Result, ResultAsync } from "neverthrow";
import { Simplify } from "type-fest";
import { UserData, UserID, UsersData } from "@/types/user";
import {
  AuthorizationError,
  AuthorizationErrorData,
  CustomErrorData,
  ErrorPattern,
  ErrorPatterns,
  ErrorTypePatterns,
  ValidationData,
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
  }: NeatType) => Promise<Result<UserData, CustomErrorData>>;
  listUp: ({ token }: NeatType2) => Promise<Result<UsersData, CustomErrorData>>;
}

export class UserFactory implements UserRepository {
  private errorPatterns: ErrorPatterns = [
    {
      AuthorizationError: false,
      ValidationError: false,
      NotExistsError: false,
      SystemError: false,
    },
    {
      AuthorizationError: false,
      ValidationError: true,
      NotExistsError: false,
      SystemError: false,
    },
    {
      AuthorizationError: true,
      ValidationError: false,
      NotExistsError: false,
      SystemError: false,
    },
    {
      AuthorizationError: true,
      ValidationError: true,
      NotExistsError: false,
      SystemError: false,
    },
  ];

  private factoryMode: ErrorPattern = {
    AuthorizationError: false,
    ValidationError: false,
    NotExistsError: false,
    SystemError: false,
  };

  constructor({ seed = 0 }: { seed: number }) {
    this.factoryMode = this.errorPatterns[seed];
  }

  getFactoryMode(errorType: ErrorTypePatterns) {
    return this.factoryMode[errorType];
  }

  async checkExists({
    userId,
  }: UserID): Promise<Result<ValidationData, NotExistsErrorData>> {
    const isExists = data.find((d) => d.id === userId) ? true : false;
    if (!isExists) {
      return new Err(
        new NotExistsError(`該当データは存在しません userId=${userId}`, {
          cause: new Error("Something went wrong..."),
        })
      );
    }
    return new Ok({ isOk: true });
  }

  async checkAuthorized(): Promise<
    Result<ValidationData, AuthorizationErrorData>
  > {
    if (this.getFactoryMode("AuthorizationError")) {
      return new Err(
        new AuthorizationError(`ログインしてください`, {
          cause: new Error("Something went wrong..."),
        })
      );
    }
    return new Ok({
      isOk: true,
    });
  }

  async validateArgument(): Promise<
    Result<ValidationData, ValidationErrorData>
  > {
    if (this.getFactoryMode("ValidationError")) {
      return new Err(
        new ValidationError(`引数が不正です`, {
          cause: new Error("Something went wrong..."),
        })
      );
    }
    return new Ok({
      isOk: true,
    });
  }

  async doListUp(): Promise<Result<UsersData, CustomErrorData>> {
    const resultCheckAuthorized = await this.checkAuthorized();

    if (resultCheckAuthorized.isErr()) {
      return new Err(resultCheckAuthorized.error);
    }

    const resultValidateArgument = await this.validateArgument();

    if (resultValidateArgument.isErr()) {
      return new Err(resultValidateArgument.error);
    }

    return new Ok(data);
  }

  async doFindById({
    userId,
  }: UserID): Promise<Result<UserData, CustomErrorData>> {
    const resultCheckAuthorized = await this.checkAuthorized();

    if (resultCheckAuthorized.isErr()) {
      return new Err(resultCheckAuthorized.error);
    }

    const resultValidateArgument = await this.validateArgument();

    if (resultValidateArgument.isErr()) {
      return new Err(resultValidateArgument.error);
    }

    const resultCheckExists = await this.checkExists({ userId });

    if (resultCheckExists.isErr()) {
      return new Err(resultCheckExists.error);
    }

    return new Ok(data.find((d) => d.id === userId));
  }

  async findById({
    userId,
    token,
  }: NeatType): Promise<Result<UserData, CustomErrorData>> {
    const result = await this.doFindById({ userId });
    if (result.isErr()) {
      return new Err(result.error);
    }
    return new Ok(result.value);
  }
  async listUp({
    token,
  }: NeatType2): Promise<Result<UsersData, CustomErrorData>> {
    const result = await this.doListUp();
    if (result.isErr()) {
      return new Err(result.error);
    }
    return new Ok(result.value);
  }
}
