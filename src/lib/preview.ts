import type { Component, Variant } from "../types";

const applyTemplateVars = (input: string, values: Record<string, string | number | boolean>) =>
  Object.entries(values).reduce(
    (acc, [key, value]) =>
      acc.replaceAll(`{{${key}}}`, String(value)).replaceAll(`{${key}}`, String(value)),
    input,
  );

const escapeForInlineScript = (value: string) => value.replaceAll("</script>", "<\\/script>");

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

  const jsx = escapeForInlineScript(variant.code.jsx ?? "<div />");
  const props = JSON.stringify(propValues);
  const variableDeclarations = Object.keys(propValues)
    .map((key) => `const ${key} = props["${key}"];`)
    .join("\n");

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
      const element = (${jsx});
      ReactDOM.createRoot(document.getElementById("root")).render(element);
    </script>
  </body>
</html>`;
};
