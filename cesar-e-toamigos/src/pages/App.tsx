import React from "react";
import { useState } from "react";

import Editor from "../components/Editor";
import GeneratedCode from "../components/GeneratedCode";
import Viewer from "../components/Viewer";
import { transpiler } from "../dsl/analyzer";
import "./App.css";

const App = () => {
  const [code, setCode] = useState<string>(defaultCode);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const compileCode = () => {
    setIsError(false);
    setIsSuccess(false);
    try {
      transpiler.execute(code);
      setIsSuccess(true);
      setErrorMessage("");
    } catch (e) {
      setIsError(true);
      setErrorMessage(e.message);
      console.error(e);
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
          setCode={setCode}
          isError={isError}
          isSuccess={isSuccess}
          setIsError={setIsError}
          setIsSuccess={setIsSuccess}
          compileCode={compileCode}
          onEditorChange={onEditorChange}
          errorMessage={errorMessage}
        />
      </div>
      <div className="row-span-1">
        <Viewer shapes={transpiler.shapes} animations={transpiler.keyframes} shouldRun={isSuccess} />
      </div>
      <div className="row-span-1">
        <GeneratedCode />
      </div>
    </div>
  );
};

const defaultCode = `\
Shape:
  id: ola
  type: circle
  color: #f48024
  position: [200,200]
  size: 100px
  animation: [1, 3]

Shape:
  id: quadrado1
  type: square
  color: purple
  position:[1,2]
  size: 45px
  animation: [   1 ,     2     ]

Keyframe:
  id: 1
  type: slerp
  color: red
  scale: 1
  position: [30,30]
  time: 2s

Keyframe:
  id: 2
  type: lerp
  color: green
  scale: 2
  position: [87,233]
  time: 5s

Keyframe:
  id: 3
  type: lerp
  color: green
  scale: 2
  position: [535,286]
  time: 2s
`;

export default App;
