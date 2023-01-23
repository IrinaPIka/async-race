import Base from './../base/base';
import { templ, IWin } from '../../types/heap';

class Win {
    base: Base;
    winWrap: HTMLElement;
    nPage = 1;
    nWins = 0;
    winsInPage: Array<IWin> = [];
    winsAll: Array<IWin> = [];
    elemNumWins: HTMLElement | null = null;
    elemCurPage: HTMLElement | null = null;
    elemTableWin: HTMLElement | null = null;

    constructor(base: Base) {
        this.base = base;
        this.winWrap = document.createElement('div');
        this.winWrap.id = 'win_wrap_page';
        this.winWrap.style.display = 'none';
        document.body.appendChild(this.winWrap);
    }

    newWin(id: number, time: number) {
        /*let find = -1;
        for (let i = 0; i < this.winsAll.length; i += 1) {
            console.log(i, this.winsAll[i], this.winsAll[i].id);
            if (this.winsAll[i].id === id) find = id;
        }
        console.log('find', find, this.winsAll);*/
        const elem = this.winsAll.find((item) => item.id === id);
        if (elem === undefined)
            this.base.addWin({ id: id, wins: 1, time: time }).then(() => {
                this.getWinAll();
            });
        else {
            //const elem = this.winsAll[find];
            if (elem.time > time) elem.time = time;
            elem.wins += 1;
            this.base.updateWin(elem).then(() => {
                this.getWinAll();
            });
        }
    }

    async getWinInPage() {
        this.base.getWinners(this.nPage).then((result) => {
            console.log('getWinInPage', result);
            this.winsInPage = result.items;
            if (this.elemCurPage !== null) {
                this.elemCurPage.innerHTML = String(this.nPage);
            }
            this.drawTable();
        });
    }

    async getWinAll() {
        this.base.getWinners().then((result) => {
            console.log('getWinAll', result);
            this.winsAll = result.items;
            if (this.elemNumWins !== null) {
                console.log('getWinAll -1', this.winsAll.length);
                this.elemNumWins.innerHTML = String(this.winsAll.length);
            }
        });
    }

    drawTable() {
        this.elemTableWin = document.getElementById('win_table');
        if (this.elemTableWin) this.elemTableWin.innerHTML = templ['tableWinTitle'];
        for (let i = 0; i < this.winsInPage.length; i += 1) {
            const win = this.winsInPage[i];
            const tr = document.createElement('tr');
            this.base.getCar(win.id).then((result) => {
                let tmp = `<td> ${i} </td>`;
                tmp += `<td><div style="background-color: ${result.item.color}" class="car-table-win"><img src="./images/car.png"></div></td>`;
                tmp += `<td><div>${result.item.name}</div></td>`;
                tmp += `<td><div>${win.wins}</div></td>`;
                tmp += `<td><div>${win.time}</div></td>`;
                tr.innerHTML = tmp;
                this.elemTableWin?.appendChild(tr);
            });
        }
    }

    show() {
        this.winWrap.innerHTML = templ['headerWin'] + templ['tableWin'];
        this.elemNumWins = document.getElementById('num_win');
        this.elemCurPage = document.getElementById('n_page_win');
        this.getWinAll();
        this.getWinInPage();
        const tmpRace = document.getElementById('title_gar1');
        tmpRace?.addEventListener('click', () => {
            const tmpRW = document.getElementById('race_wrap');
            if (tmpRW) tmpRW.style.display = 'block';
            const tmpWW = document.getElementById('win_wrap_page');
            if (tmpWW) tmpWW.style.display = 'none';
        });
    }
}
export default Win;
