import { useForm } from "@tanstack/react-form";

import { eventFormSchema, type EventFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/use-auth-store";
import { type Event } from "@/types/schema";

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
import { DateTimePicker } from "../ui/datetime-picker";
import { Switch } from "../ui/switch";

interface EventFormProps {
  event?: Event;
  onSubmit: (values: EventFormValues) => void;
}

const EventForm = ({ event, onSubmit }: EventFormProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const form = useForm({
    defaultValues: {
      title: event?.title || "",
      subtitle: event?.subtitle || "",
      description: event?.description || "",
      content: event?.content || "",
      completed: event?.completed || false,
      date: event?.date || new Date().toISOString(),
      location: event?.location || "",
      registration: event?.registration ? event.registration : undefined,
      image: event?.imageUrl || "",
    } as EventFormValues,
    validators: {
      onChange: eventFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  if (!currentUser) return null;

  return (
    <form
      id="event-form"
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
            name="image"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="image">Select Image</FieldLabel>
                  <ImageUploader
                    onFileChange={(file) => field.handleChange(file)}
                    initialFileUrl={event?.imageUrl || ""}
                    enableImageCropping={true}
                    cropAspectRatio={16 / 9}
                    className="bg-card max-w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Event title"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="subtitle"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="subtitle">Subtitle</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Event type"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Event description"
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
                    placeholder="Explain the event"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="completed"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="completed">Completed</FieldLabel>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="date"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="date">Date & Time</FieldLabel>
                  <DateTimePicker
                    id={field.name}
                    value={new Date(field.state.value)}
                    onChange={(e) =>
                      field.handleChange(
                        e ? e.toISOString() : new Date().toISOString(),
                      )
                    }
                    placeholder="Event date and time"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="location"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Event location"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="registration"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="registration">
                    Registration Link
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Event registration link"
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

export default EventForm;
