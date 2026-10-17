export interface Mascot {
  id: string;
  name: string;
  species: string;
  avatar: string;
  thirstyMessage: string;
  sippingMessage: string;
  happyMessage: string;
  goalMessage: string;
  color: string;
}

export const MASCOTS: Mascot[] = [
  {
    id: 'droppy',
    name: 'Droppy',
    species: 'Bubbly Water Slime',
    avatar: '💧',
    thirstyMessage: "I'm drying up! Give me some juicy water plzzz! 🥺",
    sippingMessage: 'Gulp gulp gulp! Ahh, tastes like pure magic! ⚡️',
    happyMessage: "I'm bouncing with hydration power! Look at me go! 💦✨",
    goalMessage: 'WOOHOO! Maximum hydration unlocked! You are a water superhero! 🦸‍♂️👑',
    color: 'from-sky-400 to-blue-600',
  },
  {
    id: 'froggo',
    name: 'Sir Hops-a-Lot',
    species: 'Thirsty Treefrog',
    avatar: '🐸',
    thirstyMessage: 'Ribbit! My tongue is stuck to my beak! Water please! 🦟💧',
    sippingMessage: 'SLUUUURP! Ribbiting refreshment! 👅✨',
    happyMessage: 'Hop hop hooray! Swimming like a champion lilypad boss! 🌿🌊',
    goalMessage: 'CRAZZZY FROG CELEBRATION! The pond has never seen such glory! 🎆🐸',
    color: 'from-emerald-400 to-green-600',
  },
  {
    id: 'dino',
    name: 'Bubbles Rex',
    species: 'Hydro Dinosaur',
    avatar: '🦖',
    thirstyMessage: 'RAWR! Big dino tummy needs a giant splash of hydration! 🌋',
    sippingMessage: 'CHOMP-GULP! Dinosaurs LOVE crystal clean water! 🦕💎',
    happyMessage: 'Dino-power at 80%! Stomping with hydrated stompers! 🦶⚡️',
    goalMessage: 'TREMENDOUS T-REX ROAR! 100% daily goal conquered! 🦖🏆🎉',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'narwhal',
    name: 'Sparkle Horn',
    species: 'Ocean Narwhal',
    avatar: '🦄',
    thirstyMessage: 'My magic horn is losing its sparkle! Feed me waves! 🌊',
    sippingMessage: 'Splashy dash! Magic bubbles spreading in my tummy! 🌟🫧',
    happyMessage: 'Gliding through rainbow currents with super speed! 🌈🐳',
    goalMessage: 'EPIC RAINBOW WATER SHOWER! The ocean kingdom crowns you Champion! 👑🦄',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'penguin',
    name: 'Captain Pipsqueak',
    species: 'Arctic Penguin',
    avatar: '🐧',
    thirstyMessage: 'Brrr, my belly slide is out of water lubrication! ❄️',
    sippingMessage: 'Waddle waddle... CHUG CHUG! Crisp cold mountain water! 🧊',
    happyMessage: 'Belly sliding across the glaciers at supersonic speed! 🛷✨',
    goalMessage: 'IGLOO VICTORY DANCE! 100% goal crushed, high penguin flipper! 🪩🐧',
    color: 'from-cyan-300 to-teal-500',
  },
];
