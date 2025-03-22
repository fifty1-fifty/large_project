import 'package:movieapp/routes/routes.dart';
import 'package:flutter/material.dart';


class MyApp extends StatelessWidget {
// This widget is the root of your application.
@override
Widget build(BuildContext context) {
return MaterialApp(
title: '',
debugShowCheckedModeBanner: false,
theme: ThemeData(),
routes: Routes.getroutes,
);
}
}

@override
Widget build(BuildContext context) {
return Container(
child:
RaisedButton(
child: Text('Do Login',style: TextStyle(fontSize: 14 ,color:Colors.black)),
onPressed: ()
{
Navigator.pushNamed(context, '/cards');
},
color:Colors.brown[50],
textColor: Colors.black,
padding: EdgeInsets.all(2.0),
splashColor: Colors.grey[100]
)
);
}
And
@override
Widget build(BuildContext context) {
return Container(
child:
RaisedButton(
child: Text('To Login',style: TextStyle(fontSize: 14 ,color:Colors.black)),
onPressed: ()
{
Navigator.pushNamed(context, '/login');
},return Container(
child:
RaisedButton(
child: Text('Do Login',style: TextStyle(fontSize: 14 ,color:Colors.black)),
onPressed: ()
{
Navigator.pushNamed(context, '/cards');
},
color:Colors.brown[50],
textColor: Colors.black,
padding: EdgeInsets.all(2.0),
splashColor: Colors.grey[100]
)
);
}