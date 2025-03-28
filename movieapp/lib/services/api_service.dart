import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/movie.dart';

class ApiService {
  static const String _baseUrl = 'http://group22cop4331c.xyz:5000/api'; 

  // Login
  static Future<Map<String, dynamic>> login(
    String email, 
    String password,
  ) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'login': '', // Required by your backend but seems unused
      }),
    );
    return _handleResponse(response);
  }

  // Register
  static Future<Map<String, dynamic>> register(
    String email,
    String password,
    String firstName,
    String lastName,
    String username,
  ) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'regemail': email,
        'regpassword': password,
        'first': firstName,
        'last': lastName,
        'reglogin': username,
      }),
    );
    return _handleResponse(response);
  }

  static Future<List<Movie>> trendingMovie({required int page}) async {
  final response = await http.post(
    Uri.parse('$_baseUrl/trendingMovie'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'page': page}),
  );
  
  final data = jsonDecode(response.body);
  return (data['movieData']['results'] as List)
      .map((json) => Movie.fromJson(json))
      .toList();
}

  // Handle API responses
  static dynamic _handleResponse(http.Response response) {
    switch (response.statusCode) {
      case 200:
        return jsonDecode(response.body);
      case 401:
        throw Exception('Unauthorized');
      default:
        throw Exception('Error: ${response.statusCode}');
    }
  }
}