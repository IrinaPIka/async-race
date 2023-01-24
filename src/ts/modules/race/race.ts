import Base from './../base/base';
import Win from './../win/win';
import { templ, vendors, models, nCarsInPage, ICar, ICarGo, createByTag } from '../../types/heap';

class Race {
    base: Base;
    win: Win;
    nCars = 0;
    nPage = 1;
    raceWrap: HTMLElement;
    page_garage: HTMLElement | null = null;
    elemNumCars: HTMLElement | null = null;
    elemCurPage: HTMLElement | null = null;
    elemTableRace: HTMLElement | null = null;
    elemRace: HTMLInputElement | null = null;
    elemReset: HTMLInputElement | null = null;
    carsInPage: Array<ICar> = [];
    handle: Array<NodeJS.Timer> = [];
    curWin = 0;
    timeStart = 0;

    constructor(base: Base, win: Win) {
        this.base = base;
        const race = this;
        this.win = win;
        this.raceWrap = document.createElement('div');
        this.raceWrap.id = 'race_wrap';
        this.raceWrap.innerHTML = templ['headerRace'] + templ['tableRace'] + templ['winRace'];
        document.body.appendChild(this.raceWrap);

        this.elemNumCars = document.getElementById('num_cars');
        this.elemCurPage = document.getElementById('n_page');

        document.getElementById('create')?.addEventListener('click', function () {
            const text = <HTMLInputElement>document.getElementById('item_create');
            const color = <HTMLInputElement>document.getElementById('color_create');
            race.base.addCar({ name: text?.value, color: color?.value });
            race.drawTableCar();
        });
        document.getElementById('update')?.addEventListener('click', function () {
            const textTmp = <HTMLInputElement>document.getElementById('item_update');
            const colorTmp = <HTMLInputElement>document.getElementById('color_update');
            const idTmp = <HTMLInputElement>document.getElementById('id_update');
            if (textTmp && colorTmp && idTmp) {
                race.base.updateCar({ name: textTmp.value, color: colorTmp.value, id: Number(idTmp.value) });
                race.drawTableCar();
            }
        });
        document.getElementById('next_page')?.addEventListener('click', () => race.changePage(true));
        document.getElementById('prev_page')?.addEventListener('click', () => race.changePage(false));
        document.getElementById('generate')?.addEventListener('click', () => race.add100Car());
        this.drawTableCar();

        document.getElementById('title_win1')?.addEventListener('click', () => {
            const tmpRW = document.getElementById('race_wrap');
            if (tmpRW) tmpRW.style.display = 'none';
            const tmpWW = document.getElementById('win_wrap_page');
            if (tmpWW) tmpWW.style.display = 'block';
        });
        this.butRaceReset();
    }

    butRaceReset() {
        const race = this;
        this.elemRace = <HTMLInputElement>document.getElementById('race');
        this.elemReset = <HTMLInputElement>document.getElementById('reset');
        this.elemTableRace = document.getElementById('race_table');
        this.elemRace?.addEventListener('click', function () {
            race.curWin = -1;
            race.timeStart = Date.now();
            const cars = document.getElementsByClassName('car_img');
            for (let i = 0; i < cars.length; i += 1) {
                const tmp = cars[i].id.replace('car_img', '');
                race.driveCar(tmp);
            }
            this.disabled = true;
        });
        this.elemReset?.addEventListener('click', function () {
            const cars = document.getElementsByClassName('car_img');
            for (let i = 0; i < cars.length; i += 1) {
                const nN = Number(cars[i].id.replace('car_img', ''));
                if (race.handle[nN]) clearInterval(race.handle[nN]);
                const tmp = <HTMLElement>cars[i];
                tmp.style.marginLeft = '0px';
                const tmpBack = <HTMLButtonElement>document.getElementById('back' + nN);
                if (tmpBack) tmpBack.disabled = true;
                const tmpStart = <HTMLButtonElement>document.getElementById('forward' + nN);
                if (tmpStart) tmpStart.disabled = false;
            }
            if (race.elemRace) race.elemRace.disabled = false;
        });
    }

    async drawTableCar() {
        this.base.getCars(this.nPage).then((result) => {
            if (result.cpunt !== null && this.elemNumCars !== null) {
                this.nCars = Number(result.cpunt);
                this.elemNumCars.innerHTML = result.cpunt;
                this.carsInPage = result.items;
                if (this.elemTableRace) this.elemTableRace.innerHTML = '';

                for (let i = 0; i < this.carsInPage.length; i += 1) {
                    const tr = this.drawStr(this.carsInPage[i]);
                    this.elemTableRace?.appendChild(tr[0]);
                    this.elemTableRace?.appendChild(tr[1]);
                }
                if (this.elemCurPage !== null) this.elemCurPage.innerHTML = String(this.nPage);
            }
        });
    }

    drawStr(car: ICar) {
        const race = this;
        const n = String(car.id);
        const tr1 = document.createElement('tr');
        const th1Left = createByTag({ tag: 'th', class: 'left_td', parent: tr1 });
        const divCommand = createByTag({ tag: 'div', class: 'command', id: 'com' + n, parent: th1Left });
        const but1 = createByTag({ tag: 'button', id: 'remove' + n, inner: 'Delete', parent: divCommand });
        but1.addEventListener('click', () => {
            this.base.delCar(n).then(() => {
                this.win.delWin(+n);
                this.drawTableCar();
            });
        });
        const but2 = createByTag({ tag: 'button', inner: 'Select', id: 'select' + n, parent: divCommand });
        but2.addEventListener('click', () => {
            const update = <HTMLInputElement>document.getElementById('item_update');
            update.value = car.name;
            const color = <HTMLInputElement>document.getElementById('color_update');
            color.value = car.color;
            const id = <HTMLInputElement>document.getElementById('id_update');
            id.value = n;
        });
        const td1Center = createByTag({ tag: 'td', class: 'center_td', parent: tr1 });
        createByTag({ tag: 'div', class: 'car_name', id: 'car_name', inner: car.name, parent: td1Center });
        createByTag({ tag: 'td', class: 'right_td', parent: tr1 });

        const tr2 = createByTag({ tag: 'tr', class: 'dotted' });
        const th2 = createByTag({ tag: 'th', parent: tr2 });
        const div3Command = createByTag({ tag: 'div', parent: th2 });
        const butStart = <HTMLButtonElement>createByTag({ tag: 'button', inner: 'Start', id: 'forward' + n });
        butStart.addEventListener('click', () => race.driveCar(n));
        div3Command.appendChild(butStart);
        const butBack = <HTMLInputElement>createByTag({ tag: 'button', inner: '&#9668;', id: 'back' + n });
        butBack.disabled = true;
        butBack.addEventListener('click', () => {
            const car = <HTMLElement>document.getElementById('car_img' + n);
            if (race.handle[+n]) clearInterval(race.handle[+n]);
            if (car) car.style.marginLeft = '0px';
            butBack.disabled = true;
            butStart.disabled = false;
        });
        div3Command.appendChild(butBack);
        const td2center = createByTag({ tag: 'td', parent: tr2 });
        const divCar = createByTag({ tag: 'div', class: 'car_img', id: 'car_img' + n, parent: td2center });
        divCar.style.backgroundColor = car.color;
        divCar.innerHTML = '<img src="./images/car.png"></div>';
        createByTag({ tag: 'td', inner: '<img src="./images/flag.png" >', parent: tr2 });
        return [tr1, tr2];
    }

    async driveCar(n: string) {
        const nN = Number(n);
        const car = <HTMLElement>document.getElementById('car_img' + n);
        const butStart = <HTMLButtonElement>document.getElementById('forward' + n);
        const race = this;
        const butBack = <HTMLButtonElement>document.getElementById('back' + n);
        butStart.disabled = true;
        butBack.disabled = false;

        if (car) {
            const distance = car.parentElement ? car.parentElement.clientWidth - car.clientWidth - 20 : 0;
            let curOffset = 0;
            this.base.startCar(n).then((value: ICarGo) => {
                const speed = value.velocity;
                race.handle[nN] = setInterval(function () {
                    if (curOffset < distance) {
                        curOffset += speed / 10;
                        car.style.marginLeft = curOffset + 'px';
                    } else {
                        clearInterval(race.handle[nN]);
                        race.base.stopCar(n);
                        if (race.curWin === -1) {
                            race.curWin = nN;
                            const time = (Date.now() - race.timeStart) / 1000;
                            race.showWin(nN, time);
                            race.win.newWin(nN, time);
                        }
                    }
                }, 16);
                this.base.driveModeCar(n).then((value: boolean) => {
                    if (!value) {
                        clearInterval(race.handle[nN]);
                        this.base.stopCar(n);
                    }
                });
            });
        }
    }

    async showWin(nN: number, time: number) {
        const divWin = document.getElementById('win_wrap');
        if (divWin) divWin.style.display = 'block';
        const car_name = document.getElementById('car_name' + nN);
        const win_name = document.getElementById('win_name');
        if (car_name && win_name) win_name.innerHTML = car_name.innerHTML;
        const win_time = document.getElementById('win_time');
        if (win_time) win_time.innerHTML = String(time);
        setTimeout(() => {
            if (divWin) divWin.style.display = 'none';
        }, 3000);
    }

    async changePage(to: boolean) {
        const nPages = Math.ceil(this.nCars / nCarsInPage);
        if (to && this.nPage < nPages) this.nPage += 1;
        if (!to && this.nPage > 1) this.nPage -= 1;
        this.drawTableCar();
    }

    add100Car() {
        const p = [];
        for (let i = 0; i < 100; i += 1) {
            const randModel =
                vendors[Math.floor(Math.random() * vendors.length)] +
                ' ' +
                models[Math.floor(Math.random() * models.length)];
            const randColor = '#' + Math.random().toString(16).substr(-6);
            p.push(this.base.addCar({ name: randModel, color: randColor }));
        }
        Promise.all(p).then(() => {
            this.drawTableCar();
        });
    }
}
export default Race;
