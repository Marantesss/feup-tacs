import React from "react";
import { useState } from "react";

import Editor from "../components/Editor";
import GeneratedCode from "../components/GeneratedCode";
import Viewer from "../components/Viewer";
import { transpiler } from "../dsl/analyzer";
import { Keyframe, Shape } from "../dsl/animator";
import { generator } from "../dsl/generator";
import "./App.css";

const App = () => {
  const [code, setCode] = useState<string>(defaultCode);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [annotation, setAnnotation] = useState<{}>({});
  const [shapes, setShapes] = useState<Array<Shape>>([]);
  const [keyframes, setKeyframes] = useState<Map<string, Keyframe>>(new Map());
  const [generatedCode, setGeneratedCode] = useState<string>("");

  const compileCode = () => {
    setIsError(false);
    setIsSuccess(false);
    try {
      transpiler.execute(code);
      setIsSuccess(true);
      setErrorMessage("");
      setShapes(transpiler.shapes)
      setKeyframes(transpiler.keyframes)
      setAnnotation({})
      setGeneratedCode(generator.generate(transpiler.shapes, transpiler.keyframes))
    } catch (e) {
      const { result, message } = e
      setIsError(true);
      setErrorMessage(message);
      setShapes([])
      setKeyframes(new Map())
      setGeneratedCode("")
      setAnnotation(
        result
          ? {
            row: result.index.line - 1,
            column: result.index.column - 1,
            type: "error",
            text: `Expected one of ${result.expected}`,
          }
          : {}
      );
    }
  };

  const onEditorChange = (newValue: string) => {
    setCode(newValue);
    setIsError(false);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-2 grid-rows-2 gap-1 pt-1 px-2">
      <div className="row-span-2">
        <Editor
          code={code}
          isError={isError}
          isSuccess={isSuccess}
          compileCode={compileCode}
          onEditorChange={onEditorChange}
          errorMessage={errorMessage}
          annotation={annotation}
        />
      </div>
      <div className="row-span-1">
        <Viewer
          shapes={shapes}
          animations={keyframes}
          shouldRun={isSuccess}
        />
      </div>
      <div className="row-span-1">
        <GeneratedCode value={generatedCode} />
      </div>
    </div>
  );
};

const defaultCode = `\
Shape:
  id: tri1
  type: triangle
  color: blue
  position: [200,200]
  size: 100px
  animation: [ 1 ]

Shape:
  id: tri2
  type: triangle
  color: blue
  position: [230,150]
  size: 100px
  animation: [ 2 ]

Shape:
  id: tri3
  type: triangle
  color: red
  position: [140,200]
  size: 100px
  animation: [ 3 ]

Shape:
  id: tri4
  type: triangle
  color: red
  position: [110,150]
  size: 100px
  animation: [ 4 ]

Shape:
  id: tri5
  type: triangle
  color: green
  position: [140,100]
  size: 100px
  animation: [ 5 ]

Shape:
  id: tri6
  type: triangle
  color: green
  position: [200,100]
  size: 100px
  animation: [ 6 ]

Keyframe:
  id: 1
  type: lerp
  color: blue
  scale: [1,1]
  position: [200,200]
  rotation: 90
  time: 0s

Keyframe:
  id: 2
  type: lerp
  color: blue
  scale: [1,1]
  rotation: 30
  position: [230,150]
  time: 0s

Keyframe:
  id: 3
  type: lerp
  color: red
  scale: [1,1]
  position: [140,200]
  rotation: 30
  time: 0s

Keyframe:
  id: 4
  type: lerp
  color: red
  scale: [1,1]
  rotation: 90
  position: [110,150]
  time: 0s

Keyframe:
  id: 5
  type: lerp
  color: green
  scale: [1,1]
  position: [140,100]
  rotation: 30
  time: 0s

Keyframe:
  id: 6
  type: lerp
  color: green
  scale: [1,1]
  rotation: 90
  position: [200,100]
  time: 0s
`;

export default App;
