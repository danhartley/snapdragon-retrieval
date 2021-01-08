export const fetchLessons = () => {
    return fetch('/.netlify/functions/get-lessons').then((response) => {
      return response.json()
    })
  };