import { MenuItem, RestaurantConfig } from '../types';

import heroSpreadImg from '../assets/images/hero_sahyadri_spread_1790337610845.jpg';
import thaliImg from '../assets/images/dish_south_indian_thali_1790337625891.jpg';
import masalaDosaImg from '../assets/images/dish_crispy_masala_dosa_1790337639652.jpg';
import paneerImg from '../assets/images/dish_paneer_special_1790337652684.jpg';
import diningHallImg from '../assets/images/restaurant_family_dining_1790337666423.jpg';

export const INITIAL_RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'Sahyadri Vaibhava',
  tagline: 'Authentic Vegetarian Food, Made Fresh',
  subTagline:
    'Delicious vegetarian food for breakfast, lunch, dinner and every special moment.',
  address: {
    line1: 'Chandapura–Anekal Road',
    landmark: 'Opposite JPM Nursery',
    area: 'Iggalur, Andapura',
    city: 'Bengaluru District',
    state: 'Karnataka',
    pincode: '560099',
    fullFormatted:
      'Chandapura–Anekal Road, opposite JPM Nursery, Iggalur, Andapura, Karnataka 560099, India.',
  },
  timings: 'Open Daily • 7:00 AM – 11:00 PM',
  phone: '+918884680461',
  displayPhone: '+91 88846 80461',
  whatsappNumber: '918884680461',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Sahyadri+Vaibhava+Chandapura+Anekal+Road+opposite+JPM+Nursery+Iggalur+Karnataka+560099',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Chandapura-Anekal+Road+Iggalur+Karnataka+560099&t=&z=15&ie=UTF8&iwloc=&output=embed',
};

export const MENU_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'south-indian', label: 'South Indian' },
  { id: 'north-indian', label: 'North Indian' },
  { id: 'rice-meals', label: 'Rice & Meals' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'desserts', label: 'Desserts' },
] as const;

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Breakfast & South Indian Dosas
  {
    id: 'sv-01',
    name: 'Special Masala Dosa',
    kannadaName: 'ಮಸಾಲೆ ದೋಸೆ',
    description:
      'Crispy golden fermented rice-lentil crepe smeared with spiced red chutney, filled with potato masala, served with 2 fresh chutneys and piping hot sambar.',
    price: 85,
    category: 'breakfast',
    image: masalaDosaImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
    isPopular: true,
  },
  {
    id: 'sv-02',
    name: 'Steaming Thatte Idli with Vada',
    kannadaName: 'ತಟ್ಟೆ ಇಡ್ಲಿ - ವಡೆ',
    description:
      'Fluffy plate-sized steamed rice cake with one crispy medu vada, served with traditional coconut chutney and lentil sambar.',
    price: 65,
    category: 'breakfast',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
    isPopular: true,
  },
  {
    id: 'sv-03',
    name: 'Ghee Podi Roast Dosa',
    kannadaName: 'ತುಪ್ಪದ ಪುಡಿ ದೋಸೆ',
    description:
      'Crisp thin dosa roasted in aromatic pure desi ghee and dusted with home-style spiced gun powder (chutney podi).',
    price: 105,
    category: 'south-indian',
    image: masalaDosaImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
    isPopular: true,
  },
  {
    id: 'sv-04',
    name: 'Chow Chow Bath (Khara & Kesari)',
    kannadaName: 'ಖಾರಾ ಬಾತ್ ಮತ್ತು ಕೇಸರಿ ಬಾತ್',
    description:
      'Classic Karnataka pairing of savory spiced vegetable upma (Khara Bath) alongside fragrant pineapple-saffron semolina sweet (Kesari Bath).',
    price: 75,
    category: 'breakfast',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-05',
    name: 'Poori Saagu (3 Pcs)',
    kannadaName: 'ಪೂರಿ ಸಾಗು',
    description:
      'Puffy golden whole wheat fried flatbreads served with mixed vegetable coconut saagu and onion salad.',
    price: 80,
    category: 'breakfast',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-06',
    name: 'Rava Onion Dosa',
    kannadaName: 'ಈರುಳ್ಳಿ ರವಾ ದೋಸೆ',
    description:
      'Crispy net-textured semolina dosa topped with finely diced onions, green chillies, ginger, and cumin seeds.',
    price: 95,
    category: 'south-indian',
    image: masalaDosaImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
  },

  // Meals & Rice
  {
    id: 'sv-07',
    name: 'Sahyadri Special South Indian Meals',
    kannadaName: 'ಸಹ್ಯಾದ್ರಿ ವೈಭವ ಸ್ಪೆಷಲ್ ಊಟ',
    description:
      'Complete traditional meal featuring steamed Sona Masoori rice, sambar, rasam, palya, vegetable kootu, kosambari, curd, crispy appalam papad, pickle, and daily dessert.',
    price: 150,
    category: 'rice-meals',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
    isPopular: true,
  },
  {
    id: 'sv-08',
    name: 'Authentic Bisi Bele Bath',
    kannadaName: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
    description:
      'Nutritious rice, lentils, and mixed vegetables slow-cooked in hand-ground aromatic spices, finished with ghee and topped with crunchy boondi.',
    price: 85,
    category: 'rice-meals',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
  },
  {
    id: 'sv-09',
    name: 'Homestyle Curd Rice (Mosaranna)',
    kannadaName: 'ಮೊಸರನ್ನ',
    description:
      'Cool tempered rice mixed with fresh creamy curd, mustard seeds, curry leaves, pomegranate pearls, and green chillies.',
    price: 70,
    category: 'rice-meals',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-10',
    name: 'Vegetable Dum Biryani',
    kannadaName: 'ವೆಜ್ ದಮ್ ಬಿರಿಯಾನಿ',
    description:
      'Fragrant aged Basmati rice layered with garden-fresh vegetables and whole spices, served with fresh onion-cucumber raita and salan.',
    price: 160,
    category: 'rice-meals',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'spicy',
    isPopular: true,
  },

  // North Indian
  {
    id: 'sv-11',
    name: 'Paneer Butter Masala',
    kannadaName: 'ಪನೀರ್ ಬಟರ್ ಮಸಾಲಾ',
    description:
      'Soft fresh cottage cheese cubes simmered in a velvety tomato-cashew gravy finished with butter, cream, and dried fenugreek leaves (kasuri methi).',
    price: 190,
    category: 'north-indian',
    image: paneerImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
    isPopular: true,
  },
  {
    id: 'sv-12',
    name: 'Dal Tadka Special',
    kannadaName: 'ದಾಲ್ ತಡ್ಕಾ',
    description:
      'Yellow lentils cooked to perfection, tempered with desi ghee, cumin seeds, garlic, ginger, and red chillies.',
    price: 140,
    category: 'north-indian',
    image: paneerImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
  },
  {
    id: 'sv-13',
    name: 'Butter Garlic Naan (2 Pcs)',
    kannadaName: 'ಗಾರ್ಲಿಕ್ ನಾನ್',
    description:
      'Soft leavened tandoor-baked flatbread infused with roasted minced garlic and brushed with fresh butter.',
    price: 70,
    category: 'north-indian',
    image: paneerImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-14',
    name: 'Kadai Veg Gravy',
    kannadaName: 'ಕಡಾಯಿ ವೆಜ್',
    description:
      'Medley of bell peppers, carrots, beans, and baby corn tossed in a robust crushed coriander and red chilli masala.',
    price: 170,
    category: 'north-indian',
    image: paneerImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'spicy',
  },

  // Snacks
  {
    id: 'sv-15',
    name: 'Crispy Medu Vada (2 Pcs)',
    kannadaName: 'ಮೃದು ವಡೆ',
    description:
      'Golden crispy urad dal fritters infused with crushed black pepper, fresh curry leaves, and ginger. Served with coconut chutney and hot sambar.',
    price: 55,
    category: 'snacks',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-16',
    name: 'Crispy Vegetable Pakoda',
    kannadaName: 'ವೆಜ್ ಪಕೋಡ',
    description:
      'Assorted farm vegetables coated in seasoned chickpea flour batter and deep fried until crisp. Accompanied by mint chutney.',
    price: 75,
    category: 'snacks',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'medium',
  },
  {
    id: 'sv-17',
    name: 'Mangalore Buns (2 Pcs)',
    kannadaName: 'ಮಂಗಳೂರು ಬನ್ಸ್',
    description:
      'Mildly sweet, fluffy banana-infused deep-fried puris from coastal Karnataka, served with spicy coconut chutney.',
    price: 60,
    category: 'snacks',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },

  // Beverages
  {
    id: 'sv-18',
    name: 'Traditional South Indian Filter Coffee',
    kannadaName: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
    description:
      'Authentic freshly brewed chicory-infused decoction with boiled frothy whole milk, served in a traditional brass dabarah and tumbler.',
    price: 30,
    category: 'beverages',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
    isPopular: true,
  },
  {
    id: 'sv-19',
    name: 'Special Masala Chai',
    kannadaName: 'ಮಸಾಲಾ ಟೀ',
    description:
      'Rich Assam tea simmered with fresh crushed cardamom, ginger, cloves, and whole milk.',
    price: 25,
    category: 'beverages',
    image: heroSpreadImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-20',
    name: 'Fresh Sweet Punjabi Lassi',
    kannadaName: 'ಲಸ್ಸಿ',
    description:
      'Thick churned fresh yogurt sweetened with sugar, flavored with rose water, and garnished with chopped pistachios.',
    price: 65,
    category: 'beverages',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },

  // Desserts
  {
    id: 'sv-21',
    name: 'Warm Gulab Jamun with Rabri (2 Pcs)',
    kannadaName: 'ಗುಲಾಬ್ ಜಾಮೂನ್',
    description:
      'Soft melt-in-mouth milk solid dumplings dipped in rose-cardamom sugar syrup, served with rich reduced milk rabri.',
    price: 80,
    category: 'desserts',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
  {
    id: 'sv-22',
    name: 'Desi Ghee Carrot Halwa (Gajar Ka Halwa)',
    kannadaName: 'ಗಜ್ಜರಿ ಹಲ್ವಾ',
    description:
      'Slow-cooked red carrots simmered in pure ghee, khoya, and milk, garnished with toasted cashews and almonds.',
    price: 90,
    category: 'desserts',
    image: thaliImg,
    isVeg: true,
    isAvailable: true,
    isDemoPrice: true,
    spicyLevel: 'mild',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'g-01',
    title: 'Signature South Indian Breakfast',
    category: 'Food',
    description: 'Crisp golden masala dosa, fresh coconut chutney, and filter coffee.',
    image: heroSpreadImg,
  },
  {
    id: 'g-02',
    title: 'Comfortable Family Dining Hall',
    category: 'Dining Area',
    description: 'Spacious, air-conditioned seating designed for family meals and road travellers.',
    image: diningHallImg,
  },
  {
    id: 'g-03',
    title: 'Special Royal South Indian Meals',
    category: 'Food',
    description: 'Generous traditional thali served with fresh accompaniments.',
    image: thaliImg,
  },
  {
    id: 'g-04',
    title: 'Paneer Butter Masala & Naan',
    category: 'Food',
    description: 'Aromatic North Indian curries freshly prepared in copper handi.',
    image: paneerImg,
  },
  {
    id: 'g-05',
    title: 'Traditional Masala Dosa Plating',
    category: 'Special Dishes',
    description: 'Made to order with house-ground fermented batter and pure ghee.',
    image: masalaDosaImg,
  },
  {
    id: 'g-06',
    title: 'Welcoming Highway Location',
    category: 'Ambiance',
    description: 'Conveniently located on Chandapura–Anekal Road opposite JPM Nursery with parking.',
    image: diningHallImg,
  },
];
