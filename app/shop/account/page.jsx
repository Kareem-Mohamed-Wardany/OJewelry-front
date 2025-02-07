"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import Image from "next/image";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative w-full h-[100px] md:h-[220px] lg:h-[250px] xl:h-[500px] overflow-hidden">
        <Image
          src={"https://placehold.co/1920x500/webp"}
          alt="Placeholder"
          layout="fill"
          // width={1920}
          // height={500}
          objectFit="cover"
          loading="eager" // Eager load for LCP image
          priority // Priority loading for LCP image
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
