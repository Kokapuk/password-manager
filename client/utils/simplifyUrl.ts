import validateHostname from "./validateHostname";

const simplifyUrl = (website: string) => {
  website = website
    .toLowerCase()
    .replaceAll(' ', '')
    .replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .split('/')[0];

  if (!validateHostname(website)) {
    return '';
  }

  return website;
};

export default simplifyUrl;
