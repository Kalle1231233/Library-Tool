import { useEffect, useMemo, useState } from "react";
import { buildPreviewDocument, getInitialPropValues } from "../lib/preview";
import { useLibraryStore } from "../store/libraryStore";
import type { Component, Prop } from "../types";

const renderControl = (
  prop: Prop,
  value: string | number | boolean,
  onChange: (nextValue: string | number | boolean) => void,
) => {
  if (prop.type === "boolean") {
    return (
      <label key={prop.id} className="flex items-center gap-2 rounded border border-slate-700 p-2 text-xs text-slate-200">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        {prop.name}
      </label>
    );
  }

  if (prop.type === "enum") {
    return (
      <label key={prop.id} className="flex flex-col gap-1 text-xs text-slate-300">
        {prop.name}
        <select
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
        >
          {(prop.enumValues ?? []).map((enumValue) => (
            <option key={enumValue} value={enumValue}>
              {enumValue}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (prop.type === "number") {
    return (
      <label key={prop.id} className="flex flex-col gap-1 text-xs text-slate-300">
        {prop.name}
        <input
          type="number"
          value={Number(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
        />
      </label>
    );
  }

  return (
    <label key={prop.id} className="flex flex-col gap-1 text-xs text-slate-300">
      {prop.name}
      <input
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
      />
    </label>
  );
};

interface PreviewPaneProps {
  component: Component;
}

export function PreviewPane({ component }: PreviewPaneProps) {
  const selectedVariantByComponentId = useLibraryStore((state) => state.selectedVariantByComponentId);
  const setSelectedVariant = useLibraryStore((state) => state.setSelectedVariant);

  const selectedVariantId = selectedVariantByComponentId[component.id] ?? component.variants[0]?.id;
  const selectedVariant = component.variants.find((variant) => variant.id === selectedVariantId) ?? component.variants[0];
  const [propValues, setPropValues] = useState<Record<string, string | number | boolean>>(
    getInitialPropValues(component, selectedVariant),
  );

  useEffect(() => {
    setPropValues(getInitialPropValues(component, selectedVariant));
  }, [component.id, selectedVariant?.id]);

  const srcDoc = useMemo(
    () => buildPreviewDocument(component, selectedVariant, propValues),
    [component, selectedVariant, propValues],
  );

  return (
    <section className="flex h-full flex-col gap-3 overflow-hidden border-l border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Live Preview</h3>
        <select
          value={selectedVariant?.id}
          onChange={(event) => setSelectedVariant(component.id, event.target.value)}
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
        >
          {component.variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {component.props.map((prop) =>
          renderControl(prop, propValues[prop.name] ?? prop.defaultValue, (nextValue) =>
            setPropValues((state) => ({ ...state, [prop.name]: nextValue })),
          ),
        )}
      </div>

      <iframe title="preview" srcDoc={srcDoc} className="min-h-0 flex-1 rounded-md border border-slate-700 bg-white" />
    </section>
  );
}
