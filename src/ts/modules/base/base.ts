import { nCarsInPage, ICar } from '../../types/heap';

class Base {
    base: string;
    garage_query: string;
    car_query: string;
    win_query: string;
    constructor() {
        this.base = 'http://127.0.0.1:3000';
        this.garage_query = this.base + '/garage';
        this.car_query = this.base + '/engine';
        this.win_query = this.base + '/winners';
    }

    getCars = async (page: number, limit = nCarsInPage) => {
        const hvost = `?_page=${page}&_limit=${limit}`;
        const response = await fetch(this.garage_query + hvost);
        return {
            items: await response.json(),
            cpunt: response.headers.get('X-Total-Count'),
        };
    };

    addCar = async (param: ICar) => {
        await fetch(this.garage_query, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    updateCar = async (param: ICar) => {
        await fetch(this.garage_query + '/' + param.id, {
            method: 'PUT',
            body: JSON.stringify(param),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    delCar = async (n: string) => {
        const tmp = n.replace('remove', '');
        await fetch(this.garage_query + '/' + tmp, {
            method: 'DELETE',
        });
    };

    startCar = async (n: string) => {
        const response = await fetch(this.car_query + '?status=started&id=' + n, {
            method: 'PATCH',
        });
        return await response.json();
    };
    driveModeCar = async (n: string) => {
        const response = await fetch(this.car_query + '?status=drive&id=' + n, {
            method: 'PATCH',
        }).catch();
        if (response.status === 200) return true;
        return false;
    };
    stopCar = async (n: string) => {
        await fetch(this.car_query + '?status=stopped&id=' + n, {
            method: 'PATCH',
        });
    };
}
export default Base;
