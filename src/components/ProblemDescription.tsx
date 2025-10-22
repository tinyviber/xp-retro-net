import { ExerciseDefinition } from "@/types/network";

interface ProblemDescriptionProps {
  exercise: ExerciseDefinition;
}

export const ProblemDescription = ({ exercise }: ProblemDescriptionProps) => {
  return (
    <div className="win-window h-full">
      <div className="win-titlebar">
        <span className="text-sm font-semibold">{exercise.title}</span>
      </div>
      <div className="p-4 space-y-4 text-left text-sm leading-relaxed">
        <div>
          <h3 className="font-semibold mb-1">概述</h3>
          <p>{exercise.summary}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">场景背景</h3>
          <p>{exercise.scenario}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">排查目标</h3>
          <ul className="list-disc ml-5 space-y-1">
            {exercise.objectives.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">提示</h3>
          <ul className="list-disc ml-5 space-y-1">
            {exercise.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
