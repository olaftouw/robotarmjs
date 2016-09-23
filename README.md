# RobotArmJS

This library is an easy and enjoyable way to start learning the basics of programming using javascript. You can program a robot arm to move boxes in piles from one pile to another. For example: you can instruct the robot arm to scan the color of boxes and then sort these boxes to different piles according to their colors

##Getting started with this library
* Create a HTML-page like:
``` html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src= robotarm.js></script>
  <script src= myscript.js></script>
</head>
<body>
</body>
</html>
```
* Put the robotarm.js in the map where your HTML-page resides
* Create a Javascript file *myscript.js* in which you start controlling the robotarm by calling its methods
* Test the result of your code by loading your HTML-page in a modern browser
* Use the console window in the developer tools (F12) of your browser to check if the code runs without errors

##Methods you can use
### robotarm.loadLevel(name)
Displays the robot arm above a predefined set of piles of boxes according to the given *name*
####code example
``` Javascript
robotarm.loadLevel('exercise 1');
```
### robotarm.loadRandomLevel()
Displays the robot arm above a random set of piles of boxes
####code example
``` Javascript
robotarm.loadRandomLevel();
```
### robotarm.moveRight()
Moves the robot arm to the right (to the next pile of boxes)
####code example
``` Javascript
robotarm.moveRight();
```
### robotarm.moveLeft()
Moves the robot arm to the left (to the previous pile of boxes)
####code example
``` Javascript
robotarm.moveLeft();
```
### robotarm.grab()
Grabs the highest box from the current pile of boxes. The arm will hold the box until it is dropped somewhere
####code example
``` Javascript
robotarm.grab();
```
### robotarm.drop()
Drops the box the arm is holding on top of the current pile of boxes
####code example
``` Javascript
robotarm.drop();
```
### robotarm.scan()
Scans the color of the box the arm is holding. The robotarm.scan() returns this color. If the arm is not holding any box *null* is returned
####code example
``` Javascript
color = robotarm.scan();
```


