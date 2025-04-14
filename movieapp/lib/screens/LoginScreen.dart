import 'package:flutter/material.dart';
import 'package:movieapp/utils/getAPI.dart';
import 'dart:convert';

class GlobalData {
  static int userId = -1; // Initialize with default value
  static String firstName = ''; // Initialize with empty string
  static String lastName = ''; // Initialize with empty string
  static String loginName = ''; // Initialize with empty string
  static String password = ''; // Initialize with empty string
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: Colors.black, body: MainPage());
  }
}

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  String message = "Please log in :)";
  String newMessageText = '';
  String loginName = '';
  String password = '';

  void changeText() {
    setState(() {
      message = newMessageText;
    });
  }

  Future<void> _handleLogin() async {
    setState(() {
      newMessageText = "";
      message = newMessageText;
    });

    if (loginName.isEmpty || password.isEmpty) {
      setState(() {
        newMessageText = "Please enter both login and password";
        message = newMessageText;
      });
      return;
    }

    try {
      final payload = jsonEncode({
        'login': loginName.trim(),
        'password': password.trim(),
      });

      final url = ' group22cop4331c.xyz/api/login';
      final response = await CardsData.getJson(url, payload);
      final jsonObject = json.decode(response);

      final userId = jsonObject["id"] as int;

      if (userId <= 0) {
        setState(() {
          newMessageText = "Incorrect Login/Password";
          message = newMessageText;
        });
      } else {
        GlobalData.userId = userId;
        GlobalData.firstName = jsonObject["firstName"] as String;
        GlobalData.lastName = jsonObject["lastName"] as String;
        GlobalData.loginName = loginName;
        GlobalData.password = password;
        Navigator.pushNamed(context, '/cards');
      }
    } catch (e) {
      setState(() {
        newMessageText = "Login failed: ${e.toString()}";
        message = newMessageText;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Column(
          children: [
            // 🍿 Top row of movie-themed stickers
            Padding(
              padding: const EdgeInsets.only(top: 24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('assets/images/popcorn.png', height: 50),
                  SizedBox(width: 10),
                  Image.asset('assets/images/clapperboard.png', height: 50),
                ],
              ),
            ),
            SizedBox(height: 16),

            // 🎬 App Title
            Text(
              'Welcome to Flicks',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 32),

            // 🧾 Login form section
            Container(
              width: 250,
              padding: EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  // Message display
                  Text(
                    message,
                    style: TextStyle(fontSize: 14, color: Colors.white),
                  ),
                  SizedBox(height: 16),

                  // Login Name Field
                  TextField(
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      labelText: 'Login Name',
                      hintText: 'Enter Your Login Name',
                    ),
                    onChanged: (text) {
                      setState(() {
                        loginName = text;
                      });
                    },
                  ),
                  SizedBox(height: 16),

                  // Password Field
                  TextField(
                    obscureText: true,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      labelText: 'Password',
                      hintText: 'Enter Your Password',
                    ),
                    onChanged: (text) {
                      setState(() {
                        password = text;
                      });
                    },
                  ),
                  SizedBox(height: 16),

                  // Login Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.brown[50],
                      foregroundColor: Colors.black,
                      padding: EdgeInsets.all(12.0),
                      minimumSize: Size(double.infinity, 40),
                    ),
                    onPressed: _handleLogin,
                    child: Text('Do Login', style: TextStyle(fontSize: 14)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
