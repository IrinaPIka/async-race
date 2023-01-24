import Base from './base/base';
import Race from './race/race';
import Win from './win/win';
class App {
    base: Base;
    racePage: Race;
    winPage: Win;
    constructor() {
        this.base = new Base();
        this.winPage = new Win(this.base);
        this.winPage.show();
        this.racePage = new Race(this.base, this.winPage);
    }
}

export default App;
