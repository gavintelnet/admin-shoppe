import React from "react";

export const useLocalStorage = (keyName: any, defaultValue: any) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(keyName);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(keyName, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return { value: storedValue, setValue };
};

export function splitText(string: string, length: any) {
  const count = string?.length;
  if (count > length) {
    const text = string.substring(0, length + 1).concat("...");
    return text;
  } else {
    return string;
  }
}
export const formatPrice = (price: number, currency: string): string => {
  const exchangeRates: { [key: string]: number } = {
    USD: 1,
    VND: 25000,
    CNY: 6.5,
  };

  const symbols: { [key: string]: string } = {
    USD: "$",
    VND: "₫",
    CNY: "¥",
  };

  const convertedPrice: number = price * (exchangeRates[currency] || 1);
  const symbol: string = symbols[currency] || "$";

  if (currency === "VND") {
    return `${convertedPrice.toLocaleString()} ${symbol}`;
  } else {
    return `${symbol} ${convertedPrice.toLocaleString()}`;
  }
};

/**
 * Định dạng số thành tiền Việt Nam Đồng (VND)
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi định dạng tiền tệ
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default formatCurrency;

export const compareObjects = (obj1: any, obj2: any) => {
  // Kiểm tra số lượng thuộc tính của hai đối tượng
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  // So sánh từng thuộc tính và giá trị của hai đối tượng
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};
const compareRelevantProperties = (obj1: any, obj2: any) => {
  const commonKeys = Object.keys(obj1).filter((key) => key in obj2);

  for (let key of commonKeys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};
export const isObjectInArray = (obj: any, arr: any) => {
  for (let item of arr) {
    if (compareRelevantProperties(obj, item)) {
      return true;
    }
    // if (compareObjects(obj, item)) {
    //   return true;
    // }
  }
  return false;
};
