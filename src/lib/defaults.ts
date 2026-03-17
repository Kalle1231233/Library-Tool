import type { Component, Prop, TargetFramework, Variant } from "../types";

const uid = () => crypto.randomUUID();

export const createEmptyProp = (): Prop => ({
  id: uid(),
  name: "propName",
  type: "string",
  defaultValue: "",
});

export const createEmptyVariant = (): Variant => ({
  id: uid(),
  name: "default",
  props: {},
  code: {
    jsx: `<button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">Click me</button>`,
    html: `<button class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">Click me</button>`,
    css: ``,
  },
  notes: "",
});

export const createComponent = (framework: TargetFramework): Component => ({
  id: uid(),
  name: "New Component",
  category: "general",
  description: "",
  targetFramework: framework,
  props: [createEmptyProp()],
  variants: [createEmptyVariant()],
  guidelines: [],
});

export const starterComponents = (): Component[] => [
  {
    id: uid(),
    name: "Button",
    category: "inputs",
    description: "CTA-Komponente für primäre und sekundäre Aktionen.",
    targetFramework: "react-tailwind",
    props: [
      {
        id: uid(),
        name: "variant",
        type: "enum",
        enumValues: ["primary", "secondary"],
        defaultValue: "primary",
      },
      {
        id: uid(),
        name: "size",
        type: "enum",
        enumValues: ["sm", "md", "lg"],
        defaultValue: "md",
      },
      {
        id: uid(),
        name: "disabled",
        type: "boolean",
        defaultValue: false,
      },
    ],
    variants: [
      {
        id: uid(),
        name: "Primary / md",
        props: {
          variant: "primary",
          size: "md",
          disabled: false,
        },
        code: {
          jsx: `<button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50" disabled={disabled}>
  Click me
</button>`,
          html: `<button class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
  Click me
</button>`,
          css: ``,
        },
        notes: "Main CTA. Maximal einmal pro View.",
      },
    ],
    guidelines: ["Nie mehr als einen Primary-CTA pro Screen einsetzen."],
  },
  {
    id: uid(),
    name: "Card",
    category: "layout",
    description: "Container für zusammenhängende Inhalte.",
    targetFramework: "react-tailwind",
    props: [
      {
        id: uid(),
        name: "title",
        type: "string",
        defaultValue: "Card title",
      },
    ],
    variants: [
      {
        id: uid(),
        name: "Standard",
        props: {
          title: "Card title",
        },
        code: {
          jsx: `<div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900">
  <h3 className="mb-4 text-lg font-semibold">{title}</h3>
  <p className="text-sm text-slate-700">Body content...</p>
</div>`,
          html: `<div class="rounded-xl border border-slate-200 bg-white p-6 text-slate-900">
  <h3 class="mb-4 text-lg font-semibold">{{title}}</h3>
  <p class="text-sm text-slate-700">Body content...</p>
</div>`,
          css: ``,
        },
        notes: "Standardkarte für KPI- oder Inhaltsblöcke.",
      },
    ],
    guidelines: ["Padding in Karten immer in 24px-Schritten halten."],
  },
];
