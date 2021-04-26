import {
  Parser,
  Command,
  afterSemicolonPattern,
  afterEqualPattern,
  destMatchPattern,
} from "./Parser.ts";
import { makeACommandBin, makeCCommandBin, getBinByMnemonic } from "./Code.ts";
import { symbolTable } from "./SymbolTable.ts";
import { getUserInputCommand, writeToFile } from "./FileHandler.ts";
import { DestDict, CompDict, JumpDict } from "./Dict.ts";
import { CompDictKey, DestDictKey, JumpDictKey } from "./Dict.d.ts";

export const buffer: string[] = [];
const commands: string[] = getUserInputCommand();
export const parser = new Parser(commands);

/**
 * シンボルを登録する
 */
const ParseInputText = ({ isRegister }: { isRegister: boolean }): void => {
  while (parser.hasMoreCommands()) {
    const currentCommand = parser.advance();

    const commandType: Command | undefined = parser.commandType(currentCommand);

    if (isRegister) {
      if (commandType === "L_COMMAND") parser.registerSymbol(currentCommand);
    } else {
      if (!commandType) continue;

      switchToCommandType(currentCommand, commandType);
    }

    parser.line = parser.line + 1;
  }
};
/**
 * 受け取ったコマンドタイプに応ずる処理を実行する
 * @param command
 * @param commandType
 */
const switchToCommandType = (command: string, commandType: Command) => {
  switch (commandType) {
    case "L_COMMAND":
      break;

    case "A_COMMAND":
      const address = parser.getSymboledAddress(command);

      buffer.push(makeACommandBin(address));
      break;

    case "C_COMMAND":
      const compBin = getBinByMnemonic(
        CompDict,
        parser.getMnemonic<CompDictKey>(command, afterEqualPattern)
      );

      const destBin = getBinByMnemonic(
        DestDict,
        parser.getMnemonic<DestDictKey>(
          command,
          destMatchPattern,
          afterSemicolonPattern
        )
      );
      const jumpBin = getBinByMnemonic(
        JumpDict,
        parser.getMnemonic<JumpDictKey>(command, afterSemicolonPattern)
      );

      buffer.push(makeCCommandBin(compBin, destBin, jumpBin));

      break;
    default:
      const never: never = commandType;
      throw new Error(never);
  }
};

const run = (): void => {
  console.log("Start register symbol...");
  ParseInputText({ isRegister: true });
  console.log("Done", symbolTable.hash);

  parser.line = 0;

  console.log("Start assemble...");
  ParseInputText({ isRegister: false });
  console.log("Done");
  writeToFile();
};

run();
