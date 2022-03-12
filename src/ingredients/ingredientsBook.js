import butterChickenImage from "../../docs/assets/butterChiken.jpg";
import macaroniImage from "../../docs/assets/macaroni.jpg"
import fishFiletImage from "../../docs/assets/fishFilet.jpg"
import panGrilledChickenImage from "../../docs/assets/panGrilledChicken.jpg"
import tropicalBellPepperSaladImage from "../../docs/assets/tropicalBellPepper.jpg"
import { ingredientBook } from "../functions/formAccumulator";
const ingredients = {
    butterChickenIngredient : {
        pic: butterChickenImage,
        ingredientName: "ButterChicken",
        subHeading:"Main Course",
        ingredients: [
            "500g chicken",
            "½ cup natural yoghurt",
            "1 tbsp ginger, crushed",
            "¼ tsp cayenne pepper",
            "1 tsp turmeric",
            "1 tsp paprika",
            "1tsp cumin",
            "2 tsp dhana jeera",
            "3 cloves garlic, crushed",
            "1 onion, chopped",
            "1 tomato, chopped",
            "2 tsp tomato paste",
            "2 tsp curry powder",
            "½ cup cooking cream",
            "3 tbsp cooking oil",
            "2 tbsp butter",
            "1 tsp mustard",
            "1 tsp paprika",
            "1 tbsp sugar",
            "1 tsp salt"
        ],
        preparation: [
            "Mix the marinade ingredients in a large bowl.",
            "Place the chicken in the bowl with the marinade.",
            "Marinate in the refrigerator for 2 hours.",
            "Heat the oil and butter in a pan n medium flame.",
            "Stir in the onions until translucent then add the curry powder and paprika.",
            "Toast for 2 minutes.",
            "Increase the heat to medium heat.",
            "Stir in the tomatoes, tomato paste, sugar and dijon mustard.",
            "Combine with the onion-spice mix.",
            "Cover the pan to steam the tomatoes until soft and pulpy. ",
            "Mix in the chicken pieces gently for 5 minutes.",
            "Add in the cooking cream, cover the pan and allow to simmer on low heat for 20 minutes.",
            "Add in the salt and continue to simmer the chicken while covered for an additional 5 minutes.",
            "Serve hot with ugali or rice and your favourite veggies!"
        ],
        estimation: ["Easy", "Prep 20m", "Cook 5m"],
        tip: "For a stronger garlic-ginger flavour you can add the same amount of the fresh spices used in the marinade to the sauce as you add in your curry powder and paprika."
    },
    macaroniWithWhiteSauce : {
        pic: macaroniImage,
        ingredientName: "Macaroni",
        subHeading:"In White Sauce",
        ingredients: [
            "180g macaroni",
            "4 tsp flour, sifted",
            "1 small red onion, finely chopped",
            "4 cloves garlic, crushed",
            "25g unsalted butter",
            "60 ml whole milk",
            "1 tsp salt",
            "½ tsp black pepper",
            "½ cup water",
            "2 tbsp cooking oil"
        ],
        preparation: [
            "Boil and strain the macaroni.",
            "Set the stock aside for later use in the recipe.",
            "Preheat the pan on medium flame.",
            "Add in butter and oil and allow to heat until bubbling begins.",
            "Stir in the onions and allow them to cook on low heat until translucent",
            "Followed by the crushed garlic for 30 seconds.",
            "Gradually mix in the flour with a wooden cooking spoon for about a minute.",
            "Gently stir in the water continuously to keep the flour from clumping.",
            "Add in the stock to smoothen the consistency allow the sauce to simmer for a minute on a low flame.",
            "Combine the macaroni and sauce for two minutes.",
            "Add the milk, cover the pan and keep simmering on low flame for 5 - 8 minutes. ",
            "Sprinkle the black pepper over the macaroni and remove the pan from the heat.",
            "Serve hot with your favourite veggies and meats or lentils!",
        ],
        estimation: ["Easy", "Prep 20m", "Cook 20m"],
        tip:"Keep an extra cup of warm water close by to occasionally add into the mac and white sauce combo so that it does not get clumpy."
    },
    fishFilet : {
        pic: fishFiletImage,
        ingredientName: "FishFilet",
        subHeading:"In Tumeric Butter Sauce.",
        ingredients: [
            "250g fish fillet, cubed chunks.",
            "1 tsp dhana jeera.",
            "1 tbsp turmeric.",
            "1 tsp tomato paste.",
            "1 tsp salt.",
            "1 tomato, diced.",
            "1 onion, diced.",
            "4 cloves garlic, crushed.",
            "½ cup water.",
            "2 tbsp cooking oil.",
            "2 tbsp unsalted butter.",
            
        ],
        preparation: [
            "Preheat the cooking pan on medium flame. ",
            "Pour in the oil and the butter.",
            "Stir in the onions and allow them to cook on low heat until translucent. ",
            "Mix in the crushed garlic for 30 seconds.",
            "Add in the dhana jeera and turmeric and allow to toast for  1 to 2 minutes.",
            "Increase the heat to medium heat.",
            "Stir in the tomatoes to combine with the onion-spice mix. ",
            "Cover the pan to steam the tomatoes until soft and pulpy. ",
            "Mix in the tomato paste and let cook for a minute.",
            "Mix in the fish fillet cubes while gently using your cooking spoon to coat them in the paste. ",
            "Add in ¼ cup water and allow to simmer on low heat for 10 minutes.",
            "Add in some more water to prevent the fish from sticking to the pan. ",
            "Continue to simmer the fish while covered for an additional 10 minutes.",
            "Serve hot!",        
        ],
        estimation: ["Easy", "Prep 20m", "Cook 20m"],
        tip:"For a grounding aroma sprinkle some freshly chopped coriander or parsley!"
    },
    panGrilledChicken : {
        pic: panGrilledChickenImage,
        ingredientName: "GrilledChicken",
        subHeading:"Main Course.",
        ingredients: [
            "500g chicken, chopped into chunks",
            "3 tbsp oil",
            "For the marinade",
            "4 tbsp light soy sauce",
            "4 tsp sugar",
            "1 tsp cumin",
            "2 tsp chicken masala",
            "1 tsp curry powder",
            "2 tbsp dijon mustard",
            "1tbsp rosemary",
            "¼ tsp black pepper",
            "Juice of 1 small lime",
        ],
        preparation: [
            "Thoroughly mix the marinade ingredients in a large bowl.",
            "Fold in the chicken pieces. ",
            "Allow the chicken to marinate for 30 to 40 minutes. ",
            "Preheat the grilling pan on medium flame and pour in the oil.",
            "Add the chicken pieces to fit in the pan living room to turn the pieces. ",
            "Allow the first side to grill for 5 minutes in the open pan before turning the other side.",
            "After grilling both sides, turn once more and cover the pan. ",
            "Lower the flame and turn the sides every 5 minutes to ensure the chicken is thoroughly cooked. ",
            "Baste the chicken occasionally with the remaining or warm water marinade to keep it succulent.",
            "Serve hot with your favourite dish.",
    ],
        estimation: ["Easy", "Prep 30m", "Cook 30m"],
        tip:"Use a tong or fork to pierce through the drumstick and the wing to check that the flesh around the bones are not bloody when you serve."
    },
    tropicalBellPepperSalad : {
        pic: tropicalBellPepperSaladImage,
        ingredientName: "TropicalBellPepper",
        subHeading:"Salad Accompaniment",
        ingredients: [
            "1 ripe medium-sized apple mango, seeded and chopped",
            "1 ripe large  avocado, seeded and chopped",
            "1 medium-sized yellow bell pepper, seeded and chopped",
            "1 medium-sized red bell pepper, seeded and chopped",
            "1 medium-sized green bell pepper, seeded and chopped",
            "1 small bunch coriander, roughly chopped",
            "For the salad dressing;",
            "¼ cup sunflower or olive oil",
            "⅛ cup white vinegar",
            "1 tsp salt",
            "1 tsp black pepper",
        ],
        preparation: [
            "Prepare the fruit and vegetables as recommended and place them in a bowl.",
            "Whisk together the oil, vinegar, salt and black pepper in a bowl.",
            "Pour emulsion over the fruit and vegetables. ",
            "Toss the salad to evenly mix the dressing and to distribute the colourful fruits and veggies.",
            "Refrigerate until 5 minutes to serving time or a maximum.",
    ],
        estimation: ["Easy", "Prep 30m", "Cook 0m"],
        tip:"Serve as an appertizer or a sidedish."
    }
}

export const uploadIngredients = (() => {
    Object.keys(ingredients).map((key,ing) => {ingredientBook.update((n) => n.concat({
        name:ingredients[key].ingredientName,
        pic:ingredients[key].pic,
        subHeading:ingredients[key].subHeading,
        ingredients:ingredients[key].ingredients,
        preparation:ingredients[key].preparation,
        estimation:ingredients[key].estimation,
        tip:ingredients[key].tip,
        route:`/recipe/${ingredients[key].ingredientName}`,
        active:false
    }))})
})