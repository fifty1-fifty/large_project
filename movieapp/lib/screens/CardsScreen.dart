import 'package:flutter/material.dart';

class CardsScreen extends StatefulWidget {
  const CardsScreen({super.key});

  @override
  _CardsScreenState createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: Colors.red, body: MainPage());
  }
}

class MainPage extends StatefulWidget {
  const MainPage({super.key});

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
    return Center(
      child: SizedBox(
        width: 400,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            // Search Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                SizedBox(
                  width: 200,
                  child: TextField(
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      labelText: 'Search',
                      hintText: 'Search for a Card',
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.brown[50],
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.all(2.0),
                    splashFactory: InkRipple.splashFactory,
                  ),
                  onPressed: () {
                    // Add search functionality
                  },
                  child: const Text('Search', style: TextStyle(fontSize: 14)),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Add Card Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                SizedBox(
                  width: 200,
                  child: TextField(
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      labelText: 'Add',
                      hintText: 'Add a Card',
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.brown[50],
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.all(2.0),
                    splashFactory: InkRipple.splashFactory,
                  ),
                  onPressed: () {
                    // Add card functionality
                  },
                  child: const Text('Add', style: TextStyle(fontSize: 14)),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Logout Button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.brown[50],
                foregroundColor: Colors.black,
                padding: const EdgeInsets.all(2.0),
                splashFactory: InkRipple.splashFactory,
              ),
              onPressed: () {
                Navigator.pushNamed(context, '/login');
              },
              child: const Text('Logout', style: TextStyle(fontSize: 14)),
            ),
          ],
        ),
      ),
    );
  }
}
