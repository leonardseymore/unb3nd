Coding Conventions
==================

Comments
--------
Comments are fundamental in this project.  They serve to assist the programmer
with meta information.  They give guidelines to how functions and objects should
be used throughout the project and later on used to generate a friendly API 
document.  

In this project, getting comment right are more important than getting code right.

Annotations
-----------
Annotations are used in comment blocks to be used duely to assist a programmer
to get meta information on a function or variable and later use a documentation
system to extract these annotations to give context to the API.  Due to 
JavaScript's lack of object orientation enforcement we have opted for a 
documentation style code enforcement rather than trying to create an OO 
JavaScript framework.

Breakdown:
@function - A function living in global space used freely as a helper method
@global - A global variable

@class - Function denoting a class definition
@extends ID - Denotes a subclass extending a superclass ID
@abstract - Denotes a subclass meant to be extended

@method - A class method
@override - A method overriding a base class method
@static - A static class method
@field TYPE - A field on a class with type TYPE

@param TYPE ID DESC - A parameter of type TYPE, id ID and with a description DESC
@return TYPE DESC? - A function or method's return type TYPE with optional description DESC

Tilde Blocks
------------
Tilde blocks are blocks starting with a ~ and an identifier.  All code between
a ~ID and ~END-ID are special code indicating special significance. These code
blocks should be carefully understood before modifications are made, since they
usually cater for difficult to solve problems.

Breakdown:
~PHYLIMIT - Special code to cater for limitations in physical simulations
            these code blocks are commonly referred to as workarounds or
			hacks. Although these terms have negative connotations they are
			essential to the workings of some code.
			
Notes
=====

Simulation
----------
- For higher accuracy collision games like pool / snooker investigate the use of
  time division engines.