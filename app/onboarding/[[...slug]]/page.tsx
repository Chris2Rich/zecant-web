"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { pricingTiers } from "@/business/constants.js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "pay">("select");

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
      const res = await fetch("/api/update-billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingTier: selectedTier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update billing");

      // ✅ Move to payment step
      setClientSecret(data.clientSecret);
      setSubscriptionId(data.subscriptionId);
      setStep("pay");
    } catch (err) {
      console.error(err);
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

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl p-8 shadow-2xl w-full max-w-6xl"
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-xl">Z</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Choose Your Plan</h1>
              <p className="text-muted-foreground">
                Select a plan to finish onboarding and get started.<br />
                {selectedTier ? `Currently selected: ${selectedTier}` : ""}
              </p>
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
                  <div
                    className={`
                      relative h-full rounded-2xl p-8 cursor-pointer
                      bg-card border transition-all duration-300 flex flex-col
                      ${selectedTier === tier.name
                        ? "border-primary shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                        : "border-border group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                      }
                    `}
                    onClick={() => handleSelect(tier.name)}
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                      <p className="text-muted-foreground">{tier.description}</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">${tier.price}</span>
                        {tier.period && (
                          <span className="text-muted-foreground text-sm">{tier.period}</span>
                        )}
                      </div>
                    </div>

                    <div className="container mx-auto mb-4 px-4">
                      <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline font-bold ml-[50%] -translate-x-1/2">
                        {tier.credits} Credits
                      </div>
                    </div>

                    {tier.discount && (
                      <span className="text-muted-foreground text-sm ml-[50%] -translate-x-1/2">
                        + {tier.discount}% Credit Discount
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              className="ml-[50%] -translate-x-1/2 font-semibold text-lg mt-8"
              onClick={handleContinue}
              disabled={!selectedTier || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === "pay" && clientSecret && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl p-8 shadow-2xl w-full max-w-lg"
          >
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                clientSecret={clientSecret}
                subscriptionId={subscriptionId!}
                onSuccess={() => router.replace("/app")}
              />
            </Elements>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PaymentForm({
  clientSecret,
  subscriptionId,
  onSuccess,
}: {
  clientSecret: string;
  subscriptionId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsPaying(true);
    setError("");

    // ✅ Pass clientSecret directly as documented
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setIsPaying(false);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      await fetch("/api/finalize-billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-4">Complete Your Payment</h2>
      <CardElement className="p-3 border border-border rounded-lg bg-background" />
      {error && <p className="text-destructive text-sm text-center">{error}</p>}
      <Button
        onClick={handlePayment}
        disabled={isPaying}
        className="w-full font-semibold text-lg mt-4"
      >
        {isPaying ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}