import { writeClientCSS } from "../files/handleClientCSS";
import {
  BreakPointsType,
  ConfigType,
  JsonType,
  KeyframesType,
  MainInputType,
  StyleObjectItemType,
  StylesForProxyType,
} from "../../../types";
import { handleKeyframes, handleMediaQuery } from "../../syntax";
import { defaultBreakpoints } from "../../syntax/handler/handleBreakpoints";
import { handleComponentIdHash, handleHash } from "../files/handleHash";
import { writeCSS } from "../files/handleServerCSS";

import { updateStyles } from "./updateStyles";

export const generateStyles = (
  input: MainInputType,
  inputScreenMode: "default" | "dark",
  isClient: "server" | "client",
  config?: ConfigType
) => {
  let inputBreakpoints: BreakPointsType = defaultBreakpoints;
  let inputKeyframes: KeyframesType = {};

  if (config) {
    const { breakpoints, keyframes } = config;

    inputBreakpoints = breakpoints || defaultBreakpoints;
    inputKeyframes = keyframes || {};
  }

  const componentHash = handleHash(input.componentId as string).slice(0, 8);

  const styleData = Object.entries(input).filter(
    ([key]) => key !== "componentId"
  );

  let result: JsonType[] = [];

  const stylesForProxy: StylesForProxyType = {};
  let keyframesResult: JsonType[] = [];

  // 키프레임 애니메이션 처리
  if (inputKeyframes) {
    keyframesResult = handleKeyframes(inputKeyframes);
  }

  // 애니메이션 처리
  for (let item of styleData) {
    const itemName = item[0];
    const itemStyle = item[1] as unknown as StyleObjectItemType;
    const itemClassName =
      inputScreenMode === "default"
        ? `${itemName}-${componentHash}`
        : `dark .${itemName}-${componentHash}`;

    stylesForProxy[itemName] = "";

    if (itemName in inputBreakpoints) {
      // 미디어쿼리
      const mqResult = handleMediaQuery(
        inputBreakpoints[itemName],
        itemStyle,
        itemClassName
      );
      result.push(mqResult);
    } else {
      // 그 외
      result = [...updateStyles(itemStyle, itemClassName), ...result];
    }
    stylesForProxy[itemName] = itemClassName;
  }

  const styleResult = [...keyframesResult, ...result];
  const cIdHash = handleComponentIdHash(input.componentId as string);
  if (isClient === "server") {
    // writeCSS(styleResult, cIdHash);
  } else if (isClient === "client") {
    writeClientCSS(styleResult, cIdHash);
  }

  return new Proxy(stylesForProxy, {
    get(target, prop) {
      if (typeof prop === "string" && prop in target) {
        return target[prop];
      } else {
        console.warn(`Property "${String(prop)}" does not exist on styles.`);
        return undefined;
      }
    },
  });
};
