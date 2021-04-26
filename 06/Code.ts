import { DestDictValue, CompDictValue, JumpDictValue, Dict } from "./Dict.d.ts";

/**
 * 渡されたdictとニーモニックに対応する機械語を返す
 * @param dict
 * @param mnemonic
 * @returns
 */
export function getBinByMnemonic<T extends Dict>(
  dict: T,
  mnemonic: keyof T
): T[keyof T] {
  return dict[mnemonic];
}

/**
 * A_COMMANDのバイナリコードを返す
 * @param address
 */
export function makeACommandBin(address: number): string {
  const aCommandPrefix = 0;
  return `${aCommandPrefix}${address.toString(2).padStart(15, "0")}`;
}

/**
 * C_COMMANDのバイナリ コードを返す
 * @param compBin
 * @param destBin
 * @param jumpBin
 * @returns
 */
export function makeCCommandBin(
  compBin: CompDictValue,
  destBin: DestDictValue,
  jumpBin: JumpDictValue
): string {
  const cCommandPrefix = "111";
  return `${cCommandPrefix}${compBin}${destBin}${jumpBin}`;
}
