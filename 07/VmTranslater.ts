import { getUserInputCommand, writeToFile } from "./FileHandler.ts";
import { getCommandType } from "./Parser.ts";
import { Command, Segment, PushOrPop, ArithmeticCommand } from "./Dict.ts";
import { writePushPop, writeArithmetic } from "./CodeWriter.ts";

type CommandTuple = [PushOrPop, Segment, string];
// TODO: コメントパースできるように
export let buffer: string[] = [];

const commands: string[] = getUserInputCommand();

/**
 * vmからアセンブリへの変換を行う
 * @param index
 * @returns
 */
const translate = (index: number): void => {
  const currentCommand: string = commands[index];

  if (!currentCommand) return;

  if (!currentCommand && !commands[index + 1]) return;
  const command = currentCommand.split(" ") as [Command, Segment, string];

  const commandType = getCommandType(command[0]);

  if (["C_PUSH", "C_POP", "C_FUNCTION", "C_CALL"].includes(commandType)) {
    if (["C_PUSH", "C_POP"].includes(commandType)) {
      const [instruction, segment, index] = command as CommandTuple;
      writePushPop(instruction, segment, parseInt(index));
    }
  } else {
    if (commandType === "C_ARITHMETIC") {
      const arithmeticCommand = command[0] as ArithmeticCommand;
      writeArithmetic(arithmeticCommand);
    }
    // TODO:
    const other = command[1];
  }

  translate(index + 1);
};

translate(0);

writeToFile();
