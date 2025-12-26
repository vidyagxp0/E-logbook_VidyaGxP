const WorkflowStepper = ({
  stages = [],
  currentStage = 1,
  finalStageColor = "bg-red-500",
}) => {
  const getStageClasses = (stageId) => {
    if (currentStage > stageId) {
      return "bg-green-500 text-white";
    }

    if (currentStage === stageId) {
      return stageId === stages.length
        ? `${finalStageColor} text-white`
        : "bg-orange-500 text-white";
    }

    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="bg-slate-300 py-4 rounded-md">
      <div className="flex gap-3 flex-wrap items-center justify-center">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`px-6 py-2 rounded-lg font-semibold text-center transition-all
              ${getStageClasses(stage.id)}
            `}
          >
            {stage.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStepper;
