import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});
const UsersSchema = UserSchema.array();
const UserDataSchema = UserSchema.nullish();
const UsersDataSchema = UserSchema.array().nullish();

export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<typeof UsersSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
export type UsersData = z.infer<typeof UsersDataSchema>;

// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
export type UserID = {
  [Property in keyof Pick<User, "id"> as `user${Capitalize<
    string & Property
  >}`]: Pick<User, "id">[Property];
};
