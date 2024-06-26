import React, { useState } from "react";
import FileUploader, {
  FileUploaderTypes,
} from "devextreme-react/file-uploader";
import HtmlEditor, {
  Item,
  Toolbar,
  HtmlEditorTypes,
} from "devextreme-react/html-editor";
import notify from "devextreme/ui/notify";

interface FileEditorProps {
  onFileContentChange: (content: string) => void;
}

const FileEditor: React.FC<FileEditorProps> = ({ onFileContentChange }) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const onValueChanged = (e: FileUploaderTypes.ValueChangedEvent) => {
    if (e.value) {
      const file = e.value[0];
      const reader = new FileReader();
      console.log(file);

      reader.onload = async (event) => {
        if (file.type === "application/pdf") {
          notify("PDF files are not supported", "error", 3000);
          const content = "PDF files are not supported";
          setFileContent(content);
          onFileContentChange(content);
        } else if (file.type === "text/plain") {
          const textContent = event.target?.result as string;
          const htmlContent = textContent.replace(/\n/g, "<br>");
          setFileContent(htmlContent);
          onFileContentChange(textContent);
        } else if (file.type === "text/html") {
          const htmlContent = event.target?.result as string;
          setFileContent(htmlContent);
          onFileContentChange(htmlContent);
        } else if (file.type === "application/json") {
          const jsonContent = event.target?.result as string;
          const htmlContent = JSON.stringify(JSON.parse(jsonContent), null, 2);
          setFileContent(htmlContent);
          onFileContentChange(htmlContent);
        } else if (file.name.endsWith(".md")) {
          const markdownContent = event.target?.result as string;
          const htmlContent = await fetch("https://api.github.com/markdown", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: markdownContent,
              mode: "markdown",
            }),
          }).then((response) => response.text());
          setFileContent(htmlContent);
          onFileContentChange(htmlContent);
        } else {
          notify("Unsupported file type", "error", 2000);
          const content = "Unsupported file type";
          setFileContent(content);
          onFileContentChange(content);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file: ", error);
        const content = "Error reading file";
        setFileContent(content);
        onFileContentChange(content);
      };

      reader.readAsText(file);
    }
  };

  const editorValueChanged = (e: HtmlEditorTypes.ValueChangedEvent) => {
    setFileContent(e.value);
    onFileContentChange(e.value);
  };

  return (
    <div>
      <FileUploader
        onValueChanged={onValueChanged}
        selectButtonText="Select file"
        uploadMode="useForm"
      />
      <HtmlEditor
        height="500px"
        value={fileContent || ""}
        onValueChanged={editorValueChanged}
      >
        <Toolbar multiline={true}>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item
            name="size"
            acceptedValues={[
              "8pt",
              "10pt",
              "12pt",
              "14pt",
              "18pt",
              "24pt",
              "36pt",
            ]}
          />
          <Item
            name="font"
            acceptedValues={[
              "Arial",
              "Courier New",
              "Georgia",
              "Impact",
              "Lucida Console",
              "Tahoma",
              "Times New Roman",
              "Trebuchet MS",
              "Verdana",
            ]}
          />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
        </Toolbar>
      </HtmlEditor>
    </div>
  );
};

export default FileEditor;
