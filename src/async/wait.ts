export async function waitFor<A> (predictor: () => boolean | any, producer: () => A, interval = 0): Promise<A> {
  return new Promise<A>((resolve) => {
    const check = () => {
      if (predictor()) {
        resolve(producer());
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}

export async function later (delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function runLater<A> (f: () => A, delay = 0): Promise<A> {
  return new Promise<A>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(f());
      } catch (e) {
        reject(e);
      }
    }, delay);
  });
}
