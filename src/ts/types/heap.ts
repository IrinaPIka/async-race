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
    headerRace: string;
    tableRace: string;
    winRace: string;
    headerWin: string;
}

export const nCarsInPage = 7;
export const nWinInPage = 10;
export const vendors = ['Audi', 'Tesla', 'Mersedes', 'Chery', 'Volga', 'Toyota', 'BMW', 'Ford'];
export const models = ['Fasty', 'Beauty', 'Nice', 'Black', 'Speedy', 'Mini', 'Camry', 'Wing', 'Sun'];
export const templ: Templ = {
    headerRace: `
        <div class="title-wrap">
            <div class="title_gar">Garage</div> 
            <div class="title_win">Winners</div>
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
    tableRace: `
    <table class="race_table"><tbody  id="race_table"></tbody></table>`,
    winRace: `
    <div class="win_wrap" id="win_wrap">
        <div class="win_text">
            First came 
                <span class="win_name" id="win_name"></span> <br/>
            with time 
                <span class="win_time" id="win_time"></span>  
        </div>
    </div>
`,
    headerWin: `
    <div class="title-wrap">
        <div class="title_gar">Garage</div> 
        <div class="title_win">Winners</div>
    </div>
    <h2>Winners (<span id="num_win">0</span>)</h2>
    <h3><span id="prev_page_w" class="page_arrow">&larr;</span> Page №<span id="n_page">1</span> <span id="next_page_w"  class="page_arrow">&rarr;</span></h3>
  
    `,
};
