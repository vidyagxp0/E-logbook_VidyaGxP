import React from "react";
import eLogIntelligenceUrl from "./eLogIntelligence.html?url";
import HeaderTop from "../components/Header/HeaderTop";

const ELogIntelligence = () => {
  return (
    <>
     <HeaderTop />
     <div className="w-full h-screen overflow-hidden mx-auto ">
      <iframe
        title="Vidya ELog Intelligence"
        src={eLogIntelligenceUrl}
        className="w-full h-full border-0"
      />
    </div>
  </>
  );
};

export default ELogIntelligence;
