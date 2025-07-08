import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
export const CategoryTile = ({ categoryItem, handleNavigateToListingPage }) => {
  return (
    <Card
      key={categoryItem.id}
      onClick={() => handleNavigateToListingPage(categoryItem, "category")}
      className="cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105 flex justify-center"
    >
      <CardContent className="flex flex-col items-center justify-between p-1 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col items-center justify-center w-full mb-4">
          <div className="relative mb-4 w-[200px] h-[200px]">
            {/* Set a fixed height */}
            <Image
              alt={categoryItem.label}
              src={categoryItem.image}
              layout="fill"
              objectPosition="center"
              priority
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
        <span className="text-xl font-semibold text-gray-700 text-center">
          {categoryItem.label}
        </span>
      </CardContent>
    </Card>
  );
};
