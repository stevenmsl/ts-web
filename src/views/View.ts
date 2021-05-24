import { Model } from "../models/Model";

interface ModelForView {
  on(eventName: string, callback: () => void): void;
}

/* #TS02
  - how to specify a constraint (Model), which 
    itself is a generic type
    - you need to expose two generic type parameters
      - T for the type of the overall model
      - K for the type of the attributes T has    
*/
export abstract class View<T extends Model<K>, K> {
  /*
    - store the regions that can be used 
      to render nested views
  */
  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  abstract template(): string;

  /* 
     - this is used to populate the regions
       that a view defined
     - each region is used to render a nested
       view 
     - value is a selector to find the region 
  */
  regionsMap(): { [key: string]: string } {
    return {};
  }
  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  bindModel() {
    /* re-render the form if the model changed */
    this.model.on("change", () => {
      this.render();
    });
  }

  bindEvents(fragment: DocumentFragment) {
    const eventsMap = this.eventsMap();

    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(":");
      fragment.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  mapRegions(fragment: DocumentFragment) {
    const regionsMap = this.regionsMap();
    for (let key in regionsMap) {
      const selector = regionsMap[key];
      const element = fragment.querySelector(selector);
      if (element) {
        this.regions[key] = element;
      }
    }
  }

  onRender() {}

  render() {
    this.parent.innerHTML = "";
    const templateElement = document.createElement("template");
    /* convert string to HTML elements  */
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);

    this.onRender();

    /* content is a reference to a DocumentFragment */
    this.parent.append(templateElement.content);
  }
}
