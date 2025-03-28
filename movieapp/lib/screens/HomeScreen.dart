// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/movie.dart';
import '../services/api_service.dart';
import '../widgets/movie_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Movie> _movies = [];
  int _currentPage = 1;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchTrendingMovies();
  }

  Future<void> _fetchTrendingMovies() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiService.trendingMovie(page: _currentPage);
      setState(() {
        _movies = response;
      });
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
Widget build(BuildContext context) {
  return Scaffold(
    backgroundColor: const Color.fromARGB(225, 0, 0, 0),
    appBar: AppBar(
      backgroundColor: Colors.black,
      title: Text(
        'FLICKS',
        style: GoogleFonts.syncopate(
          fontWeight: FontWeight.w400,
          fontSize: 24,
        ),
      ),
    ),
    body: Column(
      children: [
        // Search bar positioned 55px below app bar
        Padding(
          padding: const EdgeInsets.only(top: 55.0, left: 580, right: 580),
          child: Container(
            height: 25, // Height of search bar
            decoration: BoxDecoration(
              color: Colors.black, // Light grey background
              borderRadius: BorderRadius.circular(5), // Rounded corners
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 0),
              child: Row(
                children: [
                  const SizedBox(width: 10),
                  Text(
                    'Discover',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        // Movie grid
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : Center(
                  child: Container(
                    constraints: BoxConstraints(
                      maxWidth: 210.0 * 6, // Total width for 6 columns
                    ),
                    child: GridView.builder(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 30,
                        vertical: 30, // Reduced from 110 since search bar is separate
                      ),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 6,
                        crossAxisSpacing: 30,
                        mainAxisSpacing: 30,
                        childAspectRatio: 131.0 / 196.50,
                      ),
                      itemCount: _movies.length,
                      itemBuilder: (context, index) => MovieCard(
                        imageUrl: _movies[index].posterUrl,
                        title: " ",
                        onTap: () => _navigateToDetail(_movies[index]),
                      ),
                    ),
                  ),
                ),
        ),
      ],
    ),
  );
}

  void _navigateToDetail(Movie movie) {
    Navigator.pushNamed(context, '/movie-detail', arguments: movie);
  }
}
