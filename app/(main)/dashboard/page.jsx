import React from "react";
import History from "./_components/History";
import Feedback from "./_components/Feedback";
import FeatureAssistants from "./_components/FeatureAssistants";
function Dashboard() {
  return (
    <div>
      <FeatureAssistants />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
        <History />
        <Feedback />
      </div>
    </div>
  );
}

export default Dashboard;
