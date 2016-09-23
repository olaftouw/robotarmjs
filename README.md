# RobotArmJS

This library is an easy and enjoyable way to start learning the basics of programming using javascript. You can program a robot arm to move boxes in piles from one pile to another. Let the robot arm for example scan the color of boxes and try to sort these boxes in different piles etc.

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
* Create a Javascript file *myscript.js* in which you start controlling the robotarm by calling its method

##Methods you can use
### robotarm.loadLevel(levelName)
Displays the robot arm above a predefined set of piles of boxes

####code example
``` Javascript
LevelName = 'exercise 1';
robotarm.loadLevel(levelName);
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





