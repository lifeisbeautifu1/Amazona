export const getError = (error: any) => {
  console.log(error);
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
