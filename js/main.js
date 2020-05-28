const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const poster = document.querySelector('.poster');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = modal.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const preloader  = document.querySelector('.preloader');
const dropdown = document.querySelectorAll('.dropdown')
const modalContent = document.querySelector('.modal__content');
const tvShowsHead = document.querySelector('.tv-shows__head');
const pagination = document.querySelector('.pagination');

const loading = document.createElement('div');
loading.className = 'loading';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
const apiKey = '6365032ae17ecff7a808bf60eccd8114';
const SERVER = 'https://api.themoviedb.org/3';
const apiReq = 'https://api.themoviedb.org/3/movie/550?api_key=6365032ae17ecff7a808bf60eccd8114'



const closeDropDown = () => {
    dropdown.forEach(item =>{
        item.classList.remove('active');
    })
} 
    


// открытие закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropDown();
})


// закрытие Меню
document.body.addEventListener('click', (event) => {
    // console.log(!event.target.closest('.left-menu'));
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropDown();
    }
})


// РАскрытие подменю
leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    // console.log(event.target);
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    

    if (target.closest("#top-rated")) {
        console.log('top-rated'); 
        tvShows.append(loading);
        dbservice.getTopRated().then((response) => renderCard(response, target));
    }

    if (target.closest("#popular")) {
        console.log('popular'); 
        tvShows.append(loading);
        dbservice.getPopular().then((response) => renderCard(response, target));
    }

    if (target.closest("#week")) {
        console.log('week'); 
        tvShows.append(loading); 
        dbservice.getWeek().then((response) => renderCard(response, target));
    }

    if (target.closest("#today")) {
        console.log('today'); 
        tvShows.append(loading);
        dbservice.getToday().then((response) => renderCard(response, target));
    }
    if (target.closest('#search')) {
        tvShowList.textContent = '';
    }
})

//Смена карточки

const changeImage = event => {
    
    const card = event.target.closest('.tv-shows__item');

    if (card) {
    const img = card.querySelector('.tv-card__img');
    
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];

        }
    }
}

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);



//ОТкрытие модального окна
tvShowList.addEventListener('click', event =>{
    event.preventDefault();
    
    // tvShows.append(loading);
    
    const target = event.target;
    // console.log(target);
    const card = target.closest('.tv-card');

    if (card) {
        preloader.style.display = 'block'
         //Заполняем описание
        dbservice.getTvShow(card.id)
            .then(res => {
                // console.log(res);
                // console.log(tvCardImg);
                modalContent.style.paddingLeft = '';
                if (res.poster_path) {
                tvCardImg.src =  IMG_URL + res.poster_path;                
                tvCardImg.alt = res.name;
                poster.classList.remove('hide')
                } else {poster.classList.add('hide');
                modalContent.style.paddingLeft = '25px';
            }

                modalTitle.textContent = res.name;
                genresList.textContent = '';
                for (const item of res.genres) {
                    genresList.innerHTML +=  `<li> ${item.name}</li>`;
                }
                rating.textContent = res.vote_average;
                description.textContent = res.overview;
                modalLink.href = res.homepage;

                
            })
            .then(() => {
                // loading.remove();
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');

            })
            .finally(() => {
                preloader.style.display = 'none';
            })




        
    }
})

//Закрытие

modal.addEventListener('click', event => {

    // console.log (event.target.classList.contains('cross'));
    // console.log(event.target);

    if (event.target.closest('.cross') || 
        event.target.classList.contains('modal')) {
        
            document.body.style.overflow = '';
        modal.classList.add('hide');
    }
})

// класс для получения данных с сервера
const DBService = class{
    constructor(){
     const temp = '';
    }
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалосьпо лучить данные ${url}`);
        }
    }
    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('Card.json');
    }

    getSearchResult = query => {
        this.temp = `${SERVER}/search/tv?api_key=${apiKey}&language=ru-RU&query=${query}`;
        return this.getData(this.temp);
    }

    getNextPage = page => {
        return this.getData(this.temp + `&page=${page}`);

    }

    getTvShow = id => {
        
        return this.getData(`${SERVER}/tv/${id}?api_key=${apiKey}&language=ru-RU`);
    }

    getTopRated = () => {
        return this.getData(`${SERVER}/tv/top_rated?api_key=${apiKey}&language=ru-RU`);
    }
    
    getPopular= () => {
        return this.getData(`${SERVER}/tv/popular?api_key=${apiKey}&language=ru-RU`);
    }  

    getToday = () => {
        return this.getData(`${SERVER}/tv/airing_today?api_key=${apiKey}&language=ru-RU`);
    }  
    getWeek = () => {
        return this.getData(`${SERVER}/tv/on_the_air?api_key=${apiKey}&language=ru-RU`);
    }  
    
}

const dbservice = new DBService();

// Выводим карточку сериала
const renderCard = (response, target) => {
    // console.log(response);

    tvShowList.textContent = '';



    if (!response.total_results){
       
            const answer = document.createElement('h3');
            answer.textContent = 'Ничего не найдено';
            answer.style.cssText = 'color: red';
            tvShowList.append(answer);
            loading.remove();
            return;
    }
    tvShowsHead.textContent = target ? target.textContent: '';

    response.results.forEach(item => {
        // console.log(item);
        const {
            backdrop_path: backdrop,
            vote_average: vote,
            poster_path:poster, 
            name,
            id
            } =item;

        const posterIMG = poster ?  IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '' ;
        const voteElem =  vote ? `<span class="tv-card__vote ">${vote}</span>` : '';

    
        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.idTV = id;
        card.innerHTML = ` 
        <a href="#" id=${id}
        class="tv-card">
         ${voteElem}
         <img class="tv-card__img"
              src="${posterIMG}"
              data-backdrop="${backdropIMG}"
              alt="${name}">
         <h4 class="tv-card__head">${name}</h4>
        </a>
        `;
        loading.remove();
        tvShowList.append(card);
        // tvShowList.insertAdjacentElement('afterbegin', card);
        // console.log(card);
    });

    pagination.textContent = ''; 
    if (response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
        }
    }

    };

//Pagination
pagination.addEventListener('click', event => {
    event.preventDefault;
    const target = event.target;
    if (target.classList.contains('pages')){
        tvShows.append(loading);
        dbservice.getNextPage(target.textContent).then(renderCard)
    }
})


// Вывод результатов поиска
{
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    // console.log(searchForm);
    const value = searchFormInput.value.trim();
    // searchFormInput.value = '';
    if (value) {
        tvShows.append(loading);  
        dbservice.getSearchResult(value).then(renderCard);
    }

});
}


{
    // tvShows.append(loading);    
// new DBService().getTestData().then(renderCard);
}