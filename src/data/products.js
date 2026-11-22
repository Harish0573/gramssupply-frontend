
const products = [
  {
    id: 1,
    name: "Stainless Steel Dustbin",
    category: "Cleaning & Sanitation",
    description:
      "A durable waste collection solution designed for Gram Panchayats, public parks, government offices, schools and commercial spaces.",
    image: "/products/cleaning.jpg",
    priceLabel: "4030",
    brand: "GramSupply",
    model: "GS-SS-001",
    availability: "Available on Request",
    highlights: [
      "Stainless steel construction",
      "Suitable for public places",
      "Easy to clean and maintain",
      "Professional institutional design",
      "Suitable for indoor and outdoor use"
    ],
    specifications: [
      { label: "Product Type", value: "Public Waste Dustbin" },
      { label: "Material", value: "Stainless Steel" },
      { label: "Model Number", value: "GS-SS-001" },
      { label: "Usage", value: "Public Places and Institutions" },
      { label: "Installation", value: "Floor Standing" },
      { label: "Maintenance", value: "Easy Cleaning" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 2,
    name: "Solar Street Light",
    category: "Street & Outdoor Lighting",
    description:
      "An outdoor solar lighting solution designed for village roads, public spaces, streets, parks and rural infrastructure projects.",
    image: "/products/lighting.jpg",
    priceLabel: "8999",
    brand: "GramSupply",
    model: "GS-SL-002",
    availability: "Available on Request",
    highlights: [
      "Solar-powered lighting solution",
      "Suitable for village streets",
      "Renewable energy operation",
      "Designed for outdoor installation",
      "Useful for public infrastructure"
    ],
    specifications: [
      { label: "Product Type", value: "Solar Street Light" },
      { label: "Power Source", value: "Solar Energy" },
      { label: "Lighting Type", value: "LED (confirm model)" },
      { label: "Installation", value: "Outdoor / Pole Mounted" },
      { label: "Battery Capacity", value: "Confirm with supplier" },
      { label: "Solar Panel Capacity", value: "Confirm with supplier" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 3,
    name: "CCTV Security Camera",
    category: "CCTV & Security",
    description:
      "A security surveillance solution for monitoring government offices, Gram Panchayat buildings, schools, public facilities and institutional premises.",
    image: "/products/cctv.jpg",
    priceLabel: "2241",
    brand: "GramSupply",
    model: "GS-CCTV-003",
    availability: "Available on Request",
    highlights: [
      "Security surveillance solution",
      "Suitable for institutional premises",
      "Indoor and outdoor options available",
      "Helps monitor public facilities",
      "Multiple camera configurations available"
    ],
    specifications: [
      { label: "Product Type", value: "CCTV Security Camera" },
      { label: "Camera Resolution", value: "Confirm with supplier" },
      { label: "Camera Type", value: "Confirm model" },
      { label: "Night Vision", value: "Confirm with supplier" },
      { label: "Connectivity", value: "Confirm with supplier" },
      { label: "Storage", value: "DVR / NVR / Other (as applicable)" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 4,
    name: "Desktop Computer",
    category: "Computers & Office Technology",
    description:
      "A desktop computing solution for Gram Panchayat offices, administrative departments, educational institutions and government workplaces.",
    image: "/products/computers.jpg",
    priceLabel: "24999",
    brand: "GramSupply",
    model: "GS-PC-004",
    availability: "Available on Request",
    highlights: [
      "Suitable for office administration",
      "Supports everyday computing tasks",
      "Useful for digital documentation",
      "Suitable for institutional workplaces",
      "Multiple configurations available"
    ],
    specifications: [
      { label: "Product Type", value: "Desktop Computer" },
      { label: "Processor", value: "Confirm configuration" },
      { label: "RAM", value: "Confirm configuration" },
      { label: "Storage", value: "Confirm configuration" },
      { label: "Monitor", value: "Confirm package details" },
      { label: "Operating System", value: "Confirm configuration" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 5,
    name: "Commercial RO Plant",
    category: "Water Systems",
    description:
      "A commercial water purification solution designed for institutional use in schools, community buildings, public facilities and rural areas.",
    image: "/products/water.jpg",
    priceLabel: "1200",
    brand: "GramSupply",
    model: "GS-RO-005",
    availability: "Available on Request",
    highlights: [
      "Commercial water purification solution",
      "Suitable for institutional requirements",
      "Multiple capacity options available",
      "Designed for regular water treatment",
      "Maintenance requirements depend on configuration"
    ],
    specifications: [
      { label: "Product Type", value: "Commercial RO Plant" },
      { label: "Purification Technology", value: "Reverse Osmosis" },
      { label: "Capacity", value: "Confirm with supplier" },
      { label: "Installation", value: "Site Dependent" },
      { label: "Power Requirement", value: "Confirm with supplier" },
      { label: "Maintenance", value: "As per manufacturer guidelines" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Installation and delivery subject to location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 6,
    name: "Office Chair",
    category: "Furniture",
    description:
      "Comfortable institutional office seating designed for Gram Panchayat offices, administrative workplaces, meeting rooms and educational institutions.",
    image: "/products/furniture.jpg",
    priceLabel: "6431",
    brand: "GramSupply",
    model: "GS-CH-006",
    availability: "Available on Request",
    highlights: [
      "Designed for office environments",
      "Suitable for administrative workplaces",
      "Multiple designs and finishes available",
      "Institutional furniture solution",
      "Suitable for everyday office use"
    ],
    specifications: [
      { label: "Product Type", value: "Office Chair" },
      { label: "Frame Material", value: "Confirm with supplier" },
      { label: "Upholstery", value: "Confirm with supplier" },
      { label: "Adjustable Height", value: "Confirm model" },
      { label: "Armrests", value: "Confirm model" },
      { label: "Usage", value: "Office and Institutional" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 7,
    name: "Outdoor Playground Slide",
    category: "Playground & Open Gym",
    description:
      "Outdoor recreational playground equipment intended for parks, schools, community spaces and village development projects.",
    image: "/products/playground.jpg",
    priceLabel: "26900",
    brand: "GramSupply",
    model: "GS-PL-007",
    availability: "Available on Request",
    highlights: [
      "Outdoor recreational equipment",
      "Suitable for public playgrounds",
      "Multiple designs available",
      "Designed for children's play areas",
      "Installation requirements depend on model"
    ],
    specifications: [
      { label: "Product Type", value: "Outdoor Playground Slide" },
      { label: "Material", value: "Confirm with supplier" },
      { label: "Age Group", value: "As specified by manufacturer" },
      { label: "Installation", value: "Site Dependent" },
      { label: "Dimensions", value: "Confirm with supplier" },
      { label: "Safety Standards", value: "Confirm certification" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Installation and delivery subject to location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 8,
    name: "Manhole Cover",
    category: "Village Infrastructure",
    description:
      "A drainage and underground utility access cover intended for municipal infrastructure, drainage systems and village development works.",
    image: "/products/infrastructure.jpg",
    priceLabel: "1200",
    brand: "GramSupply",
    model: "GS-MH-008",
    availability: "Available on Request",
    highlights: [
      "Infrastructure access cover",
      "Suitable for drainage applications",
      "Multiple sizes available",
      "Different material options available",
      "Designed for utility access applications"
    ],
    specifications: [
      { label: "Product Type", value: "Manhole Cover" },
      { label: "Material", value: "Confirm with supplier" },
      { label: "Shape", value: "Confirm with supplier" },
      { label: "Dimensions", value: "Confirm with supplier" },
      { label: "Load Rating", value: "Confirm with supplier" },
      { label: "Application", value: "Drainage Infrastructure" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  },

  {
    id: 9,
    name: "Fire Extinguisher",
    category: "Power, Solar & Safety",
    description:
      "Fire safety equipment intended for offices, schools, government buildings, community facilities and institutional premises.",
    image: "/products/safety.jpg",
    priceLabel: "12000",
    brand: "GramSupply",
    model: "GS-FE-009",
    availability: "Available on Request",
    highlights: [
      "Institutional fire safety equipment",
      "Multiple extinguisher types available",
      "Suitable for workplace safety planning",
      "Different capacities available",
      "Requires periodic inspection and maintenance"
    ],
    specifications: [
      { label: "Product Type", value: "Fire Extinguisher" },
      { label: "Extinguishing Agent", value: "Confirm with supplier" },
      { label: "Capacity", value: "Confirm with supplier" },
      { label: "Fire Class Rating", value: "Confirm product certification" },
      { label: "Operating Method", value: "As specified by manufacturer" },
      { label: "Certification", value: "Verify applicable BIS certification" }
    ],
    warranty: "Confirm with supplier",
    delivery: "Available subject to delivery location",
    returnPolicy: "Subject to supplier terms"
  }
];

export default products;
