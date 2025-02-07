export const categoryOptionsMap = Object.fromEntries(
  Object.entries({
    Sets: "Sets",
    Rings: "Rings",
    Necklaces: "Necklaces",
    Earrings: "Earrings",
    Bracelets: "Bracelets",
    Anklets: "Anklets",
    Coins: "Coins",
    Piercing: "Piercing",
    Wedding_Rings: "Wedding Rings",
    Pendants: "Pendants",
    Bangles: "Bangles",
    Stones: "Stones",
    Men: "Men Collection",
  }).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
);

export const brandOptionsMap = Object.fromEntries(
  Object.entries({
    Yellow_Gold: "Yellow Gold",
    White_Gold: "White Gold",
    Rose_Gold: "Rose Gold",
    Multicolored: "Multicolored Gold",
    Diamond: "Diamond"
  }).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
);


export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: Object.entries(categoryOptionsMap).map(([id, label]) => ({
      id,
      label,
    }))
  },
  {
    label: "Material",
    name: "material",
    componentType: "select",
    options: Object.entries(brandOptionsMap).map(([id, label]) => ({
      id,
      label,
    }))
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/products",
  }
];

export const filterOptions = {
  category: Object.entries(categoryOptionsMap).map(([id, label]) => ({
    id,
    label,
  })),
  material: Object.entries(brandOptionsMap).map(([id, label]) => ({
    id,
    label,
  }))
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Postcode",
    name: "postcode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your postcode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
