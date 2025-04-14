import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/movie.dart';
import '../services/api_service.dart';
import '../services/secure_storage.dart';
import '../widgets/movie_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.token});

  final String token;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Movie> _movies = [];
  int _currentPage = 1;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _verifyTokenAndLoadMovies();
  }

  Future<void> _verifyTokenAndLoadMovies() async {
    // Verify token is still valid
    final storedToken = await SecureStorage.getToken();
    // When retrieving for API calls
    if (storedToken == null || storedToken != widget.token) {
      _forceLogout();
      return;
    }

    _fetchTrendingMovies();
  }

  Future<void> _fetchTrendingMovies() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await ApiService.trendingMovie(
        page: _currentPage,
        token: widget.token,
      );
      setState(() => _movies = response);
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });

      // If unauthorized, force logout
      if (e.toString().contains('Unauthorized')) {
        _forceLogout();
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _forceLogout() async {
    await SecureStorage.deleteToken();
    if (mounted) {
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
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
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _forceLogout),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 55.0, left: 580, right: 580),
            child: Container(
              height: 25,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 0),
                child: Row(
                  children: [
                    const SizedBox(width: 10),
                    Text(
                      'Discover',
                      style: TextStyle(color: Colors.grey[600], fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),

          if (_errorMessage != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            ),

          Expanded(
            child:
                _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : Center(
                      child: Container(
                        constraints: BoxConstraints(maxWidth: 210.0 * 6),
                        child: GridView.builder(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 30,
                            vertical: 30,
                          ),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 6,
                                crossAxisSpacing: 30,
                                mainAxisSpacing: 30,
                                childAspectRatio: 131.0 / 196.50,
                              ),
                          itemCount: _movies.length,
                          itemBuilder:
                              (context, index) => MovieCard(
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
    Navigator.pushNamed(
      context,
      '/movie-detail',
      arguments: {'movie': movie, 'token': widget.token},
    );
  }
}
