import { buffer } from "./VmTranslater.ts";
import {
  ArithmeticCommand,
  Segment,
  PushOrPop,
  ArithmeticCalculationKey,
  ArithmeticCalculation,
  ArithmeticComparisonKey,
  ArithmeticComparison,
  ArithmeticDenial,
  VirtualSegment,
  VirtualSegmentKey,
  StaticSegment,
  StaticSegmentKey,
} from "./Dict.ts";

import { vmFile } from "./FileHandler.ts";

let labelNum = 0;

/**
 * 与えられた算術コードをアセンブリコードに変換し、それを書き込む
 * @param command
 */
export const writeArithmetic = (command: ArithmeticCommand): void => {
  switch (command) {
    case "add":
    case "sub":
    case "and":
    case "or":
      generateAsm(pushCalculatingCommand, command);
      break;

    case "eq":
    case "gt":
    case "lt":
      generateAsm(pushComparisonCommand, command);
      break;

    case "neg":
    case "not":
      const commands = ["@SP", "A=M-1", ArithmeticDenial[command]];
      commands.forEach((command) => buffer.push(command));

      break;

    default:
      const _never: never = command;
      throw new Error(`Invalid arg ${command}`);
  }
};

/**
 * C_PUSHまたはC_POPコマンドをアセンブリコードに変換し、それを書き込む
 * @param command
 * @param segment
 * @param index
 */
export const writePushPop = (
  command: PushOrPop,
  segment: Segment,
  index: number
): void => {
  switch (segment) {
    case "constant":
      const constantCommands = [`@${index}`, "D=A"];
      constantCommands.forEach((command) => buffer.push(command));
      pushFromRegister();
      break;
    case "argument":
    case "local":
    case "this":
    case "that":
      command === "pop"
        ? popFromVirtualSegment(segment, index)
        : pushFromVirtualSegment(segment, index);
      break;

    case "temp":
    case "pointer":
      command === "pop"
        ? popFromStaticSegment(segment, index)
        : pushFromStaticSegment(segment, index);

      break;

    case "static":
      if (command === "pop") {
        popToRegister();

        const commands = ["D=M", `@${vmFile}.${index}`, "M=D"];
        commands.forEach((command) => buffer.push(command));
      } else {
        const command = [`@${vmFile}.${index}`, "D=M"];
        command.forEach((command) => buffer.push(command));
        pushFromRegister();
      }
      break;

    default:
      break;
  }
};

/**
 * スタックからpopし、レジスタへと値の格納を行う
 */
const popToRegister = (): void =>
  ["@SP", "M=M-1", "A=M"].forEach((c) => buffer.push(c));

/**
 * スタックをpopし、渡された関数を実行、実行後の結果をスタックにpushするアセンブリをbufferにpushする
 * @param f
 * @param command
 */
const generateAsm = <T>(f: (arg: T) => void, command: T): void => {
  popToRegister();
  buffer.push("D=M");
  popToRegister();

  f(command);

  pushFromRegister();
};

/**
 * 算術演算、論理演算のアセンブリをbufferにpushする
 * @param command
 */
const pushCalculatingCommand = (command: ArithmeticCalculationKey): number =>
  buffer.push(ArithmeticCalculation[command]);

/**
 * 比較演算のアセンブリをbufferにpushする
 * @param command
 */
const pushComparisonCommand = (command: ArithmeticComparisonKey): void => {
  const [l1, l2] = [getNewLabel(), getNewLabel()];

  const commands = [
    "D=M-D",
    `@${l1}`,
    `D;${ArithmeticComparison[command]}`,
    "D=0",
    `@${l2}`,
    "0;JMP",
    `(${l1})`,
    "D=-1",
    `(${l2})`,
  ];

  commands.forEach((command) => buffer.push(command));
};

/**
 * レジスタからstackにpushする
 */
const pushFromRegister = (): void => {
  const commands = ["@SP", "A=M", "M=D", "@SP", "M=M+1"];
  commands.forEach((command) => buffer.push(command));
};

/**
 * Virtualセグメントからstackにpushする
 * @param key
 * @param index
 */
const pushFromVirtualSegment = (
  key: VirtualSegmentKey,
  index: number
): void => {
  const commands = [`@${VirtualSegment[key]}`, "A=M"];

  for (let i = 0; i < index; i++) {
    commands.push("A=A+1");
  }
  commands.push("D=M");
  commands.forEach((command) => buffer.push(command));

  pushFromRegister();
};

const popFromVirtualSegment = (key: VirtualSegmentKey, index: number): void => {

  popToRegister();
  const commands = ["D=M", `@${VirtualSegment[key]}`, "A=M"];
  for (let i = 0; i < index; i++) {
    commands.push("A=A+1");
  }
  commands.push("M=D");

  commands.forEach((command) => buffer.push(command));
};

/**
 * Staticセグメントからstackにpushする
 * @param key
 * @param index
 */
const pushFromStaticSegment = (key: StaticSegmentKey, index: number): void => {
  popToRegister();

  const commands: string[] = [`@${StaticSegment[key] + index}`, "D=M"];

  commands.forEach((command) => buffer.push(command));
  pushFromRegister();
};

/**
 * Staticセグメントからpopする
 * @param key
 * @param index
 */
const popFromStaticSegment = (key: StaticSegmentKey, index: number): void => {
  popToRegister();

  const commands = ["D=M", `@${StaticSegment[key] + index}`, "M=D"];
  commands.forEach((command) => buffer.push(command));
};

/**
 * ラベル生成を行う
 * @returns
 */
const getNewLabel = (): string => `LABEL${++labelNum}`;
