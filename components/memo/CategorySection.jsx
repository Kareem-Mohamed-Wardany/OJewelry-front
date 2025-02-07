import React, { memo, useRef } from "react";
import { CategoryTile } from "../shopping-view/CategoryTile";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
export const CategorySection = memo(
  ({ categoriesWithIcon, handleNavigateToListingPage }) => {
    const scrollContainerRef = useRef(null);
    const scrollLeft = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft -= 100; // You can adjust the scroll amount
      }
    };

    // Scroll the container right by a fixed amount
    const scrollRight = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += 100; // You can adjust the scroll amount
      }
    };
    return (
      <div className="relative">
        {/* Left Scroll Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={scrollLeft}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary/80 z-10  bg-primary"
        >
          <ChevronLeftIcon className="w-4 h-4 text-secondary" />
        </Button>
        {/* Scrollable Category Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto py-2 px-4 max-w-full scrollbar-hide"
        >
          {Object.values(categoriesWithIcon).map((categoryItem) => (
            <CategoryTile
              key={categoryItem.id}
              categoryItem={categoryItem}
              handleNavigateToListingPage={handleNavigateToListingPage}
            />
          ))}
        </div>
        {/* Right Scroll Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={scrollRight}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary/80 bg-primary"
        >
          <ChevronRightIcon className="w-4 h-4 text-secondary" />
        </Button>
      </div>
    );
  }
);
