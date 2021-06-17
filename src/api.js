const moviesSection = document.querySelector(".movies-grid");

showPopularMovies()

async function getPopularMovies(){
    const movies = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=c05e5a932bbbe9533193ce829a545f1c&language=en-US&page=1")
        .then(response => response.json())
        .then(data => data.results)

    const filteredMovies = Array.from(movies).slice(0,4)

    return filteredMovies
}

async function showPopularMovies(){
    const movies = await getPopularMovies();
    createMovieDiv(movies)

}



function createMovieDiv(movies){
    for(let movie of movies){
        const movieDiv = document.createElement("div");
        movieDiv.innerHTML = `<a href="movie.html"><img src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ljPHd7WiPVKmuXi1hgQUpZQslbC.jpg" alt="Imagem de ${movie.original_title}"></a>`
        movieDiv.classList.add("movie");
        moviesSection.appendChild(movieDiv);
    }
}

