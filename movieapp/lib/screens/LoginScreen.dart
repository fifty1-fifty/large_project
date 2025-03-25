import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: Colors.blue, body: MainPage());
  }
}

class MainPage extends StatefulWidget {
  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: ElevatedButton(
        onPressed: () {
          Navigator.pushNamed(context, '/cards');
        },
        style: ElevatedButton.styleFrom(
          backgroundColor:
              Colors.brown[50], // Background color (formerly "primary")
          foregroundColor: Colors.black, // Text color (formerly "onPrimary")
          padding: EdgeInsets.all(2.0),
          splashFactory: InkRipple.splashFactory, // Ripple effect (optional)
        ),
        child: Text('Do Login'),
      ),
    );
  }
}
