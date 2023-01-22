export interface ICar {
    name: string;
    color: string;
    id?: number;
}
export interface ICarGo {
    velocity: number;
    distance: number;
}

interface Templ {
    header: string;
    table: string;
    tr: string;
}

export const nCarsInPage = 7;
export const nWinInPage = 10;
export const vendors = ['Audi', 'Tesla', 'Mersedes', 'Chery', 'Volga', 'Toyota', 'BMW', 'Ford'];
export const models = ['Fasty', 'Beauty', 'Nice', 'Black', 'Speedy', 'Mini', 'Camry', 'Wing', 'Sun'];
export const templ: Templ = {
    header: `
        <div class="title-wrap">
            <div class="title">Garage</div> 
            <div class="title">Winners</div>
        </div>
        <div class="command">
            <input type="text" id="item_create">
            <input type="color" id="color_create" value="#f6b73c">
            <button id="create">Create</button>
        </div>
        <div class="command">
            <input type="text" id="item_update">
            <input type="color" id="color_update">
            <button id="update">Update</button>
            <input type="hidden" id="id_update">
        </div>
        <div class="command">
            <button id="race">Race</button>
            <button id="reset">Reset</button>
            <button id="generate">Generate cars</button>
        </div>
        <h2>Garage (<span id="num_cars">0</span>)</h2>
        <h3><span id="prev_page" class="page_arrow">&larr;</span> Page №<span id="n_page">1</span> <span id="next_page"  class="page_arrow">&rarr;</span></h3>
        `,
    table: `
    <table class="race_table"><tbody  id="race_table"></tbody></table>`,
    tr: `
    <tr>
        <th class="left_td">
            <div class="command" id="com##">

            </div>
        </th>
        <td class="center_td"><div class="car_name" id="car_name##"></div></td>  
        <td class="right_td"></td>  
    </tr>
    <tr class="dotted">
        <td>
            <div class="command">
                <button id="forward##">Start</button>
                <button id="back##">&#9668;</button>
            </div>
        </td>
        <td>
            <div class="car_img" id="car_img##"><img src="./images/car.png"></div>
        </td>
        <td> <img src="./images/flag.png"> </td>
</tr>`,
};
