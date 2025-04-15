import 'package:flutter/material.dart';
import 'package:movieapp/screens/LoginScreen.dart';
import 'package:movieapp/screens/RegisterScreen.dart';
import 'package:movieapp/screens/ExploreScreen.dart';
import 'package:movieapp/screens/MovieDetailScreen.dart';
import 'package:movieapp/models/movie.dart';

class Routes {
  static const String LOGINSCREEN = '/login';
  static const String REGISTERSCREEN = '/register';
  static const String EXPLORESCREEN = '/explore';
  static const String movieDetail = '/movie-detail';

  static Route<dynamic>? onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
      case LOGINSCREEN:
        return MaterialPageRoute(builder: (_) => const LoginScreen());

      case REGISTERSCREEN:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());

      case EXPLORESCREEN:
        final token = settings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => ExploreScreen(token: token),
        );

      case movieDetail:
        final movie = settings.arguments as Movie;
        return MaterialPageRoute(
          builder: (_) => MovieDetailScreen(movie: movie),
        );

      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(child: Text('No route defined')),
          ),
        );
    }
  }
}
