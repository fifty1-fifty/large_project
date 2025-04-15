import 'package:flutter/material.dart';
import 'package:movieapp/routes/routes.dart';

void main() {
  runApp(const MyApp());}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movie App',
       debugShowCheckedModeBanner: false,
       theme: ThemeData(
         primarySwatch: Colors.deepPurple,
         scaffoldBackgroundColor: Colors.white,
         appBarTheme: const AppBarTheme(
           backgroundColor: Colors.deepPurple,
           centerTitle: true,
         ),
         inputDecorationTheme: const InputDecorationTheme(
           border: OutlineInputBorder(),
         ),
       ),
       initialRoute: '/login',
      routes: Routes.getroutes(),
      // Optional: Add error handling
      onUnknownRoute:
          (settings) => MaterialPageRoute(
            builder:
                (context) =>
                    Scaffold(body: Center(child: Text('Route not found'))),
          ),
    );
  }
}