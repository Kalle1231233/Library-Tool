import type { Component, Variant } from "../types";

const applyTemplateVars = (input: string, values: Record<string, string | number | boolean>) =>
  Object.entries(values).reduce(
    (acc, [key, value]) =>
      acc.replaceAll(`{{${key}}}`, String(value)).replaceAll(`{${key}}`, String(value)),
    input,
  );

const escapeForInlineScript = (value: string) => value.replaceAll("</script>", "<\\/script>");

type ReactCodeMode =
  | { kind: "snippet"; jsx: string }
  | { kind: "component"; source: string; componentName: string | null };

const parseReactCodeMode = (input: string): ReactCodeMode => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { kind: "snippet", jsx: "<div />" };
  }

  if (trimmed.startsWith("<") || trimmed.startsWith("(")) {
    return { kind: "snippet", jsx: trimmed };
  }

  const exportDefaultFunctionMatch = trimmed.match(/export\s+default\s+function\s+([A-Za-z_$][\w$]*)/);
  const exportDefaultIdentifierMatch = trimmed.match(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;?/);

  let componentName: string | null =
    exportDefaultFunctionMatch?.[1] ?? exportDefaultIdentifierMatch?.[1] ?? null;

  const transformed = trimmed
    .replace(/^\s*import\s+.*$/gm, "")
    .replace(/export\s+default\s+function\s+/g, "function ")
    .replace(/^\s*export\s+default\s+([A-Za-z_$][\w$]*)\s*;?\s*$/gm, "")
    .replace(/^\s*export\s+\{[^}]+\}\s*;?\s*$/gm, "")
    .trim();

  if (!componentName) {
    componentName = transformed.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/)?.[1] ?? null;
  }

  if (!componentName) {
    componentName =
      transformed.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)\s*=>|function)/)?.[1] ?? null;
  }

  const looksLikeComponentSource =
    /function\s+[A-Za-z_$][\w$]*\s*\(/.test(transformed) ||
    /const\s+[A-Za-z_$][\w$]*\s*=\s*(?:\([^)]*\)\s*=>|function)/.test(transformed) ||
    /return\s*\(/.test(transformed);

  if (!looksLikeComponentSource) {
    return { kind: "snippet", jsx: trimmed };
  }

  return {
    kind: "component",
    source: transformed,
    componentName,
  };
};

export const getInitialPropValues = (component: Component, variant?: Variant) => {
  const values: Record<string, string | number | boolean> = {};
  component.props.forEach((prop) => {
    const variantValue = variant?.props[prop.name];
    values[prop.name] = variantValue ?? prop.defaultValue;
  });
  return values;
};

export const buildPreviewDocument = (
  component: Component,
  variant: Variant | undefined,
  propValues: Record<string, string | number | boolean>,
) => {
  if (!variant) {
    return "<html><body><p>No variant selected.</p></body></html>";
  }

  const css = variant.code.css ?? "";

  if (component.targetFramework === "html-css") {
    const html = applyTemplateVars(variant.code.html ?? "", propValues);
    return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${css}</style>
  </head>
  <body class="bg-slate-50 p-6">
    ${html}
  </body>
</html>`;
  }

  if (component.targetFramework === "vue-tailwind") {
    const template = escapeForInlineScript(applyTemplateVars(variant.code.html ?? "", propValues));
    return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <style>${css}</style>
  </head>
  <body class="bg-slate-50 p-6">
    <div id="app"></div>
    <script>
      const { createApp } = Vue;
      createApp({
        template: \`${template}\`,
      }).mount("#app");
    </script>
  </body>
</html>`;
  }

  const parsedReactCode = parseReactCodeMode(variant.code.jsx ?? "<div />");
  const props = JSON.stringify(propValues);
  const variableDeclarations = Object.keys(propValues)
    .map((key) => `const ${key} = props["${key}"];`)
    .join("\n");
  const componentSource =
    parsedReactCode.kind === "component" ? escapeForInlineScript(parsedReactCode.source) : "";
  const namedComponentResolver =
    parsedReactCode.kind === "component" && parsedReactCode.componentName
      ? `typeof ${parsedReactCode.componentName} !== "undefined" ? ${parsedReactCode.componentName} : null`
      : "null";
  const snippetCode =
    parsedReactCode.kind === "snippet" ? escapeForInlineScript(parsedReactCode.jsx) : "<div />";

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>${css}</style>
  </head>
  <body class="bg-slate-50 p-6">
    <div id="root"></div>
    <script type="text/babel">
      const props = ${props};
      ${variableDeclarations}
      ${componentSource}
      const resolvedComponent =
        ${namedComponentResolver} ||
        (typeof Button !== "undefined" ? Button : null) ||
        (typeof Component !== "undefined" ? Component : null);
      const element =
        resolvedComponent !== null
          ? React.createElement(resolvedComponent, props)
          : (${snippetCode});
      ReactDOM.createRoot(document.getElementById("root")).render(element);
    </script>
  </body>
</html>`;
};
