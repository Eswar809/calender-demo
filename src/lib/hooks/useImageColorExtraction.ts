"use client";

import { useState, useEffect } from "react";
import type { DynamicTheme, MonthData } from "@/lib/types";
import { mixLight, rgbToHex } from "@/lib/utils";
import { generateM3Palette } from "@/lib/m3Theme";

export interface ImageColorExtractionResult {
  dynamicTheme: DynamicTheme;
  imageLoaded: boolean;
}

export function useImageColorExtraction(currentTheme: MonthData): ImageColorExtractionResult {
  const fallbackPalette = generateM3Palette(currentTheme.color);

  const [dynamicTheme, setDynamicTheme] = useState<DynamicTheme>({
    color: currentTheme.color,
    lightColor: currentTheme.lightColor,
    palette: fallbackPalette,
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);

    const img = new Image();
    // Only use crossOrigin for external URLs to avoid Tainted Canvas errors on local dev server
    if (currentTheme.img.startsWith("http")) {
      img.crossOrigin = "Anonymous";
    }
    img.src = currentTheme.img;

    img.onload = () => {
      setImageLoaded(true);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        const p = generateM3Palette(currentTheme.color);
        setDynamicTheme({ color: currentTheme.color, lightColor: currentTheme.lightColor, palette: p });
        return;
      }

      // Resize canvas heavily for faster processing
      const maxDim = 150;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = Math.max(1, img.width * scale);
      canvas.height = Math.max(1, img.height * scale);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let sR = 0, sG = 0, sB = 0, sWeight = 0;

        for (let i = 0; i < data.length; i += 4) {
          const tr = data[i], tg = data[i + 1], tb = data[i + 2], alpha = data[i + 3];
          if (alpha < 200) continue;

          const max = Math.max(tr, tg, tb);
          const min = Math.min(tr, tg, tb);
          const saturation = max - min;

          // Ignore completely washed out (white) or Pitch black areas
          if (max > 40 && min < 240) {
            // Weight significantly heavily by saturation (cubic) to aggressively hunt for the most vibrant, sharpest colored pixels
            // while ignoring gray noise
            if (saturation > 10) {
              const weight = Math.pow(saturation, 3);
              sR += tr * weight;
              sG += tg * weight;
              sB += tb * weight;
              sWeight += weight;
            }
          }
        }

        if (sWeight > 0) {
          const finalR = Math.floor(sR / sWeight);
          const finalG = Math.floor(sG / sWeight);
          const finalB = Math.floor(sB / sWeight);

          const extractedColor = rgbToHex(finalR, finalG, finalB);
          const extractedLightColor = rgbToHex(mixLight(finalR), mixLight(finalG), mixLight(finalB));
          const palette = generateM3Palette(extractedColor);

          setDynamicTheme({ color: extractedColor, lightColor: extractedLightColor, palette });
        } else {
          // Fallback if no vibrant colors were found
          const p = generateM3Palette(currentTheme.color);
          setDynamicTheme({ color: currentTheme.color, lightColor: currentTheme.lightColor, palette: p });
        }
      } catch {
        const p = generateM3Palette(currentTheme.color);
        setDynamicTheme({ color: currentTheme.color, lightColor: currentTheme.lightColor, palette: p });
      }
    };

    img.onerror = () => {
      setImageLoaded(true);
      const p = generateM3Palette(currentTheme.color);
      setDynamicTheme({ color: currentTheme.color, lightColor: currentTheme.lightColor, palette: p });
    };
  }, [currentTheme.img, currentTheme.color, currentTheme.lightColor]);

  return { dynamicTheme, imageLoaded };
}
