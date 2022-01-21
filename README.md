# César e Toamigos

This is a simple application allows you to write a animations with an external Domain Specific Language.

## The Language

### Keyframes

Keyframes can be imagined as a state in which a particular shape will be in. One keyframe can be applied multiple times to multiple shapes.

```
Keyframe:
  id: 1
  type: slerp
  color: red
  scale: 1
  position: [30,30]
  time: 2s
```

- `id` - this is **UNIQUE**, and this value will be used to reference this keyframe
- `type` - can either be `lerp` ([linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation)) or `slerp` ([spherical linear interpolation](https://en.wikipedia.org/wiki/Slerp)).
- `color` - a simple color in hexadecimal form (i.e. #rrggbb) or in plain english text (i.e. red, orange, blue, ...)
- `scale` - the final scale of the shape where this animation will be applied to
- `time` - the amount of time (in seconds) that will take for a shape to be in this keyframe state
- `position` - simple array [x, y] coordinates, which will be the canvas position where the shape will be in after the animation is over

### Shapes

```
Shape:
  id: ola
  type: circle
  color: #f48024
  position: [200,200]
  size: 100px
  animation: [1, 3]
```

- `id` - this is **UNIQUE**
- `type` - can either be `circle`, `square` or `triangle`
- `color` - a simple color in hexadecimal form (i.e. #rrggbb) or in plain english text (i.e. red, orange, blue, ...)
- `size` - the size of the shape (in pixels)
- `animation` - simple array with keyframe animations `id`s that will be executed in order.
- `position` - simple array [x, y] coordinates, which will be the initial canvas position where the shape will be in

## Used technologies

- [TypeScript](https://www.typescriptlang.org/) because using plain JS would be too easy!
- [Parsimmon](https://github.com/jneen/parsimmon) for DSL parsing and some syntax analysis
- [React / CRA](https://github.com/facebook/create-react-app) as a frontend framework for faster application development.
- [Tailwind CSS](https://tailwindcss.com/) as a style library for faster :sparkles: styling :sparkles: and component building!

## Running the application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
