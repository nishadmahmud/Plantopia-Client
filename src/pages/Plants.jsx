import React from 'react';
import ProductList from '../components/ProductList';
import { productCategories } from '../config/categories';

const Plants = () => {
  const category = productCategories.find(cat => cat.id === 'plants');
  return <ProductList category="plants" subcategories={category.subcategories} />;
};

export default Plants; 