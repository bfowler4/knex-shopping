module.exports = handleError;

function handleError(err, response) {
  switch (err.code) {
    case `user404`:
      return response.status(404).json({ message: `User was not found` });
    case `product404`:
      return response.status(404).json({ message: `Product was not found` });
    case `23505`:
      return response.status(400).json({ message: `User already exists` });
    case `22P02`:
      return response.status(400).json({ message: `Invalid input, ID should be an integer` });
    default:
      return response.status(400).json({ message: err.message });
  }
}