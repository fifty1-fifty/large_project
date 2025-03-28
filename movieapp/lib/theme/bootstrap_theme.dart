// // lib/theme/bootstrap_theme.dart
// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';

// class BootstrapTheme {
//   // Colors (from your --bs-* variables)
//   static const Color primary = Color(0xFF0d6efd);
//   static const Color secondary = Color(0xFF6c757d);
//   static const Color success = Color(0xFF198754);
//   // Add all other colors from your palette...

//   // Typography
//   static TextStyle bodyText(BuildContext context) {
//     return GoogleFonts.getFont(
//       'Segoe UI',
//       fontSize: 16,
//       height: 1.5,
//       color: Colors.black,
//     );
//   }

//   // Card Theme
//   static CardTheme cardTheme = const CardTheme(
//     elevation: 0,
//     margin: EdgeInsets.zero,
//     shape: RoundedRectangleBorder(
//       borderRadius: BorderRadius.vertical(
//         top: Radius.circular(4), // From calc(.25rem - 1px)
//         bottom: Radius.circular(4),
//       ),
//     ),
//   );

//   // Button Theme
//   static ElevatedButtonThemeData elevatedButtonTheme = ElevatedButtonThemeData(
//     style: ElevatedButton.styleFrom(
//       padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
//       textStyle: GoogleFonts.getFont('Segoe UI', fontWeight: FontWeight.w500),
//       shape: RoundedRectangleBorder(
//         borderRadius: BorderRadius.circular(4),
//       ),
//     ),
//   );

//   // Full ThemeData
//   static ThemeData get themeData {
//     return ThemeData(
//       colorScheme: ColorScheme.light(
//         primary: primary,
//         secondary: secondary,
//       ),
//       cardTheme: cardTheme,
//       elevatedButtonTheme: elevatedButtonTheme,
//       textTheme: TextTheme(
//         bodyMedium: bodyText,
//       ),
//     );
//   }
// }

// lib/theme/bootstrap_theme.dart
// lib/theme/bootstrap_theme.dart
import 'package:flutter/material.dart';

class BootstrapTheme {
  // Colors (from your --bs-* variables)
  static const Color primary = Color(0xFF0d6efd);
  static const Color secondary = Color(0xFF6c757d);
  static const Color success = Color(0xFF198754);
  static const Color info = Color(0xFF0dcaf0);
  static const Color warning = Color(0xFFffc107);
  static const Color danger = Color(0xFFdc3545);
  static const Color light = Color(0xFFf8f9fa);
  static const Color dark = Color(0xFF212529);

  // Typography
  static TextStyle bodyText() {
    return const TextStyle(
      fontSize: 16,
      height: 1.5,
      color: Colors.black,
    );
  }

  // Card Theme
  static const CardTheme cardTheme = CardTheme(
    elevation: 0,
    margin: EdgeInsets.zero,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(4)),
    ),
  );

  // Button Theme
  static final ElevatedButtonThemeData elevatedButtonTheme = ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      textStyle: const TextStyle(
        fontFamily: 'Roboto', // Default Flutter font that's similar to Avenir
        fontWeight: FontWeight.w500,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
    ),
  );

  // Full ThemeData
  static ThemeData get themeData {
    return ThemeData(
      colorScheme: ColorScheme.light(
        primary: primary,
        secondary: secondary,
        surface: light,
        background: light,
      ),
      cardTheme: cardTheme,
      elevatedButtonTheme: elevatedButtonTheme,
      textTheme: const TextTheme(
        bodyMedium: TextStyle(
          fontSize: 16,
          height: 1.5,
          color: Colors.black,
        ),
        titleLarge: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          fontFamily: 'Roboto', // Default Flutter font that's similar to Avenir
        ),
      ),
      useMaterial3: false, // For Bootstrap-like appearance
    );
  }
}