import Base from './../base/base';
import { templ } from '../../types/heap';

class Win {
    base: Base;
    winWrap: HTMLElement;

    constructor(base: Base) {
        this.base = base;
        this.winWrap = document.createElement('div');
        this.winWrap.id = 'win_wrap_page';
        document.body.appendChild(this.winWrap);
    }

    show() {
        //const win = this;
        this.winWrap.innerHTML = templ['headerWin'];
        const tmpTitle = document.getElementsByClassName('title_gar');
        for (let i = 0; i < tmpTitle.length; i += 1) {
            if (tmpTitle[i])
                tmpTitle[i].addEventListener('click', () => {
                    const win_wrap = document.getElementById('win_wrap_page');
                    if (win_wrap) win_wrap.style.display = 'none';
                    const race_wrap = document.getElementById('race_wrap');
                    if (race_wrap) race_wrap.style.display = 'block';
                });
        }
        const tmpTitle2 = document.getElementsByClassName('title_win');
        for (let i = 0; i < tmpTitle.length; i += 1) {
            if (tmpTitle2[i])
                tmpTitle2[i].addEventListener('click', () => {
                    const win_wrap = document.getElementById('win_wrap_page');
                    if (win_wrap) win_wrap.style.display = 'block';
                    const race_wrap = document.getElementById('race_wrap');
                    if (race_wrap) race_wrap.style.display = 'none';
                });
        }
    }
}
export default Win;
