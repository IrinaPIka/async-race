import Base from './../base/base';
import { templ, IWin, nWinInPage } from '../../types/heap';

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
    elemNextPage: HTMLElement | null = null;
    elemPrevPage: HTMLElement | null = null;
    sortArr: Array<HTMLElement | null> = [];
    sortCur = -1;

    constructor(base: Base) {
        this.base = base;
        this.winWrap = document.createElement('div');
        this.winWrap.id = 'win_wrap_page';
        this.winWrap.style.display = 'none';
        document.body.appendChild(this.winWrap);
    }

    newWin(id: number, time: number) {
        const elem = this.winsAll.find((item) => item.id === id);
        if (elem === undefined)
            this.base.addWin({ id: id, wins: 1, time: time }).then(() => {
                this.getWinAll();
            });
        else {
            if (elem.time > time) elem.time = time;
            elem.wins += 1;
            this.base.updateWin(elem).then(() => {
                this.getWinAll();
            });
        }
    }

    async getWinInPage() {
        this.base.getWinners(this.nPage, this.sortCur).then((result) => {
            this.winsInPage = result.items;
            if (this.elemCurPage !== null) {
                this.elemCurPage.innerHTML = String(this.nPage);
            }
            this.drawTable();
        });
    }

    async getWinAll() {
        this.base.getWinners().then((result) => {
            this.winsAll = result.items;
            if (this.elemNumWins !== null) {
                this.elemNumWins.innerHTML = String(this.winsAll.length);
                this.nWins = this.winsAll.length;
            }
        });
    }

    drawTable() {
        this.elemTableWin = document.getElementById('win_table');
        if (this.elemTableWin) this.elemTableWin.innerHTML = templ['tableWinTitle'];
        this.sortArr[0] = document.getElementById('sort_win_up');
        this.sortArr[1] = document.getElementById('sort_win_down');
        this.sortArr[2] = document.getElementById('sort_time_up');
        this.sortArr[3] = document.getElementById('sort_time_down');
        const win = this;
        for (let i = 0; i <= 3; i += 1) {
            if (this.sortCur === i) this.sortArr[i]?.classList.add('sel');
            this.sortArr[i]?.addEventListener('click', function () {
                win.sort(i);
                win.getWinInPage();
            });
        }

        for (let i = 0; i < this.winsInPage.length; i += 1) {
            const curN = i + 1 + (this.nPage - 1) * nWinInPage;
            const win = this.winsInPage[i];
            const tr = document.createElement('tr');
            this.base.getCar(win.id).then((result) => {
                let tmp = `<td> ${curN} </td>`;
                tmp += `<td><div style="background-color: ${result.item.color}" class="car-table-win"><img src="./images/car.png"></div></td>`;
                tmp += `<td><div>${result.item.name}</div></td>`;
                tmp += `<td><div>${win.wins}</div></td>`;
                tmp += `<td><div>${win.time}</div></td>`;
                tr.innerHTML = tmp;
                this.elemTableWin?.appendChild(tr);
            });
        }
    }

    async changePage(to: boolean) {
        const nPages = Math.ceil(this.nWins / nWinInPage);
        console.log('cjhange', this.nPage, this.nWins, nPages);
        if (to && this.nPage < nPages) this.nPage += 1;
        if (!to && this.nPage > 1) this.nPage -= 1;
        console.log('cjhange-2', this.nPage, this.nWins, nPages);
        this.getWinInPage();
    }

    show() {
        const win = this;
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
        this.elemNextPage = document.getElementById('next_page_w');
        this.elemPrevPage = document.getElementById('prev_page_w');
        this.elemNextPage?.addEventListener('click', function () {
            win.changePage(true);
        });
        this.elemPrevPage?.addEventListener('click', function () {
            win.changePage(false);
        });
    }

    sort(cur: number) {
        for (let i = 0; i <= 3; i += 1) {
            if (cur === i) this.sortArr[i]?.classList.add('sel');
            else this.sortArr[i]?.classList.remove('sel');
        }
        this.sortCur = cur;
    }
}
export default Win;
