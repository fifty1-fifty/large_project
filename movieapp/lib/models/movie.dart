// lib/models/movie.dart
class Movie {
  final String title;
  final String posterUrl;
  final int id;

  Movie({
    required this.title,
    required this.posterUrl,
    required this.id,
  });

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      title: json['title'],
      posterUrl: 'https://image.tmdb.org/t/p/w500${json['poster_path']}',
      id: json['id'],
    );
  }
}