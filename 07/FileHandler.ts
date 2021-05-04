import { buffer } from "./VmTranslater.ts";

const vmFile = Deno.args[0];

/**
 * vmファイルをパースして処理をIterableにする
 */
export const getUserInputCommand = (): string[] => {
  return new TextDecoder("utf-8")
    .decode(Deno.readFileSync(vmFile))
    .split("\n")
    .map((command) => command.replace("\r", "").trim());
};

/**
 * アセンブリコードをファイルに書き出す
 * @param bin
 * @returns
 */
export const writeToFile = (): void => {
  const vmFilePath: string = `${vmFile.replace(".vm", ".asm")}`;

  Deno.writeFileSync(vmFilePath, new TextEncoder().encode(buffer.join("\r")));
};
