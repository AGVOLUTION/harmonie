import test, { type TestOptions } from "./helpers.js";

interface TestConfig extends TestOptions {
  recreateTestOutput: boolean;
}

const tests: TestConfig[] = [
  {
    state: "DE-BB",
    xml: "./test/data/DE-BB/2019/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-BB/2019/output/DE-BB_2019.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BB",
    xml: "./test/data/DE-BB/2023/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-BB/2023/output/DE-BB_2023.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BW",
    xml: "./test/data/DE-BW/2020/input/FIONA-FSV-000000000001-AKTIV.xml",
    shp: "./test/data/DE-BW/2020/input/fiona_000000000001_ETRS89.shp",
    dbf: "./test/data/DE-BW/2020/input/fiona_000000000001_ETRS89.dbf",
    prj: "./test/data/DE-BW/2020/input/fiona_000000000001_ETRS89.prj",
    testResultsFile: "./test/data/DE-BW/2020/output/DE-BW_2020.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BW",
    xml: "./test/data/DE-BW/2024/input/FIONA-FSV-000000000001-15.04.2025-13.47.52.xml",
    shp: "./test/data/DE-BW/2024/input/fiona_000000000001_ETRS89_32N.shp",
    dbf: "./test/data/DE-BW/2024/input/fiona_000000000001_ETRS89_32N.dbf",
    prj: "./test/data/DE-BW/2024/input/fiona_000000000001_ETRS89_32N.prj",
    testResultsFile: "./test/data/DE-BW/2024/output/DE-BW_2024.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BY",
    xml: "./test/data/DE-BY/2019/input/FlaechenAbfrage_000001.xml",
    testResultsFile: "./test/data/DE-BY/2019/output/DE-BY_2019.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BY",
    xml: "./test/data/DE-BY/2022/input/FlaechenAbfrage_000001.xml",
    testResultsFile: "./test/data/DE-BY/2022/output/DE-BY_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BY",
    xml: "./test/data/DE-BY/2023/input/FlaechenAbfrage.xml",
    testResultsFile: "./test/data/DE-BY/2023/output/DE-BY_2023.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-BY",
    xml: "./test/data/DE-BY/2023/input_2/FlaechenAbfrage.xml",
    shp: "./test/data/DE-BY/2023/input_2/Nutzung.shp",
    dbf: "./test/data/DE-BY/2023/input_2/Nutzung.dbf",
    prj: "./test/data/DE-BY/2023/input_2/Nutzung.prj",
    testResultsFile: "./test/data/DE-BY/2023/output/DE-BY_2023-2.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-HE",
    shp: "./test/data/DE-HE/2019/input/SCHLAG.shp",
    dbf: "./test/data/DE-HE/2019/input/SCHLAG.dbf",
    prj: "./test/data/DE-HE/2019/input/SCHLAG.prj",
    testResultsFile: "./test/data/DE-HE/2019/output/DE-HE_2019.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-HE",
    shp: "./test/data/DE-HE/2022/input/Schläge_POLYGONE.shp",
    dbf: "./test/data/DE-HE/2022/input/Schläge_POLYGONE.dbf",
    prj: "./test/data/DE-HE/2022/input/Schläge_POLYGONE.prj",
    testResultsFile: "./test/data/DE-HE/2022/output/DE-HE_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-HE",
    shp: "./test/data/DE-HE/2024/input/Antragsschläge 2024_POLYGONE.shp",
    dbf: "./test/data/DE-HE/2024/input/Antragsschläge 2024_POLYGONE.dbf",
    prj: "./test/data/DE-HE/2024/input/Antragsschläge 2024_POLYGONE.prj",
    testResultsFile: "./test/data/DE-HE/2024/output/DE-HE_2024.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-HE",
    shp: "./test/data/DE-HE/2025/input/Antragsschläge 2025_POLYGONE.shp",
    dbf: "./test/data/DE-HE/2025/input/Antragsschläge 2025_POLYGONE.dbf",
    prj: "./test/data/DE-HE/2025/input/Antragsschläge 2025_POLYGONE.prj",
    testResultsFile: "./test/data/DE-HE/2025/output/DE-HE_2025.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-MV",
    xml: "./test/data/DE-MV/2020/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-MV/2020/output/DE-MV_2020.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-MV",
    xml: "./test/data/DE-MV/2022/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-MV/2022/output/DE-MV_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-MV",
    xml: "./test/data/DE-MV/2025/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-MV/2025/output/DE-MV_2025.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-MV",
    xml: "./test/data/DE-MV/2025/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-MV/2025/output/DE-MV_2025.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-MV",
    shp: "./test/data/DE-MV/2025/input_2/000000000002_teilflaechen.shp",
    dbf: "./test/data/DE-MV/2025/input_2/000000000002_teilflaechen.dbf",
    prj: "./test/data/DE-MV/2025/input_2/000000000002_teilflaechen.prj",
    testResultsFile: "./test/data/DE-MV/2025/output/DE-MV_2025-2.json",
    recreateTestOutput: true,
  },
  {
    state: "DE-NI",
    xml: "./test/data/DE-NI/2022/input/000000000000001.xml",
    shp: "./test/data/DE-NI/2022/input/teilschlaege.shp",
    dbf: "./test/data/DE-NI/2022/input/teilschlaege.dbf",
    testResultsFile: "./test/data/DE-NI/2022/output/DE-NI_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NI",
    xml: "./test/data/DE-NI/2023/input_2/000000000000002.xml",
    shp: "./test/data/DE-NI/2023/input_2/teilschlaege.shp",
    dbf: "./test/data/DE-NI/2023/input_2/teilschlaege.dbf",
    testResultsFile: "./test/data/DE-NI/2023/output/DE-NI_2023_2.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NI",
    xml: "./test/data/DE-NI/2023/input/000000000000001.xml",
    shp: "./test/data/DE-NI/2023/input/teilschlaege.shp",
    dbf: "./test/data/DE-NI/2023/input/teilschlaege.dbf",
    testResultsFile: "./test/data/DE-NI/2023/output/DE-NI_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NI",
    xml: "./test/data/DE-NI/2024/input/000000000000001.xml",
    shp: "./test/data/DE-NI/2024/input/teilschlaege.shp",
    dbf: "./test/data/DE-NI/2024/input/teilschlaege.dbf",
    testResultsFile: "./test/data/DE-NI/2024/output/DE-NI_2024.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NW",
    xml: "./test/data/DE-NW/2020/input/NW20AGR_NTNW_000000001.xml",
    gml: "./test/data/DE-NW/2020/input/TS_000000001.gml",
    testResultsFile: "./test/data/DE-NW/2020/output/DE-NW_2020.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NW",
    xml: "./test/data/DE-NW/2022/input/NW22AGR_NTNW_000000001.xml",
    gml: "./test/data/DE-NW/2022/input/TS_000000001.gml",
    testResultsFile: "./test/data/DE-NW/2022/output/DE-NW_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NW",
    xml: "./test/data/DE-NW/2022/input_2/NW22AGR_NTNW_000000002.xml",
    gml: "./test/data/DE-NW/2022/input_2/TS_000000002.gml",
    testResultsFile: "./test/data/DE-NW/2022/output/DE-NW_2022-2.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-NW",
    xml: "./test/data/DE-NW/2024/input/NW24AGR_NTNW_000000001.xml",
    gml: "./test/data/DE-NW/2024/input/TS_000000001.gml",
    testResultsFile: "./test/data/DE-NW/2024/output/DE-NW_2024-1.json",
    recreateTestOutput: false,
  },
  /*
  {
    state: 'DE-RP',
    xml: './test/data/DE-RP/2019/input/SchlagDaten_276075650000001_2019.xml',
    gml: './test/data/DE-RP/2019/input/276075650000001_SchlagdatenLafis.gml',
    testResultsFile: './test/data/DE-RP/2019/output/DE-RP_2019.json',
    recreateTestOutput: false
  },
  */
  {
    state: "DE-SL",
    shp: "./test/data/DE-SL/2019/input/schlag_pi0001.shp",
    dbf: "./test/data/DE-SL/2019/input/schlag_pi0001.dbf",
    prj: "./test/data/DE-SL/2019/input/schlag_pi0001.prj",
    testResultsFile: "./test/data/DE-SL/2019/output/DE-SL_2019.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-SN",
    shp: "./test/data/DE-SN/2022/input/Schlaege_0000000001_2022.shp",
    dbf: "./test/data/DE-SN/2022/input/Schlaege_0000000001_2022.dbf",
    prj: "./test/data/DE-SN/2022/input/Schlaege_0000000001_2022.prj",
    testResultsFile: "./test/data/DE-SN/2022/output/DE-SN_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-ST",
    xml: "./test/data/DE-ST/2022/input/000000000001.nn.xml",
    testResultsFile: "./test/data/DE-ST/2022/output/DE-ST_2022.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-TH",
    shp: "./test/data/DE-TH/2019/input/FNNH_BS.shp",
    dbf: "./test/data/DE-TH/2019/input/FNNH_BS.dbf",
    prj: "./test/data/DE-TH/2019/input/FNNH_BS.prj",
    dat: "./test/data/DE-TH/2019/input/FNNH_BS.dat",
    testResultsFile: "./test/data/DE-TH/2019/output/DE-TH_2019.json",
    recreateTestOutput: false,
  },
  {
    state: "DE-TH",
    shp: "./test/data/DE-TH/2023/input/FNNH_BS_ANON_001.shp",
    dbf: "./test/data/DE-TH/2023/input/FNNH_BS_ANON_001.dbf",
    prj: "./test/data/DE-TH/2023/input/FNNH_BS_ANON_001.prj",
    dat: "./test/data/DE-TH/2023/input/FNNH_BS_ANON_001.dat",
    testResultsFile: "./test/data/DE-TH/2023/output/DE-TH_2023.json",
    recreateTestOutput: false,
  },
];

async function runTests(): Promise<void> {
  try {
    const results = await Promise.allSettled(
      tests.map((t) => test(JSON.parse(JSON.stringify(t)), t.recreateTestOutput))
    );

    const failures = results.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );

    if (failures.length > 0) {
      console.error(`${failures.length} test(s) failed:`);
      failures.forEach((failure) => {
        const testConfig = tests[results.indexOf(failure)];
        const firstInputFile =
          testConfig.xml || testConfig.shp || testConfig.gml || testConfig.dat;
        console.error(`- State: ${testConfig.state}, File: ${firstInputFile}`);
        console.error(`  Error: ${failure.reason}`);
      });
      process.exit(1);
    } else {
      console.log("Passed all tests.");
    }
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

runTests();
