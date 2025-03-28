import 'package:flutter/material.dart';
import 'package:movieapp/screens/LoginScreen.dart';
import 'package:movieapp/screens/RegisterScreen.dart';
// import 'package:movieapp/screens/HomeScreen.dart'; // Add this if you have a home screen


class Routes {
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';

  static Map<String, WidgetBuilder> get routes => {
        login: (context) => const LoginScreen(),
        register: (context) => const RegisterScreen(),
        // home: (context) => const HomeScreen(),
      };
}