// src/components/Admin/TourDomesticManagement/TourStepper.jsx
const TourStepper = ({ currentStep }) => {
    const steps = [
        { label: "Location", key: "location" },
        { label: "Details", key: "details" },
    ];

    const isActive = (step) => currentStep === step;
    const isCompleted = (step) =>
        steps.findIndex((s) => s.key === step) <= steps.findIndex((s) => s.key === currentStep);

    return (
        <div className="flex items-center justify-center mt-4 mb-6">
            {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                    {/* Nút tròn */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${isCompleted(step.key) ? "bg-blue-600 text-white" : "bg-white border-2 border-gray-300 text-gray-400"}`}
                        >
                            ✓
                        </div>
                        <span className={`mt-2 text-sm ${isCompleted(step.key) ? "text-black" : "text-gray-400"}`}>
                    {step.label}
                </span>
                    </div>

                    {/* Đường kẻ nối */}
                    {index < steps.length - 1 && (
                        <div className="w-24 h-0.5 bg-gray-300 mx-4"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TourStepper;
