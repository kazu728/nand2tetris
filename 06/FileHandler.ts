import { buffer } from "./Assembler.ts";

const asmFile = Deno.args[0];

/**
 * asmファイルをパースして処理をIterableにする
 */
export const getUserInputCommand = (): string[] => {
  return new TextDecoder("utf-8")
    .decode(Deno.readFileSync(asmFile))
    .split("\n")
    .map((command) => command.replace("\r", "").trim());
};

/**
 * バイナリをファイルに書き出す
 * @param bin
 * @returns
 */
export const writeToFile = (): void => {
  const hackFilePath: string = `${asmFile.replace(".asm", ".hack")}`;

  Deno.writeFileSync(hackFilePath, new TextEncoder().encode(buffer.join("\r")));
};
