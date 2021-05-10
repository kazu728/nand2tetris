import { buffer } from "./VmTranslater.ts";

const vmFilePath = Deno.args[0];
export const vmFile = vmFilePath.split("/")[2];

/**
 * vmファイルをパースして処理をIterableにする
 */
export const getUserInputCommand = (): string[] => {
  return new TextDecoder("utf-8")
    .decode(Deno.readFileSync(vmFilePath))
    .split("\n")
    .map((command) => command.replace("\r", "").trim());
};

/**
 * アセンブリコードをファイルに書き出す
 * @param bin
 * @returns
 */
export const writeToFile = (): void => {
  const asmFilePath: string = `${vmFilePath.replace(".vm", ".asm")}`;

  Deno.writeFileSync(asmFilePath, new TextEncoder().encode(buffer.join("\r")));
};
