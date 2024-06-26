import { useState } from "react";
import Splitter, { Item } from "devextreme-react/splitter";
import "./App.css";
import FileEditor from "./FileEditor";
import FileDiff from "./FileDiff";

const App = () => {
  const [file1Content, setFile1Content] = useState<string>("");
  const [file2Content, setFile2Content] = useState<string>("");

  return (
    <>
      <h1>File Comparison</h1>
      <Splitter id="splitter" orientation="horizontal">
        <Item size="50%">
          <div className="file-split">
            <h2>File 1</h2>
            <FileEditor onFileContentChange={setFile1Content} />
          </div>
        </Item>
        <Item size="50%">
          <div className="file-split">
            <h2>File 2</h2>
            <FileEditor onFileContentChange={setFile2Content} />
          </div>
        </Item>
      </Splitter>
      <div className="diff-table">
        <h2>Comparison Result</h2>
        <FileDiff file1={file1Content} file2={file2Content} />
      </div>
    </>
  );
};

export default App;
