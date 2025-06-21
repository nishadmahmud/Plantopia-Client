import { FaLeaf, FaSeedling, FaTools, FaFlask } from 'react-icons/fa';
import { GiPlantRoots } from 'react-icons/gi';

export const productCategories = [
  {
    id: 'plants',
    label: 'Plants',
    path: '/plants',
    icon: FaLeaf,
    description: 'Discover our collection of indoor and outdoor plants',
    subcategories: ['Indoor Plants', 'Flowering Plants', 'Fruit Plants'],
    color: 'from-green-900/80 via-green-800/60 to-green-900/80',
  },
  {
    id: 'tools',
    label: 'Tools',
    path: '/tools',
    icon: FaTools,
    description: 'Professional gardening tools for every need',
    subcategories: ['Gardening Tools', 'Watering Tools', 'Plant Care Tools'],
    color: 'from-blue-900/80 via-green-700/60 to-green-900/80',
  },
  {
    id: 'soils',
    label: 'Soils',
    path: '/soils',
    icon: GiPlantRoots,
    description: 'Premium quality soils and potting mixes',
    subcategories: ['Potting Mix', 'Garden Soil', 'Organic Soil'],
    color: 'from-yellow-800/80 via-green-700/60 to-green-900/80',
  },
  {
    id: 'fertilizers',
    label: 'Fertilizers',
    path: '/fertilizers',
    icon: FaFlask,
    description: 'Organic and chemical fertilizers for optimal growth',
    subcategories: ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Food'],
    color: 'from-green-800/80 via-green-700/60 to-green-900/80',
  },
]; 