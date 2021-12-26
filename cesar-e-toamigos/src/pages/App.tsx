import React from "react";
import Editor from "../components/Editor";
import GeneratedCode from "../components/GeneratedCode";
import Viewer from "../components/Viewer";
import "./App.css";

const App = () => {
  return (
    <div className="min-h-screen w-full grid grid-cols-2 grid-rows-2 gap-2">
      <div className="row-span-2">
        <Editor />
      </div>
      <div className="row-span-1">
        <Viewer />
      </div>
      <div className="row-span-1">
        <GeneratedCode />
      </div>
    </div>
  );
};

export default App;
