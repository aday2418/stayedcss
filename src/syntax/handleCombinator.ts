import { StyleType } from "../types";
import { isRequiredUnits } from "./checkUnits";

export const handleCombinators = (
  elementKey: string,
  inputStyle: StyleType,
  className: string
) => {
  let resultString = `${className} ${elementKey} { `;

  for (const key in inputStyle) {
    const styleKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    const styleItem = inputStyle[key];
    if (typeof styleItem === "number") {
      resultString += `${styleKey}: ${styleItem}${
        isRequiredUnits(styleKey) ? "px" : ""
      }; `;
    } else {
      resultString += `${styleKey}: ${styleItem}; `;
    }
  }

  resultString += "}";

  return { className: `${className} ${elementKey}`, style: resultString };
};
