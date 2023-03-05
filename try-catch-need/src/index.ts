import { UserFactory } from "@/repository/user";

(async () => {
  const userFactory = new UserFactory({ seed: 0 });
  // const resultListUp = await userFactory.listUp({ token: "xxx" });

  // if (resultListUp.isErr()) {
  //   console.log(resultListUp.error);
  //   return;
  // }
  // console.log(resultListUp.value);

  const resultFindById = await userFactory.findById({
    token: "xxx",
    userId: 2,
  });

  if (resultFindById.isErr()) {
    console.log(resultFindById.error);
    return;
  }
  console.log(resultFindById.value);

  return 0;
})();
