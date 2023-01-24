import Base from './../base/base';
import Win from './../win/win';
import { templ, vendors, models, nCarsInPage, ICar, ICarGo } from '../../types/heap';

class Race {
    base: Base;
    win: Win;
    nCars = 0;
    nPage = 1;
    raceWrap: HTMLElement;
    page_garage: HTMLElement | null = null;
    elemNumCars: HTMLElement | null = null;
    elemCurPage: HTMLElement | null = null;
    elemNextPage: HTMLElement | null = null;
    elemPrevPage: HTMLElement | null = null;
    elemAddCar: HTMLElement | null = null;
    elemAdd100Car: HTMLElement | null = null;
    elemUpdateCar: HTMLElement | null = null;
    elemTableRace: HTMLElement | null = null;
    elemRemove: Array<HTMLElement | null> = [];
    elemRace: HTMLInputElement | null = null;
    elemReset: HTMLInputElement | null = null;
    carsInPage: Array<ICar> = [];
    handle: Array<NodeJS.Timer> = [];
    curWin = 0;
    timeStart = 0;

    constructor(base: Base, win: Win) {
        this.base = base;
        this.win = win;
        this.raceWrap = document.createElement('div');
        this.raceWrap.id = 'race_wrap';
        this.raceWrap.innerHTML = templ['headerRace'] + templ['tableRace'] + templ['winRace'];
        document.body.appendChild(this.raceWrap);
    }

    show() {
        const race = this;
        this.elemNumCars = document.getElementById('num_cars');
        this.elemCurPage = document.getElementById('n_page');
        this.elemUpdateCar = document.getElementById('update');
        this.elemAddCar = document.getElementById('create');
        this.elemRace = <HTMLInputElement>document.getElementById('race');
        this.elemReset = <HTMLInputElement>document.getElementById('reset');
        if (this.elemAddCar !== null)
            this.elemAddCar.addEventListener('click', function () {
                const text = <HTMLInputElement>document.getElementById('item_create');
                const color = <HTMLInputElement>document.getElementById('color_create');
                race.base.addCar({ name: text?.value, color: color?.value });
                race.getNumCar();
            });
        if (this.elemUpdateCar !== null)
            this.elemUpdateCar.addEventListener('click', function () {
                const textTmp = <HTMLInputElement>document.getElementById('item_update');
                const colorTmp = <HTMLInputElement>document.getElementById('color_update');
                const idTmp = <HTMLInputElement>document.getElementById('id_update');

                if (textTmp && colorTmp && idTmp) {
                    race.base.updateCar({ name: textTmp.value, color: colorTmp.value, id: Number(idTmp.value) });
                    race.getNumCar();
                }
            });
        this.elemAdd100Car = document.getElementById('generate');
        this.elemAdd100Car?.addEventListener('click', function () {
            race.add100Car();
        });
        this.elemNextPage = document.getElementById('next_page');
        this.elemPrevPage = document.getElementById('prev_page');
        this.elemNextPage?.addEventListener('click', function () {
            race.changePage(true);
        });
        this.elemPrevPage?.addEventListener('click', function () {
            race.changePage(false);
        });

        this.elemTableRace = document.getElementById('race_table');
        this.getNumCar();

        // ************   race   ************
        if (this.elemRace !== null)
            this.elemRace.addEventListener('click', function () {
                race.curWin = -1;
                race.timeStart = Date.now();
                const cars = document.getElementsByClassName('car_img');
                for (let i = 0; i < cars.length; i += 1) {
                    const tmp = cars[i].id.replace('car_img', '');
                    race.driveCar(tmp);
                }
                this.disabled = true;
            });
        // ************   reset   ************
        if (this.elemReset !== null)
            this.elemReset.addEventListener('click', function () {
                const cars = document.getElementsByClassName('car_img');
                for (let i = 0; i < cars.length; i += 1) {
                    const nN = Number(cars[i].id.replace('car_img', ''));
                    console.log('reset', nN, race.handle[nN]);
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
        const tmpWin = document.getElementById('title_win1');
        tmpWin?.addEventListener('click', () => {
            const tmpRW = document.getElementById('race_wrap');
            if (tmpRW) tmpRW.style.display = 'none';
            const tmpWW = document.getElementById('win_wrap_page');
            if (tmpWW) tmpWW.style.display = 'block';
        });
    }

    async getNumCar() {
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
        const nN = Number(n);
        const tr1 = document.createElement('tr');
        const th1Left = document.createElement('th');
        th1Left.className = 'left_td';

        const divCommand = document.createElement('div');
        divCommand.className = 'command';
        divCommand.id = 'com' + n;

        const but1 = document.createElement('button');
        but1.innerHTML = 'Delete';
        but1.id = 'remove' + n;
        but1.addEventListener('click', () => {
            this.base.delCar(n).then(() => {
                this.win.delWin(nN);
                this.getNumCar();
            });
        });
        divCommand.appendChild(but1);

        const but2 = document.createElement('button');
        but2.innerHTML = 'Select';
        but2.id = 'select' + n;
        but2.addEventListener('click', () => {
            const update = <HTMLInputElement>document.getElementById('item_update');
            update.value = car.name;
            const color = <HTMLInputElement>document.getElementById('color_update');
            color.value = car.color;
            const id = <HTMLInputElement>document.getElementById('id_update');
            id.value = String(car.id);
        });
        divCommand.appendChild(but2);
        th1Left.appendChild(divCommand);

        const td1Center = document.createElement('td');
        td1Center.className = 'center_td';
        const div2 = document.createElement('div');
        div2.className = 'car_name';
        div2.id = 'car_name' + n;
        div2.innerHTML = car.name;
        td1Center.appendChild(div2);

        const td2Right = document.createElement('td');
        td2Right.className = 'right_td';
        tr1.appendChild(th1Left);
        tr1.appendChild(td1Center);
        tr1.appendChild(td2Right);

        const tr2 = document.createElement('tr');
        tr2.className = 'dotted';
        const th2 = document.createElement('th');
        const div3Command = document.createElement('div');
        const butStart = document.createElement('button');
        butStart.innerHTML = 'Start';
        butStart.id = 'forward' + n;
        butStart.addEventListener('click', () => {
            race.driveCar(n);
        });
        div3Command.appendChild(butStart);

        const butBack = document.createElement('button');
        butBack.innerHTML = '&#9668;';
        butBack.id = 'back' + n;
        butBack.disabled = true;
        butBack.addEventListener('click', () => {
            const car = <HTMLElement>document.getElementById('car_img' + n);
            if (race.handle[nN]) clearInterval(race.handle[nN]);
            if (car) car.style.marginLeft = '0px';
            butBack.disabled = true;
            butStart.disabled = false;
        });
        div3Command.appendChild(butBack);
        th2.appendChild(div3Command);

        const td2center = document.createElement('td');
        const divCar = document.createElement('div');
        divCar.style.backgroundColor = car.color;
        divCar.className = 'car_img';
        divCar.id = 'car_img' + n;
        divCar.innerHTML = '<img src="./images/car.png"></div>';
        td2center.appendChild(divCar);

        const td2right = document.createElement('td');
        td2right.innerHTML = '<img src="./images/flag.png" >';
        tr2.appendChild(th2);
        tr2.appendChild(td2center);
        tr2.appendChild(td2right);
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
                            const time = Date.now() - race.timeStart;
                            race.showWin(nN, time);
                            console.log('race', nN, time);
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
        if (win_time) win_time.innerHTML = String(time / 1000);
        setTimeout(() => {
            if (divWin) divWin.style.display = 'none';
        }, 3000);
    }

    async changePage(to: boolean) {
        const nPages = Math.ceil(this.nCars / nCarsInPage);
        if (to && this.nPage < nPages) this.nPage += 1;
        if (!to && this.nPage > 1) this.nPage -= 1;
        this.getNumCar();
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
            this.getNumCar();
        });
    }
}
export default Race;
