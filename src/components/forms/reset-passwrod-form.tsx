import { useForm } from "@tanstack/react-form";

import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/lib/validation";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { PasswordInput } from "../ui/password-input";

interface ResetPasswordFormProps {
  userId: string;
  secret: string;
  onSubmit: (values: ResetPasswordFormValues) => void;
}

const ResetPasswordForm = ({
  userId,
  secret,
  onSubmit,
}: ResetPasswordFormProps) => {
  const form = useForm({
    defaultValues: {
      userId,
      secret,
      password: "",
    } as ResetPasswordFormValues,
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });
  return (
    <form
      id="reset-password-form"
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
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="********"
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

export default ResetPasswordForm;
