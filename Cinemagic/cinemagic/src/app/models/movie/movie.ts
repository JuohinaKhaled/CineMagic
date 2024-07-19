export class Movie {
  movieID: number;
  movieName: string;
  movieDescription: string;
  duration: number;
  age: number;
  genre: string;
  director: string;
  releaseDate: string;
  overallRating: number;
  numberRatings: number;
  pathPictureLarge: string;
  pathPictureMiddle: string;
  pathPictureSmall: string;
  pathTrailerVideo: string;

  constructor
  (
    movieID: number,
    movieName: string,
    movieDescription: string,
    duration: number,
    age: number,
    genre: string,
    director: string,
    releaseDate: string,
    overallRating: number,
    numberRatings: number,
    pathPictureLarge: string,
    pathPictureMiddle: string,
    pathPictureSmall: string,
    pathTrailerVideo: string
  ) {
    this.movieID = movieID;
    this.movieName = movieName;
    this.movieDescription = movieDescription;
    this.duration = duration;
    this.age = age;
    this.genre = genre;
    this.director = director;
    this.releaseDate = releaseDate;
    this.overallRating = overallRating;
    this.numberRatings = numberRatings;
    this.pathPictureLarge = pathPictureLarge;
    this.pathPictureMiddle = pathPictureMiddle;
    this.pathPictureSmall = pathPictureSmall;
    this.pathTrailerVideo = pathTrailerVideo;
  }

}

