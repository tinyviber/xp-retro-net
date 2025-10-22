import { ExerciseDefinition } from "@/types/network";

interface ProblemDescriptionProps {
  exercise: ExerciseDefinition;
}

export const ProblemDescription = ({ exercise }: ProblemDescriptionProps) => {
  return (
    <div className="bg-white border-2 border-[hsl(var(--border))] p-4 space-y-4 text-left text-sm leading-relaxed">
      <div>
        <h2 className="text-base font-semibold mb-1">{exercise.title}</h2>
        <p className="text-black/80">{exercise.summary}</p>
      </div>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">场景背景</h3>
        <p className="text-black/80 whitespace-pre-line">{exercise.scenario}</p>
      </section>





      <section>
        <h3 className="font-semibold text-[13px] mb-1">验证方法</h3>
        <ol className="list-decimal ml-5 space-y-1">
          {exercise.verificationSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">课堂提示</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </section>

    </div>
  );
};
