// // lib/widgets/movie_card.dart
// import 'package:flutter/material.dart';
// import '../models/movie.dart';

// class MovieCard extends StatelessWidget {
//   final Movie movie;

//   const MovieCard({super.key, required this.movie});

//   @override
//   Widget build(BuildContext context) {
//     return Card(
//       elevation: 4,
//       shape: RoundedRectangleBorder(
//         borderRadius: BorderRadius.circular(8),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.stretch,
//         children: [
//           Expanded(
//             child: ClipRRect(
//               borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
//               child: Image.network(
//                 movie.posterUrl,
//                 fit: BoxFit.cover,
//                 errorBuilder: (ctx, error, stack) => const Icon(Icons.error),
//               ),
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.all(8),
//             child: Text(
//               movie.title,
//               style: Theme.of(context).textTheme.titleMedium,
//               maxLines: 1,
//               overflow: TextOverflow.ellipsis,
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

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

  // Inside your MovieCard widget
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 65.5, // Explicit width
        height: 98.25, // Explicit height
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(0), // Or your desired radius
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(0), // Match container
          child: Image.network(
            imageUrl,
            fit: BoxFit.cover, // Ensure image fills space
            width: 65.5, // Explicit width
            height: 98.25, // Explicit height
            errorBuilder:
                (context, error, stackTrace) =>
                    Container(color: Colors.grey, width: 65.5, height: 98.25),
          ),
        ),
      ),
    );
  }
}
