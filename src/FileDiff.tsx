import { useState, useEffect } from "react";
import { diffChars, Change } from "diff";
import DOMPurify from "dompurify";

type FileDiffProps = {
  file1: string;
  file2: string;
};

const FileDiff = ({ file1, file2 }: FileDiffProps) => {
  const [diff, setDiff] = useState<Change[]>([]);

  useEffect(() => {
    const cleanFile1 = DOMPurify.sanitize(file1, { ALLOWED_TAGS: [] });
    const cleanFile2 = DOMPurify.sanitize(file2, { ALLOWED_TAGS: [] });
    const diff = diffChars(cleanFile1, cleanFile2).filter(
      (part) => part.added || part.removed,
    );
    setDiff(diff);
  }, [file1, file2]);

  const formatValue = (value: string) => {
    if (/^\s+$/.test(value)) {
      return value.replace(/ /g, "␣");
    }
    return value;
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Value</th>
            <th>Added</th>
            <th>Removed</th>
          </tr>
        </thead>
        <tbody>
          {diff.map((part, index) => (
            <tr key={index}>
              <td>{formatValue(part.value)}</td>
              <td>{part.added ? "Yes" : "No"}</td>
              <td>{part.removed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileDiff;
