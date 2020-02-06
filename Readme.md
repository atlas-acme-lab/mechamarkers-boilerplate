# Mechamarkers Boilerplate for Javascript
This project includes all of the code you will need to get started running a Mechamarkers app on your local server.

## Setup
- Install Node.js from [here](https://nodejs.org/en/)
- Then download this repo (if you do it as a zip extract it)
- Open a terminal and navigate into the directory of this project
- Run `npm install` in the terminal
- Then run `npm run build` to compile the library

## Running the server
- Run `npm start`. This will start a local server and keep it running until you exit the process with Ctrl-C or close the terminal window.
- Go to `localhost:8080/index.html` in a browser

## Editing the Code
To just make a simple app all of the code you will need to edit is in the index.html file. You will probably only need to edit the callback for `window.onload` for initialization, and the body of the `update` loop for your main loop.

## Using the Library
When using this bootstrap, the library is exposed under the hood already. The library must be initialized and manually updated which the starter code already does for you. Here are the important functions to know.

### Simple 2D Vectors
Many objects in this library have 2D vector objects associated with them, they are a simple x and y value and look like this `{ x: value, y : value }` and are what we are referring to when we say something is a vector type.

### Markers
`Mechamarkers.getMarker(markerID)` will return a marker object that has the following properties.

| Property | Type | Description |
| --- | --- | --- |
| **id** | `number` | integer id of the marker |
| **preset** | `boolean` | is true when the marker is currently visible by the camera |
| **center** | `vector` | the center point of the marker in camera space |
| **corner** | `vector` | the top left corner of the marker in camera space, used to calculate orientation |
| **allCorners** | `vector` | the positions of all marker corners in camera space |

### Input Groups
`Mechamarkers.getGroup(groupName)` will return an input group object that has the following properties.These will only appear if you have created and saved a group config with the **Input Generator** in the desktop app. You may only have one config saved at a time. Input groups have the following properties and methods.

| Property | Type | Description |
| --- | --- | --- |
| **name** | `string` | name given to the group in the config |
| **angle** | `number` | rotation of the entire group in radians |
| **pos** | `vector` | position of the center point of the group's anchor |
| **anchor** | `Marker` | identifying marker of the group set in the config |
| **inputs** | `input[]` | array of all of the inputs in this group |

| Method Name | Parameters | Return Type | Description |
| --- | --- | --- | --- |
| **getInput** | `string: inputName` | `input` | returns and an input object of the given name |
| **getInputByID** | `number: inputID` | `input` | returns and input object with the given id in this group's inputs array |
| **isPresent** | `N\A` | `boolean` | returns true when a group's anchor is detected |

### Inputs
Inputs can only be accessed through a groups `getInput` function described above. Below are their properties.

| Property | Type | Description |
| --- | --- | --- |
| **name** | `string` | name given to the input in the config |
| **type** | `string` | type of input can be *BUTTON, TOGGLE, SLIDER, or KNOB* |
| **val** | `number` | current value of the input based on the calculation method for each type |
| **actor** | `Marker` | marker tied to this input |
