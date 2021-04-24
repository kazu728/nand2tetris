import { DestDict, CompDict, JumpDict } from "./Dict.ts";

export type Command = "A_COMMAND" | "C_COMMAND" | "L_COMMAND";

// e.g. "@abc" match "abc"
const symbolDeclarePattern = new RegExp("(?<=\\@).*$");
// e.g. (abc) match "abc"
const enclosedParenthesesPattern = new RegExp("(?<=[(（]).*?(?=[)）])");
// e.g. D;JEQ match "D"
const beforeSemicolonPattern = new RegExp("(.*)(?=;)");
// e.g. D;JEQ match "JEQ"
const afterSemicolonPattern = new RegExp("(?<=;).*$");
// e.g. D=M+1 match "M+1"
const afterEqualPattern = new RegExp("(?<=\\=).*$");

export class Parser {
  #file: string[];
  line = 0;

  constructor(textContent: string[]) {
    this.#file = textContent;
  }

  /**
   * 入力にまだコマンドが存在するか
   * @returns
   */
  hasMoreCommands = (): boolean => {
    console.log("Exists executable command?", this.#file[this.line]);
    // FIXME
    if (!Boolean(this.#file[this.line]) && this.#file[this.line + 1])
      return true;
    return Boolean(this.#file[this.line]);
  };

  /**
   * 入力から次のコマンドを読み込み、現在のコマンドにする
   */
  advance = (): string => this.#file[this.line];

  /**
   * 現コマンドの種類を返す
   * @returns
   */
  commandType(currentCommand: string): Command | undefined {
    console.log(currentCommand);

    if (currentCommand.startsWith("@")) return "A_COMMAND";
    // TODO: fix
    if (
      currentCommand.startsWith("D") ||
      currentCommand.startsWith("M") ||
      currentCommand.startsWith("0")
    )
      return "C_COMMAND";
    if (currentCommand.startsWith("(")) return "L_COMMAND";

    return;
  }

  /**
   * 現コマンド @Xxx または(Xxx)のXxxを返す
   * @returns
   */
  symbol(command: string): string {
    const symbol =
      command.match(symbolDeclarePattern) ||
      command.match(enclosedParenthesesPattern);

    if (!symbol) {
      throw new Error(`Invalid command (neither @Xxx nor (xxx)): ${command}`);
    }

    return symbol[0];
  }

  /**
   * 現C命令のdestニーモニックを返す
   * @returns
   */
  dest(command: string): keyof typeof DestDict {
    // jump命令が含まれる場合destはnullで返す
    if (command.match(beforeSemicolonPattern)) return "null";

    const matched = command.match(new RegExp("^\\w"));
    if (!matched) return "null";

    return matched[0] as keyof typeof DestDict;
  }

  /**
   * 現C命令のcompニーモニックを返す
   * @returns
   */
  comp(command: string): keyof typeof CompDict {
    const matched = command.match(afterEqualPattern);

    if (matched) return matched[0] as keyof typeof CompDict;

    const jumpMatched = command.match(beforeSemicolonPattern);
    if (jumpMatched) return jumpMatched[0] as keyof typeof CompDict;

    throw new Error(`Invalid command: ${command}`);
  }

  /**
   * 現C命令のjumpニーモニックを返す
   * @returns
   */
  jump(command: string): keyof typeof JumpDict {
    const matched = command.match(afterSemicolonPattern);
    if (!matched) return "null";

    return matched[0] as keyof typeof JumpDict;
  }
}
