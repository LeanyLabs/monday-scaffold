export async function delay(timeMs) {
  return new Promise((res) => {
    setTimeout(res, timeMs);
  });
}
