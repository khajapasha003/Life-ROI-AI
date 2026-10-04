import { LogPreset } from '../types/roi';

export const SAMPLE_PRESETS: LogPreset[] = [
  {
    id: 'tech-freelancer',
    name: 'Tech Freelancer',
    currency: 'USD',
    description: 'Afternoon coffee shop run, skipped gym, impulse snack delivery',
    logText: `Morning:
- Woke up 8:15am, checked social media 40 min in bed.
- Cold brew & croissant at local cafe: $11.50
- Deep work coding: 3.5 hours uninterrupted.

Afternoon:
- DoorDash lunch (Poke bowl + delivery tip): $27.40
- Mid-day crash: scrolled TikTok & tech Reddit 1 hour.
- Afternoon iced vanilla matcha: $7.20

Evening:
- Skipped planned 30-min kettlebell workout (felt sluggish).
- Netflix binge: 2.5 hours.
- Late Amazon impulse buy: ergonomic mouse rest $24.00`,
  },
  {
    id: 'corporate-commuter',
    name: 'Corporate Commuter',
    currency: 'USD',
    description: 'Uber surge ride, cafeteria sandwich, 3pm energy drinks',
    logText: `7:30 AM: Missed express subway because couldn't find keys -> took Uber surge ride: $24.80.
8:30 AM: Venti mocha & oatmeal at Starbucks: $9.45.
10:00 AM - 1:00 PM: 3 back-to-back status meetings (mostly passive listening).
1:15 PM: Bought pre-made desk sandwich & soda at building lobby: $16.20.
3:30 PM: Energy slump -> grabbed Red Bull from vending machine: $4.50.
6:00 PM: Subway home ($2.90).
7:30 PM: Cooked pasta dinner at home ($4 cost). 45-min walk outside. 8 hours sleep planned.`,
  },
  {
    id: 'euro-resident',
    name: 'Berlin Hybrid Worker (€)',
    currency: 'EUR',
    description: 'Bakery treats, forgotten subscription, evening bike commute',
    logText: `08:00: Espresso & pistachio pastry at artisan bakery: €7.50
09:00 - 13:00: Focused remote client design sprints.
13:15: Forgot packed lunchbox in fridge, had to buy takeaway salad & smoothie: €14.80
16:00: Realized unnoticed recurring streaming app billed: €12.99
17:30: 45 min cycling along canal (free & energetic).
20:00: Cooked lentil curry with roommate, read 25 pages of book.`,
  },
  {
    id: 'india-pro',
    name: 'Bengaluru Techie (₹)',
    currency: 'INR',
    description: 'Swiggy quick orders, 4 chai breaks, cab instead of metro',
    logText: `Morning:
- Auto rickshaw surge fare to tech park: ₹220
- Filter coffee & idli at canteen: ₹85
- 4 hours sprint planning & bug triage.

Afternoon:
- Swiggy gourmet bowl order: ₹420
- 3 cigarette + chai breaks with colleagues (45 mins total idle): ₹140
- Took AC cab back home to avoid 15 min metro walk: ₹380

Evening:
- Walked 4,000 steps after dinner.
- Cooked dinner at home (dal + roti).
- Watched YouTube tutorials for 1 hour.`,
  },
  {
    id: 'london-hybrid',
    name: 'London Hybrid (£)',
    currency: 'GBP',
    description: 'Pret subscription, M&S meal deal, gym attendance',
    logText: `07:45: Tube travel to Zone 1: £3.40
08:20: Pret coffee + pastry: £6.20
09:00 - 12:30: Product strategy session & wireframing.
12:45: M&S meal deal + extra snack: £7.50
15:15: 35 minutes distracted reading news & gossip forums.
18:00: 45 min workout at local council gym (membership utilized).
19:30: Batch cooked quinoa stir fry at home (£3 portion). 7.5 hrs sleep.`,
  },
  {
    id: 'habit-titan-streak',
    name: 'Habit Titan (Score 91+)',
    currency: 'USD',
    description: 'Prepped meals, zero food delivery, 5-mile run, 4 hours deep work',
    logText: `Morning:
- 6:30 AM: 24oz water + electrolyte, zero phone screen time first 45 min.
- 7:00 AM: 5-mile zone-2 aerobic run + 15 min mobility stretches.
- 8:15 AM: Homebrewed aeropress coffee ($0.45) & pasture eggs with sourdough ($2.10).
- 9:00 AM - 1:00 PM: 4.0 hours uninterrupted deep architectural design work.

Afternoon:
- 1:15 PM: Pre-packed roasted chicken & quinoa meal prep bowl ($3.20).
- 2:00 PM - 5:00 PM: Team code reviews & customer demos completed with clear sprint progress.
- 3:30 PM: Green tea at desk, zero vending machine or coffee shop spend.

Evening:
- 6:00 PM: 30-min evening walk with podcast, zero ride-share apps.
- 7:30 PM: Homemade vegetable stir fry ($3.80).
- 9:30 PM: Read 30 pages of engineering book, screens off by 10:15 PM.`,
  },
];
