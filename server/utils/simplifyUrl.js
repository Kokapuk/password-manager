export default (website) => {
  if (!website) {
    return undefined;
  }

  website = website.toLowerCase().replaceAll(' ', '').replace('http://', '').replace('https://', '').replace('www.', '');
  return website.split('/')[0];
};
