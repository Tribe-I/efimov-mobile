// Минимальная типизация process.env для EXPO_PUBLIC_* переменных.
// Полные типы генерируются в expo-env.d.ts при запуске `npx expo start`
// (файл в .gitignore, поэтому объявляем здесь).
declare const process: {
  env: {
    EXPO_PUBLIC_COMMIT?: string;
  };
};
