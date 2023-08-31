export const page = dedent`
  {
    ...pageFields
  }
`;

function dedent(strings, ...parts) {
  return strings.reduce((acc, str, i) => {
    return acc + str.replace(/^\s+/gm, '\n') + (parts[i] || '').replace(/^\s+/gm, '\n');
  }, '');
}
