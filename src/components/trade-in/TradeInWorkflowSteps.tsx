import type { ApiTradeIn } from '../../lib/tradeIn'
import { getTradeInWorkflowSteps } from '../../lib/tradeIn'

export default function TradeInWorkflowSteps({ tradeIn, compact = false }: { tradeIn: ApiTradeIn; compact?: boolean }) {
  const steps = getTradeInWorkflowSteps(tradeIn)

  return (
    <ol className={`space-y-0 ${compact ? '' : 'mt-3'}`}>
      {steps.map((step, i) => (
        <li key={step.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                step.done ? 'bg-[#127058]' : step.active ? 'bg-[#ef9f27] ring-4 ring-[#ef9f27]/20' : 'bg-gray-300'
              }`}
            />
            {i < steps.length - 1 && <span className="w-px flex-1 min-h-[1.25rem] bg-gray-200 my-0.5" />}
          </div>
          <div className={`pb-3 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
            <p className={`font-semibold ${step.active ? 'text-[#127058]' : 'text-gray-800'} ${compact ? 'text-xs' : 'text-sm'}`}>
              {step.label}
            </p>
            {step.detail && (
              <p className={`text-gray-500 ${compact ? 'text-[10px]' : 'text-xs'} mt-0.5`}>{step.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
