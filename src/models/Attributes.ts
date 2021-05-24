export class Attributes<T> {
  constructor(private data: T) {}

  /*
    - use arrow function to have the right context
      - make sure that "this" is pointing to the
        instance of Attribute
  */
  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  set = (update: T) => {
    Object.assign(this.data, update);
  };

  getAll = () => {
    return this.data;
  };
}
