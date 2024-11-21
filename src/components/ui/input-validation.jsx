import * as React from "react";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";

const InputValidation = React.forwardRef(
    ({ validation, onChange, className, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState(true);
    const [validationMessage, setValidationMessage] = React.useState("");

    const handleChange = (e) => {
        const newValue = e.target.value;

        if (onChange) {
            onChange(e);
        }
        if (validation) {
            const { isValid, message } = validation(newValue);
            setIsValid(isValid);
            setValidationMessage(message);
        } else {
            setIsValid(true);
            setValidationMessage("");
        }
    };

    React.useEffect(() => {
        if (props.value.length > 0){
            if (validation) {
                const { isValid, message } = validation(props.value);
                setIsValid(isValid);
                setValidationMessage(message);
            } else {
                setIsValid(true);
                setValidationMessage("");
            }
        }
    }, []);

    return (
        <div className={cn("grid w-full items-center gap-1.5", className)}>
            <Input
                onChange={handleChange}
                className={cn(
                    "transition-colors duration-200",
                    !isValid && "border-red-500 focus-visible:ring-red-500",
                    className // Merge the external className with the existing styles
                )}
                aria-invalid={!isValid}
                ref={ref} // Forward the ref to the Input component
                {...props} // Spread all other props to the Input component
            />
            {!isValid && (
                <p className="text-xs text-red-500" role="alert">
                    {validationMessage || "Please enter a valid value"}
                </p>
            )}
        </div>
    );
});

InputValidation.displayName = "InputValidation";

export default InputValidation;
