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

      <section className="space-y-3">
        <h3 className="font-semibold text-[13px]">初始配置</h3>
        <div className="grid gap-3">
          <div>
            <h4 className="text-xs font-semibold text-black/80 uppercase tracking-wide">路由器</h4>
            <ul className="list-disc ml-5 space-y-1">
              {exercise.initialSetup.router.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-black/80 uppercase tracking-wide">电脑</h4>
            <ul className="list-disc ml-5 space-y-1">
              {exercise.initialSetup.computer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">允许操作</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.allowedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">典型现象</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.symptoms.map((symptom) => (
            <li key={symptom}>{symptom}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">排查目标</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.objectives.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">建议排查步骤</h3>
        <ol className="list-decimal ml-5 space-y-1">
          {exercise.resolution.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
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
        <h3 className="font-semibold text-[13px] mb-1">可用 Ping 目标</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.pingTargets.map((target) => (
            <li key={target.name}>
              <span className="font-medium">{target.name}</span>
              {target.description && <span className="text-black/70"> — {target.description}</span>}
              <span className="block text-black/60 text-xs">地址：{target.ip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">课堂提示</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-[13px] mb-1">要点提醒</h3>
        <ul className="list-disc ml-5 space-y-1">
          {exercise.takeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
