import { AxiosPromise } from "axios";

/* #CI03 */
interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  /*  #TS01
    - K extends keyof T
      - K is limited to the list of properties T has
      - in the User class case, K is of type "name" | "age", 
        so K can be either "name" or "age" but nothing else
    - T[K] will get the type of the property you are
      retrieving
      - T["name"] will be string, and T["age"] will be number     
  */
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface HasId {
  id?: number;
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>, //#REF01, #CI01
    private events: Events,
    private sync: Sync<T>
  ) {}

  /* #REF03
    - use getter to implement passthrough methods
      - returns a reference to the method you want to
        expose  
      - to avoid maintaining the same signature in this 
        class that the on method has in the Eventing class
      - if we were to modify the signature of the on method
        in the Eventing class it won't affect the User class
    - you can only use the shortened syntax if the methods
      you are passing through is from an instance that is
      initialized in the constructor arguments (check #REF01)
      - this is due to how the JS code is generated
      - if you initialize the properties inside the
        constructor body it won't work (check #REF02)

  */

  on = this.events.on; /* #CI02 */
  trigger = this.events.trigger;
  get = this.attributes.get;
  getAll = this.attributes.getAll;

  set(update: T) {
    this.attributes.set(update);
    this.events.trigger("change");
  }

  fetch() {
    const id = this.attributes.get("id");
    if (typeof id !== "number") {
      throw new Error("Cannot fetch without and id");
    }

    this.sync.fetch(id).then((response) => {
      /* 
        - use this.set to also trigger the change event
        - use this.attributes.set otherwise  
      */
      this.set(response.data);
    });
  }

  save() {
    this.sync
      .save(this.attributes.getAll())
      .then((response) => {
        this.events.trigger("save");
      })
      .catch(() => {
        this.trigger("error");
      });
  }
}
