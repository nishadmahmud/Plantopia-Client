export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCountryCode = (countryName) => {
  const countryCodes = {
    'Bangladesh': 'BD',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    // Add more countries as needed
  };

  if (countryName && countryCodes[countryName]) {
    return countryCodes[countryName];
  }

  // Return the original value if not found, or a default
  // This will help in debugging if a country is not in the list
  return countryName;
}; 