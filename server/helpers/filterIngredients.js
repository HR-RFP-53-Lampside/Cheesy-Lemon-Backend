const removeNewLines = (string) => {
  string.trim();
  for (let i = 0; i < string.length; i += 1) {
    if (string[i] === '\n') {
      if (i > string.length / 2) {
        return string.slice(0, i);
      }
      return string.slice(i + 1);
    }
  }
  return string;
};

module.exports = (input) => {
  const receiptItems = input.line_items;
  const ingredientsFull = receiptItems.filter((item) => item.type === 'food');
  const ingredients = ingredientsFull.map((item) => removeNewLines(item.description).toLowerCase());
  return ingredients.join('\n');
};
