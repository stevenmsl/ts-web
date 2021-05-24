import { Model } from "./Model";
import { Attributes } from "./Attributes";
import { ApiSync } from "./ApiSync";
import { Eventing } from "./Eventing";
import { Collection } from "./Collection";

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

const rootUrl = "http://localhost:3000/users";

/* #CI04 */
export class User extends Model<UserProps> {
  /* #CI05
     wire up child components
  */
  static build(attrs: UserProps) {
    return new User(
      new Attributes(attrs),
      new Eventing(),
      new ApiSync<UserProps>(rootUrl)
    );
  }

  static buildCollection() {
    return new Collection<User, UserProps>(
      "http://localhost:3000/users",
      (json) => User.build(json)
    );
  }

  setRandomAge() {
    const age = Math.round(Math.random() * 100);
    this.set({ age });
  }
}
