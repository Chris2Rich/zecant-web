"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Lock } from "lucide-react";
import { pricingTiers } from "@/business/constants.js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const isTierEnabled = (tierName: string) => tierName === "Free";

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
    if (!isTierEnabled(tier)) return;
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
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update billing");

      if (data.free) {
        router.replace("/app");
        return;
      }

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
    <ScrollReveal>
      <div className="min-h-screen flex items-center justify-center p-4 relative py-20">
        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-card/70 backdrop-blur-glass border border-border-glass rounded-sm p-8 shadow-2xl w-full max-w-6xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 backdrop-blur-glass rounded-sm flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-2xl">Z</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Choose Your Trading Edge</h1>
                <p className="text-muted-foreground text-lg">
                  Select a plan to finish onboarding and get started.<br />
                  {selectedTier ? <span className="text-primary">Currently selected: {selectedTier}</span> : ""}
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xs text-center mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mx-auto px-4">
                {pricingTiers.map((tier, index) => {
                  const enabled = isTierEnabled(tier.name);
                  return (
                    <motion.div
                      key={tier.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative group ${enabled ? 'hover:-translate-y-2' : ''} transition-transform duration-300`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <span className={`px-4 py-1 rounded-sm text-sm font-semibold whitespace-nowrap transition-all duration-300
                            ${tier.highlighted
                              ? "bg-primary text-primary-foreground group-hover:border-primary/50 group-hover:inner-light-primary"
                              : "bg-card/70 backdrop-blur-glass text-secondary-foreground border-border-divider border-1 group-hover:border-primary/50 group-hover:inner-light-subtle"
                            }
                          `}>
                            {tier.badge}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`
                          relative h-full rounded-sm p-8 
                          bg-card/70 backdrop-blur-glass border transition-all duration-300 flex flex-col
                          ${!enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${enabled && selectedTier === tier.name
                            ? "border-primary shadow-[0_0_30px_rgba(96,165,250,0.3)] group-hover:shadow-[0_0_50px_rgba(96,165,250,0.5)] group-hover:inner-light-primary"
                            : enabled ? "border-border-divider group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(96,165,250,0.2)] group-hover:inner-light-subtle"
                            : "border-border"
                          }
                        `}
                        onClick={() => handleSelect(tier.name)}
                      >
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                          <p className="text-muted-foreground">{tier.description}</p>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-baseline gap-1 whitespace-nowrap">
                            <span className="text-5xl font-bold">${tier.price}</span>
                            {tier.period && (
                              <span className="text-muted-foreground text-sm">{tier.period}</span>
                            )}
                          </div>
                        </div>

                        <div className="container mx-auto mb-4 px-4">
                          <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border-divider to-transparent" />
                        </div>

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
                          <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border-divider to-transparent" />
                        </div>

                        <ul className="space-y-4 mb-6 flex-grow">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <Check className={`w-5 h-5 shrink-0 mt-0.5 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {!enabled && (
                          <div className="absolute inset-0 bg-background/30 rounded-sm flex items-center justify-center">
                            <div className="flex items-center gap-2 text-muted-foreground bg-card/80 backdrop-blur-glass px-4 py-2 rounded-sm">
                              <Lock className="w-4 h-4" />
                              <span className="font-medium">Coming Soon</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  className="font-semibold text-lg px-8"
                  onClick={handleContinue}
                  disabled={!selectedTier || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "pay" && clientSecret && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-card/70 backdrop-blur-glass border border-border-glass rounded-sm p-8 shadow-2xl w-full max-w-lg"
            >
              <Elements stripe={stripePromise} options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: 'hsl(var(--primary))',
                    colorBackground: 'hsl(var(--background))',
                    colorText: 'hsl(var(--foreground))',
                    colorDanger: 'hsl(var(--destructive))',
                    fontFamily: 'inherit',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                    colorTextPlaceholder: 'hsl(var(--muted-foreground))',
                  },
                  rules: {
                    '.Input': {
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--input))',
                      color: 'hsl(var(--foreground))',
                    },
                    '.Input:focus': {
                      border: '1px solid hsl(var(--ring))',
                      boxShadow: '0 0 0 1px hsl(var(--ring))',
                      outline: 'none',
                    },
                    '.Label': {
                      color: 'hsl(var(--foreground))',
                      fontWeight: '500',
                    },
                  },
                },
              }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  subscriptionId={subscriptionId!}
                  selectedTier={selectedTier}
                  onSuccess={() => router.replace("/app")}
                />
              </Elements>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}

function PaymentForm({
  clientSecret,
  subscriptionId,
  selectedTier,
  onSuccess,
}: {
  clientSecret: string;
  subscriptionId: string;
  selectedTier: string | null;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsPaying(true);
    setError("");

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      },
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
        credentials: "include",
      });
      onSuccess();
    }
  };

  const tier = pricingTiers.find(t => t.name === selectedTier);

  const stripeElementStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: 'oklch(0.95 0.01 260)',
        fontFamily: 'inherit',
        '::placeholder': {
          color: 'oklch(0.65 0.02 260)',
        },
      },
      invalid: {
        color: 'oklch(0.55 0.2 25)',
      },
    },
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 backdrop-blur-glass rounded-sm flex items-center justify-center mx-auto mb-4">
          <span className="text-primary-foreground font-bold text-2xl">Z</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Complete Your Payment</h1>
        {tier && (
          <p className="text-primary font-medium mb-2">
            {tier.name} Plan — ${tier.price}{tier.period ? `/${tier.period}` : ''}
          </p>
        )}
        <p className="text-muted-foreground">Enter your payment details to get started</p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="cardholder" className="block text-sm font-medium text-foreground mb-2">
              Cardholder Name
            </label>
            <input
              id="cardholder"
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-input rounded-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              placeholder="John Doe"
            />
          </div>

          <div>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">
                Card Number
              </label>
              <CardNumberElement
                id="cardNumber"
                className="px-4 py-3 bg-background border border-input rounded-xs mb-4"
                options={stripeElementStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm font-medium text-foreground mb-2">
                  Expiry Date
                </label>
                <CardExpiryElement
                  id="cardExpiry"
                  className="px-4 py-3 bg-background border border-input rounded-xs"
                  options={stripeElementStyle}
                />
              </div>

              <div>
                <label htmlFor="cardCvc" className="block text-sm font-medium text-foreground mb-2">
                  CVC
                </label>
                <CardCvcElement
                  id="cardCvc"
                  className="px-4 py-3 bg-background border border-input rounded-xs"
                  options={stripeElementStyle}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPaying || !stripe}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-sm hover:inner-light-primary active:inner-light-primary transition-all duration-300"
        >
          {isPaying ? 'Processing...' : `Pay $${tier?.price || 0}`}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-xs">
          Your payment is secured by Stripe
        </p>
      </div>
    </div>
  );
}
