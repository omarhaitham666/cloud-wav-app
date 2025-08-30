export const slides = [
  {
    id: "1",
    image: require("../assets/images/listen.png"),
    title: "Listening Music Anytime",
    description:
      "The artists we represent are one of the most successful in Romania and also were a huge breakthrough.",
  },
  {
    id: "2",
    image: require("../assets/images/artist.png"),
    title: "Discover New Artists",
    description:
      "Explore trending talents and experience fresh entertainment anytime.",
  },
  {
    id: "3",
    image: require("../assets/images/creator.png"),
    title: "Stay Connected Everywhere",
    description:
      "Enjoy music and shows across all your devices with just one click.",
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
    name: "Basic",
    monthlyPrice: 2,
    yearlyPrice: 20,
    features: [
      "Unlimited listening",
      "Unlimited downloading",
      "No ads",
      "Direct downloads",
      "Easier browsing",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 20,
    yearlyPrice: 200,
    isPopular: true,
    features: [
      "Content protection and copyright security during the contract period",
      "Ensuring successful revenue access",
      "Protecting and developing the artist's platforms",
      "Customizing an artist profile on our platform",
      "Providing real job opportunities through our platform",
      "No ads",
      "Easier browsing",
    ],
  },
  {
    id: "pro",
    name: "Pro Tune",
    monthlyPrice: 40,
    yearlyPrice: 400,
    features: [
      "Content protection and copyright security during the contract period",
      "Ensuring successful revenue access",
      "Protecting and developing the artist's platforms",
      "Customizing an artist profile on our platform",
      "Providing real job opportunities through our platform",
      "Uploading content to all our official platforms (Exclusive marketing service)",
      "No ads",
      "Easier browsing",
    ],
  },
];

export const services = [
  {
    title: "Professional Voice Recording",
    description:
      "Record your voice in a studio equipped with the latest technology, with a sound engineer to ensure clarity and high quality.",
    icon: "mic-outline",
  },
  {
    title: "Song Lyrics Writing",
    description:
      "We help you write lyrics that express you, match your style, and deliver your message.",
    icon: "create-outline",
  },
  {
    title: "Music Production & Arrangement",
    description:
      "Original music and professional arrangement by experienced producers and musicians, across various styles and genres.",
    icon: "musical-notes-outline",
  },
  {
    title: "Professional Music Video Shooting",
    description:
      "Shoot a high-quality music video with a specialized directing and filming team, including lighting, editing, and visual effects.",
    icon: "videocam-outline",
  },
  {
    title: "Complete Song Creation",
    description:
      "From lyrics and composition to recording, arrangement, and mastering—we deliver a fully finished, publish-ready song.",
    icon: "headset-outline",
  },
  {
    title: "Full Song & Music Video Package",
    description:
      "A complete package including song production and high-quality video clip, with full coordination between all project elements.",
    icon: "albums-outline",
  },
];
