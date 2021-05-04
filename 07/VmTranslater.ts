import { getUserInputCommand, writeToFile } from "./FileHandler.ts";
import { getCommandType } from "./Parser.ts";
import { Command, Segment, PushOrPop, ArithmeticCommand } from "./Dict.ts";
import { writePushPop, writeArithmetic } from "./CodeWriter.ts";

export const buffer: string[] = [];

const commands: string[] = getUserInputCommand();

/**
 * vmからアセンブリへの変換を行う
 * @param index
 * @returns
 */
const translate = (index: number) => {
  const currentCommand: string = commands[index];

  if (!currentCommand) return;

  if (!currentCommand && !commands[index + 1]) return;
  const splitedCommand = currentCommand.split(" ");

  const commandType = getCommandType(splitedCommand[0] as Command);

  if (["C_PUSH", "C_POP", "C_FUNCTION", "C_CALL"].includes(commandType)) {
    if (["C_PUSH", "C_POP"].includes(commandType)) {
      type CommandTuple = [PushOrPop, Segment, string];
      const [command, segment, index] = splitedCommand as CommandTuple;

      writePushPop(command, segment, parseInt(index));
    }
  } else {
    if (commandType === "C_ARITHMETIC") {
      const arithmeticCommand = splitedCommand[0] as ArithmeticCommand;
      writeArithmetic(arithmeticCommand);
    }
    // TODO: fix
    const other = splitedCommand[1];
  }

  translate(index + 1);
};

translate(0);

writeToFile();
