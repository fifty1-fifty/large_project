import 'package:flutter/material.dart';

class CardsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          child: ElevatedButton(
            child: Text(
              'To Login',
              style: TextStyle(fontSize: 14, color: Colors.black),
            ),
            onPressed: () {
              Navigator.pushNamed(context, '/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.brown[50], // Button color
              foregroundColor: Colors.black, // Text color
              padding: EdgeInsets.all(2.0),
              splashFactory: InkRipple.splashFactory, // Ripple effect
            ),
          ),
        ),
      ),
    );
  }
}
