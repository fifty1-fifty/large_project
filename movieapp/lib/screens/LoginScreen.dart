import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/secure_storage.dart';
import 'package:movieapp/routes/routes.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  String message = 'Please enter your credentials';

  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await ApiService.login(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      if (result['verified'] != true) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Please verify your email before logging in.';
        });
        return;
      }

      await SecureStorage.saveToken(result['token']);

      if (!mounted) return;
      Navigator.pushNamed(
        context,
        Routes.EXPLORESCREEN,
        arguments: result['token'],
      );
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // top row of movie-themed assets
              Padding(
                padding: const EdgeInsets.only(top: 24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset('assets/images/popcorn.png', height: 50),
                    SizedBox(width: 10),
                    Image.asset('assets/images/clapperboard.png', height: 50),
                  ],
                ),
              ),
              SizedBox(height: 16),

              // welcome text
              Text(
                'Welcome to Flicks',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 32),

              // login form section
              Container(
                width: 250,
                padding: EdgeInsets.all(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    // display messages/errors
                    Text(
                      _errorMessage ?? message,
                      style: TextStyle(
                        fontSize: 14,
                        color:
                            _errorMessage != null ? Colors.red : Colors.white,
                      ),
                    ),
                    SizedBox(height: 16),

                    TextField(
                      controller: _emailController,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: 'Email',
                        hintText: 'Enter your email',
                      ),
                    ),
                    SizedBox(height: 16),

                    // Password Field
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: 'Password',
                        hintText: 'Enter your password',
                      ),
                    ),
                    SizedBox(height: 16),

                    // Login Button
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.brown[50],
                        foregroundColor: Colors.black,
                        padding: EdgeInsets.all(12.0),
                        minimumSize: Size(double.infinity, 40),
                      ),
                      onPressed: _isLoading ? null : _handleLogin,
                      child:
                          _isLoading
                              ? SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.black,
                                ),
                              )
                              : Text('Login', style: TextStyle(fontSize: 14)),
                    ),

                    const SizedBox(height: 16),

                    // Registration Button
                    TextButton(
                      onPressed:
                          _isLoading
                              ? null
                              : () {
                                Navigator.pushNamed(
                                  context,
                                  Routes.REGISTERSCREEN,
                                );
                              },
                      child: const Text(
                        'Create an account',
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
