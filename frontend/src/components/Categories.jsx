import React, { useState } from 'react'
import '../componentStyles/Categories.css'
import { categoriesData } from '../data/categories'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import LaptopIcon from '@mui/icons-material/Laptop'
import KitchenIcon from '@mui/icons-material/Kitchen'
import TvIcon from '@mui/icons-material/Tv'
import HeadphonesIcon from '@mui/icons-material/Headphones'
import ClearIcon from '@mui/icons-material/Clear'

// Icon mapping
const iconMap = {
    Smartphone: <SmartphoneIcon />,
    Laptop: <LaptopIcon />,
    Kitchen: <KitchenIcon />,
    Tv: <TvIcon />,
    Headphones: <HeadphonesIcon />
};

function Categories({ onCategorySelect, selectedCategory }) {
    const [expandedCategory, setExpandedCategory] = useState(1); // First category open by default
    const activeSubcategory = selectedCategory || null;

    const handleCategoryToggle = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const handleSubcategoryClick = (subcategory) => {
        if (onCategorySelect) {
            onCategorySelect(subcategory);
        }
    };

    const handleClearFilter = () => {
        if (onCategorySelect) {
            onCategorySelect('');
        }
    };

    return (
        <div className='categories-container'>
            <div className='categories-header-section'>
                <h3 className='categories-title'>Categories</h3>
                {activeSubcategory && (
                    <button className='clear-filter-btn' onClick={handleClearFilter} title="Clear filter">
                        <ClearIcon fontSize="small" />
                        <span>Clear</span>
                    </button>
                )}
            </div>
            {activeSubcategory && (
                <div className='active-filter'>
                    <span className='filter-label'>Active Filter:</span>
                    <span className='filter-value'>{activeSubcategory}</span>
                </div>
            )}
            <div className='categories-list'>
                {categoriesData.map((category) => (
                    <div key={category.id} className='category-item'>
                        <button 
                            className={`category-header ${expandedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryToggle(category.id)}
                        >
                            <span className='category-icon'>{iconMap[category.iconName]}</span>
                            <span className='category-name'>{category.name}</span>
                            <span className='category-toggle'>
                                {expandedCategory === category.id ? 
                                    <ExpandLessIcon /> : 
                                    <ExpandMoreIcon />
                                }
                            </span>
                        </button>
                        
                        {expandedCategory === category.id && (
                            <div className='subcategories'>
                                {category.subcategories.map((subcategory, index) => (
                                    <button
                                        key={index}
                                        className={`subcategory-item ${activeSubcategory === subcategory ? 'active-subcategory' : ''}`}
                                        onClick={() => handleSubcategoryClick(subcategory)}
                                    >
                                        <span className='subcategory-dot'>•</span>
                                        <span className='subcategory-name'>{subcategory}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories
