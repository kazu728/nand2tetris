import { Parser, Command } from "./Parser.ts";
import { dest, comp, jump, createACommandBin } from "./Code.ts";

// TODO: 型抽象化する

const asmFile = Deno.args[0];

/**
 * asmファイルをパースして処理をIterableにする
 */
const commands: string[] = new TextDecoder("utf-8")
  .decode(Deno.readFileSync(asmFile))
  .split("\n")
  .map((command) => command.replace("\r", ""));

/**
 * バイナリをファイルに書き出す
 * @param bin
 * @returns
 */
const generateHackFile = (bin: string): void =>
  Deno.writeFileSync(
    `${asmFile.replace(".asm", ".hack")}`,
    new TextEncoder().encode(bin),
    { append: true }
  );

const parser = new Parser(commands);

while (parser.hasMoreCommands()) {
  console.log(`Execute command line: ${parser.line + 1}`);

  const currentCommand = parser.advance();

  const commandType: Command | undefined = parser.commandType(currentCommand);
  console.log("command_type:", commandType);

  // FIXME: refactor
  switch (commandType) {
    // //だけとか\rだけとかは実行しない
    case undefined:
      break;
    case "A_COMMAND":
      const symbol = parser.symbol(currentCommand);
      generateHackFile(createACommandBin(symbol));

      break;

    case "C_COMMAND":
      const compBin = comp(parser.comp(currentCommand));
      const destBin = dest(parser.dest(currentCommand));
      const jumpBin = jump(parser.jump(currentCommand));

      const cCommandBin = `111${compBin}${destBin}${jumpBin}\r`;

      generateHackFile(cCommandBin);

      break;
    case "L_COMMAND":
      const _ = parser.symbol(currentCommand);
      break;
    default:
      const never: never = commandType;
      throw new Error(never);
  }
  parser.line = parser.line + 1;
}
