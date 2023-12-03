const validateHostname = (hostname: string): boolean => {
  const hostnameParts = hostname.split('.');

  if (hostnameParts.length < 2) {
    return false;
  }
  
  for (const hostnamePart in hostnameParts) {
    if (hostnamePart.replaceAll(' ', '').length < 1) {
      return false;
    }
  }

  return true;
}

export default validateHostname;