---
title: Nim cheat sheet
tags: nim, programming
---

# Getting Started

Write to stdout:

```nim
echo "Hello, world!"
```

Build:

```bash
nim c main.nim
```

Compile and run:

```bash
nim c -r main.nim
```

**HINT:** Add the `--verbosity:0` flag to turn off extra info printed by the compiler.

# Variables

`const` variables are immutable and computed at compile time.

```nim
const x = 5
```

`let` variables are immutable and computed at run time.

```nim
let x = 5
```

`var` variables are mutable.

```nim
var x = 5
```

Types can be inferred or written explicitly. Both of these lines are valid:

```nim
var x = 5
var x: int = 5
```

# Types

## Primitives

Here are the most salient primitive types:

- `float`
- `int`
- `bool`
- `string`
- `char`
- `nil`

Enums:

```nim
type
  Directions = enum
    North, South, East, West

echo Directions.North == Directions.South
# false
```

## Arrays & Sequences

Arrays have a fixed length:

```nim
var x: array[5, int] = [100, 200, 300, 400, 500]
```

Sequences do not have a fixed length:

```nim
var x: seq[int] = @[]
x.add(100)
x.add(200)
x.add(300)
x.add(400)
x.add(500)
```

Mapping and filtering of sequences (and maybe arrays?) can be enabled by importing the `sequtils` module from the standard library:

```nim
import std/sequtils

var x: seq[int] = @[1, 2, 3, 4, 5]
var y: seq[int] = x.map(proc (v: int): int = v * 2)
echo y

var z: seq[int] = x.filter(proc (v: int): bool = v mod 2 == 0)
echo z
```

There's apparently also a lambda function syntax that uses the `do` keyword:

```nim
var y: seq[int] = x.map do (v: int) -> int: v * 2
```

Personally, though, I think my favorite is the JS-like fat-arrow notation, though it requires importing the standard library's `sugar` module:

```nim
import std/sugar
var y: seq[int] = x.map(v => v * 2)
```

I'm not quite sure yet how to indicate parameter and return types in this notation, though. Hopefully, it won't be very hard to figure out!

## Objects (Structs)

Objects in Nim are like structs in other C-languages: they can't have methods; they can only have properties. However, methods, inheritance, and other OOP features are available. See [the OOP section](#object-oriented-programming) below for more info.

```nim
type
  Person = object
    name: string
    age: int

var alice = Person(name: "Alice", age: 23)
```

Check if a value is of a certain type using the `is` keyword:

```nim
echo 234 is int
echo "foo" is string
echo alice is Person
```

# Control Flow

Conditionals:

```nim
var x = 0.25

if x < 0:
  echo "Less than 0!"

elif x > 1:
  echo "Greater than 1!"

else:
  echo "Between 0 and 1!"
```

`while` loops:

```nim
var i = 0

while i < 10:
  i += 1
  echo i
```

`for` loops:

```nim
var fibs: seq[int] = @[1, 1, 2, 3, 5, 8, 13, 21]

for v in fibs:
  echo v

for i, v in fibs:
  echo v & " is the value at index " & i

for i in 0..100:
  echo i
```

**NOTE:** The `..` operator is inclusive on both ends! So, for example, `0..100` represents the range [0, 100] (inclusive).

Exception handling:

```nim
proc somethingStupid() =
  raise newException(Exception, "Nope!")

var failed = false

try:
  somethingStupid()

except Exception as e:
  echo "ERROR: " & e.msg
  failed = true

echo failed
```

# Procedures (Functions)

```nim
proc fib(n: int): int =
  if n < 2:
    return 1

  return fib(n - 1) + fib(n - 2)

for i in 0..10:
  echo fib(i)
```

Procedures can be overloaded:

```nim
proc add(a: float, b: float): float =
  return a + b

proc add(a: int, b: int): int =
  return a + b

proc add(a: string, b: string): string =
  return a & b

echo add(1.2, 3.4)
echo add(234, 567)
echo add("foo", "bar")
```

Procedures can also be generic:

```nim
proc reverse[T](x: seq[T]): seq[T] =
  var temp: seq[T] = @[]

  for i in 0..len(x)-1:
    temp.add(x[len(x) - 1 - i])

  return temp

echo reverse(@["a", "b", "c"])
echo reverse(@[1, 2, 3])
```

Procedures can be used to create and/or overload operators:

```nim
proc `@`(a: float, b: float): float =
  return a * b

echo 234 * 567
echo 234 @ 567

proc `+`(a: string, b: string): string =
  return a & b

echo "foo" + "bar"
```

**NOTE:** Operator "names" must be wrapped in backticks and (as far as I can tell) can only contain symbols.

The keyword `varargs` can be used as a placeholder for to mean "all of the arguments passed into the procedure":

```nim
proc printAllTheThings(things: varargs[string]) =
  for thing in things:
    echo thing

printAllTheThings("a", "b", "c")
printAllTheThings($1, $2, $3)
```

# Working with Strings

Multiline strings:

```nim
var x = """
  Hello, world!
  This is a multiline string.
"""
```

Concatenate strings with the `&` operator:

```nim
echo "foo" & "bar"
```

Convert values to strings using the `$` operator:

```nim
echo 234 & " is a " & typeof 234
echo $234 & " is a " & typeof $234
```

For most interesting string-related tasks, we'll need to import the standard library's `strutils` module:

```nim
import std/strutils
```

(The remainder of this section will assume that the `strutils` module has been imported.)

Check for the existence of a substring within a string:

```nim
echo "foo" in "foolish"
echo "foo" in "nope"
echo contains("foolish", "foo")
echo contains("nope", "foo")
```

Use some preexisting character sets:

```nim
echo Digits
echo HexDigits
```

Interpolate / format strings:

```nim
echo "My name is $1, and I'm $2 years old!" % ["Josh", "37"]
echo "My name is $#, and I'm $# years old!" % ["Josh", "37"]
```

Count occurrences of a substring:

```nim
echo count("fooooooood", "o")
echo count("foofoofoofoofoo", "foo")
```

Indent / dedent / unindent text:

```nim
var html = """
  <html>
    <head>
      ...
    </head>
    <body>
      ...
    </body>
  </html>
"""

echo "====="
echo indent(html, 8)

# =====
#           <html>
#             <head>
#               ...
#             </head>
#             <body>
#               ...
#             </body>
#           </html>

echo "====="
echo dedent(html)

# =====
# <html>
#   <head>
#     ...
#   </head>
#   <body>
#     ...
#   </body>
# </html>

echo "====="
echo unindent(html)

# =====
# <html>
# <head>
# ...
# </head>
# <body>
# ...
# </body>
# </html>
```

Check for substrings at the beginning or end of a string:

```nim
echo "Hello, world!".startsWith("He")
echo "Hello, world!".startsWith("d!")
echo "Hello, world!".endsWith("He")
echo "Hello, world!".endsWith("d!")
```

Convert to and from other encodings:

```nim
echo fromBin[int]("1010")
echo 10.toBin(4)
echo fromHex[int]("ababab")
echo 11250603.toHex(6)
```

Join strings:

```nim
echo join(["A", "B", "C"], " => ")
```

Replace substrings:

```nim
var food = "food"

while "o" in food:
  food = food.replace("o", "-")

echo food
```

**NOTE:** There's a [`multiReplace`](https://nim-lang.org/docs/strutils.html#multiReplace%2Cstring%2Cvarargs%5B%5D) function in `std/strutils`, but I couldn't figure out the syntax. The compiler didn't seem to like any of the ways I wrote it. 🤷

Parse numbers:

```nim
var flote = parseFloat("234.567")
var ent = parseInt("13579")
echo flote, " ", typeof flote
echo ent, " ", typeof ent
```

Repeat strings:

```nim
echo "foo".repeat(5)
```

Remove leading or trailing whitespace:

```nim
echo "               hey               ".strip()
```

Change case:

```nim
echo "Foo".toLower()
echo "Foo".toUpper()
```

# Object-Oriented Programming

Create a type:

```nim
type Person = object
  name: string
  age: int
```

Create an instance:

```nim
var alice = Person(name: "Alice", age: 23)
```

Create methods for the type:

```nim
proc sayHi(self: Person) =
  echo "Hi! My name is $#!" % [self.name]
```

**NOTE:** Using `self` as the variable name for a type instance isn't required; it's just the convention.

Call the methods using a variety of syntaxes:

```nim
alice.sayHi()
alice.sayHi
sayHi(alice)
```

Note that this pattern works for non-object types as well:

```nim
proc dubble(x: float): float =
  return x * 2

echo dubble(234.567)
echo 234.567.dubble()
echo 234.567.dubble
```

Importantly, values passed into procedures are immutable. This would fail:

```nim
proc changeNameToBob(self: Person) =
  self.name = "Bob"

changeNameToBob(alice)
echo alice.name
```

However, arguments can be marked as mutable using the `var` keyword in the function signature:

```nim
proc changeNameToBob(self: var Person) =
  self.name = "Bob"

changeNameToBob(alice)
echo alice.name
```

To create inheritance, the base type must inherit from `RootObj`:

```nim
type Person = ref object of RootObj
  name: string
  age: int
```

Then it can be sub-typed:

```nim
type Employee = ref object of Person
  position: string
```

Use the `is` keyword to check if a value is of a particular type:

```nim
var dwight = Employee(name: "Dwight", age: 40, position: "Assistant [to the] Manager")

echo dwight is Person
echo dwight is Employee
```

# Imports & Modules

To mark a variable for export from a file, use an asterisk:

```nim
# helpers.nim
proc add*(a: int, b: int): int =
  return a + b
```

Import particular items from a file:

```nim
from helpers import add
```

And rename the imported item, if you like:

```nim
from helpers import add as addInts
```

Or import the entire file:

```nim
import helpers
```

It's also possible to include the contents of a file using the `include` keyword:

```nim
include helpers
```

A _package_ (as opposed to a file or module) is a directory with a `identifier.nimble` file at its root. If the name of the package is "coolstuff", then the directory should contain a `coolstuff.nimble` file. (As far as I can tell, this file doesn't actually need to contain anything; it just needs to exist.)

# Working with Files

Read an entire file:

```nim
var raw = readFile("myfile.txt")
```

Read a file one line at a time:

```nim
var f = open("myfile.txt")
var lines: seq[string] = @[]
var isStillReading = true

while isStillReading:
  try:
    lines.add(f.readLine())

  except:
    isStillReading = false

echo lines
f.close()
```

**NOTE:** Don't forget to `close` the file when you're done with it (as in the last line of the example above)!

Write an entire file all at once:

```nim
writeFile("myfile.txt", "Here is the new content of the file!")
```

Write to a file one line at a time:

```nim
var f = open("integers.txt", fmWrite)

for i in 0..100:
  f.writeLine($i)

f.close()
```

**NOTE:** Note the use of the `fmWrite` constant to enable writing!

## JSON

Here's the contents of a file called `numbers.json`:

```json
[123, 456, 789]
```

To import the data contained in the file, we need to import the `json` module from the standard library and then use the `parseJson` procedure:

```nim
import std/json

var raw = readFile("numbers.json")
var values: seq[int] = @[]

for v in raw:
  values.add(v.getInt())

echo values
```

Note that values aren't automatically converted into their usual types; instead, it's necessary to call each node's `getInt`, `getFloat`, `getString`, or `getBool` methods in order to extract a value.

Converting data to JSON involves using the `%*` operator and then converting the result into a string using the `$` operator:

```nim
var values: seq[int] = @[123, 456, 789]
var raw = $(%* values)
writeFile("values.json", raw)
```
