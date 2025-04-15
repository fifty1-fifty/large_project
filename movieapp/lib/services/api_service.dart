import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/movie.dart';
import '../services/secure_storage.dart';

class ApiService {
  static const String _baseUrl = 'http://group22cop4331c.xyz:5000/api';

  //Login
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
    String login,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
          'login': " ", 
        }),
      );

      final responseData = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (responseData['error']?.isNotEmpty ?? false) {
          throw Exception(responseData['error']);
        }
        return responseData;
      } else {
        throw Exception(responseData['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  //Register
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

  //Get trending movies
  static Future<List<Movie>> trendingMovie({
    required int page,
    required String token,
  }) async {
    final storedToken = await SecureStorage.getToken();
    final rawToken = storedToken?.replaceFirst('Bearer ', '');
    final response = await http.post(
      Uri.parse('$_baseUrl/trendingMovie'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '$rawToken',
      },
      body: jsonEncode({'page': page}),
    );


    if (response.statusCode == 401) {
      throw Exception('Invalid token - please login again');
    }

    final result = _handleResponse(response);
    return (result['movieData']['results'] as List)
        .map((json) => Movie.fromJson(json))
        .toList();
  }

  //handle tokens for each route
  static Future<Map<String, dynamic>> getProtectedData() async {
    final token = await SecureStorage.getToken();
    final rawToken = token?.replaceFirst('Bearer ', '');
    final response = await http.get(
      Uri.parse('$_baseUrl/protected-route'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '$rawToken',
      },
    );

    return _handleResponse(response);
  }

  //handle API responses
  static dynamic _handleResponse(http.Response response) {
    switch (response.statusCode) {
      case 200:
        return jsonDecode(response.body);
      case 401:
        throw Exception('Unauthorized: ${response.body} ');
      default:
        throw Exception('Error: ${response.body}');
    }
  }
}
