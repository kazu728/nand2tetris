import { dict, Command, CommandType } from "./Dict.ts";

/**
 * 次のコマンドが存在するか
 * @returns
 */
export const hasMoreCommands = (): boolean => true;

/**
 * 入力から次のコマンドを読み込み、それを現コマンドにする
 * @returns
 */
export const advance = (): string => "";

/**
 * 現コマンドのコマンド種別を返す
 * @returns
 */
export const getCommandType = (command: Command): CommandType => dict[command];

/**
 * 現コマンドの最初の引数が返される
 * @returns
 */
export const arg1 = (): string => "";

/**
 * 現コマンドの2番目のの引数が返される
 * @returns
 */
export const arg2 = (): number => 0;
