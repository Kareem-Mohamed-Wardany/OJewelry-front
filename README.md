# Jewelry Website

A modern, fully responsive e-commerce platform for a jewelry store, built with **Next.js**, **Tailwind CSS**, and **Redux** for state management. The platform allows customers to browse jewelry collections, add products to their cart, enter shipping details, and complete payments via **Paymob** integration. Admins can manage products, apply discounts, and update the homepage visuals dynamically.

## Features

### Customer Features

- 🛍️ Browse a variety of jewelry products with detailed descriptions.
- 🛒 Add products to the shopping cart and manage the cart contents.
- 📦 Enter shipping addresses for delivery.
- 💳 Secure payment processing via **Paymob** integration.

### Admin Features

- ➕ Add new jewelry products with images and descriptions.
- ✏️ Edit existing product details, including pricing and availability.
- 💰 Apply sales or discounts to specific products.
- 🖼️ Upload and change the Hero image for the homepage.
- 📷 Upload multiple images for better product display.

## 🛠 Tech Stack

- **Next.js** – For server-side rendering and optimized performance.
- **Tailwind CSS** – For modern and responsive styling.
- **Redux** – For efficient global state management.
- **Paymob API** – For seamless and secure payment processing.

## 🚀 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-repo/jewelry-store.git
   ```

2. **Navigate to the project folder:**

   ```sh
   cd jewelry-store
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env.local` file and add the necessary credentials for Paymob and database access:

   ```env
   NEXT_PUBLIC_PAYMOB_API_KEY=your_paymob_key
   NEXT_PUBLIC_DATABASE_URL=your_database_url
   ```

5. **Run the development server:**

   ```sh
   npm run dev
   ```

6. **Open your browser and go to:**
   ```sh
   http://localhost:3000
   ```

## 🌍 Deployment

- The application can be deployed on **Vercel** for seamless performance.
- Ensure all environment variables are properly configured on the hosting platform.

## 🤝 Contributions

Feel free to contribute to the project by submitting pull requests or reporting issues.

## 📜 License

This project is licensed under the **MIT License**.
