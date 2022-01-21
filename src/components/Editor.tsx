import AceEditor from "react-ace";
import cx from "classnames";

interface Props {
  code?: string;
  isError: boolean;
  isSuccess: boolean;
  compileCode: () => void;
  onEditorChange: (newValue: string) => void;
  errorMessage: string;
  annotation: any;
}

const Editor = ({
  code,
  isError,
  isSuccess,
  compileCode,
  onEditorChange,
  errorMessage,
  annotation,
}: Props) => {
  const getButtonContent = () =>
    !isError && !isSuccess ? "Compile" : isError ? "Failed" : "Success";

  return (
    <>
      <div
        style={{ height: "10%" }}
        className="flex justify-center items-center"
      >
        <button
          className={cx(
            "p-4 w-32 bg-gradient-to-r  hover:opacity-80 rounded-xl text-white",
            {
              "from-red-300 to-red-500": isError,
              "from-green-300 to-green-500": isSuccess,
              "from-indigo-500 via-purple-500 to-pink-500":
                !isError && !isSuccess,
            }
          )}
          onClick={() => compileCode()}
        >
          {getButtonContent()}
        </button>
      </div>
      <AceEditor
        className="border-2"
        width="100%"
        height="70%"
        name="ace-code-editor"
        onChange={onEditorChange}
        value={code}
        annotations={[annotation]}
        editorProps={{ $blockScrolling: true }}
      />
      <AceEditor
        className="border-2"
        readOnly
        value={errorMessage}
        width="100%"
        height="20%"
        mode="text"
        name="ace-error-viewer"
        highlightActiveLine={false}
        showGutter={false}
        showPrintMargin={false}
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
};

export default Editor;
