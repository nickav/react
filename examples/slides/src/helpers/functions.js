export const getFunction = (source, identifier) => {
  const prefixes = ['const', 'let', 'var', 'function'];
  const startIndex = prefixes
    .map((prefix) => source.indexOf(prefix + ' ' + identifier))
    .find((index) => index >= 0);

  if (!startIndex) return;

  let index = source.indexOf('{', startIndex);

  const endIndex = findMatchingBrace(source, index, '{', '}');
  return source.substring(startIndex, endIndex);
};

export const findMatchingBrace = (
  source,
  startIndex,
  openBrace,
  closeBrace
) => {
  const startChar = source.charAt(startIndex);
  const matchForward = startChar === openBrace;
  const matchBackward = startChar === closeBrace;

  if (!matchForward && !matchBackward) {
    throw `index must be ${openBrace}`;
  }

  const dir = matchForward ? 1 : -1;
  let index = startIndex + dir;
  let counter = 1;

  while (counter > 0 && index < source.length && index > 0) {
    const char = source.charAt(index);

    if (char === openBrace) {
      counter += dir;
    }

    if (char === closeBrace) {
      counter -= dir;
    }

    index += dir;
  }

  return counter === 0 ? index : -1;
};
