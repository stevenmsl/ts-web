import { User, UserProps } from "../models/User";

import { View } from "./View";

export class UserForm extends View<User, UserProps> {
  eventsMap(): { [key: string]: () => void } {
    return {
      "click:.set-age": this.onSetAgeClick /* query by class name */,
      "click:.set-name": this.onSetNameClick,
      "click:.save-model": this.onSaveClick,
    };
  }

  onSaveClick = () => {
    this.model.save();
  };

  onSetNameClick = () => {
    const input = this.parent.querySelector("input");
    if (input) {
      const name = input.value;
      this.model.set({ name });
    }
  };

  /* need to use arrow function */
  onSetAgeClick = () => {
    this.model.setRandomAge();
  };

  template() {
    return `
        <div>
            <input placeholder="${this.model.get("name")}" />
            <button class="set-name">Change Name</button> 
            <button class="set-age">Set Random Age</button>
            <button class="save-model">Save User</button> 
        </div>
      `;
  }
}
