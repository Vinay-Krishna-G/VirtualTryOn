/**
 * components/StepIndicator.jsx
 *
 * Why this component exists:
 *   We have a 4-step flow: Upload → Select → Generate → Result.
 *   The user needs to always see where they are in that journey.
 *   This component shows a visual breadcrumb at the top of the page.
 *
 * Input (props):
 *   - currentStep (number): which step the user is on, 1 through 4
 *
 * Output:
 *   - Renders a horizontal row of step circles and labels
 *   - Completed steps are filled purple
 *   - The current step pulses
 *   - Future steps are grey
 */

const STEPS = [
  { number: 1, label: "Upload Photo", icon: "📸" },
  { number: 2, label: "Select Garment", icon: "👘" },
  { number: 3, label: "Generate", icon: "✨" },
  { number: 4, label: "Result", icon: "🎉" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 my-8 px-4">
      {STEPS.map((step, index) => {
        // Figure out the visual state of each step
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isFuture = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center">
            {/* --- The Step Circle + Label --- */}
            <div className="flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  // Completed: filled purple
                  // Current: glowing purple border
                  // Future: grey
                  background: isCompleted
                    ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                    : isCurrent
                    ? "rgba(124, 58, 237, 0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: isCurrent
                    ? "2px solid #7c3aed"
                    : isCompleted
                    ? "2px solid #7c3aed"
                    : "2px solid rgba(255,255,255,0.1)",
                  boxShadow: isCurrent
                    ? "0 0 20px rgba(124,58,237,0.5)"
                    : "none",
                  animation: isCurrent ? "pulse-glow 2s infinite" : "none",
                  color: isFuture ? "#4b5563" : "white",
                }}
              >
                {/* Show a checkmark for completed, icon for current/future */}
                {isCompleted ? "✓" : step.icon}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: isCurrent ? "600" : "400",
                  color: isFuture
                    ? "#4b5563"
                    : isCurrent
                    ? "#a78bfa"
                    : "#94a3b8",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* --- Connector Line between steps --- */}
            {/* Don't render a line after the last step */}
            {index < STEPS.length - 1 && (
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  margin: "0 4px",
                  marginBottom: "20px",  /* offset to align with circle center */
                  background: isCompleted
                    ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                    : "rgba(255,255,255,0.08)",
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
