import fs from "fs/promises";
import { deepStrictEqual } from "assert";
import harmonie, { type HarmonieQuery } from "../dist/index.js";

export interface TestOptions {
  state: string;
  xml?: string;
  gml?: string;
  shp?: string;
  dbf?: string;
  prj?: string;
  dat?: string;
  testResultsFile: string;
  recreateTestOutput?: boolean;
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return (buffer.buffer as ArrayBuffer).slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}

async function updateTestResult(path: string, data: unknown): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data), "utf8");
}

async function compare(expectedFile: string, actual: unknown): Promise<void> {
  const expected = await fs.readFile(expectedFile, "utf8");
  deepStrictEqual(JSON.parse(expected), JSON.parse(JSON.stringify(actual)));
}

export async function test(options: TestOptions, updateResults: boolean): Promise<void> {
  const parsedOptions: HarmonieQuery = {
    state: options.state,
  };

  // read input data from test directory
  if (options.xml) parsedOptions.xml = await fs.readFile(options.xml, "utf8");
  if (options.gml) parsedOptions.gml = await fs.readFile(options.gml, "utf8");
  if (options.shp) parsedOptions.shp = bufferToArrayBuffer(await fs.readFile(options.shp));
  if (options.dbf) parsedOptions.dbf = bufferToArrayBuffer(await fs.readFile(options.dbf));
  if (options.prj) parsedOptions.prj = await fs.readFile(options.prj, "utf8");
  if (options.dat) parsedOptions.dat = await fs.readFile(options.dat, "latin1");

  const data = await harmonie(parsedOptions);

  if (updateResults) {
    await updateTestResult(options.testResultsFile, data);
  } else {
    await compare(options.testResultsFile, data);
  }
}

export default test;
