import 'package:flutter/material.dart';
import 'package:movieapp/screens/LoginScreen.dart';
import 'package:movieapp/screens/RegisterScreen.dart';
import 'package:movieapp/screens/HomeScreen.dart';
import 'package:movieapp/screens/MovieDetailScreen.dart';
import 'package:movieapp/models/movie.dart';




class Routes {
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String movieDetail = '/movie-detail';


  static Map<String, WidgetBuilder> get routes => {
        login: (context) => const LoginScreen(),
        register: (context) => const RegisterScreen(),
        home: (context) => const HomeScreen(),
        movieDetail: (context) {
          final movie = ModalRoute.of(context)!.settings.arguments as Movie;
          return MovieDetailScreen(movie: movie);
  },
      };
}