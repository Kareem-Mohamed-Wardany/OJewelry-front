export default function MoneyFormat(number) {
    if (typeof number !== "number") return number; // Ensure the input is a number

    return new Intl.NumberFormat("en-US").format(number);
}