/**
 * Generate created at.
 * @returns Created at.
 */
export default function generateCreatedAt(): string {
  return new Date().toISOString()
}
