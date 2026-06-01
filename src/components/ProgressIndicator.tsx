const steps = ['Business Profile', 'Business Assets', 'Generate Content', 'Export Post']

export function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isComplete = stepNumber < currentStep

          return (
            <div className="flex items-center gap-3" key={step}>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-md text-sm font-bold ${
                  isActive || isComplete ? 'bg-emerald-950 text-white' : 'bg-stone-100 text-zinc-500'
                }`}
              >
                {stepNumber}
              </span>
              <div>
                <p className={`text-sm font-semibold ${isActive ? 'text-zinc-950' : 'text-zinc-500'}`}>{step}</p>
                <p className="text-xs text-zinc-400">{isComplete ? 'Complete' : isActive ? 'Current step' : 'Next'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
