import React from "react";
import DynamicLineChart from "./DynamicLineChart";
import { useState, useEffect } from "react";

const AdvancedAnalyticsTb = ({ data }) => {
  const [cppBatchNo, setCppBatchNo] = useState([]);
  useEffect(() => {
    setCppBatchNo(data?.gridDatas?.manufacturingPartStageI?.data);
  }, [data?.gridDatas]);

  const manufacturingStageIDataS1 =
    data?.gridDatas?.manufacturingPartRawStageI?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageI,
        "Observed Value": Number(item.Assay950to1020PercentStageI),
      };
    });
  const manufacturingStageIDataS2 =
    data?.gridDatas?.manufacturingPartRawStageI?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageI,
        "Observed Value": Number(item.Water115to145StageI),
      };
    });
  const manufacturingStageIDataS3 =
    data?.gridDatas?.manufacturingPartRawStageI?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageI,
        "Observed Value": Number(item.ForanyimpurityNMT10PercentStageI),
      };
    });
  const manufacturingStageIDataS4 =
    data?.gridDatas?.manufacturingPartRawStageI?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageI,
        "Observed Value": Number(
          item.AnyunsepecifiedimpurityNMT10PercentStageI
        ),
      };
    });
  const manufacturingStageIDataS5 =
    data?.gridDatas?.manufacturingPartRawStageI?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageI,
        "Observed Value": Number(item.TotalImpurityNMT50PercentStageI),
      };
    });

  const manufacturingStageIIDataS1 =
    data?.gridDatas?.manufacturingPartRawStageII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageII,
        "Observed Value": Number(item.Assay912to1071StageII),
      };
    });
  const manufacturingStageIIDataS2 =
    data?.gridDatas?.manufacturingPartRawStageII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageII,
        "Observed Value": Number(item.WaterNMT25PercentStageII),
      };
    });
  const manufacturingStageIIDataS3 =
    data?.gridDatas?.manufacturingPartRawStageII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageII,
        "Observed Value": Number(item.NMT20PercentStageII),
      };
    });
  const manufacturingStageIIDataS4 =
    data?.gridDatas?.manufacturingPartRawStageII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageII,
        "Observed Value": Number(item.NMT02PercentStageII),
      };
    });
  const manufacturingStageIIDataS5 =
    data?.gridDatas?.manufacturingPartRawStageII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageII,
        "Observed Value": Number(item.NMT10PercentStageII),
      };
    });
  const manufacturingStageIIDataS6 =
    data?.gridDatas?.manufacturingPartRawStageII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageII,
        "Observed Value": Number(item.NMT10PercentStageeII),
      };
    });

  const manufacturingStageIIIDataS1 =
    data?.gridDatas?.manufacturingPartRawStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageIII,
        "Observed Value": Number(item.Assay950to1020PercentStageIII),
      };
    });
  const manufacturingStageIIIDataS2 =
    data?.gridDatas?.manufacturingPartRawStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": item?.BatchNoStageIII,
        "Observed Value": Number(item.Water115to145StageIII),
      };
    });

    const waterContentS1Data1 = data?.gridDatas?.manufacturingPartARStageI?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.waterContent1),
        };
      }
    );
    const waterContentS2Data2 = data?.gridDatas?.manufacturingPartARStageI?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.amoxicillin1),
        };
      }
    );
    const waterContentS3Data3 = data?.gridDatas?.manufacturingPartARStageI?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.potassiumClavulanate),
        };
      }
    );
    const analyticalTrendS2Data1 = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.averageWeight99750),
        };
      }
    );
    const analyticalTrendS2Data2a = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": cppBatchNo[i]?.batchNo,
          "Observed Value": Number(item.minVariation),
          // "Observed Value": Number(item.MaxVariation),
        };
      }
    );
    const analyticalTrendS2Data2b = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": cppBatchNo[i]?.batchNo,
          // "Observed Value": Number(item.minVariation),
          "Observed Value": Number(item.MaxVariation),
        };
      }
    );
    const analyticalTrendS2Data3a = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.innerMinR10),
          // "Observed Value": Number(item.innerMaxR10),
        };
      }
    );
    const analyticalTrendS2Data3b = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          // "Observed Value": Number(item.innerMinR10),
          "Observed Value": Number(item.innerMaxR10),
        };
      }
    );
    const analyticalTrendS2Data4a = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.innerMinR11),
          // "Observed Value": Number(item.innerMaxR11),
        };
      }
    );
    const analyticalTrendS2Data4b = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          // "Observed Value": Number(item.innerMinR11),
          "Observed Value": Number(item.innerMaxR11),
        };
      }
    );
    const analyticalTrendS2Data5a = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.uniformityAmoxicillin),
          // "Observed Value": Number(item.uniformityClavulanicAcid),
        };
      }
    );
    const analyticalTrendS2Data5b = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          // "Observed Value": Number(item.uniformityAmoxicillin),
          "Observed Value": Number(item.uniformityClavulanicAcid),
        };
      }
    );
    const analyticalTrendS2Data6 = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.WaterContentNMT10),
        };
      }
    );
    const analyticalTrendS2Data7 = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.AssayAmoxicillin),
        };
      }
    );
    const analyticalTrendS2Data8 = data?.gridDatas?.manufacturingPartARStageIII?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.batchNo,
          "Observed Value": Number(item.AssayCalvulanicacid),
        };
      }
    );
    const productAnalyticalTrendDataa = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.averageWeight),
        };
      }
    );
    const productAnalyticalTrendDatab = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.minVariation),
        };
      }
    );
    const productAnalyticalTrendDatac = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.maxVariation),
        };
      }
    );
    const productAnalyticalTrendDatad = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.nmt30Minutes),
        };
      }
    );
    const productAnalyticalTrendDatae = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.innerMin12),
        };
      }
    );
    const productAnalyticalTrendDataf = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.innerMax12),
        };
      }
    );
    const productAnalyticalTrendDatag = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.innerMin13),
        };
      }
    );
    const productAnalyticalTrendDatah = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.innerMax13),
        };
      }
    );
    const productAnalyticalTrendDatai = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.amoxicillin),
        };
      }
    );
    const productAnalyticalTrendDataj = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.clavulanicAcid),
        };
      }
    );
    const productAnalyticalTrendData2a = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.polymerNMT50),
        };
      }
    );
    const productAnalyticalTrendData2b = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.amoxicillinDimer),
        };
      }
    );
    const productAnalyticalTrendData2c = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.otherSecondaryImpurity),
        };
      }
    );
    const productAnalyticalTrendData2d = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.microbialEnumerationNMT1000),
        };
      }
    );
    const productAnalyticalTrendData2e = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.microbialEnumerationNMT100),
        };
      }
    );
    const productAnalyticalTrendData2f = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.assayAmoxIcillin90),
        };
      }
    );
    const productAnalyticalTrendData2g = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.assayClavulanicAcid90),
        };
      }
    );
    const productAnalyticalTrendData2h = data?.gridDatas?.packingPartARStageVA?.data?.map(
      (item, i) => {
        return {
          "Batch No.": item?.motherBatchNo,
          "Observed Value": Number(item.waterNMT),
        };
      }
    );

  const granulationS1Data = data?.gridDatas?.manufacturingPartStageI?.data?.map(
    (item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.amoxicillin) || Number(item.ERH),
      };
    }
  );
  const granulationS1Data5 =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.oscillatingGrabulatorMachineSpeed),
      };
    });

  const granulationS1Data2a =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.averageMinimum),
      };
    });
  const granulationS1Data2b =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.averageMaximum),
        // "avgs Avg Weight": Number(item.averageMaximum),
      };
    });

  const granulationS1Data3a =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.hardnessMinimum),
      };
    });
  const granulationS1Data3b =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Observed Value": Number(item.hardnessMaximum),
      };
    });

  const granulationS1Data2 =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Max Avg Weight": Number(item.averageMaximum),
        "Min Avg Weight": Number(item.averageMinimum),
        // "avgs Avg Weight": Number(item.averageMaximum),
      };
    });
  const granulationS1Data3 =
    data?.gridDatas?.manufacturingPartStageI?.data?.map((item) => {
      return {
        "Batch No.": item.batchNo,
        "Max Hardness": Number(item.hardnessMaximum),
        "Min Hardness": Number(item.hardnessMinimum),
      };
    });
  const granulationS2Data =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Wt LHS": Number(item.innerLHS),
        "Wt RHS": Number(item.innerRHS),
      };
    });
  const granulationS2Data2 =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Wt LHS": Number(item.innerLHS1),
        "Wt RHS": Number(item.innerRHS1),
      };
    });
  const granulationS2Data3 =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin2),
        "Max LHS Hardness": Number(item.innerMax2),
        "Min RHS Hardness": Number(item.innerMin3),
        "Max RHS Hardness": Number(item.innerMax3),
      };
    });
  const granulationS2Data4 =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin4),
        "Max LHS Hardness": Number(item.innerMax4),
        "Min RHS Hardness": Number(item.innerMin5),
        "Max RHS Hardness": Number(item.innerMax5),
      };
    });
  const granulationS2Data5 =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin6),
        "Min LHS Hardness": Number(item.innerMax6),
        "Min RHS Hardness": Number(item.innerMin7),
        "Min RHS Hardness": Number(item.innerMax7),
      };
    });
  const granulationS2Data6 =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin8),
        "Min LHS Hardness": Number(item.innerMin8),
        "Min RHS Hardness": Number(item.innerMin9),
        "Min RHS Hardness": Number(item.innerMin9),
      };
    });
  const granulationS2Data7 =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Min LHS Hardness": Number(item.innerMin),
        "Max LHS Hardness": Number(item.innerMax),
        "Min RHS Hardness": Number(item.innerMin1),
        "Max RHS Hardness": Number(item.innerMax1),
      };
    });

  const granulationS2Dataa =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerLHS),
        // "Wt RHS": Number(item.innerRHS),
      };
    });
  const granulationS2Datab =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Wt LHS": Number(item.innerLHS),
        "Observed Value": Number(item.innerRHS),
      };
    });

  const granulationS2Data2a =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerLHS1),
        // "Wt RHS": Number(item.innerRHS1),
      };
    });
  const granulationS2Data2b =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Wt LHS": Number(item.innerLHS1),
        "Observed Value": Number(item.innerRHS1),
      };
    });

  const granulationS2Data3a =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin2),
        // "Max LHS Hardness": Number(item.innerMax2),
        // "Min RHS Hardness": Number(item.innerMin3),
        // "Max RHS Hardness": Number(item.innerMax3),
      };
    });
  const granulationS2Data3b =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Hardness": Number(item.innerMin2),
        "Observed Value": Number(item.innerMax2),
        // "Min RHS Hardness": Number(item.innerMin3),
        // "Max RHS Hardness": Number(item.innerMax3),
      };
    });
  const granulationS2Data3c =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Hardness": Number(item.innerMin2),
        // "Max LHS Hardness": Number(item.innerMax2),
        "Observed Value": Number(item.innerMin3),
        // "Max RHS Hardness": Number(item.innerMax3),
      };
    });
  const granulationS2Data3d =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Hardness": Number(item.innerMin2),
        // "Max LHS Hardness": Number(item.innerMax2),
        // "Min RHS Hardness": Number(item.innerMin3),
        "Observed Value": Number(item.innerMax3),
      };
    });

  const granulationS2Data4a =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin4),
        //   "Max LHS Thickness": Number(item.innerMax4),
        //   "Min RHS Thickness": Number(item.innerMin5),
        //   "Max RHS Thickness": Number(item.innerMax5),
      };
    });
  const granulationS2Data4b =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Thickness": Number(item.innerMin4),
        "Observed Value": Number(item.innerMax4),
        // "Min RHS Thickness": Number(item.innerMin5),
        // "Max RHS Thickness": Number(item.innerMax5),
      };
    });

  const granulationS2Data4c =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Thickness": Number(item.innerMin4),
        // "Max LHS Thickness": Number(item.innerMax4),
        "Observed Value": Number(item.innerMin5),
        // "Max RHS Thickness": Number(item.innerMax5),
      };
    });
  const granulationS2Data4d =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Thickness": Number(item.innerMin4),
        // "Max LHS Thickness": Number(item.innerMax4),
        // "Min RHS Thickness": Number(item.innerMin5),
        "Observed Value": Number(item.innerMax5),
      };
    });
  const granulationS2Data5a =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin6),
        // "Max LHS Friability": Number(item.innerMax6),
        // "Min RHS Friability": Number(item.innerMin7),
        // "Max RHS Friability": Number(item.innerMax7),
      };
    });
  const granulationS2Data5b =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Friability": Number(item.innerMin6),
        "Observed Value": Number(item.innerMax6),
        // "Min RHS Friability": Number(item.innerMin7),
        // "Max RHS Friability": Number(item.innerMax7),
      };
    });
  const granulationS2Data5c =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Friability": Number(item.innerMin6),
        // "Max LHS Friability": Number(item.innerMax6),
        "Observed Value": Number(item.innerMin7),
        // "Max RHS Friability": Number(item.innerMax7),
      };
    });
  const granulationS2Data5d =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Friability": Number(item.innerMin6),
        // "Max LHS Friability": Number(item.innerMax6),
        // "Min RHS Friability": Number(item.innerMin7),
        "Observed Value": Number(item.innerMax7),
      };
    });
  const granulationS2Data6a =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin8),
        // "Max LHS DT": Number(item.innerMax8),
        // "Min RHS DT": Number(item.innerMin9),
        // "Max RHS DT": Number(item.innerMax9),
      };
    });
  const granulationS2Data6b =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS DT": Number(item.innerMin8),
        "Observed Value": Number(item.innerMax8),
        // "Min RHS DT": Number(item.innerMin9),
        // "Max RHS DT": Number(item.innerMax9),
      };
    });
  const granulationS2Data6c =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS DT": Number(item.innerMin8),
        // "Max LHS DT": Number(item.innerMax8),
        "Observed Value": Number(item.innerMin9),
        // "Max RHS DT": Number(item.innerMax9),
      };
    });
  const granulationS2Data6d =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS DT": Number(item.innerMin8),
        // "Max LHS DT": Number(item.innerMax8),
        // "Min RHS DT": Number(item.innerMin9),
        "Observed Value": Number(item.innerMax9),
      };
    });
  const granulationS2Data7a =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin),
        // "Max LHS Uniformity": Number(item.innerMax),
        // "Min RHS Uniformity": Number(item.innerMin1),
        // "Max RHS Uniformity": Number(item.innerMax1),
      };
    });
  const granulationS2Data7b =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Uniformity": Number(item.innerMin),
        "Observed Value": Number(item.innerMax),
        // "Min RHS Uniformity": Number(item.innerMin1),
        // "Max RHS Uniformity": Number(item.innerMax1),
      };
    });
  const granulationS2Data7c =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Uniformity": Number(item.innerMin),
        // "Max LHS Uniformity": Number(item.innerMax),
        "Observed Value": Number(item.innerMin1),
        // "Max RHS Uniformity": Number(item.innerMax1),
      };
    });
  const granulationS2Data7d =
    data?.gridDatas?.manufacturingPartStageII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min LHS Uniformity": Number(item.innerMin),
        // "Max LHS Uniformity": Number(item.innerMax),
        // "Min RHS Uniformity": Number(item.innerMin1),
        "Observed Value": Number(item.innerMax1),
      };
    });

  const granulationS3Data1a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR1),
        // "Max Inlet Temp": Number(item.innerMaxR1),
      };
    });
  const granulationS3Data1b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min Inlet Temp": Number(item.innerMinR1),
        "Observed Value": Number(item.innerMaxR1),
      };
    });
  const granulationS3Data2a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR2),
        // "Max Outlet Temp": Number(item.innerMaxR2),
      };
    });
  const granulationS3Data2b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min Outlet Temp": Number(item.innerMinR2),
        "Observed Value": Number(item.innerMaxR2),
      };
    });
  const granulationS3Data3 =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.atomizationAirPressure),
      };
    });
  const granulationS3Data4a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR4),
        // "Max Uniformity": Number(item.innerMaxR4),
      };
    });
  const granulationS3Data4b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Min Uniformity": Number(item.innerMinR4),
        "Observed Value": Number(item.innerMaxR4),
      };
    });
  const granulationS3Data5a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR5),
        // "Observed Value": Number(item.innerMaxR5),
      };
    });
  const granulationS3Data5b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR5),
        "Observed Value": Number(item.innerMaxR5),
      };
    });
  const granulationS3Data6a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR6),
        // "Observed Value": Number(item.innerMaxR6),
      };
    });
  const granulationS3Data6b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR6),
        "Observed Value": Number(item.innerMaxR6),
      };
    });
  const granulationS3Data7a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR7),
        // "Observed Value": Number(item.innerMaxR7),
      };
    });
  const granulationS3Data7b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR7),
        "Observed Value": Number(item.innerMaxR7),
      };
    });
  const granulationS3Data8a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR8),
        // "Observed Value": Number(item.innerMaxR8),
      };
    });
  const granulationS3Data8b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR8),
        "Observed Value": Number(item.innerMaxR8),
      };
    });
  const granulationS3Data9a =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMinR9),
        // "Observed Value": Number(item.innerMaxR9),
      };
    });
  const granulationS3Data9b =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMinR9),
        "Observed Value": Number(item.innerMaxR9),
      };
    });
  const granulationS3Data10 =
    data?.gridDatas?.manufacturingPartStageIII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.ERHNMT),
      };
    });
  const granulationS4Data1a =
    data?.gridDatas?.manufacturingPartStageIV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin10),
        // "Observed Value": Number(item.innerMax10),
      };
    });
  const granulationS4Data1b =
    data?.gridDatas?.manufacturingPartStageIV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin10),
        "Observed Value": Number(item.innerMax10),
      };
    });
  const granulationS4Data2a =
    data?.gridDatas?.manufacturingPartStageIV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin11),
        // "Observed Value": Number(item.innerMax11),
      };
    });
  const granulationS4Data2b =
    data?.gridDatas?.manufacturingPartStageIV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin11),
        "Observed Value": Number(item.innerMax11),
      };
    });
  const granulationS4Data3 =
    data?.gridDatas?.manufacturingPartStageIV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.vacuum710),
      };
    });
  const granulationS5Data1a =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin17),
        // "Observed Value": Number(item.innerMax17),
      };
    });
  const granulationS5Data1b =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin17),
        "Observed Value": Number(item.innerMax17),
      };
    });
  const granulationS5Data2a =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin18),
        // "Observed Value": Number(item.innerMax18),
      };
    });
  const granulationS5Data2b =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin18),
        "Observed Value": Number(item.innerMax18),
      };
    });
  const granulationS5Data3a =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin19),
        // "Observed Value": Number(item.innerMax19),
      };
    });
  const granulationS5Data3b =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin19),
        "Observed Value": Number(item.innerMax19),
      };
    });
  const granulationS5Data4a =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin20),
        // "Observed Value": Number(item.innerMax20),
      };
    });
  const granulationS5Data4b =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin20),
        "Observed Value": Number(item.innerMax20),
      };
    });
  const granulationS5Data5a =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        "Observed Value": Number(item.innerMin21),
        // "Observed Value": Number(item.innerMax21),
      };
    });
  const granulationS5Data5b =
    data?.gridDatas?.packingPartCriticalStageVII?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        // "Observed Value": Number(item.innerMin21),
        "Observed Value": Number(item.innerMax21),
      };
    });
  const granulationS6Data1 =
    data?.gridDatas?.manufacturingPartStageV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.granulationYield),
      };
    });
  const granulationS6Data2 =
    data?.gridDatas?.manufacturingPartStageV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.compressionYield),
      };
    });
  const granulationS6Data3 =
    data?.gridDatas?.manufacturingPartStageV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.coatingYield),
      };
    });

  const granulationS6Data4 =
    data?.gridDatas?.manufacturingPartStageV?.data?.map((item, i) => {
      return {
        "Batch No.": cppBatchNo?.[i]?.batchNo,
        Value: Number(item.insepectionYield),
      };
    });

  return (
    <div>
      {/* Analytics for CMAs STage -I (Amoxi) */}
      {data?.gridDatas?.manufacturingPartRawStageI?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 pt-3 text-2xl text-white text-center">
            <b>Critical Material Attributes (CMAs) -</b> (API_I_Amoxi)
          </h1>

          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Assay"}
                xHeading={"Batch No."}
                yHeading={"Assay"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"assay91to107"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIGraph?.data
                }
                highchartData={manufacturingStageIDataS1 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Water"}
                xHeading={"Batch No."}
                yHeading={"Water"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"waterNMT"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIGraph?.data
                }
                highchartData={manufacturingStageIDataS2 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"For any Impurity"}
                xHeading={"Batch No."}
                yHeading={"Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"forAnyImpurity"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIGraph?.data
                }
                highchartData={manufacturingStageIDataS3 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Any Unspecified Impurity"}
                xHeading={"Batch No."}
                yHeading={"Unspecified Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"anyUnsepecifiedImpurity"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIGraph?.data
                }
                highchartData={manufacturingStageIDataS4 || []}
                fromCPP={true}
              />
            </div>
            <div className="col-span-2">
              <DynamicLineChart
                heading={"Total Impurity"}
                xHeading={"Batch No."}
                yHeading={"Total Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"totalImpurity"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIGraph?.data
                }
                highchartData={manufacturingStageIDataS5 || []}
                fromCPP={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 text-[28px] w-full text-white font-serif text-center">
              Critical Material Attributes (Stage-I (API_I_Amoxi)){" "}
            </h1>
            <p className="text-xl text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}
      {/* Analytics for CMAs STage -I (Clav) */}
      {data?.gridDatas?.manufacturingPartRawStageI?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Material Attributes (CMAs) -</b> (API_I_Clav)
          </h1>

          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Assay"}
                xHeading={"Batch No."}
                yHeading={"Assay"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"assayRaw"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIGraph?.data
                }
                highchartData={manufacturingStageIIDataS1}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Water"}
                xHeading={"Batch No."}
                yHeading={"Water"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"waterNMTRaw"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIGraph?.data
                }
                highchartData={manufacturingStageIIDataS2}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"For any Impurity"}
                xHeading={"Batch No."}
                yHeading={"Any Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"totalImpurities"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIGraph?.data
                }
                highchartData={manufacturingStageIIDataS3}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Any Unspecified Impurity"}
                xHeading={"Batch No."}
                yHeading={"Unspecified Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"anyOtherImpurity"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIGraph?.data
                }
                highchartData={manufacturingStageIIDataS4}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Total Impurity E"}
                xHeading={"Batch No."}
                yHeading={"Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"impuritiesE"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIGraph?.data
                }
                highchartData={manufacturingStageIIDataS5}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Total Impurity G"}
                xHeading={"Batch No."}
                yHeading={"Impurity"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"impurityG"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIGraph?.data
                }
                highchartData={manufacturingStageIIDataS6}
                fromCPP={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Material Attributes (CMAs) -</b> (API_I_Clav)
            </h1>
            <p className="text-xl text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}
      {/* Analytics for CMAs STage -II (Drying) */}
      {data?.gridDatas?.manufacturingPartRawStageII?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Material Attributes (CMAs) -</b> (API-II (Drying Stage))
          </h1>

          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Assay"}
                xHeading={"Batch No."}
                yHeading={"Assay"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"assayRaw1"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIIGraph?.data
                }
                highchartData={manufacturingStageIIIDataS1 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Water"}
                xHeading={"Batch No."}
                yHeading={"Water"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"waterNMTRaw1"}
                plotLines={
                  data?.gridDatas?.manufacturingPartRawStageIIIGraph?.data
                }
                highchartData={manufacturingStageIIIDataS2 || []}
                fromCPP={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Material Attributes (CMAs) -</b> (API-II (Drying
              Stage))
            </h1>
            <p className="text-xl text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}

      {/* Analytics for CPP STage -I */}
      {data?.gridDatas?.manufacturingPartStageIII?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Process Parameters (CPPs) -</b> (Granulation: Stage-I)
          </h1>

          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"ERH of Amoxicillin"}
                xHeading={"Batch No."}
                yHeading={"ERH"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"amoxicillin"}
                plotLines={data?.gridDatas?.manufacturingPSIGraph?.data || []}
                highchartData={granulationS1Data || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Oscillating Grabulator Machine Speed"}
                xHeading={"Batch No."}
                yHeading={"Machine Speed"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"OscillatingGrabulatorMachineSpeed"}
                plotLines={data?.gridDatas?.manufacturingPSIGraph?.data || []}
                highchartData={granulationS1Data5 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Average Weight of 20 Tablets (gm) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Avg. Weight Minimum"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={2}
                fieldName={"AverageWeightof20Tablets"}
                plotLines={data?.gridDatas?.manufacturingPSIGraph?.data || []}
                // zones={paracetamolpHZones}
                // annotations={paracetamolAnnotations}
                highchartData={granulationS1Data2a || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Average Weight of 20 Tablets (gm) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Avg. Weight Maximum"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={2}
                fieldName={"AverageWeightof20Tablets"}
                plotLines={data?.gridDatas?.manufacturingPSIGraph?.data || []}
                // zones={paracetamolpHZones}
                // annotations={paracetamolAnnotations}
                highchartData={granulationS1Data2b || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) (Min.)"}
                xHeading={"Batch No."}
                d
                yHeading={"Hardness Minimum"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={2}
                fieldName={"Hardnesskgcm2"}
                plotLines={data?.gridDatas?.manufacturingPSIGraph?.data || []}
                // zones={paracetamolpHZones}
                // annotations={paracetamolAnnotations}
                highchartData={granulationS1Data3a || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness Maximum"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={2}
                fieldName={"Hardnesskgcm2"}
                plotLines={data?.gridDatas?.manufacturingPSIGraph?.data || []}
                // zones={paracetamolpHZones}
                // annotations={paracetamolAnnotations}
                highchartData={granulationS1Data3b || []}
                fromCPP={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Process Parameters (CPPs) -</b> (Granulation: Stage-I)
            </h1>
            <p className="text-xl text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}
      {/* Analytics for CPP STage -II */}
      {data?.gridDatas?.manufacturingPartStageII?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Process Parameters (CPPs) -</b> (Compression: Stage-II)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Wt. of 20 Tabs LHS"}
                xHeading={"Batch No."}
                yHeading={"Wt. LHS"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={0.25}
                fieldName={"Wtof20Tabs"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Dataa || []}
                fromCPP={true}
              />{" "}
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Wt. of 20 Tabs RHS"}
                xHeading={"Batch No."}
                yHeading={"Wt. RHS"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={0.25}
                fieldName={"Wtof20Tabs"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Datab || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Average Weight LHS"}
                xHeading={"Batch No."}
                yHeading={"Average Weight LHS"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={5}
                fieldName={"AverageWeight"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data2a || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Average Weight RHS"}
                xHeading={"Batch No."}
                yHeading={"Average Weight RHS"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={5}
                fieldName={"AverageWeight"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data2b || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) LHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={1}
                fieldName={"Hardness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data3a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) LHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={1}
                fieldName={"Hardness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data3b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) RHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={1}
                fieldName={"Hardness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data3c || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) RHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yTickInterval={1}
                fieldName={"Hardness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data3d || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Thickness LHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Thickness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={7}
                // yMin={6}
                // yTickInterval={0.1}
                fieldName={"Thickness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data4a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Thickness LHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Thickness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={7}
                // yMin={6}
                // yTickInterval={0.1}
                fieldName={"Thickness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data4b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Thickness RHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Thickness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={7}
                // yMin={6}
                // yTickInterval={0.1}
                fieldName={"Thickness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data4c || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Thickness RHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Thickness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={7}
                // yMin={6}
                // yTickInterval={0.1}
                fieldName={"Thickness"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data4d || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Friability LHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Friability"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1.2}
                // yMin={0}
                // yTickInterval={0.1}
                fieldName={"Friability"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data5a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Friability LHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Friability"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1.2}
                // yMin={0}
                // yTickInterval={0.1}
                fieldName={"Friability"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data5b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Friability RHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Friability"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1.2}
                // yMin={0}
                // yTickInterval={0.1}
                fieldName={"Friability"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data5c || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Friability RHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Friability"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1.2}
                // yMin={0}
                // yTickInterval={0.1}
                fieldName={"Friability"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data5d || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DT (Disintegration Test) LHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"DT"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={20}
                // yMin={0}
                // yTickInterval={1}
                fieldName={"DT"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data6a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DT (Disintegration Test) LHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"DT"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={20}
                // yMin={0}
                // yTickInterval={1}
                fieldName={"DT"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data6b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DT (Disintegration Test) RHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"DT"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={20}
                // yMin={0}
                // yTickInterval={1}
                fieldName={"DT"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data6c || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DT (Disintegration Test) RHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"DT"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={20}
                // yMin={0}
                // yTickInterval={1}
                fieldName={"DT"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data6d || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Uniformity of Weight (mg) LHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Uniformity of wt"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1780}
                // yMin={1560}
                // yTickInterval={10}
                fieldName={"UniformityofWeightmg"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data7a || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Uniformity of Weight (mg) LHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Uniformity of wt"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1780}
                // yMin={1560}
                // yTickInterval={10}
                fieldName={"UniformityofWeightmg"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data7b || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Uniformity of Weight (mg) RHS (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Uniformity of wt"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1780}
                // yMin={1560}
                // yTickInterval={10}
                fieldName={"UniformityofWeightmg"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data7c || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Uniformity of Weight (mg) RHS (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Uniformity of wt"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={1780}
                // yMin={1560}
                // yTickInterval={10}
                fieldName={"UniformityofWeightmg"}
                plotLines={data?.gridDatas?.manufacturingPSIIGraph?.data || []}
                highchartData={granulationS2Data7d || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Process Parameters (CPPs) -</b> (Compression:
              Stage-II)
            </h1>
            <p className="text-xl text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}
      {/* Analytics for CPP STage -III */}
      {data?.gridDatas?.manufacturingPartStageIII?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Process Parameters (CPPs) -</b> (Coating: Stage-III)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Inlet Temperature (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={65}
                // yMin={45}
                // yTickInterval={1}
                fieldName={"InletTemperature"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data1a || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Inlet Temperature (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={65}
                // yMin={45}
                // yTickInterval={1}
                fieldName={"InletTemperature"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data1b || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Outlet Temperature (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={55}
                // yMin={35}
                // yTickInterval={1}
                fieldName={"OutletTemperature"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data2a || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Outlet Temperature (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={55}
                // yMin={35}
                // yTickInterval={1}
                fieldName={"OutletTemperature"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data2b || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Atomization air pressure (kg/cm²)"}
                xHeading={"Batch No."}
                yHeading={"Air Pressure"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={3}
                // yMin={0}
                // yTickInterval={0.2}
                fieldName={"Atomizationairpressure05to25kgcm2"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data3 || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Uniformity of Wt. Coated Tablet ± 5% (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Uniformity of Weight"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={2100}
                // yMin={1300}
                // yTickInterval={50}
                fieldName={"UniformityofWeightCoatedTablet"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data4a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Uniformity of Wt. Coated Tablet ± 5% (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Uniformity of Weight"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={2100}
                // yMin={1300}
                // yTickInterval={50}
                fieldName={"UniformityofWeightCoatedTablet"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data4b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Wt. of 20 Tabs (in mg) ± 2% of average (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Weight in mg"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={35.5}
                // yMin={33}
                // yTickInterval={0.1}
                fieldName={"WtofTabsinmg5Percentofaverage"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data5a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Wt. of 20 Tabs (in mg) ± 2% of average (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Weight in mg"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={35.5}
                // yMin={33}
                // yTickInterval={0.1}
                fieldName={"WtofTabsinmg5Percentofaverage"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data5b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Weight gain (%) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Weight gain (%)"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={4}
                // yMin={0}
                // yTickInterval={0.2}
                fieldName={"WeightgainPercent"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data6a || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Weight gain (%) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Weight gain (%)"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={4}
                // yMin={0}
                // yTickInterval={0.2}
                fieldName={"WeightgainPercent"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data6b || []}
                fromCPP={true}
                // extraLines={true}
              />
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Thickness (mm) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Thickness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={7.5}
                // yMin={6.0}
                // yTickInterval={0.05}
                fieldName={"Thickness68To72mm"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data7a || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Thickness (mm) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Thickness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={7.5}
                // yMin={6.0}
                // yTickInterval={0.05}
                fieldName={"Thickness68To72mm"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data7b || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Hardness(kg/cm² or Newton) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={25}
                // yMin={2}
                // yTickInterval={2}
                fieldName={"HardnessNLT5Kgcm2"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data8a || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Hardness (kg/cm² or Newton) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Hardness"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={25}
                // yMin={2}
                // yTickInterval={2}
                fieldName={"HardnessNLT5Kgcm2"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data8b || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DT (Disintegration Test) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"DT"}
                // yMax={35}
                // yMin={0}
                // yTickInterval={1.5}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"DTdisintegrationtestNMT30mins"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data9a || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DT (Disintegration Test) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"DT"}
                // yMax={35}
                // yMin={0}
                // yTickInterval={1.5}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"DTdisintegrationtestNMT30mins"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data9b || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"ERH"}
                xHeading={"Batch No."}
                yHeading={"ERH"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={0.15}
                // yMin={0}
                // yTickInterval={0.01}
                fieldName={"ERHNMT01Percent"}
                plotLines={data?.gridDatas?.manufacturingPSIIIGraph?.data || []}
                highchartData={granulationS3Data10 || []}
                fromCPP={true}
                // extraLines={true}
                // 1764  1596
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Process Parameters (CPPs) -</b> (Coating: Stage-III)
            </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}

      {/* Analytics for CPP STage -IV */}

      {data?.gridDatas?.manufacturingPartStageIV?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Process Parameters (CPPs) -</b> (Drying: Stage-IV)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"DRYING TEMP (⁰C) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"DRYINGTEMP555oC"}
                plotLines={data?.gridDatas?.manufacturingPSIVGraph?.data || []}
                highchartData={granulationS4Data1a || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"DRYING TEMP (⁰C) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={65}
                // yMin={45}
                // yTickInterval={1}
                fieldName={"DRYINGTEMP555oC"}
                plotLines={data?.gridDatas?.manufacturingPSIVGraph?.data || []}
                highchartData={granulationS4Data1b || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Drying temperature (⁰C) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={80}
                // yMin={60}
                // yTickInterval={1}
                fieldName={"Dryingtemperature705oC"}
                plotLines={data?.gridDatas?.manufacturingPSIVGraph?.data || []}
                highchartData={granulationS4Data2a || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Drying temperature (⁰C) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Temperature"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={80}
                // yMin={60}
                // yTickInterval={1}
                fieldName={"Dryingtemperature705oC"}
                plotLines={data?.gridDatas?.manufacturingPSIVGraph?.data || []}
                highchartData={granulationS4Data2b || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>

            <div className="col-span-2">
              <DynamicLineChart
                heading={"Vacuum (mmHg)"}
                xHeading={"Batch No."}
                yHeading={"Vaccum  "}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={740}
                // yMin={680}
                // yTickInterval={5}
                fieldName={"Vacuum71020mmHg"}
                plotLines={data?.gridDatas?.manufacturingPSIVGraph?.data || []}
                highchartData={granulationS4Data3 || []}
                fromCPP={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Process Parameters (CPPs) -</b> (Drying: Stage-IV)
            </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}

      {/* Analytics for CPP STage -V */}
      {data?.gridDatas?.packingPartCriticalStageVII?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Process Parameters (CPPs) -</b> (Packing: Stage-V)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Alu Alu (Cycle/Mintue) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"RPM"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={60}
                // yMin={0}
                // yTickInterval={5}
                fieldName={"AluAlu1550CycleMintue"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data1a || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Alu Alu (Cycle/Mintue) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"RPM"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={60}
                // yMin={0}
                // yTickInterval={5}
                fieldName={"AluAlu1550CycleMintue"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data1b || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Strip (Cut/Mintue) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"RPM"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={170}
                // yMin={0}
                // yTickInterval={10}
                fieldName={"Strip1155cutmintue"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data2a || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Strip (Cut/Mintue) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"RPM"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={170}
                // yMin={0}
                // yTickInterval={10}
                fieldName={"Strip1155cutmintue"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data2b || []}
                fromCPP={true}
                // 1713.6  1646.4
              />
            </div>

            {/* <div className="">
                    <DynamicLineChart
                      heading={"Air Pressure (Min.)"}
                      xHeading={"Batch No."}
                      yHeading={"Air Pressure"}
                      uslName={"NMT"}
                      lslName={"NLT"}
                      // yMax={100}
                      // yMin={0}
                      // yTickInterval={5}
                      fieldName={"AirPressure"}
                      plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                      highchartData={granulationS5Data3a || []}
                      fromCPP={true}
                    />
                  </div> */}
            {/* <div className="">
                    <DynamicLineChart
                      heading={"Air Pressure (Max.)"}
                      xHeading={"Batch No."}
                      yHeading={"Air Pressure"}
                      uslName={"NMT"}
                      lslName={"NLT"}
                      // yMax={100}
                      // yMin={0}
                      // yTickInterval={5}
                      fieldName={"AirPressure"}
                      plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                      highchartData={granulationS5Data3b || []}
                      fromCPP={true}
                    />
                  </div> */}
            <div className="">
              <DynamicLineChart
                heading={"Sealing Temperature (⁰C) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Temp"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={160}
                // yMin={70}
                // yTickInterval={5}
                fieldName={"SealingTemperature"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data4a}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Sealing Temperature (⁰C) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Temp"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={160}
                // yMin={70}
                // yTickInterval={5}
                fieldName={"SealingTemperature"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data4b || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Alu Alu (⁰C) (Min.)"}
                xHeading={"Batch No."}
                yHeading={"Temp"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={260}
                // yMin={170}
                // yTickInterval={5}
                fieldName={"AluAlu190oCto240"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data5a || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Alu Alu (⁰C) (Max.)"}
                xHeading={"Batch No."}
                yHeading={"Temp"}
                uslName={"NMT"}
                lslName={"NLT"}
                // yMax={260}
                // yMin={170}
                // yTickInterval={5}
                fieldName={"AluAlu190oCto240"}
                plotLines={data?.gridDatas?.packingPartCSVIIGraph?.data || []}
                highchartData={granulationS5Data5b || []}
                fromCPP={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
              <b>Critical Process Parameters (CPPs) -</b> (Packing: Stage-V)
            </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}

      {/* Analytics for CPP STage -VI */}
      {data?.gridDatas?.manufacturingPartStageV?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Process Parameters (CPPs) -</b> (Yield: Stage-VI)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
            <div className="">
              <DynamicLineChart
                heading={"Granulation Yield"}
                xHeading={"Batch No."}
                yHeading={"Value"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"granulationYield"}
                plotLines={data?.gridDatas?.manufacturingPSVGraph?.data || []}
                highchartData={granulationS6Data1 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Compression Yield	"}
                xHeading={"Batch No."}
                yHeading={"Value"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"compressionYield"}
                plotLines={data?.gridDatas?.manufacturingPSVGraph?.data || []}
                highchartData={granulationS6Data2 || []}
                fromCPP={true}
              />
            </div>

            <div className="">
              <DynamicLineChart
                heading={"Coating Yield"}
                xHeading={"Batch No."}
                yHeading={"Value"}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"coatingYield"}
                plotLines={data?.gridDatas?.manufacturingPSVGraph?.data || []}
                highchartData={granulationS6Data3 || []}
                fromCPP={true}
              />
            </div>
            <div className="">
              <DynamicLineChart
                heading={"Inspection Yield"}
                xHeading={"Batch No."}
                yHeading={"Value  "}
                uslName={"NMT"}
                lslName={"NLT"}
                fieldName={"inspectionYield"}
                plotLines={data?.gridDatas?.manufacturingPSVGraph?.data || []}
                highchartData={granulationS6Data4 || []}
                fromCPP={true}
              />
            </div>
            {/* <div className="col-span-2">
                    <DynamicLineChart
                      heading={"Packing Yield"}
                      xHeading={"Batch No."}
                      yHeading={"Value"}
                      uslName={"NMT"}
                      lslName={"NLT"}
                      fieldName={"packingYield"}
                      plotLines={data?.gridDatas?.manufacturingPSVGraph?.data || []}
                      highchartData={granulationS6Data5 || []}
                      fromCPP={true}
                    />
                  </div> */}
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="bg-slate-700 mt-5 text-[28px] w-full text-white font-serif text-center">
              Stage-VI
            </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}

      {/* Analytics for CQAs (In-Process) */}
      {data?.gridDatas?.manufacturingPartStageV?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Quality Attributes (CQAs) -</b> (Review of In-process Analytical Trend Data)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
                      <div className="">
                        <DynamicLineChart
                          heading={"Water Content"}
                          xHeading={"Batch No."}
                          yHeading={"Water"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          fieldName={"waterContent"}
                          plotLines={data?.gridDatas?.manufacturingPartARStageIGraph?.data}
                          highchartData={waterContentS1Data1 || []}
                          fromCPP={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Amoxicillin"}
                          xHeading={"Batch No."}
                          yHeading={"Amoxicillin"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          fieldName={"Amoxicillin950"}
                          plotLines={data?.gridDatas?.manufacturingPartARStageIGraph?.data}
                          highchartData={waterContentS2Data2 || []}
                          fromCPP={true}
                        />
                      </div>

                      <div className="col-span-2">
                        <DynamicLineChart
                          heading={"Potassium Clavulanate"}
                          xHeading={"Batch No."}
                          yHeading={"Potassium"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          fieldName={"PotassiumClavulanate"}
                          plotLines={data?.gridDatas?.manufacturingPartARStageIGraph?.data}
                          highchartData={waterContentS3Data3 || []}
                          fromCPP={true}
                        />
                      </div>
                    </div>
        </>
      ) : (
        <>
          <div>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Quality Attributes (CQAs) -</b> (Review of In-process Analytical Trend Data)
          </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}
      {/* Analytics for CQAs (Intermediate) */}
      {data?.gridDatas?.manufacturingPartARStageIII?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Quality Attributes (CQAs) -</b> (Review of Intermediate Analytical Trend Data)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
                      <div className="">
                        <DynamicLineChart
                          heading={"Average Weight"}
                          xHeading={"Batch No."}
                          yHeading={"ERH"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          fieldName={"AverageWeight"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data1}
                          fromCPP={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Amoxicillin (Minutes) (Min.)"}
                          xHeading={"Batch No."}
                          yHeading={"Minutes"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yTickInterval={1}
                          fieldName={"AmoxicillinNLT"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data3a}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Amoxicillin (Minutes) (Max.)"}
                          xHeading={"Batch No."}
                          yHeading={"Minutes"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yTickInterval={1}
                          fieldName={"AmoxicillinNLT"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data3b}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Clavaulanic Acid (Minutes) (Min.)"}
                          xHeading={"Batch No."}
                          yHeading={"Minutes"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={7}
                          // yMin={6}
                          // yTickInterval={0.1}
                          fieldName={"ClavaulanicAcid"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data4a}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Clavaulanic Acid (Minutes) (Max.)"}
                          xHeading={"Batch No."}
                          yHeading={"Minutes"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={7}
                          // yMin={6}
                          // yTickInterval={0.1}
                          fieldName={"ClavaulanicAcid"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data4b}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Uniformity of Content (Min.)"}
                          xHeading={"Batch No."}
                          yHeading={"Minutes"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={1.2}
                          // yMin={0}
                          // yTickInterval={0.1}
                          fieldName={"UniformityofContent"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data5a}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Uniformity of Content (Max.)"}
                          xHeading={"Batch No."}
                          yHeading={"Minutes"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={1.2}
                          // yMin={0}
                          // yTickInterval={0.1}
                          fieldName={"UniformityofContent"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data5b}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Water Content"}
                          xHeading={"Batch No."}
                          yHeading={"Water"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={20}
                          // yMin={0}
                          // yTickInterval={1}
                          fieldName={"WaterContent"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data6}
                          fromCPP={true}
                          // extraLines={true}
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Amoxicillin"}
                          xHeading={"Batch No."}
                          yHeading={"Amoxicillin"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={1780}
                          // yMin={1560}
                          // yTickInterval={10}
                          fieldName={"Amoxicillin"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data7}
                          fromCPP={true}
                          // extraLines={true}
                          // 1764  1596
                        />
                      </div>
                      <div className="">
                        <DynamicLineChart
                          heading={"Calvulanic Acid"}
                          xHeading={"Batch No."}
                          yHeading={"Calvulanic Acid"}
                          uslName={"NMT"}
                          lslName={"NLT"}
                          // yMax={1780}
                          // yMin={1560}
                          // yTickInterval={10}
                          fieldName={"CalvulanicAcid"}
                          plotLines={
                            data?.gridDatas?.manufacturingPartARStageIIIGraph?.data
                          }
                          highchartData={analyticalTrendS2Data8}
                          fromCPP={true}
                          // extraLines={true}
                          // 1764  1596
                        />
                      </div>
                    </div>
        </>
      ) : (
        <>
          <div>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Quality Attributes (CQAs) -</b> (Review of Intermediate Analytical Trend Data)
          </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}

       {/* Analytics for CQAs (Finished Product) */}
       {data?.gridDatas?.packingPartARStageVA?.data?.length > 0 ? (
        <>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Quality Attributes (CQAs) -</b> (Review of Finished Product Analytical Trend as per IP/BP/USP/Ph.Eur.)
          </h1>
          <div className="grid grid-cols-2 gap-2 bg-slate-700 p-2">
                    <div className="">
                      <DynamicLineChart
                        heading={"Average Weight"}
                        xHeading={"Batch No."}
                        yHeading={"Average Weight"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"averageWeight"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDataa || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Disintegration Time"}
                        xHeading={"Batch No."}
                        yHeading={"Time"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"disintegrationTime"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDatad || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Dissolution Amoxicillin (Min.)"}
                        xHeading={"Batch No."}
                        yHeading={"Amoxicillin (Min.)"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"dissolutionAmoxicillin"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDatae || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Dissolution Amoxicillin (Max.)"}
                        xHeading={"Batch No."}
                        yHeading={"Amoxicillin (Max.)"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"dissolutionAmoxicillin"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDataf || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Dissolution Clavulanic Acid (Min.)"}
                        xHeading={"Batch No."}
                        yHeading={"Clavulanic Acid (Min.)"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"dissolutionClavulanicAcid"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDatag || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Dissolution Clavulanic Acid (Max.)"}
                        xHeading={"Batch No."}
                        yHeading={"Clavulanic Acid (Max.)"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"dissolutionClavulanicAcid"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDatah || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Uniformity of Content (Amoxicillin)"}
                        xHeading={"Batch No."}
                        yHeading={"Uniformity of Content (Amoxicillin)"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"amoxicillin"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDatai || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Uniformity of Content (Clavulanic Acid)"}
                        xHeading={"Batch No."}
                        yHeading={"Uniformity of Content (Clavulanic Acid)"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"clavulanicAcid"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendDataj || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Clav. Polymer"}
                        xHeading={"Batch No."}
                        yHeading={"Clav. Polymer"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"Clavpolymer"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendData2a || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Amoxicillin Dimer"}
                        xHeading={"Batch No."}
                        yHeading={"Amoxicillin Dimer"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"amoxicillinDimer"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendData2b || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Other Secondary Impurity"}
                        xHeading={"Batch No."}
                        yHeading={"Impurity"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"otherSecondaryImpurity"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendData2c || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Assay Amoxicillin"}
                        xHeading={"Batch No."}
                        yHeading={"Assay Amoxicillin"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"assayAmoxicillin"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendData2f || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Clavulanic Acid"}
                        xHeading={"Batch No."}
                        yHeading={"Clavulanic Acid"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"assayClavulanicAcid"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendData2g || []}
                        fromCPP={true}
                      />
                    </div>
                    <div className="">
                      <DynamicLineChart
                        heading={"Water"}
                        xHeading={"Batch No."}
                        yHeading={"Water"}
                        uslName={"NMT"}
                        lslName={"NLT"}
                        fieldName={"water"}
                        plotLines={data?.gridDatas?.packingPartARStageVAGraph?.data}
                        highchartData={productAnalyticalTrendData2h || []}
                        fromCPP={true}
                      />
                    </div>
                  </div>
        </>
      ) : (
        <>
          <div>
          <h1 className="bg-slate-700 p-2 text-2xl text-white text-center">
            <b>Critical Quality Attributes (CQAs) -</b> (Review of Intermediate Analytical Trend Data)
          </h1>
            <p className="text-xl mb-5 text-center mt-5 font-bold text-gray-600">
              No Data Found to Show Analytics
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedAnalyticsTb;
