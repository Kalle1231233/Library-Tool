import { useEffect, useMemo, useState } from "react";
import { ComponentEditor } from "./components/ComponentEditor";
import { ExportPanel } from "./components/ExportPanel";
import { LibrarySidebar } from "./components/LibrarySidebar";
import { PreviewPane } from "./components/PreviewPane";
import { QuickPreviewDialog } from "./components/QuickPreviewDialog";
import { useLibraryStore } from "./store/libraryStore";

function App() {
  const components = useLibraryStore((state) => state.components);
  const selectedComponentId = useLibraryStore((state) => state.selectedComponentId);
  const selectComponent = useLibraryStore((state) => state.selectComponent);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);

  const component = useMemo(() => {
    const selected = components.find((item) => item.id === selectedComponentId);
    return selected ?? components[0];
  }, [components, selectedComponentId]);

  useEffect(() => {
    if (!selectedComponentId && component) {
      selectComponent(component.id);
    }
  }, [component, selectedComponentId, selectComponent]);

  return (
    <>
      <main className="grid h-screen grid-cols-[280px_1fr_420px] bg-slate-950 text-slate-100">
        <LibrarySidebar onOpenQuickPreview={() => setQuickPreviewOpen(true)} />
        <div className="grid grid-rows-[1fr_auto]">
          {component ? (
            <>
              <ComponentEditor component={component} />
              <ExportPanel />
            </>
          ) : (
            <section className="flex items-center justify-center">
              <p className="text-slate-400">Noch keine Komponenten vorhanden.</p>
            </section>
          )}
        </div>
        {component ? <PreviewPane component={component} /> : <div className="border-l border-slate-800 bg-slate-900" />}
      </main>

      {quickPreviewOpen && <QuickPreviewDialog onClose={() => setQuickPreviewOpen(false)} />}
    </>
  );
}

export default App;
