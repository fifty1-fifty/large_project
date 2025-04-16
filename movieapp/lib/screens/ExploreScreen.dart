import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/movie.dart';
import '../services/api_service.dart';
import '../services/secure_storage.dart';
import '../widgets/movie_card.dart';
import 'package:movieapp/routes/routes.dart';
import 'package:movieapp/global_data.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key, required this.token});
  final String token;

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  List<Movie> _movies = [];
  int _currentPage = 1;
  bool _isLoading = false;
  String? _errorMessage;
  TextEditingController _searchController = TextEditingController();
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _verifyTokenAndLoadMovies();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      _searchMovies(_searchController.text);
    });
  }

  Future<void> _verifyTokenAndLoadMovies() async {
    final storedToken = await SecureStorage.getToken();
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

      if (e.toString().contains('Unauthorized')) {
        _forceLogout();
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _searchMovies(String query) async {
    if (query.isEmpty) {
      _fetchTrendingMovies();
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await ApiService.searchMovie(
        query: query,
        token: widget.token,
      );
      setState(() => _movies = response);
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _forceLogout() async {
    await SecureStorage.deleteToken();
    if (mounted) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        Routes.LOGINSCREEN,
        (route) => false,
      );
    }
  }

  void _navigateToDetail(Movie movie) {
    Navigator.pushNamed(context, Routes.movieDetail, arguments: movie);
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
          // New profile button added here:
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.pushNamed(
                context,
                '/profile',
                arguments: GlobalData.userId,
              );
              print(
                "DEBUG: userId = ${GlobalData.userId} before navigating to /profile",
              );
            },
          ),
          IconButton(icon: const Icon(Icons.logout), onPressed: _forceLogout),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 0.0),
            child: Container(
              height: 25,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Row(
                  children: [
                    Text(
                      'Discover',
                      style: TextStyle(color: Colors.grey[600], fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.symmetric(
              horizontal: MediaQuery.of(context).size.width * 0.2,
              vertical: 20,
            ),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search movies...',
                hintStyle: TextStyle(color: Colors.grey[600]),
                prefixIcon: const Icon(Icons.search, color: Colors.white),
                filled: true,
                fillColor: Colors.grey[900],
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          if (_errorMessage != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.redAccent),
              ),
            ),
          Expanded(
            child:
                _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : Center(
                      child: Container(
                        constraints: const BoxConstraints(maxWidth: 210.0 * 6),
                        child: GridView.builder(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 30,
                            vertical: 30,
                          ),
                          gridDelegate:
                              SliverGridDelegateWithMaxCrossAxisExtent(
                                maxCrossAxisExtent: 150,
                                crossAxisSpacing: 20,
                                mainAxisSpacing: 20,
                                childAspectRatio: 131.0 / 196.50,
                              ),
                          itemCount: _movies.length,
                          itemBuilder:
                              (context, index) => MovieCard(
                                imageUrl: _movies[index].posterUrl,
                                title:
                                    " ", // You can update the title if needed.
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
}
