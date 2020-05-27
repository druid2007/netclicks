const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const apiKey = '6365032ae17ecff7a808bf60eccd8114';
const apiReq = 'https://api.themoviedb.org/3/movie/550?api_key=6365032ae17ecff7a808bf60eccd8114'

// открытие закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
})

// закрытие Меню
document.body.addEventListener('click', (event) => {
    // console.log(!event.target.closest('.left-menu'));
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
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
    const target = event.target;
    console.log(target);
    const card = target.closest('.tv-card');

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
})

//Закрытие

modal.addEventListener('click', event => {

    // console.log (event.target.classList.contains('cross'));
    console.log(event.target);

    if (event.target.closest('.cross') || 
        event.target.classList.contains('modal')) {
        
            document.body.style.overflow = '';
        modal.classList.add('hide');
    }
})

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

const DBService = class{
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
}

const renderCard = response => {
    // console.log(response);

    tvShowList.textContent = '';

    response.results.forEach(item => {
        // console.log(item);
        const {
            backdrop_path: backdrop,
            vote_average: vote,
            poster_path:poster, 
            name
            } =item;

        const posterIMG = poster ?  IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop :'img/no-poster.jpg' ;
        // const voteElem = '';

        hide = '';
        if (vote == 0) {hide = 'hide'}

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');

        card.innerHTML = ` 
        <a href="#"
        class="tv-card">
         <span class="tv-card__vote ${hide}">${vote}</span>
         <img class="tv-card__img"
              src="${posterIMG}"
              data-backdrop="${backdropIMG}"
              alt="${name}">
         <h4 class="tv-card__head">${name}</h4>
        </a>
        `;
       
        tvShowList.append(card)
        // tvShowList.insertAdjacentElement('afterbegin', card);
        // console.log(card);
    });

}

new DBService().getTestData().then(renderCard);
