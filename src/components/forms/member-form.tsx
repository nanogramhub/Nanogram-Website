import { useForm } from "@tanstack/react-form";

import { memberFormSchema, type MemberFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/use-auth-store";
import { type Nanogram } from "@/types/schema";

import ImageUploader from "../shared/default/image-uploader";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SegmentedTabs } from "../ui/segmented-tabs";

interface MemberFormProps {
  member?: Nanogram;
  onSubmit: (values: MemberFormValues) => void;
}

const MemberForm = ({ member, onSubmit }: MemberFormProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const form = useForm({
    defaultValues: {
      name: member?.name || "",
      role: member?.role || "",
      core: member?.core ?? true,
      priority: member?.priority || 0,
      content: member?.content ? member.content : undefined,
      avatar: member?.avatarUrl ? member.avatarUrl : undefined,
      linkedin: member?.linkedin ? member.linkedin : undefined,
      github: member?.github ? member.github : undefined,
      instagram: member?.instagram ? member.instagram : undefined,
    } as MemberFormValues,
    validators: {
      onChange: memberFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  if (!currentUser) return null;

  return (
    <form
      id="member-form"
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
            name="avatar"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="avatar">Select Avatar</FieldLabel>
                  <ImageUploader
                    onFileChange={(file) => field.handleChange(file)}
                    initialFileUrl={member?.avatarUrl || ""}
                    enableImageCropping={true}
                    cropAspectRatio={0.8}
                    className="bg-card max-w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter member name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter member role"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="core"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <SegmentedTabs
                    id={field.name}
                    options={[
                      { value: false, label: "Alumini" },
                      { value: true, label: "Core" },
                    ]}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="priority"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="priority">Priority</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="content"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="content">
                    Content{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Member Testimonial"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="linkedin"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="linkedin">
                    LinkedIn{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter member linkedin url"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="github"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="github">
                    GitHub{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter member github url"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="instagram"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="instagram">
                    Instagram{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter member instagram url"
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

export default MemberForm;
