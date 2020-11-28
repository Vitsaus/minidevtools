import { Utility } from "../components/Utility";
import { MonacoDiffEditor } from 'react-monaco-editor';
import { useState } from "react";
import { DiffEditor } from "../components/DiffEditor";

export function DiffPage() {
    const [a, setA] = useState<string>("");
    const [b, setB] = useState<string>("");
   return (
    <Utility title="Diff">
      <DiffEditor
        a={""}
        b={""}
        language={"plaintext"}
      />
    </Utility>
   ) 
}