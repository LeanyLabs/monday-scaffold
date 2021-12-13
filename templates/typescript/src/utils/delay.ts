export async function delay(timeMs: number) {
  return new Promise((res) => {
    setTimeout(res, timeMs);
  });
}

export async function watchdog(action: Promise<any>, timeMs: number) {
  const timeout = delay(timeMs).then(() => {
    throw new Error('Timeout error');
  });
  return Promise.race([action, timeout]);
}
