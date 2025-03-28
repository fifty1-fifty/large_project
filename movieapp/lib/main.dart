import 'package:flutter/material.dart';
import 'package:movieapp/routes/routes.dart';
import 'package:movieapp/screens/LoginScreen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(),
      home: LoginScreen(),
      initialRoute: Routes.login, // Set initial route
      routes: Routes.routes,
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

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       home: Scaffold(
//         appBar: AppBar(
//           titleTextStyle: TextStyle(
//             package: "Movie App",
//           color: Colors.grey
            
//           ),
//           backgroundColor: Colors.black,
//           title: Center(child: const Text("Movie App")),
//         ),
//       ),
//     );
//   }
// }

