// lib/widgets/movie_card.dart
import 'package:flutter/material.dart';
import '../widgets/bootstrap_card.dart';

class MovieCard extends StatelessWidget {
  final String imageUrl;
  final String title;
  final VoidCallback onTap;

  const MovieCard({
    super.key,
    required this.imageUrl,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 65.5, //Explicit width
        height: 98.25, //Explicit height
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(0),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(0),
          child: Image.network(
            imageUrl,
            fit: BoxFit.cover, //image fills space
            width: 65.5, //Explicit width
            height: 98.25, //Explicit height
            errorBuilder:
                (context, error, stackTrace) =>
                    Container(color: Colors.grey, width: 65.5, height: 98.25),
          ),
        ),
      ),
    );
  }
}
