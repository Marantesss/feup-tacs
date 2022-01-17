import AceEditor from "react-ace";
import cx from "classnames";

const Editor = ({ code, setCode, isError, setIsError, isSuccess, setIsSuccess, compileCode}) => {

  const getButtonContent = () =>
    (!isError && !isSuccess)
      ? 'Compile'
      : isError
        ? 'Failed'
        : 'Success'

  const onEditorChange = (newValue: string) => {
    setCode(newValue)
    setIsError(false)
    setIsSuccess(false)
  }

  return (
    <>
      <div
        style={{ height: "10%" }}
        className="flex justify-center items-center"
      >
        <button
          className={cx(
            "p-4 w-32 bg-gradient-to-r  hover:opacity-80 rounded-xl text-white", {
              'from-red-300 to-red-500': isError,
              'from-green-300 to-green-500': isSuccess,
              'from-indigo-500 via-purple-500 to-pink-500': !isError && !isSuccess,
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
        height="90%"
        name="ace-code-editor"
        onChange={onEditorChange}
        value={code}
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
};

export default Editor;
