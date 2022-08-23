/**
 * Generate created at.
 * @returns Created at.
 */
function generateCreatedAt() {
  return new Date().toISOString()
}

module.exports = generateCreatedAt
