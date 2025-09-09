export const slides = [
  {
    id: "1",
    image: require("../assets/images/listen.png"),
    title: "welcome.slides.slide1.title",
    description: "welcome.slides.slide1.description",
  },
  {
    id: "2",
    image: require("../assets/images/artist.png"),
    title: "welcome.slides.slide2.title",
    description: "welcome.slides.slide2.description",
  },
  {
    id: "3",
    image: require("../assets/images/creator.png"),
    title: "welcome.slides.slide3.title",
    description: "welcome.slides.slide3.description",
  },
];

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "pricing.plans.basic",
    monthlyPrice: 2,
    yearlyPrice: 20,
    features: [
      "pricing.features.unlimitedListening",
      "pricing.features.unlimitedDownloading",
      "pricing.features.noAds",
      "pricing.features.directDownloads",
      "pricing.features.easierBrowsing",
    ],
  },
  {
    id: "starter",
    name: "pricing.plans.starter",
    monthlyPrice: 20,
    yearlyPrice: 200,
    isPopular: true,
    features: [
      "pricing.features.contentProtection",
      "pricing.features.ensuringSuccessfulRevenue",
      "pricing.features.protectingArtistPlatforms",
      "pricing.features.customizingArtistProfile",
      "pricing.features.providingRealJobs",
      "pricing.features.noAds",
      "pricing.features.easierBrowsing",
    ],
  },
  {
    id: "pro",
    name: "pricing.plans.proTune",
    monthlyPrice: 40,
    yearlyPrice: 400,
    features: [
      "pricing.features.contentProtection",
      "pricing.features.ensuringSuccessfulRevenue",
      "pricing.features.protectingArtistPlatforms",
      "pricing.features.customizingArtistProfile",
      "pricing.features.providingRealJobs",
      "pricing.features.exclusiveMarketing",
      "pricing.features.noAds",
      "pricing.features.easierBrowsing",
    ],
  },
];

export const services = [
  {
    title: "services.servicesData.voiceRecording.title",
    description: "services.servicesData.voiceRecording.description",
    icon: "mic-outline",
  },
  {
    title: "services.servicesData.songWriting.title",
    description: "services.servicesData.songWriting.description",
    icon: "create-outline",
  },
  {
    title: "services.servicesData.musicProduction.title",
    description: "services.servicesData.musicProduction.description",
    icon: "musical-notes-outline",
  },
  {
    title: "services.servicesData.videoShooting.title",
    description: "services.servicesData.videoShooting.description",
    icon: "videocam-outline",
  },
  {
    title: "services.servicesData.completeSong.title",
    description: "services.servicesData.completeSong.description",
    icon: "headset-outline",
  },
  {
    title: "services.servicesData.fullPackage.title",
    description: "services.servicesData.fullPackage.description",
    icon: "albums-outline",
  },
];

export const creatorCategories = [
  {
    id: 1,
    title: "Actors",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    title: "Musicians",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    title: "Content Creators",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    title: "Youtubers",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    title: "Athlete",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    title: "Public Figure",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 7,
    title: "Tiktokers",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
  },
];
