import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation";
import { Input } from "../ui/input";

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => void;
}

const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
  const form = useForm({
    defaultValues: {
      email: "",
    } as ForgotPasswordFormValues,
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      id="forgot-password-form"
      className="flex flex-col gap-3 w-full mx-auto text-justify py-5"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldSet>
        <FieldGroup>
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="johndoe@domain.com"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default ForgotPasswordForm;
