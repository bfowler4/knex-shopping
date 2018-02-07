module.exports = handleError;

function handleError(err, response) {
  switch (err.code) {
    case `user404`:
      return response.status(404).json({ message: `User was not found` });
    case `product404`:
      return response.status(404).json({ message: `Product was not found` });
    case `23505`:
      let errorMessage;
      if (err.detail.split(`=`)[0].includes(`title`)) {
        errorMessage = `A product witht that title already exists`;
      } else {
        errorMessage = `A user with that email already exists`;
      }

      return response.status(400).json({ message: errorMessage });
    case `22P02`:
      return response.status(400).json({ message: `Invalid input, ID should be an integer` });
    default:
      console.log(err);
      return response.status(400).json({ message: err.message });
  }
}