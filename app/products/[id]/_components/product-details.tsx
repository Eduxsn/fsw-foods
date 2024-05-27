"use client";

import ProductList from "@/app/_components/product-list";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  formatCurrency,
  calculateProductsTotalPrice,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import {
  ArrowDown,
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState === 1) return 1;
      return currentState - 1;
    });

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative h-6 w-6">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            className="rounded-full object-cover"
            fill
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>

      <h1 className="mb-3 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

      <div className="flex justify-between px-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {formatCurrency(calculateProductsTotalPrice(product))}
            </h2>
            {product.discountPercentage > 0 && (
              <Badge className="text-xs font-semibold hover:bg-primary">
                <ArrowDown size={12} />
                {product.discountPercentage}%
              </Badge>
            )}
          </div>

          {product.discountPercentage > 0 && (
            <p className="text-muted-foregound text-sm">
              De: {formatCurrency(Number(product.price))}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-center">
          <Button
            onClick={handleDecreaseQuantityClick}
            size={"icon"}
            variant={"ghost"}
            className="border border-solid border-muted-foreground"
          >
            <ChevronLeftIcon />
          </Button>
          <span className="w-4">{quantity}</span>
          <Button onClick={handleIncreaseQuantityClick} size={"icon"}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <Card className="mx-5 mt-6 flex justify-around py-3">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="">Entrega</span>
            <BikeIcon size={14} />
          </div>

          {Number(product.restaurant.deliveryFee) > 0 ? (
            <span className="text-xs font-bold">
              {formatCurrency(Number(product.restaurant.deliveryFee))}
            </span>
          ) : (
            <span className="text-xs font-semibold">Grátis</span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="">Entrega</span>
            <TimerIcon size={14} />
          </div>

          {Number(product.restaurant.deliveryFee) > 0 ? (
            <span className="text-xs font-bold">
              {product.restaurant.deliveryTimeMinutes} min
            </span>
          ) : (
            <span className="text-xs font-semibold">Grátis</span>
          )}
        </div>
      </Card>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="px-5 font-semibold">Sucos</h3>
        <ProductList products={complementaryProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
