import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { runCode } from "../../utils/codeRunner/runC";

// Supported languages for dropdown
const LANGUAGES = [
  { name: "C", value: "c" },
  { name: "C++", value: "cpp" },
  { name: "Java", value: "java" },
  { name: "Python", value: "python" },
];

const DEFAULT_CODE = {
  c: `#include <stdio.h>

int main() {
    // your code here
    return 0;
}
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}
`,
  java: `public class Main {
    public static void main(String[] args) {
        // your code here
    }
}
`,
  python: `# your code here`
};

export default function CodeEditor({
  initialCode = "",
  initialInput = "",
  initialLanguage = "c",
  onCodeChange,
  onLanguageChange
}) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || DEFAULT_CODE[initialLanguage]);
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState("");
  const [stderr, setStderr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code]);

  useEffect(() => {
    if (onLanguageChange) onLanguageChange(language);
  }, [language]);

  function handleLanguageChange(e) {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput("");
    setStderr("");
  }

  async function handleRun() {
    setLoading(true);
    setOutput("");
    setStderr("");
    const result = await runCode({ code, input, language });
    if (result.error) {
      setStderr(result.error);
    } else {
      setOutput(result.stdout ?? "");
      setStderr(result.stderr ?? "");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between gap-2">
        <select
          data-testid="language-select"
          value={language}
          onChange={handleLanguageChange}
          className="rounded bg-gray-100 px-2 py-1 border"
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.name}</option>
          ))}
        </select>
      </div>
      <MonacoEditor
        height="280px"
        defaultLanguage={language}
        language={language === "cpp" ? "cpp" : language}
        value={code}
        onChange={val => setCode(val)}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
        }}
      />

      {/* Redundant inputs removed */}
      {/* Redundant inputs removed completely */}

      <div className="flex flex-col gap-1">
        <label className="font-semibold text-sm">Output:</label>
        <pre className="bg-black text-white p-2 rounded min-h-[45px] overflow-x-auto">
          {output}
        </pre>
        {stderr && (
          <>
            <label className="font-semibold text-sm text-red-500">Error / Stderr:</label>
            <pre className="bg-red-100 text-red-700 p-2 rounded min-h-[18px] overflow-x-auto">
              {stderr}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
