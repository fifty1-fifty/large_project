import 'package:flutter/material.dart';
import '../models/movie.dart';


class MovieDetailScreen extends StatelessWidget {
  final Movie movie;

  const MovieDetailScreen({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Use a dark background to match a movie/theater theme
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          movie.title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Movie poster with a gradient overlay
            Stack(
              children: [
                Image.network(
                  movie.posterUrl,
                  height: 300,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 300,
                      color: Colors.grey.shade900,
                      child: const Center(
                        child: Icon(Icons.broken_image, color: Colors.white),
                      ),
                    );
                  },
                ),
                Container(
                  height: 300,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.8),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
                // Title overlay on the image
                Positioned(
                  bottom: 16,
                  left: 16,
                  right: 16,
                  child: Text(
                    movie.title,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      shadows: [
                        Shadow(
                          blurRadius: 8,
                          color: Colors.black,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Details section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Example detail: Movie ID (replace or add other details as needed)
                  Text(
                    'Movie ID: ${movie.id}',
                    style: const TextStyle(color: Colors.white70, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  // Placeholder for overview or description
                  const Text(
                    'Overview',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.',
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                  const SizedBox(height: 16),
                  // Example chips for additional info (release date, runtime, rating)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildDetailChip(
                        icon: Icons.calendar_today,
                        label: '2025',
                      ),
                      _buildDetailChip(icon: Icons.timer, label: '120m'),
                      _buildDetailChip(icon: Icons.star, label: '8.5'),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper widget for info chips
  Widget _buildDetailChip({required IconData icon, required String label}) {
    return Chip(
      backgroundColor: Colors.deepPurple.shade700,
      label: Text(label, style: const TextStyle(color: Colors.white)),
      avatar: Icon(icon, size: 16, color: Colors.white),
    );
  }
}
