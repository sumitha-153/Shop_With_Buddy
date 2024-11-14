// import React from 'react';

// interface FilterPanelProps {
//   categories: string[];
//   sizes: string[];
//   colors: string[];
//   selectedFilters: {
//     category: string[];
//     size: string[];
//     color: string[];
//     priceRange: [number, number];
//   };
//   onFilterChange: (filterType: string, value: string | number[]) => void;
// }

// const FilterPanel: React.FC<FilterPanelProps> = ({
//   categories,
//   sizes,
//   colors,
//   selectedFilters,
//   onFilterChange,
// }) => {
//   return (
//     <div className="border p-4 rounded-lg shadow-md bg-white">
//       <h2 className="text-lg font-bold mb-4">Filters</h2>
//       <div>
//         <h3 className="font-semibold">Category</h3>
//         {categories.map((category) => (
//           <label key={category} className="block">
//             <input
//               type="checkbox"
//               checked={selectedFilters.category.includes(category)}
//               onChange={() => onFilterChange('category', category)}
//             />
//             {category}
//           </label>
//         ))}
//       </div>
//       <div>
//         <h3 className="font-semibold">Size</h3>
//         {sizes.map((size) => (
//           <label key={size} className="block">
//             <input
//               type="checkbox"
//               checked={selectedFilters.size.includes(size)}
//               onChange={() => onFilterChange('size', size)}
//             />
//             {size}
//           </label>
//         ))}
//       </div>
//       <div>
//         <h3 className="font-semibold">Color</h3>
//         {colors.map((color) => (
//           <label key={color} className="block">
//             <input
//               type="checkbox"
//               checked={selectedFilters.color.includes(color)}
//               onChange={() => onFilterChange('color', color)}
//             />
//             {color}
//           </label>
//         ))}
//       </div>
//       <div>
//         <h3 className="font-semibold">Price Range</h3>
//         <input
//           type="range"
//           min="0"
//           max="1000"
//           value={selectedFilters.priceRange[1]}
//           onChange={(e) => onFilterChange('priceRange', [0, Number(e.target.value)])}
//         />
//         <span>${selectedFilters.priceRange[0]} - ${selectedFilters.priceRange[1]}</span>
//       </div>
//     </div>
//   );
// };

// export default FilterPanel; 



import React from 'react';
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterPanelProps {
  readonly categories: string[];
  readonly sizes: string[];
  readonly colors: string[];
  readonly selectedFilters: {
    readonly category: string[];
    readonly size: string[];
    readonly color: string[];
    readonly priceRange: [number, number];
  };
  readonly onFilterChange: (filterType: string, value: string | number[]) => void;
}

const shopCategories = [
  "Mobiles, Computers",
  "TV, Appliances, Electronics",
  "Men's Fashion",
  "Women's Fashion",
  "Home, Kitchen, Pets",
  "beauty", "Health", "Grocery",
  "Sports, Fitness, Bags, Luggage",
  "Toys, Baby Products, Kids' Fashion",
  "Car, Motorbike, Industrial",
  "Books",
  "Movies, Music & Video Games"
];

export default function FilterPanel({
  categories,
  sizes,
  colors,
  selectedFilters,
  onFilterChange,
}: FilterPanelProps) {
  return (
    <div className="w-full max-w-xs space-y-4 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="shop-category">
          <AccordionTrigger>Shop by Category</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-2">
                {shopCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedFilters.category.includes(category)}
                      onCheckedChange={() => onFilterChange('category', category)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedFilters.size.includes(size)}
                    onCheckedChange={() => onFilterChange('size', size)}
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedFilters.color.includes(color)}
                    onCheckedChange={() => onFilterChange('color', color)}
                  />
                  <Label htmlFor={`color-${color}`} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full bg-${color.toLowerCase()}-500`} />
                    <span>{color}</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="space-y-2">
        <h3 className="font-semibold">Price Range</h3>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[selectedFilters.priceRange[1]]}
          onValueChange={(value) => onFilterChange('priceRange', [0, value[0]])}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>${selectedFilters.priceRange[0]}</span>
          <span>${selectedFilters.priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}