import AceEditor from "react-ace";

const Editor = () => {
  return (
    <>
      <div
        style={{ height: "10%" }}
        className="flex justify-center items-center"
      >
        <button
          className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-80 rounded-xl text-white"
          onClick={() => console.log("clicked")}
        >
          Generate
        </button>
      </div>
      <AceEditor
        className="border-2"
        width="100%"
        height="90%"
        name="ace-code-editor"
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
};

export default Editor;
