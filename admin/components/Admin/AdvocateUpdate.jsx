import React from "react";
import { useParams } from "react-router-dom";
import EditAdvocateGeneralInfo from "./EditAdvocateGeneralInfo";
import AdvocateUpdateAdditionalInfo from "./AdvocateUpdateAdditionalInfo";

function AdvocateUpdate() {
  const { id } = useParams();

  return (
    <div className="flex flex-row gap-8 p-4">
      {/* Left section */}
      <div className="flex-1">
        <EditAdvocateGeneralInfo id={id} />
      </div>

      {/* Right section */}
      <div className="flex-1">
        <AdvocateUpdateAdditionalInfo id={id} />
      </div>
    </div>
  );
}

export default AdvocateUpdate;
