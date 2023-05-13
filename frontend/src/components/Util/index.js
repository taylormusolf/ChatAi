export const delay =  (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}


