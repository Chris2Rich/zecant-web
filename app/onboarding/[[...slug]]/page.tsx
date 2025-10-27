"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { pricingTiers } from "@/business/constants.js"

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (tier: string) => {
    setSelectedTier(tier);
    setError("");
  };

  const handleContinue = async () => {
    if (!selectedTier || !user) {
      setError("Please select a tier to continue.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
    //   await user.update({ publicMetadata: { tier: selectedTier, onboardingComplete: true } });
      router.replace("/app");
    } catch (err) {
      setError("Unable to save tier. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/80 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative w-full mr-[4rem] ml-[4rem]">
        <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Choose Your Plan</h1>
            <p className="text-muted-foreground">Select a plan to finish onboarding and get started.</p>
          </div>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg text-center mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mx-auto px-4">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group hover:-translate-y-2 transition-transform duration-300"
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
                    ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                        : "bg-card text-secondary-foreground border-border border-1 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    }
                    `}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`
                    relative h-full rounded-2xl p-8 
                    bg-card border transition-all duration-300 flex flex-col
                    ${
                      tier.highlighted
                        ? "border-primary shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                        : "border-border group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    }
                  `}
                >
                  {/* Tier Name & Description */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">${tier.price}</span>
                      {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
                    </div>
                  </div>

                  <div className="container mx-auto mb-4 px-4">
                    <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>

                  {/* Credits */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="font-bold">{tier.credits} Credits</span>
                      {tier.discount && <span className="text-muted-foreground text-sm ml-auto">
                        + {tier.discount}%
                        <span className="xl:hidden 2xl:inline"> Credit</span> Discount
                        </span>}
                    </div>
                  </div>

                  <div className="container mx-auto mb-4 px-4">
                    <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>
                </div>

              </motion.div>
            ))}
        </div>
          <Button
            className="w-full py-3 font-semibold text-lg mt-2"
            onClick={handleContinue}
            disabled={!selectedTier || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}