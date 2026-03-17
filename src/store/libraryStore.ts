import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createComponent, createEmptyProp, createEmptyVariant, starterComponents } from "../lib/defaults";
import type { Component, Prop, TargetFramework, Variant } from "../types";

type Updater<T> = (value: T) => T;

interface LibraryState {
  components: Component[];
  selectedComponentId: string | null;
  selectedVariantByComponentId: Record<string, string>;
  selectComponent: (componentId: string) => void;
  addComponent: (framework: TargetFramework) => void;
  addRawComponent: (component: Component) => void;
  updateComponent: (componentId: string, updater: Updater<Component>) => void;
  removeComponent: (componentId: string) => void;
  addProp: (componentId: string) => void;
  updateProp: (componentId: string, propId: string, updater: Updater<Prop>) => void;
  removeProp: (componentId: string, propId: string) => void;
  addVariant: (componentId: string) => void;
  updateVariant: (componentId: string, variantId: string, updater: Updater<Variant>) => void;
  removeVariant: (componentId: string, variantId: string) => void;
  setSelectedVariant: (componentId: string, variantId: string) => void;
  addGuideline: (componentId: string, guideline: string) => void;
  removeGuideline: (componentId: string, index: number) => void;
}

const updateComponentById = (components: Component[], componentId: string, updater: Updater<Component>) =>
  components.map((component) => (component.id === componentId ? updater(component) : component));

const findFirst = (components: Component[]) => components[0]?.id ?? null;

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      components: starterComponents(),
      selectedComponentId: null,
      selectedVariantByComponentId: {},
      selectComponent: (componentId) => {
        set({ selectedComponentId: componentId });
      },
      addComponent: (framework) =>
        set((state) => {
          const component = createComponent(framework);
          return {
            components: [...state.components, component],
            selectedComponentId: component.id,
            selectedVariantByComponentId: {
              ...state.selectedVariantByComponentId,
              [component.id]: component.variants[0].id,
            },
          };
        }),
      addRawComponent: (component) =>
        set((state) => ({
          components: [...state.components, component],
          selectedComponentId: component.id,
          selectedVariantByComponentId: {
            ...state.selectedVariantByComponentId,
            ...(component.variants[0] ? { [component.id]: component.variants[0].id } : {}),
          },
        })),
      updateComponent: (componentId, updater) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, updater),
        })),
      removeComponent: (componentId) =>
        set((state) => {
          const components = state.components.filter((component) => component.id !== componentId);
          const selectedComponentId =
            state.selectedComponentId === componentId ? findFirst(components) : state.selectedComponentId;
          const { [componentId]: _, ...selectedVariantByComponentId } = state.selectedVariantByComponentId;
          return { components, selectedComponentId, selectedVariantByComponentId };
        }),
      addProp: (componentId) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, (component) => ({
            ...component,
            props: [...component.props, createEmptyProp()],
          })),
        })),
      updateProp: (componentId, propId, updater) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, (component) => ({
            ...component,
            props: component.props.map((prop) => (prop.id === propId ? updater(prop) : prop)),
          })),
        })),
      removeProp: (componentId, propId) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, (component) => ({
            ...component,
            props: component.props.filter((prop) => prop.id !== propId),
          })),
        })),
      addVariant: (componentId) =>
        set((state) => {
          const variant = createEmptyVariant();
          return {
            components: updateComponentById(state.components, componentId, (component) => ({
              ...component,
              variants: [...component.variants, variant],
            })),
            selectedVariantByComponentId: {
              ...state.selectedVariantByComponentId,
              [componentId]: variant.id,
            },
          };
        }),
      updateVariant: (componentId, variantId, updater) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, (component) => ({
            ...component,
            variants: component.variants.map((variant) => (variant.id === variantId ? updater(variant) : variant)),
          })),
        })),
      removeVariant: (componentId, variantId) =>
        set((state) => {
          const component = state.components.find((item) => item.id === componentId);
          if (!component) {
            return state;
          }
          const nextVariants = component.variants.filter((variant) => variant.id !== variantId);
          const fallbackVariantId = nextVariants[0]?.id;
          return {
            components: updateComponentById(state.components, componentId, (item) => ({
              ...item,
              variants: nextVariants,
            })),
            selectedVariantByComponentId: fallbackVariantId
              ? {
                  ...state.selectedVariantByComponentId,
                  [componentId]: fallbackVariantId,
                }
              : state.selectedVariantByComponentId,
          };
        }),
      setSelectedVariant: (componentId, variantId) =>
        set((state) => ({
          selectedVariantByComponentId: {
            ...state.selectedVariantByComponentId,
            [componentId]: variantId,
          },
        })),
      addGuideline: (componentId, guideline) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, (component) => ({
            ...component,
            guidelines: [...component.guidelines, guideline],
          })),
        })),
      removeGuideline: (componentId, index) =>
        set((state) => ({
          components: updateComponentById(state.components, componentId, (component) => ({
            ...component,
            guidelines: component.guidelines.filter((_, itemIndex) => itemIndex !== index),
          })),
        })),
    }),
    {
      name: "clm-library-storage-v1",
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        if (!state.selectedComponentId && state.components.length > 0) {
          state.selectedComponentId = state.components[0].id;
        }
        state.components.forEach((component) => {
          if (!state.selectedVariantByComponentId[component.id] && component.variants[0]) {
            state.selectedVariantByComponentId[component.id] = component.variants[0].id;
          }
        });
      },
    },
  ),
);
