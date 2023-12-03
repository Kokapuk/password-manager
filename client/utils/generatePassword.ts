const passwordLength = 20;

const generatePassword = () => {
  const characterSet = '1234567890qwertyuiopasdfghjklzxcvbnm!#$&*';
  let password = '';

  while (password.length < passwordLength + 1) {
    let character = characterSet[Math.floor(Math.random() * characterSet.length)];

    if (Math.random() >= 0.5) {
      character = character.toUpperCase();
    }

    password += character;
  }

  return password;
};

export default generatePassword;
