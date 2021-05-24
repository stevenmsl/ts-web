import axios from "axios";
import { Eventing } from "./Eventing";

export class Collection<T, K> {
  models: T[] = [];
  events = new Eventing();
  constructor(public rootUrl: string, public deserialize: (json: K) => T) {}

  /* #REF02
    - you can't use the shortened syntax here
      as the events are not initialized in
      in the constructor argument list 
      (check #REF03) 
  */
  get on() {
    return this.events.on;
  }
  get trigger() {
    return this.events.trigger;
  }
  fetch = () => {
    axios.get(this.rootUrl).then((response) => {
      response.data.forEach((value: K) => {
        this.models.push(this.deserialize(value));
      });
      this.events.trigger("change");
    });
  };
}
