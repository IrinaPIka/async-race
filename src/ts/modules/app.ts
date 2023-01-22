import Base from './base/base';
import Race from './race/race';
class App {
    base: Base;
    racePage: Race;
    constructor() {
        this.base = new Base();
        this.racePage = new Race(this.base);
        this.racePage.show();
    }
}

export default App;
