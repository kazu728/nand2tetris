import { DestDict, CompDict, JumpDict } from "./Dict.ts";

export type DestDictKey = keyof typeof DestDict;
export type DestDictValue = typeof DestDict[keyof typeof DestDict];
export type CompDictKey = keyof typeof CompDict;
export type CompDictValue = typeof CompDict[keyof typeof CompDict];
export type JumpDictKey = keyof typeof JumpDict;
export type JumpDictValue = typeof JumpDict[keyof typeof JumpDict];

export type Mnemonic = DestDictKey | CompDictKey | JumpDictKey;
export type MachineLanguage = DestDictValue | CompDictValue | JumpDictValue;

export type Dict = typeof DestDict | typeof CompDict | typeof JumpDict;
