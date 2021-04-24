type SymbolType = { [K: string]: number };

class SymbolTable {
  #hash: SymbolType = {};

  /**
   * テーブルに(symbol,adress)のaddress(整数)ペアを追加する
   * @param symbol
   * @param address
   */
  addEntry(symbol: string, address: number): void {
    this.#hash[symbol] = address;
  }

  /**
   * シンボルテーブルは与えられたsymbolを含むか
   * @param symbol
   * @returns
   */
  contains = (symbol: string): boolean => Boolean(this.#hash[symbol]);

  /**
   * symbol に結びつけられたアドレスを返す
   * @param symbol
   * @returns
   */
  getAddress = (symbol: string): number => this.#hash[symbol];
}
