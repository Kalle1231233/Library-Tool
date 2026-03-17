import type { Component } from "../types";

export const toJsonExport = (components: Component[]) => JSON.stringify(components, null, 2);

export const toMarkdownExport = (components: Component[]) => {
  const lines: string[] = ["# UI Component Library – Component Library Manager", ""];

  lines.push("## Design Tokens");
  lines.push("- Primary: #2563eb");
  lines.push("- Border Radius: 8px");
  lines.push("- Spacing: 4px | 8px | 16px | 24px | 32px");
  lines.push("");

  components.forEach((component) => {
    const propSummary = component.props
      .map((prop) => {
        if (prop.type === "enum") {
          return `${prop.name}=${prop.enumValues?.join("/") ?? ""}`;
        }
        return `${prop.name}=${prop.type}`;
      })
      .join(", ");

    lines.push(`## Component: ${component.name}`);
    lines.push(`Category: ${component.category}`);
    lines.push(`Framework: ${component.targetFramework}`);
    lines.push(`Props: ${propSummary || "-"}`);
    lines.push("");

    component.variants.forEach((variant) => {
      lines.push(`### Variant: ${variant.name}`);
      lines.push("```jsx");
      lines.push(variant.code.jsx || variant.code.html || "<!-- no code -->");
      lines.push("```");
      lines.push(`Notes: ${variant.notes || "-"}`);
      lines.push("");
    });

    if (component.guidelines.length > 0) {
      lines.push("Guidelines:");
      component.guidelines.forEach((guideline) => lines.push(`- ${guideline}`));
      lines.push("");
    }
  });

  return lines.join("\n");
};

export const toPromptTemplate = () => `Screenshot: [Bild anhängen]

UI Library: [ui-library.md anhängen]

Feature: [Ticket einfügen]

Implementiere das in React+Tailwind.
STRIKT an Library halten:
- Nur definierte Komponenten/Props nutzen
- Exakt gleiches Markup/CSS wie in Library
- Layout 1:1 zum Screenshot`;
