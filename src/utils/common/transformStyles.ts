import { MainInput } from "../../client";

export const transformStyles = (input: MainInput): Record<string, string> => {
  const { componentId, ...styles } = input;
  const id = componentId as string;

  if (!componentId) {
    throw new Error("componentId is required in the input object.");
  }

  const transformedStyles: Record<string, string> = {};

  Object.keys(styles).forEach((key) => {
    transformedStyles[key] = `${key}-${id.replaceAll("/", "-")}`;
  });

  return transformedStyles;
};
