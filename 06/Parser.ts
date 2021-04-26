import { Mnemonic } from "./Dict.d.ts";
import { symbolTable } from "./SymbolTable.ts";

export type Command = "A_COMMAND" | "C_COMMAND" | "L_COMMAND";

// e.g. "@abc" or "(abc)" match "abc"
const symbolDeclarePattern = new RegExp("(?<=\\@).*$|(?<=[(（]).*?(?=[)）])");
// e.g. D;JEQ match "JEQ"
export const afterSemicolonPattern = new RegExp("(?<=;).*$");
// e.g. D=M+1 match "M+1"
export const afterEqualPattern = new RegExp("(?<=\\=).*$|(.*)(?=;)");
// e.g. D=M+1 match "D"
export const destMatchPattern = new RegExp("^\\w+");

// NOTE: Initial memory address is 16
// When undeclared valiable is used, memory is added
let memoryAddress = 16;

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
    const currentCommand = this.#file[this.line];

    if (!Boolean(currentCommand) && this.#file[this.line + 1]) return true;

    return Boolean(currentCommand);
  };

  /**
   * 入力から次のコマンドを読み込み、現在のコマンドにする
   */
  advance = (): string => this.#file[this.line];

  /**
   * 渡されたコマンドの種類を返す
   * @returns
   */
  commandType(command: string): Command | undefined {
    if (command.startsWith("@")) return "A_COMMAND";
    if (["D", "M", "A", "0"].find((_) => command.startsWith(_)))
      return "C_COMMAND";

    if (command.startsWith("(")) return "L_COMMAND";
  }

  /**
   * 現コマンド @Xxx または(Xxx)のXxxを返す
   * @returns
   */
  getSymboledAddress(command: string): number {
    const matchedLiteral = this.getSymbolMatchedLiteral(command);

    if (Number.isFinite(Number(matchedLiteral))) return Number(matchedLiteral);

    return this.resolveSymbol(matchedLiteral);
  }

  /**
   * シンボルのアドレスを解決する
   * @param matchedLiteral
   * @returns
   */
  resolveSymbol(matchedLiteral: string): number {
    const address = symbolTable.getAddress(matchedLiteral);

    if (Number.isFinite(address)) return address;

    symbolTable.addEntry(matchedLiteral, memoryAddress);
    memoryAddress++;
    return symbolTable.getAddress(matchedLiteral);
  }

  /**
   * シンボルとアドレスの対応をテーブルに登録する
   * @param command
   * @returns
   */
  registerSymbol(command: string): void {
    const literal = this.getSymbolMatchedLiteral(command);

    if (Number.isFinite(literal) || symbolTable.contains(literal)) return;

    const value = this.line - symbolTable.symboledCount;

    console.log(`Add value to tabel Key: ${literal}, Value: ${value} `);

    symbolTable.addEntry(literal, value);
    symbolTable.symboledCount++;
  }
  /**
   * シンボルの宣言にマッチした文字を返す
   * @param command
   * @returns
   */
  getSymbolMatchedLiteral(command: string): string {
    const matched = command.match(symbolDeclarePattern);

    if (!matched) {
      throw new Error(`Invalid command (neither @Xxx nor (xxx)): ${command}`);
    }
    return matched[0];
  }

  /**
   * 渡された命令を解析してニーモニックを返す
   * @param command
   * @param matchPattern
   * @param notMatchPattern
   * @returns
   */
  getMnemonic<T extends Mnemonic>(
    command: string,
    matchPattern: RegExp,
    notMatchPattern?: RegExp
  ): T {
    if (notMatchPattern) {
      if (command.match(afterSemicolonPattern)) return "null" as T;
    }
    const matched = command.match(matchPattern);
    if (matched) return matched[0] as T;

    return "null" as T;
  }
}
