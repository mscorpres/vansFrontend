import React from "react";
import { noaccess } from "../../assets/noaccess.png";
function ChildMarkup() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <img src={noaccess} alt="no access" />
    </div>
  );
}

export default ChildMarkup;
