#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";

const styleCacheDir = "public/stylecache";
const cssFilePath = path.join(styleCacheDir, "style.css");
const darkmodePath = path.join(styleCacheDir, "darkmode.css");
const jsonFilePath = path.join(styleCacheDir, "buffer.json");

async function initStyleCache() {
  try {
    // stylecache 디렉토리 생성
    await fs.mkdir(styleCacheDir, { recursive: true });
    console.log(`📂 Directory created: ${styleCacheDir}`);

    // style.css 파일 생성
    await fs.writeFile(cssFilePath, "", "utf-8");
    console.log(`📝 File created: ${cssFilePath}`);

    // darkmode.css 파일 생성
    await fs.writeFile(darkmodePath, "", "utf-8");
    console.log(`📝 File created: ${cssFilePath}`);

    // buffer.json 파일 생성
    await fs.writeFile(jsonFilePath, JSON.stringify({}, null, 2), "utf-8");
    console.log(`📝 File created: ${jsonFilePath}`);

    console.log("✅ Stylecache initialized successfully!");
  } catch (error) {
    console.error(`❌ Failed to initialize stylecache: ${error}`);
  }
}

initStyleCache();
