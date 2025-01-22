import {
  AtlasFeedbackIssuesState,
  DeleteCommentInput,
  EditCommentInput,
  AtlasFeedbackIssue,
  AtlasFeedbackComment as TComment,
} from "document-models/atlas-feedback-issues";
import { User } from "document-model/document";
import { Comment } from "./comment";
type Props = {
  notionId: string;
  issue: AtlasFeedbackIssue;
  handleDeleteComment: (input: DeleteCommentInput) => void;
  handleEditComment: (input: EditCommentInput) => void;
  state: AtlasFeedbackIssuesState;
  user: User;
};
export function Comments(props: Props) {
  const {
    notionId,
    issue,
    handleDeleteComment,
    handleEditComment,
    state,
    user,
  } = props;
  const comments = state.issues.find((i) => i.phid === issue.phid)?.comments;
  if (!comments) return null;

  return (
    <ul>
      {comments
        .filter((c) => c.notionId === notionId)
        .map((comment) => (
          <li className="my-2" key={comment.phid}>
            <Comment
              comment={comment}
              handleDeleteComment={handleDeleteComment}
              handleEditComment={handleEditComment}
              issue={issue}
              state={state}
              user={user}
            />
          </li>
        ))}
    </ul>
  );
}
