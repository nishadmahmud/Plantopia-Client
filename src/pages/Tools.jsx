import React from 'react';
import ProductList from '../components/ProductList';
import { productCategories } from '../config/categories';

const Tools = () => {
  const category = productCategories.find(cat => cat.id === 'tools');
  return <ProductList category="tools" subcategories={category.subcategories} />;
};

export default Tools; 