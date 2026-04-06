import { useForm } from "@tanstack/react-form";

import { formatFileSize } from "@/lib/utils";
import { postFormSchema, type PostFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/use-auth-store";
import { type Post } from "@/types/schema";

import ImageUploader from "../shared/default/image-uploader";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

interface PostFormProps {
  post?: Post;
  onSubmit: (values: PostFormValues) => void;
}

const PostForm = ({ post, onSubmit }: PostFormProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const form = useForm({
    defaultValues: {
      creator: currentUser?.$id || "",
      caption: post?.caption || "",
      tags: post?.tags || [],
      image: post?.imageUrl || null,
      quality: 0.8,
    } as PostFormValues,
    validators: {
      onChange: postFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  if (!currentUser) return null;

  return (
    <form
      id="post-form"
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
            name="caption"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="caption">Caption</FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="What's on your mind?"
                    className="min-h-[120px]"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="tags"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="tags">Tags (comma separated)</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value.join(", ")}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                          ? e.target.value.split(",").map((tag) => tag.trim())
                          : [],
                      )
                    }
                    placeholder="tag1, tag2, tag3"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
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
                    initialFileUrl={post?.imageUrl || ""}
                    enableImageCropping={true}
                    className="bg-card max-w-full"
                    quality={form.getFieldValue("quality")}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="quality"
            children={(field) => {
              const imageFile = form.getFieldValue("image");
              return (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="quality">
                      Compression Quality: {Math.round(field.state.value * 100)}
                      %
                    </FieldLabel>
                    {imageFile instanceof File && (
                      <span className="text-xs font-medium text-primary">
                        {formatFileSize(imageFile.size)}
                      </span>
                    )}
                  </div>
                  <Slider
                    id={field.name}
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={[field.state.value]}
                    onValueChange={(val) => {
                      const newVal = Array.isArray(val) ? val[0] : val;
                      field.handleChange(newVal);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Lower quality results in smaller file size.
                  </p>
                </Field>
              );
            }}
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default PostForm;
