import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AtlasFeedbackIssue as TIssue,
  AtlasFeedbackComment as TComment,
  EditCommentInput,
  AtlasFeedbackIssuesState,
  makeExistingCommentValidator,
  DeleteCommentInput,
} from "../../../document-models/atlas-feedback-issues";
import { useCallback } from "react";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "./form";
import { Textarea } from "./text-area";

export function EditCommentForm(props: {
  readonly issue: TIssue;
  readonly comment: TComment;
  readonly state: AtlasFeedbackIssuesState;
  readonly isEditing: boolean;
  readonly onSubmitEditComment: (input: EditCommentInput) => void;
  readonly handleDeleteComment: (input: DeleteCommentInput) => void;
  readonly onCancel: () => void;
}) {
  const {
    issue,
    comment,
    state,
    isEditing,
    onSubmitEditComment,
    handleDeleteComment,
    onCancel,
  } = props;
  const schema = makeExistingCommentValidator(state);

  const defaultValues = {
    content: comment.content,
    notionId: comment.notionId,
    issuePhid: issue.phid,
    phid: comment.phid,
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof schema>) => {
      onSubmitEditComment({
        ...data,
        editedAt: new Date().toISOString(),
      });
    },
    [onSubmitEditComment],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        form.reset(defaultValues);
        event.currentTarget.blur();
        onCancel();
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    },
    [form, onSubmit, onCancel, defaultValues],
  );

  const onBlur = useCallback(() => {
    form.reset(defaultValues);
    onCancel();
  }, [form, defaultValues, onCancel]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  autoFocus
                  className="text-right"
                  disabled={!isEditing}
                  onBlur={onBlur}
                  onKeyDown={onKeyDown}
                  rows={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
