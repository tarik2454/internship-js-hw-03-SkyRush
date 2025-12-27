# Рекомендации по улучшению проекта

Этот документ содержит рекомендации по улучшению кодовой базы проекта Blaze Casino.

## 🔴 Высокий приоритет

### 1. Переменные окружения

**Проблема:** URL API захардкожен в коде, что усложняет смену окружений.

**Текущий код:**
```typescript
// src/config/auth-api.ts
export const API = axios.create({
  baseURL: "https://backend-internship-js-hw-03-sky-rus.vercel.app/api",
});
```

**Решение:**
```typescript
// src/config/auth-api.ts
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://backend-internship-js-hw-03-sky-rus.vercel.app/api",
});
```

**Действия:**
1. Создать файл `.env.example`:
```
VITE_API_BASE_URL=https://backend-internship-js-hw-03-sky-rus.vercel.app/api
```

2. Создать `.env.local` для локальной разработки
3. Добавить `.env.local` в `.gitignore`

**Файлы для изменения:**
- `src/config/auth-api.ts`
- Создать `.env.example`

---

### 2. Централизованная обработка ошибок

**Проблема:** Логика обработки ошибок дублируется в каждом компоненте.

**Текущий код:**
```typescript
// Повторяется в Login.tsx, Register.tsx, Profile.tsx и т.д.
catch (err: unknown) {
  console.error(err);
  if (err instanceof AxiosError) {
    toast.error(err.response?.data?.message || "Error message");
  } else {
    toast.error("Error message");
  }
}
```

**Решение:** Создать утилиту `src/utils/errorHandler.ts`:
```typescript
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    return message;
  }
  toast.error(defaultMessage);
  return defaultMessage;
};

// Использование:
// catch (err: unknown) {
//   handleApiError(err, "Failed to login");
// }
```

**Файлы для обновления:**
- `src/pages/auth/Login.tsx`
- `src/pages/auth/Register.tsx`
- `src/modules/profile/Profile.tsx`
- `src/modules/leaderBoard/hooks/useLeaderboard.ts`
- `src/modules/header/Header.tsx`
- `src/modules/claimBonus/ClaimBonus.tsx`
- Создать `src/utils/errorHandler.ts`

---

### 3. Безопасный парсинг localStorage

**Проблема:** `JSON.parse` может выбросить ошибку при некорректных данных, что приведет к крашу приложения.

**Текущий код:**
```typescript
// src/context/UserStatsContext.tsx
const saved = localStorage.getItem("sky_rush_game_data");
if (saved) {
  return JSON.parse(saved); // Опасность!
}
```

**Решение:** Создать утилиту `src/utils/storage.ts`:
```typescript
import { z } from "zod";

export const safeParseJSON = <T>(
  value: string | null,
  schema: z.ZodSchema<T>,
  defaultValue: T
): T => {
  if (!value) return defaultValue;
  try {
    const parsed = JSON.parse(value);
    return schema.parse(parsed);
  } catch {
    return defaultValue;
  }
};
```

**Создать схему для UserStats:**
```typescript
// src/utils/schemas.ts
import { z } from "zod";

export const UserStatsSchema = z.object({
  username: z.string(),
  balance: z.number(),
  totalWagered: z.number(),
  gamesPlayed: z.number(),
  totalWon: z.number(),
});
```

**Использование:**
```typescript
import { safeParseJSON } from "./utils/storage";
import { UserStatsSchema } from "./utils/schemas";

const saved = localStorage.getItem("sky_rush_game_data");
const defaultStats = {
  username: "",
  balance: 0,
  totalWagered: 0,
  gamesPlayed: 0,
  totalWon: 0,
};
return safeParseJSON(saved, UserStatsSchema, defaultStats);
```

**Файлы для обновления:**
- `src/context/UserStatsContext.tsx`
- `src/modules/leaderBoard/hooks/useLeaderboard.ts`
- Создать `src/utils/storage.ts`
- Создать `src/utils/schemas.ts`

---

### 4. Валидация данных из API

**Проблема:** Нет валидации ответов от API, что может привести к ошибкам при изменении структуры данных.

**Текущий код:**
```typescript
// src/config/auth-api.ts
export const getCurrentUser = async () =>
  (await API.get(`/users/current?t=${Date.now()}`)).data;
```

**Решение:** Использовать Zod схемы для валидации:
```typescript
// src/utils/schemas.ts
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  balance: z.number().nullable(),
  totalWagered: z.number().nullable(),
  gamesPlayed: z.number().nullable(),
  totalWon: z.number().nullable(),
});

// src/config/auth-api.ts
import { UserSchema } from "../utils/schemas";

export const getCurrentUser = async () => {
  const response = await API.get(`/users/current?t=${Date.now()}`);
  return UserSchema.parse(response.data);
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await API.get(`/users?t=${Date.now()}`);
  return z.array(UserSchema).parse(response.data);
};
```

**Файлы для обновления:**
- `src/config/auth-api.ts`
- Обновить `src/utils/schemas.ts` (добавить UserSchema)

---

## 🟡 Средний приоритет

### 5. Тестирование

**Проблема:** Отсутствуют тесты, что усложняет рефакторинг и добавление новых функций.

**Решение:**

1. Установить зависимости:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

2. Обновить `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

3. Создать `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

4. Создать `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

5. Пример теста для хука `src/hooks/__tests__/useUserStats.test.tsx`:
```typescript
import { renderHook } from '@testing-library/react';
import { UserStatsProvider } from '../../context/UserStatsContext';
import { useUserStats } from '../useUserStats';

describe('useUserStats', () => {
  it('should return user stats', () => {
    const wrapper = ({ children }) => (
      <UserStatsProvider>{children}</UserStatsProvider>
    );
    const { result } = renderHook(() => useUserStats(), { wrapper });
    expect(result.current).toBeDefined();
  });
});
```

**Файлы для создания:**
- `vitest.config.ts`
- `src/test/setup.ts`
- Тесты для ключевых компонентов и хуков

---

### 6. Улучшение ESLint конфигурации

**Проблема:** Используется базовая конфигурация без type-aware правил.

**Текущий код:**
```javascript
// eslint.config.js
tseslint.configs.recommended,
```

**Решение:** Обновить `eslint.config.js`:
```javascript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked, // Вместо recommended
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

**Файлы для обновления:**
- `eslint.config.js`

---

### 7. Оптимизация производительности localStorage

**Проблема:** localStorage обновляется при каждом изменении состояния, что может быть избыточно.

**Текущий код:**
```typescript
// src/context/UserStatsContext.tsx
useEffect(() => {
  statsRef.current = stats;
  localStorage.setItem("sky_rush_game_data", JSON.stringify(stats));
}, [stats]);
```

**Решение:** Добавить debounce:
```bash
npm install use-debounce
```

```typescript
import { useDebouncedCallback } from "use-debounce";

// В компоненте:
const debouncedSave = useDebouncedCallback((value: UserStats) => {
  localStorage.setItem("sky_rush_game_data", JSON.stringify(value));
}, 500);

useEffect(() => {
  statsRef.current = stats;
  debouncedSave(stats);
}, [stats, debouncedSave]);
```

**Файлы для обновления:**
- `src/context/UserStatsContext.tsx`

---

### 8. Улучшение TypeScript типов

**Проблема:** Избыточность в определении типов.

**Текущий код:**
```typescript
// src/context/UserStatsContextDefinition.ts
export interface UserStatsContextType extends Omit<UserStats, "username"> {
  username: string; // Дублирование
  // ...
}
```

**Решение:** Упростить:
```typescript
// src/context/UserStatsContextDefinition.ts
export interface UserStatsContextType extends UserStats {
  isLoading: boolean;
  updateBalance: (
    amount: number,
    extraStats?: Partial<Omit<UserStats, "balance" | "username">>
  ) => Promise<void>;
  refreshStats: () => Promise<void>;
}
```

**Файлы для обновления:**
- `src/context/UserStatsContextDefinition.ts`

---

### 9. Универсальный хук для async операций

**Проблема:** Повторяющаяся логика для обработки loading/error состояний.

**Решение:** Создать `src/hooks/useAsync.ts`:
```typescript
import { useState, useEffect } from "react";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = []
): UseAsyncState<T> => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    asyncFunction()
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: error as Error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return state;
};

// Использование:
// const { data, loading, error } = useAsync(() => getCurrentUser());
```

**Файлы для создания:**
- `src/hooks/useAsync.ts`

---

### 10. Абстракция для кеширования данных

**Проблема:** Дублирование логики кеширования в разных местах.

**Решение:** Создать `src/hooks/useCachedData.ts`:
```typescript
import { useState, useEffect } from "react";

interface CacheOptions {
  ttl?: number; // Time to live в миллисекундах
  key: string;
}

export const useCachedData = <T>(
  fetchFn: () => Promise<T>,
  options: CacheOptions
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(options.key);
    const cachedTime = localStorage.getItem(`${options.key}_time`);
    
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (options.ttl && age < options.ttl) {
        try {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // Если парсинг не удался, загружаем заново
        }
      }
    }

    fetchFn()
      .then((result) => {
        setData(result);
        localStorage.setItem(options.key, JSON.stringify(result));
        localStorage.setItem(`${options.key}_time`, Date.now().toString());
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fetchFn, options.key, options.ttl]);

  return { data, loading, error };
};

// Использование:
// const { data, loading } = useCachedData(
//   () => getAllUsers(),
//   { key: "leaderboard_users", ttl: 60000 } // 1 минута
// );
```

**Файлы для создания:**
- `src/hooks/useCachedData.ts`

---

## 🟢 Низкий приоритет

### 11. Prettier для форматирования кода

**Решение:**
```bash
npm install -D prettier
```

Создать `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

Создать `.prettierignore`:
```
node_modules
dist
*.min.js
```

Добавить в `package.json`:
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,scss}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,scss}\""
  }
}
```

**Файлы для создания:**
- `.prettierrc`
- `.prettierignore`

---

### 12. Accessibility (a11y)

**Рекомендации:**

1. Добавить ARIA-атрибуты:
```typescript
<button
  aria-label="Start game"
  aria-pressed={gameState === "PLAYING"}
>
  Start
</button>
```

2. Улучшить навигацию с клавиатуры:
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    handleClick();
  }
};
```

3. Проверить контрастность цветов (использовать инструменты типа [WebAIM](https://webaim.org/resources/contrastchecker/))

4. Добавить skip links для навигации:
```typescript
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

---

### 13. Анализ размера бандла

**Решение:**
```bash
npm install -D rollup-plugin-visualizer
```

Обновить `vite.config.ts`:
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

```json
// package.json
{
  "scripts": {
    "build:analyze": "vite build"
  }
}
```

**Файлы для обновления:**
- `vite.config.ts`

---

### 14. Обработка edge cases в играх

**Проблема:** Нет валидации входных данных в игровой логике.

**Решение:** Добавить проверки в `src/modules/mines/hooks/useMinesGame.ts`:
```typescript
const setBetAmount = (amount: number) => {
  if (amount < 0) {
    throw new Error("Bet amount cannot be negative");
  }
  if (amount > balance) {
    throw new Error("Insufficient balance");
  }
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid bet amount");
  }
  setBetAmount(amount);
};

const setMinesCount = (count: number) => {
  if (count < 1 || count > GRID_SIZE - 1) {
    throw new Error(`Mines count must be between 1 and ${GRID_SIZE - 1}`);
  }
  setMinesCount(count);
};
```

**Файлы для обновления:**
- `src/modules/mines/hooks/useMinesGame.ts`
- Другие игровые модули

---

### 15. Удаление console.log из production

**Проблема:** `console.log` и `console.error` остаются в production коде.

**Решение:** Использовать утилиту для логирования:
```typescript
// src/utils/logger.ts
const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args);
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) console.error(...args);
    // В production можно отправлять в сервис мониторинга
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args);
  },
};
```

**Файлы для создания:**
- `src/utils/logger.ts`

**Файлы для обновления:**
- Заменить все `console.log/error/warn` на `logger.log/error/warn`

---

## 📋 Чеклист улучшений

### Высокий приоритет
- [ ] Настроить переменные окружения
  - [ ] Создать `.env.example`
  - [ ] Обновить `src/config/auth-api.ts`
- [ ] Создать централизованную обработку ошибок
  - [ ] Создать `src/utils/errorHandler.ts`
  - [ ] Обновить все компоненты с обработкой ошибок
- [ ] Реализовать безопасный парсинг localStorage
  - [ ] Создать `src/utils/storage.ts`
  - [ ] Создать `src/utils/schemas.ts`
  - [ ] Обновить `src/context/UserStatsContext.tsx`
  - [ ] Обновить `src/modules/leaderBoard/hooks/useLeaderboard.ts`
- [ ] Добавить валидацию данных API с Zod
  - [ ] Добавить UserSchema в `src/utils/schemas.ts`
  - [ ] Обновить `src/config/auth-api.ts`

### Средний приоритет
- [ ] Настроить тестирование (Vitest)
  - [ ] Установить зависимости
  - [ ] Создать `vitest.config.ts`
  - [ ] Создать `src/test/setup.ts`
  - [ ] Написать первые тесты
- [ ] Улучшить ESLint конфигурацию
  - [ ] Обновить `eslint.config.js`
- [ ] Оптимизировать работу с localStorage
  - [ ] Установить `use-debounce`
  - [ ] Обновить `src/context/UserStatsContext.tsx`
- [ ] Улучшить TypeScript типы
  - [ ] Обновить `src/context/UserStatsContextDefinition.ts`
- [ ] Создать универсальный хук useAsync
  - [ ] Создать `src/hooks/useAsync.ts`
- [ ] Создать абстракцию для кеширования
  - [ ] Создать `src/hooks/useCachedData.ts`

### Низкий приоритет
- [ ] Настроить Prettier
  - [ ] Установить Prettier
  - [ ] Создать `.prettierrc` и `.prettierignore`
  - [ ] Добавить скрипты в `package.json`
- [ ] Улучшить accessibility
  - [ ] Добавить ARIA-атрибуты
  - [ ] Улучшить навигацию с клавиатуры
- [ ] Настроить анализ бандла
  - [ ] Установить `rollup-plugin-visualizer`
  - [ ] Обновить `vite.config.ts`
- [ ] Добавить обработку edge cases
  - [ ] Обновить игровые модули
- [ ] Создать систему логирования
  - [ ] Создать `src/utils/logger.ts`
  - [ ] Заменить все `console.*` на `logger.*`

---

## 📚 Дополнительные ресурсы

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Zod Documentation](https://zod.dev/)
- [React Testing Library](https://testing-library.com/react)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎯 План внедрения

Рекомендуется внедрять улучшения постепенно, начиная с высокого приоритета:

1. **Неделя 1:** Высокий приоритет (пункты 1-4)
2. **Неделя 2:** Средний приоритет - тестирование и ESLint (пункты 5-6)
3. **Неделя 3:** Средний приоритет - оптимизация и хуки (пункты 7-10)
4. **Неделя 4:** Низкий приоритет (пункты 11-15)

Каждое изменение должно быть протестировано перед переходом к следующему.

