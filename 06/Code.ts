import { DestDict, CompDict, JumpDict } from "./Dict.ts";

/**
 * destニーモニックのバイナリコードを返す
 * @param mnemonic
 * @returns
 */
export function dest(mnemonic: keyof typeof DestDict): DestDict {
  return DestDict[mnemonic];
}

/**
 * compニーモニックのバイナリコードを返す
 * @param mnemonic
 * @returns
 */
export function comp(mnemonic: keyof typeof CompDict): CompDict {
  return CompDict[mnemonic];
}

/**
 * jumpニーモニックのバイナリコードを返す
 * @param mnemonic
 * @returns
 */
export function jump(mnemonic: keyof typeof JumpDict): JumpDict {
  return JumpDict[mnemonic];
}

/**
 * A_COMMANDのバイナリコードを返す
 * @param bin
 */
export function createACommandBin(bin: string): string {
  const aCommandPrefix = 0;
  return `${aCommandPrefix}${Number(bin).toString(2).padStart(15, "0")}\r`;
}
