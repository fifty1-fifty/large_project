import 'package:movieapp/routes/routes.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
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

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(),
      routes: Routes.getroutes,
    );
  }
}
