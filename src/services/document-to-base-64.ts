export const documentToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (): void => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('No result from reading file as data URL'));
      }
    };

    reader.onerror = (error): void => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
