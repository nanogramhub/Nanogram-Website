/**
 * Regex to detect nanogram:// protocol links in message content.
 * Matches: nanogram://<postId>
 * The postId is captured in the first group.
 */
export const NANOGRAM_POST_REGEX = /^nanogram:\/\/(.+)$/;

/**
 * Checks if a message content string is a nanogram:// post link.
 * Returns the postId if found, otherwise null.
 */
export function extractPostId(content: string): string | null {
  const match = content.trim().match(NANOGRAM_POST_REGEX);
  return match ? match[1] : null;
}
