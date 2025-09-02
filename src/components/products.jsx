import product1Img from "../assets/images/black-sneakers-t.jpg";
import product21Img from "../assets/images/green-sneakers-t.jpg";

export const products = [
  {
    id: 1,
    name: "Green Sneakers",
    sku: "GS-001",
    price: 89,
    description: "Comfortable green sneakers for everyday use.",
    image: product1Img,
    categories: ["Shoes", "Sneakers", "Green", "Casual"],
    tags: ["sneakers", "sport", "summer"],
    attributes: [
      { name: "Size", value: 42 },
      { name: "Color", value: "Green" },
      { name: "Material", value: "Mesh" }
    ],
    related: [2, 3],
    stock: 12,
    onSale: false
  },
  {
    id: 2,
    name: "Blue Sneakers",
    sku: "BS-002",
    price: 92,
    description: "Stylish blue sneakers for sporty looks.",
    image: product21Img,
    categories: ["Shoes", "Sneakers", "Blue", "Sport"],
    tags: ["sneakers", "sport"],
    attributes: [
      { name: "Size", value: 43 },
      { name: "Color", value: "Blue" },
      { name: "Material", value: "Mesh" }
    ],
    related: [1, 3],
    stock: 8,
    onSale: true
  },
  {
    id: 3,
    name: "Red Running Shoes",
    sku: "RR-003",
    price: 110,
    description: "Lightweight red running shoes for long-distance runs.",
    image: product1Img,
    categories: ["Shoes", "Running", "Red", "Sport"],
    tags: ["running", "sport", "performance"],
    attributes: [
      { name: "Size", value: 41 },
      { name: "Color", value: "Red" },
      { name: "Material", value: "Mesh" }
    ],
    related: [1, 2, 4],
    stock: 5,
    onSale: false
  },
  {
    id: 4,
    name: "Black Casual Loafers",
    sku: "BL-004",
    price: 75,
    description: "Elegant black loafers for daily wear.",
    image: product1Img,
    categories: ["Shoes", "Loafers", "Black", "Casual"],
    tags: ["loafers", "casual", "office"],
    attributes: [
      { name: "Size", value: 42 },
      { name: "Color", value: "Black" },
      { name: "Material", value: "Leather" }
    ],
    related: [3, 5],
    stock: 10,
    onSale: true
  },
  {
    id: 5,
    name: "White Sports Sneakers",
    sku: "WS-005",
    price: 95,
    description: "Versatile white sneakers perfect for gym and street.",
    image: product1Img,
    categories: ["Shoes", "Sneakers", "White", "Sport"],
    tags: ["sneakers", "sport", "gym"],
    attributes: [
      { name: "Size", value: 44 },
      { name: "Color", value: "White" },
      { name: "Material", value: "Mesh" }
    ],
    related: [2, 4],
    stock: 7,
    onSale: false
  },
  {
    id: 6,
    name: "Soccer Ball",
    sku: "SB-006",
    price: 30,
    description: "Standard size soccer ball for training and matches.",
    image: product21Img,
    categories: ["Sports", "Soccer", "Equipment"],
    tags: ["soccer", "ball", "training"],
    attributes: [
      { name: "Size", value: "5" },
      { name: "Color", value: "White/Black" },
      { name: "Material", value: "Synthetic" }
    ],
    related: [7, 8],
    stock: 15,
    onSale: false
  },
  {
    id: 7,
    name: "Basketball",
    sku: "BB-007",
    price: 40,
    description: "Official size basketball, ideal for indoor and outdoor use.",
    image: product1Img,
    categories: ["Sports", "Basketball", "Equipment"],
    tags: ["basketball", "ball", "training"],
    attributes: [
      { name: "Size", value: "7" },
      { name: "Color", value: "Orange" },
      { name: "Material", value: "Rubber" }
    ],
    related: [6, 8],
    stock: 10,
    onSale: true
  },
  {
    id: 8,
    name: "Fitness Gloves",
    sku: "FG-008",
    price: 25,
    description: "Comfortable gym gloves to protect hands during workouts.",
    image: product21Img,
    categories: ["Sports", "Gym", "Accessories"],
    tags: ["fitness", "gloves", "gym"],
    attributes: [
      { name: "Size", value: "M" },
      { name: "Color", value: "Black" },
      { name: "Material", value: "Leather" }
    ],
    related: [5, 7],
    stock: 20,
    onSale: false
  },
  {
    id: 9,
    name: "Yoga Mat",
    sku: "YM-009",
    price: 50,
    description: "Non-slip yoga mat for exercises and stretching.",
    image: product1Img,
    categories: ["Sports", "Yoga", "Accessories"],
    tags: ["yoga", "mat", "exercise"],
    attributes: [
      { name: "Length", value: "183cm" },
      { name: "Width", value: "61cm" },
      { name: "Color", value: "Purple" }
    ],
    related: [8, 10],
    stock: 12,
    onSale: true
  },
  {
    id: 10,
    name: "Training Jersey",
    sku: "TJ-010",
    price: 60,
    description: "Breathable training jersey for sports and gym.",
    image: product21Img,
    categories: ["Sports", "Clothing", "Jersey"],
    tags: ["jersey", "training", "sport"],
    attributes: [
      { name: "Size", value: "L" },
      { name: "Color", value: "Blue" },
      { name: "Material", value: "Polyester" }
    ],
    related: [6, 9],
    stock: 18,
    onSale: false
  }
];
