"use client";

import { pricingTiersTable } from "@/business/constants";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Fragment } from "react";

export function PricingTable() {
  const tierNames = ["Free", "Plus", "Pro", "Enterprise"];

  return (
    <section className="mt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Compare Plans</h2>
        <p className="text-muted-foreground text-lg">
          See what each tier unlocks so you can choose the plan that fits your strategy.
        </p>
      </div>

      <div className="overflow-x-auto border border-border-divider rounded-sm bg-card/70 backdrop-blur-glass shadow-xl mx-48 mb-16 sm:mx-32 scrollbar-thin">
        <table className="w-full border-collapse text-left text-sm">
          {/* Header */}
          <thead className="sticky top-0 bg-muted/40 backdrop-blur-glass">
            <tr className="border-b border-border-divider">
              <th className="p-4 font-medium text-muted-foreground w-56">Feature</th>
              {tierNames.map((tier) => (
                <th
                  key={tier}
                  className="p-4 font-semibold text-center text-foreground"
                >
                  {tier}
                </th>
              ))}
            </tr>
          </thead>

          {/* Sections */}
          <tbody>
            {Object.values(pricingTiersTable).map((section, i) => (
              <Fragment key={section.label}>
                {/* Section Header */}
                <tr className="bg-muted/20">
                  <td
                    colSpan={5}
                    className="p-4 font-semibold text-primary text-sm tracking-wide uppercase"
                  >
                    {section.label}
                  </td>
                </tr>

                {/* Features inside section */}
                {Object.values(section.items).map((item: any) => (
                  <tr
                    key={item.label}
                    className="border-b border-border-grid hover:bg-muted/10 transition-colors"
                  >
                    {/* Feature label */}
                    <td className="p-4 text-foreground">{item.label}</td>

                    {/* Tier values */}
                    {tierNames.map((t) => {
                      const value = item[t];

                      const isTrue = value === true;
                      const isFalse = value === false;
                      const isText = !isTrue && !isFalse;

                      return (
                        <td key={t} className="p-4 text-center">
                          {isTrue && <Check className="w-5 h-5 text-primary mx-auto" />}
                          {isFalse && (
                            <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                          )}
                          {isText && (
                            <span className="text-foreground text-sm font-medium">
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
