# César e Toamigos

This is a simple web-based application that allows you to write animations with an external Domain Specific Language, and then generate JS code to place on your own web apps.

The live application can be found [here](https://loving-elion-58a47c.netlify.app/)!

There are also some demo animations available [here](https://github.com/Marantesss/feup-tacs/tree/master/demos)!

## Cool Features

- **Code Editor:** Get compiling errors and warnings directly on the editor & console
- **Animation Previewer:** You can preview what the animation will look like before copying the generated code on your HTML/JS Apps
- **Minimalist App:** All you have to do is write some code and press a button! Easy as can be :)

## The Language

### Keyframes

Keyframes can be pictured as a state in which a particular shape will be in. One keyframe can be applied multiple times to multiple shapes.

```
Keyframe:
  id: 1
  type: slerp
  color: red
  scale: [1, 1]
  rotation: 90
  position: [30,30]
  opacity: 100%
  time: 2s
```

- `id` - this is **UNIQUE**, and this value will be used to reference this keyframe
- `type` - can either be `lerp` ([linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation)) or `slerp` ([spherical linear interpolation](https://en.wikipedia.org/wiki/Slerp)).
- `color` - a simple color in hexadecimal form (i.e. #rrggbb) or in plain english text (i.e. red, orange, blue, ...)
- `scale` - simple array `[x, y]` coordinates, the final `x` and `y` scale of the shape where this animation will be applied to
- `position` - simple array `[x, y]` coordinates, which will be the canvas position where the shape will be in after the animation is over
- `rotation` - rotation angle (clockwise and in degrees)
- `opacity` - opacity of the shape in percentage (0-100%)
- `time` - the amount of time (in seconds) that will take for a shape to be in this keyframe state

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

## How to Run and Contribute

This project is a very simple React Application, so it should be easy to navigate around.

All the "important" code is in the `src/dsl` folder, that just receives and outputs regular strings to React Components!

You can find more information below!

### Folder Structure

```bash
.
├── craco.config.js           # CRA config
├── demos                     # text files with demo animations
│   └── ...
├── package.json              # Project dependencies
├── public                    # public assets
│   └── ...
├── README.md
├── src                       # source code folder
│   ├── assets                # dynamic assets
│   ├── components            # React components
│   ├── dsl                   # DSL code (parser, analyzer, generator and animation)
│   ├── index.tsx
│   ├── pages                 # web app pages
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
│   └── styles                # main css files
├── tailwind.config.js        # tailwind CSS config
├── tsconfig.json             # TypeScript Config
└── yarn.lock
```

### Future Work

- More customizable shapes (hexagons, and so on)
- Relative transformations:
  - Use translation vectors instead of absolute canvas coordinates
- Accept new measure units:
  - `time` could be represented in milliseconds
  - `size` could be represented with `rem`s or `em`s or `cm`s
  - `color` could also be represented in RGB(A) format
  - `opacity` could be replaced with alpha value in `color` property
- Accept new animation types (for now we are just using keyframe animations)
- Provide more informative errors and warnings directly in the editor
- :sparkles: 3D canvas :sparkles:

### Running the application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Available Scripts

In the project directory, you can run:

```bash
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

```bash
yarn build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
