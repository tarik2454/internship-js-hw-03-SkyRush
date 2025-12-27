/**
 * Возвращает цвет для множителя в зависимости от его значения
 */
export const getMultiplierColor = (multiplier: number): string => {
  if (multiplier >= 10) {
    return "#FF0000"; // Красный для очень высоких множителей
  }
  if (multiplier >= 5) {
    return "#FF6900"; // Оранжевый для высоких множителей
  }
  if (multiplier >= 2) {
    return "#FFD700"; // Золотой для средних множителей
  }
  if (multiplier >= 1.5) {
    return "#00FF00"; // Зеленый для низких множителей
  }
  return "#90A1B9"; // Серый для очень низких множителей
};

