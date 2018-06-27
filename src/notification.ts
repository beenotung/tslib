import {createDefer} from "./async/defer";

export function isSupportNotification (): boolean {
  return "Notification" in window;
}

export async function requireNotification (): Promise<boolean> {
  if (!isSupportNotification()) {
    return false;
  }
  const defer = createDefer<boolean, any>();
  Notification.requestPermission((res) => {
    if (res === "granted") {
      defer.resolve(true);
    } else if (res === "denied") {
      defer.resolve(false);
    } else {
      defer.reject(new Error("unexpected result:" + res));
    }
  });
  return defer.promise;
}

/**
 * alert can be used as fallback, otherwise will reject the promise
 * */
export async function showNotification (msg: string, options: NotificationOptions, useAlert = true) {
  function fallback () {
    if (useAlert) {
      return alert(msg);
    } else {
      throw new Error("Notification is not supported");
    }
  }

  if (!await requireNotification() || !("ServiceWorkerRegistration" in window)) {
    return fallback();
  }
  try {
    return ServiceWorkerRegistration.prototype.showNotification(msg, options);
  } catch (e) {
    try {
      return new Notification(msg, options);
    } catch (e) {
      return fallback();
    }
  }
}
