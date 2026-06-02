const steps = ['Business Profile', 'Business Assets', 'Generate Content', 'Export Post']

export function ProgressIndicator({
  availableSteps,
  currentStep,
  onStepClick,
}: {
  availableSteps?: number[]
  currentStep: number
  onStepClick?: (step: number) => void
}) {
  const enabledSteps = availableSteps ?? [currentStep]

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isComplete = stepNumber < currentStep
          const isClickable = enabledSteps.includes(stepNumber) && !isActive && Boolean(onStepClick)
          const isUnavailable = !enabledSteps.includes(stepNumber)
          const content = (
            <>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-md text-sm font-bold ${
                  isActive || isComplete ? 'bg-emerald-950 text-white' : 'bg-stone-100 text-zinc-500'
                }`}
              >
                {stepNumber}
              </span>
              <div>
                <p className={`text-sm font-semibold ${isActive ? 'text-zinc-950' : isUnavailable ? 'text-zinc-400' : 'text-zinc-500'}`}>{step}</p>
                <p className="text-xs text-zinc-400">{isComplete ? 'Complete' : isActive ? 'Current step' : isUnavailable ? 'Locked' : 'Available'}</p>
              </div>
            </>
          )

          return isClickable ? (
            <button className="flex items-center gap-3 rounded-md text-left transition hover:bg-stone-50" key={step} onClick={() => onStepClick?.(stepNumber)} type="button">
              {content}
            </button>
          ) : (
            <div className={`flex items-center gap-3 ${isUnavailable ? 'opacity-70' : ''}`} key={step}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
