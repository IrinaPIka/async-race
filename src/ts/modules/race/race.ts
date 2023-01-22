import Base from './../base/base';
import { templ, vendors, models, nCarsInPage, ICar, ICarGo } from '../../types/heap';

class Race {
    base: Base;
    nCars: number;
    nPage: number;
    bodyWrap: HTMLElement;
    elemNumCars: HTMLElement | null;
    elemCurPage: HTMLElement | null;
    elemNextPage: HTMLElement | null;
    elemPrevPage: HTMLElement | null;
    elemAddCar: HTMLElement | null;
    elemAdd100Car: HTMLElement | null;
    elemUpdateCar: HTMLElement | null;
    elemTableRace: HTMLElement | null;
    elemRemove: Array<HTMLElement | null>;
    carsInPage: Array<ICar>;

    constructor(base: Base) {
        this.base = base;

        this.bodyWrap = document.createElement('div');
        document.body.appendChild(this.bodyWrap);

        this.nPage = 1;
        this.nCars = 0;
        this.elemAddCar = null;
        this.elemAdd100Car = null;
        this.elemNumCars = null;
        this.elemCurPage = null;
        this.elemNextPage = null;
        this.elemPrevPage = null;
        this.elemTableRace = null;
        this.elemUpdateCar = null;
        this.carsInPage = [];
        this.elemRemove = [];
    }

    show() {
        const race = this;
        this.bodyWrap.innerHTML = templ['header'] + templ['table'];
        this.elemNumCars = document.getElementById('num_cars');
        this.elemCurPage = document.getElementById('n_page');
        this.elemUpdateCar = document.getElementById('update');
        this.elemAddCar = document.getElementById('create');
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
                    console.log('updae', textTmp.value, colorTmp.value, idTmp.value);
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
            this.base.delCar(n);
            this.getNumCar();
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
            const car = <HTMLElement>document.getElementById('car_img' + n);
            butStart.disabled = true;
            if (car) {
                const distance = car.parentElement ? car.parentElement.clientWidth - car.clientWidth - 20 : 0;
                let curOffset = 0;
                this.base.startCar(n).then((value: ICarGo) => {
                    const speed = value.velocity;
                    const back = <HTMLInputElement>document.getElementById('back' + n);
                    const handle = setInterval(function () {
                        if (curOffset < distance) {
                            curOffset += speed / 10;
                            car.style.marginLeft = curOffset + 'px';
                        } else {
                            clearInterval(handle);
                            race.base.stopCar(n);
                            if (back) back.disabled = false;
                        }
                    }, 16);
                    this.base.driveModeCar(n).then((value: boolean) => {
                        if (!value) {
                            clearInterval(handle);
                            this.base.stopCar(n);
                            if (back) back.disabled = false;
                        }
                    });
                });
            }
        });
        div3Command.appendChild(butStart);

        const butBack = document.createElement('button');
        butBack.innerHTML = '&#9668;';
        butBack.id = 'back' + n;
        butBack.disabled = true;
        butBack.addEventListener('click', () => {
            const car = <HTMLElement>document.getElementById('car_img' + n);
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
