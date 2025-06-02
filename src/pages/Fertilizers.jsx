import React from 'react';
import ProductList from '../components/ProductList';
import { productCategories } from '../config/categories';

const Fertilizers = () => {
  const category = productCategories.find(cat => cat.id === 'fertilizers');
  return <ProductList category="fertilizers" subcategories={category.subcategories} />;
};

export default Fertilizers; 