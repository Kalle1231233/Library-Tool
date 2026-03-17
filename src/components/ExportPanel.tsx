import { toJsonExport, toMarkdownExport, toPromptTemplate } from "../lib/exporters";
import { useLibraryStore } from "../store/libraryStore";

const download = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export function ExportPanel() {
  const components = useLibraryStore((state) => state.components);

  return (
    <section className="flex items-center gap-2 border-t border-slate-800 bg-slate-900 p-3">
      <button
        type="button"
        onClick={() => download("ui-library.json", toJsonExport(components), "application/json")}
        className="rounded bg-slate-800 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700"
      >
        JSON Export
      </button>

      <button
        type="button"
        onClick={() => download("ui-library.md", toMarkdownExport(components), "text/markdown")}
        className="rounded bg-slate-800 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700"
      >
        Markdown Export
      </button>

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(toPromptTemplate());
        }}
        className="rounded bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-500"
      >
        Prompt kopieren
      </button>
    </section>
  );
}
