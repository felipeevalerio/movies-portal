const moviesSection = document.querySelector(".movies-grid");

if(location.pathname === "/index.html"){
    showPopularMovies()
}

if(location.pathname === "movie.html"){
    const body = document.querySelector("body")
    body.style.overflowY = "hidden";
    renderMovie();
}


if(location.pathname === "search.html"){
    renderSearchPage();
}


async function getPopularMovies(){
    const movies = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=c05e5a932bbbe9533193ce829a545f1c&language=en-US&page=1")
        .then(response => response.json())
        .then(data => data.results)

    const filteredMovies = Array.from(movies).slice(0,4)
    
    return filteredMovies
}

async function showPopularMovies(){
    let movies = await getPopularMovies();
    const moviesInHTML = await createMovieDiv(movies)
    if(moviesInHTML){
        const moviesSec = moviesSection.querySelectorAll(".movie");
        for(let movie of moviesSec){
            const movieLink  = movie.querySelector("a");
            movieLink.addEventListener("click",()=>{
                for(let moviePromise of movies){
                    if(moviePromise.original_title === movieLink.id){
                        sessionStorage.setItem("movie",JSON.stringify(moviePromise));

                    }
                }
            });            
        }
    }
}


async function createMovieDiv(movies){
    movies.map(movie => {
        const movieDiv = document.createElement("div");
        const movieInfo = createMovieInfo(movie);
        movieDiv.innerHTML = movieInfo;
        movieDiv.classList.add("movie");
        moviesSection.appendChild(movieDiv);
        return movie;
    })

    return movies;
} 


function createMovieInfo(movie){
    const {original_title,release_date,vote_average,poster_path} = movie;

    const movieInfo = `<a href="movie.html" id="${original_title}">
        <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="Imagem de ${original_title}">
        <div class="movie-info">
            <h2>${original_title}</h2>
            <div class="date-rate">
                <p>${release_date}</p>
                <div class="rate">
                    <img class="star" src="star.svg" alt="Nota de Avaliação"/><p>${vote_average}</p>
                </div>
            </div>
        </div>
    </a>`

    return movieInfo;
}


async function renderMovie(){
    const genres = await getGenres();

    const movieArea = document.querySelector(".movie-area");
    const movieFormat = {
        movieTitle: movieArea.querySelector(".info .header h1"),
        movieImage: movieArea.querySelector(".movie-area > img"),
        movieRate: movieArea.querySelector(".info .header .rate p"),
        movieDescription: movieArea.querySelector(".description"),
        movieTags: movieArea.querySelector(".footer .tags"),
        movieReleaseDate: movieArea.querySelector(".footer .release-date")
    }


    const movie = JSON.parse(sessionStorage.getItem("movie"));

    const {movieTitle,movieRate,movieImage,movieDescription,movieTags,movieReleaseDate} = movieFormat;
    const {original_title,poster_path,vote_average,overview,genre_ids,release_date} = movie;


    const newGenres = genres.filter(genre => {
        for(genreMovie of genre_ids){
            if(genre.id === genreMovie)
                return genre;
        }
    })

    movieTitle.innerHTML = original_title;
    movieRate.innerHTML = vote_average;
    movieImage.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;
    movieImage.alt = `Imagem de ${original_title}`;
    movieDescription.innerHTML = `<p>${overview}</p>`;
    for(let genre of newGenres){
        movieTags.innerHTML += `<p class="movie-tag">${genre.name}</p>`;
    }
    movieReleaseDate.innerHTML = `<p>${release_date}</p>`;

}

async function getGenres(){
    const genres =  await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=c05e5a932bbbe9533193ce829a545f1c&language=en-US")
        .then(response => response.json())
        .then(data =>data.genres)
    
    return genres;
} 



function search(){
    const searchInput = document.querySelector(".filter input")
    searchInput.addEventListener("change",()=>{
        sessionStorage.setItem("filter",searchInput.value);
    })
}

search()

async function renderSearchPage(){
    const movies = await getPopularMovies();
    const valueInput = sessionStorage.getItem("filter");
    const filteredMovies = movies.filter(movie => movie.original_title === valueInput)
    showMovies(filteredMovies)

    const titleMovie = document.querySelector(".title-movie-search")
    titleMovie.innerHTML += valueInput
}


async function showMovies(movies){
    const moviesInHTML = await createMovieDiv(movies)
    if(moviesInHTML){
        const moviesSec = moviesSection.querySelectorAll(".movie");
        for(let movie of moviesSec){
            const movieLink  = movie.querySelector("a");
            movieLink.addEventListener("click",()=>{
                for(let moviePromise of movies){
                    if(moviePromise.original_title === movieLink.id){
                        sessionStorage.setItem("movie",JSON.stringify(moviePromise));
                    }
                }
            });            
        }
    }
}
