export const getImgSrc = (foodName: string): string => {

    switch (foodName) {
        case "БАРСКАЯ":
            return "src/assets/barskaya.jpg"; // Replace with the actual path
        case "САНТЬЯГО":
            return "src/assets/santiago.jpg"; // Replace with the actual path
        case "КУБА":
            return "src/assets/kuba.jpg"; // Replace with the actual path
        case "БАТИСТА С КРЕВЕТКАМИ":
            return "src/assets/batista_shrimp.jpg"; // Replace with the actual path
        case "САНЧЕС":
            return "src/assets/sanches.jpg"; // Replace with the actual path

        case "Сок Ананас":
            return "src/assets/pineapple.jpg"; // Replace with the actual path

        case "Кола Добрый":
            return "src/assets/coke.jpg"; // Replace with the actual path

        case "Напиток Добрый Апельсин":
            return "src/assets/orange.jpg"; // Replace with the actual path

        case "Чесночный":
            return "src/assets/garlic.jpg"; // Replace with the actual path

        case "Томатный":
            return "src/assets/pomidor.jpg"; // Replace with the actual path

        case "Сырный":
            return "src/assets/cheese.jpg"; // Replace with the actual path

        default:
            return "src/assets/default.jpg"; // Replace with a default image path
    }
};
