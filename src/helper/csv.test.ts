import { toCsv } from "./csv";

describe("toCsv", () => {
  it("joins headers and rows with the default ';' delimiter", () => {
    expect(
      toCsv(
        ["A", "B"],
        [
          ["1", "2"],
          ["3", "4"],
        ],
      ),
    ).toBe("A;B\r\n1;2\r\n3;4");
  });

  it("quotes cells containing the delimiter, quotes or newlines", () => {
    expect(toCsv(["X"], [["a;b"], ['has "q"'], ["line\nbreak"]])).toBe('X\r\n"a;b"\r\n"has ""q"""\r\n"line\nbreak"');
  });

  it("neutralizes formula-injection prefixes", () => {
    expect(toCsv(["X"], [["=1+1"], ["+budget"], ["-2"], ["@cmd"]])).toBe("X\r\n'=1+1\r\n'+budget\r\n'-2\r\n'@cmd");
  });
});
