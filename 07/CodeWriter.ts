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
} from "./Dict.ts";

let labelNum = 0;

/**
 * CodeWriterモジュールに新しいVMファイルの変換が開始したことを知らせる
 * @param filename
 * @returns
 */
export const setFileName = (filename: string): void => {};

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
      const never: never = command;
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
) => {
  if (command === "push") {
    switch (segment) {
      case "constant":
        const commands = [`@${index}`, "D=A"];
        commands.forEach((command) => buffer.push(command));

        pushFromRegister();
        break;

      default:
        break;
    }
  } else {
    // TODO: C_POP
  }
};

/**
 * スタックからpopし、レジスタへと値の格納を行う
 */
const popToRegister = (): void => {
  const commands = ["@SP", "M=M-1", "A=M"];
  commands.forEach((command) => buffer.push(command));
};

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
const pushCalculatingCommand = (command: ArithmeticCalculationKey): void => {
  buffer.push(ArithmeticCalculation[command]);
};

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
 * ラベル生成を行う
 * @returns
 */
const getNewLabel = (): string => `LABEL${++labelNum}`;

/**
 * 出力ファイルを閉じる
 */
const close = () => {};
