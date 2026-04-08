import { useForm } from "@tanstack/react-form";

import {
  newsLetterFormSchema,
  type NewsLetterFormValues,
} from "@/lib/validation";
import type { Newsletter } from "@/types/schema";

import FileUploader from "../shared/default/file-uploader";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onSubmit: (values: NewsLetterFormValues) => void;
}

const NewsletterForm = ({ newsletter, onSubmit }: NewsletterFormProps) => {
  const form = useForm({
    defaultValues: {
      title: newsletter?.title || "",
      file: newsletter?.fileUrl || null,
    } as NewsLetterFormValues,
    validators: {
      onChange: newsLetterFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      id="newsletter-form"
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
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="caption">Caption</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Newsletter title"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="file"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="caption">Caption</FieldLabel>
                  <FileUploader
                    id={field.name}
                    onFileChange={(file) => field.handleChange(file)}
                    initialFileUrl={newsletter?.fileUrl || ""}
                    initialFileName={newsletter?.title || ""}
                    acceptedFileTypes={{
                      "application/pdf": [".pdf"],
                    }}
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

export default NewsletterForm;
