import Editor from "@monaco-editor/react";
import { useMemo, useState } from "react";
import { buildPreviewDocument } from "../lib/preview";
import { useLibraryStore } from "../store/libraryStore";
import type { Component, TargetFramework } from "../types";

interface QuickPreviewDialogProps {
  onClose: () => void;
}

const buildTempComponent = (framework: TargetFramework, code: string, css: string): Component => ({
  id: "quick-preview",
  name: "Vorschau",
  category: "general",
  description: "",
  targetFramework: framework,
  props: [],
  variants: [
    {
      id: "quick-preview-variant",
      name: "default",
      props: {},
      code: framework === "react-tailwind" ? { jsx: code, css } : { html: code, css },
      notes: "",
    },
  ],
  guidelines: [],
});

const codeLanguage = (framework: TargetFramework) => {
  if (framework === "react-tailwind") return "javascript";
  return "html";
};

const codePlaceholder = (framework: TargetFramework) => {
  if (framework === "react-tailwind")
    return `<button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
  Klick mich
</button>`;
  if (framework === "vue-tailwind")
    return `<button class="rounded-lg bg-blue-600 px-4 py-2 text-white">
  Klick mich
</button>`;
  return `<button class="rounded-lg bg-blue-600 px-4 py-2 text-white">
  Klick mich
</button>`;
};

export function QuickPreviewDialog({ onClose }: QuickPreviewDialogProps) {
  const [framework, setFramework] = useState<TargetFramework>("react-tailwind");
  const [code, setCode] = useState("");
  const [css, setCss] = useState("");
  const [componentName, setComponentName] = useState("Neue Komponente");
  const [category, setCategory] = useState("general");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const addRawComponent = useLibraryStore((state) => state.addRawComponent);

  const previewComponent = useMemo(
    () => buildTempComponent(framework, code || codePlaceholder(framework), css),
    [framework, code, css],
  );

  const previewDoc = useMemo(
    () => buildPreviewDocument(previewComponent, previewComponent.variants[0], {}),
    [previewComponent],
  );

  const handleSave = () => {
    if (!code.trim() || saved) return;
    const id = crypto.randomUUID();
    const variantId = crypto.randomUUID();
    const component: Component = {
      id,
      name: componentName.trim() || "Neue Komponente",
      category: category.trim() || "general",
      description: "",
      targetFramework: framework,
      props: [],
      variants: [
        {
          id: variantId,
          name: "default",
          props: {},
          code: framework === "react-tailwind" ? { jsx: code, css } : { html: code, css },
          notes: "",
        },
      ],
      guidelines: [],
    };
    addRawComponent(component);
    setSaved(true);
    setTimeout(() => onClose(), 900);
  };

  const handleCopyCode = async () => {
    if (!code.trim()) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleFrameworkChange = (next: TargetFramework) => {
    setFramework(next);
    setCode("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-[92vh] w-[96vw] max-w-7xl flex-col rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Code einfügen & Vorschau</h2>
            <p className="text-xs text-slate-400">Code einf&uuml;gen → fertige Komponente sofort rendern → in Library speichern</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </header>

        {/* Toolbar */}
        <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-slate-800 bg-slate-900/50 px-5 py-2.5">
          <label className="flex items-center gap-2 text-xs text-slate-300">
            Framework
            <select
              value={framework}
              onChange={(e) => handleFrameworkChange(e.target.value as TargetFramework)}
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 outline-none focus:border-blue-500"
            >
              <option value="react-tailwind">React + Tailwind</option>
              <option value="vue-tailwind">Vue + Tailwind</option>
              <option value="html-css">HTML / CSS</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300">
            Name
            <input
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="w-44 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300">
            Kategorie
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-32 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 outline-none focus:border-blue-500"
            />
          </label>

          <span className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              disabled={!code.trim()}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? "✓ Kopiert!" : "Code kopieren"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!code.trim() || saved}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? "✓ Gespeichert!" : "In Library speichern"}
            </button>
          </span>
        </div>

        {/* Main: Code links | Preview rechts */}
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1fr]">
          {/* Code-Editoren */}
          <div className="flex min-h-0 flex-col border-r border-slate-800">
            <div className="shrink-0 border-b border-slate-800 px-4 py-1.5">
              <span className="text-xs font-medium text-slate-400">
                {framework === "react-tailwind" ? "JSX" : "HTML"}
                <span className="ml-2 text-slate-600">· Code hier einfügen</span>
              </span>
            </div>
            <div className="min-h-0 flex-1">
              <Editor
                theme="vs-dark"
                language={codeLanguage(framework)}
                value={code}
                onChange={(value) => setCode(value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: "on",
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
            <div className="shrink-0 border-t border-slate-800 px-4 py-1.5">
              <span className="text-xs font-medium text-slate-400">CSS</span>
            </div>
            <div className="h-32 shrink-0">
              <Editor
                theme="vs-dark"
                language="css"
                value={css}
                onChange={(value) => setCss(value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  padding: { top: 8 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex min-h-0 flex-col">
            <div className="shrink-0 border-b border-slate-800 bg-slate-900/50 px-4 py-1.5">
              <span className="text-xs font-medium text-slate-400">Live Vorschau</span>
            </div>
            <iframe
              title="quick-preview"
              srcDoc={previewDoc}
              className="min-h-0 flex-1 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
