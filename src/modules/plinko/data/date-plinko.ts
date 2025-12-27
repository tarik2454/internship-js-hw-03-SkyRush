import { type RiskLevel } from "../types";

const RISK_ORDER: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];

const BALS = [
  {
    id: 1,
    quantity: 1,
    cost: 2,
  },
  {
    id: 2,
    quantity: 2,
    cost: 4,
  },
  {
    id: 3,
    quantity: 5,
    cost: 10,
  },
  {
    id: 4,
    quantity: 10,
    cost: 20,
  },
];

const LINES = [
  {
    id: 1,
    value: 8,
  },
  {
    id: 2,
    value: 9,
  },
  {
    id: 3,
    value: 10,
  },
  {
    id: 4,
    value: 11,
  },
  {
    id: 5,
    value: 12,
  },
  {
    id: 6,
    value: 13,
  },
  {
    id: 7,
    value: 14,
  },
  {
    id: 8,
    value: 15,
  },
  {
    id: 9,
    value: 16,
  },
];

export { type RiskLevel, RISK_ORDER, BALS, LINES };
