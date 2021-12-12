export function permute<T>(
  elements: T[],
  includes?: (arr: T[], item: T) => boolean,
): Array<T[]> {
  const result: Array<T[]> = [];

  const backtrack = (elements: T[], temp: T[]) => {
    if (temp.length === elements.length) {
      result.push(temp.slice());
      return;
    }

    elements.forEach(function (el) {
      if (includes && typeof includes === 'function') {
        if (!includes(temp, el)) {
          temp.push(el);
          backtrack(elements, temp);
          temp.pop();
        }
      } else {
        if (!temp.includes(el)) {
          temp.push(el);
          backtrack(elements, temp);
          temp.pop();
        }
      }
    });
  };

  backtrack(elements, []);
  return result;
}
