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
    description: "Vielseitige Button-Komponente mit fünf Varianten.",
    targetFramework: "react-tailwind",
    props: [
      {
        id: uid(),
        name: "variant",
        type: "enum",
        enumValues: ["default", "secondary", "outline", "ghost", "destructive"],
        defaultValue: "default",
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
        name: "Default",
        props: { variant: "default", disabled: false },
        code: {
          jsx: `<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800" disabled={disabled}>
  Button
</button>`,
          html: `<button class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-800">
  Button
</button>`,
          css: ``,
        },
        notes: "Primäre Aktion. Maximal einmal pro View verwenden.",
      },
      {
        id: uid(),
        name: "Secondary",
        props: { variant: "secondary", disabled: false },
        code: {
          jsx: `<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-200" disabled={disabled}>
  Button
</button>`,
          html: `<button class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-200">
  Button
</button>`,
          css: ``,
        },
        notes: "Sekundäre Aktion neben einem Default-Button.",
      },
      {
        id: uid(),
        name: "Outline",
        props: { variant: "outline", disabled: false },
        code: {
          jsx: `<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white text-slate-900 hover:bg-slate-100" disabled={disabled}>
  Button
</button>`,
          html: `<button class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
  Button
</button>`,
          css: ``,
        },
        notes: "Umrandeter Button für weniger prominente Aktionen.",
      },
      {
        id: uid(),
        name: "Ghost",
        props: { variant: "ghost", disabled: false },
        code: {
          jsx: `<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-transparent text-slate-900 hover:bg-slate-100" disabled={disabled}>
  Button
</button>`,
          html: `<button class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-transparent text-slate-900 hover:bg-slate-100">
  Button
</button>`,
          css: ``,
        },
        notes: "Minimal-Variante für Toolbar- oder Navigationsaktionen.",
      },
      {
        id: uid(),
        name: "Destructive",
        props: { variant: "destructive", disabled: false },
        code: {
          jsx: `<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700" disabled={disabled}>
  Button
</button>`,
          html: `<button class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700">
  Button
</button>`,
          css: ``,
        },
        notes: "Für irreversible oder gefährliche Aktionen (z. B. Löschen).",
      },
    ],
    guidelines: [
      "Nie mehr als einen Default-Button pro Screen einsetzen.",
      "Destructive-Variante nur nach expliziter Nutzerbestätigung auslösen.",
    ],
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
