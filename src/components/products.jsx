import product1Img from "../assets/images/black-sneakers-t.jpg";
import product21Img from "../assets/images/green-sneakers-t.jpg";

const allProducts = [
  {
    id: 1,
    name: "Chardonnay Reserve 2021",
    sku: "WINE-CH-2021",
    price: 35,
    description: "A crisp Chardonnay with notes of apple, pear, and subtle oak.",
    image: product1Img,
    categories: ["Wine", "White Wine", "Chardonnay"],
    tags: ["white", "dry", "oak-aged"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "13%" },
      { name: "Vintage", value: 2021 }
    ],
    related: [2, 3],
    stock: 45,
    onSale: true
  },
  {
    id: 2,
    name: "Pinot Noir Classic 2020",
    sku: "WINE-PN-2020",
    price: 42,
    description: "Smooth and elegant Pinot Noir with cherry and earthy tones.",
    image: product21Img,
    categories: ["Wine", "Red Wine", "Pinot Noir"],
    tags: ["red", "smooth", "light-bodied"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "12.5%" },
      { name: "Vintage", value: 2020 }
    ],
    related: [1, 4],
    stock: 30,
    onSale: false
  },
  {
    id: 3,
    name: "Cabernet Sauvignon Estate 2019",
    sku: "WINE-CS-2019",
    price: 55,
    description: "Rich and full-bodied Cabernet with blackberry and oak flavors.",
    image: product1Img,
    categories: ["Wine", "Red Wine", "Cabernet Sauvignon"],
    tags: ["red", "full-bodied", "aged"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "14%" },
      { name: "Vintage", value: 2019 }
    ],
    related: [2, 5],
    stock: 25,
    onSale: false
  },
  {
    id: 4,
    name: "Rosé Summer Blend 2022",
    sku: "WINE-ROSE-2022",
    price: 28,
    description: "Light and refreshing rosé with strawberry and floral notes.",
    image: product21Img,
    categories: ["Wine", "Rosé"],
    tags: ["rosé", "light", "summer"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "11.5%" },
      { name: "Vintage", value: 2022 }
    ],
    related: [1, 6],
    stock: 60,
    onSale: true
  },
  {
    id: 5,
    name: "Sauvignon Blanc Fresh 2021",
    sku: "WINE-SB-2021",
    price: 32,
    description: "Crisp Sauvignon Blanc with citrus and passionfruit aromas.",
    image: product1Img,
    categories: ["Wine", "White Wine", "Sauvignon Blanc"],
    tags: ["white", "crisp", "fresh"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "12.8%" },
      { name: "Vintage", value: 2021 }
    ],
    related: [1, 4],
    stock: 40,
    onSale: false
  },
  {
    id: 6,
    name: "Merlot Reserve 2018",
    sku: "WINE-MR-2018",
    price: 48,
    description: "Velvety Merlot with plum, chocolate, and spice notes.",
    image: product21Img,
    categories: ["Wine", "Red Wine", "Merlot"],
    tags: ["red", "smooth", "reserve"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "13.5%" },
      { name: "Vintage", value: 2018 }
    ],
    related: [2, 3],
    stock: 20,
    onSale: false
  },
  {
    id: 7,
    name: "Sparkling Brut NV",
    sku: "WINE-SP-NV",
    price: 39,
    description: "A lively sparkling wine with citrus, green apple, and brioche notes.",
    image: product1Img,
    categories: ["Wine", "Sparkling Wine"],
    tags: ["sparkling", "celebration", "brut"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "12%" },
      { name: "Vintage", value: "NV" }
    ],
    related: [4, 8],
    stock: 50,
    onSale: true
  },
  {
    id: 8,
    name: "Shiraz Bold 2020",
    sku: "WINE-SH-2020",
    price: 50,
    description: "Bold Shiraz with rich dark fruit, pepper, and smoky oak.",
    image: product21Img,
    categories: ["Wine", "Red Wine", "Shiraz"],
    tags: ["red", "bold", "spicy"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "14.5%" },
      { name: "Vintage", value: 2020 }
    ],
    related: [3, 6],
    stock: 35,
    onSale: false
  },
  {
    id: 9,
    name: "Dessert Wine Late Harvest 2017",
    sku: "WINE-DW-2017",
    price: 60,
    description: "Sweet and luscious dessert wine with honey and apricot notes.",
    image: product1Img,
    categories: ["Wine", "Dessert Wine"],
    tags: ["sweet", "dessert", "luxury"],
    attributes: [
      { name: "Volume", value: "375ml" },
      { name: "ABV", value: "11%" },
      { name: "Vintage", value: 2017 }
    ],
    related: [4, 7],
    stock: 15,
    onSale: false
  },
  {
    id: 10,
    name: "Organic Natural Red 2021",
    sku: "WINE-OR-2021",
    price: 38,
    description: "Organic red wine made with minimal intervention, vibrant berry flavors.",
    image: product21Img,
    categories: ["Wine", "Red Wine", "Organic"],
    tags: ["organic", "natural", "red"],
    attributes: [
      { name: "Volume", value: "750ml" },
      { name: "ABV", value: "12.7%" },
      { name: "Vintage", value: 2021 }
    ],
    related: [6, 8],
    stock: 22,
    onSale: true
  }
];


export const products = allProducts.filter(p => p.stock > 0);
