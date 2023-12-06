export function formatUniqueCode(str: string) {
  if (str.length !== 12) {
    throw new Error('The string must be exactly 12 characters long.');
  }

  return str.replace(/(.{4})/g, '$1 ').trim();
}

const isModifierKey = (event: any) => {
  const key = event.keyCode;
  return (
    event.shiftKey === true ||
    key === 35 ||
    key === 36 ||
    key === 8 ||
    key === 9 ||
    key === 13 ||
    key === 46 ||
    (key > 36 && key < 41) ||
    ((event.ctrlKey === true || event.metaKey === true) &&
      (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
  );
};

export const formatUniqueCodeWhileTyping = (event: any) => {
  if (isModifierKey(event)) {
    return;
  }

  const input = event.target.value
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 12);
  let formattedString = '';

  for (let i = 0; i < input.length; i++) {
    if (i !== 0 && i % 4 === 0) {
      formattedString += ' ';
    }
    formattedString += input[i];
  }

  return formattedString;
};

export const trimSpace = (str: string) => {
  return str.replace(/[^\d]/g, '');
};
