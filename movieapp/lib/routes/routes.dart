import 'package:flutter/material.dart';
import 'package:movieapp/screens/LoginScreen.dart';
import 'package:movieapp/screens/CardsScreen.dart';
class Routes {
static const String LOGINSCREEN = '/login';
static const String CARDSSCREEN = '/cards';
// routes of pages in the app
static Map<String, Widget Function(BuildContext)> get getroutes => {
'/': (context) => LoginScreen(),
LOGINSCREEN: (context) => LoginScreen(),
CARDSSCREEN: (context) => CardsScreen(),
};

}
