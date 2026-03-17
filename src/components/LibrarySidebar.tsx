import { useMemo, useState } from "react";
import { useLibraryStore } from "../store/libraryStore";
import type { TargetFramework } from "../types";

const frameworkOptions: TargetFramework[] = ["react-tailwind", "vue-tailwind", "html-css"];

interface LibrarySidebarProps {
  onOpenQuickPreview: () => void;
}

export function LibrarySidebar({ onOpenQuickPreview }: LibrarySidebarProps) {
  const components = useLibraryStore((state) => state.components);
  const selectedComponentId = useLibraryStore((state) => state.selectedComponentId);
  const selectComponent = useLibraryStore((state) => state.selectComponent);
  const addComponent = useLibraryStore((state) => state.addComponent);
  const removeComponent = useLibraryStore((state) => state.removeComponent);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return components;
    }
    return components.filter((component) =>
      `${component.name} ${component.category} ${component.description}`.toLowerCase().includes(query),
    );
  }, [components, search]);

  return (
    <aside className="flex h-full flex-col gap-3 border-r border-slate-800 bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Library</h2>
          <p className="text-xs text-slate-400">Komponenten suchen, anlegen und verwalten.</p>
        </div>
        <button
          type="button"
          onClick={onOpenQuickPreview}
          title="Code einfügen, Vorschau ansehen und als Komponente speichern"
          className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
        >
          + Einfügen
        </button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Suche nach Name/Kategorie..."
        className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
      />

      <div className="grid grid-cols-1 gap-2">
        {frameworkOptions.map((framework) => (
          <button
            key={framework}
            type="button"
            onClick={() => addComponent(framework)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-left text-xs text-slate-200 hover:border-blue-500 hover:text-white"
          >
            + {framework}
          </button>
        ))}
      </div>

      <ul className="flex-1 space-y-2 overflow-auto pr-1">
        {filtered.map((component) => {
          const isActive = component.id === selectedComponentId;
          return (
            <li key={component.id}>
              <button
                type="button"
                onClick={() => selectComponent(component.id)}
                className={`w-full rounded-md border px-3 py-2 text-left ${
                  isActive
                    ? "border-blue-500 bg-blue-500/20 text-blue-100"
                    : "border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{component.name}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                    {component.category}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">{component.targetFramework}</p>
              </button>
              <button
                type="button"
                onClick={() => removeComponent(component.id)}
                className="mt-1 text-xs text-rose-300 hover:text-rose-200"
              >
                Entfernen
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
