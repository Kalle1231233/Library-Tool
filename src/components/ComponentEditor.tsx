import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useLibraryStore } from "../store/libraryStore";
import type { Component, Prop, Variant } from "../types";

const frameworks = ["react-tailwind", "vue-tailwind", "html-css"] as const;

const parseByType = (value: string, type: Prop["type"]): string | number | boolean => {
  if (type === "boolean") {
    return value === "true";
  }
  if (type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return value;
};

const formatDefaultValue = (prop: Prop) => String(prop.defaultValue);

const serializeVariantProps = (variant: Variant) => JSON.stringify(variant.props, null, 2);

const parseVariantProps = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, string | number | boolean>;
    }
  } catch {
    // kept intentionally empty to keep editor UX smooth on invalid JSON
  }
  return null;
};

const TabButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-md px-3 py-1.5 text-sm ${
      isActive ? "bg-blue-500/30 text-blue-100" : "bg-slate-800 text-slate-300 hover:text-white"
    }`}
  >
    {children}
  </button>
);

interface ComponentEditorProps {
  component: Component;
}

export function ComponentEditor({ component }: ComponentEditorProps) {
  const [activeTab, setActiveTab] = useState<"meta" | "props" | "variants" | "guidelines">("meta");
  const [newGuideline, setNewGuideline] = useState("");
  const selectedVariantByComponentId = useLibraryStore((state) => state.selectedVariantByComponentId);
  const setSelectedVariant = useLibraryStore((state) => state.setSelectedVariant);
  const updateComponent = useLibraryStore((state) => state.updateComponent);
  const addProp = useLibraryStore((state) => state.addProp);
  const updateProp = useLibraryStore((state) => state.updateProp);
  const removeProp = useLibraryStore((state) => state.removeProp);
  const addVariant = useLibraryStore((state) => state.addVariant);
  const updateVariant = useLibraryStore((state) => state.updateVariant);
  const removeVariant = useLibraryStore((state) => state.removeVariant);
  const addGuideline = useLibraryStore((state) => state.addGuideline);
  const removeGuideline = useLibraryStore((state) => state.removeGuideline);

  const selectedVariantId = selectedVariantByComponentId[component.id] ?? component.variants[0]?.id;
  const selectedVariant = component.variants.find((item) => item.id === selectedVariantId) ?? component.variants[0];
  const [variantPropsText, setVariantPropsText] = useState(
    selectedVariant ? serializeVariantProps(selectedVariant) : "{}",
  );

  useEffect(() => {
    setVariantPropsText(selectedVariant ? serializeVariantProps(selectedVariant) : "{}");
  }, [selectedVariant?.id]);

  return (
    <section className="flex h-full flex-col gap-4 overflow-auto p-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{component.name}</h2>
          <p className="text-sm text-slate-400">{component.description || "Keine Beschreibung hinterlegt."}</p>
        </div>
        <div className="flex gap-2">
          <TabButton isActive={activeTab === "meta"} onClick={() => setActiveTab("meta")}>
            Meta
          </TabButton>
          <TabButton isActive={activeTab === "props"} onClick={() => setActiveTab("props")}>
            Props
          </TabButton>
          <TabButton isActive={activeTab === "variants"} onClick={() => setActiveTab("variants")}>
            Variants
          </TabButton>
          <TabButton isActive={activeTab === "guidelines"} onClick={() => setActiveTab("guidelines")}>
            Guidelines
          </TabButton>
        </div>
      </header>

      {activeTab === "meta" && (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Name
            <input
              value={component.name}
              onChange={(event) =>
                updateComponent(component.id, (item) => ({ ...item, name: event.target.value || "Unnamed" }))
              }
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Kategorie
            <input
              value={component.category}
              onChange={(event) =>
                updateComponent(component.id, (item) => ({ ...item, category: event.target.value || "general" }))
              }
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Beschreibung
            <textarea
              value={component.description}
              onChange={(event) => updateComponent(component.id, (item) => ({ ...item, description: event.target.value }))}
              rows={3}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Ziel-Framework
            <select
              value={component.targetFramework}
              onChange={(event) =>
                updateComponent(component.id, (item) => ({
                  ...item,
                  targetFramework: event.target.value as Component["targetFramework"],
                }))
              }
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-blue-500"
            >
              {frameworks.map((framework) => (
                <option key={framework} value={framework}>
                  {framework}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {activeTab === "props" && (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Props</h3>
            <button type="button" onClick={() => addProp(component.id)} className="text-sm text-blue-300 hover:text-blue-100">
              + Prop
            </button>
          </div>
          {component.props.map((prop) => (
            <div key={prop.id} className="grid grid-cols-12 gap-2 rounded-md border border-slate-700 p-2">
              <input
                value={prop.name}
                onChange={(event) => updateProp(component.id, prop.id, (item) => ({ ...item, name: event.target.value }))}
                className="col-span-3 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                placeholder="name"
              />
              <select
                value={prop.type}
                onChange={(event) =>
                  updateProp(component.id, prop.id, (item) => ({
                    ...item,
                    type: event.target.value as Prop["type"],
                  }))
                }
                className="col-span-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
                <option value="enum">enum</option>
              </select>
              <input
                value={formatDefaultValue(prop)}
                onChange={(event) =>
                  updateProp(component.id, prop.id, (item) => ({
                    ...item,
                    defaultValue: parseByType(event.target.value, item.type),
                  }))
                }
                className="col-span-3 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                placeholder="default"
              />
              <input
                value={prop.enumValues?.join(", ") ?? ""}
                onChange={(event) =>
                  updateProp(component.id, prop.id, (item) => ({
                    ...item,
                    enumValues: event.target.value
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean),
                  }))
                }
                className="col-span-3 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                placeholder="enum: a, b, c"
              />
              <button
                type="button"
                onClick={() => removeProp(component.id, prop.id)}
                className="col-span-1 rounded-md border border-rose-500/40 text-xs text-rose-300 hover:bg-rose-500/10"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "variants" && (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Variants</h3>
            <button
              type="button"
              onClick={() => addVariant(component.id)}
              className="text-sm text-blue-300 hover:text-blue-100"
            >
              + Variant
            </button>
          </div>

          <select
            value={selectedVariant?.id}
            onChange={(event) => setSelectedVariant(component.id, event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            {component.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name}
              </option>
            ))}
          </select>

          {selectedVariant ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-slate-300">
                  Variant-Name
                  <input
                    value={selectedVariant.name}
                    onChange={(event) =>
                      updateVariant(component.id, selectedVariant.id, (item) => ({ ...item, name: event.target.value }))
                    }
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeVariant(component.id, selectedVariant.id)}
                  className="self-end justify-self-end rounded-md border border-rose-500/40 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                >
                  Variante entfernen
                </button>
              </div>

              <label className="flex flex-col gap-1 text-xs text-slate-300">
                Notes
                <textarea
                  rows={2}
                  value={selectedVariant.notes}
                  onChange={(event) =>
                    updateVariant(component.id, selectedVariant.id, (item) => ({ ...item, notes: event.target.value }))
                  }
                  className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-slate-300">
                Variant Props (JSON)
                <textarea
                  rows={4}
                  value={variantPropsText}
                  onChange={(event) => {
                    const text = event.target.value;
                    setVariantPropsText(text);
                    const parsed = parseVariantProps(text);
                    if (parsed) {
                      updateVariant(component.id, selectedVariant.id, (item) => ({ ...item, props: parsed }));
                    }
                  }}
                  className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-xs text-slate-100"
                />
              </label>

              <div className="space-y-2">
                <p className="text-xs text-slate-300">Code (JSX/HTML/CSS)</p>
                {component.targetFramework === "react-tailwind" ? (
                  <p className="text-[11px] text-slate-400">
                    Du kannst hier kompletten React-Code einfügen (inkl. <code>import</code> und{" "}
                    <code>export default function</code>).
                  </p>
                ) : null}
                <div className="h-48 overflow-hidden rounded-md border border-slate-700">
                  <Editor
                    theme="vs-dark"
                    language={component.targetFramework === "react-tailwind" ? "javascript" : "html"}
                    value={selectedVariant.code.jsx ?? selectedVariant.code.html ?? ""}
                    onChange={(value) =>
                      updateVariant(component.id, selectedVariant.id, (item) => ({
                        ...item,
                        code:
                          component.targetFramework === "react-tailwind"
                            ? { ...item.code, jsx: value ?? "" }
                            : { ...item.code, html: value ?? "" },
                      }))
                    }
                    options={{ minimap: { enabled: false }, fontSize: 13 }}
                  />
                </div>
                <div className="h-28 overflow-hidden rounded-md border border-slate-700">
                  <Editor
                    theme="vs-dark"
                    language="css"
                    value={selectedVariant.code.css ?? ""}
                    onChange={(value) =>
                      updateVariant(component.id, selectedVariant.id, (item) => ({
                        ...item,
                        code: { ...item.code, css: value ?? "" },
                      }))
                    }
                    options={{ minimap: { enabled: false }, fontSize: 12 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Noch keine Variante vorhanden.</p>
          )}
        </div>
      )}

      {activeTab === "guidelines" && (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-200">Guidelines</h3>
          <div className="flex gap-2">
            <input
              value={newGuideline}
              onChange={(event) => setNewGuideline(event.target.value)}
              placeholder="Neue Guideline hinzufügen..."
              className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
            <button
              type="button"
              onClick={() => {
                if (!newGuideline.trim()) {
                  return;
                }
                addGuideline(component.id, newGuideline.trim());
                setNewGuideline("");
              }}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {component.guidelines.map((guideline, index) => (
              <li key={`${guideline}-${index}`} className="flex items-start justify-between gap-3 rounded border border-slate-700 p-2">
                <span className="text-sm text-slate-200">{guideline}</span>
                <button
                  type="button"
                  onClick={() => removeGuideline(component.id, index)}
                  className="text-xs text-rose-300 hover:text-rose-200"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
