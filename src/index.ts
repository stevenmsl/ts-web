import { UserEdit } from "./views/UserEdit";
import { User, UserProps } from "./models/User";
import { UserList } from "./views/UserList";
import { Collection } from "./models/Collection";

const users = new Collection(
  "http://localhost:3000/users",
  (json: UserProps) => {
    return User.build(json);
  }
);

users.on("change", () => {
  const root = document.getElementById("root");
  if (root) {
    new UserList(root, users).render();
  }
});

users.fetch();

const user = User.build({ name: "Arlo", age: 2 });

const root2 = document.getElementById("root2");
if (root2) {
  const userEdit = new UserEdit(root2, user);
  userEdit.render();
  console.log(userEdit);
}
