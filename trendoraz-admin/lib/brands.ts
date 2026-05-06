export const BRAND_CATEGORIES = {
  "Sneakers": [
    "Nike", "Air Jordans", "Yeezys", "Zegna", "Loro Piana", 
    "New Balance", "On Running", "Off-White", "Basketball Shoes", "Golden Goose"
  ],
  "Performance & Fashion": [
    "Valentino", "Cole Haan", "Xerjoff", "Tom Ford", "Azzaro"
  ],
  "Apparel": [
    "Off-White", "Essentials", "Drew House", "Palm Angels", 
    "Amiri", "All Saints", "Polo Ralph Lauren", "Anti Social", "Burberry", "Gucci"
  ],
  "Others": [
    "Hoodies", "Strategy", "WHOOP"
  ],
  "Watches": [
    "Cartier", "Rolex", "Franck Muller", "Patek Philippe"
  ]
};

export const getAllCategories = () => {
  return Object.values(BRAND_CATEGORIES).flat();
};
