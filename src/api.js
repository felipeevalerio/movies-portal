const moviesSection = document.querySelector(".movies-grid");

showPopularMovies()


if(location.pathname === "/src/movie.html"){
    const body = document.querySelector("body")
    body.style.overflowY = "hidden";
    renderMovie();
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
                    <img class="star" src="../public/assets/star.svg" alt="Nota de Avaliação"/><p>${vote_average}</p>
                </div>
            </div>
        </div>
    </a>`

    return movieInfo;
}


function renderMovie(){
    const movieArea = document.querySelector(".movie-area");
    const movieFormat = {
        movieTitle: movieArea.querySelector(".info .header h1"),
        movieImage: movieArea.querySelector(".movie-area > img"),
        movieRate: movieArea.querySelector(".info .header .rate p")
    }

    const movie = JSON.parse(sessionStorage.getItem("movie"));
    movieFormat.movieTitle.innerHTML = movie.original_title
    movieFormat.movieRate.innerHTML = movie.vote_average
    movieFormat.movieImage.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    movieFormat.movieImage.alt = `Imagem de ${movie.original_title}`
}