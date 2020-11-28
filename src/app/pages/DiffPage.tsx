import { Utility } from "../components/Utility";
import { MonacoDiffEditor } from 'react-monaco-editor';
import { useState } from "react";

export function DiffPage() {
    const [a, setA] = useState<string>("");
    const [b, setB] = useState<string>("");
   return (
    <Utility title="Diff">
      <MonacoDiffEditor
        width="500"
        height="250"
        language="javascript"
        original={""}
        value={""}
        options={{
            originalEditable: true,
            readOnly: false,
            ignoreTrimWhitespace: false,
        }}
      />
    </Utility>
   ) 
}