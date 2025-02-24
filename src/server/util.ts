import { writeFile } from "fs/promises";

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const saveFile = async (b64str: string) => {
  const base64Data = b64str.split(",");
  await writeFile("out.png", base64Data, "base64");
};
