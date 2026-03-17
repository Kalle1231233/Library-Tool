export type TargetFramework = "react-tailwind" | "vue-tailwind" | "html-css";

export interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  targetFramework: TargetFramework;
  props: Prop[];
  variants: Variant[];
  guidelines: string[];
}

export interface Prop {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "enum";
  enumValues?: string[];
  defaultValue: string | number | boolean;
}

export interface Variant {
  id: string;
  name: string;
  props: Record<string, string | number | boolean>;
  code: {
    jsx?: string;
    html?: string;
    css?: string;
  };
  notes: string;
}
