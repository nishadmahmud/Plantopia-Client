import React from 'react';
import ProductList from '../components/ProductList';
import { productCategories } from '../config/categories';

const Soils = () => {
  const category = productCategories.find(cat => cat.id === 'soils');
  return <ProductList category="soils" subcategories={category.subcategories} />;
};

export default Soils; 