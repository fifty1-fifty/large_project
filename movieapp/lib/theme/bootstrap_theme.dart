// lib/theme/bootstrap_theme.dart
import 'package:flutter/material.dart';

class BootstrapTheme {
  //colors from the --bs-* variables from the web app
  static const Color primary = Color(0xFF0d6efd);
  static const Color secondary = Color(0xFF6c757d);
  static const Color success = Color(0xFF198754);
  static const Color info = Color(0xFF0dcaf0);
  static const Color warning = Color(0xFFffc107);
  static const Color danger = Color(0xFFdc3545);
  static const Color light = Color(0xFFf8f9fa);
  static const Color dark = Color(0xFF212529);

  //typography
  static TextStyle bodyText() {
    return const TextStyle(
      fontSize: 16,
      height: 1.5,
      color: Colors.black,
    );
  }

  //card looks
  static const CardTheme cardTheme = CardTheme(
    elevation: 0,
    margin: EdgeInsets.zero,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(4)),
    ),
  );

  //button looks
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

  //integrate all themes together
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
          fontFamily: 'Roboto',
        ),
      ),
      useMaterial3: false,
    );
  }
}