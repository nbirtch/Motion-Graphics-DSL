# Documentation

---

### Feature**s:**

- User Interface
    - The user can type their program into the left panel, using a define and main block
        - The define block can be used to create and update entities. Recommend using this block to manage the initial state of your objects, animations and layers.
        - Use the main block to program your animations using any type(s) of statement.
    - The user can press the run button to execute their program
    - The user can control their animations on the right viewing panel using the start and reset buttons.
- Entities

    Objects

    - The user is able to create, update and delete a variety of shapes with property options for visual customization, size and placement. The user can also create their own shapes using the polygon shape type. Objects can be statically displayed or animated dynamically using Animations.

    Layers

    - The user is able to create, update and delete layers. Layers are groups of objects which can be used to perform animations on multiple objects at a time and set default properties for any objects which don't contain them. Properties defined on objects will override default properties set by parent layers.

    Animations

    - The user is able to create and delete various types of animations such as movement, rotation and scaling. Notably, the user is not able to update animations. Only one of movement, rotation and scaling can be applied to an object at a time. Animations can be performed on objects or layers and can be controlled using the defined properties and actions. Performing an animation will override an object's previous animation.
        - Actions: start, stop, speedUp (2x), slowDown (0.5x), reset
- Wait
    - The user can wait for the given number of seconds to allow animations to run.
- Conditional
    - The user can compare a specific object's numeric properties to a given number. to perform a conditional block of statements. Conditionals on animation or layer properties are not currently implemented.
        - OPs: <, >, <=, >=, ==, !=
- Loop
    - The user can create loops of statements using either a count or a conditional.
- Collisions (NOT IMPLEMENTED)
    - The user can set a flag that causes objects that overlap to be deleted on collision.
        - Values: on, off

### **Entity Properties:**

- **Object:**

    All objects:

    - fill: The colour of an object, given by either its name or hexcode value - ex. blue, FFFF00
        - List of valid colour names: [https://www.december.com/html/spec/colorsvg.html](https://www.december.com/html/spec/colorsvg.html)
    - x: The x coordinate position of an object during execution, given as a positive whole number of pixels - ex. 200, 40
    - y: The y coordinate position of an object during execution, given as a positive whole number of pixels - ex. 500, 62
    - opacity: The opacity (transparency) of an object, given as a number with one decimal place between 0.0 and 1.0 - ex. 0.5, 1.0
    - shape:  The shape of an object, given by preset shape names. Shape can not be updated after creation of an object.  - ex. circle, rectangle, triangle, pentagon, hexagon, octagon, polygon
    - priority (NOT IMPLEMENTED): The precedence (or z-axis) of an object to be able to overlap other objects and layers, given as a positive whole number. Higher priority will overlap lower priorities, ties will break arbitrarily - ex. 1, 5

    Circle objects:

    - radius: The radius of the circle, given as a positive whole number of pixels - ex. 7, 43

    Rectangle objects:

    - width: The width of the rectangle (x plane), given as a positive whole number of pixels - ex. 5, 10
    - height: The height of the rectangle (y plane), given as a positive whole number of pixels- ex 6, 12

    Triangle/Pentagon/Hexagon/Octagon objects:

    - length: The standard side length of these shapes, given as a positive whole number of pixels - ex. 3, 9

    Polygon objects:

    - points: A list of [x,y] coordinates that construct the shape of the polygon given in brackets, separated by spaces. Requires at least 3 points. While your polygon is created at the exact points given, the x and y coordinate of your object will still serve as the center of your object from which animations will be enacted upon. - ex. [[1,0] [5,0] [3, 5]]
- **Animation:**

    All animations:

    - duration: The time an animation will run for in seconds given as a positive, whole number - ex. 5, 20
    - delay: The time at which an animation will start after executing the start animation action given as a positive, whole number - ex. 2, 12
    - opacity: Change the opacity (transparency) of an object, given as a number with one decimal place between 0.0 and 1.0 - ex. 0.5, 1.0
    - fill: Change the colour of an object, given by either its name or hexcode value - ex. blue, FFFF00

    Movement animation:

    - velocity: The number of pixels an object will move per second given as a positive or negative number with up to one decimal place - ex. 7, -22.2
    - direction: The direction an object will moved towards, given by either a standard direction (up/down/left/right) or vector -  ex. left, [100,100]

    Rotation animations:

    - angularVelocity: The number of pixels an object will move (rotate) per second given as a positive or negative number with up to one decimal place - ex. 15.0, -8

    Scale animations:

    - scaleFactor: The multiplier applied to the size of the object, given as a positive number with up to one decimal place - ex. 0.5, 4.0
- **Layer**

    All layers:

    - priority (NOT IMPLEMENTED): The precedence (or z-axis) of a layer to be able to overlap other objects and layers, given as a positive whole number. Higher priority will overlap lower priorities, ties will break arbitrarily - ex. 1, 5
    - objects: A list of object identifiers that belong to a layer given in brackets, separated by spaces. An empty list is also valid. - ex. [ myCircle myPolygon ]
    - object properties (documented above): x, y, fill, opacity

### **Examples:**

- Example program which includes a simple usage of each type of statement

    ```yaml
    define:
    	create object test1: 
    		shape: circle
    		radius: 5  

    		x: 64
    		y: 64

    	create object test2:
    		shape: rectangle
    		width: 3
        height: 4

    		fill: red

    	update object test1:
    		fill: blue

    main:
    	delete object test2
    	collisions off

    	create animation expand:
    		scaleFactor: 3
    		duration: 30

    	loop count 5 (
    		start expand object test1
    		wait 1
    		if object test1.radius <= 10 ( wait 2 )
    		stop expand object test1
    	)
    ```

- Examples of creating each entity and their variations with available properties

    ```yaml
    # Example of each animation type with properties
    create animation moveright:
    	velocity: +10.0
    	direction: right

    	duration: 20

    create animation rotate:
    	angularVelocity: -20.0

    	delay: 15
    	duration: 10

    create animation scale:
    	scaleFactor: 2

    	fill: green
    	opacity: 1.0

    #  Example of each object type with properties
    create object mycircle:
    	shape: circle
    	radius: 3

    	fill: blue
    	x: 44
    	y: 44

    create object myrectangle:
    	shape: rectangle
    	width: 6
    	height: 4

    	x: 22
    	y: 23

    create object mypentagon:
    	shape: pentagon
    	length: 5

    	fill: yellow
    	x: 4
    	y: 4
    	opacity: 0.1

    create object mypolygon:
    	shape: polygon
    	points: [[0,0] [0,5] [5,5] [5,0]]

    	fill: green
    	opacity: 1.0

    # Example of layer with properties
    create layer background:
    	priority: 1
    	objects: [mycircle myrectangle mypolygon]

    	# These layer properties set default object properties if objects in layer don't provide them
    	shape: rectangle
    	fill: purple
    	x: 0
    	y: 0
    	opacity: 1.0
    ```

- Examples of deleting an entity

    ```yaml
    # Examples of deleting each entity type
    delete animation scale

    delete object mycircle

    delete layer background
    ```

- Examples of wait statements:

    ```yaml
    # Example of wait
    wait 30
    wait 1
    ```

- Examples of collisions statements

    ```yaml

    # Example of collisions
    collisions on
    collisions off
    ```

- Examples of animation orchestration statements

    ```yaml
    # Example of each animation orchestration action
    start rotate layer background
    stop rotate object mypolygon
    speedUp rotate object myrectangle
    slowDown rotate object mycircle
    reset rotate object myrectangle
    ```

- Examples of loop statements

    ```yaml
    # Example of each loop type
    loop if object myrectangle.x <= 200 (
    	start moveright object myrectangle
    	stop moveright object mycircle
    	wait 10
    	stop moveright object myrectangle
    	start moveright object mycircle
    )

    loop count 5 (
    	collisions on
    	wait 5
    	collisions off
    	wait 5
    )
    ```

- Examples of conditional statements

    ```yaml
    # Examples of various conditions
    if object mycircle.radius < 3 ( 
    		start moveright object mycircle
    		wait 10
    )

    if object mytriangle.length == 7 ( collisions on )
    ```

---

---

---

## Formal Representation of Language

---

**Program** ::= "define:" Persistence+ "main:" Statement+

**Statement** ::= Persistence | Deletion | AnimationOrchestration | Wait | Collisions | Conditional | Loop

**Entity** ::= "object" | "animation" | "layer"

**Identifier** ::= [A-Za-z0-9]+

**AnimationIdentifier**::= Identifier <*Must be an existing identifier created using Create Animation **Identifier***>

**ObjectIdentifier** ::= Identifier <*Must be an existing identifier created using Create Object **Identifier**>*

**LayerIdentifier** ::= Identifier <*Must be an existing identifier created using Create Layer **Identifier**>*

<Note: "object", "animation" and "layer" are reserved names that can't be used as an identifier>

**Persistence** ::= ("creat" | "update") (AnimationDescriptors | ObjectDescriptors | LayerDescriptors)∞

**Deletion** ::= "delete" Entity Identifier

<*Note: Parameters that are specified a second time in one statement (e.g. two values for `fill`) will have no effect>*

<*Note: Update statements require at least 1 parameter>*

**AnimationDescriptors** ::= "animation" Identifier (":" AnimationParameter+)?

**LayerDescriptors** ::= "layer" Identifier (":" LayerParameter+)?

**ObjectDescriptors** ::= "object" Identifier (":" ObjectParameter+)?

**AnimationParameter** ::= "velocity:" FloatingPoint ****| "duration:" Integer | "delay:" Integer | "direction:" Direction | "scaleFactor:" Scale | "angularVelocity:" FloatingPoint | "opacity:" Opacity | "fill:" Colour

**ObjectParameter** ::=  "shape:" Shape | "fill:" Colour | "x:" Integer | "y:" Integer | "opacity:" Opacity

**Shape** ::= "circle:" CircleParameters | "rectangle:" RectangleParameters | "polygon:" PolygonParameters | ("triangle" | "pentagon" | "hexagon" | "octagon") "length:" Integer

**CircleParameters** ::= "radius:" Integer

**RectangleParameters** ::= "width:" Integer | "height:" Integer

**PolygonParameters** ::= "points:" "[" Coordinate{3,} "]"

**LayerParameter** ::= "priority:" Integer | "objects: [" ObjectIdentifier* "]" | ObjectParameter

**Integer** ::= [0-9]+

**FloatingPoint** ::= [-+]?[0-9]+(\.[0-9])?

**Colour** ::= [A-Za-z]* | [0-9A-Fa-f]{6} 

**Opacity** ::= 1(\.0)? | 0(\.[0-9])?

**Scale** ::= [0-9]+(\.[0-9])?

**Direction** ::= "up" | "down" | "right" | "left" | 2DVector

**2DVector** ::= Coordinate

**Coordinate** ::= "[" Integer "," Integer "]"

**AnimationOrchestration** ::= AnimationAction PerformAnimation

**AnimationAction** ::= "start" | "stop" | "speedUp" | "slowDown" | "reset"

**PerformAnimation** ::= AnimationIdentifier Entity (ObjectIdentifier | LayerIdentifier)

**Wait** ::= "wait" Integer

**Collisions** ::= "collisions" ("on" | "off")

**Condition** ::= "if" X OP Y "(" Statement+ ")"

**OP**::= "<" | ">" | "<=" | ">=" | "==" | "!="

**X/Y** ::= EntityIdentifier "." Parameter | Number

<Note: Only numeric (Integer, Floating Point, etc.) parameters can be evaluated in conditionals. We don't support checking Strings (fill, shape), Lists (points, objects) or Coordinates (2D Vector)>

**Loop**::= "loop" LoopParameters "(" Statement+ ")"

**LoopParameters**::= "count" Integer | "if" X OP Y
