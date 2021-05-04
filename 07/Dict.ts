export const dict = {
  push: "C_PUSH",
  pop: "C_POP",
  label: "C_LABEL",
  goto: "C_GOTO",
  "if-goto": "C_IF",
  function: "C_FUNCTION",
  return: "C_RETURN",
  call: "C_CALL",
  add: "C_ARITHMETIC",
  sub: "C_ARITHMETIC",
  neg: "C_ARITHMETIC",
  eq: "C_ARITHMETIC",
  gt: "C_ARITHMETIC",
  lt: "C_ARITHMETIC",
  and: "C_ARITHMETIC",
  or: "C_ARITHMETIC",
  not: "C_ARITHMETIC",
} as const;

export type Command = keyof typeof dict;
export type CommandType = typeof dict[keyof typeof dict];

export const ArithmeticCalculation = {
  add: "D=D+M",
  sub: "D=M-D",
  and: "D=D&M"  ,
  or: "D=D|M",
} as const;
export type ArithmeticCalculationKey = keyof typeof ArithmeticCalculation;

export const ArithmeticComparison = {
  eq: "JEQ",
  gt: "JGT",
  lt: "JLT",
} as const;
export type ArithmeticComparisonKey = keyof typeof ArithmeticComparison;

export const ArithmeticDenial = {
  neg: "M=-M",
  not: "M=!M",
} as const;

export type ArithmeticDenialKey = keyof typeof ArithmeticDenial;

export const ArithmeticCommand = {
  ...ArithmeticCalculation,
  ...ArithmeticComparison,
  ...ArithmeticDenial,
} as const;

export type ArithmeticCommand = keyof typeof ArithmeticCommand;

export type Segment =
  | "local"
  | "argument"
  | "this"
  | "that"
  | "pointer"
  | "temp"
  | "constant"
  | "static";

export type PushOrPop = "push" | "pop";
