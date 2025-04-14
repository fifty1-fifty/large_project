import 'package:flutter/material.dart';
import 'package:movieapp/screens/LoginScreen.dart';
import 'package:movieapp/screens/RegisterScreen.dart';
import 'package:movieapp/screens/HomeScreen.dart';
import 'package:movieapp/screens/MovieDetailScreen.dart';
import 'package:movieapp/models/movie.dart';
import 'package:movieapp/services/secure_storage.dart';

class Routes {
  //ADD SCREEN EXTENSIONS HERE:
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String movieDetail = '/movie-detail';

  static Map<String, WidgetBuilder> get routes => {
    //ADD SCREENS HERE:
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    // Updated route definition
    home:
        (context) => FutureBuilder(
          future: SecureStorage.getToken(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            }

            final token = snapshot.data;
            if (token == null || token.isEmpty) {
              return const LoginScreen(); // Redirect to login if no token
            }

            return HomeScreen(token: token);
          },
        ),
    movieDetail: (context) {
      final movie = ModalRoute.of(context)!.settings.arguments as Movie;
      return MovieDetailScreen(movie: movie);
    },
  };
}
